import React, { useEffect, useRef, useState } from 'react';
import { GameTheme } from '../types';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface CommonShareModalProps {
  title: string;
  score: number;
  verdict: string;
  theme: GameTheme;
  onClose: () => void;
}

export const CommonShareModal: React.FC<CommonShareModalProps> = ({
  title,
  score,
  verdict,
  theme,
  onClose,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const size = 540;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill canvas background
    ctx.fillStyle = theme.bgColor || '#FFC93C';
    ctx.fillRect(0, 0, size, size);

    // Card dimensions
    const cardMargin = 30;
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
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Header Title
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '900 24px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), size / 2, 85);

    // Center Badge / Score Big
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '900 78px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${score.toFixed(1)}%`, size / 2, 260);

    // Reaction Chip
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '900 20px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(verdict.toUpperCase(), size / 2, 320);

    // Subtag
    ctx.fillStyle = '#6B7280';
    ctx.font = '700 14px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('CALIBRATED ACCURACY SCORE', size / 2, 355);

    // Footer Watermark Badge
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '700 12px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('PRECISION GAMES • NEAL.FUN CHALLENGE', size / 2, 490);

    setDataUrl(canvas.toDataURL('image/png'));
  }, [title, score, verdict, theme]);

  const handleDownload = () => {
    sound.playClick();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `precision-score-${score.toFixed(1)}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    sound.playClick();
    if (!dataUrl) return;

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

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
    };
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

        {/* Preview Image */}
        {dataUrl ? (
          <div className="w-full aspect-square rounded-2xl overflow-hidden border-[2.5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src={dataUrl} alt="Score Sticker" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-2xl bg-neutral-100 animate-pulse border-2 border-neutral-300" />
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
