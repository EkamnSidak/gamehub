import React, { useState } from 'react';
import { BestScoreRecord, ColorRoundResult } from '../../types';
import { COLOR_TARGETS, calculateColorScore } from '../../utils/colorMatcher';
import { sound } from '../../utils/audio';
import { Palette, Trophy, RotateCcw, Share2, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TheColorGameProps {
  onScoreSave: (score: BestScoreRecord) => void;
  bestScore?: BestScoreRecord | null;
  onOpenShareModal: (title: string, score: number, verdict: string) => void;
}

export const TheColorGame: React.FC<TheColorGameProps> = ({
  onScoreSave,
  bestScore,
  onOpenShareModal,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [userR, setUserR] = useState(128);
  const [userG, setUserG] = useState(128);
  const [userB, setUserB] = useState(128);
  const [roundResults, setRoundResults] = useState<ColorRoundResult[]>([]);
  const [revealedResult, setRevealedResult] = useState<{
    score: number;
    deltaE: number;
    rating: string;
    verdict: string;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const currentTarget = COLOR_TARGETS[currentRoundIdx] || COLOR_TARGETS[0];
  const targetRgbStr = `rgb(${currentTarget.rgb.join(',')})`;
  const userRgbStr = `rgb(${userR}, ${userG}, ${userB})`;

  const handleSliderChange = (channel: 'r' | 'g' | 'b', val: number) => {
    if (revealedResult) return;
    if (channel === 'r') setUserR(val);
    if (channel === 'g') setUserG(val);
    if (channel === 'b') setUserB(val);
  };

  const handleSubmitMatch = () => {
    if (revealedResult || isCompleted) return;

    const res = calculateColorScore(currentTarget.rgb, [userR, userG, userB]);
    setRevealedResult(res);
    sound.playScoreFanfare(res.score);

    const roundRes: ColorRoundResult = {
      round: currentRoundIdx + 1,
      targetName: currentTarget.name,
      targetRgb: currentTarget.rgb,
      userRgb: [userR, userG, userB],
      distance: res.deltaE,
      score: res.score,
      rating: res.rating,
    };

    const updated = [...roundResults, roundRes];
    setRoundResults(updated);
  };

  const handleNextRound = () => {
    sound.playClick();
    if (currentRoundIdx + 1 >= COLOR_TARGETS.length) {
      setIsCompleted(true);
      const avgScore = Math.round((roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length) * 10) / 10;
      const avgDelta = Math.round((roundResults.reduce((a, b) => a + b.distance, 0) / roundResults.length) * 10) / 10;

      let verdict = 'Your eyes are calibrated 👁️✨';
      if (avgDelta > 25) verdict = 'Did you match in the dark? 🌑';
      else if (avgDelta > 12) verdict = 'Solid color vision 🎨';

      if (!bestScore || avgScore > bestScore.score) {
        setIsNewBest(true);
        onScoreSave({
          score: avgScore,
          date: new Date().toISOString(),
          verdict,
          extra: `ΔE: ${avgDelta} avg`,
        });
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF9F1C', '#FF4B4B', '#2EC4B6', '#1A1A1A'],
        });
      }
    } else {
      setCurrentRoundIdx((prev) => prev + 1);
      setUserR(128);
      setUserG(128);
      setUserB(128);
      setRevealedResult(null);
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentRoundIdx(0);
    setUserR(128);
    setUserG(128);
    setUserB(128);
    setRoundResults([]);
    setRevealedResult(null);
    setIsCompleted(false);
    setIsNewBest(false);
  };

  const handleQuickShare = async () => {
    sound.playClick();
    const avgScore = (roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length).toFixed(1);
    const text = `I matched 10 shades with ${avgScore}% average accuracy on "The Color" game! My eyes are calibrated.`;
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
          THE COLOR
        </h1>
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#1A1A1A] opacity-75">
          Adjust the RGB sliders to replicate the target color.
        </p>
      </div>

      {!isCompleted ? (
        <div 
          id="color-matching-card"
          className="w-full max-w-[480px] bg-white rounded-[32px] border-[3px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 flex flex-col items-center gap-5"
        >
          {/* Top Status Header */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase bg-[#1A1A1A] text-white px-3 py-1 rounded-full">
                Round {currentRoundIdx + 1}/10
              </span>
              <span className="text-xs font-bold text-neutral-400">
                ({currentTarget.category})
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-black uppercase text-[#FF4B4B]">
              <Trophy className="w-3.5 h-3.5" />
              <span>BEST: {bestScore ? `${bestScore.score.toFixed(1)}%` : '—'}</span>
            </div>
          </div>

          {/* Color Display Area (Side by side when revealed, Target dominant when picking) */}
          <div className="w-full h-44 rounded-2xl border-[2.5px] border-[#1A1A1A] overflow-hidden flex shadow-inner relative">
            {/* Target Color Swatch */}
            <div 
              style={{ backgroundColor: targetRgbStr }}
              className={`h-full transition-all flex flex-col items-center justify-center p-2 text-white font-black text-xs uppercase tracking-wider text-center drop-shadow-md ${
                revealedResult ? 'w-1/2 border-r-2 border-[#1A1A1A]' : 'w-full'
              }`}
            >
              <span className="bg-black/40 px-2 py-1 rounded-md backdrop-blur-xs">
                Target: {currentTarget.name}
              </span>
            </div>

            {/* User Attempt Swatch (Appears side-by-side or mini overlay) */}
            {revealedResult ? (
              <div 
                style={{ backgroundColor: userRgbStr }}
                className="w-1/2 h-full flex flex-col items-center justify-center p-2 text-white font-black text-xs uppercase tracking-wider text-center drop-shadow-md"
              >
                <span className="bg-black/40 px-2 py-1 rounded-md backdrop-blur-xs">
                  Your Attempt
                </span>
              </div>
            ) : (
              <div 
                style={{ backgroundColor: userRgbStr }}
                className="absolute bottom-3 right-3 w-16 h-16 rounded-xl border-[2.5px] border-[#1A1A1A] shadow-md flex items-center justify-center text-[10px] font-black uppercase text-white drop-shadow"
              >
                <span className="bg-black/50 px-1 rounded">Live</span>
              </div>
            )}
          </div>

          {/* If Result Revealed, show feedback & Next button */}
          {revealedResult ? (
            <div className="w-full flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-150">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-[900] text-[#1A1A1A] leading-none">
                  {revealedResult.score.toFixed(1)}
                </span>
                <span className="text-2xl font-[900] text-[#FF9F1C]">%</span>
              </div>
              <span className="text-sm font-[900] text-[#1A1A1A]">
                {revealedResult.rating}
              </span>

              <button
                id="color-next-btn"
                onClick={handleNextRound}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-[40px] font-[900] text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{currentRoundIdx + 1 >= COLOR_TARGETS.length ? 'View Final Results' : 'Next Color'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* RGB Sliders */
            <div className="w-full flex flex-col gap-3 pt-1">
              {/* Red Slider */}
              <div className="flex items-center gap-3">
                <span className="w-6 font-black text-xs text-[#FF4B4B]">R</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={userR}
                  onChange={(e) => handleSliderChange('r', parseInt(e.target.value))}
                  className="flex-1 accent-[#FF4B4B] h-2.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <span className="w-8 text-right font-mono font-bold text-xs text-neutral-700">
                  {userR}
                </span>
              </div>

              {/* Green Slider */}
              <div className="flex items-center gap-3">
                <span className="w-6 font-black text-xs text-emerald-600">G</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={userG}
                  onChange={(e) => handleSliderChange('g', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-600 h-2.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <span className="w-8 text-right font-mono font-bold text-xs text-neutral-700">
                  {userG}
                </span>
              </div>

              {/* Blue Slider */}
              <div className="flex items-center gap-3">
                <span className="w-6 font-black text-xs text-blue-600">B</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={userB}
                  onChange={(e) => handleSliderChange('b', parseInt(e.target.value))}
                  className="flex-1 accent-blue-600 h-2.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <span className="w-8 text-right font-mono font-bold text-xs text-neutral-700">
                  {userB}
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="color-submit-btn"
                onClick={handleSubmitMatch}
                className="w-full bg-[#FF9F1C] text-[#1A1A1A] py-4 rounded-[40px] font-[900] text-sm uppercase tracking-wider border-[2.5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lock In & Match</span>
              </button>
            </div>
          )}

          {/* Round Dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {COLOR_TARGETS.map((t, idx) => {
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
                      ? 'bg-[#1A1A1A] scale-125 ring-2 ring-[#FF9F1C]'
                      : 'bg-neutral-200 opacity-60'
                  }`}
                  title={`Round ${t.round}: ${t.name}`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        /* Summary Screen */
        <div 
          id="color-summary-card"
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
              10-COLOR MATCH ACCURACY
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-6xl sm:text-7xl font-[900] tracking-tight text-[#1A1A1A] leading-none">
                {(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length).toFixed(1)}
              </span>
              <span className="text-3xl sm:text-4xl font-[900] text-[#FF9F1C]">%</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-[900] text-[#1A1A1A] mt-2 leading-tight">
              Average ΔE: {(roundResults.reduce((a, b) => a + b.distance, 0) / roundResults.length).toFixed(1)}
            </h2>
          </div>

          {/* Mini Breakdown Table */}
          <div className="w-full max-h-48 overflow-y-auto rounded-2xl border-[2.5px] border-[#1A1A1A] bg-[#FAFAFA] p-3 text-xs">
            <div className="grid grid-cols-3 font-black uppercase text-neutral-400 border-b border-neutral-200 pb-1.5 mb-1.5 text-[10px]">
              <span>Color</span>
              <span>ΔE Diff</span>
              <span>Score</span>
            </div>
            {roundResults.map((r) => (
              <div key={r.round} className="grid grid-cols-3 font-bold text-[#1A1A1A] py-1 border-b border-neutral-100 last:border-none items-center">
                <div className="flex items-center gap-1.5 truncate">
                  <span 
                    style={{ backgroundColor: `rgb(${r.targetRgb.join(',')})` }}
                    className="w-3.5 h-3.5 rounded-full border border-[#1A1A1A] shrink-0" 
                  />
                  <span className="truncate">#{r.round} {r.targetName}</span>
                </div>
                <span className={r.distance <= 10 ? 'text-emerald-600 font-black' : 'text-[#FF4B4B] font-black'}>
                  ΔE {r.distance}
                </span>
                <span>{r.score}%</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="color-play-again-btn"
              onClick={handleRestart}
              className="flex-1 bg-[#1A1A1A] text-white py-4 px-6 rounded-[50px] font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Play Again</span>
            </button>

            <button
              id="color-share-btn"
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
