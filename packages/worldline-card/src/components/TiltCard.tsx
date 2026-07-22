import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CardHoloOverlay } from './CardHoloOverlay';
import type { HoloVariant, TiltConfig } from '../theme/types';

export type TiltCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Card width used to map touch position → tilt. Measured automatically if omitted. */
  width?: number;
  height?: number;
  disabled?: boolean;
  holo?: HoloVariant;
  tilt?: Omit<TiltConfig, 'holo'>;
  onPress?: () => void;
};

const springConfig = { damping: 18, stiffness: 220, mass: 0.45 };

export function TiltCard({
  children,
  style,
  width: widthProp,
  height: heightProp,
  disabled = false,
  holo = 'rare',
  tilt,
  onPress,
}: TiltCardProps) {
  const maxTilt = tilt?.maxTilt ?? 14;
  const resetOnRelease = tilt?.resetOnRelease ?? true;
  const holoVariant = holo;

  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const press = useSharedValue(0);
  const layoutW = useSharedValue(widthProp ?? 280);
  const layoutH = useSharedValue(heightProp ?? 400);
  const dragging = useSharedValue(0);

  const applyTilt = (x: number, y: number) => {
    'worklet';
    const w = Math.max(layoutW.value, 1);
    const h = Math.max(layoutH.value, 1);
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    tiltX.value = Math.max(-1, Math.min(1, nx));
    tiltY.value = Math.max(-1, Math.min(1, -ny));
  };

  const resetTilt = () => {
    'worklet';
    dragging.value = 0;
    cancelAnimation(tiltX);
    cancelAnimation(tiltY);
    cancelAnimation(press);
    press.value = withSpring(0, springConfig);
    if (resetOnRelease) {
      tiltX.value = withSpring(0, springConfig);
      tiltY.value = withSpring(0, springConfig);
    }
  };

  // Pan only activates after a short drag so ScrollView can still scroll,
  // and we never leave tilt applied from a cancelled touch-down.
  const pan = Gesture.Pan()
    .enabled(!disabled)
    .maxPointers(1)
    .activeOffsetX([-8, 8])
    .activeOffsetY([-8, 8])
    .onStart((e) => {
      dragging.value = 1;
      cancelAnimation(tiltX);
      cancelAnimation(tiltY);
      press.value = withSpring(1, springConfig);
      applyTilt(e.x, e.y);
    })
    .onUpdate((e) => {
      applyTilt(e.x, e.y);
    })
    .onEnd(() => {
      resetTilt();
    })
    .onFinalize(() => {
      // Always snap back — covers ScrollView cancelling the gesture mid-drag
      if (dragging.value === 1 || Math.abs(tiltX.value) > 0.01 || Math.abs(tiltY.value) > 0.01) {
        resetTilt();
      } else {
        press.value = withSpring(0, springConfig);
      }
    });

  const tap =
    onPress != null
      ? Gesture.Tap()
          .enabled(!disabled)
          .maxDuration(250)
          .onEnd(() => {
            runOnJS(onPress)();
          })
      : null;

  const gesture = tap != null ? Gesture.Exclusive(pan, tap) : pan;

  const cardMotion = useAnimatedStyle(() => {
    const rotateY = tiltX.value * maxTilt;
    const rotateX = tiltY.value * maxTilt;
    const scale = 1 - press.value * 0.02;
    return {
      transform: [
        { perspective: 1100 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { scale },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        collapsable={false}
        style={[styles.wrap, style, cardMotion]}
        onLayout={(e) => {
          layoutW.value = widthProp ?? e.nativeEvent.layout.width;
          layoutH.value = heightProp ?? e.nativeEvent.layout.height;
        }}
      >
        <View style={styles.inner} collapsable={false}>
          {children}
          {holoVariant !== 'none' ? (
            <CardHoloOverlay
              variant={holoVariant}
              tiltX={tiltX}
              tiltY={tiltY}
            />
          ) : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  inner: {
    overflow: 'hidden',
    borderRadius: 16,
  },
});
