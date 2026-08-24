export interface SecondTargetDef {
  round: number;
  targetMs: number;
  label: string;
  difficulty: 'Standard' | 'Fast' | 'Long' | 'Brutal';
}

export const SECOND_TARGETS: SecondTargetDef[] = [
  { round: 1, targetMs: 1000, label: '1.000s', difficulty: 'Standard' },
  { round: 2, targetMs: 1000, label: '1.000s', difficulty: 'Standard' },
  { round: 3, targetMs: 1000, label: '1.000s', difficulty: 'Standard' },
  { round: 4, targetMs: 500, label: '0.500s', difficulty: 'Fast' },
  { round: 5, targetMs: 500, label: '0.500s', difficulty: 'Fast' },
  { round: 6, targetMs: 500, label: '0.500s', difficulty: 'Fast' },
  { round: 7, targetMs: 2750, label: '2.750s', difficulty: 'Long' },
  { round: 8, targetMs: 2750, label: '2.750s', difficulty: 'Long' },
  { round: 9, targetMs: 2750, label: '2.750s', difficulty: 'Long' },
  { round: 10, targetMs: 100, label: '0.100s', difficulty: 'Brutal' },
];

export function getSecondRating(diffMs: number): { rating: string; score: number; verdict: string } {
  // Score formula: 100 max, scaling down by ms diff
  const score = Math.max(0, Math.min(100, 100 - (diffMs / 8)));

  if (diffMs < 10) {
    return {
      rating: 'Basically a clock ⏱️',
      score: Math.round(score * 10) / 10,
      verdict: 'Inhuman internal clockwork precision!',
    };
  } else if (diffMs <= 50) {
    return {
      rating: 'Metronome precision 🎵',
      score: Math.round(score * 10) / 10,
      verdict: 'Sub-50ms reaction mastery.',
    };
  } else if (diffMs <= 150) {
    return {
      rating: 'Pretty sharp ⚡',
      score: Math.round(score * 10) / 10,
      verdict: 'Solid temporal estimation.',
    };
  } else if (diffMs <= 400) {
    return {
      rating: 'Did you blink? 👀',
      score: Math.round(score * 10) / 10,
      verdict: 'A slight stutter in time sense.',
    };
  } else {
    return {
      rating: 'Did you fall asleep? 💤',
      score: Math.round(score * 10) / 10,
      verdict: 'Time slipped away completely.',
    };
  }
}
