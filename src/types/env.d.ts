declare module 'react-native-keys' {
  interface Keys {
    // PUBLIC KEYS - Regular variables
    APP_NAME: string
    APP_SLUG: string
    APP_SCHEME: string
    IOS_BUNDLE_ID: string
    ANDROID_BUNDLE_ID: string
    API_URL: string
    APP_ENV: string
    ENABLE_ANALYTICS: string
    ENABLE_DEBUG: string
    EAS_PROJECT_ID: string
    FIREBASE_ANDROID_APP_ID: string
    FIREBASE_IOS_APP_ID: string
    FIREBASE_GROUP: string

    // SECURE KEYS - JNI encrypted (harder to extract)
    // Use for: API keys, secrets, tokens, passwords
    API_KEY: string
    ENCRYPTION_KEY: string
    STRIPE_KEY: string
    JWT_SECRET: string

    // iOS: [Keys secureFor:@"API_KEY"]
    // Android: KeysModule.getSecureFor("API_KEY")
    secureFor(key: string): string

    // iOS: [Keys publicFor:@"APP_NAME"]
    // Android: BuildConfig.APP_NAME
    publicFor(key: string): string
  }

  const keys: Keys
  export default keys
}
