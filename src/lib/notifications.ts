"use server";

import { createClient } from "./supabase/server";

type PushSubscriptionJSON = {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
};

export async function saveSubscription(subscription: PushSubscriptionJSON) {
  const supabase = await createClient();
  
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error("User authentication error:", userError?.message);
    throw new Error("User not authenticated");
  }

  const { error: insertError } = await supabase
    .from("push_subscriptions")
    .upsert({
      user_id: userData.user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh || "",
      auth: subscription.keys?.auth || "",
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error("Failed to save subscription:", insertError.message);
    throw new Error("Failed to save subscription");
  }

  return { success: true };
}