import Link from "next/link";
import React from "react";

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-xl p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 leading-tight">
          未来への一歩を踏み出そう！
        </h1>
        <p className="text-gray-600">
          このアプリは、あなたの夢を応援する市民とあなたをつなぐプラットフォームです。
          使い方とルールを理解して、さっそくスタートしましょう！
        </p>

        {/* ステップ1: 本人確認 */}
        <div className="space-y-2">
          <h2 className="mt-12 text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full mr-4">1</span>
            🔒 本人確認を完了する
          </h2>
          <p className="text-gray-700">
            安全なプラットフォームを保つため、全ての高校生に本人確認をお願いしています。
            確認が完了すると、あなたの投稿には「認証マーク」がつき、欲しい物の投稿が可能になります。
          </p>
        </div>

        {/* ステップ2: 夢の投稿をする */}
        <div className="space-y-3">
          <h2 className="mt-12 text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full mr-4">2</span>
            🚀 欲しい物の投稿をしよう
          </h2>
          <p className="text-gray-700">
            あなたの欲しい物品を、支援者に伝わるように具体的に投稿しましょう。
            希望する物品の金額や、それを手に入れたあとの活動への意気込みを詳しく書くのがポイントです。
          </p>
          <ul className="list-disc list-outside pl-6 text-gray-700">
            <li>投稿できるのは、本人確認が済んだ高校生のアカウントのみです。</li>
            <li>このアプリでは、「Amazonの欲しいものリスト機能」を通じて応援者があなたの欲しい物を代理購入します。</li>
            <ul className="list-[circle] list-outside pl-8">
              <li className="font-bold">「Amazon　欲しいものリスト　匿名　作り方」などとネット検索をして、AmazonのURLを作ってください。</li>
              <li>このとき、自分の本名が公開されないよう十分注意してください！</li>
              <li>
                <div className="font-bold">住所の一番最後に「（あなたの本名）方」と記載してください。</div>
                「（あなたの本名）さんのところに届くようにお願いします」という意味です。購入者に本名を知られないよう名前のところをハンドルネームにするため、この記載がないと配送業者さんが商品を届けられません。</li>
            </ul>
            <li>「活動報告期間」を決めます。</li>
            <ul className="list-[circle] list-outside pl-8">
              <li>活動報告期間とは、物品を代理購入された日から、この日数の間は「毎日欠かさず活動報告をする」という約束です。</li>
              <li>活動報告とはコミットメントボタンを押すことです。その日にその代理購入された商品を「触った」「触っていない」ことをコミットメントボタンで報告します。</li>
              <li>みなさんのコミットメントは購入者が見える仕組みになっています。</li>
            </ul>
          </ul>
          <Link href="/bright-first-step/application" target="_blank" rel="noopener noreferrer">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition cursor-pointer">
              新しい投稿を作成する
            </button>
          </Link>
        </div>

        {/* ステップ3: 活動報告の義務 */}
        <div className="space-y-3">
          <h2 className="mt-12 text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full mr-4">3</span>
            ✅ 活動報告を続けよう
          </h2>
          <p className="text-gray-700">
            物が贈られると、「毎日欠かさず、1つ以上のコミットメントボタンを押下する」義務が発生します。
            あなたの活動が応援者の「買ってよかった」という気持ちにつながります。
            また、継続的な活動報告はあなたの努力の証明となり、次の代理購入のための信頼になります。
          </p>
          <Link href="/activity-report/post" target="_blank" rel="noopener noreferrer">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition cursor-pointer">
              活動報告をする
            </button>
          </Link>
        </div>
      </div>
      
      {/* 警告と強制退会のルール */}

      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>ご不明な点はメールでお問い合わせください。</p>
        <p>メールアドレス: shunsukehirata777@gmail.com</p>
      </div>
    </div>
  );
};
