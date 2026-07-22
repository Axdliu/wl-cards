import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import type {
  CardBadge,
  CardChipInput,
  CardStat,
  HoloVariant,
} from '../theme/types';
import { initialFromTitle, sumStatPower } from '../utils/stats';
import { CollectibleCard } from './CollectibleCard';
import {
  CardArt,
  CardChips,
  CardFlavor,
  CardFooter,
  CardHeader,
  CardMetaText,
  CardTitle,
} from './CardParts';
import { CardStatList } from './CardStatBar';
import { TiltCard } from './TiltCard';

export type StatCollectibleCardProps = {
  title: string;
  subtitle?: string;
  badge?: CardBadge;
  franchise?: string;
  /** Remote image URI */
  artUri?: string;
  /** Local `require(...)` / bundled art */
  artSource?: ImageSourcePropType;
  /** Trait chips — string or `{ label, description }` for tap-to-explain */
  chips?: CardChipInput[];
  /** Stats — include `description` on any row to enable tap-to-explain */
  stats: CardStat[];
  flavor?: string;
  footerLeft?: string;
  footerRight?: string;
  powerLabel?: string;
  compact?: boolean;
  active?: boolean;
  selected?: boolean;
  /** Wrap with touch tilt + holo overlay */
  interactive?: boolean;
  holo?: HoloVariant;
  onPress?: () => void;
};

/**
 * Opinionated Pokémon-style stat card — compose your own with CollectibleCard + CardParts if you need full control.
 */
export function StatCollectibleCard({
  title,
  subtitle,
  badge,
  franchise,
  artUri,
  artSource,
  chips = [],
  stats,
  flavor,
  footerLeft,
  footerRight,
  powerLabel = 'PWR',
  compact = false,
  active = false,
  selected = false,
  interactive = false,
  holo = 'rare',
  onPress,
}: StatCollectibleCardProps) {
  const power = sumStatPower(stats);
  const initial = initialFromTitle(title);

  const body = (
    <CollectibleCard
      compact={compact}
      active={active}
      selected={selected}
      bare={interactive}
      onPress={interactive ? undefined : onPress}
      style={
        holo === 'legendary'
          ? { borderColor: '#d4a017', shadowColor: '#ffb830', shadowOpacity: 0.45 }
          : holo === 'rare'
            ? { borderColor: '#8b6cc9' }
            : undefined
      }
    >
      <CardHeader
        badge={badge}
        trailing={
          <CardMetaText>
            {powerLabel} {power}
          </CardMetaText>
        }
      />
      <CardArt
        compact={compact}
        initial={initial}
        imageUri={artUri}
        imageSource={artSource}
        caption={franchise}
      />
      <CardTitle title={title} subtitle={subtitle} compact={compact} />
      <CardChips items={chips} max={compact ? 2 : 4} />
      <CardStatList
        stats={stats.map((s) => ({
          label: s.label,
          value: s.value,
          max: s.max,
          description: s.description,
          compact,
        }))}
        compact={compact}
      />
      {flavor ? <CardFlavor text={flavor} compact={compact} /> : null}
      <CardFooter
        left={footerLeft ? <CardMetaText>{footerLeft}</CardMetaText> : null}
        right={
          footerRight ? (
            <CardMetaText accent={active}>{footerRight}</CardMetaText>
          ) : null
        }
      />
    </CollectibleCard>
  );

  if (!interactive) {
    return body;
  }

  return (
    <View style={styles.interactiveWrap}>
      <TiltCard holo={holo} onPress={onPress} disabled={!onPress && holo === 'none'}>
        {body}
      </TiltCard>
    </View>
  );
}

const styles = StyleSheet.create({
  interactiveWrap: {
    marginBottom: 14,
  },
});
