import Constants from 'expo-constants'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { ToastService } from '@/services'

import { ThemedText } from './themed-text'

/**
 * AppVersion Component
 *
 * Displays app version, build number, and environment information.
 * Tap to copy version info to clipboard.
 *
 * @example
 * ```tsx
 * import { AppVersion } from '@/components/app-version'
 *
 * export default function SettingsScreen() {
 *   return (
 *     <View>
 *       <AppVersion />
 *     </View>
 *   )
 * }
 * ```
 */
export function AppVersion() {
  // Get version information
  const version = Constants.expoConfig?.version || 'Unknown'
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode?.toString() || 'Unknown'

  const environment = __DEV__ ? 'Development' : 'Production'
  const platform = Constants.platform?.ios ? 'iOS' : 'Android'

  // Additional info
  const expoVersion = Constants.expoVersion || 'Unknown'
  const appName = Constants.expoConfig?.name || 'Unknown'

  const handlePress = async () => {
    const versionInfo = `${appName} v${version} (${buildNumber})\n${platform} - ${environment}\nExpo SDK ${expoVersion}`

    // await Clipboard.setStringAsync(versionInfo)
    console.log(versionInfo)
    ToastService.success('Version info copied to clipboard')
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          // backgroundColor: theme.colors.card,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        <ThemedText style={styles.label}>Version</ThemedText>
        <ThemedText style={styles.value}>{version}</ThemedText>
      </View>

      <View style={styles.row}>
        <ThemedText style={styles.label}>Build</ThemedText>
        <ThemedText style={styles.value}>{buildNumber}</ThemedText>
      </View>

      <View style={styles.row}>
        <ThemedText style={styles.label}>Environment</ThemedText>
        <ThemedText style={[styles.value, styles.environment]}>{environment}</ThemedText>
      </View>

      {__DEV__ && (
        <>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Platform</ThemedText>
            <ThemedText style={styles.value}>{platform}</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText style={styles.label}>Expo SDK</ThemedText>
            <ThemedText style={styles.value}>{expoVersion}</ThemedText>
          </View>
        </>
      )}

      <ThemedText style={[styles.hint]}>Tap to copy</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  environment: {
    textTransform: 'uppercase',
    fontSize: 12,
  },
  hint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.5,
  },
})
