import React, { useEffect, useRef, useState } from 'react';
import { CircleResult, GameTheme } from '../types';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShareImageModalProps {
  result: CircleResult;
  theme: GameTheme;
  onClose: () => void;
}

export const ShareImageModal: React.FC<ShareImageModalProps> = ({
  result,
  theme,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600;
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, size, size);

    // Inner Card Container
    const cardMargin = 40;
    const cardSize = size - cardMargin * 2;
    const cardRadius = 32;

    // Solid sticker shadow
    ctx.fillStyle = '#1A1A1A';
    roundRect(ctx, cardMargin + 8, cardMargin + 8, cardSize, cardSize, cardRadius);
    ctx.fill();

    // White Card
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, cardMargin, cardMargin, cardSize, cardSize, cardRadius);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1A1A1A';
    ctx.stroke();

    // Header Title
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '900 24px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DRAW A PERFECT CIRCLE', size / 2, 85);

    // Draw the Circle in the middle
    const pts = result.points;
    if (pts.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of pts) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      const rawW = Math.max(20, maxX - minX);
      const rawH = Math.max(20, maxY - minY);
      const targetBox = 210;
      const scale = Math.min(targetBox / rawW, targetBox / rawH, 1.2);

      const drawCenterX = size / 2;
      const drawCenterY = 235;
      const originX = (minX + maxX) / 2;
      const originY = (minY + maxY) / 2;

      // Ideal Reference Circle (Dashed Red)
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        drawCenterX + (result.centroid.x - originX) * scale,
        drawCenterY + (result.centroid.y - originY) * scale,
        result.avgRadius * scale,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = '#FF4B4B';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.restore();

      // Drawn Path (Black)
      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 5.5;
      ctx.strokeStyle = '#1A1A1A';

      const firstX = drawCenterX + (pts[0].x - originX) * scale;
      const firstY = drawCenterY + (pts[0].y - originY) * scale;
      ctx.moveTo(firstX, firstY);

      for (let i = 1; i < pts.length; i++) {
        const px = drawCenterX + (pts[i].x - originX) * scale;
        const py = drawCenterY + (pts[i].y - originY) * scale;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Score Badge & Percentage
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '900 60px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${result.score.toFixed(1)}%`, size / 2, 420);

    // Verdict Text
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '900 18px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(result.verdict.toUpperCase(), size / 2, 458);

    // Footer Watermark Badge
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '700 12px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('ARTISTIC FLAIR • PRECISION CIRCLE GAME', size / 2, 505);

    setDataUrl(canvas.toDataURL('image/png'));
  }, [result, theme]);

  const handleDownload = () => {
    sound.playClick();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `perfect-circle-${result.score.toFixed(1)}pct.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        id="share-modal-card"
        className="w-full max-w-sm bg-white rounded-[32px] p-6 border-[3px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 relative animate-in fade-in zoom-in duration-150"
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 border-[2px] border-[#1A1A1A] hover:bg-neutral-200 transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-4 h-4 text-[#1A1A1A] stroke-[3]" />
        </button>

        <div className="flex items-center gap-2 pt-1">
          <Sparkles className="w-4 h-4 text-[#FF4B4B]" />
          <h3 className="font-[900] text-base text-[#1A1A1A] uppercase tracking-wider">
            Share Result Sticker
          </h3>
        </div>

        {/* Hidden Generation Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Preview Image */}
        {dataUrl ? (
          <div className="w-full aspect-square rounded-2xl overflow-hidden border-[2.5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src={dataUrl} alt="Score Sticker" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-square bg-neutral-100 rounded-2xl animate-pulse" />
        )}

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleCopyImage}
            className="py-3 px-3 rounded-[50px] bg-white text-[#1A1A1A] font-black text-xs uppercase tracking-wider border-[2.5px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:scale-[0.96] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
            <span>{copied ? 'Copied!' : 'Copy Image'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-3 px-3 rounded-[50px] bg-[#1A1A1A] text-white font-black text-xs uppercase tracking-wider border-[2.5px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-[0.96] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

