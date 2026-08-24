import React, { useEffect, useState } from 'react';
import { CircleResult } from '../types';
import { RotateCcw, Share2, Download, Check, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ScoreResultProps {
  result: CircleResult;
  onTryAgain?: () => void;
  onRetry?: () => void;
  onOpenShareModal?: () => void;
  onShare?: () => void;
  isNewBest: boolean;
  accentColor: string;
}

export const ScoreResult: React.FC<ScoreResultProps> = ({
  result,
  onTryAgain,
  onRetry,
  onOpenShareModal,
  onShare,
  isNewBest,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain();
    } else if (onRetry) {
      onRetry();
    }
  };

  const handleOpenShare = () => {
    if (onOpenShareModal) {
      onOpenShareModal();
    } else if (onShare) {
      onShare();
    }
  };

  // Animated Count Up
  useEffect(() => {
    let start = 0;
    const end = result.score;
    const duration = 650;
    const startTime = performance.now();

    const updateScore = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;
      setDisplayScore(Math.round(current * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };

    requestAnimationFrame(updateScore);

    // Confetti celebration if 90%+ or new best
    if (result.score >= 90 || isNewBest) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#FFC93C', '#FF4B4B', '#2EC4B6', '#7C77B9', '#1A1A1A'],
        });
      } catch {
        // ignore
      }
    }
  }, [result, isNewBest]);

  // Keyboard shortcut (Space or R to try again)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'r' || e.key === 'R') {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          sound.playClick();
          handleTryAgain();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTryAgain, onRetry]);

  const handleQuickShare = async () => {
    sound.playClick();
    const shareText = `⭕ I drew a circle with ${result.score.toFixed(1)}% accuracy in Draw a Perfect Circle!\nCan you beat my precision?`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Draw a Perfect Circle',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onOpenShareModal();
    }
  };

  return (
    <div 
      id="score-result-card"
      className="w-full max-w-[460px] bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 flex flex-col items-center gap-5 text-center mt-4 select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* New Record Banner if applicable */}
      {isNewBest && (
        <div className="bg-amber-400 text-[#1A1A1A] font-black text-xs px-4 py-1.5 rounded-full border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
          <Trophy className="w-3.5 h-3.5 fill-[#1A1A1A]" />
          <span>NEW PERSONAL RECORD!</span>
        </div>
      )}

      {/* Easter Egg Tag if any */}
      {result.easterEgg && (
        <div className="bg-purple-100 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>{result.easterEgg}</span>
        </div>
      )}

      {/* Big Animated Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-baseline justify-center gap-1">
          <span 
            id="score-percentage-number"
            className="text-6xl sm:text-7xl font-black tracking-tight text-[#1A1A1A] leading-none"
          >
            {displayScore.toFixed(1)}
          </span>
          <span className="text-3xl sm:text-4xl font-black text-rose-500">%</span>
        </div>

        {/* Witty Verdict */}
        <h2 className="text-[22px] sm:text-[26px] font-black text-[#1A1A1A] mt-2 leading-tight">
          {result.verdict}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-neutral-500 mt-1">
          {result.subVerdict}
        </p>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="w-full grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-2xl border-[2px] border-neutral-200 text-xs">
        <div className="flex flex-col items-center">
          <span className="text-neutral-400 font-black uppercase tracking-wider text-[10px]">Roundness</span>
          <span className="font-black text-[#1A1A1A] text-sm sm:text-base mt-0.5">{result.roundness.toFixed(0)}%</span>
        </div>
        <div className="flex flex-col items-center border-x-[1.5px] border-neutral-200">
          <span className="text-neutral-400 font-black uppercase tracking-wider text-[10px]">Closure Gap</span>
          <span className="font-black text-[#1A1A1A] text-sm sm:text-base mt-0.5">{result.closureGap.toFixed(0)}px</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-neutral-400 font-black uppercase tracking-wider text-[10px]">Speed</span>
          <span className="font-black text-[#1A1A1A] text-sm sm:text-base mt-0.5">{(result.drawnDurationMs / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* Modern Buttons Row */}
      <div className="w-full flex flex-col sm:flex-row gap-3 pt-1">
        {/* Primary Try Again Button */}
        <button
          id="try-again-btn"
          onClick={() => {
            sound.playClick();
            handleTryAgain();
          }}
          className="flex-1 bg-[#1A1A1A] text-white py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(255,201,60,1)] border border-neutral-700"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Try Again</span>
        </button>

        {/* Secondary Share Score Button */}
        <button
          id="share-score-btn"
          onClick={handleQuickShare}
          className="flex-1 bg-white border-[2px] border-[#1A1A1A] text-[#1A1A1A] py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Share2 className="w-4 h-4 stroke-[2.5]" />}
          <span>{copied ? 'Copied!' : 'Share Score'}</span>
        </button>
      </div>

      {/* Tertiary Sticker Export */}
      <button
        id="export-card-btn"
        onClick={() => {
          sound.playClick();
          handleOpenShare();
        }}
        className="text-[11px] font-black text-neutral-400 hover:text-neutral-900 uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Save Result Card PNG</span>
      </button>
    </div>
  );
};

