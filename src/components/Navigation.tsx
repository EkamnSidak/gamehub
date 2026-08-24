import React from 'react';
import { Volume2, VolumeX, LayoutGrid, Trophy, Sparkles } from 'lucide-react';
import { GameMode, GameTheme, AllGameScores, BestScoreRecord } from '../types';
import { THEMES } from '../utils/themes';
import { sound } from '../utils/audio';

interface NavigationProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  currentTheme: GameTheme;
  onSelectTheme: (theme: GameTheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  scores: AllGameScores;
  onOpenStats: () => void;
}

const GAME_TABS: { id: GameMode; name: string; icon: string; bg: string }[] = [
  { id: 'craft', name: 'Craft', icon: '♾️', bg: '#FFC93C' },
  { id: 'circle', name: 'Circle', icon: '⭕', bg: '#FFC93C' },
  { id: 'line', name: 'Line', icon: '📏', bg: '#7C77B9' },
  { id: 'second', name: 'Second', icon: '⏱️', bg: '#FF4B4B' },
  { id: 'middle', name: 'Middle', icon: '🎯', bg: '#2EC4B6' },
  { id: 'color', name: 'Color', icon: '🎨', bg: '#FF9F1C' },
  { id: 'square', name: 'Square', icon: '⬛', bg: '#4ECDC4' },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentMode,
  onSelectMode,
  currentTheme,
  onSelectTheme,
  isMuted,
  onToggleMute,
  scores,
  onOpenStats,
}) => {
  const isDark = !currentTheme.darkText;

  // Calculate master average score if any games played
  const scoreValues = (Object.values(scores) as (BestScoreRecord | undefined)[])
    .map((s) => s?.score)
    .filter((s): s is number => typeof s === 'number');
  const avgMasterScore = scoreValues.length > 0
    ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
    : null;

  return (
    <header className="w-full max-w-[880px] mx-auto flex flex-col gap-2.5 select-none px-1 sm:px-2 pt-1 sm:pt-2">
      {/* Top Floating Glass Island Bar */}
      <div className={`w-full flex items-center justify-between p-1.5 sm:p-2 rounded-2xl border-[2px] transition-all backdrop-blur-md gap-1.5 ${
        isDark 
          ? 'bg-neutral-900/85 border-neutral-700/80 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]' 
          : 'bg-white/95 border-[#1A1A1A] text-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
      }`}>
        {/* Left: Brand / Hub Link & Stats */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="nav-hub-btn"
            onClick={() => {
              sound.playClick();
              onSelectMode('hub');
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border-[2px] border-[#1A1A1A] transition-all cursor-pointer ${
              currentMode === 'hub'
                ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-[#1A1A1A] hover:bg-neutral-100 active:scale-95 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold">Hub</span>
          </button>

          {/* Master Stats Pill */}
          <button
            id="nav-stats-btn"
            onClick={() => {
              sound.playClick();
              onOpenStats();
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-white text-[#1A1A1A] border-[2px] border-[#1A1A1A] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-[11px] sm:text-xs font-black uppercase tracking-wider hover:bg-neutral-50 active:scale-95 cursor-pointer"
          >
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
            <span>
              {avgMasterScore ? `${avgMasterScore}%` : 'Stats'}
            </span>
          </button>
        </div>

        {/* Right: Sound & Themes */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            id="nav-sound-btn"
            onClick={() => {
              onToggleMute();
              sound.playClick();
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 sm:p-2 rounded-xl bg-white text-[#1A1A1A] border-[2px] border-[#1A1A1A] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 transition-all active:scale-90 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1A1A1A]" />}
          </button>

          {/* Modern Theme Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-[2px] border-[#1A1A1A] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTheme(theme);
                }}
                title={`Theme: ${theme.name} (${theme.tag})`}
                style={{ backgroundColor: theme.bgColor }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md sm:rounded-lg border-[1.5px] border-[#1A1A1A] transition-transform cursor-pointer ${
                  currentTheme.id === theme.id ? 'scale-125 ring-2 ring-[#1A1A1A] z-10' : 'opacity-70 hover:opacity-100 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Modern Game Selector Pills */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center px-0.5">
        {GAME_TABS.map((tab) => {
          const isSelected = currentMode === tab.id;
          const best = scores[tab.id as keyof AllGameScores]?.score;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectMode(tab.id);
              }}
              className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border-[2px] border-[#1A1A1A] text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] scale-[1.03] z-10'
                  : 'bg-white text-[#1A1A1A] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100'
              }`}
            >
              <span className="text-xs sm:text-sm">{tab.icon}</span>
              <span>{tab.name}</span>
              {best !== undefined && (
                <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded ml-0.5 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-800'
                }`}>
                  {tab.id === 'craft' ? `${best}🧪` : `${best.toFixed(0)}%`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
