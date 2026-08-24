export interface MiddleRoundConfig {
  round: number;
  title: string;
  shapeType: 'horizontal' | 'angled' | 'arc' | 'zigzag' | 'circle' | 'spiral';
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => { x: number; y: number };
}

export const MIDDLE_ROUNDS: MiddleRoundConfig[] = [
  // Round 1: Simple Horizontal Line
  {
    round: 1,
    title: 'Horizontal Line',
    shapeType: 'horizontal',
    draw: (ctx, w, h) => {
      const y = h * 0.5;
      const x1 = w * 0.15;
      const x2 = w * 0.85;

      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // True midpoint
      return { x: (x1 + x2) / 2, y };
    },
  },
  // Round 2: Offset Horizontal Line
  {
    round: 2,
    title: 'Long Horizontal Line',
    shapeType: 'horizontal',
    draw: (ctx, w, h) => {
      const y = h * 0.48;
      const x1 = w * 0.1;
      const x2 = w * 0.9;

      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      return { x: (x1 + x2) / 2, y };
    },
  },
  // Round 3: Angled Line (Diagonal Up)
  {
    round: 3,
    title: 'Angled Line',
    shapeType: 'angled',
    draw: (ctx, w, h) => {
      const x1 = w * 0.2;
      const y1 = h * 0.75;
      const x2 = w * 0.8;
      const y2 = h * 0.25;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    },
  },
  // Round 4: Steep Angled Line
  {
    round: 4,
    title: 'Steep Diagonal',
    shapeType: 'angled',
    draw: (ctx, w, h) => {
      const x1 = w * 0.75;
      const y1 = h * 0.82;
      const x2 = w * 0.28;
      const y2 = h * 0.18;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    },
  },
  // Round 5: Curved Arc
  {
    round: 5,
    title: 'Curved Arc',
    shapeType: 'arc',
    draw: (ctx, w, h) => {
      const x1 = w * 0.2;
      const y1 = h * 0.65;
      const x2 = w * 0.8;
      const y2 = h * 0.65;
      const cx = w * 0.5;
      const cy = h * 0.2; // Control point

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Quadratic bezier midpoint at t=0.5: B(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2
      const midX = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
      const midY = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
      return { x: midX, y: midY };
    },
  },
  // Round 6: Inverted S-Curve Arc
  {
    round: 6,
    title: 'Deep Arc',
    shapeType: 'arc',
    draw: (ctx, w, h) => {
      const x1 = w * 0.18;
      const y1 = h * 0.35;
      const x2 = w * 0.82;
      const y2 = h * 0.35;
      const cx = w * 0.5;
      const cy = h * 0.85;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      const midX = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
      const midY = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
      return { x: midX, y: midY };
    },
  },
  // Round 7: Zigzag Segment
  {
    round: 7,
    title: 'Zigzag Line',
    shapeType: 'zigzag',
    draw: (ctx, w, h) => {
      const pts = [
        { x: w * 0.15, y: h * 0.5 },
        { x: w * 0.38, y: h * 0.25 },
        { x: w * 0.62, y: h * 0.75 },
        { x: w * 0.85, y: h * 0.5 },
      ];

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Middle of segment 2 (between pt 1 and pt 2)
      return { x: (pts[1].x + pts[2].x) / 2, y: (pts[1].y + pts[2].y) / 2 };
    },
  },
  // Round 8: Multi-turn Zigzag
  {
    round: 8,
    title: 'Multi-Segment Step',
    shapeType: 'zigzag',
    draw: (ctx, w, h) => {
      const pts = [
        { x: w * 0.2, y: h * 0.7 },
        { x: w * 0.2, y: h * 0.3 },
        { x: w * 0.8, y: h * 0.3 },
        { x: w * 0.8, y: h * 0.7 },
      ];

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // True midpoint of entire path is midpoint of horizontal segment
      return { x: (pts[1].x + pts[2].x) / 2, y: pts[1].y };
    },
  },
  // Round 9: Circle Center
  {
    round: 9,
    title: 'Find Circle Center',
    shapeType: 'circle',
    draw: (ctx, w, h) => {
      const centerX = w * 0.5;
      const centerY = h * 0.5;
      const radius = Math.min(w, h) * 0.32;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.stroke();

      return { x: centerX, y: centerY };
    },
  },
  // Round 10: Archimedean Spiral Center
  {
    round: 10,
    title: 'Spiral Center Point',
    shapeType: 'spiral',
    draw: (ctx, w, h) => {
      const centerX = w * 0.5;
      const centerY = h * 0.5;
      const a = 0.5;
      const b = 4.2;

      ctx.beginPath();
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';

      const maxTheta = 6.5 * Math.PI;
      let first = true;
      for (let theta = 0.5; theta <= maxTheta; theta += 0.05) {
        const r = a + b * theta;
        const x = centerX + r * Math.cos(theta);
        const y = centerY + r * Math.sin(theta);
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      return { x: centerX, y: centerY };
    },
  },
];

export function getMiddleRating(distancePx: number): { rating: string; verdict: string } {
  if (distancePx <= 4) {
    return { rating: `${distancePx.toFixed(1)}px off — Sniper 🎯`, verdict: 'Pinpoint geometric accuracy!' };
  } else if (distancePx <= 15) {
    return { rating: `${distancePx.toFixed(1)}px off — Laser Eye ⚡`, verdict: 'Very impressive center finding.' };
  } else if (distancePx <= 40) {
    return { rating: `${distancePx.toFixed(0)}px off — Pretty Good 👍`, verdict: 'Respectable approximation.' };
  } else if (distancePx <= 90) {
    return { rating: `${distancePx.toFixed(0)}px off — A Bit Drifty 🌊`, verdict: 'Noticeable spatial deviation.' };
  } else {
    return { rating: `${distancePx.toFixed(0)}px off — Different Zip Code 📍`, verdict: 'Way off target!' };
  }
}
