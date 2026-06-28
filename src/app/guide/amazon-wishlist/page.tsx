import Link from "next/link";
import React from "react";

function Step({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="text-2xl font-bold text-gray-800 flex items-center mt-12 mb-4">
      <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full mr-4 shrink-0">
        {number}
      </span>
      {title}
    </h2>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
      <span className="font-bold">⚠️ 注意：</span>{children}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
      <span className="font-bold">💡 ポイント：</span>{children}
    </div>
  );
}

export default function AmazonWishlistGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          使い方ガイドに戻る
        </Link>

        <h1 className="text-3xl font-extrabold text-center text-gray-900 leading-tight">
          安全なAmazon<br />欲しいものリストの作り方
        </h1>

        <p className="text-gray-600">
          このアプリでは、Amazonの「欲しいものリスト」機能を使って支援者があなたの物品を代理購入します。
          正しく設定すれば、<span className="font-bold text-gray-800">住所・本名などの個人情報を支援者に知らせることなく</span>、商品を受け取ることができます。
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          <p className="font-bold mb-1">🔒 Amazonの仕組みによる住所保護</p>
          <p>欲しいものリスト経由で購入された場合、Amazonは購入者に配送先住所を表示しません。支援者には「〇〇さんの住所に発送されます」とだけ表示され、具体的な住所は見えません。</p>
        </div>

        {/* STEP 1 */}
        <Step number={1} title="Amazonアカウントの名前をハンドルネームにする" />
        <p className="text-gray-700">
          欲しいものリストには、Amazonアカウントに設定された名前が表示されます。支援者にこの名前が見えるため、<span className="font-bold">本名ではなくハンドルネーム（ニックネーム）</span>を設定してください。
        </p>
        <ol className="list-decimal list-outside pl-6 text-gray-700 space-y-1">
          <li>Amazonにログインし、右上の「アカウント＆リスト」をクリック</li>
          <li>「アカウントサービス」→「氏名、Eメール、携帯電話番号、パスワード」を選択</li>
          <li>「名前」をハンドルネームに変更して保存</li>
        </ol>
        <Warning>本名・学校名・生年月日などの個人情報はハンドルネームに含めないでください。</Warning>

        {/* STEP 2 */}
        <Step number={2} title="欲しいものリストを作成する" />
        <ol className="list-decimal list-outside pl-6 text-gray-700 space-y-1">
          <li>「アカウント＆リスト」→「欲しいものリスト」を開く</li>
          <li>「リストを作成する」をクリック</li>
          <li>リスト名は「学習用」「活動支援用」など、個人情報を含まない名前にする</li>
          <li>欲しい商品を検索し、「欲しいものリストに追加」する</li>
        </ol>
        <Tip>支援者が商品を特定しやすいよう、欲しい商品は1つだけリストに入れることをおすすめします。</Tip>

        {/* STEP 3 */}
        <Step number={3} title="配送先住所を設定する" />
        <p className="text-gray-700">
          支援者が購入した商品をあなたの自宅に届けてもらうため、配送先住所をリストに登録します。
        </p>
        <ol className="list-decimal list-outside pl-6 text-gray-700 space-y-1">
          <li>欲しいものリストの「リスト設定」を開く</li>
          <li>「配送先住所」に自分の住所を入力する</li>
          <li>「受取人」の欄は<span className="font-bold">ハンドルネーム</span>のままにする</li>
        </ol>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
          <p className="font-bold">📦 「〇〇方」の記載について</p>
          <p>
            受取人名がハンドルネームになっているため、配送業者があなたの家に届けられない場合があります。
            それを防ぐため、<span className="font-bold">住所の末尾に「（あなたの本名）方」</span>と記載してください。
          </p>
          <p className="text-xs">例：東京都〇〇区〇〇1-2-3 △△マンション101 <span className="font-bold">田中太郎方</span></p>
          <p className="text-xs">「〇〇（ハンドルネーム）さんへの荷物を、田中太郎さんのところに届けてください」という意味になります。住所末尾の記載は購入者には表示されません。</p>
        </div>

        {/* STEP 4 */}
        <Step number={4} title="リストを「公開」に設定する" />
        <p className="text-gray-700">
          支援者がリストにアクセスできるよう、公開設定を変更します。
        </p>
        <ol className="list-decimal list-outside pl-6 text-gray-700 space-y-1">
          <li>欲しいものリストの「リスト設定」を開く</li>
          <li>「プライバシー設定」を<span className="font-bold">「公開」</span>に変更する</li>
          <li>「変更を保存する」をクリック</li>
        </ol>
        <Warning>「非公開」や「共有」のままでは支援者がリストにアクセスできません。必ず「公開」にしてください。</Warning>

        {/* STEP 5 */}
        <Step number={5} title="URLをコピーして投稿に貼り付ける" />
        <ol className="list-decimal list-outside pl-6 text-gray-700 space-y-1">
          <li>欲しいものリストを開いた状態で、ブラウザのアドレスバーのURLをコピーする</li>
          <li>このアプリの投稿フォームの「Amazon欲しいものリストURL」欄に貼り付ける</li>
        </ol>
        <Tip>URLに個人名が含まれていないか確認してから貼り付けてください。</Tip>

        {/* チェックリスト */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-2">
          <p className="font-bold text-gray-800 mb-3">✅ 投稿前の最終確認チェックリスト</p>
          {[
            "Amazonアカウントの名前がハンドルネームになっている",
            "リスト名に個人情報が含まれていない",
            "配送先住所の末尾に「（本名）方」を記載した",
            "リストの公開設定が「公開」になっている",
            "URLに本名・学校名などが含まれていない",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-indigo-600 mt-0.5">☐</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>ご不明な点はメールでお問い合わせください。</p>
        <p>メールアドレス: shunsukehirata777@gmail.com</p>
      </div>
    </div>
  );
}
