import '@/locales'
import 'react-native-reanimated'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useTheme } from '@/hooks/useTheme'
import { queryClient } from '@/lib/providers'
import { BottomSheetRoot, ModalRoot, PopoverRoot } from '@/services'
import { Toast } from '@/services/toast'
import { fontsToLoad } from '@/theme'

export const unstable_settings = {
  anchor: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { currentTheme } = useTheme()
  const [loaded, error] = useFonts(fontsToLoad)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  return (
    <ThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
          <Toast />
          <ModalRoot />
          <PopoverRoot />
          <BottomSheetRoot />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
