/**
 * LocalStorage結果アーカイブ管理ユーティリティ
 * 
 * 要件6.1-6.6, 12.2に対応：
 * - 結果の保存、読み取り、削除機能
 * - 最大9件の制限と古い結果の自動削除
 * - タイムスタンプの付与
 * - エラーハンドリング
 */

import type { DiagnosticResult, StoredResults } from './types';

/** LocalStorageのキー */
const STORAGE_KEY = 'aws-identity-gift-results';

/** 最大保存件数 */
const MAX_RESULTS = 9;

/**
 * LocalStorageが利用可能かどうかをチェック
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * すべての診断結果を取得
 * @param sortOrder ソート順序 ('asc' = 古い順, 'desc' = 新しい順)
 * @returns 診断結果の配列
 */
export function getAllResults(sortOrder: 'asc' | 'desc' = 'desc'): DiagnosticResult[] {
  try {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available');
      return [];
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed: StoredResults = JSON.parse(stored);
    
    // タイムスタンプでソート
    return parsed.results.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  } catch (error) {
    console.error('Failed to get results from LocalStorage:', error);
    return [];
  }
}

/**
 * 診断結果を保存
 * 最大9件を超える場合は最も古い結果を自動削除
 * 
 * @param result 保存する診断結果
 * @throws Error LocalStorageが満杯または利用不可の場合
 */
export function saveResult(result: DiagnosticResult): void {
  try {
    if (!isLocalStorageAvailable()) {
      throw new Error('ブラウザのストレージが利用できません');
    }

    // 既存の結果を取得
    const existingResults = getAllResults();

    // タイムスタンプが付与されていない場合は付与
    const resultWithTimestamp: DiagnosticResult = {
      ...result,
      timestamp: result.timestamp || new Date().toISOString()
    };

    // 新しい結果を先頭に追加
    let updatedResults = [resultWithTimestamp, ...existingResults];

    // 最大件数を超える場合は古い結果を削除
    if (updatedResults.length > MAX_RESULTS) {
      // タイムスタンプで降順ソートして最新9件を保持
      updatedResults = updatedResults
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, MAX_RESULTS);
    }

    // 保存
    const storedData: StoredResults = { results: updatedResults };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    console.error('Failed to save result to LocalStorage:', error);
    
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('ブラウザのストレージが満杯です。古い結果を削除してください');
    }
    
    throw error instanceof Error 
      ? error 
      : new Error('結果の保存に失敗しました');
  }
}

/**
 * 特定の診断結果を取得
 * @param id 結果ID
 * @returns 診断結果、見つからない場合はnull
 */
export function getResultById(id: string): DiagnosticResult | null {
  try {
    const results = getAllResults();
    return results.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Failed to get result by ID:', error);
    return null;
  }
}

/**
 * 特定の診断結果を削除
 * @param id 削除する結果のID
 */
export function deleteResult(id: string): void {
  try {
    if (!isLocalStorageAvailable()) {
      throw new Error('ブラウザのストレージが利用できません');
    }

    const results = getAllResults();
    const filteredResults = results.filter(r => r.id !== id);

    const storedData: StoredResults = { results: filteredResults };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    console.error('Failed to delete result from LocalStorage:', error);
    throw error instanceof Error 
      ? error 
      : new Error('結果の削除に失敗しました');
  }
}

/**
 * すべての診断結果を削除
 */
export function clearAllResults(): void {
  try {
    if (!isLocalStorageAvailable()) {
      throw new Error('ブラウザのストレージが利用できません');
    }

    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear results from LocalStorage:', error);
    throw error instanceof Error 
      ? error 
      : new Error('結果のクリアに失敗しました');
  }
}

/**
 * 保存されている結果の件数を取得
 * @returns 結果の件数
 */
export function getResultCount(): number {
  return getAllResults().length;
}

/**
 * 最大保存件数を取得
 * @returns 最大保存件数
 */
export function getMaxResults(): number {
  return MAX_RESULTS;
}
