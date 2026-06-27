import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

export default async function Page({
  params,
} : {
  params: Promise<{ post_id: string }>
}) {
  const { post_id } = await params;

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login");

  const { data: application, error } = await supabase
    .from("scholarship_applications")
    .select(`
      id,
      title,
      itemName:item_name,
      itemDescription:item_description,
      itemPrice:item_price,
      enthusiasm,
      longTermGoal:long_term_goal,
      amazonWishlistUrl:amazon_wishlist_url,
      status,
      entireReportPeriodDays:entire_report_period_days
    `)
    .eq("id", post_id)
    .eq("user_id", userData.user.id)
    .eq("is_deleted", false)
    .single();

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">申請が見つかりませんでした。</p>
        <Link href="/bright-first-step" className="mt-4 inline-block text-indigo-600 hover:underline">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/bright-first-step"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          申請一覧に戻る
        </Link>
        <Link
          href="/guide"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          アプリの使い方ページはこちら
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      <EditForm
        applicationId={application.id}
        initialData={{
          title: application.title ?? "",
          item_name: application.itemName ?? "",
          item_description: application.itemDescription ?? "",
          item_price: application.itemPrice,
          enthusiasm: application.enthusiasm ?? "",
          long_term_goal: application.longTermGoal ?? "",
          entire_report_period_days: application.entireReportPeriodDays,
          amazon_wishlist_url: application.amazonWishlistUrl ?? "",
        }}
        status={application.status}
      />
    </div>
  );
}
