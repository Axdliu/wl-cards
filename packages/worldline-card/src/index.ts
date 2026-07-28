export { CollectibleCard } from './components/CollectibleCard';
export type { CollectibleCardProps } from './components/CollectibleCard';

export {
  CardArt,
  CardChips,
  CardFlavor,
  CardFooter,
  CardHeader,
  CardMetaText,
  CardTitle,
} from './components/CardParts';
export type {
  CardArtProps,
  CardChipsProps,
  CardFlavorProps,
  CardFooterProps,
  CardHeaderProps,
  CardTitleProps,
} from './components/CardParts';

export { CardStatBar, CardStatList } from './components/CardStatBar';
export type { CardStatBarProps, CardStatListProps } from './components/CardStatBar';

export { CardExplainHost, useCardExplain } from './components/CardExplain';
export type { CardExplainPayload } from './components/CardExplain';

export { CardMetalOverlay } from './components/CardMetalOverlay';
export type { MetalKind } from './components/CardMetalOverlay';

export { CardAmbientOverlay } from './components/CardAmbientOverlay';
export type { AmbientKind } from './components/CardAmbientOverlay';

export { TiltCard } from './components/TiltCard';
export type { TiltCardProps } from './components/TiltCard';

export { StatCollectibleCard } from './components/StatCollectibleCard';
export type { StatCollectibleCardProps } from './components/StatCollectibleCard';

export { CardThemeProvider, useCardTheme } from './theme/CardThemeContext';
export type { CardThemeProviderProps } from './theme/CardThemeContext';

export {
  CARD_STYLE_IDS,
  cardStyles,
  classicCardStyle,
  crimsonCardStyle,
  forestCardStyle,
  royalCardStyle,
  oceanCardStyle,
  amberCardStyle,
  goldCardStyle,
  silverCardStyle,
  laserCardStyle,
  diamondCardStyle,
  matteCardStyle,
  obsidianCardStyle,
  auroraCardStyle,
  cosmicCardStyle,
  emberCardStyle,
  tideCardStyle,
  resolveCardStyle,
} from './theme/cardStyles';
export type { CardStyleId, CardStylePreset } from './theme/cardStyles';

export { defaultCardTheme } from './theme/types';
export type {
  CardArtSource,
  CardBadge,
  CardChip,
  CardChipInput,
  CardStat,
  CardTheme,
  HoloVariant,
  TiltConfig,
} from './theme/types';

export {
  clampStat,
  initialFromTitle,
  statBarWidthPercent,
  statColor,
  sumStatPower,
} from './utils/stats';
