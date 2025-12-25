'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';

type AnimationStage = 'shake' | 'open' | 'reveal';

interface GiftOpeningAnimationProps {
  /** アニメーション完了時のコールバック */
  onComplete: () => void;
  /** 診断結果（結果が届いたら開封アニメーションを開始） */
  result: any | null;
}

/**
 * ギフト開封アニメーションコンポーネント
 * 
 * 要件5.1, 5.2, 5.3に対応：
 * - 揺れるアニメーション（結果が届くまで継続）
 * - 開封アニメーション（光のエフェクト）
 * - アニメーション完了後に結果を表示
 */
export default function GiftOpeningAnimation({ onComplete, result }: GiftOpeningAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>('shake');
  const hasStartedOpening = useRef(false);

  // 結果が届いたら開封アニメーションを開始
  useEffect(() => {
    if (result && !hasStartedOpening.current) {
      hasStartedOpening.current = true;
      
      // 少し待ってから開封（揺れの途中で開くのを防ぐ）
      const openTimer = setTimeout(() => {
        setStage('open');
      }, 300);

      // 開封後、結果表示へ
      const revealTimer = setTimeout(() => {
        setStage('reveal');
      }, 1300);

      // 結果表示完了
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 2300);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(revealTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [result, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
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

      {/* ローディングメッセージ（揺れている間のみ表示） */}
      {stage === 'shake' && (
        <div className="loading-message">
          <p className="text-xl text-white/90 font-medium">
            AIがあなたにぴったりのAWSサービスを選んでいます...
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <div className="loading-dot" style={{ animationDelay: '0s' }} />
            <div className="loading-dot" style={{ animationDelay: '0.2s' }} />
            <div className="loading-dot" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      <style jsx>{`
        .gift-box-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 揺れるアニメーション（継続） */
        .gift-box-container.shake :global(.gift-box-image) {
          animation: shake 0.8s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg) translateY(-2px);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(3deg) translateY(-2px);
          }
        }

        /* 開封アニメーション */
        .gift-box-container.open :global(.gift-box-image) {
          animation: open 1s ease-out forwards;
        }

        @keyframes open {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.3) rotate(10deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) rotate(20deg);
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

        /* ローディングメッセージ */
        .loading-message {
          text-align: center;
          animation: fadeIn 0.5s ease-in;
        }

        /* ローディングドット */
        .loading-dot {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
