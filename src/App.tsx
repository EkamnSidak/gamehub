import React, { useState, useEffect } from 'react';
import { GameMode, GameTheme, BestScoreRecord, AllGameScores } from './types';
import { THEMES } from './utils/themes';
import { sound } from './utils/audio';
import { Navigation } from './components/Navigation';
import { GameHub } from './components/GameHub';
import { TheCircleGame } from './components/games/TheCircleGame';
import { StraightLineGame } from './components/games/StraightLineGame';
import { TheSecondGame } from './components/games/TheSecondGame';
import { TheMiddleGame } from './components/games/TheMiddleGame';
import { TheColorGame } from './components/games/TheColorGame';
import { TheSquareGame } from './components/games/TheSquareGame';
import { InfiniteCraftGame } from './components/games/InfiniteCraftGame';
import { StatsModal } from './components/StatsModal';
import { CommonShareModal } from './components/CommonShareModal';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('circle');
  const [currentTheme, setCurrentTheme] = useState<GameTheme>(THEMES[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [allScores, setAllScores] = useState<AllGameScores>({});
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    title: string;
    score: number;
    verdict: string;
  } | null>(null);

  // Load scores & preferences from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('precision_all_scores');
      if (savedScores) {
        setAllScores(JSON.parse(savedScores));
      } else {
        // Migration check from circle_best_score
        const legacyCircle = localStorage.getItem('circle_best_score');
        if (legacyCircle) {
          const parsed = JSON.parse(legacyCircle);
          setAllScores({ circle: parsed });
        }
      }

      const savedTheme = localStorage.getItem('precision_theme');
      if (savedTheme) {
        const found = THEMES.find((t) => t.id === savedTheme);
        if (found) setCurrentTheme(found);
      }

      const savedMute = localStorage.getItem('precision_games_muted');
      if (savedMute !== null) {
        setIsMuted(JSON.parse(savedMute));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectTheme = (theme: GameTheme) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem('precision_theme', theme.id);
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleScoreSave = (gameKey: keyof AllGameScores, record: BestScoreRecord) => {
    setAllScores((prev) => {
      const updated = { ...prev, [gameKey]: record };
      try {
        localStorage.setItem('precision_all_scores', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetAllScores = () => {
    setAllScores({});
    try {
      localStorage.removeItem('precision_all_scores');
      localStorage.removeItem('circle_best_score');
    } catch {
      // ignore
    }
  };

  const handleOpenShareModal = (title: string, score: number, verdict: string) => {
    setShareData({ title, score, verdict });
  };

  return (
    <div
      id="app-root-container"
      style={{ backgroundColor: currentTheme.bgColor }}
      className="min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-5 transition-colors duration-300 overflow-y-auto"
    >
      {/* Universal Top Navigation */}
      <Navigation
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        scores={allScores}
        onOpenStats={() => setIsStatsModalOpen(true)}
      />

      {/* Interactive Main Stage */}
      <main className="w-full max-w-[880px] my-auto flex flex-col items-center justify-center py-2 sm:py-4 px-1 sm:px-2">
        {currentMode === 'hub' && (
          <GameHub
            onSelectGame={(mode) => setCurrentMode(mode)}
            scores={allScores}
            darkText={currentTheme.darkText}
          />
        )}

        {currentMode === 'circle' && (
          <TheCircleGame
            onScoreSave={(score) => handleScoreSave('circle', score)}
            bestScore={allScores.circle}
            onOpenShareModal={handleOpenShareModal}
            currentTheme={currentTheme}
          />
        )}

        {currentMode === 'line' && (
          <StraightLineGame
            onScoreSave={(score) => handleScoreSave('line', score)}
            bestScore={allScores.line}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {currentMode === 'second' && (
          <TheSecondGame
            onScoreSave={(score) => handleScoreSave('second', score)}
            bestScore={allScores.second}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {currentMode === 'middle' && (
          <TheMiddleGame
            onScoreSave={(score) => handleScoreSave('middle', score)}
            bestScore={allScores.middle}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {currentMode === 'color' && (
          <TheColorGame
            onScoreSave={(score) => handleScoreSave('color', score)}
            bestScore={allScores.color}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {currentMode === 'square' && (
          <TheSquareGame
            onScoreSave={(score) => handleScoreSave('square', score)}
            bestScore={allScores.square}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {currentMode === 'craft' && (
          <InfiniteCraftGame
            onScoreSave={(score) => handleScoreSave('craft', score)}
            bestScore={allScores.craft}
            onOpenShareModal={handleOpenShareModal}
          />
        )}
      </main>

      {/* Global Bottom Credits */}
      <footer className="w-full flex flex-col items-center py-2.5 select-none mt-auto">
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center font-black uppercase text-[10px] sm:text-xs tracking-wider text-center px-3">
          <span className={`${currentTheme.darkText ? 'text-[#1A1A1A]' : 'text-white'} opacity-75`}>
            7 Precision Challenges
          </span>
          <span className={`${currentTheme.darkText ? 'text-[#1A1A1A]' : 'text-white'} opacity-40`}>•</span>
          <span className={`${currentTheme.darkText ? 'text-[#1A1A1A]' : 'text-white'} opacity-90`}>
            Developed by Sidakpreet &amp; Ekamdeep
          </span>
        </div>
      </footer>

      {/* Global Stats Modal */}
      {isStatsModalOpen && (
        <StatsModal
          scores={allScores}
          onClose={() => setIsStatsModalOpen(false)}
          onSelectGame={(game) => {
            setCurrentMode(game);
            setIsStatsModalOpen(false);
          }}
          onResetAll={handleResetAllScores}
        />
      )}

      {/* Universal Share Sticker Modal */}
      {shareData && (
        <CommonShareModal
          title={shareData.title}
          score={shareData.score}
          verdict={shareData.verdict}
          theme={currentTheme}
          onClose={() => setShareData(null)}
        />
      )}
    </div>
  );
}
