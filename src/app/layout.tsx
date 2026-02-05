import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";


export const metadata: Metadata = {
  title: "Inspirit",
  description: "高校生の夢を応援する代理購入プラットフォーム",

  // iOS Safari / Home icon (Apple Web App Metadata)
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Inspirit',
  },

  icons: {
    icon: '/product_icon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, // iOS Home icon
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },

  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
