import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CardThemeProvider } from 'worldline-card';
import { DemoGallery } from './DemoGallery';
import { WebDemoPage } from './WebDemoPage';

function NativeDemo() {
  return (
    <SafeAreaProvider>
      <CardThemeProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1419' }}>
          <StatusBar style="light" />
          <DemoGallery />
        </SafeAreaView>
      </CardThemeProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <CardThemeProvider>
          <WebDemoPage />
        </CardThemeProvider>
      ) : (
        <NativeDemo />
      )}
    </GestureHandlerRootView>
  );
}
