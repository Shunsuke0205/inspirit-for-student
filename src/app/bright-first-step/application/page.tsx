"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Application form component
const ApplicationForm: React.FC<{ userId: string | null }> = ({ userId }) => {
  const router = useRouter();

  // State to manage form input values
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

  // State to manage submission status 
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to manage error messages to display
  const [submitError, setSubmitError] = useState<string | null>(null);
  // State to manage success messages
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Allowed Amazon domains whitelist
  const ALLOWED_AMAZON_DOMAINS = [
    "www.amazon.jp",
    "amazon.jp",
    "www.amazon.co.jp",
    "amazon.co.jp",
    "www.amazon.com",
    "amazon.com",
  ];

  // Input field change handler
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

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!userId) {
        setSubmitError("ログイン情報が取得できませんでした。再度ログインしてください。");
        throw new Error("User ID could not be retrieved. Please log in again.");
      }

      let url: URL;
      try {
        url = new URL(formData.amazon_wishlist_url);
      } catch {
        setSubmitError("申し訳ありません。URLの形式が正しくないようです。もう一度作成し直してください。");
        return;
      }

      if (url.protocol !== "https:") {
        setSubmitError("申し訳ありません。URLの形式が正しくないようです。もう一度作成し直してください。");
        return;
      }
      if (!ALLOWED_AMAZON_DOMAINS.includes(url.hostname)) {
        setSubmitError("申し訳ありません。URLの形式が正しくないようです。もう一度作成し直してください。");
        return;
      }
      if (!url.pathname.includes("wishlist")) {
        setSubmitError("そのURLは欲しい物リストのURLではないようです。恐れ入りますが、もう一度作成し直してください。");
        return;
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
          requested_amount: formData.item_price,
          enthusiasm: formData.enthusiasm,
          long_term_goal: formData.long_term_goal,
          amazon_wishlist_url: formData.amazon_wishlist_url,
          entire_report_period_days: formData.entire_report_period_days,
          report_interval_days: formData.entire_report_period_days,
          status: "active"
          // created_at, status, is_deleted, last_reported_at are set to default values in the DB or automatically by Supabase
          // last_reported_at is null initially
        })
        .select();

      if (error) {
        console.error("Supabase insert error:", error.message);
        setSubmitError("申し訳ございません、投稿に失敗しました。しばらく時間をおいて再度お試しください。");
        return;
      }

      setSubmitSuccess("申請が正常に投稿されました！");
      router.push("/bright-first-step");
    } catch (err) {
      console.error("Application submission error:", err);
      setSubmitError("申し訳ございません、投稿に失敗しました。しばらく時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toLocaleDateString('ja-JP');
  const price = Number(formData.item_price) || 0;

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">欲しい物品を投稿する</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          投稿タイトル <span className="text-red-500">*</span>
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
            活動報告を行う日数 <span className="text-red-500">*</span><br />
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
            日数はご自身で自由に設定できます。<br />
            商品が届いたら、この日数だけ毎日アプリ上のボタンを押してください。
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

    {/* ===== Preview Section ===== */}
    <div className="max-w-2xl mx-auto mt-10 space-y-8 px-0 pb-16">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <h3 className="text-base font-bold text-gray-500 whitespace-nowrap">投稿プレビュー（支援者の見え方です！）</h3>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Small card (discover list) ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">一覧ページでの表示</p>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-sm">
          <div className="p-5">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800 leading-tight line-clamp-2">
                {formData.title || <span className="text-gray-300">タイトルなし</span>}
              </h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5 fill-blue-600 text-white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-black tracking-tighter whitespace-nowrap">本人確認済</span>
              </div>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-3 text-sm">
              {formData.item_description || <span className="text-gray-300">説明なし</span>}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-indigo-600">
                価格 {price.toLocaleString()} 円
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                応援受付中
              </span>
            </div>
            <div className="text-right text-gray-500 text-xs">
              投稿日: {today}
            </div>
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <p className="text-indigo-600 font-medium text-sm text-center">詳細を見る・支援する</p>
          </div>
        </div>
      </div>

      {/* ── Full detail (discover/[id]) ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">詳細ページでの表示</p>
        <div className="bg-gray-100 rounded-lg py-8 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
            {/* Date */}
            <div className="text-right text-gray-500 text-sm">
              <p>投稿日：{today}</p>
            </div>

            {/* Title + verified */}
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {formData.title || <span className="text-gray-300">タイトルなし</span>}
              </h1>
              <span className="ml-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shrink-0">
                <svg className="-ml-1 mr-1.5 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                本人確認済
              </span>
            </div>

            {/* Status badge */}
            <div>
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                応援受付中
              </span>
            </div>

            <div className="space-y-5 text-gray-700 leading-relaxed">
              {/* Item */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">🎓 欲しい物品</h2>
                <p className="whitespace-pre-wrap">商品名：「{formData.item_name || <span className="text-gray-300">名前なし</span>}」</p>
                <p className="whitespace-pre-wrap mt-1">{formData.item_description || <span className="text-gray-300">説明なし</span>}</p>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">物品の金額</p>
                <p className="text-2xl font-bold text-indigo-700">{price.toLocaleString()} 円</p>
              </div>

              {/* Enthusiasm */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">🔥 活動への意気込み</h2>
                <p className="whitespace-pre-wrap">{formData.enthusiasm || <span className="text-gray-400">記載なし</span>}</p>
              </div>

              {/* Long-term goal */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">🚀 長期的な夢や目標</h2>
                <p className="whitespace-pre-wrap">{formData.long_term_goal || <span className="text-gray-400">記載なし</span>}</p>
              </div>

              {/* Report period */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">報告期間</p>
                <p className="text-lg font-bold text-gray-800">{formData.entire_report_period_days} 日間</p>
              </div>

              {/* Amazon URL */}
              {formData.amazon_wishlist_url && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">🎁 Amazon 欲しい物リスト</h2>
                  <p className="text-sm text-gray-500">⚠️ 外部サイトである「Amazon 公式の欲しいものリストのページ」へ移動します。</p>
                  <span className="text-indigo-600 flex items-center mt-1 text-sm break-all">
                    {formData.amazon_wishlist_url}
                    <svg className="ml-1 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              )}
            </div>

            {/* Purchase button placeholder */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button disabled className="w-full py-3 px-4 bg-indigo-300 text-white font-bold rounded-md text-sm cursor-not-allowed">
                購入状態ボタン（プレビュー）
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
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
    return (
      <div>
        <p>このページにアクセスする権限がありません。</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4 flex justify-end">
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
      <ApplicationForm userId={userId} />
    </div>
  );
};

export default Page;
