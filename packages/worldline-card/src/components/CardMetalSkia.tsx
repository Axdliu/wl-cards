import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { MetalKind } from './CardMetalOverlay';
import { useMetalTilt } from './MetalTiltContext';

type Props = {
  kind: MetalKind;
  width: number;
  height: number;
};

/** mode: 0 gold, 1 silver, 2 laser, 3 diamond, 4 matte, 5 obsidian */
const METAL_SHADER = `
uniform float2 iResolution;
uniform float iTime;
uniform float tiltX;
uniform float tiltY;
uniform float mode;

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / iResolution;
  float2 light = float2(0.52 + tiltX * 0.42, 0.48 - tiltY * 0.42);
  float d = distance(uv, light);

  float brush = sin((uv.x * 14.0 + uv.y * 3.2 + tiltX * 1.4 + iTime * 0.15) * 3.14159265);
  brush = brush * 0.5 + 0.5;
  float micro = sin((uv.x * 55.0 - uv.y * 18.0) * 3.14159265) * 0.5 + 0.5;
  float ridge = pow(brush, 2.4) * (0.7 + micro * 0.3);
  float spec = pow(1.0 - clamp(d * 1.65, 0.0, 1.0), 7.0);
  float rim = pow(1.0 - abs(uv.x - 0.5) * 1.5, 3.0) * 0.15;

  half3 dark;
  half3 mid;
  half3 hi;
  float alpha = 0.5;

  if (mode < 0.5) {
    // gold
    dark = half3(0.30, 0.20, 0.04);
    mid  = half3(0.78, 0.58, 0.10);
    hi   = half3(1.00, 0.94, 0.62);
    alpha = 0.48 + spec * 0.32;
  } else if (mode < 1.5) {
    // silver
    dark = half3(0.28, 0.32, 0.36);
    mid  = half3(0.62, 0.68, 0.74);
    hi   = half3(0.96, 0.98, 1.00);
    alpha = 0.48 + spec * 0.32;
  } else if (mode < 2.5) {
    // laser / rainbow
    float h = fract(uv.x * 0.85 + uv.y * 0.35 + tiltX * 0.2 - tiltY * 0.15 + iTime * 0.05);
    half3 c1 = half3(1.0, 0.15, 0.55);
    half3 c2 = half3(1.0, 0.75, 0.1);
    half3 c3 = half3(0.2, 1.0, 0.55);
    half3 c4 = half3(0.15, 0.75, 1.0);
    half3 c5 = half3(0.7, 0.25, 1.0);
    half3 rainbow = mix(c1, c2, smoothstep(0.0, 0.25, h));
    rainbow = mix(rainbow, c3, smoothstep(0.2, 0.45, h));
    rainbow = mix(rainbow, c4, smoothstep(0.4, 0.7, h));
    rainbow = mix(rainbow, c5, smoothstep(0.65, 1.0, h));
    dark = rainbow * 0.45;
    mid = rainbow * 0.85;
    hi = half3(1.0, 1.0, 1.0);
    alpha = 0.38 + spec * 0.35;
  } else if (mode < 3.5) {
    // diamond — crystalline facets + prism sparkles
    float2 fuv = uv * float2(9.0, 12.0) + float2(tiltX * 0.8, -tiltY * 0.8);
    float2 cell = fract(fuv) - 0.5;
    float facet = 1.0 - smoothstep(0.12, 0.48, length(cell * float2(1.0, 1.35)));
    float edge = abs(cell.x) + abs(cell.y * 0.85);
    float cut = 1.0 - smoothstep(0.28, 0.55, edge);
    float prism = fract(uv.x * 2.2 + uv.y * 1.4 + tiltX * 0.35 - tiltY * 0.25);
    half3 ice = half3(0.72, 0.88, 1.0);
    half3 cool = half3(0.45, 0.62, 0.92);
    half3 pink = half3(0.95, 0.72, 1.0);
    half3 mint = half3(0.55, 1.0, 0.92);
    half3 prismCol = mix(ice, pink, smoothstep(0.0, 0.35, prism));
    prismCol = mix(prismCol, mint, smoothstep(0.3, 0.65, prism));
    prismCol = mix(prismCol, cool, smoothstep(0.55, 1.0, prism));
    // star sparkles
    float spark = pow(max(0.0, 1.0 - length(cell) * 4.2), 8.0);
    spark *= step(0.72, fract(sin(dot(floor(fuv), float2(12.9898, 78.233))) * 43758.5453));
    dark = cool * 0.55;
    mid = mix(ice, prismCol, 0.55) * (0.55 + cut * 0.45);
    hi = half3(1.0, 1.0, 1.0);
    ridge = clamp(facet * 0.55 + cut * 0.65, 0.0, 1.0);
    spec = clamp(spec * 1.15 + spark * 1.4, 0.0, 1.0);
    alpha = 0.34 + spec * 0.42 + cut * 0.12;
  } else if (mode < 4.5) {
    // matte — soft velvet paper, almost no specular
    float fiber = sin((uv.x * 38.0 + uv.y * 52.0) * 3.14159265) * 0.5 + 0.5;
    float soft = sin((uv.x * 7.0 - uv.y * 5.0 + tiltX * 0.2) * 3.14159265) * 0.5 + 0.5;
    dark = half3(0.78, 0.74, 0.68);
    mid  = half3(0.90, 0.87, 0.82);
    hi   = half3(0.96, 0.94, 0.90);
    ridge = 0.35 + fiber * 0.25 + soft * 0.15;
    spec = pow(1.0 - clamp(d * 1.1, 0.0, 1.0), 2.2) * 0.12;
    rim = 0.04;
    alpha = 0.28 + ridge * 0.12;
  } else {
    // obsidian — deep glass with sharp specular
    float glass = pow(1.0 - clamp(d * 1.35, 0.0, 1.0), 11.0);
    float streak = pow(abs(sin((uv.x * 3.5 + uv.y * 0.8 - tiltX) * 3.14159265)), 24.0);
    dark = half3(0.04, 0.05, 0.08);
    mid  = half3(0.12, 0.14, 0.18);
    hi   = half3(0.75, 0.82, 0.95);
    ridge = 0.25 + micro * 0.15;
    spec = clamp(glass * 1.2 + streak * 0.55, 0.0, 1.0);
    rim = pow(1.0 - abs(uv.x - 0.5) * 1.8, 4.0) * 0.22;
    alpha = 0.52 + spec * 0.28;
  }

  half3 col = mix(dark, mid, ridge);
  col = mix(col, hi, clamp(spec * 0.9 + ridge * 0.25 + rim, 0.0, 1.0));
  return half4(col, alpha);
}
`;

const source = Skia.RuntimeEffect.Make(METAL_SHADER);

const MODE: Record<MetalKind, number> = {
  gold: 0,
  silver: 1,
  laser: 2,
  diamond: 3,
  matte: 4,
  obsidian: 5,
};

/**
 * Skia RuntimeEffect foil finishes — tilt-reactive metal / crystal / matte / glass.
 */
export function CardMetalSkia({ kind, width, height }: Props) {
  const clock = useClock();
  const tilt = useMetalTilt();
  const zero = useSharedValue(0);
  const mode = MODE[kind];

  const uniforms = useDerivedValue(() => {
    return {
      iResolution: [width, height],
      iTime: clock.value / 1000,
      tiltX: tilt?.tiltX.value ?? zero.value,
      tiltY: tilt?.tiltY.value ?? zero.value,
      mode,
    };
  }, [width, height, mode, tilt, clock, zero]);

  const effect = useMemo(() => source, []);

  if (!effect || width < 2 || height < 2) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={{ width, height }}>
        <Fill>
          <Shader source={effect} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}
