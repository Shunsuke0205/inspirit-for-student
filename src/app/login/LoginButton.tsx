"use client";

import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <button
        disabled={pending}
        type="submit"
        className="
          w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out
          disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {pending ? "ログインしています..." : "ログイン"}
      </button>
    </div>
  );
}
