/**
 * AWS Identity Gift 2025 - Service Master Utility
 * 
 * This file provides utilities for loading and managing the AWS service master list.
 */

import type { AWSService } from './types';

/**
 * サービスマスタのCSVファイルパス
 */
const SERVICES_CSV_PATH = '/services.csv';

/**
 * サービスマスタをCSVファイルから読み込む
 * 
 * @returns Promise<AWSService[]> - AWSサービスの配列
 * @throws Error - CSVファイルの読み込みまたはパースに失敗した場合
 */
export async function loadServiceMaster(): Promise<AWSService[]> {
  try {
    // CSVファイルを取得
    const response = await fetch(SERVICES_CSV_PATH);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services.csv: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // CSVをパース
    const services = parseServicesCSV(csvText);
    
    return services;
  } catch (error) {
    console.error('Error loading service master:', error);
    throw error;
  }
}

/**
 * CSV文字列をAWSServiceオブジェクトの配列にパース
 * 
 * @param csvText - CSV形式の文字列
 * @returns AWSService[] - パースされたAWSサービスの配列
 */
export function parseServicesCSV(csvText: string): AWSService[] {
  const lines = csvText.trim().split('\n');
  
  // ヘッダー行をスキップ
  const dataLines = lines.slice(1);
  
  const services: AWSService[] = [];
  
  for (const line of dataLines) {
    // 空行をスキップ
    if (!line.trim()) {
      continue;
    }
    
    // カンマで分割（簡易的なCSVパース）
    const [category, serviceName] = line.split(',').map(s => s.trim());
    
    if (category && serviceName) {
      services.push({
        category,
        serviceName
      });
    }
  }
  
  return services;
}

/**
 * サービスマスタをカテゴリ別にグループ化
 * 
 * @param services - AWSサービスの配列
 * @returns Record<string, AWSService[]> - カテゴリをキーとしたサービスのマップ
 */
export function groupServicesByCategory(services: AWSService[]): Record<string, AWSService[]> {
  const grouped: Record<string, AWSService[]> = {};
  
  for (const service of services) {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  }
  
  return grouped;
}

/**
 * サービス名でサービスを検索
 * 
 * @param services - AWSサービスの配列
 * @param serviceName - 検索するサービス名
 * @returns AWSService | undefined - 見つかったサービス、または undefined
 */
export function findServiceByName(services: AWSService[], serviceName: string): AWSService | undefined {
  return services.find(s => s.serviceName === serviceName);
}

/**
 * カテゴリでサービスをフィルタリング
 * 
 * @param services - AWSサービスの配列
 * @param category - フィルタリングするカテゴリ
 * @returns AWSService[] - フィルタリングされたサービスの配列
 */
export function filterServicesByCategory(services: AWSService[], category: string): AWSService[] {
  return services.filter(s => s.category === category);
}

/**
 * サービスマスタをClaudeプロンプト用のテキスト形式に変換
 * 
 * @param services - AWSサービスの配列
 * @returns string - プロンプト用のフォーマット済みテキスト
 */
export function formatServicesForPrompt(services: AWSService[]): string {
  return services
    .map(s => `- ${s.category}: ${s.serviceName}`)
    .join('\n');
}
