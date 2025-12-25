import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConfigureAmplify from "./ConfigureAmplify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your AWS Identity 2025 〜あなたに贈る「代名詞」〜",
  description: "あなたの技術的アイデンティティを表すAWSサービスを診断・推薦するクリスマス特別企画",
  openGraph: {
    title: "Your AWS Identity 2025 〜あなたに贈る「代名詞」〜",
    description: "あなたの技術的アイデンティティを表すAWSサービスを診断・推薦するクリスマス特別企画",
    images: [
      {
        url: "/app-ogp.png",
        width: 1200,
        height: 630,
        alt: "Your AWS Identity 2025",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your AWS Identity 2025 〜あなたに贈る「代名詞」〜",
    description: "あなたの技術的アイデンティティを表すAWSサービスを診断・推薦するクリスマス特別企画",
    images: ["/app-ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigureAmplify />
        {children}
      </body>
    </html>
  );
}
