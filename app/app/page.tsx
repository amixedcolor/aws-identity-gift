'use client';

import Image from 'next/image';
import Link from 'next/link';
import SnowfallEffect from './components/SnowfallEffect';
import CreditFooter from './components/CreditFooter';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900">
      {/* Snowfall Effect */}
      <SnowfallEffect />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Your AWS Identity 2025
          <br />
          <span className="text-2xl md:text-3xl text-yellow-300">
            〜あなたに贈る「代名詞」〜
          </span>
        </h1>

        {/* Christmas Tree */}
        <div className="relative mb-12">
          <Image
            src="/christmas_tree.png"
            alt="Christmas Tree"
            width={400}
            height={500}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        {/* Start Button */}
        <Link
          href="/diagnostic"
          className="px-12 py-4 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 mb-8"
        >
          診断を始める
        </Link>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-sm text-white/90 text-center leading-relaxed">
            本サービスはユーザー識別情報を収集せず、すべてのデータはブラウザのLocalStorageにのみ保存されます。
          </p>
        </div>
      </div>

      {/* Credit Footer */}
      <CreditFooter />
    </div>
  );
}
