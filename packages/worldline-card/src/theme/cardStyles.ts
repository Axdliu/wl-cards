import type { CardTheme } from './types';

/**
 * Named looks inspired by physical trading cards (paper stock + colored frames),
 * not dark UI chrome.
 */
export type CardStyleId =
  | 'classic'
  | 'crimson'
  | 'forest'
  | 'royal'
  | 'ocean'
  | 'amber'
  /** Metallic gold foil stock */
  | 'gold'
  /** Chrome / platinum stock */
  | 'silver'
  /** Rainbow laser-holo frame (a.k.a. “laser” foil) */
  | 'laser';

export const CARD_STYLE_IDS: CardStyleId[] = [
  'classic',
  'crimson',
  'forest',
  'royal',
  'ocean',
  'amber',
  'gold',
  'silver',
  'laser',
];


export type CardStylePreset = CardTheme & {
  /** Outer frame thickness */
  frameWidth: number;
  /** Soft drop-shadow tint */
  shadowColor: string;
};

/** Cream stock + gold frame — classic TCG energy */
export const classicCardStyle: CardStylePreset = {
  bg: '#efe6d4',
  surface: '#f7f1e4',
  surfaceAlt: '#e5dcc8',
  border: '#c9a227',
  text: '#2a2418',
  textMuted: '#6b5e48',
  accent: '#9a7b1a',
  statHigh: '#2f7d4a',
  statLow: '#b33b3b',
  frameWidth: 5,
  shadowColor: '#8a7340',
};

/** Ivory + deep red frame — comic / fire */
export const crimsonCardStyle: CardStylePreset = {
  bg: '#f3e4e2',
  surface: '#fbf5f3',
  surfaceAlt: '#edd5d1',
  border: '#9e2a2b',
  text: '#2b1414',
  textMuted: '#7a4a4a',
  accent: '#c23b3d',
  statHigh: '#c45c2c',
  statLow: '#8b1e1e',
  frameWidth: 5,
  shadowColor: '#6e2a2a',
};

/** Soft parchment + green frame — nature / adventure */
export const forestCardStyle: CardStylePreset = {
  bg: '#e4ecdf',
  surface: '#f3f7ef',
  surfaceAlt: '#d7e4cf',
  border: '#3f6b4a',
  text: '#1c2a1e',
  textMuted: '#4f6654',
  accent: '#3d8b5a',
  statHigh: '#2f8f5b',
  statLow: '#a85a2a',
  frameWidth: 5,
  shadowColor: '#2f4a35',
};

/** Cool lilac paper + violet frame — mystic / rare */
export const royalCardStyle: CardStylePreset = {
  bg: '#ebe4f4',
  surface: '#f6f2fb',
  surfaceAlt: '#ddd3ec',
  border: '#6b4ea3',
  text: '#241833',
  textMuted: '#65567a',
  accent: '#7c5cbf',
  statHigh: '#5a7fd4',
  statLow: '#a84d7a',
  frameWidth: 5,
  shadowColor: '#4a356e',
};

/** Bright white-blue + steel teal frame — tech / hero */
export const oceanCardStyle: CardStylePreset = {
  bg: '#e2eef5',
  surface: '#f4f9fc',
  surfaceAlt: '#d3e4ef',
  border: '#2a6f8f',
  text: '#142430',
  textMuted: '#4d6675',
  accent: '#2f8fb5',
  statHigh: '#2a8f8a',
  statLow: '#c45c5c',
  frameWidth: 5,
  shadowColor: '#2a4a5a',
};

/** Warm sand + bronze frame — history / legend */
export const amberCardStyle: CardStylePreset = {
  bg: '#f0e2c8',
  surface: '#faf3e6',
  surfaceAlt: '#e8d7b8',
  border: '#a67c2d',
  text: '#2c2112',
  textMuted: '#6e5a38',
  accent: '#b8860b',
  statHigh: '#6b8e23',
  statLow: '#a0522d',
  frameWidth: 5,
  shadowColor: '#6e5320',
};

/** Heavy gold foil — premium / chase card */
export const goldCardStyle: CardStylePreset = {
  bg: '#f0d878',
  surface: '#ffe566',
  surfaceAlt: '#f5c842',
  border: '#8b6914',
  text: '#2a1f05',
  textMuted: '#6b5420',
  accent: '#a67c00',
  statHigh: '#6b5a00',
  statLow: '#8b3a10',
  frameWidth: 8,
  shadowColor: '#8b6914',
};

/** Chrome silver — steel / uncommon metal */
export const silverCardStyle: CardStylePreset = {
  bg: '#cfd6de',
  surface: '#e8eef4',
  surfaceAlt: '#b8c2cc',
  border: '#5a6570',
  text: '#12161a',
  textMuted: '#4a5560',
  accent: '#4a5560',
  statHigh: '#2a6a5a',
  statLow: '#8a4040',
  frameWidth: 8,
  shadowColor: '#3a4550',
};

/** Laser / rainbow holographic frame */
export const laserCardStyle: CardStylePreset = {
  bg: '#e0d4ff',
  surface: '#f3ecff',
  surfaceAlt: '#c9b0ff',
  border: '#ff00aa',
  text: '#1a0a33',
  textMuted: '#5a4080',
  accent: '#00e5ff',
  statHigh: '#00c4a0',
  statLow: '#ff4080',
  frameWidth: 8,
  shadowColor: '#aa00ff',
};

export const cardStyles: Record<CardStyleId, CardStylePreset> = {
  classic: classicCardStyle,
  crimson: crimsonCardStyle,
  forest: forestCardStyle,
  royal: royalCardStyle,
  ocean: oceanCardStyle,
  amber: amberCardStyle,
  gold: goldCardStyle,
  silver: silverCardStyle,
  laser: laserCardStyle,
};

export function resolveCardStyle(
  id?: CardStyleId | null,
): CardStylePreset | undefined {
  if (!id) return undefined;
  return cardStyles[id];
}
