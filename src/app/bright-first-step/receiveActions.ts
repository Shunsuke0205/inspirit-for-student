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

  try {
    const { error: rpcError } = await supabase
      .rpc("confirm_item_reception", { p_application_id: applicationId });

    if (rpcError) {
      console.error("Error calling confirm_item_reception:", rpcError);
      throw rpcError;
    }

    revalidatePath(`/bright-first-step/${applicationId}`);
    revalidatePath("/bright-first-step");
    return { success: true, error: null, message: "商品を受け取りました。今日から活動報告が始まります！" };
  } catch (error: unknown) {
    console.error("Server action error:", error);
    if (error instanceof Error) {
      return { success: false, error: "Database transaction failed: " + error.message, message: "データベース処理中にエラーが発生しました。" };
    } else {
      return { success: false, error: "Database transaction failed: Unknown error", message: "データベース処理中に不明なエラーが発生しました。" };
    }
  }
}