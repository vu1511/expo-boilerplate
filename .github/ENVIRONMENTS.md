# GitHub Actions Environments Reference

Complete list of environment variables and secrets needed for CI/CD workflows.

## 📊 Environment Overview

| Environment     | Purpose                     | Auto-Deploy      | Store Submission |
| --------------- | --------------------------- | ---------------- | ---------------- |
| **Development** | Local testing & development | ❌ No            | ❌ No            |
| **Staging**     | Internal testing            | ✅ Yes (on main) | ❌ No            |
| **Production**  | Public release              | ❌ Manual only   | ✅ Yes           |

---

## 🔐 GitHub Secrets

### Required for All Profiles

| Secret                  | Required | Used By            | Description                            |
| ----------------------- | -------- | ------------------ | -------------------------------------- |
| `EXPO_TOKEN`            | ✅ Yes   | All workflows      | Expo authentication token for EAS CLI  |
| `KEYS_FILE_DEVELOPMENT` | ✅ Yes   | Development builds | Complete keys.development.json content |
| `KEYS_FILE_STAGING`     | ✅ Yes   | Staging builds     | Complete keys.staging.json content     |
| `KEYS_FILE_PRODUCTION`  | ✅ Yes   | Production builds  | Complete keys.production.json content  |

### Firebase (Development & Staging)

| Secret           | Required | Used By          | Description                            |
| ---------------- | -------- | ---------------- | -------------------------------------- |
| `FIREBASE_TOKEN` | ✅ Yes   | Deploy workflows | Firebase CI token for App Distribution |

### Production Store Submission

**Note**: Store credentials are configured in Expo dashboard, not GitHub secrets. Use `eas credentials` to set them up.

### Optional

| Secret          | Required    | Used By     | Description             |
| --------------- | ----------- | ----------- | ----------------------- |
| `CODECOV_TOKEN` | ⚠️ Optional | CI workflow | Code coverage reporting |

---

## 📝 Keys File Structure

Each profile needs a keys file with this structure:

### Development (`keys.development.json`)

```json
{
  "public": {
    "APP_NAME": "MyApp Dev",
    "BUNDLE_ID": "com.company.app.dev",
    "PACKAGE_NAME": "com.company.app.dev",
    "FIREBASE_ANDROID_APP_ID": "1:123456789:android:dev123",
    "FIREBASE_IOS_APP_ID": "1:123456789:ios:dev456",
    "FIREBASE_GROUP": "developers",
    "API_URL": "https://api-dev.example.com",
    "APP_ENV": "development"
  },
  "private": {
    "API_KEY": "dev-api-key",
    "SECRET_KEY": "dev-secret-key"
  }
}
```

### Staging (`keys.staging.json`)

```json
{
  "public": {
    "APP_NAME": "MyApp Staging",
    "BUNDLE_ID": "com.company.app.staging",
    "PACKAGE_NAME": "com.company.app.staging",
    "FIREBASE_ANDROID_APP_ID": "1:123456789:android:stg123",
    "FIREBASE_IOS_APP_ID": "1:123456789:ios:stg456",
    "FIREBASE_GROUP": "testers",
    "API_URL": "https://api-staging.example.com",
    "APP_ENV": "staging"
  },
  "private": {
    "API_KEY": "staging-api-key",
    "SECRET_KEY": "staging-secret-key"
  }
}
```

### Production (`keys.production.json`)

```json
{
  "public": {
    "APP_NAME": "MyApp",
    "BUNDLE_ID": "com.company.app",
    "PACKAGE_NAME": "com.company.app",
    "FIREBASE_ANDROID_APP_ID": "1:123456789:android:prod123",
    "FIREBASE_IOS_APP_ID": "1:123456789:ios:prod456",
    "FIREBASE_GROUP": "beta-testers",
    "API_URL": "https://api.example.com",
    "APP_ENV": "production"
  },
  "private": {
    "API_KEY": "production-api-key",
    "SECRET_KEY": "production-secret-key"
  }
}
```

---

## 🔢 Build Numbers

Build numbers are automatically managed by GitHub Actions:

```yaml
BUILD_NUMBER: ${{ github.run_number }}
```

- Increments with each workflow run
- Starts at 1 for new repositories
- Shared across all workflows in the repository

### Accessing Build Number in App

Add to `app.config.ts`:

```typescript
export default ({ config }) => ({
  ...config,
  version: '1.0.0',
  ios: {
    buildNumber: process.env.BUILD_NUMBER || '1',
  },
  android: {
    versionCode: parseInt(process.env.BUILD_NUMBER || '1', 10),
  },
  extra: {
    buildNumber: process.env.BUILD_NUMBER || '1',
  },
})
```

Access in your app:

```typescript
import Constants from 'expo-constants'

const buildNumber = Constants.expoConfig?.extra?.buildNumber
const version = Constants.expoConfig?.version

console.log(`Version ${version} (${buildNumber})`)
```

---

## 🌍 Environment-Specific Configuration

### Development

**Purpose**: Local development and testing

**Characteristics**:

- Debug mode enabled
- Source maps included
- Dev tools enabled
- Connects to development API
- Firebase App Distribution for internal distribution

**Build Output**:

- Android: APK (easier to install)
- iOS: IPA (ad-hoc or development provisioning)

**Deployment**: Manual or on-demand

### Staging

**Purpose**: Pre-production testing with production-like environment

**Characteristics**:

- Production mode
- Staging API endpoints
- Firebase App Distribution for testers
- Matches production configuration

**Build Output**:

- Android: APK
- iOS: IPA (ad-hoc or enterprise provisioning)

**Deployment**: Automatic on push to `main` branch

### Production

**Purpose**: Public release to app stores

**Characteristics**:

- Full production mode
- Optimized and minified
- Production API
- Store submission ready
- Code obfuscation enabled

**Build Output**:

- Android: AAB (Android App Bundle)
- iOS: IPA (App Store provisioning)

**Deployment**: Manual submission to stores

---

## 🔄 Workflow Environment Variables

### Automatically Set by GitHub

| Variable            | Example           | Description                 |
| ------------------- | ----------------- | --------------------------- |
| `GITHUB_RUN_NUMBER` | `42`              | Unique run number           |
| `GITHUB_SHA`        | `abc123...`       | Commit SHA                  |
| `GITHUB_REF`        | `refs/heads/main` | Branch reference            |
| `GITHUB_ACTOR`      | `username`        | User who triggered workflow |
| `GITHUB_REPOSITORY` | `owner/repo`      | Repository name             |

### Set by Workflows

| Variable         | Set By              | Description                 |
| ---------------- | ------------------- | --------------------------- |
| `BUILD_NUMBER`   | All build workflows | Same as `GITHUB_RUN_NUMBER` |
| `KEYSFILE`       | Build workflows     | Which keys file to use      |
| `EXPO_TOKEN`     | All workflows       | Expo authentication         |
| `FIREBASE_TOKEN` | Deploy workflows    | Firebase authentication     |

---

## 🎯 Profile-Specific Features

### Feature Flags per Profile

You can use environment-specific flags in your app:

```typescript
// src/config/env.ts
import Config from 'react-native-keys'

export const ENV = {
  isDevelopment: Config.APP_ENV === 'development',
  isStaging: Config.APP_ENV === 'staging',
  isProduction: Config.APP_ENV === 'production',

  apiUrl: Config.API_URL,
  bundleId: Config.BUNDLE_ID,

  // Feature flags
  enableDebugMenu: Config.APP_ENV !== 'production',
  enableAnalytics: Config.APP_ENV === 'production',
  logLevel: Config.APP_ENV === 'production' ? 'error' : 'debug',
}
```

### Bundle Identifiers

Each profile should have unique bundle IDs:

```
Development:  com.company.app.dev
Staging:      com.company.app.staging
Production:   com.company.app
```

This allows all three versions to be installed simultaneously on the same device.

---

## 📱 Firebase App Distribution Groups

Organize testers by profile:

| Profile     | Group Name     | Members               |
| ----------- | -------------- | --------------------- |
| Development | `developers`   | Internal dev team     |
| Staging     | `testers`      | QA team, stakeholders |
| Production  | `beta-testers` | External beta testers |

Configure in keys files:

```json
{
  "public": {
    "FIREBASE_GROUP": "testers"
  }
}
```

---

## 🔒 Secret Management Best Practices

### Separation of Concerns

- **Public keys**: Can be embedded in app (bundle IDs, Firebase App IDs)
- **Private keys**: Only in secure environments (API keys, secrets)

### Rotation Schedule

| Secret            | Rotation Frequency | Priority |
| ----------------- | ------------------ | -------- |
| `EXPO_TOKEN`      | 90 days            | High     |
| `FIREBASE_TOKEN`  | 90 days            | High     |
| API Keys          | 30-90 days         | Critical |
| Store credentials | As needed          | Critical |

### Access Control

1. Limit who can access repository secrets
2. Use different Firebase projects per environment
3. Use different API keys per environment
4. Enable branch protection on `main`
5. Require PR reviews for production changes

---

## 📊 Environment Comparison Matrix

| Feature                   | Development  | Staging      | Production  |
| ------------------------- | ------------ | ------------ | ----------- |
| **Auto-deploy on main**   | ❌           | ✅           | ❌          |
| **Manual builds**         | ✅           | ✅           | ✅          |
| **Firebase Distribution** | ✅           | ✅           | ⚠️ Optional |
| **Store submission**      | ❌           | ❌           | ✅          |
| **Debug mode**            | ✅           | ❌           | ❌          |
| **Source maps**           | ✅           | ✅           | ⚠️ Limited  |
| **Code minification**     | ❌           | ✅           | ✅          |
| **Analytics**             | ⚠️ Test mode | ⚠️ Test mode | ✅          |
| **Crash reporting**       | ⚠️ Optional  | ✅           | ✅          |
| **Build output**          | APK/IPA      | APK/IPA      | AAB/IPA     |
| **Provisioning**          | Development  | Ad-hoc       | App Store   |

---

## 🚀 Migration Guide

### From Local to CI/CD

If you're migrating from local builds:

1. **Backup existing keys**:

   ```bash
   cp keys.*.json ~/backups/
   ```

2. **Add secrets to GitHub** (see SECRETS_SETUP.md)

3. **Test with development profile first**:
   - Actions → Build & Deploy
   - Select `build-android`, `development`
   - Verify build succeeds

4. **Enable auto-deploy for staging**:
   - Push to `main` branch
   - Verify auto-deploy works

5. **Test production build**:
   - Manual trigger with `production` profile
   - Test store submission (optional)

### From Other CI to GitHub Actions

1. **Export secrets from current CI**
2. **Map to GitHub secrets** (use table above)
3. **Update keys file format** if needed
4. **Test workflows** one profile at a time
5. **Migrate gradually** (dev → staging → production)

---

## 📚 Additional Resources

- [Keys File Documentation](../../docs/ENVIRONMENT.md)
- [Local Build Guide](../../docs/LOCAL_BUILD.md)
- [Secrets Setup Guide](./SECRETS_SETUP.md)
- [Workflows README](./README.md)

---

## ✅ Environment Checklist

Use this checklist when setting up a new environment:

### Development

- [ ] Create `keys.development.json`
- [ ] Add Firebase App IDs
- [ ] Create Firebase tester group
- [ ] Add `KEYS_FILE_DEVELOPMENT` secret to GitHub
- [ ] Test manual build

### Staging

- [ ] Create `keys.staging.json`
- [ ] Add Firebase App IDs
- [ ] Create Firebase tester group
- [ ] Add `KEYS_FILE_STAGING` secret to GitHub
- [ ] Test manual build
- [ ] Test auto-deploy on main push

### Production

- [ ] Create `keys.production.json`
- [ ] Add Firebase App IDs (optional)
- [ ] Add `KEYS_FILE_PRODUCTION` secret to GitHub
- [ ] Configure store credentials in Expo
- [ ] Test production build
- [ ] Test store submission (optional)

### Global

- [ ] Add `EXPO_TOKEN`
- [ ] Add `FIREBASE_TOKEN`
- [ ] Configure repository settings
- [ ] Set up branch protection
- [ ] Test all workflows
