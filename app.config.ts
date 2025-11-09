import { ConfigContext, ExpoConfig } from 'expo/config'
import * as fs from 'fs'
import * as path from 'path'

import packageJson from './package.json'

/**
 * Expo App Configuration
 *
 * This configuration dynamically loads values from keys.*.json files
 * to support different environments (development, staging, production)
 *
 * Version is read from package.json (single source of truth)
 *
 * @see https://docs.expo.dev/workflow/configuration/
 * @see https://github.com/numandev1/react-native-keys
 */

// Determine which keys file to use
// Priority: KEYSFILE env var > keys.development.json (default)
const keysFileName = process.env.KEYSFILE || 'keys.development.json'
const keysFilePath = path.join(__dirname, keysFileName)
const exampleKeysPath = path.join(__dirname, 'keys.example.json')

console.log(`📦 Loading keys from: ${keysFileName}`)

// Load keys directly from JSON file (not from react-native-keys module)
// This avoids the "not available yet" warning during prebuild
let keys: Record<string, any> = {
  public: {},
  secure: {},
}

try {
  if (fs.existsSync(keysFilePath)) {
    const keysData = fs.readFileSync(keysFilePath, 'utf-8')
    keys = JSON.parse(keysData)
    console.log(`✅ Loaded keys from ${keysFileName}`)
  } else {
    console.warn(`⚠️  Keys file not found: ${keysFileName}`)

    if (fs.existsSync(exampleKeysPath)) {
      const exampleData = fs.readFileSync(exampleKeysPath, 'utf-8')
      keys = JSON.parse(exampleData)
      console.log(`📋 Using defaults from keys.example.json`)
    } else {
      console.warn(`⚠️  keys.example.json also not found, using empty defaults`)
    }
  }
} catch (error) {
  console.error(`❌ Error loading keys from ${keysFileName}:`, error)

  try {
    if (fs.existsSync(exampleKeysPath)) {
      const exampleData = fs.readFileSync(exampleKeysPath, 'utf-8')
      keys = JSON.parse(exampleData)
      console.warn('   Using default values from keys.example.json')
    } else {
      console.warn('   Using empty defaults')
    }
  } catch (exampleError) {
    console.error(`❌ Error loading keys.example.json:`, exampleError)
    console.warn('   Using empty defaults')
  }
}

// Version from package.json (single source of truth)
const version = packageJson.version

// Build number strategy: Timestamp-based (always unique, always increments)
// This ensures App Store & Play Store never reject due to duplicate build numbers
const buildNumber = Math.floor(Date.now() / 1000).toString()

console.log(`📱 App version: ${version}`)
console.log(`🔢 Build number: ${buildNumber}`)

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: keys.public.APP_NAME,
  slug: keys.public.APP_SLUG,
  version: version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: keys.public.APP_SCHEME,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: keys.public.IOS_BUNDLE_ID,
    buildNumber: buildNumber,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    versionCode: parseInt(buildNumber, 10),
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: keys.public.ANDROID_PACKAGE,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    [
      'react-native-keys',
      {
        android: {
          defaultKeyFile: keysFileName,
        },
        ios: {
          defaultKeyFile: keysFileName,
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          ndkVersion: '27.1.12297006',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
})
