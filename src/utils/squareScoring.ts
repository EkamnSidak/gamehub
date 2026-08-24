import { Point, SquareResult } from '../types';

export function calculateSquareScore(points: Point[]): SquareResult | null {
  if (points.length < 15) return null;

  // Find bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const pt of points) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;

  if (width < 30 || height < 30) return null;

  // Aspect ratio score (perfect square = 1.0)
  const ratio = Math.min(width, height) / Math.max(width, height);
  const aspectRatioScore = Math.max(0, Math.min(100, ratio * 100));

  // Find 4 extreme corner points
  // Top-left: min (x + y), Top-right: max (x - y), Bottom-right: max (x + y), Bottom-left: min (x - y)
  let tl = points[0], tr = points[0], br = points[0], bl = points[0];
  let minSum = Infinity, maxSum = -Infinity, minDiff = Infinity, maxDiff = -Infinity;

  for (const pt of points) {
    const sum = pt.x + pt.y;
    const diff = pt.x - pt.y;
    if (sum < minSum) { minSum = sum; tl = pt; }
    if (sum > maxSum) { maxSum = sum; br = pt; }
    if (diff < minDiff) { minDiff = diff; bl = pt; }
    if (diff > maxDiff) { maxDiff = diff; tr = pt; }
  }

  const corners = [tl, tr, br, bl];

  // Helper to calculate angle between vectors (A-B) and (C-B)
  function getAngleDeg(a: Point, b: Point, c: Point): number {
    const v1x = a.x - b.x;
    const v1y = a.y - b.y;
    const v2x = c.x - b.x;
    const v2y = c.y - b.y;
    const dot = v1x * v2x + v1y * v2y;
    const mag1 = Math.hypot(v1x, v1y);
    const mag2 = Math.hypot(v2x, v2y);
    if (mag1 === 0 || mag2 === 0) return 90;
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return (Math.acos(cosAngle) * 180) / Math.PI;
  }

  const angleTL = getAngleDeg(bl, tl, tr);
  const angleTR = getAngleDeg(tl, tr, br);
  const angleBR = getAngleDeg(tr, br, bl);
  const angleBL = getAngleDeg(br, bl, tl);

  const angleDeviations = [
    Math.abs(angleTL - 90),
    Math.abs(angleTR - 90),
    Math.abs(angleBR - 90),
    Math.abs(angleBL - 90),
  ];

  const avgAngleDev = angleDeviations.reduce((a, b) => a + b, 0) / 4;
  const cornerScore = Math.max(0, Math.min(100, 100 - avgAngleDev * 3));

  // Edge straightness: sample perimeter vs bounding box perimeter
  const idealPerimeter = 2 * (width + height);
  let actualLength = 0;
  for (let i = 1; i < points.length; i++) {
    actualLength += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  const lengthRatio = Math.min(idealPerimeter, actualLength) / Math.max(idealPerimeter, actualLength);
  const edgeStraightnessScore = Math.max(0, Math.min(100, lengthRatio * 100));

  // Weighted score
  const finalScore = Math.round((aspectRatioScore * 0.4 + cornerScore * 0.4 + edgeStraightnessScore * 0.2) * 10) / 10;

  let verdict = 'Like a crushed cardboard box 📦';
  let subVerdict = 'Corners and edges need right-angle calibration.';

  if (finalScore >= 95) {
    verdict = 'Machined Square Precision 📐';
    subVerdict = `Flawless 90° corners with ${(ratio * 100).toFixed(1)}% aspect ratio!`;
  } else if (finalScore >= 85) {
    verdict = "Draftsman's Square 📐";
    subVerdict = `Very crisp right angles (${avgAngleDev.toFixed(1)}° avg deviation).`;
  } else if (finalScore >= 70) {
    verdict = 'A Bit Trapezoidal 🔶';
    subVerdict = 'Recognizable square with slight corner drift.';
  } else if (finalScore >= 50) {
    verdict = 'More Like a Blob 🥔';
    subVerdict = 'Curved edges and rounded corners.';
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    score: finalScore,
    cornerScore: Math.round(cornerScore * 10) / 10,
    aspectRatioScore: Math.round(aspectRatioScore * 10) / 10,
    edgeStraightnessScore: Math.round(edgeStraightnessScore * 10) / 10,
    points,
    corners,
    verdict,
    subVerdict,
    timestamp: Date.now(),
  };
}
