import React, { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

type MetalTiltValue = {
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
};

const MetalTiltContext = createContext<MetalTiltValue | null>(null);

export function MetalTiltProvider({
  tiltX,
  tiltY,
  children,
}: MetalTiltValue & { children: React.ReactNode }) {
  return (
    <MetalTiltContext.Provider value={{ tiltX, tiltY }}>
      {children}
    </MetalTiltContext.Provider>
  );
}

export function useMetalTilt() {
  return useContext(MetalTiltContext);
}
