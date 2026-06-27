"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  message: string;
};

const ALLOWED_AMAZON_DOMAINS = [
  "www.amazon.jp",
  "amazon.jp",
  "www.amazon.co.jp",
  "amazon.co.jp",
  "www.amazon.com",
  "amazon.com",
];

export type ApplicationFormData = {
  title: string;
  item_name: string;
  item_description: string;
  item_price: number;
  enthusiasm: string;
  long_term_goal: string;
  entire_report_period_days: number;
  amazon_wishlist_url: string;
};

export async function updateApplication(
  applicationId: string,
  data: ApplicationFormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: "ログインが必要です。" };
  }

  let url: URL;
  try {
    url = new URL(data.amazon_wishlist_url);
  } catch {
    return { success: false, message: "申し訳ありません。URLの形式が正しくないようです。もう一度作成し直してください。" };
  }
  if (url.protocol !== "https:") {
    return { success: false, message: "申し訳ありません。URLの形式が正しくないようです。もう一度作成し直してください。" };
  }
  if (!ALLOWED_AMAZON_DOMAINS.includes(url.hostname)) {
    return { success: false, message: "申し訳ありません。URLの形式が正しくないようです。もう一度作成し直してください。" };
  }
  if (!url.pathname.includes("wishlist")) {
    return { success: false, message: "そのURLは欲しい物リストのURLではないようです。恐れ入りますが、もう一度作成し直してください" };
  }


  const { error } = await supabase
    .from("scholarship_applications")
    .update({
      title: data.title,
      item_name: data.item_name,
      item_description: data.item_description,
      item_price: data.item_price,
      requested_amount: data.item_price,
      enthusiasm: data.enthusiasm,
      long_term_goal: data.long_term_goal,
      entire_report_period_days: data.entire_report_period_days,
      report_interval_days: data.entire_report_period_days,
      amazon_wishlist_url: data.amazon_wishlist_url,
    })
    .eq("id", applicationId)
    .eq("user_id", userData.user.id)
    .eq("status", "active");

  if (error) {
    console.error("Error updating application:", error);
    return { success: false, message: "更新に失敗しました。しばらく時間をおいて再度お試しください。" };
  }

  revalidatePath(`/bright-first-step/${applicationId}`);
  revalidatePath("/bright-first-step");
  return { success: true, message: "申請内容を更新しました。" };
}

export async function deleteApplication(applicationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: "ログインが必要です。" };
  }

  const { error } = await supabase
    .from("scholarship_applications")
    .update({ is_deleted: true })
    .eq("id", applicationId)
    .eq("user_id", userData.user.id)
    .eq("status", "active");

  if (error) {
    console.error("Error deleting application:", error);
    return { success: false, message: "削除に失敗しました。しばらく時間をおいて再度お試しください。" };
  }

  revalidatePath("/bright-first-step");
  return { success: true, message: "申請を削除しました。" };
}
