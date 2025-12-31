'use client';

import Image from 'next/image';
import SnowfallEffect from './components/SnowfallEffect';
import CreditFooter from './components/CreditFooter';
import GiftArchive from './components/GiftArchive';

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

        {/* Christmas Tree with Gift Archive */}
        <div className="relative mb-12">
          <Image
            src="/christmas_tree.png"
            alt="Christmas Tree"
            width={400}
            height={500}
            priority
            className="drop-shadow-2xl"
          />
          {/* Gift Archive - positioned around the tree */}
          <GiftArchive />
        </div>

        {/* Service Closed Notice */}
        <div className="px-12 py-4 bg-gray-600/80 text-white text-xl font-bold rounded-full shadow-2xl mb-4 cursor-not-allowed">
          サービス終了
        </div>

        {/* Closed Message */}
        <div className="max-w-2xl mx-auto mt-4 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-lg text-white text-center leading-relaxed mb-4">
            🎄 ご利用ありがとうございました 🎄
          </p>
          <p className="text-sm text-white/90 text-center leading-relaxed">
            本サービスは終了しました。新規の診断はできませんが、
            ツリーの周りに表示されているギフトをクリックすると、
            これまでの診断結果を引き続きご覧いただけます。
          </p>
        </div>

        {/* Original Disclaimer */}
        <div className="max-w-2xl mx-auto mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <p className="text-xs text-white/70 text-center leading-relaxed">
            すべてのデータはブラウザのLocalStorageにのみ保存されています。
          </p>
        </div>
      </div>

      {/* Credit Footer */}
      <CreditFooter />
    </div>
  );
}
