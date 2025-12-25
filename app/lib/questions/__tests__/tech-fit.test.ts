/**
 * Tech-Fit Questions Test
 * 
 * Validates the Tech-Fit question data structure and requirements
 */

import { describe, it, expect } from 'vitest';
import { 
  techFitQuestions, 
  getQuickQuestions, 
  getDetailedQuestions,
  getQuestionById 
} from '../tech-fit';

describe('Tech-Fit Questions', () => {
  describe('Question Count', () => {
    it('should have exactly 20 questions total', () => {
      expect(techFitQuestions).toHaveLength(20);
    });

    it('should have exactly 5 quick questions', () => {
      const quickQuestions = getQuickQuestions();
      expect(quickQuestions).toHaveLength(5);
    });

    it('should have exactly 15 detailed questions', () => {
      const detailedQuestions = techFitQuestions.filter(q => q.volume === 'detailed');
      expect(detailedQuestions).toHaveLength(15);
    });
  });

  describe('Question Structure', () => {
    it('all questions should have required fields', () => {
      techFitQuestions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('required');
        expect(question).toHaveProperty('volume');
      });
    });

    it('all question IDs should be unique', () => {
      const ids = techFitQuestions.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(techFitQuestions.length);
    });

    it('all question IDs should follow tf-qN format', () => {
      techFitQuestions.forEach(question => {
        expect(question.id).toMatch(/^tf-q\d+$/);
      });
    });
  });

  describe('Question Types', () => {
    it('should include both multiple-choice and free-text questions', () => {
      const multipleChoice = techFitQuestions.filter(q => q.type === 'multiple-choice');
      const freeText = techFitQuestions.filter(q => q.type === 'free-text');
      
      expect(multipleChoice.length).toBeGreaterThan(0);
      expect(freeText.length).toBeGreaterThan(0);
    });

    it('multiple-choice questions should have options', () => {
      const multipleChoice = techFitQuestions.filter(q => q.type === 'multiple-choice');
      multipleChoice.forEach(question => {
        expect(question.options).toBeDefined();
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options!.length).toBeGreaterThan(0);
      });
    });

    it('free-text questions should not have options', () => {
      const freeText = techFitQuestions.filter(q => q.type === 'free-text');
      freeText.forEach(question => {
        expect(question.options).toBeUndefined();
      });
    });
  });

  describe('Required Questions', () => {
    it('all quick questions should be required', () => {
      const quickQuestions = getQuickQuestions();
      quickQuestions.forEach(question => {
        expect(question.required).toBe(true);
      });
    });

    it('detailed questions should be optional', () => {
      const detailedQuestions = techFitQuestions.filter(q => q.volume === 'detailed');
      detailedQuestions.forEach(question => {
        expect(question.required).toBe(false);
      });
    });
  });

  describe('Helper Functions', () => {
    it('getQuickQuestions should return only quick volume questions', () => {
      const quickQuestions = getQuickQuestions();
      quickQuestions.forEach(question => {
        expect(question.volume).toBe('quick');
      });
    });

    it('getDetailedQuestions should return all questions', () => {
      const detailedQuestions = getDetailedQuestions();
      expect(detailedQuestions).toEqual(techFitQuestions);
    });

    it('getQuestionById should return correct question', () => {
      const question = getQuestionById('tf-q1');
      expect(question).toBeDefined();
      expect(question?.id).toBe('tf-q1');
    });

    it('getQuestionById should return undefined for non-existent ID', () => {
      const question = getQuestionById('non-existent');
      expect(question).toBeUndefined();
    });
  });

  describe('Question Content Quality', () => {
    it('all questions should have non-empty text', () => {
      techFitQuestions.forEach(question => {
        expect(question.text.trim().length).toBeGreaterThan(0);
      });
    });

    it('all questions should have meaningful text (at least 5 characters)', () => {
      techFitQuestions.forEach(question => {
        expect(question.text.trim().length).toBeGreaterThanOrEqual(5);
      });
    });
  });
});
