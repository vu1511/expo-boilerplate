import { ConfigContext, ExpoConfig } from 'expo/config'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Expo App Configuration
 *
 * This configuration dynamically loads values from keys.*.json files
 * to support different environments (development, staging, production)
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

// Load default values from keys.example.json
let defaultKeys: any = {
  public: {},
  secure: {},
}

try {
  if (fs.existsSync(exampleKeysPath)) {
    const exampleData = fs.readFileSync(exampleKeysPath, 'utf-8')
    defaultKeys = JSON.parse(exampleData)
    console.log(`📋 Loaded defaults from keys.example.json`)
  } else {
    console.warn(`⚠️  keys.example.json not found, using hardcoded defaults`)
  }
} catch (error) {
  console.error(`❌ Error loading keys.example.json:`, error)
  console.warn('   Using hardcoded defaults.')
}

// Load keys directly from JSON file (not from react-native-keys module)
// This avoids the "not available yet" warning during prebuild
let keys: any = defaultKeys

try {
  if (fs.existsSync(keysFilePath)) {
    const keysData = fs.readFileSync(keysFilePath, 'utf-8')
    keys = JSON.parse(keysData)
    console.log(`✅ Loaded keys from ${keysFileName}`)
  } else {
    console.warn(`⚠️  Keys file not found: ${keysFileName}`)
    console.warn('   Using default values from keys.example.json')
  }
} catch (error) {
  console.error(`❌ Error loading keys from ${keysFileName}:`, error)
  console.warn('   Using default values from keys.example.json')
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: keys.public.APP_NAME || defaultKeys.public.APP_NAME,
  slug: keys.public.APP_SLUG || defaultKeys.public.APP_SLUG,
  version: keys.public.APP_VERSION || defaultKeys.public.APP_VERSION,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: keys.public.APP_SCHEME || defaultKeys.public.APP_SCHEME,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: keys.public.IOS_BUNDLE_ID || defaultKeys.public.IOS_BUNDLE_ID,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: keys.public.ANDROID_PACKAGE || defaultKeys.public.ANDROID_PACKAGE,
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
