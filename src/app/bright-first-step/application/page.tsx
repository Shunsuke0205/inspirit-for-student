"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";


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

// 投稿フォームコンポーネント
const ApplicationForm: React.FC<{ userId: string | null }> = ({ userId }) => {
  // const router = useRouter();

  // フォームの入力値を管理するstate
  const [formData, setFormData] = useState({
    title: "",
    item_name: "",
    item_description: "",
    item_price: 500,
    requested_amount: 500,
    enthusiasm: "",
    long_term_goal: "",
    amazon_wishlist_url: "",
    entire_report_period_days: 4,
    report_interval_days: 4,
  });

  // フォーム送信中の状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  // エラーメッセージ
  const [submitError, setSubmitError] = useState<string | null>(null);
  // 成功メッセージ
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // 許可するAmazonのドメインリスト
  const ALLOWED_AMAZON_DOMAINS = [
    "www.amazon.jp",
    "amazon.jp",
    "www.amazon.co.jp",
    "amazon.co.jp",
    "www.amazon.com",
    "amazon.com",
  ];

  // 入力フィールドの変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type !== "number") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      return;
    }

    const numValue = (value === "" ? "" : Number(value));
    if (name === "item_price" && numValue !== "") {
      const price = Number(numValue);
      const yenPerReportDay = 120;
      const suggestedReportDays = Math.floor(price / yenPerReportDay);

      setFormData((prevData) => ({
        ...prevData,
        "item_price": numValue,
        "entire_report_period_days": suggestedReportDays,
      }));

      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: numValue,
    }));
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!userId) {
        throw new Error("ユーザーIDが取得できません。ログインし直してください。");
      }

      const url = new URL(formData.amazon_wishlist_url);
      // ドメインが許可リストに含まれているかチェック
      if (!ALLOWED_AMAZON_DOMAINS.includes(url.hostname)) {
        throw new Error("申し訳ありませんが、AmazonのURLが正しくないようです。");
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("scholarship_applications")
        .insert({
          user_id: userId,
          title: formData.title,
          item_name: formData.item_name,
          item_description: formData.item_description,
          item_price: formData.item_price,
          requested_amount: formData.item_price, // requested_amountはitem_priceと同じ金額に固定
          enthusiasm: formData.enthusiasm,
          long_term_goal: formData.long_term_goal,
          amazon_wishlist_url: formData.amazon_wishlist_url,
          entire_report_period_days: formData.entire_report_period_days,
          report_interval_days: formData.entire_report_period_days,
          status: "active"
          // created_at, status, is_deleted, last_reported_at はDBのデフォルト値またはSupabaseで自動設定
          // last_reported_at は null で挿入される
        })
        .select(); // 挿入されたデータを返す

      if (error) {
        throw new Error(`投稿に失敗しました: ${error.message}`);
      }

      setSubmitSuccess("申請が正常に投稿されました！");
      // 成功後、任意のページにリダイレクト
      // router.push("/dashboard/my-applications"); // 例: マイ申請一覧ページなど
    } catch (err) {
      console.error("Application submission error:", err);
      setSubmitError("不明なエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">欲しい物品を投稿する</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">
          欲しい物品の簡潔な名称 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="item_name"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          rows={1}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div>
        <label htmlFor="item_description" className="block text-sm font-medium text-gray-700">
          欲しい物品の具体的な説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="item_description"
          name="item_description"
          value={formData.item_description}
          onChange={handleChange}
          rows={3}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="item_price" className="block text-sm font-medium text-gray-700">
            その物品の金額 (円) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="item_price"
            name="item_price"
            value={formData.item_price}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        {/* <div>
          <label htmlFor="requested_amount" className="block text-sm font-medium text-gray-700">
            希望する支援金額 (円) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="requested_amount"
            name="requested_amount"
            value={formData.requested_amount}
            onChange={handleChange}
            required
            min="1"
            max={formData.item_price} // item_price以下であるべき
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {formData.requested_amount > formData.item_price && (
            <p className="text-red-600 text-xs mt-1">希望支援額は物品の合計金額以下にしてください。</p>
          )}
        </div> */}
      </div>

      <div>
        <label htmlFor="enthusiasm" className="block text-sm font-medium text-gray-700">
          活動に対する意気込み（任意）{/* <span className="text-red-500">*</span> */}
        </label>
        <textarea
          id="enthusiasm"
          name="enthusiasm"
          value={formData.enthusiasm}
          onChange={handleChange}
          rows={4}
          // required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div>
        <label htmlFor="long_term_goal" className="block text-sm font-medium text-gray-700">
          長期的な夢や目標（任意）{/* <span className="text-red-500">*</span> */}
        </label>
        <textarea
          id="long_term_goal"
          name="long_term_goal"
          value={formData.long_term_goal}
          onChange={handleChange}
          rows={2}
          // required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="entire_report_period_days" className="block text-sm font-medium text-gray-700">
            物を受け取ってから活動報告を行う期間 <span className="text-red-500">*</span><br />
            （日数）
          </label>
          <input
            type="number"
            id="entire_report_period_days"
            name="entire_report_period_days"
            value={formData.entire_report_period_days}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            この期間中、毎日1回以上の活動報告を行う義務が発生します。
          </p>
        </div>
        {/* <div>
          <label htmlFor="report_interval_days" className="block text-sm font-medium text-gray-700">
            この物品に関係する活動の報告頻度 <span className="text-red-500">*</span><br />
            （X日以上怠ると警告がつきます）
          </label>
          <input
            type="number"
            id="report_interval_days"
            name="report_interval_days"
            value={formData.report_interval_days}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            この申請に関する活動報告をX日間に1回以上行うと宣言します。
          </p>
        </div> */}
      </div>

      <div>
        <label htmlFor="amazon_wishlist_url" className="block text-sm font-medium text-gray-700">
          Amazonの欲しい物リストURL<span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="amazon_wishlist_url"
          name="amazon_wishlist_url"
          value={formData.amazon_wishlist_url || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="例: https://www.amazon.jp/hz/wishlist/ls/..."
        />
      </div>

      {submitError && (
        <p className="text-red-600 text-sm mt-2">{submitError}</p>
      )}
      {submitSuccess && (
        <p className="text-green-600 text-sm mt-2">{submitSuccess}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isSubmitting ? "投稿中..." : "募集を投稿する"}
      </button>
    </form>
  );
};

const Page = () => {
  const { userId, isAuthorized, isLoading, error } = useAuthorization();

  if (isLoading) {
    return <div>認証状態を確認中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!isAuthorized) {
    // 認可されていない場合の表示（エラーメッセージはuseAuthorizationで既に表示済み）
    return (
      <div>
        <p>このページにアクセスする権限がありません。</p>
        {/* 必要であれば、ログインページへのリンクなどをここに表示 */}
      </div>
    );
  }

  return (
    <div>
      <Link href="/guide" target="_blank" rel="noopener noreferrer" className="mt-12 text-indigo-600 hover:text-indigo-800 transition-colors">
        <span className="text-sm">アプリの使い方ページはこちら</span>
      </Link>
      <ApplicationForm userId={userId} />
    </div>
  );
};

export default Page;
