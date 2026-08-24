export interface Point {
  x: number;
  y: number;
  time: number;
}

export type GameMode = 'hub' | 'circle' | 'line' | 'second' | 'middle' | 'color' | 'square' | 'craft';

export interface GameTheme {
  id: string;
  name: string;
  bgColor: string;
  accentColor: string;
  darkText: boolean;
  tag: string;
}

export interface BestScoreRecord {
  score: number;
  date: string;
  verdict: string;
  extra?: string;
}

// 7. Infinite Craft Types
export interface CanvasCraftItem {
  instanceId: string;
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  isCombining?: boolean;
}

// 1. Circle Types
export interface CircleResult {
  id: string;
  score: number;
  roundness: number;
  closureScore: number;
  closureGap: number;
  centroid: { x: number; y: number };
  avgRadius: number;
  minRadius: number;
  maxRadius: number;
  stdDev: number;
  points: Point[];
  worstPoint: Point | null;
  sweepAngle: number;
  verdict: string;
  subVerdict: string;
  badge: string;
  easterEgg?: string;
  drawnDurationMs: number;
  timestamp: number;
}

// 2. Straight Line Types
export interface StraightLineResult {
  id: string;
  score: number;
  straightnessScore: number;
  lengthScore: number;
  totalLengthPx: number;
  avgDeviationPx: number;
  maxDeviationPx: number;
  startPoint: Point;
  endPoint: Point;
  points: Point[];
  worstDeviationPoint: Point | null;
  verdict: string;
  subVerdict: string;
  timestamp: number;
}

// 3. The Second Types
export interface SecondRoundResult {
  round: number;
  targetMs: number;
  actualMs: number;
  diffMs: number;
  score: number;
  rating: string;
}

export interface SecondGameSummary {
  rounds: SecondRoundResult[];
  avgDiffMs: number;
  finalScore: number;
  verdict: string;
  subVerdict: string;
  timestamp: number;
}

// 4. The Middle Types
export interface MiddleShapeDef {
  id: number;
  title: string;
  type: 'horizontal' | 'angled' | 'arc' | 'zigzag' | 'circle' | 'spiral';
  points?: Point[];
  center: { x: number; y: number };
  render: (ctx: CanvasRenderingContext2D, width: number, height: number) => { x: number; y: number };
}

export interface MiddleRoundResult {
  round: number;
  shapeName: string;
  targetX: number;
  targetY: number;
  clickX: number;
  clickY: number;
  distancePx: number;
  score: number;
  rating: string;
}

export interface MiddleGameSummary {
  rounds: MiddleRoundResult[];
  avgDistancePx: number;
  finalScore: number;
  verdict: string;
  subVerdict: string;
  timestamp: number;
}

// 5. The Color Types
export interface ColorTarget {
  round: number;
  name: string;
  rgb: [number, number, number];
  category: 'Primary' | 'Secondary' | 'Muted' | 'Subtle';
}

export interface ColorRoundResult {
  round: number;
  targetName: string;
  targetRgb: [number, number, number];
  userRgb: [number, number, number];
  distance: number;
  score: number;
  rating: string;
}

export interface ColorGameSummary {
  rounds: ColorRoundResult[];
  avgScore: number;
  verdict: string;
  subVerdict: string;
  timestamp: number;
}

// 6. The Square Types
export interface SquareResult {
  id: string;
  score: number;
  cornerScore: number;
  aspectRatioScore: number;
  edgeStraightnessScore: number;
  points: Point[];
  corners: Point[];
  verdict: string;
  subVerdict: string;
  timestamp: number;
}

// Global Stats
export interface AllGameScores {
  circle?: BestScoreRecord;
  line?: BestScoreRecord;
  second?: BestScoreRecord;
  middle?: BestScoreRecord;
  color?: BestScoreRecord;
  square?: BestScoreRecord;
  craft?: BestScoreRecord;
}
