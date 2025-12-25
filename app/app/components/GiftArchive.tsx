'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { DiagnosticResult } from '@/lib/types';
import { getAllResults } from '@/lib/storage';

/**
 * ギフト画像のパス（3種類を循環使用）
 * 要件7.3: christmas_gift1_present.png、christmas_gift2_candy.png、christmas_gift3_socks.png
 */
const GIFT_IMAGES = [
  '/christmas_gift1_present.png',
  '/christmas_gift2_candy.png',
  '/christmas_gift3_socks.png',
];

/**
 * ギフトの配置座標（事前定義、視覚的なランダム性を持つ）
 * 要件7.4: 視覚的なランダム性を持つ事前定義された座標
 * ツリーの周りに配置されるように設計
 */
const GIFT_POSITIONS = [
  { x: -180, y: 180 },   // 左下
  { x: 180, y: 180 },    // 右下
  { x: -140, y: 120 },   // 左中
  { x: 140, y: 120 },    // 右中
  { x: -200, y: 60 },    // 左上
  { x: 200, y: 60 },     // 右上
  { x: 0, y: 200 },      // 中央下
  { x: -100, y: 160 },   // 左下寄り
  { x: 100, y: 160 },    // 右下寄り
];

interface GiftArchiveProps {
  /** ギフトクリック時のコールバック */
  onGiftClick?: (result: DiagnosticResult) => void;
}

/**
 * ギフトアーカイブ表示コンポーネント
 * 
 * 要件7.1-7.5, 8.4に対応：
 * - LocalStorageから結果を読み込み
 * - 3種類のギフト画像を循環使用
 * - 事前定義された座標でギフトを配置
 * - ギフトクリック時に結果を表示
 * - ホバーとクリックアニメーション
 */
export default function GiftArchive({ onGiftClick }: GiftArchiveProps) {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DiagnosticResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // LocalStorageから結果を読み込み（古い順 = 追加された順）
  useEffect(() => {
    const loadedResults = getAllResults('asc');
    setResults(loadedResults);
  }, []);

  /**
   * ギフト画像のインデックスを取得（結果IDに基づいて固定）
   * 要件7.3: 結果IDをハッシュ化して3で割った余りに基づいて決定
   * これにより、配列のインデックスが変わっても同じ結果には同じギフト画像が表示される
   */
  const getGiftImageIndex = (resultId: string): number => {
    // 簡易的なハッシュ関数（文字コードの合計）
    let hash = 0;
    for (let i = 0; i < resultId.length; i++) {
      hash += resultId.charCodeAt(i);
    }
    return hash % GIFT_IMAGES.length;
  };

  /**
   * ギフトクリックハンドラー
   */
  const handleGiftClick = (result: DiagnosticResult) => {
    setSelectedResult(result);
    setIsModalOpen(true);
    onGiftClick?.(result);
  };

  /**
   * モーダルを閉じる
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  /**
   * タイムスタンプをフォーマット
   */
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      {/* ギフトボックス表示 */}
      <div className="absolute inset-0 pointer-events-none">
        {results.map((result, index) => {
          const position = GIFT_POSITIONS[index] || GIFT_POSITIONS[index % GIFT_POSITIONS.length];
          const giftImage = GIFT_IMAGES[getGiftImageIndex(result.id)];
          
          return (
            <button
              key={result.id}
              onClick={() => handleGiftClick(result)}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 
                         transition-all duration-300 ease-out
                         hover:scale-125 hover:-translate-y-[calc(50%+8px)]
                         active:scale-110
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent
                         animate-gift-float"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                animationDelay: `${index * 0.2}s`,
              }}
              title={`${result.service.serviceName} - ${formatTimestamp(result.timestamp)}`}
              aria-label={`診断結果: ${result.service.serviceName}`}
            >
              <div className="relative w-20 h-20">
                <Image
                  src={giftImage}
                  alt={`Gift: ${result.service.serviceName}`}
                  width={80}
                  height={80}
                  className="drop-shadow-lg object-contain w-full h-full"
                />
                {/* ホバー時のキラキラエフェクト */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-yellow-300 text-xl animate-pulse">
                    ✨
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 結果表示モーダル */}
      {isModalOpen && selectedResult && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white/95 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-appear"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-4xl mb-2">🎁</div>
                  <h2 className="text-2xl font-bold text-white">
                    過去の診断結果
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {formatTimestamp(selectedResult.timestamp)}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white text-3xl font-light transition-colors"
                  aria-label="閉じる"
                >
                  ×
                </button>
              </div>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 space-y-6">
              {/* サービス情報 */}
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {selectedResult.service.category}
                </span>
                <h3 className="text-3xl font-bold text-gray-900">
                  {selectedResult.service.serviceName}
                </h3>
                <p className="text-xl text-red-600 font-bold">
                  {selectedResult.catchphrase}
                </p>
              </div>

              {/* AIレター */}
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>💌</span> メッセージ
                </h4>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedResult.aiLetter}
                  </p>
                </div>
              </div>

              {/* ネクストアクション */}
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>🚀</span> 次のステップ
                </h4>
                <div className="space-y-2">
                  {selectedResult.nextActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 border border-blue-200"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 text-sm flex-1">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 免責表示 */}
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-300">
                <p className="text-xs text-gray-600 text-center">
                  ⚠️ この結果はAIで生成されたものであり、その信憑性についてはご自身でお確かめください
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
