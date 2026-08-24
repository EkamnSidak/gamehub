import { Point, CircleResult } from '../types';

export function calculateCircleScore(points: Point[]): CircleResult | null {
  if (points.length < 15) {
    return null;
  }

  const startTime = points[0].time;
  const endTime = points[points.length - 1].time;
  const drawnDurationMs = endTime - startTime;

  // 1. Calculate Centroid (Center of Mass)
  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const cx = sumX / points.length;
  const cy = sumY / points.length;

  // 2. Calculate Radii from Centroid
  let sumR = 0;
  let minR = Infinity;
  let maxR = -Infinity;
  const radii: number[] = [];

  for (const p of points) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    radii.push(r);
    sumR += r;
    if (r < minR) minR = r;
    if (r > maxR) maxR = r;
  }

  const avgRadius = sumR / points.length;

  // If too tiny
  if (avgRadius < 15) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      score: 12.0,
      roundness: 20,
      closureScore: 10,
      closureGap: 50,
      centroid: { x: cx, y: cy },
      avgRadius,
      minRadius: minR,
      maxRadius: maxR,
      stdDev: 10,
      points,
      worstPoint: points[0],
      sweepAngle: 180,
      verdict: "Is this a circle for ants? 🐜",
      subVerdict: "Try drawing a bigger circle to get an accurate score.",
      badge: "Tiny Speck",
      easterEgg: "Micro-Dot",
      drawnDurationMs,
      timestamp: Date.now(),
    };
  }

  // 3. Standard Deviation of Radius
  let sumSqDiff = 0;
  let maxDeviation = -1;
  let worstPoint: Point | null = null;

  for (let i = 0; i < points.length; i++) {
    const diff = Math.abs(radii[i] - avgRadius);
    sumSqDiff += diff * diff;
    if (diff > maxDeviation) {
      maxDeviation = diff;
      worstPoint = points[i];
    }
  }

  const variance = sumSqDiff / points.length;
  const stdDev = Math.sqrt(variance);

  // Roundness formula: stdDev relative to avgRadius
  // A relative deviation of 0% -> 100% roundness.
  // 5% relative stdDev -> ~92%
  // 10% relative stdDev -> ~84%
  // 20% relative stdDev -> ~68%
  // 35%+ relative stdDev -> <45%
  const relStdDev = (stdDev / avgRadius) * 100;
  const rawRoundness = Math.max(0, Math.min(100, 100 - relStdDev * 1.6));

  // 4. Calculate Closure Gap (Distance between start and end)
  const pStart = points[0];
  const pEnd = points[points.length - 1];
  const closureGap = Math.sqrt(
    (pEnd.x - pStart.x) * (pEnd.x - pStart.x) +
    (pEnd.y - pStart.y) * (pEnd.y - pStart.y)
  );

  // Closure score: perfect if gap < 12px, degrades as gap approaches avgRadius * 0.4
  const gapRatio = closureGap / Math.max(30, avgRadius);
  let closureScore = 100;
  if (closureGap > 15) {
    closureScore = Math.max(0, Math.min(100, 100 - (gapRatio * 120)));
  }

  // 5. Angular Sweep (Did they draw a full 360 loop?)
  let totalAngleSweep = 0;
  let prevAngle = Math.atan2(points[0].y - cy, points[0].x - cx);

  for (let i = 1; i < points.length; i++) {
    const curAngle = Math.atan2(points[i].y - cy, points[i].x - cx);
    let diff = curAngle - prevAngle;
    // Normalize jump across -PI / +PI
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    totalAngleSweep += diff;
    prevAngle = curAngle;
  }

  const absSweepDeg = (Math.abs(totalAngleSweep) * 180) / Math.PI;
  const fullLoopRatio = Math.min(1, absSweepDeg / 340);

  // 6. Overall Combined Score
  // 75% weight on roundness, 20% on closure, 5% on sweep completeness
  let combinedScore = rawRoundness * 0.78 + closureScore * 0.22;

  // Penalize incomplete arcs heavily
  if (absSweepDeg < 300) {
    combinedScore *= fullLoopRatio * 0.75;
  }

  // Over-drawing penalty (e.g. going around 3 times in a spiral)
  if (absSweepDeg > 520) {
    combinedScore = Math.max(20, combinedScore * 0.85);
  }

  const finalScore = Math.max(1, Math.min(99.9, Math.round(combinedScore * 10) / 10));

  // 7. Easter Eggs and Special Verdicts
  let easterEgg: string | undefined = undefined;

  // Spiral check (radii start small and end big, or vice versa)
  const firstQuarterAvgR = radii.slice(0, Math.floor(radii.length / 4)).reduce((a, b) => a + b, 0) / (radii.length / 4);
  const lastQuarterAvgR = radii.slice(-Math.floor(radii.length / 4)).reduce((a, b) => a + b, 0) / (radii.length / 4);
  if (Math.abs(firstQuarterAvgR - lastQuarterAvgR) > avgRadius * 0.45 && absSweepDeg > 380) {
    easterEgg = "Hypnotic Spiral 🌀";
  } else if (drawnDurationMs < 320) {
    easterEgg = "Lightning Speed ⚡";
  } else if (drawnDurationMs > 12000) {
    easterEgg = "Zen Master 🧘";
  }

  let verdict = "Geometry-approved.";
  let subVerdict = "A remarkably well-proportioned curve.";
  let badge = "Circle Enthusiast";

  if (easterEgg === "Hypnotic Spiral 🌀") {
    verdict = "That's a hypnotic snail shell! 🌀";
    subVerdict = "You're getting sleepy... now try a closed circle.";
    badge = "Spiral Wizard";
  } else if (absSweepDeg < 270) {
    verdict = "The circle became an arc! 🌙";
    subVerdict = "Remember to close the loop all the way around.";
    badge = "Half-Mooneer";
  } else if (finalScore >= 90) {
    verdict = "Suspiciously precise.";
    subVerdict = finalScore >= 97 ? "Are you secretly a mechanical compass?" : "Flawless radial symmetry and seamless closure.";
    badge = "Compass Master";
  } else if (finalScore >= 75) {
    verdict = "Geometry-approved.";
    subVerdict = "Consistent radius with minor human micro-wobbles.";
    badge = "Steady Hand";
  } else if (finalScore >= 50) {
    verdict = "Definitely circle-shaped.";
    subVerdict = "More of an organic bagel or egg, but unmistakable.";
    badge = "Circle Sculptor";
  } else {
    verdict = "The circle became a potato.";
    subVerdict = "Delicious with butter, but mathematically challenged.";
    badge = "Potato Sculptor";
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    score: finalScore,
    roundness: Math.round(rawRoundness * 10) / 10,
    closureScore: Math.round(closureScore * 10) / 10,
    closureGap: Math.round(closureGap * 10) / 10,
    centroid: { x: cx, y: cy },
    avgRadius: Math.round(avgRadius * 10) / 10,
    minRadius: Math.round(minR * 10) / 10,
    maxRadius: Math.round(maxR * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    points,
    worstPoint,
    sweepAngle: Math.round(absSweepDeg),
    verdict,
    subVerdict,
    badge,
    easterEgg,
    drawnDurationMs,
    timestamp: Date.now(),
  };
}
