import type { CardTheme } from '../theme/types';

export function clampStat(value: number, max = 10): number {
  return Math.max(0, Math.min(max, Math.round(value)));
}

export function statBarWidthPercent(value: number, max = 10): `${number}%` {
  const ratio = clampStat(value, max) / max;
  return `${Math.round(ratio * 100)}%`;
}

export function statColor(
  theme: CardTheme,
  value: number,
  max = 10,
): string {
  const v = clampStat(value, max);
  const thresholdHigh = Math.max(8, max - 2);
  const thresholdLow = Math.min(3, Math.ceil(max * 0.3));
  if (v >= thresholdHigh) return theme.statHigh;
  if (v <= thresholdLow) return theme.statLow;
  return theme.accent;
}

export function sumStatPower(stats: { value: number }[]): number {
  return stats.reduce((acc, s) => acc + clampStat(s.value), 0);
}

export function initialFromTitle(title: string): string {
  const letter = title.replace(/[^A-Za-z]/g, '').slice(0, 1);
  return letter || '?';
}
