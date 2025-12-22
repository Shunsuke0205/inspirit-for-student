"use client";

import React, { useState } from "react";

export default function TroubleshootingGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-red-100 transition-colors duration-200 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        <span className="text-red-600 text-sm">
          {isExpanded ? '注意書きを閉じる' : '新規登録ができなかった方へ'}
        </span>
        <svg
          className={`w-4 h-4 text-red-600 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 開閉される注意書きのコンテンツ */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-red-50 rounded-lg border border-red-300 text-sm text-gray-700">
          <p className="font-bold text-red-600 mb-2">新規登録ができなかった方へ</p>
          <p>
            ご不便をおかけして申し訳ございません。
          </p>
          <p className="mt-2">
            システムからのメールが届かない場合、携帯キャリアのメールアドレス（docomo, au, softbankなど）によるフィルタリングが原因かもしれません。
            `noreply@mail.app.supabase.io` からのメールを受信するよう設定いただくか、GoogleアカウントのGmailアドレスなどをお試しくださいますでしょうか。
          </p>
          <p className="mt-2 font-bold">他に考えられる原因</p>
          <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
            <li>パスワードが8文字より短い</li>
            <li>入力したメールアドレスに誤りがある</li>
          </ul>
          <p className="mt-2">
            いろいろ試してもダメな場合は、お手数ですが、<a href="mailto:shunsukehirata777@gmail.com" className="text-indigo-600 underline hover:text-indigo-800">shunsukehirata777@gmail.com</a>までメールをくださいますか？
            <span role="img" aria-label="sorry"> 🙇‍♂️</span>
          </p>
        </div>
      )}
    </div>
  );
};