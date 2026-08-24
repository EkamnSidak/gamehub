import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, CircleResult, BestScoreRecord } from '../types';
import { calculateCircleScore } from '../utils/scoring';
import { sound } from '../utils/audio';
import { Sparkles, AlertCircle } from 'lucide-react';

interface DrawingCanvasProps {
  onScoreCalculated: (result: CircleResult) => void;
  showGuide: boolean;
  activeResult: CircleResult | null;
  onClear: () => void;
  accentColor: string;
  bestScore?: BestScoreRecord | null;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onScoreCalculated,
  showGuide,
  activeResult,
  onClear,
  accentColor,
  bestScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const lastPointRef = useRef<Point | null>(null);

  // Setup High DPI Canvas with ResizeObserver
  const setupCanvas = useCallback(() => {
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
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setupCanvas();
      if (activeResult) {
        renderResult(activeResult);
      }
    });

    observer.observe(container);

    const handleResize = () => {
      setupCanvas();
      if (activeResult) {
        renderResult(activeResult);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [setupCanvas, activeResult]);

  // Render idle background & guides
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Optional faint guide circle
    if (showGuide) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.restore();
    }

    // Center starting reference dot
    if (!activeResult && !isDrawing) {
      ctx.save();
      // Outer subtle ring
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#9CA3AF';
      ctx.fill();
      ctx.restore();
    }
  }, [showGuide, activeResult, isDrawing]);

  // Render finalized score overlay
  const renderResult = useCallback((result: CircleResult) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    drawBackground(ctx, rect.width, rect.height);

    const { points: pts, centroid, avgRadius, worstPoint } = result;
    if (pts.length < 2) return;

    // 1. Draw Ideal Reference Circle (dashed red/coral)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centroid.x, centroid.y, avgRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FF4B4B';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.restore();

    // 2. Draw Centroid Target
    ctx.save();
    ctx.beginPath();
    ctx.arc(centroid.x, centroid.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FF4B4B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 3. Draw User's Drawn Path in Bold Charcoal
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    // 4. Highlight Worst Deviation Point if noticeable
    if (worstPoint && result.score < 95) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(worstPoint.x, worstPoint.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#FF4B4B';
      ctx.fill();
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // 5. If gap is large, highlight the gap with a faint connector line
    if (result.closureGap > 22 && pts.length > 2) {
      const pStart = pts[0];
      const pEnd = pts[pts.length - 1];
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    }
  }, [drawBackground]);

  // Initial draw & result watching
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    if (activeResult) {
      renderResult(activeResult);
    } else if (!isDrawing) {
      drawBackground(ctx, rect.width, rect.height);
    }
  }, [activeResult, drawBackground, isDrawing, renderResult, showGuide]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (activeResult) return; // Prevent strokes until Try Again is clicked

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setWarningMessage(null);
    onClear();
    setIsDrawing(true);

    const startPt: Point = { x, y, time: Date.now() };
    pointsRef.current = [startPt];
    lastPointRef.current = startPt;
    setPoints([startPt]);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawBackground(ctx, rect.width, rect.height);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#1A1A1A';
      ctx.fill();
    }

    sound.playPop();
    sound.startDrawingSound();
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    const last = lastPointRef.current;

    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist < 2) return;

      const speed = dist / Math.max(1, (now - last.time) / 10);
      sound.updateDrawingPitch(speed);
    }

    const newPt: Point = { x, y, time: now };
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

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    sound.stopDrawingSound();

    try {
      if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
        canvasRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    const recordedPoints = [...pointsRef.current];
    if (recordedPoints.length < 12) {
      setWarningMessage("Too short! Draw a full circle round and closed.");
      sound.playClick();
      return;
    }

    const result = calculateCircleScore(recordedPoints);
    if (!result) {
      setWarningMessage("Could not calculate circle score. Please try again.");
      return;
    }

    sound.playScoreFanfare(result.score);
    renderResult(result);
    onScoreCalculated(result);
  };

  const handlePointerCancel = () => {
    setIsDrawing(false);
    sound.stopDrawingSound();
  };

  // Center badge text calculation
  const getCenterBadge = () => {
    if (!activeResult) return null;
    if (activeResult.score >= 95) return 'WOW!';
    if (activeResult.score >= 90) return 'INSANE!';
    if (activeResult.score >= 80) return 'GREAT!';
    if (activeResult.score >= 70) return 'NICE!';
    if (activeResult.score >= 50) return 'OKAY!';
    return 'POTATO!';
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Modern Canvas Card Container */}
      <div 
        ref={containerRef}
        id="canvas-container"
        className="relative w-full max-w-[440px] aspect-square max-h-[62vh] sm:max-h-none bg-white rounded-3xl border-[2.5px] border-[#1A1A1A] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-6 transition-transform overflow-hidden touch-none"
      >
        {/* Top Left Accuracy Metric Indicator */}
        <div className="absolute top-3.5 left-3.5 sm:top-6 sm:left-6 flex flex-col gap-0.5 pointer-events-none z-10">
          <span className="text-[9px] sm:text-[10px] font-black uppercase text-neutral-400 leading-none tracking-widest">
            ACCURACY
          </span>
          <span className="text-[22px] sm:text-[32px] font-black leading-none text-[#1A1A1A]">
            {activeResult ? `${activeResult.score.toFixed(1)}%` : '—'}
          </span>
        </div>

        {/* Top Right Best Score Metric Indicator */}
        <div className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 flex flex-col items-end gap-0.5 pointer-events-none z-10">
          <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-500 leading-none tracking-widest">
            RECORD
          </span>
          <span className="text-[22px] sm:text-[32px] font-black leading-none text-[#1A1A1A]">
            {bestScore ? `${bestScore.score.toFixed(1)}%` : '—'}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          id="circle-draw-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="w-full h-full rounded-2xl cursor-crosshair touch-none bg-white"
        />

        {/* Center Reaction Badge Overlay when scored */}
        {activeResult && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-[15px] sm:text-[17px] font-black text-[#1A1A1A] bg-white px-4 py-1.5 border-[2px] border-[#1A1A1A] rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider animate-in zoom-in-90 duration-200">
              {getCenterBadge()}
            </span>
          </div>
        )}

        {/* Prompt / Instruction Overlay when idle */}
        {!activeResult && !isDrawing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="bg-[#1A1A1A] text-white text-[12px] sm:text-[13px] font-black px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Click & drag to draw</span>
            </div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-2">
              Draw in one smooth stroke • Lift to score
            </p>
          </div>
        )}

        {/* Live Drawing feedback indicator */}
        {isDrawing && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-neutral-700 shadow-md flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>CLOSE LOOP & LIFT</span>
          </div>
        )}

        {/* Warning Toast */}
        {warningMessage && (
          <div className="absolute bottom-5 left-5 right-5 bg-white border-[2px] border-[#1A1A1A] text-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wide px-3.5 py-2.5 rounded-2xl flex items-center justify-between z-20 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{warningMessage}</span>
            </div>
            <button
              onClick={() => setWarningMessage(null)}
              className="text-rose-500 font-black underline text-xs ml-2 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

