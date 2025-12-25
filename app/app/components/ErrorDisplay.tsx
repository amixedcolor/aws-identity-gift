'use client';

import { useState, useEffect } from 'react';

interface ErrorDisplayProps {
  /** エラーメッセージ */
  message: string;
  /** エラータイプ */
  type?: 'error' | 'warning' | 'info';
  /** 再試行コールバック */
  onRetry?: () => void;
  /** 閉じるコールバック */
  onClose?: () => void;
  /** 自動で閉じるまでの時間（ミリ秒）、0で自動クローズ無効 */
  autoCloseMs?: number;
}

/**
 * エラー表示コンポーネント
 * 
 * 要件12.5に対応：
 * - 日本語でユーザーフレンドリーなエラーメッセージを提供
 */
export default function ErrorDisplay({
  message,
  type = 'error',
  onRetry,
  onClose,
  autoCloseMs = 0,
}: ErrorDisplayProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoCloseMs > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [autoCloseMs, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // タイプに応じたスタイル
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: '❌',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: '⚠️',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      icon: 'ℹ️',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl p-4 shadow-lg animate-fadeIn`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* アイコン */}
        <span className="text-2xl flex-shrink-0">{style.icon}</span>

        {/* メッセージ */}
        <div className="flex-1">
          <p className={`${style.text} font-medium`}>{message}</p>
        </div>

        {/* 閉じるボタン */}
        {onClose && (
          <button
            onClick={handleClose}
            className={`${style.text} hover:opacity-70 transition-opacity`}
            aria-label="閉じる"
          >
            ✕
          </button>
        )}
      </div>

      {/* 再試行ボタン */}
      {onRetry && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onRetry}
            className={`${style.buttonBg} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
          >
            再試行
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * トースト形式のエラー表示コンポーネント
 */
export function ErrorToast({
  message,
  type = 'error',
  onClose,
  autoCloseMs = 5000,
}: Omit<ErrorDisplayProps, 'onRetry'>) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoCloseMs > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 300);
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [autoCloseMs, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  // タイプに応じたスタイル
  const styles = {
    error: {
      bg: 'bg-red-600',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-600',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-600',
      icon: 'ℹ️',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        ${style.bg} text-white rounded-xl shadow-2xl
        px-6 py-4 max-w-md
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{style.icon}</span>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="hover:opacity-70 transition-opacity ml-2"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
