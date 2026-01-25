import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ActivityReportForm } from "./post/page";

// 活動報告の型定義
type ActivityReport = {
  reportText: string;
  relatedApplicationIds: string[]; // UUID[]
  relatedApplicationsInfo: RelatedApplicationInfo[];
  createdAt: string;
};

type RawRpcActivityReport = {
  report_text: string;
  created_at: string;
  related_application_ids: string[];
  related_applications_info: RelatedApplicationInfo[];
};

type RelatedApplicationInfo = {
  id: string;
  title: string | null;
};

export default async function MyActivityReportsPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("User not authenticated:", userError?.message);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">認証が必要です</h1>
          <p className="text-gray-700">まずはログインをお願いいたします。</p>
          <Link href="/login" className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md">
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  const userId = userData.user?.id;

  {
    const { data: studentAuthData, error: studentAuthError } = await supabase
      .from("student_authorizations")
      .select("is_verified, is_banned")
      .eq("user_id", userId)
      .single();

    if (studentAuthError) {
      console.error("Error fetching student authorization data:", studentAuthError?.message);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">アカウントの取得に失敗しました。</h1>
            <p className="text-gray-700">申し訳ありませんが、ログインし直してください。</p>
          </div>
        </div>
      );
    } else if (!studentAuthData?.is_verified) {
      console.error("User is not verified");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">アカウントが認証されていません。</h1>
            <p className="text-gray-700">お手数おかけしますが、学生情報を提出して認証を完了してください。</p>
            <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              ホームに戻る
            </Link>
          </div>
        </div>
      );
    } else if (studentAuthData.is_banned) {
      console.error("User is banned");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">アカウントが停止されています。</h1>
            <p className="text-gray-700">申し訳ありませんが、活動報告が不十分だったため、アカウントが停止されています。</p>
            <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              ホームに戻る
            </Link>
          </div>
        </div>
      );
    }   
  }

  const { data: rawReportsData, error: reportsError } = await supabase
    .rpc('get_user_activity_reports_with_applications', { p_user_id: userId });

  if (reportsError || !rawReportsData) {
    console.error("Error fetching activity reports:", reportsError?.message);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">活動報告の取得に失敗しました</h1>
          <p className="text-gray-600">データの読み込み中にエラーが発生しました。時間をおいて再度お試しください。</p>
        </div>
      </div>
    );
  }

  const reportsData: ActivityReport[] = rawReportsData.map((report: RawRpcActivityReport) => ({
    reportText: report.report_text,
    relatedApplicationIds: report.related_application_ids,
    createdAt: report.created_at,
    relatedApplicationsInfo: report.related_applications_info
  }));

  return (
    <div className="container mx-auto max-w-xl p-4">
      {userId !== undefined && (
        <ActivityReportForm userId={userId} />
      )}
      <h1 className="mt-20 text-3xl font-bold text-gray-800 mb-8 text-center">あなたの活動報告一覧</h1>
      {reportsData.length === 0 ? (
        <div className="text-center text-gray-500 text-xl mt-10 p-6 bg-gray-50 rounded-lg shadow-sm">
          <p>まだ活動報告がありません。</p>
          <p className="mt-2 text-base">日々の活動を記録してみましょう！</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reportsData.map((report) => (
            <div
              key={report.createdAt}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-500">
                  投稿日: {new Date(report.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{report.reportText}</p>

              {report.relatedApplicationIds && 
                report.relatedApplicationIds.length > 0 && 
                report.relatedApplicationsInfo && 
                (<div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-1">関連する応援:</p>
                  <div className="flex flex-wrap gap-2">
                    {report.relatedApplicationsInfo.map((info, index) => {
                      return (
                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition cursor-pointer">
                          {info.title || "タイトルなし"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
