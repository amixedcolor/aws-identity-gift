/**
 * エラーハンドリングユーティリティ
 * 
 * 要件12.1-12.5に対応：
 * - Bedrock API呼び出しエラー
 * - LocalStorageエラー
 * - ネットワークエラー
 * - 日本語エラーメッセージ
 * - コンソールログ出力
 */

/**
 * アプリケーションエラーの基底クラス
 */
export class AppError extends Error {
  /** エラーコード */
  readonly code: string;
  /** ユーザー向けメッセージ（日本語） */
  readonly userMessage: string;
  /** 元のエラー */
  readonly originalError?: unknown;

  constructor(code: string, userMessage: string, originalError?: unknown) {
    super(userMessage);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
    this.originalError = originalError;
  }
}

/**
 * Bedrock API関連エラー
 */
export class BedrockError extends AppError {
  constructor(userMessage: string, originalError?: unknown) {
    super('BEDROCK_ERROR', userMessage, originalError);
    this.name = 'BedrockError';
  }
}

/**
 * LocalStorage関連エラー
 */
export class StorageError extends AppError {
  constructor(userMessage: string, originalError?: unknown) {
    super('STORAGE_ERROR', userMessage, originalError);
    this.name = 'StorageError';
  }
}

/**
 * ネットワーク関連エラー
 */
export class NetworkError extends AppError {
  constructor(userMessage: string, originalError?: unknown) {
    super('NETWORK_ERROR', userMessage, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends AppError {
  constructor(userMessage: string, originalError?: unknown) {
    super('VALIDATION_ERROR', userMessage, originalError);
    this.name = 'ValidationError';
  }
}

/**
 * エラーコードと日本語メッセージのマッピング
 */
export const ERROR_MESSAGES = {
  // Bedrock API関連
  BEDROCK_THROTTLING: 'リクエストが多すぎます。しばらく待ってから再試行してください',
  BEDROCK_VALIDATION: '入力データが不正です',
  BEDROCK_INVOCATION: 'AI分析中にエラーが発生しました。もう一度お試しください',
  BEDROCK_PARSE: 'AI分析結果の解析に失敗しました',
  
  // LocalStorage関連
  STORAGE_UNAVAILABLE: 'ブラウザのストレージが利用できません',
  STORAGE_QUOTA_EXCEEDED: 'ブラウザのストレージが満杯です。古い結果を削除してください',
  STORAGE_SAVE_FAILED: '結果の保存に失敗しました',
  STORAGE_READ_FAILED: '結果の読み込みに失敗しました',
  STORAGE_DELETE_FAILED: '結果の削除に失敗しました',
  
  // ネットワーク関連
  NETWORK_OFFLINE: 'ネットワーク接続を確認してください',
  NETWORK_TIMEOUT: 'リクエストがタイムアウトしました。もう一度お試しください',
  NETWORK_FAILED: 'ネットワークエラーが発生しました。もう一度お試しください',
  
  // バリデーション関連
  VALIDATION_REQUIRED: '必須項目が入力されていません',
  VALIDATION_INVALID_MODE: '診断方針が不正です',
  VALIDATION_INVALID_RESPONSE: '回答データが不正です',
  
  // ギフトカード関連
  GIFT_CARD_GENERATION_FAILED: 'ギフトカード生成中にエラーが発生しました',
  GIFT_CARD_NO_DATA: '診断結果データが必要です',
  
  // 一般的なエラー
  UNKNOWN: '予期しないエラーが発生しました',
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;

/**
 * エラーをログ出力する
 * 要件12.4: デバッグ目的でエラーをコンソールにログ出力
 */
export function logError(context: string, error: unknown): void {
  const timestamp = new Date().toISOString();
  
  if (error instanceof AppError) {
    console.error(`[${timestamp}] [${context}] ${error.name} (${error.code}):`, {
      message: error.message,
      userMessage: error.userMessage,
      originalError: error.originalError,
    });
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] [${context}] ${error.name}:`, {
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error(`[${timestamp}] [${context}] Unknown error:`, error);
  }
}

/**
 * エラーからユーザー向けメッセージを取得
 * 要件12.5: 日本語でユーザーフレンドリーなエラーメッセージを提供
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  
  if (error instanceof Error) {
    // 既知のエラーパターンをチェック
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_FAILED;
    }
    
    if (message.includes('timeout')) {
      return ERROR_MESSAGES.NETWORK_TIMEOUT;
    }
    
    if (message.includes('quota')) {
      return ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED;
    }
    
    // 日本語メッセージがあればそのまま返す
    if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(error.message)) {
      return error.message;
    }
  }
  
  return ERROR_MESSAGES.UNKNOWN;
}

/**
 * ネットワーク接続状態をチェック
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * エラーを適切なAppErrorに変換
 */
export function normalizeError(error: unknown, context: string): AppError {
  // 既にAppErrorの場合はそのまま返す
  if (error instanceof AppError) {
    return error;
  }
  
  // オフラインチェック
  if (!isOnline()) {
    return new NetworkError(ERROR_MESSAGES.NETWORK_OFFLINE, error);
  }
  
  // Errorオブジェクトの場合
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const name = error.name;
    
    // Bedrock関連エラー
    if (name === 'ThrottlingException' || message.includes('throttl')) {
      return new BedrockError(ERROR_MESSAGES.BEDROCK_THROTTLING, error);
    }
    
    if (name === 'ValidationException' || message.includes('validation')) {
      return new BedrockError(ERROR_MESSAGES.BEDROCK_VALIDATION, error);
    }
    
    // ネットワーク関連エラー
    if (message.includes('network') || message.includes('fetch') || name === 'TypeError') {
      return new NetworkError(ERROR_MESSAGES.NETWORK_FAILED, error);
    }
    
    if (message.includes('timeout')) {
      return new NetworkError(ERROR_MESSAGES.NETWORK_TIMEOUT, error);
    }
    
    // LocalStorage関連エラー
    if (name === 'QuotaExceededError' || message.includes('quota')) {
      return new StorageError(ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED, error);
    }
    
    if (message.includes('localstorage') || message.includes('storage')) {
      return new StorageError(ERROR_MESSAGES.STORAGE_UNAVAILABLE, error);
    }
    
    // 日本語メッセージがあればそのまま使用
    if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(error.message)) {
      return new AppError('UNKNOWN', error.message, error);
    }
  }
  
  // その他のエラー
  return new AppError('UNKNOWN', ERROR_MESSAGES.UNKNOWN, error);
}

/**
 * エラーハンドリングのラッパー関数
 */
export async function handleAsync<T>(
  context: string,
  fn: () => Promise<T>,
  options?: {
    onError?: (error: AppError) => void;
    rethrow?: boolean;
  }
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const normalizedError = normalizeError(error, context);
    logError(context, normalizedError);
    
    if (options?.onError) {
      options.onError(normalizedError);
    }
    
    if (options?.rethrow) {
      throw normalizedError;
    }
    
    return null;
  }
}
