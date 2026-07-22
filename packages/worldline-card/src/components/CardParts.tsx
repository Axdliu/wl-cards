import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useCardTheme } from '../theme/CardThemeContext';
import type { CardChipInput } from '../theme/types';
import { useCardExplain } from './CardExplain';

export type CardHeaderProps = {
  badge?: { label: string; color?: string; description?: string };
  trailing?: React.ReactNode;
};

export function CardHeader({ badge, trailing }: CardHeaderProps) {
  const explainCtx = useCardExplain();

  const badgeNode = badge ? (
    <View
      style={[
        styles.badge,
        badge.color ? { backgroundColor: badge.color } : null,
      ]}
    >
      <Text style={styles.badgeText}>{badge.label}</Text>
    </View>
  ) : (
    <View />
  );

  return (
    <View style={styles.row}>
      {badge?.description && explainCtx ? (
        <Pressable
          onPress={() => {
            const { label, description } = badge;
            if (!description) return;
            explainCtx.explain({ title: label, description });
          }}
          accessibilityRole="button"
          accessibilityHint="Shows an explanation for this badge"
        >
          {badgeNode}
        </Pressable>
      ) : (
        badgeNode
      )}
      {trailing}
    </View>
  );
}

export type CardArtProps = {
  /**
   * Fixed square edge length. When omitted, the art fills the card width
   * as a 1:1 square (`aspectRatio: 1`).
   */
  size?: number;
  /** @deprecated Prefer `size`. Treated as the square edge length. */
  height?: number;
  compact?: boolean;
  initial?: string;
  /** Remote or file URI */
  imageUri?: string;
  /** Local `require(...)` / bundled asset — preferred for app assets */
  imageSource?: ImageSourcePropType;
  caption?: string;
  children?: React.ReactNode;
};

export function CardArt({
  size,
  height,
  compact = false,
  initial,
  imageUri,
  imageSource,
  caption,
  children,
}: CardArtProps) {
  const theme = useCardTheme();
  const edge = size ?? height;
  const resolvedSource =
    imageSource ?? (imageUri ? { uri: imageUri } : undefined);

  return (
    <View
      style={[
        styles.frame,
        {
          backgroundColor: theme.surfaceAlt,
          borderColor: theme.border,
        },
        edge != null
          ? { width: edge, height: edge, alignSelf: 'center' }
          : styles.frameSquare,
        compact && styles.frameCompact,
      ]}
    >
      {children ??
        (resolvedSource ? (
          <Image
            source={resolvedSource}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.initial,
              { color: theme.accent },
              compact && styles.initialCompact,
            ]}
          >
            {initial ?? '?'}
          </Text>
        ))}
      {caption ? (
        <Text
          style={[styles.caption, { color: theme.textMuted }]}
          numberOfLines={1}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

export type CardTitleProps = {
  title: string;
  subtitle?: string;
  compact?: boolean;
};

export function CardTitle({ title, subtitle, compact }: CardTitleProps) {
  const theme = useCardTheme();
  return (
    <View>
      <Text
        style={[
          styles.title,
          { color: theme.text },
          compact && styles.titleCompact,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {!compact && subtitle ? (
        <Text
          style={[styles.subtitle, { color: theme.textMuted }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export type CardChipsProps = {
  /** Plain strings or `{ label, description }` for tap-to-explain */
  items: CardChipInput[];
  max?: number;
};

function normalizeChip(item: CardChipInput): {
  label: string;
  description?: string;
} {
  return typeof item === 'string' ? { label: item } : item;
}

export function CardChips({ items, max = 4 }: CardChipsProps) {
  const theme = useCardTheme();
  const explainCtx = useCardExplain();
  const visible = items.slice(0, max).map(normalizeChip);
  if (!visible.length) return null;

  return (
    <View style={styles.chipRow}>
      {visible.map((item) => {
        const canExplain = Boolean(item.description && explainCtx);
        const chip = (
          <View
            style={[
              styles.chip,
              {
                backgroundColor: theme.bg,
                borderColor: theme.border,
              },
              canExplain && styles.chipExplainable,
            ]}
          >
            <Text style={[styles.chipText, { color: theme.textMuted }]}>
              {item.label}
            </Text>
          </View>
        );

        if (!canExplain || !item.description) {
          return <View key={item.label}>{chip}</View>;
        }

        return (
          <Pressable
            key={item.label}
            onPress={() =>
              explainCtx?.explain({
                title: item.label,
                description: item.description!,
              })
            }
            accessibilityRole="button"
            accessibilityHint="Shows an explanation for this trait"
          >
            {chip}
          </Pressable>
        );
      })}
    </View>
  );
}

export type CardFlavorProps = {
  text: string;
  compact?: boolean;
  lines?: number;
};

export function CardFlavor({ text, compact, lines }: CardFlavorProps) {
  const theme = useCardTheme();
  return (
    <Text
      style={[
        styles.flavor,
        { color: theme.textMuted },
        compact && styles.flavorCompact,
      ]}
      numberOfLines={lines ?? (compact ? 2 : 3)}
    >
      {text}
    </Text>
  );
}

export type CardFooterProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function CardFooter({ left, right }: CardFooterProps) {
  return (
    <View style={styles.footer}>
      <View>{left}</View>
      <View>{right}</View>
    </View>
  );
}

export function CardMetaText({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  const theme = useCardTheme();
  return (
    <Text
      style={[
        styles.meta,
        { color: accent ? theme.accent : theme.textMuted },
        accent && styles.metaAccent,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#4a5568',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  frame: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  frameSquare: {
    width: '100%',
    aspectRatio: 1,
  },
  frameCompact: { marginBottom: 6 },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  initial: {
    fontSize: 56,
    fontWeight: '800',
    opacity: 0.85,
  },
  initialCompact: { fontSize: 32 },
  caption: {
    position: 'absolute',
    bottom: 6,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  titleCompact: { fontSize: 14 },
  subtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginBottom: 8,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  chipExplainable: {
    borderStyle: 'dashed',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  flavor: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  flavorCompact: { fontSize: 10, lineHeight: 14 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  meta: {
    fontSize: 10,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  metaAccent: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
