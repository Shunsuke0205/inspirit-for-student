"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";



type ReceiveResult = {
  success: boolean;
  error: string | null;
  message: string | null;
}


export async function confirmReception(applicationId: string) : Promise<ReceiveResult> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "User not authenticated", message: null };
  }

  const studentUserId = userData.user.id;
  const now = new Date().toISOString();

  try {
    const { error: contributionUpdateError } = await supabase
      .from("supporter_contributions")
      .update({
        transaction_status: "received",
        received_at: now,
      })
      .eq("application_id", applicationId)
      .eq("transaction_status", "pending");

    if (contributionUpdateError) {
      console.error("Error updating supporter_contributions:", contributionUpdateError);
      throw contributionUpdateError;
    }

    const { error: applicationUpdateError } = await supabase
      .from("scholarship_applications")
      .update({
        status: "reporting",
        report_started_at: now,
      })
      .eq("id", applicationId)
      .eq("user_id", studentUserId)
      .eq("status", "pending");

    if (applicationUpdateError) {
      console.error("Error updating scholarship_applications:", applicationUpdateError);
      throw applicationUpdateError;
    }

    const { error: dummyUpdateError } = await supabase
      .from("sholarship_applications")
      .update({ status: "reporting" })
      .eq("user_id", studentUserId)
      .eq("is_dairy_report_app", true)
    
    if (dummyUpdateError) {
      console.error("Error updating dummy scholarship_applications:", dummyUpdateError);
      // Not returning here since this is a non-critical operation
    }

    revalidatePath(`/bright-first-step/${applicationId}`);
    revalidatePath("/bright-first-step");
    return { success: true, error: null, message: "商品を受け取りました。活動報告が今日から義務付けられます。" };
  } catch (error: unknown) {
    console.error("Server action error:", error);
    if (error instanceof Error) {
      return { success: false, error: "Database transaction failed: " + error.message, message: "データベース処理中にエラーが発生しました。" };
    } else {
      return { success: false, error: "Database transaction failed: Unknown error", message: "データベース処理中に不明なエラーが発生しました。" };
    }
  }
}