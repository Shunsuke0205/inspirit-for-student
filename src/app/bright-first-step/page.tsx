import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type ScholarshipApplication = {
  id: string;
  title: string | null;
  status: string | null;
  createdAt: string;
  itemDescription: string | null;
  itemPrice: number;
  requestedAmount: number;
  enthusiasm: string | null;
  longTermGoal: string | null;
  amazonWishlistUrl: string | null;
  entireReportPeriodDays: number;
  reportIntervalDays: number;
};

async function MyApplications() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    redirect("/login");
  }

  const userId = userData.user?.id;

  const { data: studentAuthData, error: studentAuthError } = await supabase
    .from("student_authorizations")
    .select("is_verified, is_banned")
    .eq("user_id", userId)
    .single();

  if (studentAuthError || !studentAuthData) {
    console.error("Error fetching student authorization data:", studentAuthError);
    return (
      <div>
        アカウントの取得に失敗しました。申し訳ありませんが、ログインし直してください。
      </div>
    )
  } else if (!studentAuthData.is_verified) {
    console.error("User is not verified");
    return (
      <div>
        アカウントが認証されていません。お手数おかけしますが、学生情報を提出して認証を完了してください。
      </div>
    )
  } else if (studentAuthData.is_banned) {
    console.error("User is banned");
    return (
      <div>
        申し訳ありませんが、活動報告が不十分だったため、アカウントが停止されました。
      </div>
    )
  }
  
  const { data: applicationsData, error: applicationsError } = await supabase
    .from("scholarship_applications")
    .select(`
      id, 
      title, 
      status, 
      createdAt:created_at, 
      itemDescription:item_description, 
      itemPrice:item_price, 
      requestedAmount:requested_amount,
      enthusiasm,
      longTermGoal:long_term_goal,
      amazonWishlistUrl:amazon_wishlist_url,
      entireReportPeriodDays:entire_report_period_days,
      reportIntervalDays:report_interval_days
    `)
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (applicationsError) {
    console.error("Error fetching applications data:", applicationsError);
    return (
      <div>
        申し訳ありませんが、申請情報の取得に失敗しました。後ほど再度お試しください。
      </div>
    );
  }

  if (!applicationsData || applicationsData.length === 0) {
    return (
      <div>
        現在、申請はありません。新しい申請を作成してください。
      </div>
    );
  }

  // console.log("Fetched applications data:", applicationsData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">あなたの申請一覧</h2>
      {applicationsData.map((application : ScholarshipApplication) => (
        <Link key={application.id} href={`/bright-first-step/${application.id}`} className="block">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{application.title || "タイトルなし"}</h3>
            <p className="text-sm text-gray-500 mb-4">
              投稿日: {new Date(application.createdAt).toLocaleDateString("ja-JP")}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  application.status === 'active' ? 'bg-green-100 text-green-800' :
                  application.status === 'reporting' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {application.status === 'active' ? '募集受付中' :
                 application.status === 'reporting' ? '活動報告中' :
                 '状態不明'}
              </span>
              <span className="text-lg font-bold text-indigo-700">
                希望金額: {application.requestedAmount.toLocaleString()} 円
              </span>
            </div>
            <p className="text-gray-700 line-clamp-3">{application.itemDescription || "説明なし"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const Page = () => {
  return (
    <div>
      <MyApplications />
    </div>
  );
};

export default Page;
