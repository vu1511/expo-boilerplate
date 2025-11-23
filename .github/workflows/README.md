# GitHub Actions Workflows

This directory contains comprehensive CI/CD workflows for building and deploying the Expo app to multiple platforms and environments.

## 📋 Table of Contents

- [Workflows Overview](#workflows-overview)
- [Required Secrets](#required-secrets)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## 🔄 Workflows Overview

### 1. **CI - Lint, Format & Test** (`ci.yml`)

**Trigger**: All pushes and PRs

Runs code quality checks:

- ESLint validation
- Code formatting check
- Unit tests with coverage

### 2. **Build & Deploy** (`build-and-deploy.yml`)

**Trigger**: Manual (workflow_dispatch)

Main workflow with 9 different options:

- `build-android` - Build Android only
- `build-ios` - Build iOS only
- `build-both` - Build both platforms
- `build-deploy-android` - Build and deploy Android
- `build-deploy-ios` - Build and deploy iOS
- `build-deploy-both` - Build and deploy both platforms
- `deploy-android` - Deploy existing Android build
- `deploy-ios` - Deploy existing iOS build
- `deploy-both` - Deploy both existing builds

**Features**:

- Select profile (development, staging, production)
- Custom release notes
- Option to use self-hosted runner
- Parallel builds and deployments

### 3. **Auto Deploy - Main Branch** (`auto-deploy-main.yml`)

**Trigger**: Push to `main` branch

Automatically:

1. Runs lint, format, and tests
2. Builds Android and iOS in parallel (staging profile)
3. Deploys both to Firebase App Distribution in parallel
4. Sends success/failure notifications

### 4. **Reusable Build Workflow** (`build-reusable.yml`)

Internal workflow used by other workflows to build apps.

### 5. **Reusable Deploy Workflow** (`deploy-reusable.yml`)

Internal workflow used by other workflows to deploy apps.

## 🔐 Required Secrets

Configure these secrets in **Settings → Secrets and variables → Actions → Repository secrets**.

### Core Secrets (Required for All Workflows)

| Secret Name  | Description               | How to Get                                                                                                       |
| ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `EXPO_TOKEN` | Expo authentication token | Run `npx eas login` then `npx eas whoami` → Get token from `~/.expo/state.json` or run `npx eas build:configure` |

### Keys Files (Required - One per Profile)

| Secret Name             | Description                   | Example                                        |
| ----------------------- | ----------------------------- | ---------------------------------------------- |
| `KEYS_FILE_DEVELOPMENT` | Development keys file content | Copy entire content of `keys.development.json` |
| `KEYS_FILE_STAGING`     | Staging keys file content     | Copy entire content of `keys.staging.json`     |
| `KEYS_FILE_PRODUCTION`  | Production keys file content  | Copy entire content of `keys.production.json`  |

**Format Example**:

```json
{
  "public": {
    "APP_NAME": "MyApp Dev",
    "BUNDLE_ID": "com.company.app.dev",
    "PACKAGE_NAME": "com.company.app.dev",
    "FIREBASE_ANDROID_APP_ID": "1:123456:android:abc123",
    "FIREBASE_IOS_APP_ID": "1:123456:ios:def456",
    "FIREBASE_GROUP": "testers"
  }
}
```

### Firebase Secrets (Required for Development & Staging)

| Secret Name      | Description       | How to Get                                 |
| ---------------- | ----------------- | ------------------------------------------ |
| `FIREBASE_TOKEN` | Firebase CI token | Run `firebase login:ci` and copy the token |

### Production Store Submission

**Note**: Store credentials are configured in Expo dashboard, not GitHub secrets.

To set up store submission:

1. **Google Play**: Run `eas credentials` → Select Android → Production → Upload service account JSON
2. **App Store**: Run `eas credentials` → Select iOS → Production → Upload App Store Connect API key

See [Expo Submit documentation](https://docs.expo.dev/submit/introduction/) for details.

### Optional Secrets

| Secret Name     | Description                              |
| --------------- | ---------------------------------------- |
| `CODECOV_TOKEN` | Code coverage reporting token (optional) |

## 🚀 Setup Instructions

### Step 1: Configure Expo Project

1. **Login to Expo**:

   ```bash
   npx eas login
   ```

2. **Configure EAS Build**:

   ```bash
   npx eas build:configure
   ```

3. **Get Expo Token**:

   ```bash
   # Option 1: From state file
   cat ~/.expo/state.json | jq .auth.sessionSecret

   # Option 2: Create a new token
   npx eas whoami
   ```

### Step 2: Configure Firebase

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and get CI token**:

   ```bash
   firebase login:ci
   ```

   Copy the token output.

3. **Setup Firebase App Distribution**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to App Distribution
   - Add your Android and iOS apps
   - Copy the Firebase App IDs to your keys files
   - Create a tester group named "testers" (or customize in keys file)

### Step 3: Add Secrets to GitHub

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**

2. Click **New repository secret**

3. Add each secret from the [Required Secrets](#required-secrets) section

4. For keys files:
   ```bash
   # Copy entire file content
   cat keys.development.json | pbcopy  # macOS
   cat keys.development.json | xclip   # Linux
   ```

### Step 4: Configure Self-Hosted Runner (Optional)

If you want to use local builds or have iOS builds on your own Mac:

1. Go to **Settings** → **Actions** → **Runners** → **New self-hosted runner**
2. Follow the setup instructions
3. Start the runner:
   ```bash
   ./run.sh
   ```

### Step 5: Test Workflows

1. Go to **Actions** tab in your repository
2. Select **Build & Deploy** workflow
3. Click **Run workflow**
4. Choose options and run a test build

## 📖 Usage Guide

### Manual Builds (Any Branch)

1. Go to **Actions** → **Build & Deploy**
2. Click **Run workflow**
3. Select:
   - **Workflow type**: Choose from 9 options
   - **Profile**: development, staging, or production
   - **Release notes**: Optional custom notes
   - **Use local runner**: Check to use self-hosted runner

### Automatic Staging Deployment (Main Branch)

When you push to `main`:

1. Automatically runs all checks
2. Builds Android and iOS (staging)
3. Deploys to Firebase App Distribution
4. Notifies on success/failure

### Development Workflow

**For feature branches**:

```bash
# Push triggers CI checks only
git push origin feature/my-feature

# Manually trigger build from GitHub Actions UI if needed
```

**For staging deployment**:

```bash
# Merge to main triggers auto-deploy
git checkout main
git merge feature/my-feature
git push origin main
# → Auto builds and deploys staging
```

**For production deployment**:

```bash
# Use manual workflow
# Go to Actions → Build & Deploy → Run workflow
# Select: build-deploy-both, production profile
```

## 🏗️ Build Outputs

### Artifacts

All builds are saved as artifacts with naming pattern:

- Android: `android-{profile}-{build-number}`
- iOS: `ios-{profile}-{build-number}`

Artifacts are retained for **30 days**.

### Build Numbers

Build numbers are automatically set from `${{ github.run_number }}`, which increments for each workflow run.

## 🔍 Workflow Architecture

```
┌─────────────────────────────────────┐
│     Manual Trigger / Main Push     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Pre-checks (Lint, Format, Test)  │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│Build Android│  │  Build iOS  │
│  (Parallel) │  │  (Parallel) │
└──────┬──────┘  └──────┬──────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│   Deploy    │  │   Deploy    │
│   Android   │  │     iOS     │
│  (Parallel) │  │  (Parallel) │
└─────────────┘  └─────────────┘
```

## 🐛 Troubleshooting

### Build Fails: "Not authenticated with Expo"

**Solution**: Check that `EXPO_TOKEN` is set correctly in secrets.

```bash
# Get a fresh token
npx eas login
cat ~/.expo/state.json | jq .auth.sessionSecret
```

### Build Fails: "Keys file not found"

**Solution**: Ensure you have `KEYS_FILE_{PROFILE}` secrets set for your profile.

Example: For staging profile, you need `KEYS_FILE_STAGING`.

### Deploy Fails: "Firebase App ID not found"

**Solution**: Add Firebase App IDs to your keys file:

```json
{
  "public": {
    "FIREBASE_ANDROID_APP_ID": "1:123456:android:abc123",
    "FIREBASE_IOS_APP_ID": "1:123456:ios:def456"
  }
}
```

### Build Fails: "No space left on device"

**Solution**: GitHub-hosted runners have limited space. Options:

1. Use self-hosted runner with more space
2. Clean up workspace in workflow
3. Use EAS cloud builds instead of local builds

### iOS Build Fails on Ubuntu Runner

**Solution**: iOS builds require macOS runners. The workflow should automatically use `macos-14`. If using local builds, ensure you have a self-hosted Mac runner.

### Deploy Fails: "Firebase CLI not authenticated"

**Solution**: Check that `FIREBASE_TOKEN` secret is set correctly.

```bash
# Generate a new token
firebase login:ci
```

### Production Submit Fails

**Solution**: Ensure you have configured:

- For Android: Google Play Service Account Key in Expo dashboard
- For iOS: App Store Connect API Key in Expo dashboard

See [Expo Submit docs](https://docs.expo.dev/submit/introduction/) for details.

## 🔄 Runner Strategy

The workflows use this runner fallback strategy:

1. **Preferred**: GitHub-hosted free runners
   - Ubuntu for Android
   - macOS for iOS
   - Fast, no setup required

2. **Fallback**: Self-hosted runners
   - When `use-local-runner: true`
   - For larger builds
   - When free minutes exhausted

## 📊 Cost Optimization

**Free Tier Limits** (GitHub Actions):

- 2,000 minutes/month for private repos
- Unlimited for public repos
- Linux: 1x multiplier
- macOS: 10x multiplier

**Tips**:

1. Use Linux runners for Android
2. Minimize iOS builds (10x minute cost)
3. Use local/self-hosted runner for development
4. Reserve cloud builds for staging/production
5. Cache dependencies with `cache: 'yarn'`

## 🔗 Useful Links

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Runner](https://docs.github.com/en/actions/hosting-your-own-runners)

## 📝 Environment Variables in Builds

Build number is automatically injected:

```bash
BUILD_NUMBER=${{ github.run_number }}
```

Access in your app:

```typescript
import Constants from 'expo-constants'

const buildNumber = Constants.expoConfig?.extra?.buildNumber
```

Add to `app.config.ts`:

```typescript
export default {
  // ...
  extra: {
    buildNumber: process.env.BUILD_NUMBER || '1',
  },
}
```

## 🎯 Best Practices

1. **Always test in development first**: Use development profile to test changes
2. **Use staging for final testing**: Staging should mirror production
3. **Tag production releases**: Create git tags for production deployments
4. **Monitor build times**: Optimize if builds take too long
5. **Keep secrets updated**: Rotate tokens and keys regularly
6. **Review logs**: Always check workflow logs for issues
7. **Use branch protection**: Require CI to pass before merging to main

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review workflow logs in the Actions tab
3. Check [Expo status page](https://status.expo.dev/)
4. Review local build logs: `docs/LOCAL_BUILD.md`
5. Open an issue in the repository
