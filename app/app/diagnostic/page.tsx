'use client';

import { useState } from 'react';
import type { DiagnosticMode, QuestionVolume, UserResponse, Question } from '@/lib/types';
import ModeSelector from './components/ModeSelector';
import VolumeSelector from './components/VolumeSelector';
import QuestionForm from './components/QuestionForm';
import SnowfallEffect from '../components/SnowfallEffect';
import CreditFooter from '../components/CreditFooter';

// Import question sets
import { techFitQuestions } from '@/lib/questions/tech-fit';
import { vibeFitQuestions } from '@/lib/questions/vibe-fit';
import { adventureQuestions } from '@/lib/questions/adventure';

type DiagnosticStep = 'mode-selection' | 'volume-selection' | 'questions' | 'result';

export default function DiagnosticPage() {
  const [step, setStep] = useState<DiagnosticStep>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<DiagnosticMode | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<QuestionVolume>('quick');
  const [responses, setResponses] = useState<UserResponse[]>([]);

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
    // TODO: This will be implemented in task 5 (Amplify診断Function)
    console.log('Submitting diagnostic:', {
      mode: selectedMode,
      volume: selectedVolume,
      responses
    });
    alert('診断機能は次のタスクで実装されます');
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'volume-selection') {
      setStep('mode-selection');
      setSelectedMode(null);
    } else if (step === 'questions') {
      setStep('volume-selection');
      setResponses([]);
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
            {step !== 'mode-selection' && (
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
          </div>
        </div>

        {/* Credit Footer */}
        <CreditFooter />
      </div>
    </div>
  );
}
