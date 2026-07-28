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

/** Follow the finger with a bit of mass — not 1:1 snapping */
const followSpring = { damping: 22, stiffness: 280, mass: 0.55 };
/** Soft settle onto the table with a hint of overshoot */
const settleSpring = { damping: 14, stiffness: 120, mass: 0.95 };
const pressSpring = { damping: 18, stiffness: 320, mass: 0.35 };
/** Flick decay before settling flat */
const inertiaSpring = { damping: 18, stiffness: 90, mass: 1.1 };

/** Soften extremes so corners don’t feel clipped / gimbal-locked */
function curveAxis(v: number) {
  'worklet';
  const clamped = Math.max(-1, Math.min(1, v));
  // gentler than pure sin — more linear in the middle, soft at edges
  return Math.sin((clamped * Math.PI) / 2) * 0.92 + clamped * 0.08;
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
  // Physical cards rarely tip past ~14° before they feel fake
  const maxTilt = tilt?.maxTilt ?? 14;
  const resetOnRelease = tilt?.resetOnRelease ?? true;
  const holoVariant = holo;

  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const press = useSharedValue(0);
  const layoutW = useSharedValue(widthProp ?? 280);
  const layoutH = useSharedValue(heightProp ?? 400);
  const dragging = useSharedValue(0);

  const applyTilt = (x: number, y: number, immediate = false) => {
    'worklet';
    const w = Math.max(layoutW.value, 1);
    const h = Math.max(layoutH.value, 1);
    // Touch relative to card center → pitch / yaw
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const targetX = curveAxis(nx);
    // Finger up on card = top tips toward you (positive rotateX)
    const targetY = curveAxis(-ny);

    if (immediate) {
      tiltX.value = targetX;
      tiltY.value = targetY;
      return;
    }
    tiltX.value = withSpring(targetX, followSpring);
    tiltY.value = withSpring(targetY, followSpring);
  };

  const resetTilt = (velocityX = 0, velocityY = 0) => {
    'worklet';
    dragging.value = 0;
    cancelAnimation(tiltX);
    cancelAnimation(tiltY);
    cancelAnimation(press);
    press.value = withSpring(0, pressSpring);

    if (!resetOnRelease) return;

    // Carry a bit of finger velocity, then settle — like letting go of a card
    const kickX = Math.max(-0.55, Math.min(0.55, velocityX / 1800));
    const kickY = Math.max(-0.55, Math.min(0.55, -velocityY / 1800));
    const coastX = Math.max(-1, Math.min(1, tiltX.value + kickX));
    const coastY = Math.max(-1, Math.min(1, tiltY.value + kickY));

    if (Math.abs(kickX) > 0.04 || Math.abs(kickY) > 0.04) {
      tiltX.value = withSpring(coastX, inertiaSpring, (finished) => {
        if (finished) {
          tiltX.value = withSpring(0, settleSpring);
        }
      });
      tiltY.value = withSpring(coastY, inertiaSpring, (finished) => {
        if (finished) {
          tiltY.value = withSpring(0, settleSpring);
        }
      });
    } else {
      tiltX.value = withSpring(0, settleSpring);
      tiltY.value = withSpring(0, settleSpring);
    }
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .maxPointers(1)
    .activeOffsetX([-4, 4])
    .activeOffsetY([-4, 4])
    .onStart((e) => {
      dragging.value = 1;
      cancelAnimation(tiltX);
      cancelAnimation(tiltY);
      // Press into the surface first, then the lift reads in the motion style
      press.value = withSpring(1, pressSpring);
      applyTilt(e.x, e.y, true);
    })
    .onUpdate((e) => {
      applyTilt(e.x, e.y);
    })
    .onEnd((e) => {
      resetTilt(e.velocityX, e.velocityY);
    })
    .onFinalize(() => {
      if (dragging.value === 1) {
        resetTilt();
      } else if (press.value > 0.01) {
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
    const absX = Math.abs(tiltX.value);
    const absY = Math.abs(tiltY.value);
    const tiltMag = Math.min(1, Math.sqrt(absX * absX + absY * absY));
    const motion = tiltMag * 0.65 + press.value * 0.35;

    // Pitch slightly stronger than yaw — how a card pivots in-hand
    const rotateY = tiltX.value * maxTilt;
    const rotateX = tiltY.value * maxTilt * 1.12;
    // Corner twist — cards don’t stay axis-aligned when you tip a corner
    const rotateZ = tiltX.value * tiltY.value * -5.5;

    // Pivot feel: slide opposite the yaw so it feels hinged, not floating
    const slideX = tiltX.value * -10;
    const slideY = tiltY.value * 4;
    // Lift off the table while held; tiny squash on initial press
    const liftY = interpolate(motion, [0, 1], [0, -10]) + press.value * -2;
    const scale = interpolate(press.value, [0, 1], [1, 0.985]) *
      interpolate(tiltMag, [0, 1], [1, 1.028]);

    return {
      transform: [
        { perspective: 750 },
        { translateX: slideX },
        { translateY: liftY + slideY },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { rotateZ: `${rotateZ}deg` },
        { scale },
      ],
      // Shadow tracks as if a fixed overhead light is on the table
      shadowOpacity: interpolate(motion, [0, 1], [0.2, 0.48]),
      shadowRadius: interpolate(motion, [0, 1], [8, 26]),
      shadowOffset: {
        width: interpolate(tiltX.value, [-1, 1], [16, -16]),
        height: interpolate(tiltY.value, [-1, 1], [6, 22]) +
          interpolate(motion, [0, 1], [4, 10]),
      },
      elevation: interpolate(motion, [0, 1], [4, 14]),
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
