'use client';

import { Component, type ReactNode } from 'react';
import { logError } from '@/lib/errors';

interface ErrorBoundaryProps {
  /** 子コンポーネント */
  children: ReactNode;
  /** フォールバックUI */
  fallback?: ReactNode;
  /** エラー発生時のコールバック */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * エラーバウンダリコンポーネント
 * 
 * Reactコンポーネントツリー内で発生したエラーをキャッチし、
 * フォールバックUIを表示します。
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // エラーをログ出力
    logError('ErrorBoundary', error);
    console.error('Component stack:', errorInfo.componentStack);

    // コールバックを呼び出し
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムフォールバックがあれば使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのフォールバックUI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 mb-6">
              予期しないエラーが発生しました。ページを再読み込みするか、もう一度お試しください。
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                再試行
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-all"
              >
                ページを再読み込み
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
