# CI/CD Setup Guide

Comprehensive guide for setting up Continuous Integration and Continuous Delivery for this Expo React Native project.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Workflows](#workflows)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

### Tech Stack

- **CI Platform**: GitHub Actions (self-hosted runner)
- **Build Service**: EAS Build (Expo Application Services)
- **Distribution**: Firebase App Distribution
- **Version Management**: standard-version + Conventional Commits

### Why This Setup?

| Component | Why We Use It | Alternative |
|-----------|---------------|-------------|
| **EAS Build** | - Native Expo integration<br>- Cloud-based builds<br>- Automatic code signing<br>- Build for iOS without Mac | Fastlane (more complex) |
| **Self-Hosted Runner** | - No cost for CI minutes<br>- Fast local caching<br>- Full control over environment | GitHub-hosted runners |
| **Firebase App Distribution** | - Easy tester management<br>- Email notifications<br>- Crash analytics<br>- Free tier generous | TestFlight (iOS only), HockeyApp |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Developer pushes code / creates PR                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (Self-Hosted Runner on Your Mac)        │
│                                                           │
│  Jobs:                                                    │
│  1️⃣  Lint & Test (runs on every push/PR)               │
│      - ESLint                                             │
│      - TypeScript type checking                           │
│      - Jest unit tests                                    │
│      - Commitlint validation                              │
│                                                           │
│  2️⃣  Build Preview (develop branch)                     │
│      - Triggers EAS Build                                 │
│      - Waits for build completion                         │
│                                                           │
│  3️⃣  Build & Distribute (tags/manual)                   │
│      - Triggers EAS Build                                 │
│      - Downloads APK/IPA                                  │
│      - Uploads to Firebase                                │
│                                                           │
│  4️⃣  Release (manual)                                   │
│      - Runs standard-version                              │
│      - Updates CHANGELOG                                  │
│      - Creates git tag                                    │
│      - Creates GitHub Release                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  EAS Build (Expo Cloud Builders)                        │
│                                                           │
│  - Builds iOS IPA (on macOS VM)                          │
│  - Builds Android APK/AAB (on Ubuntu VM)                 │
│  - Handles code signing automatically                     │
│  - Parallel builds for both platforms                     │
│  - Stores builds in Expo CDN                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Firebase App Distribution                               │
│                                                           │
│  - Receives APK/IPA                                       │
│  - Notifies testers via email                             │
│  - Provides download links                                │
│  - Tracks installs and crashes                            │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### 1. Self-Hosted GitHub Runner

**Why?**
- ✅ No cost for CI compute minutes
- ✅ Faster builds with local caching
- ✅ Access to local environment and secrets
- ✅ Better control over build environment

**Requirements:**
- macOS 11+ (Big Sur or later)
- Xcode installed (for iOS simulators, even if building in cloud)
- Minimum 8GB RAM, 50GB free disk space
- Stable internet connection

**Setup:**

```bash
# 1. Go to your GitHub repository
# Settings → Actions → Runners → New self-hosted runner

# 2. Download the runner (macOS)
mkdir actions-runner && cd actions-runner
curl -o actions-runner-osx-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-osx-x64-2.311.0.tar.gz
tar xzf ./actions-runner-osx-x64-2.311.0.tar.gz

# 3. Configure the runner
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN

# 4. Install as a service (runs in background)
./svc.sh install
./svc.sh start

# 5. Verify runner is online
# Check GitHub repository Settings → Actions → Runners
```

**Security Best Practices:**
- ✅ Use only with **private repositories** (critical!)
- ✅ Run runner with least-privilege user account
- ✅ Enable firewall and restrict network access
- ✅ Regularly update runner software
- ✅ Monitor runner logs for suspicious activity
- ✅ Use runner only for trusted code

**Runner Maintenance:**

```bash
# Check runner status
./svc.sh status

# Stop runner
./svc.sh stop

# Update runner
./svc.sh uninstall
./config.sh remove --token YOUR_TOKEN
# Download and configure new version

# View logs
tail -f _diag/Runner_*.log
```

### 2. Expo Account & EAS CLI

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Initialize EAS in your project (if not already done)
eas init

# Configure EAS Build
eas build:configure
```

### 3. Firebase App Distribution

**Setup Steps:**

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Add iOS and Android apps

2. **Enable App Distribution**
   - Navigate to Release & Monitor → App Distribution
   - Enable App Distribution for both apps

3. **Get Firebase App IDs**
   ```bash
   # Find in Firebase Console → Project Settings → General
   # Android: 1:1234567890:android:abcdef123456
   # iOS: 1:1234567890:ios:abcdef123456
   ```

4. **Create Service Account**
   ```bash
   # Firebase Console → Project Settings → Service Accounts
   # Click "Generate new private key"
   # Save the JSON file securely
   ```

5. **Invite Testers**
   ```bash
   # App Distribution → Testers & Groups
   # Create group "testers"
   # Add tester emails
   ```

### 4. GitHub Secrets

Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `EXPO_TOKEN` | Expo authentication token | `eas whoami` → `eas build:configure` |
| `EXPO_ACCOUNT_OWNER` | Expo account username | Your Expo username |
| `EXPO_PROJECT_SLUG` | Expo project slug | From `app.json` or EAS dashboard |
| `FIREBASE_ANDROID_APP_ID` | Firebase Android app ID | Firebase Console → Project Settings |
| `FIREBASE_IOS_APP_ID` | Firebase iOS app ID | Firebase Console → Project Settings |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | Firebase Console → Service Accounts |
| `GPG_PASSPHRASE` | Passphrase for encrypted keys | Your encryption passphrase |

**Get Expo Token:**

```bash
# Method 1: Generate personal access token
eas whoami
# Follow the link to create token at expo.dev

# Method 2: Use existing credentials
eas login
npx expo-cli login --u YOUR_EMAIL --p YOUR_PASSWORD
```

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
# Install EAS CLI
yarn global add eas-cli

# Or use npx (no global install)
npx eas-cli --version
```

### Step 2: Configure EAS Build

The `eas.json` file is already configured with:
- **development**: Debug builds for internal testing
- **staging**: Release builds for QA
- **production**: Store-ready builds
- **preview**: Quick test builds

**Review and customize:**

```bash
# Edit eas.json if needed
code eas.json

# Test configuration
eas build:configure
```

### Step 3: Configure Credentials

**iOS Credentials:**

```bash
# EAS will guide you through credential setup
eas credentials

# Or let EAS manage automatically during first build
eas build --platform ios --profile staging
```

**Android Credentials:**

```bash
# Generate keystore (if you don't have one)
eas credentials

# Or use existing keystore
# Place keystore in secure location
# Update credentials through EAS CLI
```

### Step 4: Test Local Build (Optional)

```bash
# Test Android build locally
eas build --platform android --profile staging --local

# Test iOS build locally (requires Mac with Xcode)
eas build --platform ios --profile staging --local
```

### Step 5: Configure Self-Hosted Runner

Follow [Prerequisites → Self-Hosted Runner](#1-self-hosted-github-runner) above.

### Step 6: First Cloud Build

```bash
# Trigger first build manually
eas build --platform all --profile staging

# Monitor build
eas build:list

# Download built artifacts
eas build:download --platform android
eas build:download --platform ios
```

---

## Workflows

### 1. `ci.yml` - Continuous Integration

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs:**
1. **Lint & Test**
   - Checkout code
   - Install dependencies
   - Verify environment variables
   - Run ESLint
   - Run Jest tests with coverage
   - Validate commit messages (PRs only)
   - Security audit

2. **Type Check**
   - TypeScript type checking

3. **Summary**
   - Aggregates all job results

**Example:**

```bash
# CI runs automatically on push
git push origin develop

# View results in GitHub Actions tab
```

### 2. `build-preview.yml` - Preview Builds

**Triggers:**
- Push to `develop` branch (automatic)
- Manual dispatch

**Purpose:**
- Quick builds for testing during development
- Distributed to internal testers
- Not uploaded to stores

**Manual trigger:**

```bash
# Via GitHub UI:
# Actions → Build Preview → Run workflow
# Select platform and profile
```

### 3. `build-and-distribute.yml` - Production Builds

**Triggers:**
- Push tags matching `v*.*.*` (e.g., `v1.0.0`)
- Manual dispatch

**Purpose:**
- Production-ready builds
- Distributed to Firebase App Distribution
- Can be submitted to app stores

**Workflow:**

```bash
# 1. Create release locally
yarn release

# 2. Push with tags (triggers build automatically)
git push --follow-tags origin main

# 3. Monitor build
eas build:list

# 4. Check Firebase App Distribution
# Testers receive email notification
```

**Manual trigger:**

```bash
# Via GitHub UI:
# Actions → Build & Distribute → Run workflow
# Select platform, profile, and distribution option
```

### 4. `release.yml` - Release Automation

**Triggers:**
- Manual dispatch only

**Purpose:**
- Automate version bumping
- Update CHANGELOG
- Create git tags
- Create GitHub releases

**Usage:**

```bash
# Via GitHub UI:
# Actions → Release → Run workflow
# Select release type: patch, minor, major, or auto

# This workflow will:
# 1. Run standard-version
# 2. Commit changes
# 3. Create and push git tag
# 4. Create GitHub Release

# Then manually trigger "Build & Distribute" workflow
```

---

## Best Practices

### Security

1. **Protect Sensitive Data**
   - ✅ Use GitHub Secrets for all credentials
   - ✅ Encrypt environment-specific keys with GPG
   - ✅ Never commit unencrypted secrets
   - ✅ Rotate credentials regularly

2. **Self-Hosted Runner Security**
   - ✅ Use only with private repositories
   - ✅ Isolate runner machine from production systems
   - ✅ Keep runner software updated
   - ✅ Monitor runner logs
   - ✅ Use dedicated user account with minimal privileges

3. **Access Control**
   - ✅ Limit who can trigger workflows
   - ✅ Use GitHub branch protection rules
   - ✅ Require code reviews before merge
   - ✅ Use CODEOWNERS file

### Performance

1. **Caching**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '22'
       cache: 'yarn'  # ← Caches yarn dependencies
   ```

2. **Parallel Jobs**
   - Lint and type-check run in parallel
   - iOS and Android builds run in parallel (EAS)

3. **Conditional Execution**
   ```yaml
   if: github.event_name == 'pull_request'  # Only on PRs
   if: github.ref == 'refs/heads/main'      # Only on main branch
   ```

### Cost Optimization

1. **Self-Hosted Runner**
   - ✅ Free CI compute minutes
   - ✅ Faster with local caching
   - ⚠️ Costs: electricity, internet, hardware wear

2. **EAS Build Pricing**
   - Free tier: 30 builds/month
   - Priority builds: $29/month (unlimited)
   - Consider: Caching, parallel builds

3. **Firebase App Distribution**
   - Free tier: Unlimited apps and testers
   - Generous for small-medium teams

### Maintenance

1. **Regular Updates**
   ```bash
   # Update GitHub Actions
   # Check .github/workflows/*.yml for new action versions
   
   # Update EAS CLI
   yarn global upgrade eas-cli
   
   # Update runner software
   cd actions-runner
   ./svc.sh stop
   # Download new version and reconfigure
   ```

2. **Clean Up Old Builds**
   ```bash
   # EAS keeps builds for 30 days (free tier)
   # Firebase keeps builds per your plan
   
   # Clean local artifacts
   rm -rf android-build.apk ios-build.ipa
   ```

3. **Monitor Workflow Performance**
   - GitHub Actions → Insights
   - Track workflow duration trends
   - Optimize slow steps

---

## Troubleshooting

### EAS Build Issues

**Issue: "Expo token is not valid"**

```bash
# Regenerate token
eas whoami
eas build:configure

# Update GitHub secret EXPO_TOKEN
```

**Issue: "No matching provisioning profile found" (iOS)**

```bash
# Reset iOS credentials
eas credentials --platform ios

# Generate new profiles
eas build --platform ios --profile staging
```

**Issue: Build fails with "Gradle build failed" (Android)**

```bash
# Check android/build.gradle dependencies
# Update Gradle version if needed
cd android && ./gradlew clean

# Rebuild
eas build --platform android --profile staging
```

### GitHub Actions Issues

**Issue: Runner is offline**

```bash
# Check runner status
cd ~/actions-runner
./svc.sh status

# Restart runner
./svc.sh stop
./svc.sh start

# View logs
tail -f _diag/Runner_*.log
```

**Issue: "Resource not accessible by integration"**

- Check GitHub Actions permissions
- Settings → Actions → General → Workflow permissions
- Enable "Read and write permissions"

**Issue: Workflow not triggering**

```bash
# Check branch protection rules
# Settings → Branches → Branch protection rules

# Check workflow triggers in .yml file
# Ensure branch names match

# Force trigger manually
# Actions → [Workflow Name] → Run workflow
```

### Firebase Distribution Issues

**Issue: "Firebase App ID not found"**

- Verify `FIREBASE_ANDROID_APP_ID` and `FIREBASE_IOS_APP_ID` secrets
- Check Firebase Console → Project Settings → General
- Ensure App Distribution is enabled

**Issue: Testers not receiving notifications**

- Check Firebase Console → App Distribution → Testers & Groups
- Verify email addresses are correct
- Check spam/junk folders
- Re-invite testers

**Issue: "Service account does not have permission"**

```bash
# Regenerate service account key
# Firebase Console → Project Settings → Service Accounts
# Generate new private key
# Update FIREBASE_SERVICE_ACCOUNT secret with full JSON content
```

### Common Build Errors

**Issue: "Cannot find module 'xxx'"**

```bash
# Clear caches
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# On CI: Use --frozen-lockfile
yarn install --frozen-lockfile
```

**Issue: "Duplicate resources" (Android)**

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Remove cached builds
rm -rf android/app/build
```

**Issue: TypeScript errors in CI but not locally**

```bash
# Ensure same TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf node_modules/.cache
npx tsc --build --clean

# Rebuild
npx tsc --noEmit
```

---

## Workflow Examples

### Example 1: Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and commit (conventional commits)
git add .
yarn commit  # Interactive commit helper

# 3. Push and create PR
git push origin feature/new-feature
# Create PR on GitHub

# 4. CI runs automatically
# - Lint & Test workflow runs
# - TypeScript type checking
# - Commit message validation

# 5. Review and merge PR
# CI runs again on main/develop branch
```

### Example 2: Release to Testers (Staging)

```bash
# 1. Ensure you're on develop branch
git checkout develop
git pull origin develop

# 2. Create release
yarn release
# Select "Minor" for new features or "Patch" for bug fixes

# 3. Review CHANGELOG.md
cat CHANGELOG.md

# 4. Push with tags
git push --follow-tags origin develop

# 5. This automatically triggers:
# - Build Preview workflow
# - EAS builds for iOS and Android
# - Distribution to Firebase App Distribution
# - Testers receive email notification

# 6. Monitor build
eas build:list

# 7. Testers install and test the app
```

### Example 3: Production Release

```bash
# 1. Merge develop to main
git checkout main
git pull origin main
git merge develop

# 2. Create production release
yarn release
# Select "Major" if breaking changes, or use "Auto" to detect from commits

# 3. Review CHANGELOG.md
cat CHANGELOG.md

# 4. Push with tags (triggers build automatically)
git push --follow-tags origin main

# 5. Build & Distribute workflow runs automatically
# - Builds with "production" profile
# - Distributes to Firebase App Distribution

# 6. Manual submission to app stores (if needed)
# Download builds from EAS
eas build:download --platform all

# Or use EAS Submit
eas submit --platform android --profile production
eas submit --platform ios --profile production
```

### Example 4: Hotfix Release

```bash
# 1. Create hotfix branch from main
git checkout -b hotfix/critical-fix main

# 2. Fix the issue and commit
git add .
yarn commit
# Type: fix(auth): resolve login crash on iOS

# 3. Test locally
yarn test
yarn lint

# 4. Merge to main
git checkout main
git merge hotfix/critical-fix

# 5. Create patch release
yarn release
# Select "Patch"

# 6. Push with tags
git push --follow-tags origin main

# 7. Build is triggered automatically
# Distribute to testers for verification

# 8. Merge back to develop
git checkout develop
git merge main
git push origin develop
```

---

## Next Steps

1. ✅ Complete [Prerequisites](#prerequisites)
2. ✅ Follow [Setup Instructions](#setup-instructions)
3. ✅ Test each [Workflow](#workflows)
4. ✅ Review [Best Practices](#best-practices)
5. 📚 Read [EAS Build documentation](https://docs.expo.dev/build/introduction/)
6. 📚 Read [Firebase App Distribution documentation](https://firebase.google.com/docs/app-distribution)
7. 🔒 Review [GitHub Actions security best practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

## Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Self-Hosted Runner Security](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)

---

## Support

If you encounter issues not covered in this guide:

1. Check [Troubleshooting](#troubleshooting) section
2. Review GitHub Actions logs
3. Check EAS Build logs: `eas build:view <BUILD_ID>`
4. Consult Expo Forums: https://forums.expo.dev/
5. Open an issue in this repository

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintained by:** Development Team

