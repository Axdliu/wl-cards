import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import type { HoloVariant } from '../theme/types';

type Props = {
  variant: HoloVariant;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
};

type Palette = {
  foil: string;
  foilAlt: string;
  rainbow: string;
  specular: string;
  glow: string;
  rest: number;
  peak: number;
};

const PALETTES: Record<Exclude<HoloVariant, 'none'>, Palette> = {
  common: {
    foil: 'rgba(170, 215, 255, 0.5)',
    foilAlt: 'rgba(200, 180, 255, 0.35)',
    rainbow: 'rgba(140, 255, 220, 0.28)',
    specular: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(150, 200, 255, 0.55)',
    rest: 0.2,
    peak: 0.75,
  },
  rare: {
    foil: 'rgba(130, 220, 255, 0.55)',
    foilAlt: 'rgba(255, 110, 200, 0.45)',
    rainbow: 'rgba(160, 255, 190, 0.35)',
    specular: 'rgba(255, 255, 255, 0.75)',
    glow: 'rgba(190, 130, 255, 0.6)',
    rest: 0.28,
    peak: 0.9,
  },
  legendary: {
    foil: 'rgba(255, 214, 70, 0.7)',
    foilAlt: 'rgba(255, 150, 40, 0.5)',
    rainbow: 'rgba(255, 240, 160, 0.4)',
    specular: 'rgba(255, 252, 230, 0.9)',
    glow: 'rgba(255, 190, 50, 0.75)',
    rest: 0.35,
    peak: 1,
  },
};

export function CardHoloOverlay({ variant, tiltX, tiltY }: Props) {
  const idle = useSharedValue(0);

  useEffect(() => {
    idle.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [idle]);

  if (variant === 'none') return null;

  const palette = PALETTES[variant];

  const foilStyle = useAnimatedStyle(() => {
    const motion = Math.min(1.4, Math.abs(tiltX.value) + Math.abs(tiltY.value));
    const tx = interpolate(tiltX.value, [-1, 1], [-50, 50]) + idle.value * 36 - 18;
    const ty = interpolate(tiltY.value, [-1, 1], [-28, 28]);
    const opacity = interpolate(
      motion + idle.value * 0.55,
      [0, 1.4],
      [palette.rest, palette.peak],
    );
    return {
      opacity,
      transform: [{ translateX: tx }, { translateY: ty }, { rotate: '24deg' }],
    };
  });

  const foilAltStyle = useAnimatedStyle(() => {
    const motion = Math.min(1.4, Math.abs(tiltX.value) + Math.abs(tiltY.value));
    const tx = interpolate(tiltX.value, [-1, 1], [42, -42]) - idle.value * 30 + 15;
    const ty = interpolate(tiltY.value, [-1, 1], [20, -20]);
    const opacity = interpolate(
      motion + idle.value * 0.45,
      [0, 1.4],
      [palette.rest * 0.65, palette.peak * 0.85],
    );
    return {
      opacity,
      transform: [{ translateX: tx }, { translateY: ty }, { rotate: '-32deg' }],
    };
  });

  const specularStyle = useAnimatedStyle(() => {
    const motion = Math.min(1, Math.abs(tiltX.value) * 1.1 + Math.abs(tiltY.value));
    const tx = interpolate(tiltX.value, [-1, 1], [-80, 80]) + idle.value * 50 - 25;
    const opacity = interpolate(
      motion + idle.value * 0.5,
      [0, 1.2],
      [0.18, palette.peak],
    );
    return {
      opacity,
      transform: [{ translateX: tx }, { rotate: '-20deg' }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const motion = Math.min(1, Math.abs(tiltX.value) + Math.abs(tiltY.value));
    const opacity = interpolate(
      motion + idle.value * 0.35,
      [0, 1.2],
      [0.45, 1],
    );
    return {
      opacity,
      borderColor: palette.glow,
      shadowColor: palette.glow,
    };
  });

  return (
    <View pointerEvents="none" style={styles.root}>
      {/* Thin foil ribbons — not a full-card muddy wash */}
      <Animated.View
        style={[styles.ribbon, { backgroundColor: palette.foil }, foilStyle]}
      />
      <Animated.View
        style={[
          styles.ribbonAlt,
          { backgroundColor: palette.foilAlt },
          foilAltStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.ribbonThin,
          { backgroundColor: palette.rainbow },
          foilStyle,
        ]}
      />

      {/* Moving specular glint */}
      <Animated.View
        style={[
          styles.specular,
          { backgroundColor: palette.specular },
          specularStyle,
        ]}
      />

      {variant === 'legendary' ? (
        <>
          <View style={[styles.sparkle, styles.sparkleA]} />
          <View style={[styles.sparkle, styles.sparkleB]} />
          <View style={[styles.sparkle, styles.sparkleC]} />
          <View style={[styles.sparkle, styles.sparkleD]} />
          <View style={[styles.sparkle, styles.sparkleE]} />
          <Animated.View style={[styles.goldEdge, glowStyle]} />
        </>
      ) : (
        <Animated.View style={[styles.softEdge, glowStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 16,
  },
  ribbon: {
    position: 'absolute',
    width: '170%',
    height: '16%',
    top: '22%',
    left: '-35%',
  },
  ribbonAlt: {
    position: 'absolute',
    width: '160%',
    height: '12%',
    top: '52%',
    left: '-30%',
  },
  ribbonThin: {
    position: 'absolute',
    width: '165%',
    height: '6%',
    top: '38%',
    left: '-32%',
  },
  specular: {
    position: 'absolute',
    width: '28%',
    height: '180%',
    top: '-40%',
    left: '36%',
  },
  softEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  goldEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2.5,
    backgroundColor: 'transparent',
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 248, 210, 1)',
    shadowColor: '#ffe08a',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  sparkleA: { top: '14%', left: '16%' },
  sparkleB: { top: '24%', right: '20%', width: 3, height: 3 },
  sparkleC: { top: '48%', left: '72%', width: 5, height: 5 },
  sparkleD: { top: '68%', left: '24%', width: 3, height: 3 },
  sparkleE: { top: '78%', right: '16%', width: 4, height: 4 },
});
