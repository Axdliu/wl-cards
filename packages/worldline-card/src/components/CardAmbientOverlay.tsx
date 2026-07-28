import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { CardAmbientSkia } from './CardAmbientSkia';

export type AmbientKind = 'aurora' | 'magic' | 'ember' | 'ocean';

type Props = {
  kind: AmbientKind;
};

const WEB_GRADIENTS: Record<AmbientKind, string> = {
  aurora: `radial-gradient(ellipse 80% 60% at 20% 30%, #00d2ff 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 80% 70%, #7b2ff7 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 50% 50%, #5ef0c8 0%, transparent 45%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #1a1840 100%)`,
  magic: `radial-gradient(ellipse 70% 55% at 30% 40%, #e040fb 0%, transparent 55%),
    radial-gradient(ellipse 65% 50% at 75% 65%, #00e5ff 0%, transparent 50%),
    linear-gradient(180deg, #0b0014 0%, #4a0080 55%, #1a0033 100%)`,
  ember: `radial-gradient(ellipse 75% 55% at 40% 60%, #ff4500 0%, transparent 55%),
    radial-gradient(ellipse 60% 45% at 70% 30%, #ffd700 0%, transparent 50%),
    linear-gradient(145deg, #1a0a00 0%, #5a1a00 55%, #3a1200 100%)`,
  ocean: `radial-gradient(ellipse 80% 55% at 25% 35%, #4fc3f7 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 80% 75%, #80deea 0%, transparent 50%),
    linear-gradient(160deg, #0a1628 0%, #0d47a1 50%, #0a2a50 100%)`,
};

/**
 * Living AmbientKit-style card backdrop (aurora / magic / ember / ocean).
 */
export function CardAmbientOverlay({ kind }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) {
      setSize({ w: width, h: height });
    }
  };

  return (
    <View pointerEvents="none" style={styles.wash} onLayout={onLayout}>
      {/* CSS base always visible on web; Skia layers on top when sized */}
      {Platform.OS === 'web' ? <WebAmbient kind={kind} /> : null}
      {size.w > 0 && size.h > 0 ? (
        <CardAmbientSkia kind={kind} width={size.w} height={size.h} />
      ) : Platform.OS !== 'web' ? (
        <NativeFallback kind={kind} />
      ) : null}
    </View>
  );
}

function WebAmbient({ kind }: { kind: AmbientKind }) {
  return (
    <View
      style={
        {
          ...styles.fill,
          backgroundImage: WEB_GRADIENTS[kind],
          backgroundSize: '200% 200%',
          animationName: 'wlAmbientDrift',
          animationDuration: '8s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',
        } as object
      }
    />
  );
}

function NativeFallback({ kind }: { kind: AmbientKind }) {
  const tones: Record<AmbientKind, string[]> = {
    aurora: ['#00d2ff', '#7b2ff7', '#5ef0c8'],
    magic: ['#e040fb', '#00e5ff', '#ff80ff'],
    ember: ['#ff4500', '#ffd700', '#ff6b35'],
    ocean: ['#4fc3f7', '#80deea', '#26c6da'],
  };

  return (
    <View style={[styles.fill, { backgroundColor: '#0a0a12' }]}>
      {tones[kind].map((color, i) => (
        <View
          key={`${kind}-${i}`}
          style={[
            styles.blob,
            {
              backgroundColor: color,
              opacity: 0.45,
              top: `${8 + i * 24}%`,
              left: `${4 + i * 20}%`,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 0,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: '60%',
    height: '45%',
    borderRadius: 999,
  },
});
