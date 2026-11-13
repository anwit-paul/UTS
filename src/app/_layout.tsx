import { useEffect } from 'react';
import * as Brightness from 'expo-brightness';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      return;
    }

    Brightness.setBrightnessAsync(1).catch((error) => {
      console.error('Unable to set screen brightness to maximum:', error);
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      {Platform.OS === 'android' && <NavigationBar style="dark" />}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
