import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({
  params,
} : {
  params: Promise<{ user_id: string }>
}) {
  const { user_id } = await params;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/login");
  }

  if (userData.user.id !== user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">アクセス権限がありません。</p>
      </div>
    );
  }

  const { data: studentAuthData, error: studentAuthError } = await supabase
    .from("student_authorizations")
    .select("is_verified, is_banned")
    .eq("user_id", userData.user.id)
    .single();

  if (studentAuthError || !studentAuthData?.is_verified || studentAuthData.is_banned) {
    redirect('/');
  }

  return (
    <div>
      Activity ID: {user_id}
    </div>
  );
}