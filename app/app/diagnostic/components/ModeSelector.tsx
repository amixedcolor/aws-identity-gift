'use client';

import type { DiagnosticMode } from '@/lib/types';

interface ModeSelectorProps {
  selectedMode: DiagnosticMode | null;
  onSelectMode: (mode: DiagnosticMode) => void;
}

const modes = [
  {
    id: 'tech-fit' as DiagnosticMode,
    title: 'Tech-Fit',
    subtitle: 'スキルと経験で分析',
    description: 'あなたの技術スキルと開発経験に基づいて、最適なAWSサービスを推薦します。',
    icon: '💻',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'vibe-fit' as DiagnosticMode,
    title: 'Vibe-Fit',
    subtitle: '性格とライフスタイルで分析',
    description: 'あなたの性格や働き方、ライフスタイルに基づいて、相性の良いAWSサービスを推薦します。',
    icon: '✨',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'adventure' as DiagnosticMode,
    title: 'Adventure',
    subtitle: '憧れと挑戦心で分析',
    description: 'あなたの憧れや挑戦したいことに基づいて、意外性のあるAWSサービスを推薦します。',
    icon: '🚀',
    color: 'from-orange-600 to-red-600'
  }
];

export default function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          診断方針を選択してください
        </h2>
        <p className="text-white/80 text-lg">
          どのような視点で分析するかを選んでください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-300
              ${
                selectedMode === mode.id
                  ? 'border-white bg-white/20 scale-105 shadow-2xl'
                  : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 hover:scale-102'
              }
            `}
          >
            {/* Icon */}
            <div className="text-6xl mb-4 text-center">
              {mode.icon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              {mode.title}
            </h3>

            {/* Subtitle */}
            <p className={`
              text-sm font-semibold mb-3 text-center
              bg-gradient-to-r ${mode.color} bg-clip-text text-transparent
            `}>
              {mode.subtitle}
            </p>

            {/* Description */}
            <p className="text-white/80 text-sm leading-relaxed text-center">
              {mode.description}
            </p>

            {/* Selected Indicator */}
            {selectedMode === mode.id && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
