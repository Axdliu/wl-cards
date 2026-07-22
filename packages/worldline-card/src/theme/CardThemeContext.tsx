import React, { createContext, useContext, useMemo } from 'react';
import { defaultCardTheme, type CardTheme } from './types';

const CardThemeContext = createContext<CardTheme>(defaultCardTheme);

export type CardThemeProviderProps = {
  theme?: Partial<CardTheme>;
  children: React.ReactNode;
};

export function CardThemeProvider({ theme, children }: CardThemeProviderProps) {
  const merged = useMemo(
    () => ({ ...defaultCardTheme, ...theme }),
    [theme],
  );
  return (
    <CardThemeContext.Provider value={merged}>
      {children}
    </CardThemeContext.Provider>
  );
}

export function useCardTheme(): CardTheme {
  return useContext(CardThemeContext);
}
