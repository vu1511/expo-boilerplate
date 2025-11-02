# Environment Configuration Guide

Complete guide for managing secure, multi-environment configurations in your Expo project using `react-native-keys`, GPG encryption, and interactive profile selection.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [First Time Setup (Project Owner)](#first-time-setup-project-owner)
  - [Team Member Setup](#team-member-setup)
- [Daily Workflow](#daily-workflow)
- [Environment Files](#environment-files)
- [Usage in Code](#usage-in-code)
- [App Configuration](#app-configuration)
- [Security & Encryption](#security--encryption)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Commands Reference](#commands-reference)

---

## Overview

This project uses a secure, multi-environment configuration system with:

- ✅ **react-native-keys**: Secure native variable storage with JNI encryption
- ✅ **GPG Encryption**: AES256-encrypted environment files for team collaboration
- ✅ **Interactive Profile Selector**: Easy environment switching with `yarn start` / `yarn prebuild`
- ✅ **Multiple Environments**: Development, staging, production (+ custom)
- ✅ **Git-Friendly**: Encrypted files committed safely to repository
- ✅ **Cross-Platform**: Works on macOS, Linux, Windows

### Architecture Flow

```
┌───────────────────────────────────────────────────────────┐
│ config/encrypted/                                         │
│   ├── keys.development.json.gpg  (in git, AES256)         │
│   ├── keys.staging.json.gpg      (in git, AES256)         │
│   └── keys.production.json.gpg   (in git, AES256)         │
└────────────────────────┬──────────────────────────────────┘
                         ↓ yarn env (decrypt with password)
┌───────────────────────────────────────────────────────────┐
│ Project root/                                             │
│   ├── keys.development.json      (gitignored)             │
│   ├── keys.staging.json          (gitignored)             │
│   └── keys.production.json       (gitignored)             │
└────────────────────────┬──────────────────────────────────┘
                         ↓ yarn start / yarn prebuild
┌───────────────────────────────────────────────────────────┐
│ Interactive Profile Selector                              │
│  • Shows available environments                           │
│  • Auto-decrypts if needed                                │
│  • Sets KEYSFILE environment variable                     │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│ app.config.ts reads keys file                             │
│ react-native-keys compiles into native code (JNI)         │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌───────────────────────────────────────────────────────────┐
│ Your app accesses via: import { env } from '@/config/env' │
│ Native access: Keys.secureFor('API_KEY')                  │
└───────────────────────────────────────────────────────────┘
```

---

## Quick Start

### New Project (First Time)

```bash
# 1. Create environment files
yarn env:setup                      # Creates keys.development.json
cp keys.development.json keys.staging.json
cp keys.development.json keys.production.json

# 2. Edit files with actual values
# Update: IOS_BUNDLE_ID, ANDROID_PACKAGE, API_URL, API_KEY, etc.

# 3. Encrypt for team sharing
yarn env:encrypt                    # Enter strong password
git add config/encrypted/*.gpg
git commit -m "Add encrypted environments"
git push

# 4. Share password securely (1Password, LastPass, etc.)
```

### Joining Existing Project

```bash
# 1. Clone and install
git clone <repo>
yarn install

# 2. Decrypt environment (get password from team lead)
yarn env                            # Interactive decrypt

# 3. Start with profile selection
yarn start                          # Select profile → Dev server starts
```

### Daily Development

```bash
# Interactive (Recommended)
yarn start                          # Select profile → start dev server
yarn prebuild                       # Select profile → prebuild native
yarn ios                            # Select profile → build & run iOS
yarn android                        # Select profile → build & run Android

# Direct (CI/CD friendly)
yarn start:dev                      # Development
yarn start:staging                  # Staging
yarn start:production               # Production
yarn ios:dev / android:dev          # Build with development
yarn ios:staging / android:staging  # Build with staging
yarn ios:production / android:production  # Build with production
```

---

## Prerequisites

### Install GPG

GPG is required for encrypting/decrypting environment files.

**macOS:**
```bash
brew install gnupg
```

**Linux:**
```bash
sudo apt-get install gnupg
```

**Windows:**
```bash
choco install gnupg
# or download: https://www.gnupg.org/download/
```

**Verify:**
```bash
gpg --version
```

---

## Setup

### First Time Setup (Project Owner)

When setting up encrypted environments for the first time:

#### 1. Create Environment Files

```bash
yarn env:setup
# Creates keys.development.json from keys.example.json

# Copy for other environments
cp keys.development.json keys.staging.json
cp keys.development.json keys.production.json
```

#### 2. Edit Each Environment

**keys.development.json:**
```json
{
  "public": {
    "APP_NAME": "Expo Boilerplate (Dev)",
    "APP_SLUG": "expo-boilerplate-dev",
    "APP_VERSION": "1.0.0",
    "APP_SCHEME": "expoboilerplate-dev",
    "IOS_BUNDLE_ID": "com.yourcompany.app.dev",
    "ANDROID_PACKAGE": "com.yourcompany.app.dev",
    "API_URL": "https://dev-api.example.com",
    "APP_ENV": "development",
    "ENABLE_ANALYTICS": "false",
    "ENABLE_DEBUG": "true"
  },
  "secure": {
    "API_KEY": "dev-api-key-here",
    "STRIPE_KEY": "pk_test_...",
    "JWT_SECRET": "dev-secret-here"
  }
}
```

**keys.staging.json:**
```json
{
  "public": {
    "APP_NAME": "Expo Boilerplate (Staging)",
    "APP_SLUG": "expo-boilerplate-staging",
    "IOS_BUNDLE_ID": "com.yourcompany.app.staging",
    "ANDROID_PACKAGE": "com.yourcompany.app.staging",
    "API_URL": "https://staging-api.example.com",
    "APP_ENV": "staging"
    // ... other staging values
  },
  "secure": {
    "API_KEY": "staging-api-key-here"
    // ... staging secrets
  }
}
```

**keys.production.json:**
```json
{
  "public": {
    "APP_NAME": "Expo Boilerplate",
    "APP_SLUG": "expo-boilerplate",
    "IOS_BUNDLE_ID": "com.yourcompany.app",
    "ANDROID_PACKAGE": "com.yourcompany.app",
    "API_URL": "https://api.example.com",
    "APP_ENV": "production",
    "ENABLE_ANALYTICS": "true",
    "ENABLE_DEBUG": "false"
  },
  "secure": {
    "API_KEY": "production-api-key-here"
    // ... production secrets
  }
}
```

> **Important:** Use different bundle IDs per environment to install all builds on the same device.

#### 3. Encrypt Files

```bash
yarn env:encrypt
# Enter password (min 8 chars, 12+ recommended)
# For testing/development, you can use: 123456789
# Confirm password
# ✅ Files encrypted to config/encrypted/
```

#### 4. Commit & Share

```bash
# Commit encrypted files
git add config/encrypted/*.gpg
git commit -m "Add encrypted environment files"
git push

# Delete local decrypted files (optional but secure)
rm keys.*.json

# Share password via secure channel
# ✅ 1Password, LastPass, BitWarden
# ❌ NEVER: Email, Slack, SMS, Git
```

---

### Team Member Setup

When joining an existing project:

#### 1. Clone & Install

```bash
git clone <repository-url>
cd expo-boilerplate
yarn install
```

#### 2. Get Password

Ask your team lead for the GPG encryption password.

#### 3. Decrypt Environment

```bash
yarn env
# 🔓 Select Environment
#   1. development   ❌ Not decrypted
#   2. staging       ❌ Not decrypted
#   3. production    ❌ Not decrypted
# Select environment (1-3): 1
# Enter decryption password: 123456789
# ✅ Environment decrypted!
```

#### 4. Build & Run

```bash
# Option 1: Interactive (Recommended)
yarn ios                            # Select profile → Build & run iOS
# or
yarn android                        # Select profile → Build & run Android

# Option 2: Direct (if you already know which environment)
yarn ios:dev                        # Build & run iOS with development
yarn android:dev                    # Build & run Android with development
```

> **Note:** Running `yarn ios` or `yarn android` will automatically prebuild if needed.

---

## Daily Workflow

### Interactive Profile Selection (Recommended)

The easiest way to work with environments - just run the command and select your profile:

**Start Dev Server:**
```bash
yarn start
# 🚀 Select Profile for: Start
#   1. development   ✅ Ready (default)
#   2. staging       ✅ Ready
#   3. production    ❌ Not decrypted
# Select profile (1-3) [default: 1]:
```

**Build & Run on iOS:**
```bash
yarn ios
# 🚀 Select Profile for: iOS
#   1. development   ✅ Ready (default)
#   2. staging       ✅ Ready
#   3. production    ❌ Not decrypted
# Select profile (1-3) [default: 1]:
```

**Build & Run on Android:**
```bash
yarn android
# 🚀 Select Profile for: Android
#   1. development   ✅ Ready (default)
#   2. staging       ✅ Ready
#   3. production    ❌ Not decrypted
# Select profile (1-3) [default: 1]:
```

**Prebuild Native:**
```bash
yarn prebuild
# 🚀 Select Profile for: Prebuild
# (Same interactive menu)
```

Features:
- ✅ Visual status indicators
- 🔓 Auto-decrypt if needed (prompts for password)
- 🚀 Smart defaults (auto-select if only one environment available - works for all commands: start, prebuild, ios, android)
- ⌨️ Press Enter for default

**Example with Auto-Decrypt:**

```bash
$ yarn start
Select profile (1-3): 2

⚠️  Environment 'staging' is not decrypted yet.
Do you want to decrypt it now? (y/n): y
Enter decryption password: 123456789
✅ Successfully decrypted staging environment

🎯 Profile: staging
📦 Keys file: keys.staging.json
🚀 Running: KEYSFILE=keys.staging.json expo start --dev-client
```

### Direct Commands (CI/CD Friendly)

Skip the interactive prompt when you know exactly which environment you need:

```bash
# Development
yarn start:dev
yarn prebuild:dev
yarn ios:dev
yarn android:dev

# Staging
yarn start:staging
yarn prebuild:staging
yarn ios:staging
yarn android:staging

# Production
yarn start:production
yarn prebuild:production
yarn ios:production
yarn android:production
```

### Manual KEYSFILE Override

Most flexible approach for custom environments or one-off commands:

```bash
KEYSFILE=keys.staging.json yarn start
KEYSFILE=keys.production.json yarn prebuild --clean
KEYSFILE=keys.qa.json expo run:ios
KEYSFILE=keys.demo.json expo run:android
```

### Check Status

```bash
# See encryption status
yarn env:status
# 📊 Environment Status:
#   development      Decrypted: ✅   Encrypted: ✅
#   staging          Decrypted: ❌   Encrypted: ✅
#   production       Decrypted: ❌   Encrypted: ✅

# List encrypted files
yarn env:list
# 📋 Available Encrypted Files:
#   ✓ development    1.2 KB  (10/25/2025)
#   ✓ staging        1.2 KB  (10/25/2025)
#   ✓ production     1.2 KB  (10/25/2025)
```

---

## Environment Files

### File Structure

```
expo-boilerplate/
├── app.config.ts              # Dynamic Expo config (reads keys file)
├── keys.example.json          # Template (tracked in git)
├── keys.development.json      # Dev environment (gitignored)
├── keys.staging.json          # Staging environment (gitignored)
├── keys.production.json       # Production environment (gitignored)
└── config/encrypted/          # Encrypted files (tracked in git)
    ├── keys.development.json.gpg
    ├── keys.staging.json.gpg
    └── keys.production.json.gpg
```

### JSON Structure

Environment files use a two-tier structure:

```json
{
  "public": {
    // Regular configuration (compiled into native code)
    "APP_NAME": "string",
    "APP_VERSION": "string",
    "API_URL": "string"
  },
  "secure": {
    // Sensitive data (JNI-encrypted in native code)
    "API_KEY": "string",
    "STRIPE_KEY": "string",
    "JWT_SECRET": "string"
  }
}
```

> **Note:** In JavaScript, both `public` and `secure` keys are accessed flat: `keys.APP_NAME`, `keys.API_KEY`

### Available Variables

| JSON Path | JS Access | Native Access | Security | Synced To | Description |
|-----------|-----------|---------------|----------|-----------|-------------|
| `public.APP_NAME` | `keys.APP_NAME` | `Keys.publicFor("APP_NAME")` | Public | Expo config | App display name |
| `public.APP_SLUG` | `keys.APP_SLUG` | `Keys.publicFor("APP_SLUG")` | Public | Expo config | Expo slug |
| `public.APP_VERSION` | `keys.APP_VERSION` | `Keys.publicFor("APP_VERSION")` | Public | Expo + Stores | Version number |
| `public.APP_SCHEME` | `keys.APP_SCHEME` | `Keys.publicFor("APP_SCHEME")` | Public | Expo config | Deep link scheme |
| `public.IOS_BUNDLE_ID` | `keys.IOS_BUNDLE_ID` | `Keys.publicFor("IOS_BUNDLE_ID")` | Public | Xcode | iOS bundle identifier |
| `public.ANDROID_PACKAGE` | `keys.ANDROID_PACKAGE` | `Keys.publicFor("ANDROID_PACKAGE")` | Public | Gradle | Android package name |
| `public.API_URL` | `keys.API_URL` | `Keys.publicFor("API_URL")` | Public | Your code | API base URL |
| `public.APP_ENV` | `keys.APP_ENV` | `Keys.publicFor("APP_ENV")` | Public | Your code | Environment name |
| `public.ENABLE_ANALYTICS` | `keys.ENABLE_ANALYTICS` | `Keys.publicFor("ENABLE_ANALYTICS")` | Public | Your code | Enable analytics |
| `public.ENABLE_DEBUG` | `keys.ENABLE_DEBUG` | `Keys.publicFor("ENABLE_DEBUG")` | Public | Your code | Debug mode |
| `secure.API_KEY` | `keys.API_KEY` | `Keys.secureFor("API_KEY")` | **JNI Secure** | Your code | API key |
| `secure.STRIPE_KEY` | `keys.STRIPE_KEY` | `Keys.secureFor("STRIPE_KEY")` | **JNI Secure** | Your code | Stripe key |
| `secure.JWT_SECRET` | `keys.JWT_SECRET` | `Keys.secureFor("JWT_SECRET")` | **JNI Secure** | Your code | JWT secret |

### Adding New Variables

**1. Add to all keys files:**

```json
{
  "public": {
    "NEW_VARIABLE": "value"
  }
}
```

**2. Add TypeScript type (`src/types/env.d.ts`):**

```typescript
declare module 'react-native-keys' {
  export const NEW_VARIABLE: string
}
```

**3. Add to env wrapper (`src/config/env.ts`):**

```typescript
export const env = {
  newVariable: keys.NEW_VARIABLE || 'default',
}
```

**4. Rebuild native code:**

```bash
yarn prebuild:clean
```

**5. Use in code:**

```typescript
import { env } from '@/config/env'
console.log(env.newVariable)
```

---

## Usage in Code

### Type-Safe Access (Recommended)

Use the `env` wrapper for clean, type-safe access:

```typescript
import { env } from '@/config/env'

// App Configuration
env.appName           // "Expo Boilerplate"
env.appVersion        // "1.0.0"
env.iosBundleId       // "com.yourcompany.app"
env.androidPackage    // "com.yourcompany.app"

// API Configuration
env.apiUrl            // "https://api.example.com"
env.apiKey            // "your-api-key"

// Environment
env.appEnv            // "development" | "staging" | "production"

// Feature Flags
env.enableAnalytics   // false
env.enableDebug       // true

// Helper Methods
env.isDevelopment()   // true
env.isProduction()    // false
env.isStaging()       // false
```

### Direct Access

Direct access to `react-native-keys`:

```typescript
import keys from 'react-native-keys'

// JavaScript access (flat structure)
const appName = keys.APP_NAME     // From public.APP_NAME
const apiKey = keys.API_KEY       // From secure.API_KEY

// Native access (extra JNI protection for secure keys)
const secureApiKey = keys.secureFor('API_KEY')    // Maximum security
const publicAppName = keys.publicFor('APP_NAME')  // Public key access
```

### Real-World Examples

**API Service:**

```typescript
import { env } from '@/config/env'

export const apiService = {
  async fetchData() {
    const response = await fetch(`${env.apiUrl}/data`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.apiKey,
      },
    })
    return response.json()
  },
}
```

**Environment-Specific Logic:**

```typescript
import { env } from '@/config/env'

export function setupApp() {
  if (env.isDevelopment()) {
    // Enable debug tools
    enableDebugMode()
  }

  if (env.isProduction()) {
    // Enable crash reporting
    enableCrashReporting()
  }

  if (env.enableAnalytics) {
    initializeAnalytics()
  }
}
```

**About Screen:**

```typescript
import { env } from '@/config/env'

export function AboutScreen() {
  return (
    <View>
      <Text>{env.appName}</Text>
      <Text>Version {env.appVersion}</Text>
      <Text>Environment: {env.appEnv}</Text>
      {env.isDevelopment() && <Text>🐛 Debug Mode</Text>}
    </View>
  )
}
```

---

## App Configuration

### app.config.ts Integration

The project uses `app.config.ts` (not `app.json`) to dynamically load configuration with smart fallbacks:

```typescript
import * as fs from 'fs'
import * as path from 'path'

// Determine which keys file to use
const keysFileName = process.env.KEYSFILE || 'keys.development.json'
const keysFilePath = path.join(__dirname, keysFileName)
const exampleKeysPath = path.join(__dirname, 'keys.example.json')

// Load default values from keys.example.json
let defaultKeys = { public: {}, secure: {} }
if (fs.existsSync(exampleKeysPath)) {
  defaultKeys = JSON.parse(fs.readFileSync(exampleKeysPath, 'utf-8'))
}

// Load environment-specific keys
let keys = defaultKeys
if (fs.existsSync(keysFilePath)) {
  keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf-8'))
}

export default (): ExpoConfig => ({
  // Smart fallback: keys.public.APP_NAME || defaultKeys.public.APP_NAME || hardcoded
  name: keys.public.APP_NAME || defaultKeys.public.APP_NAME || 'Expo Boilerplate',
  slug: keys.public.APP_SLUG || defaultKeys.public.APP_SLUG || 'expo-boilerplate',
  version: keys.public.APP_VERSION || defaultKeys.public.APP_VERSION || '1.0.0',
  scheme: keys.public.APP_SCHEME || defaultKeys.public.APP_SCHEME || 'expoboilerplate',
  
  ios: {
    bundleIdentifier: keys.public.IOS_BUNDLE_ID || defaultKeys.public.IOS_BUNDLE_ID,
  },
  
  android: {
    package: keys.public.ANDROID_PACKAGE || defaultKeys.public.ANDROID_PACKAGE,
  },
  
  plugins: [
    'expo-router',
    [
      'react-native-keys',
      {
        android: { defaultKeyFile: keysFileName },
        ios: { defaultKeyFile: keysFileName },
      },
    ],
  ],
})
```

**Fallback Priority:**
1. **Environment-specific keys** (e.g., `keys.development.json`)
2. **Default keys** (from `keys.example.json`)
3. **Hardcoded fallbacks** (last resort)

### Single Source of Truth

Configuration flows from keys files to everywhere:

```
keys.production.json
        ↓
   app.config.ts (reads KEYSFILE)
        ↓
    ┌───┴────┐
    ↓        ↓
  iOS      Android
Info.plist  build.gradle
    ↓        ↓
Bundle ID, Version, etc.
```

**Change version once:**

```json
{
  "public": {
    "APP_VERSION": "2.0.0"
  }
}
```

**Run prebuild:**

```bash
yarn prebuild:clean
```

**Version is now synced to:**
- ✅ Expo configuration
- ✅ iOS Info.plist (CFBundleShortVersionString)
- ✅ Android build.gradle (versionName)
- ✅ Your code (`env.appVersion`)

### Environment Switching

When switching environments, **always run prebuild** because:
1. `app.config.ts` needs to regenerate native files with new bundle IDs
2. `react-native-keys` needs to compile new keys into native code

```bash
# Wrong (missing prebuild)
KEYSFILE=keys.staging.json yarn ios  # ❌ Still uses old config

# Correct
KEYSFILE=keys.staging.json yarn prebuild:clean
KEYSFILE=keys.staging.json yarn ios  # ✅ Uses staging config
```

---

## Security & Encryption

### GPG Encryption

Environment files are encrypted using **GPG with symmetric AES256** encryption.

#### How It Works

```bash
# Encrypt
gpg --batch --yes --passphrase "password" \
    --symmetric --cipher-algo AES256 \
    -o config/encrypted/keys.production.json.gpg \
    keys.production.json

# Decrypt
gpg --batch --yes --passphrase "password" \
    --decrypt \
    -o keys.production.json \
    config/encrypted/keys.production.json.gpg
```

#### Encryption Commands

```bash
# Encrypt all environment files
yarn env:encrypt
# Prompts for password
# Encrypts to config/encrypted/*.gpg

# Decrypt specific environment
yarn env
# Interactive selection
# Prompts for password
# Decrypts to project root
```

### JNI Security (react-native-keys)

Keys stored in `secure` section get extra JNI (Java Native Interface) protection:

- **Compiled into native code** (not JavaScript)
- **Harder to extract** via decompilation
- **Protected at native layer**

```typescript
// Regular access (still secure, compiled)
const apiKey = keys.API_KEY

// Maximum security (JNI native call)
const apiKey = keys.secureFor('API_KEY')
```

### Security Checklist

- [ ] All `keys.*.json` files (except `keys.example.json`) in `.gitignore`
- [ ] Encrypted `*.gpg` files committed to git
- [ ] Password stored in team password manager (1Password, etc.)
- [ ] Different API keys for dev/staging/production
- [ ] No secrets hardcoded in source code
- [ ] Team knows how to decrypt
- [ ] Password rotation procedure documented

### Password Best Practices

**✅ DO:**
- Use strong passwords (12+ characters)
- Store in password manager (1Password, LastPass, BitWarden)
- Commit encrypted files to git
- Rotate passwords if compromised
- Use different API keys per environment

**❌ DON'T:**
- Never commit decrypted files
- Never share password via email/Slack/SMS
- Never reuse passwords across projects
- Never hardcode secrets in code
- Never take screenshots of passwords

**🔧 Development/Testing:**
- For local development and testing, you can use the default password: `123456789`
- This makes it easier to get started and test the environment system
- **Important:** Change to a strong password for production/team use

### Password Rotation

If password is compromised:

```bash
# 1. Re-encrypt with new password
yarn env:encrypt
# Enter NEW password

# 2. Commit updated encrypted files
git add config/encrypted/*.gpg
git commit -m "Rotate environment password"
git push

# 3. Notify team securely (password manager, not chat)

# 4. Team members re-decrypt
yarn env
# Enter NEW password
```

---

## CI/CD Integration

### GitHub Actions

**With GPG Decryption:**

```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install GPG
        run: sudo apt-get install gnupg
      
      - name: Decrypt production keys
        env:
          GPG_PASSWORD: ${{ secrets.GPG_PASSWORD }}
        run: |
          echo "$GPG_PASSWORD" | gpg --batch --yes --passphrase-fd 0 \
            --decrypt -o keys.production.json \
            config/encrypted/keys.production.json.gpg
      
      - name: Install dependencies
        run: yarn install
      
      - name: Build
        run: yarn prebuild:production
```

**With Direct Commands (no GPG):**

```yaml
- name: Setup keys
  run: echo '${{ secrets.KEYS_PRODUCTION_JSON }}' > keys.production.json

- name: Build
  run: yarn prebuild:production
```

**Store Secrets:**
1. Go to Settings → Secrets → Actions
2. Add `GPG_PASSWORD` or full `KEYS_PRODUCTION_JSON`
3. Reference in workflow as shown above

### Self-Hosted CI/CD

For Jenkins, GitLab CI, or local runners:

```bash
#!/bin/bash
# build-production.sh

# Decrypt
echo "$GPG_PASSWORD" | gpg --batch --passphrase-fd 0 \
  --decrypt -o keys.production.json \
  config/encrypted/keys.production.json.gpg

# Build
yarn install
yarn prebuild:production

# Run native builds
cd ios && xcodebuild ...
cd android && ./gradlew bundleRelease
```

### EAS Build Integration

Configure `eas.json`:

```json
{
  "build": {
    "development": {
      "env": { "KEYSFILE": "keys.development.json" }
    },
    "staging": {
      "env": { "KEYSFILE": "keys.staging.json" }
    },
    "production": {
      "env": { "KEYSFILE": "keys.production.json" }
    }
  }
}
```

Build:

```bash
eas build --profile production
```

---

## Troubleshooting

### Variables are Undefined

**Problem:** Keys return `undefined` in your code.

**Solution:** Rebuild native code:

```bash
rm -rf ios android .expo
yarn prebuild:clean
yarn ios  # or yarn android
```

### Changes Not Reflecting

**Problem:** Updated keys but app still uses old values.

**Solution:**

```bash
# Kill Metro bundler (Ctrl+C)
rm -rf ios android .expo
yarn prebuild:clean
yarn start
```

### GPG Not Installed

**Error:** `❌ GPG is not installed!`

**Solution:**

```bash
# macOS
brew install gnupg

# Linux
sudo apt-get install gnupg

# Windows
choco install gnupg
```

### Wrong Password

**Error:** `❌ Decryption failed. Wrong password?`

**Solution:**
- Double-check password with team lead
- For development/testing, try the default password: `123456789`
- Ensure no extra spaces when pasting
- Copy from password manager
- Try manual decrypt: `yarn env`

### No Encrypted Files Found

**Error:** `❌ No encrypted files found!`

**Solution:**

```bash
# Pull latest from git
git pull origin main

# Check files exist
yarn env:list

# If missing, contact project owner
```

### Profile Selector: No Environments Available

**Error:** `❌ No environment files found!`

**Solution:**

```bash
# First time setup
yarn env:setup        # Create keys.development.json
yarn env:encrypt      # Encrypt it

# Or decrypt existing
yarn env              # Decrypt from encrypted files
```

### Different Bundle ID Not Working

**Problem:** Changed bundle ID but still uses old one.

**Solution:** Complete clean:

```bash
rm -rf ios android .expo
yarn prebuild:clean
```

### TypeScript Errors

**Problem:** TypeScript doesn't recognize keys.

**Solution:** Add types to `src/types/env.d.ts`:

```typescript
declare module 'react-native-keys' {
  export const YOUR_NEW_KEY: string
}
```

### JSON Syntax Error

**Problem:** Invalid JSON in keys file.

**Solution:** Validate:

```bash
yarn env:verify
```

Fix syntax errors (trailing commas, missing quotes, etc.).

---

## Best Practices

### Environment Configuration

**1. Consistent Naming Across Environments:**

```
Development:
  APP_NAME: "App (Dev)"
  IOS_BUNDLE_ID: com.company.app.dev
  API_URL: https://dev-api.example.com

Staging:
  APP_NAME: "App (Staging)"
  IOS_BUNDLE_ID: com.company.app.staging
  API_URL: https://staging-api.example.com

Production:
  APP_NAME: "App"
  IOS_BUNDLE_ID: com.company.app
  API_URL: https://api.example.com
```

**2. Use Descriptive Variable Names:**

```json
// ✅ Good
{
  "API_BASE_URL": "https://api.example.com",
  "STRIPE_PUBLISHABLE_KEY": "pk_test_xxx"
}

// ❌ Bad
{
  "URL": "https://api.example.com",
  "KEY": "pk_test_xxx"
}
```

**3. Document All Variables:**

Always update `keys.example.json` when adding new variables.

**4. Different API Keys Per Environment:**

Never reuse production keys in development/staging.

**5. Validate on Startup:**

```typescript
import { validateEnv } from '@/config/env'

export function App() {
  useEffect(() => {
    if (!validateEnv()) {
      Alert.alert('Config Error', 'Missing required environment variables')
    }
  }, [])
}
```

### Development Workflow

**1. Use Interactive Mode During Development:**

```bash
yarn start        # Quick profile switching
yarn prebuild     # Easy environment testing
```

**2. Use Direct Commands for Repetitive Tasks:**

```bash
yarn start:dev    # No prompt, faster
```

**3. Check Status Regularly:**

```bash
yarn env:status   # See what's decrypted
```

### Team Collaboration

**1. Commit Encrypted Files:**

```bash
git add config/encrypted/*.gpg
git commit -m "Update environments"
git push
```

**2. Never Commit Decrypted Files:**

```bash
# Already in .gitignore
keys.development.json
keys.staging.json
keys.production.json
```

**3. Share Password Securely:**

Use 1Password, LastPass, or company password manager.

**4. Onboard New Members:**

- Give them GPG password via secure channel
- Show them `yarn env` command
- Review environment differences (dev/staging/prod)

### CI/CD Best Practices

**1. Use Direct Commands (No Interactive Prompts):**

```bash
yarn prebuild:production
yarn start:staging
```

**2. Store Secrets Properly:**

- GitHub Actions: Repository Secrets
- GitLab CI: CI/CD Variables
- Jenkins: Credentials Store

**3. Decrypt in CI Pipeline:**

```bash
echo "$GPG_PASSWORD" | gpg --batch --passphrase-fd 0 \
  --decrypt -o keys.production.json \
  config/encrypted/keys.production.json.gpg
```

### Security Best Practices

**1. Regular Key Rotation:**

Rotate API keys and passwords periodically.

**2. Audit Access:**

Review who has access to GPG password regularly.

**3. No Secrets in Code:**

Never hardcode API keys, tokens, or secrets.

**4. Use Secure Keys Section:**

Put sensitive data in `secure` section for JNI protection:

```json
{
  "secure": {
    "API_KEY": "sensitive",
    "STRIPE_KEY": "sensitive",
    "JWT_SECRET": "sensitive"
  }
}
```

---

## Commands Reference

### Environment Management

| Command | Description |
|---------|-------------|
| `yarn env` | Interactive environment selector (decrypt) |
| `yarn env:encrypt` | Encrypt all environment files |
| `yarn env:list` | List available encrypted files |
| `yarn env:status` | Show encryption/decryption status |
| `yarn env:setup` | Create initial `keys.development.json` from example |
| `yarn env:verify` | Validate environment configuration |

### Development (Interactive Profile Selection)

| Command | Description |
|---------|-------------|
| `yarn start` | **Interactive profile selection** → start dev server |
| `yarn prebuild` | **Interactive profile selection** → prebuild native |
| `yarn ios` | **Interactive profile selection** → build & run iOS |
| `yarn android` | **Interactive profile selection** → build & run Android |

### Development (Direct - Skip Profile Selection)

| Command | Description |
|---------|-------------|
| `yarn start:dev` | Start with development profile |
| `yarn start:staging` | Start with staging profile |
| `yarn start:production` | Start with production profile |
| `yarn prebuild:dev` | Prebuild with development profile |
| `yarn prebuild:staging` | Prebuild with staging profile |
| `yarn prebuild:production` | Prebuild with production profile |
| `yarn ios:dev` | Build & run iOS with development |
| `yarn ios:staging` | Build & run iOS with staging |
| `yarn ios:production` | Build & run iOS with production |
| `yarn android:dev` | Build & run Android with development |
| `yarn android:staging` | Build & run Android with staging |
| `yarn android:production` | Build & run Android with production |

### Other Build Commands

| Command | Description |
|---------|-------------|
| `yarn prebuild:clean` | Clean rebuild of native folders |
| `yarn web` | Run on web (no profile selection needed) |

### Manual Override

| Command | Description |
|---------|-------------|
| `KEYSFILE=keys.staging.json yarn start` | Override with specific keys file |
| `KEYSFILE=keys.production.json yarn prebuild` | Prebuild with specific keys file |

### Verification

| Command | Description |
|---------|-------------|
| `yarn env:verify` | Validate JSON syntax and required keys |
| `yarn env:status` | Check which environments are decrypted |
| `yarn env:list` | List all encrypted files with metadata |

---

## Summary

You now have a complete multi-environment setup with:

✅ **Secure Storage**: GPG-encrypted files (AES256) + JNI-compiled keys  
✅ **Easy Switching**: Interactive profile selector for development  
✅ **Team Friendly**: Encrypted files in git, password-protected  
✅ **CI/CD Ready**: Direct commands for automated pipelines  
✅ **Type Safe**: TypeScript definitions for all environment variables  
✅ **Cross Platform**: Works on iOS, Android, macOS, Linux, Windows  

### Next Steps

1. **Setup**: `yarn env:setup` → Edit values → `yarn env:encrypt`
2. **Daily Work**: `yarn start` → Select profile → Develop
3. **Team**: Share GPG password securely, commit encrypted files
4. **Deploy**: Use `yarn prebuild:production` in CI/CD

### Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md` - Project structure and patterns
- **Example Keys:** `keys.example.json` - Template for new environments

---

**Your environment is now secure, flexible, and team-friendly! 🔐🚀**

