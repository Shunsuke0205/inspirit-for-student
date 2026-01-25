"use client";

import { createClient } from "@/lib/supabase/client";
import React, { useState, useEffect, FormEvent } from "react";

interface ReportingActivities {
  id: string; // UUID
  title: string | null;
  // 他のscholarship_applicationsカラムもここに追加
  status: string | null; // active, reporting, completed など
}

const useAuthorization = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error("User not logged in or error fetching user:", userError?.message || "User not found.");
        setError("ログインが必要です。");
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setUserId(userData.user.id);

      const { data: studentAuthData, error: studentAuthError } = await supabase
        .from("student_authorizations")
        .select("is_verified, is_banned")
        .eq("user_id", userData.user.id)
        .single();

      if (studentAuthError || !studentAuthData) {
        console.error("Error fetching student authorization data:", studentAuthError?.message);
        setError("ユーザーの情報が見つかりませんでした。");
        setIsAuthorized(false);
      } else if (!studentAuthData.is_verified) {
        console.error("User is not a verified student.");
        setError("本人確認が完了していないため、投稿していただくことができません。まずは本人確認を行ってください。");
        setIsAuthorized(false);
      } else if (studentAuthData.is_banned) {
        console.error("User is banned.");
        setError("アカウントが停止されています。投稿できません。");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuthorization();
  }, []);

  return { userId, isAuthorized, isLoading, error };
};



export const ActivityReportForm: React.FC<{ userId: string }> = ({ userId }) => {
  // const supabase = createClient(); // handleSubmit内でawait
  // const router = useRouter();

  const [reportText, setReportText] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]); // 選択されたapplication IDの配列
  const [availableActivities, setAvailableActivities] = useState<ReportingActivities[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(true);


  useEffect(() => {
    const fetchApplications = async () => {
      setIsApplicationsLoading(true);
      const supabaseClient = createClient();
      
      // ユーザーが支援を受けている申請（ステータスが 'reporting'）を取得
      const { data, error } = await supabaseClient
        .from("scholarship_applications")
        .select("id, title, status") // statusも取得して表示フィルターに使う
        .eq("user_id", userId)
        .eq("status", "reporting");

      if (error) {
        console.error("Error fetching applications:", error.message);
        setSubmitError("報告が必要な活動が存在しないか、活動の取得に失敗しました。");
        setAvailableActivities([]);
      } else {
        setAvailableActivities(data || []);
      }

      setIsApplicationsLoading(false);
    };

    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const handleApplicationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const appId = e.target.value;
    const isChecked = e.target.checked;

    setSelectedApplications((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, appId];
      } else {
        return prevSelected.filter((id) => id !== appId);
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!userId) {
        throw new Error("ユーザーIDが取得できません。ログインし直してください。");
      }
      if (reportText.trim().length === 0 || reportText.length > 140) {
        throw new Error("活動報告は140文字以内で入力してください。");
      }
      if (selectedApplications.length === 0) {
        throw new Error("少なくとも1つの活動を選択してください。");
      }

      const supabaseClient = createClient();

      const { error } = await supabaseClient
        .from("activity_reports")
        .insert({
          user_id: userId,
          report_text: reportText,
          related_application_ids: selectedApplications,
        });

      if (error) {
        throw new Error(`活動報告の投稿に失敗しました: ${error.message}`);
      }

      setSubmitSuccess("活動報告が正常に投稿されました！");
      setReportText("");
    } catch (err) {
      console.error("Activity report submission error:", err);
      setSubmitError("不明なエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">活動報告を投稿する</h2> */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">活動報告を投稿する</h1>

      <div>
        <label htmlFor="report_text" className="block text-sm font-medium text-gray-700">
          活動報告 (140字以内) <span className="text-red-500">*</span>
        </label>
        <textarea
          id="report_text"
          name="report_text"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          rows={4}
          maxLength={140}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">
          {reportText.length}/140 文字
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          関連する支援を選択 (複数選択可) <span className="text-red-500">*</span>
        </label>
        {isApplicationsLoading ? (
          <p>支援情報を読み込み中...</p>
        ) : availableActivities.length === 0 ? (
          <p className="text-gray-500">関連する支援が見つかりませんでした。</p>
        ) : (
          <div className="space-y-2">
            {availableActivities.map((app) => (
              <div key={app.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`app-${app.id}`}
                  value={app.id}
                  checked={selectedApplications.includes(app.id)}
                  onChange={handleApplicationSelect}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor={`app-${app.id}`} className="ml-2 text-sm text-gray-900">
                  {app.title}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {submitError && (
        <p className="text-red-600 text-sm mt-2">{submitError}</p>
      )}
      {submitSuccess && (
        <p className="text-green-600 text-sm mt-2">{submitSuccess}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isApplicationsLoading}
        className={`cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting || isApplicationsLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isSubmitting ? "投稿中..." : "活動報告を投稿する"}
      </button>
    </form>
  );
};

// ページのメインコンポーネント
const Page = () => {
  const { userId, isAuthorized, isLoading, error } = useAuthorization();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">認証状態を確認中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 p-4 rounded-lg shadow-md">
        <p className="text-lg text-red-700">{error}</p>
      </div>
    );
  }

  if (!isAuthorized || !userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50 p-4 rounded-lg shadow-md">
        <p className="text-lg text-yellow-700">このページにアクセスする権限がありません。</p>
        <p className="mt-2 text-gray-600">ログインしているか、本人確認が完了しているかご確認ください。</p>
      </div>
    );
  }

  return <ActivityReportForm userId={userId} />;
};

export default Page;