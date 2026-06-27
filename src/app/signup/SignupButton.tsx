"use client";

import { useFormStatus } from "react-dom";

export const SignupButton = ({
  canSubmit = false
} : { canSubmit?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={!canSubmit || pending}
      type="submit"
      className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out disabled:cursor-not-allowed disabled:bg-indigo-300"
    >
      {pending ? "すこしお待ちになってください..." : "新規登録"}
    </button>
  );
};
