import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, StraightLineResult, BestScoreRecord } from '../../types';
import { calculateStraightLineScore } from '../../utils/straightLineScoring';
import { sound } from '../../utils/audio';
import { RotateCcw, Share2, Sparkles, Trophy, Download, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StraightLineGameProps {
  onScoreSave: (score: BestScoreRecord) => void;
  bestScore?: BestScoreRecord | null;
  onOpenShareModal: (title: string, score: number, verdict: string) => void;
}

export const StraightLineGame: React.FC<StraightLineGameProps> = ({
  onScoreSave,
  bestScore,
  onOpenShareModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeResult, setActiveResult] = useState<StraightLineResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const pointsRef = useRef<Point[]>([]);
  const lastPointRef = useRef<Point | null>(null);

  // Resize canvas for device pixel ratio with ResizeObserver
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Redraw canvas state
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Subtle graph grid background
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = step; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    // 2. If result exists, render overlays
    if (activeResult) {
      const { startPoint, endPoint, points, worstDeviationPoint } = activeResult;

      // Ideal straight reference line (red dashed)
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#FF4B4B';
      ctx.lineWidth = 2.5;
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
      ctx.restore();

      // Start and end anchor dots
      ctx.save();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 6, 0, Math.PI * 2);
      ctx.arc(endPoint.x, endPoint.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // User drawn stroke
      if (points.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 5;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Worst deviation marker
      if (worstDeviationPoint) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(worstDeviationPoint.x, worstDeviationPoint.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4B4B';
        ctx.fill();
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }
  }, [activeResult]);

  useEffect(() => {
    handleResize();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      handleResize();
      redrawCanvas();
    });

    observer.observe(container);

    const onWindowResize = () => {
      handleResize();
      redrawCanvas();
    };

    window.addEventListener('resize', onWindowResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onWindowResize);
    };
  }, [handleResize, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Animated score counter
  useEffect(() => {
    if (!activeResult) return;

    const start = 0;
    const end = activeResult.score;
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
      } else {
        setDisplayScore(end);
      }
    };

    requestAnimationFrame(updateScore);
  }, [activeResult]);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setActiveResult(null);
    setIsNewBest(false);
    setIsDrawing(true);

    const startPt: Point = { x, y, time: Date.now() };
    pointsRef.current = [startPt];
    lastPointRef.current = startPt;

    sound.startDrawingSound();

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1A1A1A';
      ctx.fill();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const last = lastPointRef.current;
    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist < 2) return;
      sound.updateDrawingPitch(dist);
    }

    const newPt: Point = { x, y, time: Date.now() };
    pointsRef.current.push(newPt);
    lastPointRef.current = newPt;

    const ctx = canvas.getContext('2d');
    if (ctx && last) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    sound.stopDrawingSound();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pts = pointsRef.current;

    const result = calculateStraightLineScore(pts, rect.width, rect.height);
    if (!result) return;

    setActiveResult(result);
    sound.playScoreFanfare(result.score);

    // Check personal best
    if (!bestScore || result.score > bestScore.score) {
      setIsNewBest(true);
      onScoreSave({
        score: result.score,
        date: new Date().toISOString(),
        verdict: result.verdict,
        extra: `${result.totalLengthPx}px`,
      });
      if (result.score >= 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7C77B9', '#FFC93C', '#FF4B4B', '#1A1A1A'],
        });
      }
    }
  };

  const handleQuickShare = async () => {
    if (!activeResult) return;
    sound.playClick();
    const shareText = `I drew a ${activeResult.score}% straight line (${activeResult.totalLengthPx}px long) on Precision Games! Beat that.`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none gap-4">
      {/* Title Header */}
      <div className="text-center pt-1">
        <h1 className="text-[36px] sm:text-[52px] font-[900] leading-[0.9] uppercase tracking-tighter text-[#1A1A1A] mb-2">
          THE STRAIGHT LINE
        </h1>
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#1A1A1A] opacity-75">
          Draw the longest, straightest single stroke you can.
        </p>
      </div>

      {/* Canvas Card */}
      <div
        ref={containerRef}
        id="straight-line-canvas-container"
        className="relative w-full max-w-[500px] h-[300px] sm:h-[380px] max-h-[58vh] sm:max-h-none bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 transition-transform overflow-hidden touch-none"
      >
        {/* Top Left Accuracy Metric Indicator */}
        <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 flex flex-col gap-0.5 pointer-events-none z-10">
          <span className="text-[9px] sm:text-[10px] font-black uppercase text-neutral-400 leading-none tracking-widest">
            STRAIGHTNESS
          </span>
          <span className="text-[22px] sm:text-[30px] font-black leading-none text-[#1A1A1A]">
            {activeResult ? `${activeResult.score.toFixed(1)}%` : '—'}
          </span>
        </div>

        {/* Top Right Best Score Metric Indicator */}
        <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 flex flex-col items-end gap-0.5 pointer-events-none z-10">
          <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-500 leading-none tracking-widest">
            RECORD
          </span>
          <span className="text-[22px] sm:text-[30px] font-black leading-none text-[#1A1A1A]">
            {bestScore ? `${bestScore.score.toFixed(1)}%` : '—'}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          id="straight-line-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full rounded-2xl cursor-crosshair touch-none bg-white"
        />

        {/* Prompt Overlay when idle */}
        {!activeResult && !isDrawing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="bg-[#1A1A1A] text-white text-xs sm:text-sm font-black px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Click & drag one straight line</span>
            </div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-2">
              Draw across the canvas • Lift to score
            </p>
          </div>
        )}

        {/* Live Drawing indicator */}
        {isDrawing && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-neutral-700 shadow-md flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>KEEP STEADY & LIFT</span>
          </div>
        )}
      </div>

      {/* Result Card when Scored */}
      {activeResult && (
        <div
          id="straight-line-result-card"
          className="w-full max-w-[500px] bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center gap-4 text-center select-none animate-in fade-in zoom-in-95 duration-200"
        >
          {isNewBest && (
            <div className="bg-amber-400 text-[#1A1A1A] font-black text-xs px-4 py-1.5 rounded-full border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
              <Trophy className="w-3.5 h-3.5 fill-[#1A1A1A]" />
              <span>NEW PERSONAL RECORD!</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl sm:text-7xl font-black tracking-tight text-[#1A1A1A] leading-none">
                {displayScore.toFixed(1)}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-rose-500">%</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-black text-[#1A1A1A] mt-2 leading-tight">
              {activeResult.verdict}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-neutral-500 mt-0.5">
              {activeResult.subVerdict}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="w-full grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-2xl border-[2px] border-neutral-200 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-neutral-400 font-black uppercase tracking-wider text-[10px]">Length</span>
              <span className="font-black text-[#1A1A1A] text-sm sm:text-base mt-0.5">{activeResult.totalLengthPx}px</span>
            </div>
            <div className="flex flex-col items-center border-x-[1.5px] border-neutral-200">
              <span className="text-neutral-400 font-black uppercase tracking-wider text-[10px]">Avg Wobble</span>
              <span className="font-black text-[#1A1A1A] text-sm sm:text-base mt-0.5">{activeResult.avgDeviationPx}px</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-neutral-400 font-black uppercase tracking-wider text-[10px]">Straightness</span>
              <span className="font-black text-[#1A1A1A] text-sm sm:text-base mt-0.5">{activeResult.straightnessScore}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-1">
            <button
              id="line-try-again-btn"
              onClick={() => {
                sound.playClick();
                setActiveResult(null);
                redrawCanvas();
              }}
              className="flex-1 bg-[#1A1A1A] text-white py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(255,201,60,1)] border border-neutral-700"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Draw Again</span>
            </button>

            <button
              id="line-share-btn"
              onClick={handleQuickShare}
              className="flex-1 bg-white border-[2px] border-[#1A1A1A] text-[#1A1A1A] py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50"
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
