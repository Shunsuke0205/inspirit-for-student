import Link from 'next/link';
import { LoginComponent } from './LoginComponent';

export default function LoginPage() {
  return (
    <div className="h-screen pt-4 flex items-start justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">ログイン</h1>
        
        <LoginComponent />

        {/* leads to signup page */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？
            <br />
            メールアドレスを使って、1 分ほどでアカウントを作成できます。
          </p>
          <Link href="/signup">
            <button className="mt-4 w-full py-2 px-4 border border-indigo-600 text-indigo-700 font-light rounded-lg hover:bg-indigo-50 transition duration-300 ease-in-out">
              新規登録はこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
