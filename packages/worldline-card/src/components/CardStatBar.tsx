import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCardTheme } from '../theme/CardThemeContext';
import { statBarWidthPercent, statColor } from '../utils/stats';
import { useCardExplain } from './CardExplain';

export type CardStatBarProps = {
  label: string;
  value: number;
  max?: number;
  compact?: boolean;
  /** When set, tapping the row opens an explanation sheet */
  description?: string;
};

export function CardStatBar({
  label,
  value,
  max = 10,
  compact = false,
  description,
}: CardStatBarProps) {
  const theme = useCardTheme();
  const explainCtx = useCardExplain();
  const fillColor = statColor(theme, value, max);
  const canExplain = Boolean(description && explainCtx);

  const row = (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <Text
        style={[
          styles.label,
          { color: theme.textMuted },
          compact && styles.labelCompact,
          canExplain && styles.labelExplainable,
        ]}
      >
        {compact ? label.slice(0, 3) : label}
      </Text>
      <View style={[styles.track, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.fill,
            {
              width: statBarWidthPercent(value, max),
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
      <Text style={[styles.num, { color: theme.text }]}>{value}</Text>
    </View>
  );

  if (!canExplain || !description) {
    return row;
  }

  return (
    <Pressable
      onPress={() => explainCtx?.explain({ title: label, description })}
      accessibilityRole="button"
      accessibilityHint="Shows an explanation for this attribute"
      style={({ pressed }) => pressed && styles.pressed}
    >
      {row}
    </Pressable>
  );
}

export type CardStatListProps = {
  stats: CardStatBarProps[];
  compact?: boolean;
};

export function CardStatList({ stats, compact }: CardStatListProps) {
  return (
    <View style={styles.list}>
      {stats.map((stat) => (
        <CardStatBar key={stat.label} {...stat} compact={compact ?? stat.compact} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 4, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowCompact: { gap: 4 },
  label: {
    width: 72,
    fontSize: 11,
    fontWeight: '600',
  },
  labelCompact: { width: 28, fontSize: 9 },
  labelExplainable: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
  num: {
    width: 18,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  pressed: {
    opacity: 0.7,
  },
});
