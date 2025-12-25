/**
 * サービスマスタ管理ユーティリティ
 */

import type { AWSService } from './types';

/**
 * CSV文字列をパースしてAWSServiceの配列に変換
 */
export function parseServicesCSV(csvText: string): AWSService[] {
  const lines = csvText.trim().split('\n').slice(1); // ヘッダー行をスキップ
  
  return lines
    .filter(line => line.trim() !== '') // 空行をスキップ
    .map(line => {
      const [category, serviceName] = line.split(',').map(s => s.trim());
      return { category, serviceName };
    });
}

/**
 * services.csvを読み込んでAWSServiceの配列に変換
 */
export async function loadServices(): Promise<AWSService[]> {
  try {
    const response = await fetch('/services.csv');
    const csvText = await response.text();
    return parseServicesCSV(csvText);
  } catch (error) {
    console.error('Failed to load services:', error);
    throw new Error('サービスマスタの読み込みに失敗しました');
  }
}

/**
 * サービスをカテゴリごとにグループ化
 */
export function groupServicesByCategory(services: AWSService[]): Record<string, AWSService[]> {
  return services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, AWSService[]>);
}

/**
 * サービス名でサービスを検索
 */
export function findServiceByName(services: AWSService[], name: string): AWSService | undefined {
  return services.find(s => s.serviceName === name);
}

/**
 * カテゴリでサービスをフィルタリング
 */
export function filterServicesByCategory(services: AWSService[], category: string): AWSService[] {
  return services.filter(s => s.category === category);
}

/**
 * サービスをClaudeプロンプト用にフォーマット
 */
export function formatServicesForPrompt(services: AWSService[]): string {
  if (services.length === 0) return '';
  return services.map(s => `- ${s.category}: ${s.serviceName}`).join('\n');
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
