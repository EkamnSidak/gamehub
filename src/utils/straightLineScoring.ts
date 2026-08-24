import { Point, StraightLineResult } from '../types';

export function calculateStraightLineScore(points: Point[], canvasWidth: number, canvasHeight: number): StraightLineResult | null {
  if (points.length < 5) return null;

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  // Calculate direct Euclidean distance between start and end
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const idealLength = Math.hypot(dx, dy);

  // If start and end are practically the same point, score is poor
  if (idealLength < 25) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      score: 10,
      straightnessScore: 10,
      lengthScore: 10,
      totalLengthPx: idealLength,
      avgDeviationPx: 50,
      maxDeviationPx: 80,
      startPoint,
      endPoint,
      points,
      worstDeviationPoint: null,
      verdict: 'Did an earthquake draw this?',
      subVerdict: 'Stroke was too short or collapsed.',
      timestamp: Date.now(),
    };
  }

  // Calculate actual total length of drawn stroke
  let totalLengthPx = 0;
  for (let i = 1; i < points.length; i++) {
    totalLengthPx += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }

  // Line equation: Ax + By + C = 0
  // Line from (x1, y1) to (x2, y2):
  // (y2 - y1)x - (x2 - x1)y + (x2*y1 - y2*x1) = 0
  const A = dy;
  const B = -dx;
  const C = endPoint.x * startPoint.y - endPoint.y * startPoint.x;
  const denominator = Math.hypot(A, B);

  let totalDeviation = 0;
  let maxDev = 0;
  let worstPoint: Point | null = null;

  for (const pt of points) {
    const distance = Math.abs(A * pt.x + B * pt.y + C) / (denominator || 1);
    totalDeviation += distance;
    if (distance > maxDev) {
      maxDev = distance;
      worstPoint = pt;
    }
  }

  const avgDeviationPx = totalDeviation / points.length;

  // Straightness formula: 100 - average deviation in px
  // Also penalize loopbacks or excess length ratio
  const excessLengthRatio = Math.max(1, totalLengthPx / idealLength);
  const straightnessScore = Math.max(0, Math.min(100, (100 - avgDeviationPx * 2.2) / (excessLengthRatio * 0.9 + 0.1)));

  // Length formula: max possible diagonal of canvas
  const maxPossibleLength = Math.hypot(canvasWidth, canvasHeight) * 0.85;
  const lengthScore = Math.min(100, (totalLengthPx / maxPossibleLength) * 100);

  // Weighted final score: 70% straightness + 30% length
  const rawFinalScore = (straightnessScore * 0.7) + (lengthScore * 0.3);
  const finalScore = Math.round(Math.max(0, Math.min(100, rawFinalScore)) * 10) / 10;

  // Rating tiers
  let verdict = 'Did an earthquake draw this?';
  let subVerdict = 'Your hand might need a rest.';

  if (finalScore >= 95) {
    verdict = 'Surgeon-level steadiness';
    subVerdict = `Flawless execution across ${Math.round(totalLengthPx)}px!`;
  } else if (finalScore >= 80) {
    verdict = "Architect's ruler energy";
    subVerdict = `Very crisp and consistent stroke (${Math.round(totalLengthPx)}px).`;
  } else if (finalScore >= 60) {
    verdict = 'Slightly caffeinated, but respectable';
    subVerdict = `A few minor wobbles (${avgDeviationPx.toFixed(1)}px avg deviation).`;
  } else if (finalScore >= 40) {
    verdict = 'Seismograph during a small earthquake';
    subVerdict = 'Some noticeable turbulence along the line.';
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    score: finalScore,
    straightnessScore: Math.round(straightnessScore * 10) / 10,
    lengthScore: Math.round(lengthScore * 10) / 10,
    totalLengthPx: Math.round(totalLengthPx),
    avgDeviationPx: Math.round(avgDeviationPx * 10) / 10,
    maxDeviationPx: Math.round(maxDev * 10) / 10,
    startPoint,
    endPoint,
    points,
    worstDeviationPoint: worstPoint,
    verdict,
    subVerdict,
    timestamp: Date.now(),
  };
}
