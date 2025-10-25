import keys from 'react-native-keys'

/**
 * Environment configuration
 *
 * This module provides type-safe access to environment variables
 * loaded from keys.*.json files via react-native-keys
 *
 * JSON file structure:
 * {
 *   "public": { "APP_NAME": "..." },   // Regular variables
 *   "secure": { "API_KEY": "..." }     // JNI-encrypted (harder to extract)
 * }
 *
 * JavaScript access (flat):
 * keys.APP_NAME, keys.API_KEY (no .public or .secure needed)
 *
 * Native access (extra secure):
 * Keys.secureFor("API_KEY") - JNI-encrypted access
 * Keys.publicFor("APP_NAME") - Public key access
 *
 * @see https://github.com/numandev1/react-native-keys#basic-usage
 */

export const env = {
  // ============================================
  // PUBLIC KEYS - App Configuration
  // ============================================
  appName: keys.APP_NAME || 'Expo Boilerplate',
  appSlug: keys.APP_SLUG || 'expo-boilerplate',
  appVersion: keys.APP_VERSION || '1.0.0',
  appScheme: keys.APP_SCHEME || 'expoboilerplate',
  iosBundleId: keys.IOS_BUNDLE_ID || 'com.nduyvu1511.expoboilerplate',
  androidPackage: keys.ANDROID_PACKAGE || 'com.nduyvu1511.expoboilerplate',
  apiUrl: keys.API_URL || '',
  appEnv: keys.APP_ENV || 'development',
  enableAnalytics: keys.ENABLE_ANALYTICS === 'true',
  enableDebug: keys.ENABLE_DEBUG === 'true',

  // ============================================
  // SECURE KEYS - JNI Encrypted (Harder to extract)
  // Use these for sensitive data: API keys, secrets, tokens
  // ============================================
  getSecureApiKey: () => keys.secureFor('API_KEY'),
  getSecureEncryptionKey: () => keys.secureFor('ENCRYPTION_KEY'),
  getSecureStripeKey: () => keys.secureFor('STRIPE_KEY'),
  getSecureJwtSecret: () => keys.secureFor('JWT_SECRET'),

  // ============================================
  // Helper methods
  // ============================================
  isDevelopment: keys.APP_ENV === 'development',
  isProduction: keys.APP_ENV === 'production',
  isStaging: keys.APP_ENV === 'staging',
} as const

// Validate required environment variables
const requiredVars = [
  // Public keys
  'APP_NAME',
  'APP_SLUG',
  'APP_VERSION',
  'IOS_BUNDLE_ID',
  'ANDROID_PACKAGE',
  'API_URL',
  // Secure keys
  'API_KEY',
] as const

export const validateEnv = () => {
  const missing: string[] = []

  for (const key of requiredVars) {
    if (!keys[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return missing.length === 0
}

/**
 * Get information about key types
 */
export const getKeyInfo = () => {
  return {
    public: {
      description: 'Regular variables - visible in BuildConfig/Info.plist',
      usage: 'Non-sensitive data like app name, URLs, feature flags',
      jsonStructure: '{ "public": { "APP_NAME": "..." } }',
      jsAccess: 'keys.APP_NAME',
      nativeAccess: 'Keys.publicFor("APP_NAME")',
      examples: ['APP_NAME', 'API_URL', 'ENABLE_ANALYTICS'],
    },
    secure: {
      description: 'JNI-encrypted variables - harder to extract from compiled app',
      usage: 'Sensitive data like API keys, secrets, tokens, passwords',
      jsonStructure: '{ "secure": { "API_KEY": "..." } }',
      jsAccess: 'keys.API_KEY',
      nativeAccess: 'Keys.secureFor("API_KEY")',
      examples: ['API_KEY', 'STRIPE_KEY', 'JWT_SECRET'],
    },
  }
}
