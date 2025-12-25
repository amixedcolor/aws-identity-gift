'use client';

import type { DiagnosticResult } from '@/lib/types';

interface ResultDisplayProps {
  /** 診断結果 */
  result: DiagnosticResult;
  /** 新しい診断を開始するコールバック */
  onStartNew?: () => void;
}

/**
 * 診断結果表示コンポーネント
 * 
 * 要件5.4, 5.5, 14.2に対応：
 * - サービス名、キャッチコピー、AIレター、ネクストアクション、タイムスタンプを表示
 * - AI生成コンテンツに関する免責表示を追加
 */
export default function ResultDisplay({ result, onStartNew }: ResultDisplayProps) {
  // タイムスタンプをフォーマット
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* メインカード */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* ヘッダー部分 - グラデーション背景 */}
        <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-8 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            あなたへのギフト
          </h2>
          <p className="text-white/90 text-lg">
            {formatTimestamp(result.timestamp)}
          </p>
        </div>

        {/* コンテンツ部分 */}
        <div className="p-8 md:p-12 space-y-8">
          {/* サービス情報 */}
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              {result.service.category}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900">
              {result.service.serviceName}
            </h3>
            <p className="text-2xl md:text-3xl text-red-600 font-bold">
              {result.catchphrase}
            </p>
          </div>

          {/* 区切り線 */}
          <div className="border-t-2 border-gray-200" />

          {/* AIレター */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💌</span>
              あなたへのメッセージ
            </h4>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {result.aiLetter}
              </p>
            </div>
          </div>

          {/* ネクストアクション */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              次のステップ
            </h4>
            <div className="space-y-3">
              {result.nextActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 flex-1 pt-1">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI生成コンテンツの免責表示 */}
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
            <p className="text-sm text-gray-600 text-center">
              ⚠️ この結果はAIで生成されたものであり、その信憑性についてはご自身でお確かめください
            </p>
          </div>

          {/* アクションボタン */}
          {onStartNew && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onStartNew}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-green-500 text-white text-lg font-bold hover:from-red-600 hover:to-green-600 transition-all shadow-lg transform hover:scale-105"
              >
                もう一度診断する
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 追加の説明 */}
      <div className="mt-6 text-center">
        <p className="text-white/80 text-sm">
          この結果はブラウザに保存され、トップページのツリーの周りにギフトとして表示されます
        </p>
      </div>
    </div>
  );
}
