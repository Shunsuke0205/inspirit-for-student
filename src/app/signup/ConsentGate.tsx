"use client";

import { useState } from "react";
import { SignupButton } from "./SignupButton";

export default function ConsentGate() {
  const [isTermsOpened, setIsTermsOpened] = useState(false);
  const [isPrivacyOpened, setIsPrivacyOpened] = useState(false);

  const bothOpened = isTermsOpened && isPrivacyOpened;

  return (
    <>
      <div className="mt-8 pt-4 space-y-2">
        <p className="text-sm text-gray-600">利用規約とプライバシーポリシーを必ずご覧ください。</p>

        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsTermsOpened(true)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            利用規約
          </span>
          {isTermsOpened && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </a>

        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsPrivacyOpened(true)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            プライバシーポリシー
          </span>
          {isPrivacyOpened && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </a>
      </div>

      <p className="text-xs text-gray-500">
        アカウントを作成することで、利用規約およびプライバシーポリシーに同意したものとみなします。
      </p>


      <SignupButton canSubmit={bothOpened} />
    </>
  );
}
