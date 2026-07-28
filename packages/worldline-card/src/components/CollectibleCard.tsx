import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useCardTheme } from '../theme/CardThemeContext';
import { CardAmbientOverlay, type AmbientKind } from './CardAmbientOverlay';
import { CardExplainHost } from './CardExplain';
import { CardMetalOverlay, type MetalKind } from './CardMetalOverlay';

export type CollectibleCardProps = {
  children: React.ReactNode;
  compact?: boolean;
  active?: boolean;
  /** Highlight border — e.g. selected in a binder */
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Skip outer margin — use when nested inside TiltCard */
  bare?: boolean;
  /**
   * Force a metal foil wash. If omitted, uses `theme.metal` from the active card style.
   */
  metal?: MetalKind | null;
  /** Optional foil texture image used as a shade over the card */
  metalTexture?: ImageSourcePropType;
  /**
   * Force an AmbientKit-style living backdrop. If omitted, uses `theme.ambient`.
   */
  ambient?: AmbientKind | null;
  testID?: string;
};

export function CollectibleCard({
  children,
  compact = false,
  active = false,
  selected = false,
  onPress,
  style,
  bare = false,
  metal,
  metalTexture,
  ambient,
  testID,
}: CollectibleCardProps) {
  const theme = useCardTheme();
  const frameWidth = theme.frameWidth ?? 2;
  const metalKind =
    metal === null ? undefined : (metal ?? (theme as { metal?: MetalKind }).metal);
  const ambientKind =
    ambient === null
      ? undefined
      : (ambient ?? (theme as { ambient?: AmbientKind }).ambient);

  const cardStyle = [
    styles.card,
    {
      backgroundColor: ambientKind ? theme.bg : theme.surface,
      borderColor: selected || active ? theme.accent : theme.border,
      borderWidth: frameWidth,
      shadowColor: theme.shadowColor ?? '#000',
    },
    compact && styles.cardCompact,
    (selected || active) && styles.cardHighlighted,
    style,
  ];

  const inner = (
    <View style={cardStyle} testID={testID}>
      {ambientKind ? <CardAmbientOverlay kind={ambientKind} /> : null}
      {metalKind ? (
        <CardMetalOverlay kind={metalKind} texture={metalTexture} />
      ) : null}
      <View style={styles.content}>
        <CardExplainHost>{children}</CardExplainHost>
      </View>
    </View>
  );

  const wrapStyle = bare
    ? undefined
    : compact
      ? styles.pressCompact
      : styles.press;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={wrapStyle}
        accessibilityRole="button"
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={wrapStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  press: { marginBottom: 14 },
  pressCompact: { flex: 1, margin: 6 },
  card: {
    borderRadius: 14,
    padding: 12,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
    overflow: 'hidden',
  },
  cardCompact: {
    padding: 10,
    borderRadius: 12,
  },
  cardHighlighted: {
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
