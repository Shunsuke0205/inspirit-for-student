import webpush from "npm:web-push@^3.6.7";
import { createClient } from "npm:@supabase/supabase-js@^2.48.0";


Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
  const VAPID_SUBJECT = "mailto:shunsukehirata777@gmail.com"; 

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);


  try {
    // "YYYY-MM-DD" format in JST
    const now = new Date();
    const jstDateStr = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now).replace(/\//g, '-'); 

    // Fetch all applications in "reporting" status
    const { data: reportingApps, error: appsError } = await supabaseAdmin
      .from("scholarship_applications")
      .select("id, user_id") 
      .eq("status", "reporting")
      .eq("is_deleted", false);

    if (appsError) throw appsError;

    if (!reportingApps || reportingApps.length === 0) {
      return new Response(JSON.stringify({ message: "No reporting apps" }), { status: 200 });
    }

    // Fetch application IDs that have already been committed "today".
    const reportingAppIds = reportingApps.map(app => app.id);
    
    const { data: committedData, error: commitError } = await supabaseAdmin
      .from("student_commitments")
      .select("application_id")
      .in("application_id", reportingAppIds) // Filter only target applications (Can be ignored?)
      .eq("committed_date_jst", jstDateStr);

    if (commitError) throw commitError;

    // Create a set of "application IDs completed today"
    const committedAppIds = new Set(committedData?.map((c) => c.application_id));

    // Identify users who have applications that are not yet reported
    const pendingApps = reportingApps.filter(app => !committedAppIds.has(app.id));
    
    // Eliminate duplicate user_ids
    const remindUserIds = [...new Set(pendingApps.map(app => app.user_id))];


    if (remindUserIds.length === 0) {
      return new Response(JSON.stringify({ message: "All apps reported!" }), { status: 200 });
    }

    // Fetch notification recipients
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from("push_subscriptions")
      .select("*")
      .in("user_id", remindUserIds);

    if (subsError) throw subsError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No subscriptions" }), { status: 200 });
    }

    // Sending process
    const pushResults = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        };

        // It is also possible to count how many reports are pending for the user
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
          // 410/404: Subscription is no longer valid, delete it from DB
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabaseAdmin.from("push_subscriptions").delete().eq("user_id", sub.user_id);
          }
          throw error;
        }
      })
    );

    const successCount = pushResults.filter((r) => r.status === "fulfilled").length;

    return new Response(
      JSON.stringify({ success: true, sent_count: successCount }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  } catch (err: any) {
    console.error("❌ Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});