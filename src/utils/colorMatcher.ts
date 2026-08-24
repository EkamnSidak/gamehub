import { ColorTarget } from '../types';

export const COLOR_TARGETS: ColorTarget[] = [
  // Round 1-2: Primary colors (Easy)
  { round: 1, name: 'Crimson Red', rgb: [220, 20, 60], category: 'Primary' },
  { round: 2, name: 'Royal Blue', rgb: [30, 80, 210], category: 'Primary' },

  // Round 3-4: Secondary colors
  { round: 3, name: 'Tangerine Orange', rgb: [255, 120, 0], category: 'Secondary' },
  { round: 4, name: 'Vibrant Teal', rgb: [0, 180, 160], category: 'Secondary' },

  // Round 5-6: Muted / Pastel tones
  { round: 5, name: 'Dusty Rose', rgb: [195, 125, 135], category: 'Muted' },
  { round: 6, name: 'Sage Green', rgb: [130, 165, 130], category: 'Muted' },

  // Round 7-8: Subtle / Complex tones
  { round: 7, name: 'Warm Ochre', rgb: [180, 130, 60], category: 'Subtle' },
  { round: 8, name: 'Slate Lavender', rgb: [120, 110, 160], category: 'Subtle' },

  // Round 9-10: Very Close / Tricky hues
  { round: 9, name: 'Olive Drab', rgb: [95, 110, 65], category: 'Subtle' },
  { round: 10, name: 'Deep Petroleum', rgb: [35, 75, 85], category: 'Subtle' },
];

// Convert RGB to LAB for perceptual Delta-E calculation
function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  let [R, G, B] = [r / 255, g / 255, b / 255].map((val) => {
    return val > 0.04045 ? Math.pow((val + 0.055) / 1.055, 2.4) : val / 12.92;
  });

  R *= 100;
  G *= 100;
  B *= 100;

  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

  return [X, Y, Z];
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // Reference white D65
  const [refX, refY, refZ] = [95.047, 100.0, 108.883];

  let [X, Y, Z] = [x / refX, y / refY, z / refZ].map((val) => {
    return val > 0.008856 ? Math.pow(val, 1 / 3) : 7.787 * val + 16 / 116;
  });

  const L = 116 * Y - 16;
  const a = 500 * (X - Y);
  const b = 200 * (Y - Z);

  return [L, a, b];
}

export function calculateColorScore(targetRgb: [number, number, number], userRgb: [number, number, number]): {
  score: number;
  deltaE: number;
  rating: string;
  verdict: string;
} {
  const [tL, ta, tb] = xyzToLab(...rgbToXyz(...targetRgb));
  const [uL, ua, ub] = xyzToLab(...rgbToXyz(...userRgb));

  // Delta E (CIE76 Euclidean distance in Lab space)
  const deltaE = Math.sqrt(Math.pow(tL - uL, 2) + Math.pow(ta - ua, 2) + Math.pow(tb - ub, 2));

  // Score formula: Delta E < 2 is nearly indistinguishable to human eyes (100%), Delta E ~ 50 is completely different
  const rawScore = Math.max(0, Math.min(100, 100 - deltaE * 1.5));
  const score = Math.round(rawScore * 10) / 10;

  let rating = 'Did you match this in the dark? 🌑';
  let verdict = 'Significant color channel drift.';

  if (score >= 95 || deltaE <= 3.5) {
    rating = 'Your eyes are calibrated 👁️✨';
    verdict = `Near-perfect perceptual match (ΔE: ${deltaE.toFixed(1)})!`;
  } else if (score >= 80 || deltaE <= 12) {
    rating = 'Solid color vision 🎨';
    verdict = `Very sharp eye for tone (ΔE: ${deltaE.toFixed(1)}).`;
  } else if (score >= 60 || deltaE <= 25) {
    rating = 'Respectable match 👓';
    verdict = `Close, but noticeable hue shift (ΔE: ${deltaE.toFixed(1)}).`;
  } else if (score >= 40) {
    rating = 'Colorblind test alert? ⚠️';
    verdict = `Noticeable luminance and tint mismatch (ΔE: ${deltaE.toFixed(1)}).`;
  }

  return {
    score,
    deltaE: Math.round(deltaE * 10) / 10,
    rating,
    verdict,
  };
}
