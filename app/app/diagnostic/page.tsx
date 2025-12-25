'use client';

import { useState } from 'react';
import type { DiagnosticMode, QuestionVolume, UserResponse, Question } from '@/lib/types';
import ModeSelector from './components/ModeSelector';
import VolumeSelector from './components/VolumeSelector';
import QuestionForm from './components/QuestionForm';
import GiftOpeningAnimation from './components/GiftOpeningAnimation';
import ResultDisplay from './components/ResultDisplay';
import SnowfallEffect from '../components/SnowfallEffect';
import CreditFooter from '../components/CreditFooter';

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
  const [result, setResult] = useState<any>(null); // Will be DiagnosticResult type

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
  const handleSubmit = () => {
    // Show animation
    setStep('animation');
    
    // TODO: This will be implemented in task 5 (Amplify診断Function)
    // For now, create a mock result for testing
    setTimeout(() => {
      const mockResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        mode: selectedMode!,
        service: {
          category: 'コンピューティング',
          serviceName: 'AWS Lambda'
        },
        catchphrase: 'あなたはサーバーレスの魔法使い',
        aiLetter: 'あなたの回答から、効率的で柔軟な開発スタイルが伝わってきました。AWS Lambdaは、サーバー管理の煩わしさから解放され、コードに集中できる環境を提供します。イベント駆動型のアーキテクチャで、必要な時だけ実行されるため、コスト効率も抜群です。',
        nextActions: [
          'AWS Lambda公式ドキュメントを読んで基本概念を理解する',
          'サーバーレスフレームワーク（Serverless Framework、SAM）を試してみる',
          '簡単なHTTP APIをLambdaで構築してみる'
        ]
      };
      setResult(mockResult);
    }, 100);
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900">
      {/* Snowfall Effect */}
      <SnowfallEffect />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Your AWS Identity 2025
            </h1>
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
              <GiftOpeningAnimation onComplete={handleAnimationComplete} />
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
  );
}
