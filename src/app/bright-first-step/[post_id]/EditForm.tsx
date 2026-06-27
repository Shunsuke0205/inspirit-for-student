"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplication, deleteApplication, type ApplicationFormData } from "./actions";

type Props = {
  applicationId: string;
  initialData: ApplicationFormData;
  status: string | null;
};

const EditForm: React.FC<Props> = ({ applicationId, initialData, status }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ApplicationFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const isEditable = status === "active";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type !== "number") {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    const numValue = value === "" ? 0 : Number(value);
    if (name === "item_price") {
      const suggestedReportDays = Math.floor(numValue / 120);
      setFormData(prev => ({ ...prev, item_price: numValue, entire_report_period_days: suggestedReportDays }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await updateApplication(applicationId, formData);
    if (result.success) {
      setSubmitSuccess(result.message);
    } else {
      setSubmitError(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("この申請を削除しますか？この操作は元に戻せません。")) return;
    setIsDeleting(true);
    setSubmitError(null);

    const result = await deleteApplication(applicationId);
    if (result.success) {
      router.push("/bright-first-step");
    } else {
      setSubmitError(result.message);
      setIsDeleting(false);
    }
  };

  const today = new Date().toLocaleDateString("ja-JP");
  const price = Number(formData.item_price) || 0;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">申請の詳細・編集</h2>

        {!isEditable && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            購入待ちの投稿のみ、投稿の削除と内容の編集ができます。
          </div>
        )}

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
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
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
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
          />
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
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

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
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="enthusiasm" className="block text-sm font-medium text-gray-700">
            活動に対する意気込み（任意）
          </label>
          <textarea
            id="enthusiasm"
            name="enthusiasm"
            value={formData.enthusiasm}
            onChange={handleChange}
            rows={4}
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="long_term_goal" className="block text-sm font-medium text-gray-700">
            長期的な夢や目標（任意）
          </label>
          <textarea
            id="long_term_goal"
            name="long_term_goal"
            value={formData.long_term_goal}
            onChange={handleChange}
            rows={2}
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

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
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            この期間中、毎日1回以上の活動報告を行う義務が発生します。
          </p>
        </div>

        <div>
          <label htmlFor="amazon_wishlist_url" className="block text-sm font-medium text-gray-700">
            Amazonの欲しい物リストURL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="amazon_wishlist_url"
            name="amazon_wishlist_url"
            value={formData.amazon_wishlist_url}
            onChange={handleChange}
            required
            disabled={!isEditable}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="例: https://www.amazon.jp/hz/wishlist/ls/..."
          />
        </div>

        {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
        {submitSuccess && <p className="text-green-600 text-sm">{submitSuccess}</p>}

        <div className="flex gap-3 pt-2">
          {isEditable && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white ${
                isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSubmitting ? "保存中..." : "変更を保存する"}
            </button>
          )}
          {isEditable && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={`py-2 px-4 rounded-md text-sm font-medium text-white ${
                isDeleting ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400`}
            >
              {isDeleting ? "削除中..." : "削除する"}
            </button>
          )}
        </div>
      </form>

      {/* ===== Preview Section ===== */}
      <div className="max-w-2xl mx-auto mt-10 space-y-8 px-4 pb-16">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <h3 className="text-base font-bold text-gray-500 whitespace-nowrap">投稿プレビュー（支援者にはこのように見えます）</h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Small card (discover list) */}
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

        {/* Full detail (discover/[id]) */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">詳細ページでの表示</p>
          <div className="bg-gray-100 rounded-lg py-8 px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
              <div className="text-right text-gray-500 text-sm">
                <p>投稿日：{today}</p>
              </div>

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

              <div>
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  応援受付中
                </span>
              </div>

              <div className="space-y-5 text-gray-700 leading-relaxed">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">🎓 欲しい物品</h2>
                  <p className="whitespace-pre-wrap">商品名：「{formData.item_name || <span className="text-gray-300">名前なし</span>}」</p>
                  <p className="whitespace-pre-wrap mt-1">{formData.item_description || <span className="text-gray-300">説明なし</span>}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">物品の金額</p>
                  <p className="text-2xl font-bold text-indigo-700">{price.toLocaleString()} 円</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">🔥 活動への意気込み</h2>
                  <p className="whitespace-pre-wrap">{formData.enthusiasm || <span className="text-gray-400">記載なし</span>}</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">🚀 長期的な夢や目標</h2>
                  <p className="whitespace-pre-wrap">{formData.long_term_goal || <span className="text-gray-400">記載なし</span>}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">報告期間</p>
                  <p className="text-lg font-bold text-gray-800">{formData.entire_report_period_days} 日間</p>
                </div>

                {formData.amazon_wishlist_url && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">🎁 Amazon 欲しい物リスト</h2>
                    <p className="text-sm text-gray-500">⚠️ 外部サイトとなる「Amazon 公式の欲しいものリストのページ」へ移動します</p>
                    <span className="text-indigo-600 flex items-center mt-1 text-sm break-all">
                      {formData.amazon_wishlist_url}
                      <svg className="ml-1 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-3 text-center">
                  ⚠️ Amazon で購入手続きを完了してから、この確定ボタンを押してください。
                </p>
                <div
                  className="w-full py-3 px-6 text-center text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out text-lg bg-green-600 hover:bg-green-700"
                >
                  Amazon 公式サイトで決済を完了しました
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditForm;
