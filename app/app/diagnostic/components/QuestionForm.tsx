'use client';

import { useState, useEffect } from 'react';
import type { Question, QuestionVolume, UserResponse } from '@/lib/types';

interface QuestionFormProps {
  questions: Question[];
  currentVolume: QuestionVolume;
  responses: UserResponse[];
  onResponseChange: (responses: UserResponse[]) => void;
  onSubmit: () => void;
  onVolumeSwitch: (volume: QuestionVolume) => void;
}

export default function QuestionForm({
  questions,
  currentVolume,
  responses,
  onResponseChange,
  onSubmit,
  onVolumeSwitch
}: QuestionFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousVolume, setPreviousVolume] = useState<QuestionVolume>(currentVolume);
  
  // Filter questions based on current volume
  const filteredQuestions = questions.filter(q => {
    if (currentVolume === 'quick') {
      return q.volume === 'quick';
    }
    return true; // detailed shows all questions
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  // Get current response for this question
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);

  // Handle answer change
  const handleAnswerChange = (answer: string | string[]) => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion.id);
    newResponses.push({
      questionId: currentQuestion.id,
      answer
    });
    onResponseChange(newResponses);
  };

  // Handle multiple choice selection
  const handleMultipleChoiceChange = (option: string) => {
    if (currentQuestion.multiple) {
      // Multiple selection
      const currentAnswers = Array.isArray(currentResponse?.answer) 
        ? currentResponse.answer 
        : [];
      
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      
      handleAnswerChange(newAnswers);
    } else {
      // Single selection
      handleAnswerChange(option);
    }
  };

  // Handle free text change
  const handleFreeTextChange = (text: string) => {
    handleAnswerChange(text);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentResponse) return false;
    
    if (Array.isArray(currentResponse.answer)) {
      return currentResponse.answer.length > 0;
    }
    
    return currentResponse.answer.trim().length > 0;
  };

  // Check if all required questions are answered
  const areAllRequiredQuestionsAnswered = () => {
    const requiredQuestions = filteredQuestions.filter(q => q.required);
    return requiredQuestions.every(q => {
      const response = responses.find(r => r.questionId === q.id);
      if (!response) return false;
      
      if (Array.isArray(response.answer)) {
        return response.answer.length > 0;
      }
      
      return response.answer.trim().length > 0;
    });
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitClick = () => {
    if (areAllRequiredQuestionsAnswered()) {
      onSubmit();
    }
  };

  // Reset to first question when volume changes
  // When switching from quick to detailed, start from question 6 (index 5)
  useEffect(() => {
    // Only run when volume actually changes
    if (currentVolume !== previousVolume) {
      if (currentVolume === 'detailed' && previousVolume === 'quick') {
        // Check if we have answers for the first 5 questions (quick mode)
        const quickQuestions = questions.filter(q => q.volume === 'quick');
        const hasQuickAnswers = quickQuestions.every(q => 
          responses.some(r => r.questionId === q.id)
        );
        
        // If user completed quick mode and switched to detailed, start from question 6
        if (hasQuickAnswers) {
          setCurrentQuestionIndex(5); // Start from question 6 (index 5)
        } else {
          setCurrentQuestionIndex(0);
        }
      } else {
        setCurrentQuestionIndex(0);
      }
      
      setPreviousVolume(currentVolume);
    }
  }, [currentVolume, previousVolume, questions, responses]);

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">
            質問 {currentQuestionIndex + 1} / {filteredQuestions.length}
          </span>
          <span className="text-white/80 text-sm">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
        {/* Question Text */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {currentQuestion.text}
            {currentQuestion.required && (
              <span className="text-red-400 ml-2">*</span>
            )}
          </h3>
          {currentQuestion.multiple && (
            <p className="text-white/60 text-sm">
              複数選択可
            </p>
          )}
        </div>

        {/* Answer Input */}
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.multiple
                ? Array.isArray(currentResponse?.answer) && currentResponse.answer.includes(option)
                : currentResponse?.answer === option;

              return (
                <button
                  key={option}
                  onClick={() => handleMultipleChoiceChange(option)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio button for single selection, checkbox for multiple */}
                    <div className={`
                      w-5 h-5 border-2 flex items-center justify-center
                      ${currentQuestion.multiple ? 'rounded' : 'rounded-full'}
                      ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400'
                          : 'border-white/50'
                      }
                    `}>
                      {isSelected && (
                        currentQuestion.multiple ? (
                          // Checkmark for multiple selection
                          <span className="text-red-900 text-xs font-bold">✓</span>
                        ) : (
                          // Filled circle for single selection (radio button)
                          <div className="w-2.5 h-2.5 rounded-full bg-red-900" />
                        )
                      )}
                    </div>
                    <span className="text-white text-lg">
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'free-text' && (
          <textarea
            value={typeof currentResponse?.answer === 'string' ? currentResponse.answer : ''}
            onChange={(e) => handleFreeTextChange(e.target.value)}
            placeholder="自由に記述してください..."
            rows={5}
            className="w-full p-4 rounded-lg bg-white/10 border-2 border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:outline-none resize-none"
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← 前へ
        </button>

        <div className="flex gap-3">
          {currentQuestionIndex === filteredQuestions.length - 1 ? (
            <>
              {currentVolume === 'quick' && (
                <button
                  onClick={() => onVolumeSwitch('detailed')}
                  className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                >
                  詳細診断に切り替え
                </button>
              )}
              <button
                onClick={handleSubmitClick}
                disabled={!areAllRequiredQuestionsAnswered()}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-red-900 font-bold hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                診断結果を見る
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentQuestion.required && !isCurrentQuestionAnswered()}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              次へ →
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <p className="text-white/70 text-sm text-center">
          入力されたデータはAI分析にのみ使用され、一切保存されません
        </p>
      </div>
    </div>
  );
}
