'use client';

import type { QuestionVolume } from '@/lib/types';

interface VolumeSelectorProps {
  selectedVolume: QuestionVolume;
  onSelectVolume: (volume: QuestionVolume) => void;
  disabled?: boolean;
}

const volumes = [
  {
    id: 'quick' as QuestionVolume,
    title: 'クイック診断',
    duration: '約1分',
    questionCount: '5問',
    description: 'サクッと診断したい方におすすめ',
    icon: '⚡',
    recommended: true
  },
  {
    id: 'detailed' as QuestionVolume,
    title: '詳細診断',
    duration: '約5分',
    questionCount: '20問',
    description: 'じっくり診断したい方におすすめ',
    icon: '🔍',
    recommended: false
  }
];

export default function VolumeSelector({ 
  selectedVolume, 
  onSelectVolume,
  disabled = false 
}: VolumeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          質問ボリュームを選択
        </h3>
        <p className="text-white/70 text-sm">
          クイック診断の後、詳細診断に切り替えることもできます
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volumes.map((volume) => (
          <button
            key={volume.id}
            onClick={() => onSelectVolume(volume.id)}
            disabled={disabled}
            className={`
              relative p-6 rounded-lg border-2 transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${
                selectedVolume === volume.id
                  ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                  : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
              }
            `}
          >
            {/* Recommended Badge */}
            {volume.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-3 py-1 bg-yellow-400 text-red-900 text-xs font-bold rounded-full">
                  おすすめ
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="text-4xl mb-3 text-center">
              {volume.icon}
            </div>

            {/* Title */}
            <h4 className="text-xl font-bold text-white mb-2 text-center">
              {volume.title}
            </h4>

            {/* Duration and Question Count */}
            <div className="flex justify-center gap-4 mb-3">
              <span className="text-white/80 text-sm">
                {volume.duration}
              </span>
              <span className="text-white/60">•</span>
              <span className="text-white/80 text-sm">
                {volume.questionCount}
              </span>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm text-center">
              {volume.description}
            </p>

            {/* Selected Indicator */}
            {selectedVolume === volume.id && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-red-900 text-xs font-bold">✓</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
