import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-4">
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-800 transition-colors">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-gray-800 transition-colors">
            プライバシーポリシー
          </Link>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Inspirit. All rights reserved.</p>
      </div>
    </footer>
  );
}
