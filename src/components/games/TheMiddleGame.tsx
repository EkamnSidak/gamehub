import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BestScoreRecord, MiddleRoundResult } from '../../types';
import { MIDDLE_ROUNDS, getMiddleRating } from '../../utils/middleShapes';
import { sound } from '../../utils/audio';
import { Target, Trophy, RotateCcw, Share2, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TheMiddleGameProps {
  onScoreSave: (score: BestScoreRecord) => void;
  bestScore?: BestScoreRecord | null;
  onOpenShareModal: (title: string, score: number, verdict: string) => void;
}

export const TheMiddleGame: React.FC<TheMiddleGameProps> = ({
  onScoreSave,
  bestScore,
  onOpenShareModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [roundResults, setRoundResults] = useState<MiddleRoundResult[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{
    clickX: number;
    clickY: number;
    targetX: number;
    targetY: number;
    dist: number;
    rating: string;
    verdict: string;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isWaitingNext, setIsWaitingNext] = useState(false);

  const trueCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentRoundConfig = MIDDLE_ROUNDS[currentRoundIdx] || MIDDLE_ROUNDS[0];

  // Draw current shape on canvas
  const drawCurrentShape = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Render the shape and record its true center
    const center = currentRoundConfig.draw(ctx, rect.width, rect.height);
    trueCenterRef.current = center;

    // If feedback is active, draw user click & center marker with connecting line
    if (lastFeedback) {
      const { clickX, clickY, targetX, targetY, dist } = lastFeedback;

      // Connecting line
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#FF4B4B';
      ctx.lineWidth = 2.5;
      ctx.moveTo(clickX, clickY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.restore();

      // True Center (Green Target)
      ctx.save();
      ctx.beginPath();
      ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#2EC4B6';
      ctx.fill();
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Center crosshair
      ctx.beginPath();
      ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#1A1A1A';
      ctx.fill();
      ctx.restore();

      // User Click (Red Point)
      ctx.save();
      ctx.beginPath();
      ctx.arc(clickX, clickY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#FF4B4B';
      ctx.fill();
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  }, [currentRoundConfig, lastFeedback]);

  useEffect(() => {
    drawCurrentShape();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      drawCurrentShape();
    });

    observer.observe(container);

    const onWindowResize = () => {
      drawCurrentShape();
    };

    window.addEventListener('resize', onWindowResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onWindowResize);
    };
  }, [drawCurrentShape]);

  // Click Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isWaitingNext || isCompleted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const { x: targetX, y: targetY } = trueCenterRef.current;
    const dist = Math.hypot(clickX - targetX, clickY - targetY);
    const score = Math.round(Math.max(0, 100 - (dist / 2.5)) * 10) / 10;
    const { rating, verdict } = getMiddleRating(dist);

    sound.playPop();
    sound.playScoreFanfare(score);

    setLastFeedback({ clickX, clickY, targetX, targetY, dist, rating, verdict });

    const roundRes: MiddleRoundResult = {
      round: currentRoundIdx + 1,
      shapeName: currentRoundConfig.title,
      targetX,
      targetY,
      clickX,
      clickY,
      distancePx: Math.round(dist * 10) / 10,
      score,
      rating,
    };

    const updated = [...roundResults, roundRes];
    setRoundResults(updated);
    setIsWaitingNext(true);

    // Auto advance or finish after 1200ms
    setTimeout(() => {
      if (currentRoundIdx + 1 >= MIDDLE_ROUNDS.length) {
        setIsCompleted(true);
        setIsWaitingNext(false);
        setLastFeedback(null);

        const avgScore = Math.round((updated.reduce((a, b) => a + b.score, 0) / updated.length) * 10) / 10;
        const avgDist = Math.round((updated.reduce((a, b) => a + b.distancePx, 0) / updated.length) * 10) / 10;

        let finalVerdict = 'Sniper-Level Midpoint Finding 🎯';
        if (avgDist > 50) finalVerdict = 'Different Zip Code 📍';
        else if (avgDist > 20) finalVerdict = 'Respectable Spatial Eye 📐';

        if (!bestScore || avgScore > bestScore.score) {
          setIsNewBest(true);
          onScoreSave({
            score: avgScore,
            date: new Date().toISOString(),
            verdict: finalVerdict,
            extra: `${avgDist}px avg off`,
          });
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#2EC4B6', '#FFC93C', '#FF4B4B', '#1A1A1A'],
          });
        }
      } else {
        setCurrentRoundIdx((prev) => prev + 1);
        setLastFeedback(null);
        setIsWaitingNext(false);
      }
    }, 1100);
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentRoundIdx(0);
    setRoundResults([]);
    setLastFeedback(null);
    setIsCompleted(false);
    setIsNewBest(false);
    setIsWaitingNext(false);
  };

  const handleQuickShare = async () => {
    sound.playClick();
    const avgScore = (roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length).toFixed(1);
    const avgDist = (roundResults.reduce((a, b) => a + b.distancePx, 0) / roundResults.length).toFixed(1);
    const text = `I averaged ${avgDist}px off (${avgScore}% score) across 10 shapes in "The Middle" spatial precision game! Try to beat my eye.`;
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
          THE MIDDLE
        </h1>
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#1A1A1A] opacity-75">
          Click where you believe the exact center/midpoint is.
        </p>
      </div>

      {!isCompleted ? (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Main Spatial Canvas Card */}
          <div
            ref={containerRef}
            id="middle-canvas-container"
            className="relative w-full max-w-[480px] h-[300px] sm:h-[380px] max-h-[58vh] sm:max-h-none bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 transition-transform overflow-hidden touch-none"
          >
            {/* Top Toolbar */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 flex items-center gap-1.5 sm:gap-2 pointer-events-none z-10">
              <span className="text-[10px] sm:text-xs font-black uppercase bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full">
                Round {currentRoundIdx + 1}/10
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-neutral-400 truncate max-w-[120px] sm:max-w-none">
                {currentRoundConfig.title}
              </span>
            </div>

            <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase text-rose-500 pointer-events-none z-10">
              <Trophy className="w-3.5 h-3.5" />
              <span>RECORD: {bestScore ? `${bestScore.score.toFixed(1)}%` : '—'}</span>
            </div>

            <canvas
              ref={canvasRef}
              id="middle-canvas"
              onClick={handleCanvasClick}
              className="w-full h-full rounded-2xl cursor-crosshair touch-none bg-white"
            />

            {/* Live feedback popup on click */}
            {lastFeedback && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full border-[2px] border-white shadow-lg text-xs font-black uppercase tracking-wider animate-in fade-in zoom-in duration-150 z-20 whitespace-nowrap">
                {lastFeedback.rating}
              </div>
            )}
          </div>

          {/* Round Dots Indicator */}
          <div className="flex items-center gap-1.5 pt-1">
            {MIDDLE_ROUNDS.map((r, idx) => {
              const res = roundResults[idx];
              const isPast = idx < currentRoundIdx;
              const isCurrent = idx === currentRoundIdx;

              return (
                <div
                  key={r.round}
                  className={`w-3 h-3 rounded-full border-[1.5px] border-[#1A1A1A] transition-all ${
                    isPast
                      ? res && res.score >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                      : isCurrent
                      ? 'bg-[#1A1A1A] scale-125 ring-2 ring-[#2EC4B6]'
                      : 'bg-neutral-200 opacity-60'
                  }`}
                  title={`Round ${r.round}: ${r.title}`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        /* Summary Screen */
        <div
          id="middle-summary-card"
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
              10-ROUND ACCURACY
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-6xl sm:text-7xl font-[900] tracking-tight text-[#1A1A1A] leading-none">
                {(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length).toFixed(1)}
              </span>
              <span className="text-3xl sm:text-4xl font-[900] text-[#2EC4B6]">%</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-[900] text-[#1A1A1A] mt-2 leading-tight">
              Avg Miss: {(roundResults.reduce((a, b) => a + b.distancePx, 0) / roundResults.length).toFixed(1)}px off
            </h2>
          </div>

          {/* Mini Results Grid */}
          <div className="w-full max-h-48 overflow-y-auto rounded-2xl border-[2.5px] border-[#1A1A1A] bg-[#FAFAFA] p-3 text-xs">
            <div className="grid grid-cols-3 font-black uppercase text-neutral-400 border-b border-neutral-200 pb-1.5 mb-1.5 text-[10px]">
              <span>Shape</span>
              <span>Distance</span>
              <span>Score</span>
            </div>
            {roundResults.map((r) => (
              <div key={r.round} className="grid grid-cols-3 font-bold text-[#1A1A1A] py-1 border-b border-neutral-100 last:border-none">
                <span>#{r.round} {r.shapeName}</span>
                <span className={r.distancePx <= 10 ? 'text-emerald-600 font-black' : 'text-[#FF4B4B] font-black'}>
                  {r.distancePx}px
                </span>
                <span>{r.score}%</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="middle-play-again-btn"
              onClick={handleRestart}
              className="flex-1 bg-[#1A1A1A] text-white py-4 px-6 rounded-[50px] font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Play Again</span>
            </button>

            <button
              id="middle-share-btn"
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
