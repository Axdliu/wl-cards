export type CardTheme = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  statHigh: string;
  statLow: string;
  /** Outer frame thickness (physical card feel). Default 2 */
  frameWidth?: number;
  shadowColor?: string;
  /** When set, CollectibleCard paints a foil / finish wash */
  metal?: 'gold' | 'silver' | 'laser' | 'diamond' | 'matte' | 'obsidian';
  /** Living AmbientKit-style backdrop (drifting orbs / stars) */
  ambient?: 'aurora' | 'magic' | 'ember' | 'ocean';
};

/** Default app chrome stays dark; individual cards should prefer a `cardStyle`. */
export const defaultCardTheme: CardTheme = {
  bg: '#0f1419',
  surface: '#1a222c',
  surfaceAlt: '#232d3a',
  border: '#2e3a48',
  text: '#e8eef4',
  textMuted: '#8b9aab',
  accent: '#3d8b7a',
  statHigh: '#6bc4a6',
  statLow: '#c45c5c',
  frameWidth: 2,
  shadowColor: '#000',
};

export type HoloVariant = 'none' | 'common' | 'rare' | 'legendary';

/**
 * A measurable attribute on the card.
 * Provide `description` so tapping the row opens an explanation.
 */
export type CardStat = {
  /** Display name, e.g. "Boldness" */
  label: string;
  value: number;
  /** Scale maximum. Default 10 */
  max?: number;
  /** Short explanation shown when the user taps this stat */
  description?: string;
};

/**
 * A trait / chip on the card.
 * Strings are still accepted; objects unlock tap-to-explain.
 */
export type CardChip = {
  label: string;
  /** Short explanation shown when the user taps this chip */
  description?: string;
};

export type CardChipInput = string | CardChip;

export type CardBadge = {
  label: string;
  color?: string;
  /** Optional explanation when the badge is tapped */
  description?: string;
};

export type CardArtSource =
  | { kind: 'initial'; text: string }
  | { kind: 'image'; uri: string }
  | { kind: 'custom' };

export type TiltConfig = {
  /** Max rotation in degrees. Default 12 */
  maxTilt?: number;
  /** Spring back when released. Default true */
  resetOnRelease?: boolean;
  /** Enable holo shine while tilting. Default true when holo !== 'none' */
  holo?: HoloVariant;
};
