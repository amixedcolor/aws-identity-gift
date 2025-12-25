/**
 * サービスマスタ管理ユーティリティ
 */

import type { AWSService } from './types';

/**
 * services.csvを読み込んでAWSServiceの配列に変換
 */
export async function loadServices(): Promise<AWSService[]> {
  try {
    const response = await fetch('/services.csv');
    const csvText = await response.text();
    
    // CSVをパース（ヘッダー行をスキップ）
    const lines = csvText.trim().split('\n').slice(1);
    
    const services: AWSService[] = lines.map(line => {
      const [category, serviceName] = line.split(',').map(s => s.trim());
      return { category, serviceName };
    });
    
    return services;
  } catch (error) {
    console.error('Failed to load services:', error);
    throw new Error('サービスマスタの読み込みに失敗しました');
  }
}

/**
 * サービスマスタをJSON文字列に変換（Lambda関数に渡すため）
 */
export function serializeServices(services: AWSService[]): string {
  return JSON.stringify(services);
}

/**
 * JSON文字列からサービスマスタをパース
 */
export function deserializeServices(servicesJson: string): AWSService[] {
  return JSON.parse(servicesJson);
}
