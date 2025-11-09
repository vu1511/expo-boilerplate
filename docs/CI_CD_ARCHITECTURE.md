# CI/CD Architecture Overview

Visual reference guide for the CI/CD pipeline architecture.

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         DEVELOPER                                 │
│                                                                    │
│  • Write code with conventional commits                           │
│  • Create PR or push to main/develop                             │
│  • Trigger manual builds when needed                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ git push / PR
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                      GITHUB REPOSITORY                            │
│                                                                    │
│  • Source code (main, develop, feature branches)                 │
│  • GitHub Actions workflows (.github/workflows/*.yml)            │
│  • Secrets (tokens, credentials, keys)                           │
│  • Branch protection rules                                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ trigger workflows
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│            GITHUB ACTIONS (Self-Hosted Runner)                    │
│                    Your Mac / Local Machine                       │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Workflow 1: ci.yml (on every push/PR)                 │     │
│  │  ─────────────────────────────────────────────────     │     │
│  │  • Checkout code                                        │     │
│  │  • Install dependencies (yarn)                          │     │
│  │  • Run ESLint                                           │     │
│  │  • Run Jest tests + coverage                            │     │
│  │  • TypeScript type checking                             │     │
│  │  • Validate commit messages                             │     │
│  │  • Security audit                                        │     │
│  │  Duration: ~3-5 minutes                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Workflow 2: build-preview.yml (develop branch)        │     │
│  │  ─────────────────────────────────────────────────     │     │
│  │  • Checkout code                                        │     │
│  │  • Setup EAS CLI                                        │     │
│  │  • Decrypt environment keys                             │     │
│  │  • Trigger EAS Build (staging profile)                 │     │
│  │  Duration: ~2 minutes (queue only)                     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Workflow 3: build-and-distribute.yml (tags/manual)    │     │
│  │  ─────────────────────────────────────────────────     │     │
│  │  • Checkout code                                        │     │
│  │  • Setup EAS CLI                                        │     │
│  │  • Decrypt environment keys                             │     │
│  │  • Trigger EAS Build (production/staging)              │     │
│  │  • Wait for builds to complete                         │     │
│  │  • Download APK/IPA                                     │     │
│  │  • Upload to Firebase App Distribution                 │     │
│  │  • Extract release notes from CHANGELOG                │     │
│  │  Duration: ~25-35 minutes                              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Workflow 4: release.yml (manual only)                 │     │
│  │  ─────────────────────────────────────────────────     │     │
│  │  • Run standard-version                                 │     │
│  │  • Update package.json version                          │     │
│  │  • Generate/update CHANGELOG.md                         │     │
│  │  • Create git commit + tag                              │     │
│  │  • Push to repository                                   │     │
│  │  • Create GitHub Release                                │     │
│  │  Duration: ~2 minutes                                   │     │
│  └────────────────────────────────────────────────────────┘     │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ trigger build
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                  EAS BUILD (Expo Cloud Builders)                  │
│                                                                    │
│  ┌──────────────────────────┐   ┌──────────────────────────┐   │
│  │   iOS Builder (macOS)    │   │  Android Builder (Ubuntu) │   │
│  │   ─────────────────────  │   │  ──────────────────────── │   │
│  │   • Checkout code         │   │  • Checkout code          │   │
│  │   • Install dependencies  │   │  • Install dependencies   │   │
│  │   • Load environment keys │   │  • Load environment keys  │   │
│  │   • Resolve dependencies  │   │  • Resolve dependencies   │   │
│  │   • Run pod install       │   │  • Run Gradle build       │   │
│  │   • Build IPA             │   │  • Build APK/AAB          │   │
│  │   • Sign with certificate │   │  • Sign with keystore     │   │
│  │   • Upload to Expo CDN    │   │  • Upload to Expo CDN     │   │
│  │   Duration: ~15-20 min    │   │  Duration: ~10-15 min     │   │
│  └──────────────────────────┘   └──────────────────────────┘   │
│                                                                    │
│  Builds run in parallel ⚡                                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ download artifacts
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│            GITHUB ACTIONS (continued from above)                  │
│                                                                    │
│  • Download APK from EAS                                          │
│  • Download IPA from EAS                                          │
│  • Prepare release notes from CHANGELOG                           │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ upload builds
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│              FIREBASE APP DISTRIBUTION                            │
│                                                                    │
│  • Receive APK (Android)                                          │
│  • Receive IPA (iOS)                                              │
│  • Store builds                                                   │
│  • Send email notifications to testers                            │
│  • Provide download links                                         │
│  • Track installs and crashes                                     │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ email notification
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                          TESTERS                                  │
│                                                                    │
│  • Receive email: "New build available"                           │
│  • Click download link                                            │
│  • Install on device (Android/iOS)                                │
│  • Test and provide feedback                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Triggers

### Automatic Triggers

```
Push to main/develop
    │
    ├─► ci.yml (always)
    │   └─► Lint + Test + Type Check
    │
    └─► IF branch == develop
        └─► build-preview.yml
            └─► EAS Build (staging)

Push tag v*.*.*
    │
    └─► build-and-distribute.yml
        ├─► EAS Build (production)
        └─► Firebase App Distribution

Pull Request
    │
    └─► ci.yml
        ├─► Lint + Test
        └─► Validate commits
```

### Manual Triggers

```
GitHub Actions UI
    │
    ├─► release.yml
    │   └─► Create version release
    │       ├─► Update CHANGELOG
    │       ├─► Create git tag
    │       └─► Push to repo
    │
    ├─► build-preview.yml
    │   └─► Build specific profile
    │       └─► Select platform
    │
    └─► build-and-distribute.yml
        └─► Build + distribute
            ├─► Select platform
            ├─► Select profile
            └─► Choose to distribute
```

---

## 🗂️ File Structure

```
expo-boilerplate/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # ✅ Lint, test, type check
│   │   ├── build-preview.yml         # 🏗️ Preview builds
│   │   ├── build-and-distribute.yml  # 🚀 Production builds
│   │   └── release.yml               # 📦 Release automation
│   │
│   └── PULL_REQUEST_TEMPLATE.md      # PR template
│
├── docs/
│   ├── CI_CD.md                      # 📚 Complete guide
│   ├── CI_CD_QUICKSTART.md           # ⚡ Quick start
│   ├── CI_CD_ARCHITECTURE.md         # 🏗️ This file
│   ├── ENVIRONMENT.md                # 🔐 Environment guide
│   ├── VERSION_MANAGEMENT.md         # 📦 Version guide
│   └── ARCHITECTURE.md               # 🏛️ Project architecture
│
├── scripts/
│   ├── decrypt-keys.js               # 🔓 Decrypt env keys
│   ├── release-interactive.js        # 📦 Interactive release
│   └── env-manager.js                # 🔐 Env management
│
├── config/
│   └── encrypted/
│       ├── keys.development.json.gpg # 🔒 Dev keys (encrypted)
│       ├── keys.staging.json.gpg     # 🔒 Staging keys (encrypted)
│       └── keys.production.json.gpg  # 🔒 Prod keys (encrypted)
│
├── eas.json                          # ⚙️ EAS Build config
├── package.json                      # 📦 Dependencies + scripts
├── app.config.ts                     # ⚙️ Expo config
└── commitlint.config.js              # ✅ Commit validation
```

---

## 🔐 Secrets Flow

### Build-Time Secrets

```
GitHub Secrets (Repository Settings)
    │
    ├─► EXPO_TOKEN
    │   └─► Used by: EAS CLI for authentication
    │
    ├─► GPG_PASSPHRASE
    │   └─► Used by: decrypt-keys.js
    │       └─► Decrypts: keys.*.json.gpg
    │           └─► Produces: keys.*.json
    │               └─► Used by: app.config.ts
    │                   └─► Embedded in: Native app
    │
    ├─► FIREBASE_ANDROID_APP_ID
    │   └─► Used by: Firebase Distribution action
    │
    ├─► FIREBASE_IOS_APP_ID
    │   └─► Used by: Firebase Distribution action
    │
    └─► FIREBASE_SERVICE_ACCOUNT
        └─► Used by: Firebase Distribution action
```

### Secret Storage Layers

```
Layer 1: GitHub Secrets
    ↓
Layer 2: GPG-encrypted files (keys.*.json.gpg)
    ↓ (decrypted in CI)
Layer 3: Plain JSON files (keys.*.json) - temporary, gitignored
    ↓ (read by app.config.ts)
Layer 4: Environment variables in app (keys.APP_NAME, keys.API_KEY, etc.)
    ↓
Layer 5: Native app binary (embedded at build time)
```

---

## 📊 Build Profiles

### EAS Build Profiles (eas.json)

```
development
    ├─► Platform: iOS (simulator) + Android (APK)
    ├─► Environment: keys.development.json
    ├─► Distribution: internal
    ├─► Purpose: Local development testing
    └─► Build time: ~10-15 min

staging
    ├─► Platform: iOS (device) + Android (APK)
    ├─► Environment: keys.staging.json
    ├─► Distribution: internal (Firebase App Distribution)
    ├─► Purpose: QA and tester validation
    └─► Build time: ~15-20 min

production
    ├─► Platform: iOS (IPA) + Android (AAB)
    ├─► Environment: keys.production.json
    ├─► Distribution: store (App Store + Play Store)
    ├─► Purpose: Production release
    └─► Build time: ~20-25 min

preview
    ├─► Platform: iOS (device) + Android (APK)
    ├─► Environment: keys.staging.json
    ├─► Distribution: internal
    ├─► Purpose: Quick test builds
    └─► Build time: ~10-15 min
```

---

## 🚦 CI/CD Decision Tree

### When code is pushed:

```
START: Code pushed to GitHub
    │
    ├─► Is it a PR?
    │   ├─► YES
    │   │   └─► Run ci.yml
    │   │       ├─► Lint ✓
    │   │       ├─► Test ✓
    │   │       ├─► Type check ✓
    │   │       └─► Validate commits ✓
    │   │
    │   └─► NO
    │       └─► Continue...
    │
    ├─► Is branch == develop?
    │   ├─► YES
    │   │   └─► Run build-preview.yml
    │   │       └─► Build staging
    │   │
    │   └─► NO
    │       └─► Continue...
    │
    ├─► Is branch == main?
    │   ├─► YES
    │   │   └─► Run ci.yml only
    │   │
    │   └─► NO
    │       └─► Run ci.yml only
    │
    └─► Is tag pushed (v*.*.*)? 
        ├─► YES
        │   └─► Run build-and-distribute.yml
        │       ├─► Build production
        │       └─► Distribute to Firebase
        │
        └─► NO
            └─► END
```

---

## ⚡ Performance Optimization

### Caching Strategy

```
Self-Hosted Runner (Your Mac)
    │
    ├─► Yarn cache (~/.cache/yarn)
    │   └─► Speeds up: yarn install (2x faster)
    │
    ├─► Node modules cache (node_modules/)
    │   └─► Reused across CI runs
    │
    └─► Build cache (android/build/, ios/build/)
        └─► Cleaned periodically

GitHub Actions Cache
    │
    └─► Node.js cache (setup-node@v4 with cache: 'yarn')
        └─► Automatically managed

EAS Build Cache
    │
    ├─► Gradle cache (Android)
    │   └─► Reused across builds
    │
    └─► CocoaPods cache (iOS)
        └─► Reused across builds
```

### Parallel Execution

```
CI Workflow (ci.yml)
    │
    ├─► Job 1: lint-and-test
    │   └─► Duration: ~3 min
    │
    └─► Job 2: type-check
        └─► Duration: ~2 min
        
        Both run in PARALLEL ⚡

EAS Build
    │
    ├─► iOS Build
    │   └─► Duration: ~15 min
    │
    └─► Android Build
        └─► Duration: ~10 min
        
        Both run in PARALLEL ⚡
```

---

## 🎯 Version Management Flow

```
Developer runs: yarn release
    │
    ├─► Interactive prompt
    │   ├─► Auto-detect (from commits)
    │   ├─► Patch (1.0.0 → 1.0.1)
    │   ├─► Minor (1.0.0 → 1.1.0)
    │   ├─► Major (1.0.0 → 2.0.0)
    │   └─► Custom (1.0.0 → X.Y.Z)
    │
    └─► standard-version runs
        │
        ├─► Analyze commits (conventional commits)
        │
        ├─► Determine version bump
        │
        ├─► Update package.json
        │   └─► version: "X.Y.Z"
        │
        ├─► Generate CHANGELOG.md
        │   ├─► ## [X.Y.Z] (YYYY-MM-DD)
        │   ├─► ### Features
        │   ├─► ### Bug Fixes
        │   └─► ### Breaking Changes
        │
        ├─► Create git commit
        │   └─► chore(release): vX.Y.Z
        │
        └─► Create git tag
            └─► vX.Y.Z

Developer pushes:
    git push --follow-tags origin main
        │
        └─► Triggers build-and-distribute.yml
            │
            ├─► Reads version from package.json
            ├─► Extracts release notes from CHANGELOG
            ├─► Builds app with version X.Y.Z
            ├─► Includes release notes in Firebase
            └─► Notifies testers
```

---

## 🔄 Complete Release Cycle

```
1. DEVELOPMENT
    Developer writes code
        ├─► Uses conventional commits (yarn commit)
        ├─► Creates PR
        └─► CI validates (lint, test, type check)

2. MERGE TO DEVELOP
    PR approved and merged
        ├─► CI runs again
        ├─► build-preview.yml triggers
        └─► Staging build created
        
3. QA TESTING
    Testers receive Firebase notification
        ├─► Download staging build
        ├─► Test on devices
        └─► Report bugs or approve

4. MERGE TO MAIN
    Develop merged to main
        └─► Ready for release

5. CREATE RELEASE
    Developer runs: yarn release
        ├─► Version bumped
        ├─► CHANGELOG updated
        ├─► Git tag created
        └─► Pushed to GitHub

6. BUILD PRODUCTION
    Tag push triggers workflow
        ├─► EAS builds production
        ├─► Distributes to Firebase
        └─► Testers get final build

7. SUBMIT TO STORES (manual)
    Developer runs: eas submit
        ├─► iOS → App Store Connect
        └─► Android → Google Play Console

8. MONITOR
    Track metrics
        ├─► Firebase Crashlytics
        ├─► App Store/Play Console
        └─► User feedback
```

---

## 💡 Best Practices Summary

### ✅ DO

- Use self-hosted runner with **private repos only**
- Keep runner software **updated**
- **Rotate credentials** regularly
- Use **descriptive commit messages** (conventional commits)
- **Test locally** before pushing
- **Monitor CI/CD logs** for issues
- Use **separate profiles** for dev/staging/prod
- **Encrypt sensitive data** (GPG)
- **Version control workflows** in git

### ❌ DON'T

- Use self-hosted runner with public repos
- Commit unencrypted secrets
- Skip CI checks (force push)
- Hardcode credentials in code
- Use production keys in development
- Ignore failing tests
- Manually edit CHANGELOG (use standard-version)
- Share GPG passphrase insecurely

---

## 📈 Monitoring & Metrics

### What to Monitor

```
GitHub Actions
    ├─► Workflow run duration
    ├─► Success/failure rate
    ├─► Runner disk space
    └─► Runner CPU/memory usage

EAS Build
    ├─► Build queue time
    ├─► Build duration
    ├─► Success rate
    └─► Monthly build count (cost)

Firebase App Distribution
    ├─► Tester install rate
    ├─► Crash reports
    ├─► Feedback submissions
    └─► Distribution success rate
```

### Key Performance Indicators (KPIs)

```
✅ CI Success Rate: >95%
    (failures only from real issues, not infrastructure)

⚡ CI Duration: <5 minutes
    (lint + test + type check)

🏗️ Build Duration: <25 minutes
    (from tag push to Firebase upload)

📧 Tester Adoption: >80%
    (testers who install new builds)

🐛 Build Rejection Rate: <5%
    (builds that fail due to signing/config issues)
```

---

## 🆘 Common Issues & Solutions

### Issue: Runner offline

```
Problem: Workflows queued but not starting
Solution:
    cd ~/actions-runner
    ./svc.sh status
    ./svc.sh start
```

### Issue: EAS build fails

```
Problem: Build fails with "No matching provisioning profile"
Solution:
    eas credentials --platform ios
    # Regenerate profiles
```

### Issue: Firebase upload fails

```
Problem: "App ID not found"
Solution:
    1. Verify FIREBASE_*_APP_ID secrets
    2. Check Firebase Console → App settings
    3. Ensure App Distribution is enabled
```

### Issue: CI passes locally but fails in GitHub

```
Problem: Tests pass on Mac but fail in CI
Solution:
    1. Check Node.js version consistency
    2. Verify dependencies are locked (yarn.lock)
    3. Check environment-specific code
    4. Review GitHub Actions logs
```

---

## 📚 Additional Resources

- **Full Guide**: [docs/CI_CD.md](./CI_CD.md)
- **Quick Start**: [docs/CI_CD_QUICKSTART.md](./CI_CD_QUICKSTART.md)
- **Setup Summary**: [SETUP_SUMMARY.md](../SETUP_SUMMARY.md)
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Firebase**: https://firebase.google.com/docs/app-distribution
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Maintained by:** Development Team

