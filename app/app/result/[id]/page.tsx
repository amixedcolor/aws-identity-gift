'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { DiagnosticResult } from '@/lib/types';
import { getAllResults } from '@/lib/storage';
import ResultDisplay from '@/app/diagnostic/components/ResultDisplay';
import SnowfallEffect from '@/app/components/SnowfallEffect';
import CreditFooter from '@/app/components/CreditFooter';
import Link from 'next/link';

/**
 * 個別結果ページ
 * 
 * 要件9.9に対応：
 * - 生成済みギフトカード画像をOGP画像として使用
 * - SNSシェア時に適切なメタデータを提供
 */
export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    
    // LocalStorageから結果を取得
    const results = getAllResults();
    const foundResult = results.find((r: DiagnosticResult) => r.id === id);
    
    if (foundResult) {
      setResult(foundResult);
    }
    
    setLoading(false);
  }, [params.id]);

  const handleStartNew = () => {
    router.push('/diagnostic');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900">
        <SnowfallEffect />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-2xl">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900">
        <SnowfallEffect />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-white text-center space-y-6">
            <div className="text-6xl">🎁</div>
            <h1 className="text-3xl font-bold">結果が見つかりませんでした</h1>
            <p className="text-xl">この結果は削除されたか、存在しません</p>
            <Link
              href="/"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-green-500 text-white text-lg font-bold hover:from-red-600 hover:to-green-600 transition-all shadow-lg transform hover:scale-105"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900">
      {/* Snowfall Effect */}
      <SnowfallEffect />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-bold text-white cursor-pointer hover:text-yellow-300 transition-colors">
                Your AWS Identity 2025
              </h1>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
            >
              ← トップページ
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 pb-20">
          <ResultDisplay result={result} onStartNew={handleStartNew} />
        </div>

        {/* Credit Footer */}
        <CreditFooter />
      </div>
    </div>
  );
}
