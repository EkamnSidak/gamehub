import React from 'react';
import { Volume2, VolumeX, Eye, Trophy } from 'lucide-react';
import { GameTheme, BestScoreRecord } from '../types';
import { THEMES } from '../utils/themes';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTheme: GameTheme;
  onSelectTheme: (theme: GameTheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showGuide: boolean;
  onToggleGuide: () => void;
  bestScore: BestScoreRecord | null;
  onResetBest: () => void;
  attemptCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onSelectTheme,
  isMuted,
  onToggleMute,
  showGuide,
  onToggleGuide,
  bestScore,
  attemptCount,
}) => {
  const isDark = !currentTheme.darkText;

  return (
    <header className="w-full max-w-[800px] mx-auto flex flex-col items-center gap-4 select-none">
      {/* Top Controls Toolbar */}
      <div className="w-full flex items-center justify-between px-2 text-sm font-semibold">
        {/* Best Score Pill */}
        <div 
          id="best-score-badge"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#1A1A1A] border-[2.5px] border-[#1A1A1A] artistic-shadow-sm text-xs md:text-sm font-black uppercase tracking-wider"
        >
          <Trophy className="w-4 h-4 text-[#FF4B4B] fill-[#FF4B4B]" />
          <span>
            BEST: <strong className="font-[900]">{bestScore ? `${bestScore.score.toFixed(1)}%` : '—'}</strong>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Guide Toggle */}
          <button
            id="guide-toggle-btn"
            onClick={() => {
              sound.playClick();
              onToggleGuide();
            }}
            title={showGuide ? "Hide Practice Guide" : "Show Practice Guide Circle"}
            className={`p-2 rounded-full border-[2.5px] border-[#1A1A1A] transition-all active:scale-90 flex items-center justify-center cursor-pointer ${
              showGuide 
                ? 'bg-[#1A1A1A] text-white artistic-shadow-sm' 
                : 'bg-white text-[#1A1A1A] artistic-shadow-sm hover:bg-neutral-100'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={() => {
              onToggleMute();
              sound.playClick();
            }}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-full bg-white text-[#1A1A1A] border-[2.5px] border-[#1A1A1A] artistic-shadow-sm hover:bg-neutral-100 transition-all active:scale-90 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-[#1A1A1A]" />}
          </button>

          {/* Theme Switcher Dots */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border-[2.5px] border-[#1A1A1A] artistic-shadow-sm ml-1">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                id={`theme-btn-${theme.id}`}
                onClick={() => {
                  sound.playClick();
                  onSelectTheme(theme);
                }}
                title={`Theme: ${theme.name}`}
                style={{ backgroundColor: theme.bgColor }}
                className={`w-5 h-5 rounded-full border-[1.5px] border-[#1A1A1A] transition-transform cursor-pointer ${
                  currentTheme.id === theme.id ? 'scale-125 ring-2 ring-[#1A1A1A] ring-offset-1 z-10' : 'opacity-80 hover:opacity-100 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Artistic Title & Step Sequence */}
      <div className="text-center pt-1">
        <h1 
          className={`text-[38px] sm:text-[56px] font-[900] leading-[0.9] uppercase tracking-tighter mb-3 transition-colors ${
            isDark ? 'text-white' : 'text-[#1A1A1A]'
          }`}
        >
          DRAW A PERFECT CIRCLE
        </h1>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`h-3 w-3 rounded-full transition-colors ${isDark ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
          <div className={`h-3 w-3 rounded-full transition-opacity ${isDark ? 'bg-white' : 'bg-[#1A1A1A]'} ${attemptCount >= 1 ? 'opacity-100' : 'opacity-25'}`} />
          <div className={`h-3 w-3 rounded-full transition-opacity ${isDark ? 'bg-white' : 'bg-[#1A1A1A]'} ${attemptCount >= 2 ? 'opacity-100' : 'opacity-25'}`} />
          <span 
            className={`text-[13px] sm:text-[14px] font-black uppercase ml-2 tracking-widest ${
              isDark ? 'text-white/90' : 'text-[#1A1A1A]'
            }`}
          >
            {attemptCount === 0 ? 'READY TO DRAW' : `ATTEMPT #${attemptCount}`}
          </span>
        </div>
      </div>
    </header>
  );
};

