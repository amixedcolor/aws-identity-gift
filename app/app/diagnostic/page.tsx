'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { DiagnosticMode, QuestionVolume, UserResponse, Question, DiagnosticResult } from '@/lib/types';
import ModeSelector from './components/ModeSelector';
import VolumeSelector from './components/VolumeSelector';
import QuestionForm from './components/QuestionForm';
import GiftOpeningAnimation from './components/GiftOpeningAnimation';
import ResultDisplay from './components/ResultDisplay';
import SnowfallEffect from '../components/SnowfallEffect';
import CreditFooter from '../components/CreditFooter';
import ErrorBoundary from '../components/ErrorBoundary';
import { ErrorToast } from '../components/ErrorDisplay';
import { saveResult } from '@/lib/storage';
import { 
  logError, 
  getUserMessage, 
  normalizeError, 
  isOnline,
  ERROR_MESSAGES,
  type AppError 
} from '@/lib/errors';

// Import question sets
import { techFitQuestions } from '@/lib/questions/tech-fit';
import { vibeFitQuestions } from '@/lib/questions/vibe-fit';
import { adventureQuestions } from '@/lib/questions/adventure';

type DiagnosticStep = 'mode-selection' | 'volume-selection' | 'questions' | 'animation' | 'result';

export default function DiagnosticPage() {
  const [step, setStep] = useState<DiagnosticStep>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<DiagnosticMode | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<QuestionVolume>('quick');
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // エラーを表示する
  const showError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  // エラーをクリアする
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Get questions based on selected mode
  const getQuestions = (): Question[] => {
    switch (selectedMode) {
      case 'tech-fit':
        return techFitQuestions;
      case 'vibe-fit':
        return vibeFitQuestions;
      case 'adventure':
        return adventureQuestions;
      default:
        return [];
    }
  };

  // Handle mode selection
  const handleModeSelect = (mode: DiagnosticMode) => {
    setSelectedMode(mode);
    setStep('volume-selection');
  };

  // Handle volume selection
  const handleVolumeSelect = (volume: QuestionVolume) => {
    setSelectedVolume(volume);
  };

  // Start questions
  const handleStartQuestions = () => {
    setStep('questions');
  };

  // Handle volume switch during questions
  const handleVolumeSwitch = (volume: QuestionVolume) => {
    setSelectedVolume(volume);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // オフラインチェック
    if (!isOnline()) {
      showError(ERROR_MESSAGES.NETWORK_OFFLINE);
      return;
    }

    // Show animation (shaking state)
    setStep('animation');
    
    try {
      // Load services from CSV
      const { loadServices, serializeServices } = await import('@/lib/services');
      const services = await loadServices();
      
      // Call Amplify diagnostic function
      const { generateClient } = await import('aws-amplify/data');
      const client = generateClient<import('@/amplify/data/resource').Schema>();
      
      const { data, errors } = await client.queries.diagnostic({
        mode: selectedMode!,
        responses: JSON.stringify(responses),
        services: serializeServices(services)
      });
      
      if (errors || !data) {
        const errorMsg = errors?.[0]?.message || '診断中にエラーが発生しました';
        logError('DiagnosticPage.handleSubmit', new Error(errorMsg));
        throw new Error(data?.error || errorMsg);
      }
      
      if (data.error) {
        logError('DiagnosticPage.handleSubmit', new Error(data.error));
        throw new Error(data.error);
      }
      
      if (!data.result) {
        throw new Error('診断結果が取得できませんでした');
      }
      
      // Parse the result
      const diagnosticResult = JSON.parse(data.result);
      setResult(diagnosticResult);
      
      // Save result to LocalStorage
      try {
        saveResult(diagnosticResult);
      } catch (storageError) {
        // LocalStorageエラーをログ出力（ユーザーには結果を表示）
        const normalizedError = normalizeError(storageError, 'DiagnosticPage.saveResult');
        logError('DiagnosticPage.saveResult', normalizedError);
        // 結果表示は続行するが、保存失敗を通知
        showError(getUserMessage(storageError));
      }
      
      // Animation will automatically transition to 'open' and then 'result'
      
    } catch (error) {
      // エラーを正規化してログ出力
      const normalizedError = normalizeError(error, 'DiagnosticPage.handleSubmit');
      logError('DiagnosticPage.handleSubmit', normalizedError);
      
      // ユーザー向けメッセージを表示
      showError(getUserMessage(error));
      
      // Go back to questions
      setStep('questions');
    }
  };

  // Handle animation complete
  const handleAnimationComplete = () => {
    setStep('result');
  };

  // Handle start new diagnostic
  const handleStartNew = () => {
    setStep('mode-selection');
    setSelectedMode(null);
    setSelectedVolume('quick');
    setResponses([]);
    setResult(null);
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'volume-selection') {
      setStep('mode-selection');
      setSelectedMode(null);
    } else if (step === 'questions') {
      setStep('volume-selection');
      setResponses([]);
    } else if (step === 'result') {
      handleStartNew();
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900">
        {/* Snowfall Effect */}
        <SnowfallEffect />

        {/* Error Toast */}
        {errorMessage && (
          <ErrorToast
            message={errorMessage}
            type="error"
            onClose={clearError}
            autoCloseMs={5000}
          />
        )}

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-bold text-white cursor-pointer hover:text-yellow-300 transition-colors">
                  Your AWS Identity 2025
                </h1>
              </Link>
              {step !== 'mode-selection' && step !== 'animation' && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                >
                  ← 戻る
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-center justify-center p-4 pb-20">
            <div className="w-full max-w-4xl">
              {step === 'mode-selection' && (
                <ModeSelector
                  selectedMode={selectedMode}
                  onSelectMode={handleModeSelect}
                />
              )}

              {step === 'volume-selection' && (
                <div className="space-y-8">
                  <VolumeSelector
                    selectedVolume={selectedVolume}
                    onSelectVolume={handleVolumeSelect}
                  />
                  <div className="flex justify-center">
                    <button
                      onClick={handleStartQuestions}
                      className="px-12 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-red-900 text-xl font-bold hover:from-yellow-500 hover:to-orange-500 transition-all shadow-2xl transform hover:scale-105"
                    >
                      診断を開始する
                    </button>
                  </div>
                </div>
              )}

              {step === 'questions' && (
                <QuestionForm
                  questions={getQuestions()}
                  currentVolume={selectedVolume}
                  responses={responses}
                  onResponseChange={setResponses}
                  onSubmit={handleSubmit}
                  onVolumeSwitch={handleVolumeSwitch}
                />
              )}

              {step === 'animation' && (
                <GiftOpeningAnimation 
                  onComplete={handleAnimationComplete}
                  result={result}
                />
              )}

              {step === 'result' && result && (
                <ResultDisplay result={result} onStartNew={handleStartNew} />
              )}
            </div>
          </div>

          {/* Credit Footer */}
          <CreditFooter />
        </div>
      </div>
    </ErrorBoundary>
  );
}
