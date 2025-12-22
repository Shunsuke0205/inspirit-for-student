import { login } from "./actions";
import { LoginButton } from "./LoginButton";

export const LoginComponent = () => {
  return (
    <div>
      <form
        action={login}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <LoginButton />
      </form>
    </div>
  );
}
