import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Platform, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HelloWave } from '@/components/hello-wave'
import { LanguageSwitcher } from '@/components/language-switcher'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'

export default function HomeScreen() {
  const { t } = useTranslation()
  const { currentTheme, themeMode, setThemeMode } = useTheme()

  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('messages.welcome', { appName: 'Expo Boilerplate' })}</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{t('settings.language')}</ThemedText>
        <LanguageSwitcher />
        <ThemedText style={styles.hintText}>{t('settings.changeLanguage')}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Theme</ThemedText>
        <View style={styles.themeSwitcher}>
          <TouchableOpacity
            style={[styles.themeButton, themeMode === 'light' && styles.themeButtonActive]}
            onPress={() => setThemeMode('light')}
          >
            <ThemedText style={[styles.themeButtonText, themeMode === 'light' && styles.themeButtonTextActive]}>
              ☀️ Light
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeButton, themeMode === 'dark' && styles.themeButtonActive]}
            onPress={() => setThemeMode('dark')}
          >
            <ThemedText style={[styles.themeButtonText, themeMode === 'dark' && styles.themeButtonTextActive]}>
              🌙 Dark
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeButton, themeMode === 'system' && styles.themeButtonActive]}
            onPress={() => setThemeMode('system')}
          >
            <ThemedText style={[styles.themeButtonText, themeMode === 'system' && styles.themeButtonTextActive]}>
              📱 System
            </ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.hintText}>
          Current theme: {currentTheme} {themeMode !== 'system' && `(${themeMode} mode)`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes. Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => alert('Share pressed')} />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction title="Delete" icon="trash" destructive onPress={() => alert('Delete pressed')} />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>{`Tap the Explore tab to learn more about what's included in this starter app.`}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create(({ spacing, typography, colors, borderRadius }) => ({
  container: {
    backgroundColor: colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.body,
  },
  stepContainer: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  hintText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  themeSwitcher: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  themeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    minWidth: 90,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  },
  themeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  themeButtonTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
}))
