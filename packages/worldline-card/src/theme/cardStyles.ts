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
  | 'laser'
  /** Crystalline diamond / prism facets */
  | 'diamond'
  /** Soft velvet matte paper — no gloss */
  | 'matte'
  /** Deep black glass */
  | 'obsidian'
  /** AmbientKit aurora — drifting screen-blended glow bands */
  | 'aurora'
  /** AmbientKit cosmic / magic — orbs, stars, vignette */
  | 'cosmic'
  /** AmbientKit ember — warm fire glow */
  | 'ember'
  /** AmbientKit ocean mood — deep blue drift (distinct from paper `ocean`) */
  | 'tide';

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
  'diamond',
  'matte',
  'obsidian',
  'aurora',
  'cosmic',
  'ember',
  'tide',
];

export type CardStylePreset = CardTheme & {
  /** Outer frame thickness */
  frameWidth: number;
  /** Soft drop-shadow tint */
  shadowColor: string;
  /** Foil / finish wash (Skia shader; CSS / bands fallback) */
  metal?: 'gold' | 'silver' | 'laser' | 'diamond' | 'matte' | 'obsidian';
  /** Living AmbientKit-style backdrop */
  ambient?: 'aurora' | 'magic' | 'ember' | 'ocean';
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
  surface: '#f5e6a8',
  surfaceAlt: '#e8d070',
  border: '#8b6914',
  text: '#2a1f05',
  textMuted: '#6b5420',
  accent: '#a67c00',
  statHigh: '#6b5a00',
  statLow: '#8b3a10',
  frameWidth: 5,
  shadowColor: '#8b6914',
  metal: 'gold',
};

/** Chrome silver — steel / uncommon metal */
export const silverCardStyle: CardStylePreset = {
  bg: '#cfd6de',
  surface: '#d8dee6',
  surfaceAlt: '#b8c2cc',
  border: '#5a6570',
  text: '#12161a',
  textMuted: '#4a5560',
  accent: '#4a5560',
  statHigh: '#2a6a5a',
  statLow: '#8a4040',
  frameWidth: 5,
  shadowColor: '#3a4550',
  metal: 'silver',
};

/** Laser / rainbow holographic frame */
export const laserCardStyle: CardStylePreset = {
  bg: '#e0d4ff',
  surface: '#ebe0ff',
  surfaceAlt: '#c9b0ff',
  border: '#ff00aa',
  text: '#1a0a33',
  textMuted: '#5a4080',
  accent: '#00e5ff',
  statHigh: '#00c4a0',
  statLow: '#ff4080',
  frameWidth: 5,
  shadowColor: '#aa00ff',
  metal: 'laser',
};

/** Ice-clear diamond — prism facets + sparkle */
export const diamondCardStyle: CardStylePreset = {
  bg: '#e8f0fa',
  surface: '#f4f8fc',
  surfaceAlt: '#d4e4f4',
  border: '#7a9ec4',
  text: '#142030',
  textMuted: '#5a7088',
  accent: '#5a8ab8',
  statHigh: '#2a9a8a',
  statLow: '#c45a7a',
  frameWidth: 5,
  shadowColor: '#6a88a8',
  metal: 'diamond',
};

/** Soft matte paper — muted, no foil shine */
export const matteCardStyle: CardStylePreset = {
  bg: '#ddd6ca',
  surface: '#e8e2d6',
  surfaceAlt: '#cfc6b6',
  border: '#8a7e6c',
  text: '#2a2418',
  textMuted: '#6a5e4e',
  accent: '#7a6e5a',
  statHigh: '#4a7a58',
  statLow: '#9a5040',
  frameWidth: 5,
  shadowColor: '#5a5040',
  metal: 'matte',
};

/** Obsidian glass — deep black with sharp specular */
export const obsidianCardStyle: CardStylePreset = {
  bg: '#1a1c22',
  surface: '#242830',
  surfaceAlt: '#16181e',
  border: '#4a5568',
  text: '#e8eef4',
  textMuted: '#8b96a8',
  accent: '#7a90b0',
  statHigh: '#5ab89a',
  statLow: '#c45c6c',
  frameWidth: 5,
  shadowColor: '#000000',
  metal: 'obsidian',
};

/** AmbientKit aurora — living green/violet glow bands */
export const auroraCardStyle: CardStylePreset = {
  bg: '#0f0c29',
  surface: 'transparent',
  surfaceAlt: 'rgba(36, 36, 62, 0.55)',
  border: '#7b2ff7',
  text: '#eef4ff',
  textMuted: '#a8b0d0',
  accent: '#00d2ff',
  statHigh: '#5ef0c8',
  statLow: '#ff6b9d',
  frameWidth: 5,
  shadowColor: '#302b63',
  ambient: 'aurora',
};

/** AmbientKit cosmic / magic — stars + magenta orbs */
export const cosmicCardStyle: CardStylePreset = {
  bg: '#0b0014',
  surface: 'transparent',
  surfaceAlt: 'rgba(26, 0, 51, 0.55)',
  border: '#e040fb',
  text: '#f5e8ff',
  textMuted: '#b090c8',
  accent: '#00e5ff',
  statHigh: '#80ffd0',
  statLow: '#ff6090',
  frameWidth: 5,
  shadowColor: '#4a0080',
  ambient: 'magic',
};

/** AmbientKit ember — warm fire drift */
export const emberCardStyle: CardStylePreset = {
  bg: '#1a0a00',
  surface: 'transparent',
  surfaceAlt: 'rgba(58, 18, 0, 0.55)',
  border: '#ff6b35',
  text: '#fff4e8',
  textMuted: '#c8a080',
  accent: '#ffd700',
  statHigh: '#ffe066',
  statLow: '#ff4500',
  frameWidth: 5,
  shadowColor: '#ff4500',
  ambient: 'ember',
};

/** AmbientKit ocean mood — deep blue living tide */
export const tideCardStyle: CardStylePreset = {
  bg: '#0a1628',
  surface: 'transparent',
  surfaceAlt: 'rgba(13, 71, 161, 0.45)',
  border: '#4fc3f7',
  text: '#e8f6ff',
  textMuted: '#90b4c8',
  accent: '#80deea',
  statHigh: '#5ef0c8',
  statLow: '#ff8a80',
  frameWidth: 5,
  shadowColor: '#0d47a1',
  ambient: 'ocean',
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
  diamond: diamondCardStyle,
  matte: matteCardStyle,
  obsidian: obsidianCardStyle,
  aurora: auroraCardStyle,
  cosmic: cosmicCardStyle,
  ember: emberCardStyle,
  tide: tideCardStyle,
};

export function resolveCardStyle(
  id?: CardStyleId | null,
): CardStylePreset | undefined {
  if (!id) return undefined;
  return cardStyles[id];
}
