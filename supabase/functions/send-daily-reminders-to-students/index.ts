import webpush from "npm:web-push@^3.6.7";
import { createClient } from "npm:@supabase/supabase-js@^2.48.0";


Deno.serve(async (req) => {
  // Edge Functions に標準で用意されている環境変数を直接参照
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  // ユーザーが手動でセットした VAPID キー
  const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
  const VAPID_SUBJECT = "mailto:shunsukehirata777@gmail.com"; 

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  // リクエストごとにクライアントを生成（確実な方法）
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  console.log("🚀 Starting daily reminder job...");

  try {
    // 1. 今日（JST）の日付文字列を取得 (YYYY-MM-DD)
    const now = new Date();
    const jstDateStr = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now).replace(/\//g, '-'); 

    console.log(`📅 Target JST Date: ${jstDateStr}`);

    // 2. Reporting中のすべての「申請(Application)」を取得
    // user_id だけでなく id (application_id) も取得するのがポイント
    const { data: reportingApps, error: appsError } = await supabaseAdmin
      .from("scholarship_applications")
      .select("id, user_id") 
      .eq("status", "reporting")
      .eq("is_deleted", false);

    if (appsError) throw appsError;

    if (!reportingApps || reportingApps.length === 0) {
      return new Response(JSON.stringify({ message: "No reporting apps" }), { status: 200 });
    }

    // 3. すでに「今日」コミットされた「申請ID」を取得
    // student_commitments テーブルの application_id を見る
    const reportingAppIds = reportingApps.map(app => app.id);
    
    const { data: committedData, error: commitError } = await supabaseAdmin
      .from("student_commitments")
      .select("application_id")
      .in("application_id", reportingAppIds) // 対象の申請のみ検索
      .eq("committed_date_jst", jstDateStr);

    if (commitError) throw commitError;

    // 「今日完了済みの申請ID」のセットを作成
    const committedAppIds = new Set(committedData?.map((c) => c.application_id));

    // 4. 未報告の申請を持っているユーザーを特定
    // reportingApps の中から、committedAppIds に含まれていないものを探す
    const pendingApps = reportingApps.filter(app => !committedAppIds.has(app.id));
    
    // その申請の持ち主（user_id）をリストアップ（Setで重複排除）
    const remindUserIds = [...new Set(pendingApps.map(app => app.user_id))];

    console.log(`📊 Stats: Total Apps(${reportingApps.length}) - Done Apps(${committedAppIds.size}) = Pending Apps(${pendingApps.length})`);
    console.log(`👥 Users to remind: ${remindUserIds.length}`);

    if (remindUserIds.length === 0) {
      return new Response(JSON.stringify({ message: "All apps reported!" }), { status: 200 });
    }

    // 5. 通知先を取得
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from("push_subscriptions")
      .select("*")
      .in("user_id", remindUserIds);

    if (subsError) throw subsError;

    if (!subscriptions || subscriptions.length === 0) {
      console.log("⚠️ No subscriptions found for target users.");
      return new Response(JSON.stringify({ message: "No subscriptions" }), { status: 200 });
    }

    // 6. 送信処理
    const pushResults = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        };

        // 該当ユーザーがいくつ未報告か数えることも可能
        const userPendingCount = pendingApps.filter(a => a.user_id === sub.user_id).length;
        const message = userPendingCount > 1 
          ? `本日 ${userPendingCount} 件の報告がまだ完了していません。`
          : `本日の報告がまだ完了していません。`;

        const payload = JSON.stringify({
          count: 1, 
          message: message,
        });

        try {
          await webpush.sendNotification(pushConfig, payload);
          return sub.user_id;
        } catch (error: any) {
          // 410/404 は「もうこの宛先は無効」という確定エラーなので削除してOK
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`🗑 Removing invalid subscription for user: ${sub.user_id}`);
            await supabaseAdmin.from("push_subscriptions").delete().eq("user_id", sub.user_id);
          }
          throw error;
        }
      })
    );

    const successCount = pushResults.filter((r) => r.status === "fulfilled").length;
    console.log(`🎉 Notification sent to ${successCount} devices.`);

    return new Response(
      JSON.stringify({ success: true, sent_count: successCount }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  } catch (err: any) {
    console.error("❌ Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});