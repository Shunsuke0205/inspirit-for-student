import Link from 'next/link';
import TroubleshootingGuide from './TroubleshootingGuide';
import { SignupComponent } from './SignupComponent';

export default function SignupPage() {
  return (
    <div className="h-screen flex items-start justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">新規登録</h1>

        <SignupComponent />

        <div className="mt-16">
          <TroubleshootingGuide />
        </div>

        {/* leads to login page */}
        <div className="mt-14">
          <p className="text-sm">
            すでにアカウントをつくっていらっしゃいますか？
          </p>
          <Link href="/login">
            <button className="mt-4 w-full py-2 px-4 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300 ease-in-out">
              ログインはこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
