import React, { useEffect } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { DemoGallery } from './DemoGallery';

const GITHUB = 'https://github.com/Axdliu/wl-cards';
const PHONE_W = 390;
const PHONE_H = 780;

function useWebFonts() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const id = 'worldline-card-fonts-v2';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=IBM+Plex+Sans:wght@400;500;600&display=swap';
      document.head.appendChild(link);
    }

    const animId = 'worldline-card-ambient-anim';
    if (!document.getElementById(animId)) {
      const style = document.createElement('style');
      style.id = animId;
      style.textContent = `
        @keyframes wlAmbientDrift {
          0% { background-position: 0% 40%; }
          100% { background-position: 100% 60%; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  return (
    <Animated.View style={[styles.phoneShell, floatStyle]}>
      <View style={styles.phoneBezel}>
        <View style={styles.dynamicIsland} />
        <View style={styles.phoneScreen}>{children}</View>
        <View style={styles.homeIndicator} />
      </View>
    </Animated.View>
  );
}

/**
 * Marketing + live phone preview for the open-source docs site / local web demo.
 */
export function WebDemoPage() {
  useWebFonts();
  const { width } = useWindowDimensions();
  const narrow = width < 920;
  const phoneScale = narrow
    ? Math.min(1, (width - 48) / PHONE_W)
    : Math.min(1, (width * 0.42) / PHONE_W);

  const intro = useSharedValue(0);
  useEffect(() => {
    intro.value = withDelay(
      80,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
    );
  }, [intro]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: (1 - intro.value) * 18 }],
  }));

  return (
    <View style={styles.page}>
      <View style={styles.atmosphere} pointerEvents="none">
        <View style={[styles.blob, styles.blobTeal]} />
        <View style={[styles.blob, styles.blobGold]} />
        <View style={styles.gridWash} />
      </View>

      <View style={[styles.layout, narrow && styles.layoutStack]}>
        <Animated.View style={[styles.copy, introStyle, narrow && styles.copyNarrow]}>
          <Text style={styles.brand}>
            WORLDLINE{'\n'}-CARD
          </Text>
          <Text style={styles.tagline}>
            Collectible card UI for React Native — tilt, foil shine, composable
            parts.
          </Text>
          <Text style={styles.lede}>
            Drop framed stat cards into Expo or RN apps. No Skia, no WebView —
            drag the first card in the phone to try the optional foil tilt.
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(GITHUB)}
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.btnPrimaryText}>GitHub</Text>
            </Pressable>
            <View style={styles.codeChip}>
              <Text style={styles.codeText} selectable>
                pnpm add worldline-card
              </Text>
            </View>
          </View>
        </Animated.View>

        <View
          style={[
            styles.phoneStage,
            {
              width: PHONE_W * phoneScale,
              height: PHONE_H * phoneScale,
            },
          ]}
        >
          <View
            style={[
              {
                width: PHONE_W,
                height: PHONE_H,
                transform: [{ scale: phoneScale }],
              },
              Platform.OS === 'web'
                ? ({ transformOrigin: 'top left' } as object)
                : { marginLeft: ((phoneScale - 1) * PHONE_W) / 2 },
            ]}
          >
            <PhoneFrame>
              <DemoGallery compactChrome />
            </PhoneFrame>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#071016',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100vh' } as object)
      : null),
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    opacity: 0.35,
  },
  blobTeal: {
    top: -120,
    left: -80,
    backgroundColor: '#1a4a44',
  },
  blobGold: {
    bottom: -160,
    right: -60,
    backgroundColor: '#4a3a12',
  },
  gridWash: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    // Subtle diagonal sheen via layered translucent bars (RN-friendly)
    backgroundColor: 'transparent',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(120, 180, 160, 0.15)',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 36,
    gap: 48,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  layoutStack: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 28,
  },
  copy: {
    flex: 1,
    maxWidth: 460,
    gap: 16,
  },
  copyNarrow: {
    maxWidth: '100%',
    alignItems: 'center',
  },
  brand: {
    fontFamily:
      Platform.OS === 'web'
        ? '"Big Shoulders Display", "Arial Narrow", sans-serif'
        : undefined,
    fontSize: 83,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#f2f6f4',
    lineHeight: 96,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: Platform.OS === 'web' ? 'IBM Plex Sans, system-ui' : undefined,
    fontSize: 20,
    fontWeight: '600',
    color: '#c5d6cf',
    lineHeight: 28,
  },
  lede: {
    fontFamily: Platform.OS === 'web' ? 'IBM Plex Sans, system-ui' : undefined,
    fontSize: 16,
    color: '#8fa39a',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  btnPrimary: {
    backgroundColor: '#d4a017',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPressed: {
    opacity: 0.88,
  },
  btnPrimaryText: {
    fontFamily:
      Platform.OS === 'web'
        ? '"Big Shoulders Display", "Arial Narrow", sans-serif'
        : undefined,
    color: '#141008',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.6,
  },
  codeChip: {
    backgroundColor: 'rgba(18, 28, 26, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(80, 110, 100, 0.45)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },
  codeText: {
    fontFamily: Platform.OS === 'web' ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'Courier',
    color: '#9ecfbf',
    fontSize: 13,
  },
  phoneStage: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  phoneShell: {
    width: PHONE_W,
    height: PHONE_H,
  },
  phoneBezel: {
    flex: 1,
    backgroundColor: '#0a0d10',
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#2a3238',
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 24 },
    elevation: 24,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow:
            '0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,160,23,0.12)',
        } as object)
      : null),
  },
  dynamicIsland: {
    alignSelf: 'center',
    width: 118,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#050608',
    marginBottom: 8,
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0f1419',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 128,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.28)',
    marginTop: 8,
  },
});
