import React from 'react';
import { GameMode, AllGameScores, BestScoreRecord } from '../types';
import { Trophy, Play, Sparkles, ArrowRight, Target, Clock, Palette, Square, CircleDot, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameHubProps {
  onSelectGame: (mode: GameMode) => void;
  scores: AllGameScores;
  darkText: boolean;
}

interface GameCardMeta {
  id: GameMode;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  accentBg: string;
  gradient: string;
  difficulty: string;
}

const GAMES_LIST: GameCardMeta[] = [
  {
    id: 'craft',
    title: 'Infinite Craft',
    tagline: 'AI Emergent Alchemy',
    description: 'Combine 4 primordial elements to unlock infinite inventions, deities, celestial bodies, and memes.',
    emoji: '♾️',
    accentBg: '#FFC93C',
    gradient: 'from-yellow-400/20 to-emerald-400/10',
    difficulty: 'Infinite',
  },
  {
    id: 'circle',
    title: 'Draw a Circle',
    tagline: 'Radial Precision',
    description: 'Draw a single continuous freehand loop. Scored on geometric roundness, centroid consistency, and closure accuracy.',
    emoji: '⭕',
    accentBg: '#FFC93C',
    gradient: 'from-amber-400/20 to-orange-400/10',
    difficulty: 'Mastery',
  },
  {
    id: 'line',
    title: 'The Straight Line',
    tagline: 'Linear Steadiness',
    description: 'Draw the longest and straightest single continuous stroke. Penalized for angular deflection.',
    emoji: '📏',
    accentBg: '#7C77B9',
    gradient: 'from-indigo-400/20 to-purple-400/10',
    difficulty: 'Medium',
  },
  {
    id: 'second',
    title: 'The Second',
    tagline: 'Millisecond Timing',
    description: 'Press and hold space or tap to hit precise target intervals (1.000s, 0.500s, 2.750s, 0.100s).',
    emoji: '⏱️',
    accentBg: '#FF4B4B',
    gradient: 'from-rose-400/20 to-red-400/10',
    difficulty: 'Extreme',
  },
  {
    id: 'middle',
    title: 'The Middle',
    tagline: 'Spatial Midpoint',
    description: '10 rounds: click the exact mathematical midpoint of complex geometric segments, arcs, and spirals.',
    emoji: '🎯',
    accentBg: '#2EC4B6',
    gradient: 'from-teal-400/20 to-cyan-400/10',
    difficulty: 'Hard',
  },
  {
    id: 'color',
    title: 'The Color',
    tagline: 'Color Perception',
    description: 'Calibrate RGB channels to duplicate target swatches. Scored with perceptual CIELAB Delta-E distance.',
    emoji: '🎨',
    accentBg: '#FF9F1C',
    gradient: 'from-orange-400/20 to-amber-400/10',
    difficulty: 'Expert',
  },
  {
    id: 'square',
    title: 'The Square',
    tagline: '90° Orthogonal Angles',
    description: 'Draw a 1:1 equilateral square with 4 sharp right-angle corners in one continuous gesture.',
    emoji: '⬛',
    accentBg: '#4ECDC4',
    gradient: 'from-cyan-400/20 to-blue-400/10',
    difficulty: 'Hard',
  },
];

export const GameHub: React.FC<GameHubProps> = ({ onSelectGame, scores, darkText }) => {
  const scoreArray = (Object.entries(scores) as [string, BestScoreRecord | undefined][])
    .filter((entry): entry is [string, BestScoreRecord] => entry[1] !== undefined)
    .map(([k, v]) => ({ key: k, ...v }));
  const completedCount = scoreArray.length;
  const avgScore = completedCount > 0
    ? scoreArray.reduce((acc, curr) => acc + curr.score, 0) / completedCount
    : 0;

  const getMasterTitle = (avg: number) => {
    if (avg >= 95) return 'Precision Grandmaster 👑';
    if (avg >= 85) return 'Architectural Prodigy 📐';
    if (avg >= 70) return 'Steady-Hand Artisan 🎨';
    if (avg >= 50) return 'Calibrated Explorer ⚡';
    return 'Apprentice Precisionist 🌱';
  };

  return (
    <div className="w-full max-w-[880px] mx-auto flex flex-col items-center gap-6 py-4 px-2 select-none">
      {/* Hero Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-neutral-300 text-xs font-black uppercase tracking-wider mb-3 text-[#1A1A1A] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>7 Modern Precision & Discovery Challenges</span>
        </div>
        <h1 
          className={`text-[40px] sm:text-[58px] font-black leading-[0.95] uppercase tracking-tight mb-2 transition-colors ${
            darkText ? 'text-[#1A1A1A]' : 'text-white'
          }`}
        >
          PRECISION SUITE
        </h1>
        <p 
          className={`text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors ${
            darkText ? 'text-[#1A1A1A] opacity-75' : 'text-white opacity-90'
          }`}
        >
          Test your freehand accuracy, reflexes, and alchemical discovery
        </p>
      </div>

      {/* Modern Master Accuracy Bento Banner */}
      <div 
        id="master-index-card"
        className="w-full bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
              PRECISION RANK & MASTERY
            </span>
            <h2 className="text-[18px] sm:text-[22px] font-black text-[#1A1A1A] leading-tight">
              {completedCount > 0 ? getMasterTitle(avgScore) : 'Uncalibrated Ready'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-28 bg-neutral-100 rounded-full overflow-hidden border border-neutral-300">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (completedCount / 7) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-neutral-600">
                {completedCount}/7 Active • {completedCount > 0 ? `${avgScore.toFixed(1)}% Avg` : 'Play below'}
              </span>
            </div>
          </div>
        </div>

        <button
          id="hub-quick-play-btn"
          onClick={() => {
            sound.playClick();
            onSelectGame('circle');
          }}
          className="w-full sm:w-auto bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,201,60,1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-neutral-700"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Circle</span>
        </button>
      </div>

      {/* Modern Bento Grid for Games */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {GAMES_LIST.map((game) => {
          const record = scores[game.id as keyof AllGameScores];
          const hasScore = record !== undefined;

          return (
            <div
              key={game.id}
              id={`game-card-${game.id}`}
              onClick={() => {
                sound.playClick();
                onSelectGame(game.id);
              }}
              className="group relative bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all p-5 flex flex-col justify-between gap-4 cursor-pointer overflow-hidden"
            >
              {/* Card Top: Emoji Icon & Best Score Badge */}
              <div className="w-full flex items-start justify-between">
                <div 
                  style={{ backgroundColor: game.accentBg }}
                  className="w-12 h-12 rounded-2xl border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                >
                  {game.emoji}
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                    BEST
                  </span>
                  <span className="text-[18px] font-black text-[#1A1A1A] leading-none mt-0.5">
                    {hasScore
                      ? game.id === 'craft'
                        ? `${record.score} items`
                        : `${record.score.toFixed(1)}%`
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Card Middle: Title & Description */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-black text-[#1A1A1A] leading-tight">
                    {game.title}
                  </h3>
                </div>
                <span className="text-[11px] font-black uppercase text-rose-500 tracking-wider">
                  {game.tagline}
                </span>
                <p className="text-xs text-neutral-600 font-medium line-clamp-3 mt-1 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Card Bottom: Play Button */}
              <div className="w-full pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-700">
                  {game.difficulty}
                </span>

                <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#1A1A1A] group-hover:translate-x-1 transition-transform">
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
