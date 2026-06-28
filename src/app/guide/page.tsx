import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-xl p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 leading-tight">
          欲しい物を買ってもらおう！
        </h1>
        <p className="text-gray-600">
          このアプリは、高校生の生活を応援する市民とみなさんをつなぐプラットフォームです。
          使い方とルールを理解して、さっそくスタートしましょう！
        </p>

        {/* ステップ1: 本人確認 */}
        <div className="space-y-2">
          <h2 className="mt-12 text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full mr-4">1</span>
            🔒 本人確認を完了する
          </h2>
          <p className="text-gray-700">
            高校生以外の人による投稿を防ぐために、全ての高校生に本人確認をお願いしています。
            確認が完了すると、みなさんの投稿には「認証マーク」がつき、欲しい物の投稿が可能になります。
          </p>
        </div>

        {/* ステップ2: 夢の投稿をする */}
        <div className="space-y-3">
          <h2 className="mt-12 text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full mr-4">2</span>
            🚀 欲しい物の投稿をしよう
          </h2>
          <p className="text-gray-700">
            自分が欲しい商品を、支援者に伝わるように具体的に投稿しましょう。
            商品が欲しい理由や、それを手に入れたあとの意気込みを詳しく書くのがポイントです！
          </p>
          <ul className="list-disc list-outside pl-6 text-gray-700">
            <li>投稿できるのは、本人確認が済んだ高校生のアカウントのみです。</li>
            <li>このアプリでは、「Amazonの欲しいものリスト機能」を通じて応援者があなたの欲しい物を購入します。</li>
            <ul className="list-[circle] list-outside pl-8">
              <li className="font-bold">
                <Link
                  href="/guide/amazon-wishlist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-normal"
                >
                  Amazon 欲しいものリストの作り方はこちら
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </li>
              <li>ご自身の本名・住所が公開されないよう注意してください！</li>
              <li>
                <div className="font-bold">住所の一番最後に「（あなたの本名）方」と記載してください。</div>
              </li>
            </ul>
            <li>「活動報告期間」を決めます。</li>
            <ul className="list-[circle] list-outside pl-8">
              <li>活動報告期間とは、商品が購入されて手元に届いた日から、この日数の間は「毎日欠かさず活動報告をします」という約束です。</li>
              <li>活動報告とはコミットメントボタンを押すことです。代理購入された商品を「今日触った」「今日は触っていない」ことをコミットメントボタンで報告します。</li>
              <li>みなさんのコミットメントの日付が購入者に見える仕組みになっています。ただし、どちらのボタンを押したのかは分かりません。</li>
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
            商品が贈られると、「毎日欠かさずコミットメントボタンを押下する」という義務が発生します。
            みなさんの活動が応援者の「買ってよかった！」という気持ちにつながります。
            また、継続的な活動報告はあなたの努力の証明となり、次の機会に購入されやすくなる信頼になります。
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
