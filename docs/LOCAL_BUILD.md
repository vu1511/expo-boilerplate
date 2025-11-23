# Local Build & Deploy Guide

Complete guide for building and deploying your app locally with EAS (100% FREE).

## Prerequisites

### First-time setup

```bash
yarn build:setup
```

This will:

- Install EAS CLI
- Login to your Expo account
- Setup Android/iOS credentials
- Verify environment files

## Build Profiles

| Profile         | Purpose                   | Output    | Distribution              |
| --------------- | ------------------------- | --------- | ------------------------- |
| **Development** | Dev client with debugging | APK / IPA | Firebase App Distribution |
| **Staging**     | Internal testing (ad-hoc) | APK / IPA | Firebase App Distribution |
| **Production**  | App store release         | AAB / IPA | Google Play / App Store   |

## Commands

### Build only

```bash
yarn build
```

Interactive menu to select:

1. Platform: Android, iOS, or Both
2. Profile: Development, Staging, or Production
3. Build starts automatically

Artifacts saved to: `./build-output/`

### Build + Deploy

```bash
yarn build:deploy
```

Same as `yarn build` but automatically deploys to:

- **Development/Staging**: Firebase App Distribution
- **Production**: Google Play / App Store (via EAS Submit)

### Deploy only

```bash
yarn deploy
```

Deploy existing builds from `./build-output/` to Firebase App Distribution.

## Development Builds

There are **two ways** to create development builds:

### Option 1: Firebase Distribution (Recommended)

```bash
yarn build:deploy
# Select: Development profile
```

**Use when:**

- ✅ Distributing to testers on physical devices
- ✅ Need QA team to test on their devices
- ✅ Want Hot Reload + debugging on physical devices

**Result:** APK/IPA uploaded to Firebase → Testers install from Firebase link

### Option 2: Direct Installation

```bash
npx expo run:android
# or
npx expo run:ios
```

**Use when:**

- ✅ Local development on simulator/emulator
- ✅ Quick iteration during active coding
- ✅ Debugging on connected device via USB

**Result:** App installed directly on simulator/device

## Build Output

| Profile     | Android          | iOS              | Size       |
| ----------- | ---------------- | ---------------- | ---------- |
| Development | `.apk` (debug)   | `.ipa` (debug)   | ~50-100 MB |
| Staging     | `.apk` (release) | `.ipa` (ad-hoc)  | ~30-50 MB  |
| Production  | `.aab` (release) | `.ipa` (release) | ~30-50 MB  |

All files saved to: `./build-output/app-{platform}-{profile}.{ext}`

## Examples

### Build Android staging

```bash
yarn build
# [1] Android
# [2] Staging
# Builds: app-android-staging.apk
```

### Build + deploy iOS production

```bash
yarn build:deploy
# [2] iOS
# [3] Production
# Builds + submits to App Store
```

### Build both platforms for development

```bash
yarn build:deploy
# [3] Both Platforms
# [1] Development
# Builds both in parallel + uploads to Firebase
```

### Deploy existing staging build

```bash
yarn deploy
# [3] All Platforms
# [2] Staging
# Deploys app-android-staging.apk and app-ios-staging.ipa
```

## Workflow

### Development workflow

```bash
# Local development
npx expo run:android  # Quick iteration

# Distribute to testers
yarn build:deploy     # Select: Development
                      # Testers install from Firebase
```

### Staging workflow

```bash
# Build + distribute for QA
yarn build:deploy     # Select: Staging
                      # QA team gets notification via Firebase
```

### Production workflow

```bash
# Build + submit to stores
yarn build:deploy     # Select: Production
                      # Submits to Google Play (internal track)
                      # Uploads to App Store Connect

# Or build first, submit later
yarn build            # Select: Production
eas submit --platform android
eas submit --platform ios
```

## Environment Files

Each profile uses its own environment file:

```bash
keys.development.json    # Dev settings, dev API endpoints
keys.staging.json        # Staging settings, staging API
keys.production.json     # Production settings, prod API
```

Required variables:

- `IOS_BUNDLE_ID` / `ANDROID_BUNDLE_ID` - App identifier
- `FIREBASE_ANDROID_APP_ID` / `FIREBASE_IOS_APP_ID` - Firebase distribution
- `API_URL` - Backend API endpoint

## Distribution Setup

### Firebase App Distribution

1. Create Firebase project
2. Add Android/iOS apps
3. Create tester group: "testers"
4. Add Firebase App IDs to `keys.*.json`:

```json
{
  "public": {
    "FIREBASE_ANDROID_APP_ID": "1:123:android:abc",
    "FIREBASE_IOS_APP_ID": "1:123:ios:xyz",
    "FIREBASE_GROUP": "testers"
  }
}
```

### Google Play Store (Production)

1. Create app in Google Play Console
2. Enable App Signing by Google Play
3. Setup service account
4. Configure in Expo dashboard or `eas.json`

See: [EAS Submit - Android](https://docs.expo.dev/submit/android/)

### App Store (Production)

1. Create app in App Store Connect
2. Setup App Store Connect API key
3. Configure in Expo dashboard or `eas.json`

See: [EAS Submit - iOS](https://docs.expo.dev/submit/ios/)

## Troubleshooting

### Build fails

```bash
# Check EAS auth
eas whoami

# Check credentials
eas credentials

# Verify environment files
ls keys.*.json

# Clear cache and rebuild
rm -rf ~/.eas-build-local
yarn build
```

### Deployment fails

```bash
# Check Firebase CLI
firebase --version
firebase login

# Verify Firebase App IDs
cat keys.production.json | grep FIREBASE

# Check Firebase Console
https://console.firebase.google.com/project/_/appdistribution
```

### Wrong bundle ID

```bash
# Native folders cache old bundle IDs
# Solution: Prebuild clean is automatic in build script
yarn build  # Already includes: expo prebuild --clean
```

## Build Times

| Build Type     | First Build | Subsequent |
| -------------- | ----------- | ---------- |
| Android only   | 15-20 min   | 5-10 min   |
| iOS only       | 20-30 min   | 10-15 min  |
| Both platforms | 30-40 min   | 15-20 min  |

**Tips:**

- First build downloads dependencies (slow)
- Subsequent builds reuse cache (fast)
- Both platforms build in parallel (same time as longest)

## Cost

All local builds are **100% FREE**:

- ✅ EAS Build Local: Free (builds on your machine)
- ✅ EAS Submit: Free (only submission, no build)
- ❌ EAS Build Cloud: Paid (builds on Expo servers)

## Related Docs

- [Environment Setup](./ENVIRONMENT.md) - Manage environment files
- [Version Management](./VERSION_MANAGEMENT.md) - App versioning
- [Architecture](./ARCHITECTURE.md) - Project structure

## Quick Reference

```bash
# Setup
yarn build:setup        # First-time setup

# Build
yarn build              # Build only
yarn build:deploy       # Build + deploy
yarn deploy             # Deploy existing builds

# Development
npx expo run:android    # Quick local dev
npx expo run:ios        # Quick local dev

# Submit
eas submit --platform android   # Submit to Google Play
eas submit --platform ios       # Submit to App Store
```
