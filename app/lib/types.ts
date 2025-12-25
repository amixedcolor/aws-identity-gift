/**
 * AWS Identity Gift 2025 - Type Definitions
 * 
 * This file contains all TypeScript type definitions for the application.
 */

/**
 * 診断方針 (Diagnostic Mode)
 * - tech-fit: スキルと経験に基づく分析
 * - vibe-fit: 性格とライフスタイルに基づく分析
 * - adventure: 憧れと意外性に基づく分析
 */
export type DiagnosticMode = 'tech-fit' | 'vibe-fit' | 'adventure';

/**
 * 質問ボリューム (Question Volume)
 * - quick: クイック診断（5問、1分）
 * - detailed: 詳細診断（20問、5分）
 */
export type QuestionVolume = 'quick' | 'detailed';

/**
 * 質問タイプ (Question Type)
 * - multiple-choice: 多肢選択式
 * - free-text: 自由記述式
 */
export type QuestionType = 'multiple-choice' | 'free-text';

/**
 * 質問定義 (Question Definition)
 */
export interface Question {
  /** 質問ID */
  id: string;
  /** 質問文 */
  text: string;
  /** 質問タイプ */
  type: QuestionType;
  /** 選択肢（multiple-choiceの場合のみ） */
  options?: string[];
  /** 複数選択可能かどうか（multiple-choiceの場合のみ有効） */
  multiple?: boolean;
  /** 必須かどうか */
  required: boolean;
  /** 質問ボリューム */
  volume: QuestionVolume;
}

/**
 * ユーザー回答 (User Response)
 */
export interface UserResponse {
  /** 質問ID */
  questionId: string;
  /** 回答（単一選択、複数選択、または自由記述） */
  answer: string | string[];
}

/**
 * 診断リクエスト (Diagnostic Request)
 */
export interface DiagnosticRequest {
  /** 診断方針 */
  mode: DiagnosticMode;
  /** ユーザー回答の配列 */
  responses: UserResponse[];
}

/**
 * AWSサービス (AWS Service)
 */
export interface AWSService {
  /** カテゴリ */
  category: string;
  /** サービス名 */
  serviceName: string;
}

/**
 * 診断結果 (Diagnostic Result)
 */
export interface DiagnosticResult {
  /** 結果ID（UUID） */
  id: string;
  /** タイムスタンプ（ISO 8601形式） */
  timestamp: string;
  /** 診断方針 */
  mode: DiagnosticMode;
  /** 推薦されたAWSサービス */
  service: AWSService;
  /** キャッチコピー */
  catchphrase: string;
  /** AIレター（推薦理由） */
  aiLetter: string;
  /** ネクストアクション */
  nextActions: string[];
  /** ギフトカード画像（Base64エンコード、オプション） */
  giftCardImage?: string;
}

/**
 * ギフトカード画像生成リクエスト (Gift Card Request)
 */
export interface GiftCardRequest {
  /** 診断結果 */
  result: DiagnosticResult;
  /** ユーザー名（オプション） */
  userName?: string;
}

/**
 * ギフトカード画像生成レスポンス (Gift Card Response)
 */
export interface GiftCardResponse {
  /** Base64エンコードされた画像データ */
  imageData: string;
  /** エラーメッセージ（オプション） */
  error?: string;
}

/**
 * LocalStorage保存形式 (Stored Results)
 */
export interface StoredResults {
  /** 診断結果の配列（最大9件） */
  results: DiagnosticResult[];
}
