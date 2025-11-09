export interface PublicKeys {
  APP_NAME: string
  APP_SLUG: string
  APP_SCHEME: string
  IOS_BUNDLE_ID: string
  ANDROID_PACKAGE: string
  API_URL: string
  APP_ENV: string
  ENABLE_ANALYTICS: string
  ENABLE_DEBUG: string
  EAS_PROJECT_ID?: string
  [key: string]: string | undefined // Allow additional public keys
}

export interface SecureKeys {
  API_KEY: string
  ENCRYPTION_KEY: string
  STRIPE_KEY: string
  JWT_SECRET: string
  [key: string]: string // Allow additional secure keys
}

// Keys should match those in keys.example.json (matches keys.*.json)
export interface KeysFile {
  public: PublicKeys
  secure: SecureKeys
}
