import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BestScoreRecord, SecondRoundResult, SecondGameSummary } from '../../types';
import { SECOND_TARGETS, getSecondRating } from '../../utils/secondTiming';
import { sound } from '../../utils/audio';
import { Clock, RotateCcw, Trophy, Share2, Check, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TheSecondGameProps {
  onScoreSave: (score: BestScoreRecord) => void;
  bestScore?: BestScoreRecord | null;
  onOpenShareModal: (title: string, score: number, verdict: string) => void;
}

export const TheSecondGame: React.FC<TheSecondGameProps> = ({
  onScoreSave,
  bestScore,
  onOpenShareModal,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [liveElapsedMs, setLiveElapsedMs] = useState(0);
  const [roundResults, setRoundResults] = useState<SecondRoundResult[]>([]);
  const [lastRoundResult, setLastRoundResult] = useState<SecondRoundResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const holdStartRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentTarget = SECOND_TARGETS[currentRoundIdx] || SECOND_TARGETS[0];

  // Tick update while holding
  const updateTick = useCallback(() => {
    if (holdStartRef.current !== null) {
      const now = performance.now();
      const elapsed = now - holdStartRef.current;
      setLiveElapsedMs(elapsed);
      animFrameRef.current = requestAnimationFrame(updateTick);
    }
  }, []);

  // Start Holding
  const handleStartHold = useCallback(() => {
    if (isCompleted || isHolding) return;

    holdStartRef.current = performance.now();
    setIsHolding(true);
    setLastRoundResult(null);
    sound.startHoldHum();
    animFrameRef.current = requestAnimationFrame(updateTick);
  }, [isCompleted, isHolding, updateTick]);

  // Stop Holding
  const handleStopHold = useCallback(() => {
    if (!isHolding || holdStartRef.current === null) return;

    const stopTime = performance.now();
    const elapsedMs = stopTime - holdStartRef.current;
    holdStartRef.current = null;
    setIsHolding(false);
    sound.stopHoldHum();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const targetMs = currentTarget.targetMs;
    const diffMs = Math.abs(elapsedMs - targetMs);
    const { rating, score } = getSecondRating(diffMs);

    sound.playScoreFanfare(score);

    const roundRes: SecondRoundResult = {
      round: currentRoundIdx + 1,
      targetMs,
      actualMs: Math.round(elapsedMs),
      diffMs: Math.round(diffMs),
      score,
      rating,
    };

    setLastRoundResult(roundRes);
    const updatedResults = [...roundResults, roundRes];
    setRoundResults(updatedResults);

    // Check if game complete (10 rounds)
    if (currentRoundIdx + 1 >= SECOND_TARGETS.length) {
      setIsCompleted(true);
      const totalScore = updatedResults.reduce((acc, r) => acc + r.score, 0);
      const avgFinalScore = Math.round((totalScore / updatedResults.length) * 10) / 10;
      const avgDiff = Math.round(updatedResults.reduce((acc, r) => acc + r.diffMs, 0) / updatedResults.length);

      let verdict = 'Basically a Human Clock ⏱️';
      if (avgDiff > 300) verdict = 'Did you fall asleep? 💤';
      else if (avgDiff > 100) verdict = 'Pretty Sharp Timing ⚡';
      else if (avgDiff > 30) verdict = 'Metronome Precision 🎵';

      if (!bestScore || avgFinalScore > bestScore.score) {
        setIsNewBest(true);
        onScoreSave({
          score: avgFinalScore,
          date: new Date().toISOString(),
          verdict,
          extra: `±${avgDiff}ms avg`,
        });
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF4B4B', '#FFC93C', '#1A1A1A'],
        });
      }
    } else {
      setCurrentRoundIdx((prev) => prev + 1);
    }
  }, [isHolding, currentTarget, currentRoundIdx, roundResults, bestScore, onScoreSave]);

  // Spacebar event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isHolding) {
        e.preventDefault();
        handleStartHold();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isHolding) {
        e.preventDefault();
        handleStopHold();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleStartHold, handleStopHold, isHolding]);

  const handleRestart = () => {
    sound.playClick();
    setCurrentRoundIdx(0);
    setRoundResults([]);
    setLastRoundResult(null);
    setIsCompleted(false);
    setIsNewBest(false);
    setLiveElapsedMs(0);
  };

  const handleQuickShare = async () => {
    sound.playClick();
    const finalScore = roundResults.length > 0
      ? (roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length).toFixed(1)
      : '95';
    const text = `I scored ${finalScore}% across 10 rounds in "The Second" precision timing game! Can you beat my timing?`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none gap-4">
      {/* Title Header */}
      <div className="text-center pt-1">
        <h1 className="text-[36px] sm:text-[52px] font-[900] leading-[0.9] uppercase tracking-tighter text-[#1A1A1A] mb-2">
          THE SECOND
        </h1>
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#1A1A1A] opacity-75">
          Hold spacebar or button to match the target duration.
        </p>
      </div>

      {/* Main Timing Card */}
      {!isCompleted ? (
        <div 
          id="second-timing-card"
          className="w-full max-w-[480px] bg-white rounded-[32px] border-[3px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 flex flex-col items-center gap-6 text-center"
        >
          {/* Round Indicator & Best Score Header */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase bg-[#1A1A1A] text-white px-3 py-1 rounded-full">
                Round {currentRoundIdx + 1}/10
              </span>
              <span className="text-xs font-bold text-neutral-400">
                ({currentTarget.difficulty})
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-black uppercase text-[#FF4B4B]">
              <Trophy className="w-3.5 h-3.5" />
              <span>BEST: {bestScore ? `${bestScore.score.toFixed(1)}%` : '—'}</span>
            </div>
          </div>

          {/* Target Display */}
          <div className="flex flex-col items-center my-2">
            <span className="text-[12px] font-black uppercase tracking-widest text-neutral-400">
              TARGET DURATION
            </span>
            <div className="text-[64px] sm:text-[76px] font-[900] text-[#1A1A1A] tracking-tighter leading-none mt-1">
              {currentTarget.label}
            </div>
          </div>

          {/* Live Timer Readout while holding */}
          <div className="h-12 flex items-center justify-center">
            {isHolding ? (
              <div className="text-2xl sm:text-3xl font-mono font-black text-[#FF4B4B] animate-pulse">
                {(liveElapsedMs / 1000).toFixed(3)}s
              </div>
            ) : lastRoundResult ? (
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-[#1A1A1A]">
                  {(lastRoundResult.actualMs / 1000).toFixed(3)}s (±{lastRoundResult.diffMs}ms)
                </span>
                <span className="text-xs font-bold text-[#FF4B4B]">
                  {lastRoundResult.rating}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Press & Hold to Start
              </span>
            )}
          </div>

          {/* Big Hold Button */}
          <button
            id="second-hold-btn"
            onPointerDown={handleStartHold}
            onPointerUp={handleStopHold}
            onPointerLeave={handleStopHold}
            className={`w-full py-6 rounded-[40px] font-[900] text-[20px] sm:text-[24px] uppercase tracking-wider border-[3px] border-[#1A1A1A] transition-all cursor-pointer select-none ${
              isHolding
                ? 'bg-[#FF4B4B] text-white shadow-inner scale-[0.98]'
                : 'bg-[#FFC93C] text-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isHolding ? 'RELEASE NOW!' : 'HOLD SPACE / BUTTON'}
          </button>

          {/* Round Dots Progression */}
          <div className="flex items-center gap-1.5 pt-2">
            {SECOND_TARGETS.map((t, idx) => {
              const res = roundResults[idx];
              const isPast = idx < currentRoundIdx;
              const isCurrent = idx === currentRoundIdx;

              return (
                <div
                  key={t.round}
                  className={`w-3 h-3 rounded-full border-[1.5px] border-[#1A1A1A] transition-all ${
                    isPast
                      ? res && res.score >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                      : isCurrent
                      ? 'bg-[#1A1A1A] scale-125 ring-2 ring-[#FF4B4B]'
                      : 'bg-neutral-200 opacity-60'
                  }`}
                  title={`Round ${t.round}: ${t.label}`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        /* Summary Card upon Completion */
        <div 
          id="second-summary-card"
          className="w-full max-w-[480px] bg-white rounded-[32px] border-[3px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 flex flex-col items-center gap-5 text-center"
        >
          {isNewBest && (
            <div className="bg-[#FFC93C] text-[#1A1A1A] font-black text-xs px-4 py-1.5 rounded-full border-[2.5px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
              <Trophy className="w-3.5 h-3.5 fill-[#1A1A1A]" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">
              10-ROUND AVERAGE SCORE
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-6xl sm:text-7xl font-[900] tracking-tight text-[#1A1A1A] leading-none">
                {(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length).toFixed(1)}
              </span>
              <span className="text-3xl sm:text-4xl font-[900] text-[#FF4B4B]">%</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-[900] text-[#1A1A1A] mt-2 leading-tight">
              Average Off: ±{Math.round(roundResults.reduce((a, b) => a + b.diffMs, 0) / roundResults.length)}ms
            </h2>
          </div>

          {/* Mini Breakdown Table */}
          <div className="w-full max-h-48 overflow-y-auto rounded-2xl border-[2.5px] border-[#1A1A1A] bg-[#FAFAFA] p-3 text-xs">
            <div className="grid grid-cols-4 font-black uppercase text-neutral-400 border-b border-neutral-200 pb-1.5 mb-1.5 text-[10px]">
              <span>Round</span>
              <span>Target</span>
              <span>Actual</span>
              <span>Diff</span>
            </div>
            {roundResults.map((r) => (
              <div key={r.round} className="grid grid-cols-4 font-bold text-[#1A1A1A] py-1 border-b border-neutral-100 last:border-none">
                <span>#{r.round}</span>
                <span>{(r.targetMs / 1000).toFixed(3)}s</span>
                <span>{(r.actualMs / 1000).toFixed(3)}s</span>
                <span className={r.diffMs <= 50 ? 'text-emerald-600 font-black' : 'text-[#FF4B4B] font-black'}>
                  ±{r.diffMs}ms
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="second-play-again-btn"
              onClick={handleRestart}
              className="flex-1 bg-[#1A1A1A] text-white py-4 px-6 rounded-[50px] font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Play Again</span>
            </button>

            <button
              id="second-share-btn"
              onClick={handleQuickShare}
              className="flex-1 bg-white border-[3px] border-[#1A1A1A] text-[#1A1A1A] py-4 px-6 rounded-[50px] font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Share2 className="w-4 h-4 stroke-[2.5]" />}
              <span>{copied ? 'Copied!' : 'Share Score'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
