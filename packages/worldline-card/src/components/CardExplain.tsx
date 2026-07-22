import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCardTheme } from '../theme/CardThemeContext';

export type CardExplainPayload = {
  title: string;
  description: string;
};

type CardExplainContextValue = {
  explain: (payload: CardExplainPayload) => void;
};

const CardExplainContext = createContext<CardExplainContextValue | null>(null);

export function useCardExplain() {
  return useContext(CardExplainContext);
}

/**
 * Host for attribute / trait explanation popovers.
 * Wrap card content so taps on described fields can open a sheet.
 */
export function CardExplainHost({ children }: { children: React.ReactNode }) {
  const theme = useCardTheme();
  const [active, setActive] = useState<CardExplainPayload | null>(null);

  const explain = useCallback((payload: CardExplainPayload) => {
    if (!payload.description.trim()) return;
    setActive(payload);
  }, []);

  const value = useMemo(() => ({ explain }), [explain]);

  return (
    <CardExplainContext.Provider value={value}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={active != null}
        onRequestClose={() => setActive(null)}
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setActive(null)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss explanation"
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.kicker, { color: theme.accent }]}>About</Text>
            <Text style={[styles.title, { color: theme.text }]}>
              {active?.title}
            </Text>
            <Text style={[styles.body, { color: theme.textMuted }]}>
              {active?.description}
            </Text>
            <Pressable
              onPress={() => setActive(null)}
              style={[styles.dismiss, { backgroundColor: theme.bg }]}
              accessibilityRole="button"
            >
              <Text style={[styles.dismissText, { color: theme.text }]}>
                Got it
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </CardExplainContext.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  sheet: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 8,
    zIndex: 1,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
  },
  dismiss: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
