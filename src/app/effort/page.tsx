import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import CommitmentButtonList from "./commitmentButtonList";
import { redirect } from "next/navigation";
import CommitmentCalendar from "./commitmentCalendar";

async function fetchCommitmentHistory(userId: string, days: number, todayJst: string) {
  const supabase = await createClient();

  const endDate = new Date(todayJst);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days); // 指定された日数前に設定
  endDate.setDate(endDate.getDate() + 1); // end_date_in は排他的なので1日追加
  const startDateStr = startDate.toISOString().substring(0, 10);
  const endDateStr = endDate.toISOString().substring(0, 10);

  const { data, error } = await supabase.rpc('get_daily_commitment_counts', {
    user_id_in: userId,
    start_date_in: startDateStr,
    end_date_in: endDateStr,
  });

  if (error) {
    console.error("Error fetching commit counts:", error.message);
    return new Map<string, number>();
  }

  type CommitCountRecord = {
    commit_date: string;
    commit_count: number;
  };
  return new Map<string, number>(data.map((item: CommitCountRecord) => [item.commit_date, item.commit_count]));
}

export default async function EffortPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("User not authenticated:", userError?.message);
    redirect("/login");
  }

  const userId = userData.user.id;

  const { data: jstDateData, error: jstDateError } = await supabase
    .rpc("get_jst_commit_date");
  if (jstDateError || !jstDateData) {
    console.error("Error fetching JST committed date:", jstDateError?.message);
    return new Map<string, number>();
  }

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

  const { data: reportingApplicationData, error: reportingApplicationError } = await supabase
    .from("scholarship_applications")
    .select("id, item_name")
    .eq("user_id", userId)
    .eq("status", "reporting");

  if (reportingApplicationError || !reportingApplicationData) {
    console.error("Error fetching reporting applications:", reportingApplicationError?.message);
  }

  // console.log("reportingApplicationData:", reportingApplicationData);
  
  if (reportingApplicationData && reportingApplicationData.length === 0) {
    console.log("No reporting applications found.");
  }

  const commitmentDateMap = await fetchCommitmentHistory(userId, 7 * 6, jstDateData);



  return (
    <div className="container mx-auto p-4 max-w-xl space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center">
        🔥 今日のコミットメント
      </h1>
      <p className="text-sm text-gray-600 text-center">
        報告義務のある商品について、今日の活動を記録しましょう。
      </p>

      {reportingApplicationData && reportingApplicationData.length > 0 && <CommitmentButtonList applications={reportingApplicationData} />}

      {/* Commitment Calendar */}
      <div className="p-5 bg-white shadow-xl rounded-xl space-y-4">
        <h2 className="text-xl font-bold text-gray-700">継続カレンダー</h2>
        <p className="text-xs text-gray-500">（直近6週間の活動実績）</p>
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <div className="w-3 h-3 bg-sky-400 rounded-sm"></div>
            <span className="text-xs text-gray-600">コミットメントあり</span>
          </div>
          {/* <div className="flex items-center gap-2 pt-2 flex-wrap">
            <div className="w-3 h-3 bg-yellow-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">ログインしたがコミットなし</span>
          </div> */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-400"></div>
            <span className="text-xs text-gray-600">なし</span>
          </div>
        </div>
        <CommitmentCalendar commitMap={commitmentDateMap} todayJst={jstDateData} />
      </div>
      
    </div>
  );
};
