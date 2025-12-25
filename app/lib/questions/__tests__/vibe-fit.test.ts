/**
 * Vibe-Fit診断設問データのテスト
 */

import { describe, it, expect } from 'vitest';
import { 
  vibeFitQuestions, 
  getQuickQuestions, 
  getDetailedQuestions,
  getQuestionById 
} from '../vibe-fit';

describe('Vibe-Fit Questions', () => {
  describe('質問データの構造', () => {
    it('合計20問の質問が定義されている', () => {
      expect(vibeFitQuestions).toHaveLength(20);
    });

    it('クイック診断は5問である', () => {
      const quickQuestions = getQuickQuestions();
      expect(quickQuestions).toHaveLength(5);
    });

    it('詳細診断は20問である', () => {
      const detailedQuestions = getDetailedQuestions();
      expect(detailedQuestions).toHaveLength(20);
    });

    it('すべての質問に必須フィールドが含まれている', () => {
      vibeFitQuestions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('required');
        expect(question).toHaveProperty('volume');
      });
    });

    it('質問IDはすべてユニークである', () => {
      const ids = vibeFitQuestions.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('質問IDは"vf-q"で始まる', () => {
      vibeFitQuestions.forEach(question => {
        expect(question.id).toMatch(/^vf-q\d+$/);
      });
    });
  });

  describe('質問タイプの検証', () => {
    it('multiple-choice型の質問にはoptionsが存在する', () => {
      const multipleChoiceQuestions = vibeFitQuestions.filter(
        q => q.type === 'multiple-choice'
      );
      
      multipleChoiceQuestions.forEach(question => {
        expect(question.options).toBeDefined();
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options!.length).toBeGreaterThan(0);
      });
    });

    it('free-text型の質問にはoptionsが存在しない', () => {
      const freeTextQuestions = vibeFitQuestions.filter(
        q => q.type === 'free-text'
      );
      
      freeTextQuestions.forEach(question => {
        expect(question.options).toBeUndefined();
      });
    });
  });

  describe('質問ボリュームの検証', () => {
    it('クイック質問はすべてrequired=trueである', () => {
      const quickQuestions = getQuickQuestions();
      quickQuestions.forEach(question => {
        expect(question.required).toBe(true);
      });
    });

    it('詳細質問（追加15問）はrequired=falseである', () => {
      const detailedOnlyQuestions = vibeFitQuestions.filter(
        q => q.volume === 'detailed'
      );
      
      expect(detailedOnlyQuestions).toHaveLength(15);
      detailedOnlyQuestions.forEach(question => {
        expect(question.required).toBe(false);
      });
    });

    it('クイック質問のvolumeは"quick"である', () => {
      const quickQuestions = getQuickQuestions();
      quickQuestions.forEach(question => {
        expect(question.volume).toBe('quick');
      });
    });
  });

  describe('ヘルパー関数の検証', () => {
    it('getQuestionByIdは正しい質問を返す', () => {
      const question = getQuestionById('vf-q1');
      expect(question).toBeDefined();
      expect(question?.id).toBe('vf-q1');
    });

    it('getQuestionByIdは存在しないIDに対してundefinedを返す', () => {
      const question = getQuestionById('vf-q999');
      expect(question).toBeUndefined();
    });
  });

  describe('質問内容の検証', () => {
    it('すべての質問文が空でない', () => {
      vibeFitQuestions.forEach(question => {
        expect(question.text.length).toBeGreaterThan(0);
      });
    });

    it('性格とライフスタイルに関連する質問が含まれている', () => {
      const questionTexts = vibeFitQuestions.map(q => q.text).join(' ');
      
      // 性格やライフスタイルに関連するキーワードが含まれていることを確認
      const lifestyleKeywords = [
        '性格', 'スタイル', '過ごし方', '働き方', 
        'モチベーション', '理想', '好き', '感じ'
      ];
      
      const hasLifestyleContent = lifestyleKeywords.some(keyword => 
        questionTexts.includes(keyword)
      );
      
      expect(hasLifestyleContent).toBe(true);
    });
  });
});
