import React, { useMemo, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type LayoutChangeEvent,
} from 'react-native';
import type { ComponentType } from 'react';

export type MetalKind =
  | 'gold'
  | 'silver'
  | 'laser'
  | 'diamond'
  | 'matte'
  | 'obsidian';

type Props = {
  kind: MetalKind;
  /** Optional foil/texture PNG used as a shade (multiply-ish overlay) */
  texture?: ImageSourcePropType;
};

type SkiaMetalProps = {
  kind: MetalKind;
  width: number;
  height: number;
};

const WEB_GRADIENTS: Record<MetalKind, string> = {
  gold: `linear-gradient(
      145deg,
      #5c4508 0%,
      #a67c12 12%,
      #f0d060 22%,
      #fff4c2 32%,
      #d4a017 42%,
      #8b6914 52%,
      #ffe9a0 62%,
      #c9a227 74%,
      #6e5210 88%,
      #e8c547 100%
    )`,
  silver: `linear-gradient(
      145deg,
      #4a5560 0%,
      #8e9aa8 14%,
      #e8eef4 26%,
      #ffffff 36%,
      #b0bac4 48%,
      #6a7684 58%,
      #f5f7fa 70%,
      #9aa5b0 82%,
      #5a6570 100%
    )`,
  laser: `linear-gradient(
      125deg,
      #ff0080 0%,
      #ff4d00 14%,
      #ffd000 28%,
      #3dff6e 42%,
      #00e5ff 56%,
      #4d6dff 70%,
      #c44dff 84%,
      #ff0080 100%
    )`,
  diamond: `linear-gradient(
      135deg,
      #a8c8ff 0%,
      #ffffff 18%,
      #d4b8ff 34%,
      #9ef0e8 50%,
      #ffffff 66%,
      #b0d4ff 82%,
      #e8d0ff 100%
    )`,
  matte: `linear-gradient(
      180deg,
      #e8e2d8 0%,
      #d9d2c6 45%,
      #cfc7b8 100%
    )`,
  obsidian: `linear-gradient(
      145deg,
      #0a0c10 0%,
      #1a1e28 28%,
      #3a4558 42%,
      #0c0e14 58%,
      #2a3344 72%,
      #050608 100%
    )`,
};

const FALLBACK_OPACITY: Record<MetalKind, number> = {
  gold: 0.55,
  silver: 0.55,
  laser: 0.42,
  diamond: 0.4,
  matte: 0.35,
  obsidian: 0.58,
};

const NATIVE_BANDS: Record<MetalKind, string[]> = {
  gold: ['#fff4c2', '#d4a017', '#8b6914', '#ffe9a0', '#a67c12'],
  silver: ['#ffffff', '#b0bac4', '#6a7684', '#e8eef4', '#8e9aa8'],
  laser: ['#ff4d00', '#ffd000', '#3dff6e', '#00e5ff', '#c44dff'],
  diamond: ['#ffffff', '#a8c8ff', '#d4b8ff', '#9ef0e8', '#c0d8ff'],
  matte: ['#e8e2d8', '#d4cdc2', '#c8bfb0', '#ddd6ca', '#bdb4a4'],
  obsidian: ['#3a4558', '#0a0c10', '#2a3344', '#1a1e28', '#050608'],
};

function loadSkiaMetal(): ComponentType<SkiaMetalProps> | null {
  try {
    // Soft require — apps without @shopify/react-native-skia keep CSS / band fallbacks
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./CardMetalSkia').CardMetalSkia as ComponentType<SkiaMetalProps>;
  } catch {
    return null;
  }
}

/**
 * Foil / finish wash (metal, crystal, matte, glass).
 * Prefers Skia RuntimeEffect shaders; falls back to CSS gradients (web) or banded Views.
 * Pass `texture` to shade with a real foil image (composited over the shader).
 */
export function CardMetalOverlay({ kind, texture }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const SkiaMetal = useMemo(() => loadSkiaMetal(), []);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) {
      setSize({ w: width, h: height });
    }
  };

  const useSkia = Boolean(SkiaMetal && size.w > 0 && size.h > 0);

  return (
    <View pointerEvents="none" style={styles.wash} onLayout={onLayout}>
      {!useSkia ? <FallbackMetal kind={kind} /> : null}
      {useSkia && SkiaMetal ? (
        <SkiaMetal kind={kind} width={size.w} height={size.h} />
      ) : null}
      {texture ? (
        <Image
          source={texture}
          style={[styles.texture, textureBlend(kind)]}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}

function FallbackMetal({ kind }: { kind: MetalKind }) {
  if (Platform.OS === 'web') {
    const blend =
      kind === 'laser' || kind === 'diamond'
        ? 'screen'
        : kind === 'matte'
          ? 'multiply'
          : 'soft-light';
    return (
      <View
        style={
          {
            ...styles.fill,
            backgroundImage: WEB_GRADIENTS[kind],
            opacity: FALLBACK_OPACITY[kind],
            mixBlendMode: blend,
          } as object
        }
      />
    );
  }

  const bands = NATIVE_BANDS[kind];
  const bandOpacity =
    kind === 'laser' || kind === 'diamond'
      ? 0.2
      : kind === 'matte'
        ? 0.18
        : 0.28;

  return (
    <View style={styles.fill}>
      {bands.map((color, i) => (
        <View
          key={`${kind}-${i}`}
          style={[
            styles.band,
            {
              backgroundColor: color,
              opacity: bandOpacity,
              top: `${8 + i * 18}%`,
              transform: [{ rotate: '-28deg' }, { scaleX: 1.4 }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function textureBlend(kind: MetalKind): ImageStyle {
  const opacity =
    kind === 'laser' || kind === 'diamond'
      ? 0.32
      : kind === 'matte'
        ? 0.22
        : 0.4;
  if (Platform.OS !== 'web') {
    return { opacity };
  }
  return {
    opacity,
    mixBlendMode: kind === 'matte' ? 'multiply' : 'soft-light',
  } as ImageStyle;
}

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  band: {
    position: 'absolute',
    left: '-20%',
    width: '140%',
    height: '16%',
  },
});
