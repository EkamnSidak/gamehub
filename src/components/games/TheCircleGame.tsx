import React, { useState } from 'react';
import { CircleResult, GameTheme, BestScoreRecord } from '../../types';
import { DrawingCanvas } from '../DrawingCanvas';
import { ScoreResult } from '../ScoreResult';
import { RecentHistory } from '../RecentHistory';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface TheCircleGameProps {
  onScoreSave: (score: BestScoreRecord) => void;
  bestScore?: BestScoreRecord | null;
  onOpenShareModal: (title: string, score: number, verdict: string) => void;
  currentTheme: GameTheme;
}

export const TheCircleGame: React.FC<TheCircleGameProps> = ({
  onScoreSave,
  bestScore,
  onOpenShareModal,
  currentTheme,
}) => {
  const [activeResult, setActiveResult] = useState<CircleResult | null>(null);
  const [history, setHistory] = useState<CircleResult[]>([]);
  const [isNewBest, setIsNewBest] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleScoreCalculated = (result: CircleResult) => {
    setActiveResult(result);
    setHistory((prev) => [result, ...prev.slice(0, 7)]);

    if (!bestScore || result.score > bestScore.score) {
      setIsNewBest(true);
      onScoreSave({
        score: result.score,
        date: new Date().toISOString(),
        verdict: result.verdict,
        extra: result.subVerdict,
      });

      if (result.score >= 80) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC93C', '#FF4B4B', '#2EC4B6', '#1A1A1A'],
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none gap-3 sm:gap-4 px-1 sm:px-2">
      {/* Title Header */}
      <div className="text-center pt-1">
        <h1 className="text-[26px] xs:text-[34px] sm:text-[48px] font-black leading-tight uppercase tracking-tight text-[#1A1A1A] mb-1">
          DRAW A PERFECT CIRCLE
        </h1>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1A1A1A] opacity-75">
          Draw a circle in one continuous stroke • Lift to score
        </p>
      </div>

      {/* Main Canvas Card */}
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <DrawingCanvas
          onScoreCalculated={handleScoreCalculated}
          showGuide={showGuide}
          activeResult={activeResult}
          onClear={() => {
            setActiveResult(null);
            setIsNewBest(false);
          }}
          accentColor={currentTheme.accentColor}
          bestScore={bestScore}
        />

        {/* Score & Verdict Card */}
        {activeResult && (
          <div className="w-full mt-4">
            <ScoreResult
              result={activeResult}
              isNewBest={isNewBest}
              onTryAgain={() => {
                sound.playClick();
                setActiveResult(null);
                setIsNewBest(false);
              }}
              onRetry={() => {
                sound.playClick();
                setActiveResult(null);
                setIsNewBest(false);
              }}
              onOpenShareModal={() => {
                onOpenShareModal('DRAW A PERFECT CIRCLE', activeResult.score, activeResult.verdict);
              }}
              onShare={() => {
                onOpenShareModal('DRAW A PERFECT CIRCLE', activeResult.score, activeResult.verdict);
              }}
              accentColor={currentTheme.accentColor}
            />
          </div>
        )}
      </div>

      {/* Recent History Strip */}
      <footer className="w-full flex flex-col items-center mt-2">
        <RecentHistory
          history={history}
          activeId={activeResult?.id || null}
          onSelect={(item) => setActiveResult(item)}
          onClearAll={() => setHistory([])}
          accentColor={currentTheme.accentColor}
          darkText={currentTheme.darkText}
        />
      </footer>
    </div>
  );
};
