'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { DiagnosticResult } from '@/lib/types';
import { logError, getUserMessage, normalizeError, isOnline, ERROR_MESSAGES } from '@/lib/errors';

interface GiftCardGeneratorProps {
  /** 診断結果 */
  result: DiagnosticResult;
  /** ユーザー名（オプション） */
  userName?: string;
  /** SNSシェアコールバック */
  onShare?: () => void;
}

/**
 * ギフトカード生成コンポーネント
 * 
 * 要件9.1, 9.6, 9.7, 13.2に対応：
 * - 診断結果表示時に自動的に画像生成を開始
 * - 生成中のローディング表示
 * - 生成完了後に画像を表示
 * - プレミア感を演出するメッセージとSNSシェアボタン
 * 
 * 要件9.4, 9.5に対応：
 * - Nova Canvas生成画像には文字情報を含めない
 * - サービス名、キャッチコピーをHTML/CSSで重ね合わせ
 */
export default function GiftCardGenerator({ result, userName, onShare }: GiftCardGeneratorProps) {
  const [giftCardImage, setGiftCardImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function generateCard() {
      // オフラインチェック
      if (!isOnline()) {
        setError(ERROR_MESSAGES.NETWORK_OFFLINE);
        setIsGenerating(false);
        return;
      }

      try {
        setIsGenerating(true);
        setError(null);

        // Amplify gift card functionを呼び出し
        const { generateClient } = await import('aws-amplify/data');
        const client = generateClient<import('@/amplify/data/resource').Schema>();

        const { data, errors } = await client.queries.giftCard({
          resultData: JSON.stringify(result),
          userName: userName || undefined,
        });

        if (errors || !data) {
          const errorMsg = errors?.[0]?.message || 'ギフトカード生成中にエラーが発生しました';
          logError('GiftCardGenerator.generateCard', new Error(errorMsg));
          throw new Error(data?.error || errorMsg);
        }

        if (data.error) {
          logError('GiftCardGenerator.generateCard', new Error(data.error));
          throw new Error(data.error);
        }

        if (!data.imageData) {
          throw new Error('ギフトカード画像が取得できませんでした');
        }

        setGiftCardImage(data.imageData);
      } catch (err) {
        // エラーを正規化してログ出力
        const normalizedError = normalizeError(err, 'GiftCardGenerator.generateCard');
        logError('GiftCardGenerator.generateCard', normalizedError);
        
        // ユーザー向けメッセージを設定
        setError(getUserMessage(err));
      } finally {
        setIsGenerating(false);
      }
    }

    generateCard();
  }, [result, userName]);

  // 画像をダウンロード（テキストオーバーレイ付き）
  const handleDownload = async () => {
    if (!giftCardImage) return;

    try {
      // Canvasで画像とテキストを合成
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        logError('GiftCardGenerator.handleDownload', new Error('Canvas context not available'));
        throw new Error('画像の生成に失敗しました');
      }

      // キャンバスサイズを設定
      canvas.width = 1280;
      canvas.height = 720;

      // 背景画像を読み込み
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
        img.src = `data:image/png;base64,${giftCardImage}`;
      });

      // 背景画像を描画
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 半透明オーバーレイ
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // テキストの影を設定
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // ユーザー名（オプション）
      if (userName) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${userName}さんへ`, canvas.width / 2, 100);
      }

      // ギフトアイコン（絵文字は描画できないのでスキップ）
      
      // サービス名
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const serviceName = result.service.serviceName;
      const maxWidth = canvas.width - 80; // 左右40pxのマージン
      
      // テキストが収まるフォントサイズを計算（180%に拡大: 72→130）
      let serviceNameFontSize = 130;
      ctx.font = `bold ${serviceNameFontSize}px sans-serif`;
      
      while (ctx.measureText(serviceName).width > maxWidth && serviceNameFontSize > 48) {
        serviceNameFontSize -= 5;
        ctx.font = `bold ${serviceNameFontSize}px sans-serif`;
      }
      
      ctx.fillText(serviceName, canvas.width / 2, canvas.height / 2 - 60);

      // キャッチコピー
      ctx.fillStyle = '#fbbf24'; // 金色
      
      const catchphrase = result.catchphrase;
      
      // テキストが収まるフォントサイズを計算（180%に拡大: 54→97）
      let catchphraseFontSize = 97;
      ctx.font = `bold ${catchphraseFontSize}px sans-serif`;
      
      while (ctx.measureText(catchphrase).width > maxWidth && catchphraseFontSize > 40) {
        catchphraseFontSize -= 4;
        ctx.font = `bold ${catchphraseFontSize}px sans-serif`;
      }
      
      ctx.fillText(catchphrase, canvas.width / 2, canvas.height / 2 + 100);

      // フッター
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '20px sans-serif';
      ctx.shadowBlur = 5;
      ctx.fillText('Your AWS Identity 2025', canvas.width / 2, canvas.height - 60);

      // コピーライト
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px sans-serif';
      ctx.shadowBlur = 5;
      ctx.fillText('© amixedcolor', canvas.width / 2, canvas.height - 30);

      // ダウンロード
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `aws-identity-gift-${result.id}.png`;
      link.click();
    } catch (err) {
      // エラーをログ出力
      logError('GiftCardGenerator.handleDownload', err);
      
      // フォールバック: 元の画像をダウンロード
      try {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${giftCardImage}`;
        link.download = `aws-identity-gift-${result.id}.png`;
        link.click();
      } catch (fallbackErr) {
        logError('GiftCardGenerator.handleDownload.fallback', fallbackErr);
        alert('画像のダウンロードに失敗しました');
      }
    }
  };

  // ローディング中
  if (isGenerating) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* スピナー */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-8 border-yellow-200 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                🎁
              </div>
            </div>

            {/* メッセージ */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                あなただけのギフトカードを生成しています...
              </h3>
              <p className="text-gray-600">
                AIが特別な画像を作成中です。少々お待ちください。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // エラー時
  if (error) {
    const handleRetry = () => {
      setError(null);
      setIsGenerating(true);
      // useEffectが再実行されるようにresultを変更せずに再試行
      // 実際には新しいuseEffectトリガーが必要なので、コンポーネントを再マウントする
      window.location.reload();
    };

    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-6xl">⚠️</div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-red-600">
                ギフトカード生成に失敗しました
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:from-red-600 hover:to-orange-600 transition-all"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 生成完了
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            ✨ あなただけのギフトカード ✨
          </h3>
        </div>

        {/* ギフトカード画像（テキストオーバーレイ付き） */}
        <div className="p-8">
          <div 
            ref={cardRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '1280/720' }}
          >
            {/* Nova Canvas生成画像（背景） */}
            <img
              src={`data:image/png;base64,${giftCardImage}`}
              alt="Your AWS Identity Gift Card Background"
              className="w-full h-full object-cover"
            />
            
            {/* テキストオーバーレイ（要件9.5: HTML/CSSで文字情報を重ね合わせ） */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-8">
              {/* ユーザー名（オプション） */}
              {userName && (
                <p className="text-white text-xl md:text-2xl font-bold mb-4 drop-shadow-lg">
                  {userName}さんへ
                </p>
              )}
              
              {/* ギフトアイコン */}
              <div className="text-6xl md:text-7xl mb-4">🎁</div>
              
              {/* サービス名（10%小さく: 6rem→5.4rem, 8vw→7.2vw） */}
              <h2 
                className="text-white font-bold mb-6 drop-shadow-lg px-4 leading-tight text-center"
                style={{
                  fontSize: 'clamp(1.8rem, 7.2vw, 5.4rem)',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {result.service.serviceName}
              </h2>
              
              {/* キャッチコピー（10%小さく: 4rem→3.6rem, 5vw→4.5vw） */}
              <p 
                className="text-yellow-400 font-bold drop-shadow-lg px-4 leading-tight text-center"
                style={{
                  fontSize: 'clamp(1.35rem, 4.5vw, 3.6rem)',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {result.catchphrase}
              </p>
              
              {/* フッター */}
              <div className="absolute bottom-6 text-center">
                <p className="text-white/80 text-sm md:text-base mb-1">
                  Your AWS Identity 2025
                </p>
                <p className="text-white/60 text-xs md:text-sm">
                  © amixedcolor
                </p>
              </div>
            </div>
          </div>

          {/* プレミア感を演出するメッセージ */}
          <div className="mt-8 space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
              <p className="text-center text-lg text-gray-800 leading-relaxed">
                <span className="font-bold text-orange-600">この画像は保存されておらず、今ここにしかないあなただけのものです。</span>
                <br />
                みんなに見せびらかしませんか？
              </p>
            </div>

            {/* SNSシェアボタン */}
            <div className="flex flex-col gap-4">
              {/* 画像保存ボタン（優先表示） */}
              <button
                onClick={handleDownload}
                className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">💾</span>
                <span>画像を保存する</span>
              </button>

              {/* シェアボタン */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onShare?.()}
                  className="flex-1 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Image
                    src="/logo-x.png"
                    alt="X"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span>Xでシェア</span>
                </button>
              </div>

              {/* シェア時の注意書き */}
              <p className="text-center text-sm text-gray-600">
                💡 画像を保存してから、シェア時に添付してください
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
