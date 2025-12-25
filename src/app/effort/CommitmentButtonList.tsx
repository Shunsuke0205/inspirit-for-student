import { createClient } from "@/utils/supabase/server";
import { CommitmentButton } from "./CommitmentButton";
import { redirect } from "next/navigation";


export const CommitmentButtonList = async ({ applications } : { applications: { id: string; item_name: string }[] }) => {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    redirect("/login");
  }

  const userId = userData.user.id;
  const { data: todayJstData, error: todayJstError } = await supabase
    .rpc("get_jst_commit_date");
  if (todayJstError || !todayJstData) {
    console.error("Error fetching JST committed date:", todayJstError?.message);
    return (
      <div>申し訳ございません。今日のコミットメント情報を取得できませんでした</div>
    );
  }

  const { data: todayCommitmentsData, error: todayCommitmentsError } = await supabase
    .from("student_commitments")
    .select("application_id, commitment_type")
    .eq("user_id", userId)
    .eq("committed_date_jst", todayJstData);

  if (todayCommitmentsError) {
    console.error("Error fetching today's commitments:", todayCommitmentsError);
    return <div>申し訳ございません。今日のコミットメント情報を取得できませんでした</div>;
  }


  const toCommitCount = applications.filter(app => !todayCommitmentsData?.some(c => c.application_id === app.id)).length;

  return (
    <div>
      <div className="mt-8 mb-6 p-5 bg-white shadow-xl rounded-xl border-t-4 border-indigo-500">
        <h2 className="text-xl font-bold text-gray-700">本日報告すべき商品（{toCommitCount} 件）</h2>
      </div>


      {applications.map((app, index) => {
        if (todayCommitmentsData?.some(c => c.application_id === app.id && c.commitment_type !== "potential_miss")) {
          return null; // Skip rendering this application
        }
        return (
          <div key={app.id} >
            <CommitmentButton 
              application={{
                id: app.id,
                itemName: app.item_name,
                commitmentType: todayCommitmentsData?.find(c => c.application_id === app.id)?.commitment_type || null
              }} 
              index={index}
            />
          </div>
        );
      })}
      
      {toCommitCount === 0 && (
        <p className="text-left text-gray-500 mt-8 px-5">
          素晴らしいですね！　
          <br className="md:hidden" />
          今日の報告はすべて完了しています。🙌🏻
        </p>
      )}
    </div>
  );
};
