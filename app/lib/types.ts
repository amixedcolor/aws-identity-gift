/**
 * AWS Identity Gift 2025 - Type Definitions (Archived)
 * 
 * サービス終了後のアーカイブ閲覧用に必要な型定義のみ保持
 */

/**
 * 診断方針 (Diagnostic Mode)
 */
export type DiagnosticMode = 'tech-fit' | 'vibe-fit' | 'adventure';

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
 * LocalStorage保存形式 (Stored Results)
 */
export interface StoredResults {
  /** 診断結果の配列（最大9件） */
  results: DiagnosticResult[];
}
