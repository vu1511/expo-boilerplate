# CI/CD Quick Start Checklist

This is a condensed checklist to get your CI/CD pipeline running. For detailed instructions, see [CI_CD.md](./CI_CD.md).

## ✅ Prerequisites Checklist

### 1. Self-Hosted GitHub Runner ⏱️ 15 min

- [ ] Mac with macOS 11+ (or Linux)
- [ ] 8GB RAM minimum, 50GB free disk space
- [ ] Navigate to GitHub repo → Settings → Actions → Runners → New self-hosted runner
- [ ] Download and configure runner
- [ ] Install as service: `./svc.sh install && ./svc.sh start`
- [ ] Verify runner shows as "Online" in GitHub

### 2. Expo & EAS Setup ⏱️ 10 min

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS (if not done)
eas init

# Test configuration
eas build:configure
```

- [ ] EAS CLI installed
- [ ] Logged into Expo account
- [ ] Project initialized with EAS

### 3. Firebase App Distribution ⏱️ 20 min

- [ ] Create/select Firebase project at https://console.firebase.google.com
- [ ] Add iOS app (bundle ID from `keys.*.json`)
- [ ] Add Android app (package name from `keys.*.json`)
- [ ] Enable App Distribution (Release & Monitor → App Distribution)
- [ ] Create tester group "testers" and add email addresses
- [ ] Generate service account key (Project Settings → Service Accounts → Generate)
- [ ] Save service account JSON securely

### 4. GitHub Secrets ⏱️ 10 min

Go to: **Repository → Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret Name | How to Get | Example |
|-------------|------------|---------|
| `EXPO_TOKEN` | Run `eas whoami` then visit expo.dev to generate token | `abc123...` |
| `EXPO_ACCOUNT_OWNER` | Your Expo username | `yourusername` |
| `EXPO_PROJECT_SLUG` | From app.config or EAS dashboard | `expo-boilerplate` |
| `FIREBASE_ANDROID_APP_ID` | Firebase Console → Project Settings → Android app | `1:123:android:abc` |
| `FIREBASE_IOS_APP_ID` | Firebase Console → Project Settings → iOS app | `1:123:ios:abc` |
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON content from Firebase service account | `{"type":"service_account"...}` |
| `GPG_PASSPHRASE` | Your GPG passphrase for decrypting keys | `your-secret-passphrase` |

**Quick copy-paste template for secrets:**

```bash
# Get Expo token
eas whoami
# Visit the link shown to generate token

# Get Expo account owner
echo "Your Expo username: $(eas whoami)"

# Get Firebase app IDs
# Go to: Firebase Console → Project Settings → General
# Copy "App ID" for iOS and Android apps

# Get service account JSON
# Go to: Firebase Console → Project Settings → Service Accounts
# Click "Generate new private key"
# Copy the entire JSON content
```

---

## 🚀 Quick Test (5 min)

### Test 1: CI Workflow

```bash
# Create a test branch
git checkout -b test/ci-setup

# Make a small change
echo "# CI Test" >> docs/CI_CD_QUICKSTART.md

# Commit with conventional commit
yarn commit
# Select: chore
# Message: test CI pipeline

# Push
git push origin test/ci-setup

# Create PR on GitHub
# Watch CI workflow run in Actions tab
```

**Expected:** ✅ Lint & Test workflow runs successfully

### Test 2: EAS Build

```bash
# Test staging build (Android only, faster)
eas build --platform android --profile staging --non-interactive

# Monitor progress
eas build:list

# This should take ~10-15 minutes
```

**Expected:** ✅ Build completes successfully on EAS

### Test 3: Full CI/CD Pipeline

```bash
# 1. Create a release
yarn release
# Select "Patch"

# 2. Review CHANGELOG.md
cat CHANGELOG.md

# 3. Push with tag
git push --follow-tags origin main

# 4. Monitor workflows in GitHub Actions
# - Release workflow runs
# - Build & Distribute workflow triggers

# 5. Check Firebase App Distribution
# Testers should receive email notification
```

**Expected:**
- ✅ Release workflow creates GitHub release
- ✅ Build workflow completes
- ✅ Builds appear in Firebase App Distribution
- ✅ Testers receive notification email

---

## 📋 Workflow Overview

### Automatic Triggers

| Event | Workflow | What Happens |
|-------|----------|--------------|
| Push to `main`/`develop` | `ci.yml` | Lint, test, type check |
| Push to `develop` | `build-preview.yml` | Build staging version |
| Push tag `v*.*.*` | `build-and-distribute.yml` | Build production & distribute |
| Pull Request | `ci.yml` | Lint, test, validate commits |

### Manual Triggers

| Workflow | When to Use | How to Trigger |
|----------|-------------|----------------|
| `build-preview.yml` | Quick test build | Actions → Build Preview → Run workflow |
| `build-and-distribute.yml` | Release to testers | Actions → Build & Distribute → Run workflow |
| `release.yml` | Create version release | Actions → Release → Run workflow |

---

## 🎯 Typical Workflows

### Feature Development

```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Develop & commit
yarn commit

# 3. Push & create PR
git push origin feature/new-feature

# CI runs automatically ✅
```

### Release to Staging (Testers)

```bash
# 1. Merge to develop
git checkout develop
git pull origin develop

# 2. Create release
yarn release  # Select version type

# 3. Push
git push --follow-tags origin develop

# Builds automatically, testers notified ✅
```

### Production Release

```bash
# 1. Merge develop to main
git checkout main
git merge develop

# 2. Create release
yarn release

# 3. Push with tags
git push --follow-tags origin main

# Production build triggers automatically ✅

# 4. Submit to stores (manual)
eas submit --platform all --profile production
```

---

## 🛠️ Troubleshooting

### Runner Offline

```bash
cd ~/actions-runner
./svc.sh status
./svc.sh start
```

### Build Fails on EAS

```bash
# View detailed logs
eas build:list
eas build:view <BUILD_ID>

# Common fixes:
# - Check eas.json configuration
# - Verify environment secrets
# - Check native dependencies
```

### Firebase Distribution Fails

```bash
# Verify secrets
# Repository → Settings → Secrets → Verify all Firebase secrets

# Check Firebase Console
# Ensure App Distribution is enabled
# Verify app IDs match
```

### CI Tests Fail

```bash
# Run locally first
yarn lint
yarn test
yarn tsc --noEmit

# If passing locally, check:
# - GitHub Actions logs
# - Runner system resources
# - Dependency versions
```

---

## 📚 Next Steps

After completing this quick start:

1. ✅ Read full documentation: [CI_CD.md](./CI_CD.md)
2. ✅ Review security best practices
3. ✅ Set up branch protection rules
4. ✅ Configure team access and permissions
5. ✅ Plan your release schedule
6. ✅ Document team workflows

---

## 🆘 Get Help

- **Full Documentation**: [CI_CD.md](./CI_CD.md)
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Firebase App Distribution**: https://firebase.google.com/docs/app-distribution
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Estimated Total Setup Time:** ~60 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Git, Node.js, Expo account, Firebase account

