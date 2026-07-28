import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CardHoloOverlay } from './CardHoloOverlay';
import { MetalTiltProvider } from './MetalTiltContext';
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

/** Soft settle — like a card returning to the table */
const settleSpring = { damping: 16, stiffness: 140, mass: 0.85 };
const pressSpring = { damping: 20, stiffness: 260, mass: 0.4 };

/** Ease toward extremes so edges don’t feel clipped */
function curveAxis(v: number) {
  'worklet';
  const clamped = Math.max(-1, Math.min(1, v));
  return Math.sin((clamped * Math.PI) / 2);
}

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
  const maxTilt = tilt?.maxTilt ?? 18;
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
    // Finger position → light/tilt; slight bias so center feels stable
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    tiltX.value = curveAxis(nx);
    tiltY.value = curveAxis(-ny);
  };

  const resetTilt = () => {
    'worklet';
    dragging.value = 0;
    cancelAnimation(tiltX);
    cancelAnimation(tiltY);
    cancelAnimation(press);
    press.value = withSpring(0, pressSpring);
    if (resetOnRelease) {
      tiltX.value = withSpring(0, settleSpring);
      tiltY.value = withSpring(0, settleSpring);
    }
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .maxPointers(1)
    .activeOffsetX([-6, 6])
    .activeOffsetY([-6, 6])
    .onStart((e) => {
      dragging.value = 1;
      cancelAnimation(tiltX);
      cancelAnimation(tiltY);
      press.value = withSpring(1, pressSpring);
      applyTilt(e.x, e.y);
    })
    .onUpdate((e) => {
      applyTilt(e.x, e.y);
    })
    .onEnd((e) => {
      // Tiny inertia kick from finger velocity, then settle flat
      if (resetOnRelease) {
        const kickX = Math.max(-0.35, Math.min(0.35, e.velocityX / 2400));
        const kickY = Math.max(-0.35, Math.min(0.35, -e.velocityY / 2400));
        tiltX.value = tiltX.value + kickX;
        tiltY.value = tiltY.value + kickY;
      }
      resetTilt();
    })
    .onFinalize(() => {
      if (
        dragging.value === 1 ||
        Math.abs(tiltX.value) > 0.01 ||
        Math.abs(tiltY.value) > 0.01
      ) {
        resetTilt();
      } else {
        press.value = withSpring(0, pressSpring);
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
    const motion =
      Math.min(1, Math.abs(tiltX.value) + Math.abs(tiltY.value)) * 0.5 +
      press.value * 0.5;
    const rotateY = tiltX.value * maxTilt;
    const rotateX = tiltY.value * maxTilt;
    // Slight twist when cornering — real cards don’t rotate on one axis only
    const rotateZ = tiltX.value * tiltY.value * -4;
    const liftY = interpolate(motion, [0, 1], [0, -6]);
    const scale = interpolate(motion, [0, 1], [1, 1.035]);
    return {
      transform: [
        { perspective: 900 },
        { translateY: liftY },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { rotateZ: `${rotateZ}deg` },
        { scale },
      ],
      shadowOpacity: interpolate(motion, [0, 1], [0.22, 0.42]),
      shadowRadius: interpolate(motion, [0, 1], [10, 22]),
      shadowOffset: {
        width: interpolate(tiltX.value, [-1, 1], [14, -14]),
        height: interpolate(tiltY.value, [-1, 1], [4, 18]),
      },
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
          <MetalTiltProvider tiltX={tiltX} tiltY={tiltY}>
            {children}
            {holoVariant !== 'none' ? (
              <CardHoloOverlay
                variant={holoVariant}
                tiltX={tiltX}
                tiltY={tiltY}
              />
            ) : null}
          </MetalTiltProvider>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    shadowColor: '#000',
  },
  inner: {
    overflow: 'hidden',
    borderRadius: 14,
  },
});
