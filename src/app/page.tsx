import Link from "next/link";
import React from "react";

/**
 * 学生アプリのホーム画面コンポーネント。
 * 主な機能ページへのナビゲーションリンクを提供します。
 */
const StudentHomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {/* ページのメインタイトル */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight drop-shadow-sm">
        高校生のクラウドファンディング
        <br />
      </h1>

      {/* ページの簡単な説明 */}
      <p className="text-md sm:text-lg text-gray-700 mb-12 max-w-3xl">
        自分の欲しい物の投稿管理や、日々の活動報告ができます。<br />
        さあ、やりたかった活動を地道に進めて、夢や目標を叶えましょう！
      </p>

      {/* 主要機能へのナビゲーションカード */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-2xl px-4">
        {/* 活動報告の投稿ページへのリンクカード */}
        <Link href="/effort" className="block">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 sm:p-8 flex flex-col items-center border-b-4 border-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-12 h-12 text-emerald-600 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">活動報告を行う</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              あなたの活動が応援者の「買ってよかった」という気持ちにつながります。
              また、継続的な活動報告はあなたの努力の証明となり、次の代理購入のための信頼になります。
            </p>
          </div>
        </Link>

        {/* 夢の投稿ページへのリンクカード */}
        <Link href="/bright-first-step/application" className="block">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 sm:p-8 flex flex-col items-center border-b-4 border-indigo-500">
            <svg className="w-12 h-12 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 14V18.75C18 19.3467 17.7629 19.919 17.341 20.341C16.919 20.7629 16.3467 21 15.75 21H5.25C4.65326 21 4.08097 20.7629 3.65901 20.341C3.23705 19.919 3 19.3467 3 18.75V8.25C3 7.65326 3.23705 7.08097 3.65901 6.65901C4.08097 6.23705 4.65326 6 5.25 6H10" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.9653 3.84659L19.3577 2.45334C19.648 2.16307 20.0417 2 20.4522 2C20.8627 2 21.2564 2.16307 21.5467 2.45334C21.8369 2.74361 22 3.1373 22 3.5478C22 3.9583 21.8369 4.35199 21.5467 4.64226L12.7819 13.407C12.3455 13.8431 11.8074 14.1637 11.2162 14.3397L9 15L9.66031 12.7838C9.83634 12.1926 10.1569 11.6545 10.593 11.2181L17.9653 3.84659ZM17.9653 3.84659L20.1427 6.02395" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">「今欲しい物」を投稿する</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              自分の活動に必要な物品を、Amazon欲しいものリストとともに投稿できます。
            </p>
          </div>
        </Link>

        {/* 自分の夢の投稿一覧ページへのリンクカード */}
        <Link href="/bright-first-step" className="block">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 sm:p-8 flex flex-col items-center border-b-4 border-purple-500">
            <svg className="w-12 h-12 text-purple-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">自分の投稿一覧</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              自分の「ほしい物品の投稿」を確認・管理できます。
            </p>
          </div>
        </Link>

        {/* 活動報告の一覧ページへのリンクカード */}
        {/* <Link href="/activity-report" className="block">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 sm:p-8 flex flex-col items-center border-b-4 border-sky-500">
            <svg className="w-12 h-12 text-sky-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2"></path>
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">日記一覧</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              これまでに投稿した日記の履歴を確認できます。
            </p>
          </div>
        </Link> */}
      </div>

      <Link href="/guide" target="_blank" rel="noopener noreferrer" className="mt-12 text-indigo-600 hover:text-indigo-800 transition-colors">
        <span className="text-sm">アプリの使い方ページはこちら</span>
      </Link>
      
    </div>
  );
};

export default StudentHomePage;
