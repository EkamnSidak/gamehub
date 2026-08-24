import React from 'react';
import { AllGameScores, GameMode, BestScoreRecord } from '../types';
import { X, Trophy, Sparkles, Award, RotateCcw, Share2, Play } from 'lucide-react';
import { sound } from '../utils/audio';

interface StatsModalProps {
  scores: AllGameScores;
  onClose: () => void;
  onSelectGame: (game: GameMode) => void;
  onResetAll: () => void;
}

const GAME_INFO: { id: GameMode; name: string; emoji: string; bg: string }[] = [
  { id: 'circle', name: 'Circle', emoji: '⭕', bg: '#FFC93C' },
  { id: 'line', name: 'Straight Line', emoji: '📏', bg: '#7C77B9' },
  { id: 'second', name: 'The Second', emoji: '⏱️', bg: '#FF4B4B' },
  { id: 'middle', name: 'The Middle', emoji: '🎯', bg: '#2EC4B6' },
  { id: 'color', name: 'The Color', emoji: '🎨', bg: '#FF9F1C' },
  { id: 'square', name: 'The Square', emoji: '⬛', bg: '#4ECDC4' },
  { id: 'craft', name: 'Infinite Craft', emoji: '♾️', bg: '#FFC93C' },
];

export const StatsModal: React.FC<StatsModalProps> = ({
  scores,
  onClose,
  onSelectGame,
  onResetAll,
}) => {
  const scoreEntries = (Object.entries(scores) as [string, BestScoreRecord | undefined][])
    .filter((entry): entry is [string, BestScoreRecord] => entry[1] !== undefined)
    .map(([k, v]) => ({ key: k, ...v }));
  const completedCount = scoreEntries.length;
  const avgScore = completedCount > 0
    ? (scoreEntries.reduce((acc, curr) => acc + curr.score, 0) / completedCount).toFixed(1)
    : '0.0';

  const getRank = (avg: number) => {
    if (avg >= 95) return { title: 'Precision Grandmaster', badge: '👑' };
    if (avg >= 85) return { title: 'Architectural Prodigy', badge: '📐' };
    if (avg >= 70) return { title: 'Steady-Hand Artisan', badge: '🎨' };
    if (avg >= 50) return { title: 'Caffeinated Explorer', badge: '☕' };
    return { title: 'Uncalibrated Apprentice', badge: '🥔' };
  };

  const rank = getRank(parseFloat(avgScore));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        id="stats-modal-card"
        className="w-full max-w-md bg-white rounded-3xl p-6 border-[2.5px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-5 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 border border-neutral-300 hover:bg-neutral-200 transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-4 h-4 text-[#1A1A1A] stroke-[3]" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 pt-1">
          <Trophy className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h3 className="font-black text-base uppercase tracking-wider text-[#1A1A1A]">
            PRECISION PASSPORT
          </h3>
        </div>

        {/* Master Rank Card */}
        <div className="w-full bg-amber-400 rounded-2xl border-[2px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{rank.badge}</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
                GLOBAL RANK
              </span>
              <span className="text-sm sm:text-base font-black text-[#1A1A1A]">
                {rank.title}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
              MASTER AVG
            </span>
            <span className="text-2xl font-black text-[#1A1A1A]">
              {avgScore}%
            </span>
          </div>
        </div>

        {/* Games Score List */}
        <div className="w-full flex flex-col gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
            Personal Best Records ({completedCount}/{GAME_INFO.length})
          </span>

          <div className="w-full flex flex-col gap-2">
            {GAME_INFO.map((g) => {
              const record = scores[g.id as keyof AllGameScores];
              const hasRecord = record !== undefined;

              return (
                <div
                  key={g.id}
                  className="w-full bg-neutral-50 rounded-2xl border border-neutral-200 p-3 flex items-center justify-between hover:bg-neutral-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{g.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[#1A1A1A]">
                        {g.name}
                      </span>
                      <span className="text-[11px] font-medium text-neutral-500 line-clamp-1">
                        {hasRecord ? record.verdict : 'Not calibrated yet'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-base text-[#1A1A1A]">
                      {hasRecord
                        ? g.id === 'craft'
                          ? `${record.score} items`
                          : `${record.score.toFixed(1)}%`
                        : '—'}
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onClose();
                        onSelectGame(g.id);
                      }}
                      className="p-1.5 rounded-xl bg-[#1A1A1A] text-white hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                      title={`Play ${g.name}`}
                    >
                      <Play className="w-3 h-3 fill-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-neutral-100">
          <button
            onClick={() => {
              if (confirm('Reset all saved precision game scores?')) {
                sound.playClick();
                onResetAll();
              }
            }}
            className="text-xs font-bold text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,201,60,1)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-neutral-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
