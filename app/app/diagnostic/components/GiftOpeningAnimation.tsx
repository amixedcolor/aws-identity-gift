'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type AnimationStage = 'shake' | 'open' | 'reveal';

interface GiftOpeningAnimationProps {
  /** アニメーション完了時のコールバック */
  onComplete: () => void;
}

/**
 * ギフト開封アニメーションコンポーネント
 * 
 * 要件5.1, 5.2, 5.3に対応：
 * - 揺れるアニメーション
 * - 開封アニメーション（光のエフェクト）
 * - アニメーション完了後に結果を表示
 */
export default function GiftOpeningAnimation({ onComplete }: GiftOpeningAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>('shake');

  useEffect(() => {
    // 揺れるアニメーション: 1秒間
    const shakeTimer = setTimeout(() => {
      setStage('open');
    }, 1000);

    // 開封アニメーション: 2秒後に開始
    const openTimer = setTimeout(() => {
      setStage('reveal');
    }, 2000);

    // 結果表示: 3秒後に完了コールバックを呼び出し
    const revealTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(openTimer);
      clearTimeout(revealTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className={`gift-box-container ${stage}`}>
        {stage !== 'reveal' && (
          <div className="relative">
            <Image
              src="/christmas_gift1_present.png"
              alt="Gift Box"
              width={200}
              height={200}
              className="gift-box-image"
              priority
            />
            {stage === 'open' && (
              <div className="light-effect" />
            )}
          </div>
        )}
        {stage === 'reveal' && (
          <div className="reveal-message">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-2xl font-bold text-white">
              あなたへのギフトが届きました！
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .gift-box-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 揺れるアニメーション */
        .gift-box-container.shake .gift-box-image {
          animation: shake 0.5s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        /* 開封アニメーション */
        .gift-box-container.open .gift-box-image {
          animation: open 1s ease-out forwards;
        }

        @keyframes open {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        /* 光のエフェクト */
        .light-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(
            circle,
            rgba(255, 215, 0, 0.8) 0%,
            rgba(255, 215, 0, 0.4) 30%,
            rgba(255, 215, 0, 0) 70%
          );
          animation: lightPulse 1s ease-out forwards;
          pointer-events: none;
        }

        @keyframes lightPulse {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        /* 結果表示のフェードイン */
        .reveal-message {
          animation: fadeIn 1s ease-in forwards;
          text-align: center;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
