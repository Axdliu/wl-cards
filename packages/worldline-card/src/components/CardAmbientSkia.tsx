import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  RadialGradient,
  Rect,
  vec,
  useClock,
} from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useMetalTilt } from './MetalTiltContext';
import type { AmbientKind } from './CardAmbientOverlay';

type Props = {
  kind: AmbientKind;
  width: number;
  height: number;
};

/** Base gradient stops + bright orb colors (last entries are the glow accents) */
const PALETTES: Record<AmbientKind, string[]> = {
  aurora: ['#0f0c29', '#302b63', '#1a1840', '#00d2ff', '#7b2ff7', '#5ef0c8'],
  magic: ['#0b0014', '#1a0033', '#2a0050', '#e040fb', '#00e5ff', '#ff80ff'],
  ember: ['#1a0a00', '#3a1200', '#5a1a00', '#ff4500', '#ffd700', '#ff6b35'],
  ocean: ['#0a1628', '#0d47a1', '#0a2a50', '#4fc3f7', '#80deea', '#26c6da'],
};

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Card-scoped AmbientKit-style backgrounds — drifting blurred orbs, stars, vignette.
 */
export function CardAmbientSkia({ kind, width, height }: Props) {
  const clock = useClock();
  const tilt = useMetalTilt();
  const zero = useSharedValue(0);
  const palette = PALETTES[kind];
  const minSide = Math.min(width, height);

  const orbs = useMemo(() => {
    const accents = palette.slice(3);
    return Array.from({ length: 5 }, (_, i) => ({
      cx: 0.12 + seeded(i * 3 + 1) * 0.76,
      cy: 0.12 + seeded(i * 3 + 2) * 0.76,
      radius: 0.35 + seeded(i * 3 + 3) * 0.35,
      phase: seeded(i + 10) * Math.PI * 2,
      color: accents[i % accents.length] ?? '#00d2ff',
      index: i,
    }));
  }, [palette]);

  const stars = useMemo(() => {
    if (kind !== 'magic' && kind !== 'aurora') return [];
    return Array.from({ length: 28 }, (_, i) => ({
      x: seeded(i * 5 + 1),
      y: seeded(i * 5 + 2),
      size: 1 + seeded(i * 5 + 3) * 2.2,
      twinkle: seeded(i * 5 + 4) * Math.PI * 2,
      index: i,
    }));
  }, [kind]);

  const t = useDerivedValue(() => clock.value / 1000);
  const tiltX = useDerivedValue(() => tilt?.tiltX.value ?? zero.value);
  const tiltY = useDerivedValue(() => tilt?.tiltY.value ?? zero.value);

  if (width < 2 || height < 2) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={{ width, height }}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={kind === 'magic' ? vec(0, height) : vec(width, height)}
            colors={[palette[0], palette[1], palette[2]]}
          />
        </Rect>

        <Group blendMode="screen">
          {orbs.map((orb) => (
            <AmbientOrb
              key={orb.index}
              orb={orb}
              t={t}
              tiltX={tiltX}
              tiltY={tiltY}
              width={width}
              height={height}
              minSide={minSide}
              intensity={1}
            />
          ))}
        </Group>

        {stars.map((star) => (
          <AmbientStar
            key={star.index}
            star={star}
            t={t}
            width={width}
            height={height}
          />
        ))}

        {(kind === 'magic' || kind === 'ember') && (
          <Rect x={0} y={0} width={width} height={height}>
            <RadialGradient
              c={vec(width / 2, height / 2)}
              r={Math.max(width, height) * 0.75}
              colors={[
                'transparent',
                kind === 'ember' ? 'rgba(20,4,0,0.45)' : 'rgba(0,0,0,0.4)',
              ]}
            />
          </Rect>
        )}
      </Canvas>
    </View>
  );
}

function AmbientOrb({
  orb,
  t,
  tiltX,
  tiltY,
  width,
  height,
  minSide,
  intensity,
}: {
  orb: {
    cx: number;
    cy: number;
    radius: number;
    phase: number;
    color: string;
    index: number;
  };
  t: SharedValue<number>;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  width: number;
  height: number;
  minSide: number;
  intensity: number;
}) {
  const cx = useDerivedValue(() => {
    const wave = Math.sin(t.value * 0.7 + orb.phase + orb.index) * 0.12 * intensity;
    return (orb.cx + wave + tiltX.value * 0.1) * width;
  });
  const cy = useDerivedValue(() => {
    const wave = Math.cos(t.value * 0.55 + orb.phase + orb.index) * 0.12 * intensity;
    return (orb.cy + wave - tiltY.value * 0.1) * height;
  });
  const r = useDerivedValue(() => {
    const pulse = 0.82 + Math.sin(t.value * 0.65 + orb.phase) * 0.18 * intensity;
    return orb.radius * pulse * minSide * 0.7;
  });

  return (
    <Circle cx={cx} cy={cy} r={r} color={orb.color} opacity={0.55 * intensity}>
      <BlurMask blur={Math.max(18, minSide * 0.1)} style="normal" />
    </Circle>
  );
}

function AmbientStar({
  star,
  t,
  width,
  height,
}: {
  star: { x: number; y: number; size: number; twinkle: number; index: number };
  t: SharedValue<number>;
  width: number;
  height: number;
}) {
  const opacity = useDerivedValue(() => {
    return 0.35 + Math.sin(t.value * 2.6 + star.twinkle) * 0.55;
  });

  return (
    <Circle
      cx={star.x * width}
      cy={star.y * height}
      r={star.size}
      color="#ffffff"
      opacity={opacity}
    />
  );
}
