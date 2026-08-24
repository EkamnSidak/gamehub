import React from 'react';
import { GameMode, AllGameScores } from '../types';
import { sound } from '../utils/audio';
import { Trophy, Play, CheckCircle2, Sparkles, Compass } from 'lucide-react';

interface GameThumbnailsCardProps {
  currentMode: GameMode;
  onSelectGame: (mode: GameMode) => void;
  scores: AllGameScores;
  darkText?: boolean;
}

interface GameMetaItem {
  id: GameMode;
  title: string;
  tagline: string;
  emoji: string;
  themeColor: string;
  scoreKey: keyof AllGameScores;
  scoreUnit?: string;
  badge: string;
  renderThumbnail: () => React.ReactNode;
}

export const GameThumbnailsCard: React.FC<GameThumbnailsCardProps> = ({
  currentMode,
  onSelectGame,
  scores,
  darkText = true,
}) => {
  const games: GameMetaItem[] = [
    {
      id: 'craft',
      title: 'Infinite Craft',
      tagline: 'AI Alchemy & Discovery',
      emoji: '♾️',
      themeColor: '#FFC93C',
      scoreKey: 'craft',
      scoreUnit: 'Items',
      badge: 'POPULAR',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="craftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>
            <pattern id="craftGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
            </pattern>
          </defs>
          <rect width="200" height="120" fill="url(#craftGrad)" />
          <rect width="200" height="120" fill="url(#craftGrid)" />
          
          {/* Elements Fusing */}
          <g transform="translate(35, 60)">
            <rect x="-24" y="-18" width="48" height="36" rx="8" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" filter="drop-shadow(2px 2px 0px #1A1A1A)" />
            <text x="0" y="5" textAnchor="middle" fontSize="16">💧</text>
          </g>

          <g transform="translate(100, 60)">
            <circle cx="0" cy="0" r="14" fill="#1A1A1A" />
            <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFE600">+</text>
          </g>

          <g transform="translate(165, 60)">
            <rect x="-24" y="-18" width="48" height="36" rx="8" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" filter="drop-shadow(2px 2px 0px #1A1A1A)" />
            <text x="0" y="5" textAnchor="middle" fontSize="16">🔥</text>
          </g>

          {/* Emergent Steam Cloud above */}
          <g transform="translate(100, 22)">
            <rect x="-34" y="-10" width="68" height="20" rx="6" fill="#10B981" stroke="#1A1A1A" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FFFFFF">💨 STEAM (NEW!)</text>
          </g>
        </svg>
      ),
    },
    {
      id: 'circle',
      title: 'Draw a Circle',
      tagline: 'Radial Geometric Precision',
      emoji: '⭕',
      themeColor: '#FF4B4B',
      scoreKey: 'circle',
      scoreUnit: '%',
      badge: 'CLASSIC',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF5F5" />
              <stop offset="100%" stopColor="#FEE2E2" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#circGrad)" />
          
          {/* Guide Crosshair */}
          <line x1="100" y1="20" x2="100" y2="100" stroke="#F87171" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="40" y1="60" x2="160" y2="60" stroke="#F87171" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Perfect Guide Ring */}
          <circle cx="100" cy="60" r="38" fill="none" stroke="#FECACA" strokeWidth="1.5" />
          
          {/* Hand-drawn Stroke Loop */}
          <path
            d="M 100 22 C 140 22, 142 98, 100 98 C 60 98, 58 22, 100 22 Z"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="60" r="3" fill="#DC2626" />

          {/* Accuracy Tag */}
          <g transform="translate(100, 60)">
            <rect x="-24" y="-8" width="48" height="16" rx="8" fill="#1A1A1A" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="#22C55E">98.6%</text>
          </g>
        </svg>
      ),
    },
    {
      id: 'line',
      title: 'The Straight Line',
      tagline: 'Linear Steadiness',
      emoji: '📏',
      themeColor: '#7C77B9',
      scoreKey: 'line',
      scoreUnit: '%',
      badge: 'FOCUS',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F3FF" />
              <stop offset="100%" stopColor="#EDE9FE" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#lineGrad)" />
          
          {/* Ruler Marks */}
          <g stroke="#C4B5FD" strokeWidth="1">
            <line x1="30" y1="40" x2="30" y2="80" />
            <line x1="65" y1="50" x2="65" y2="70" />
            <line x1="100" y1="45" x2="100" y2="75" />
            <line x1="135" y1="50" x2="135" y2="70" />
            <line x1="170" y1="40" x2="170" y2="80" />
          </g>

          {/* Straight Laser Line */}
          <line x1="30" y1="60" x2="170" y2="60" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
          <circle cx="30" cy="60" r="5" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="170" cy="60" r="5" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Deviation Marker */}
          <g transform="translate(100, 24)">
            <rect x="-35" y="-9" width="70" height="18" rx="6" fill="#1A1A1A" />
            <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#A78BFA">0.4px DEV</text>
          </g>
        </svg>
      ),
    },
    {
      id: 'second',
      title: 'The Second',
      tagline: 'Millisecond Reflexes',
      emoji: '⏱️',
      themeColor: '#FF4B4B',
      scoreKey: 'second',
      scoreUnit: '%',
      badge: 'REFLEX',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="100%" stopColor="#FFE4E6" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#secGrad)" />
          
          {/* Stopwatch Dial */}
          <circle cx="100" cy="60" r="42" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
          
          {/* Ticks */}
          <line x1="100" y1="22" x2="100" y2="30" stroke="#E11D48" strokeWidth="2" />
          <line x1="100" y1="90" x2="100" y2="98" stroke="#E11D48" strokeWidth="2" />
          <line x1="62" y1="60" x2="70" y2="60" stroke="#E11D48" strokeWidth="2" />
          <line x1="130" y1="60" x2="138" y2="60" stroke="#E11D48" strokeWidth="2" />

          {/* Digital Time Center */}
          <text x="100" y="66" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1A1A1A" letterSpacing="-0.5">
            1.000s
          </text>

          {/* Mini Stopwatch Crown */}
          <rect x="94" y="12" width="12" height="6" rx="2" fill="#1A1A1A" />
        </svg>
      ),
    },
    {
      id: 'middle',
      title: 'The Middle',
      tagline: 'Spatial Midpoint Guess',
      emoji: '🎯',
      themeColor: '#2EC4B6',
      scoreKey: 'middle',
      scoreUnit: '%',
      badge: 'SPATIAL',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="midGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0FDFA" />
              <stop offset="100%" stopColor="#CCFBF1" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#midGrad)" />
          
          {/* Geometric Arc */}
          <path d="M 30 80 Q 100 15 170 80" fill="none" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="80" r="4" fill="#0F766E" />
          <circle cx="170" cy="80" r="4" fill="#0F766E" />

          {/* Exact Midpoint Target Reticle */}
          <circle cx="100" cy="47" r="14" fill="#14B8A6" fillOpacity="0.2" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="100" y1="36" x2="100" y2="58" stroke="#0F766E" strokeWidth="2" />
          <line x1="89" y1="47" x2="111" y2="47" stroke="#0F766E" strokeWidth="2" />
          <circle cx="100" cy="47" r="3" fill="#DC2626" />

          <g transform="translate(100, 102)">
            <rect x="-35" y="-8" width="70" height="16" rx="6" fill="#1A1A1A" />
            <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#2DD4BF">10 ROUNDS</text>
          </g>
        </svg>
      ),
    },
    {
      id: 'color',
      title: 'The Color',
      tagline: 'Perceptual Spectrum',
      emoji: '🎨',
      themeColor: '#FF9F1C',
      scoreKey: 'color',
      scoreUnit: '%',
      badge: 'VISION',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="colGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#colGrad)" />
          
          {/* Swatch 1: Target */}
          <g transform="translate(45, 30)">
            <rect x="0" y="0" width="50" height="50" rx="10" fill="#EC4899" stroke="#1A1A1A" strokeWidth="2" filter="drop-shadow(2px 2px 0px #1A1A1A)" />
            <text x="25" y="62" textAnchor="middle" fontSize="8" fontWeight="800" fill="#6B7280">TARGET</text>
          </g>

          {/* Equal Sign */}
          <text x="100" y="58" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1A1A1A">⇄</text>

          {/* Swatch 2: Match */}
          <g transform="translate(105, 30)">
            <rect x="0" y="0" width="50" height="50" rx="10" fill="#F43F5E" stroke="#1A1A1A" strokeWidth="2" filter="drop-shadow(2px 2px 0px #1A1A1A)" />
            <text x="25" y="62" textAnchor="middle" fontSize="8" fontWeight="800" fill="#6B7280">YOUR MIX</text>
          </g>

          {/* RGB Sliders Micro */}
          <g transform="translate(100, 102)">
            <rect x="-42" y="-8" width="84" height="16" rx="6" fill="#1A1A1A" />
            <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FBBF24">ΔE 0.8 MATCH</text>
          </g>
        </svg>
      ),
    },
    {
      id: 'square',
      title: 'The Square',
      tagline: '90° Orthogonal Angles',
      emoji: '⬛',
      themeColor: '#4ECDC4',
      scoreKey: 'square',
      scoreUnit: '%',
      badge: 'GEOMETRIC',
      renderThumbnail: () => (
        <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="sqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0FDFA" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#sqGrad)" />
          
          {/* Equilateral Square Drawing */}
          <rect x="65" y="25" width="70" height="70" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" strokeLinejoin="miter" />
          
          {/* Right Angle Markers */}
          <path d="M 65 37 L 77 37 L 77 25" fill="none" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M 123 25 L 123 37 L 135 37" fill="none" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M 135 83 L 123 83 L 123 95" fill="none" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M 77 95 L 77 83 L 65 83" fill="none" stroke="#0284C7" strokeWidth="1.5" />

          {/* Center Angle Stat */}
          <g transform="translate(100, 60)">
            <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#1A1A1A" />
            <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#38BDF8">90.0°</text>
          </g>
        </svg>
      ),
    },
  ];

  // Exclude the game currently being played by the user
  const visibleGames = games.filter((game) => game.id !== currentMode);

  return (
    <section
      id="all-games-deck-card"
      className="w-full max-w-[880px] bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5 mt-5 select-none transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3.5 border-b-2 border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-base">
            🎮
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1A1A] tracking-tight leading-tight">
              MORE PRECISION & DISCOVERY GAMES
            </h2>
            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              {visibleGames.length} other games available • Click to start playing instantly
            </p>
          </div>
        </div>

        {/* Quick Hub Jump */}
        {currentMode !== 'hub' && (
          <button
            id="jump-to-hub-btn"
            onClick={() => {
              sound.playClick();
              onSelectGame('hub');
            }}
            className="self-end sm:self-auto text-[11px] font-black uppercase px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-700" />
            <span>Game Hub</span>
          </button>
        )}
      </div>

      {/* Grid of 2 Thumbnails per row (3 rows total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {visibleGames.map((game) => {
          const scoreRecord = scores[game.scoreKey];
          const hasScore = scoreRecord !== undefined && scoreRecord !== null;

          return (
            <div
              key={game.id}
              id={`game-thumbnail-card-${game.id}`}
              onClick={() => {
                sound.playClick();
                onSelectGame(game.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative flex flex-row items-stretch bg-neutral-50 rounded-2xl border-[2px] border-[#1A1A1A] hover:border-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#1A1A1A] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Compact Visual Thumbnail Box */}
              <div className="relative w-32 sm:w-36 shrink-0 overflow-hidden bg-neutral-100 border-r-2 border-[#1A1A1A]">
                {game.renderThumbnail()}

                {/* Badge Overlay */}
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                  <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-white/95 border border-[#1A1A1A] text-[#1A1A1A] shadow-xs">
                    {game.badge}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-1.5 min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-black text-xs sm:text-sm uppercase text-[#1A1A1A] tracking-tight group-hover:text-amber-600 transition-colors flex items-center gap-1.5 truncate">
                      <span>{game.emoji}</span>
                      <span className="truncate">{game.title}</span>
                    </h3>
                    <span className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all flex items-center justify-center w-5 h-5 rounded-full bg-[#1A1A1A] text-white shrink-0">
                      <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-neutral-500 line-clamp-1">
                    {game.tagline}
                  </p>
                </div>

                {/* Score or Status Pill */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-200/70 text-[9px] sm:text-[10px] font-black">
                  {hasScore ? (
                    <div className="flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300">
                      <Trophy className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {scoreRecord.score}
                        {game.scoreUnit || ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic text-[9px]">Unplayed</span>
                  )}

                  <span className="font-black uppercase text-[9px] text-amber-600 group-hover:text-black flex items-center gap-0.5 shrink-0">
                    Play →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
