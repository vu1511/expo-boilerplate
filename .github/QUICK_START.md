# 🚀 GitHub Actions CI/CD - Quick Start

Get your CI/CD pipeline running in 10 minutes!

## 📋 Overview

You now have **9 different workflows** at your disposal:

1. ✅ **CI (Automatic)** - Runs on every push/PR
2. 🤖 **Build Android** - Manual
3. 🍎 **Build iOS** - Manual
4. 📱 **Build Both** - Manual
5. 🤖📤 **Build & Deploy Android** - Manual
6. 🍎📤 **Build & Deploy iOS** - Manual
7. 📱📤 **Build & Deploy Both** - Manual
8. 📤 **Deploy Android** - Manual (existing builds)
9. 📤 **Deploy iOS** - Manual (existing builds)
10. 🔄 **Auto-Deploy Staging** - Automatic on `main` push

---

## ⚡ 5-Minute Setup

### Step 1: Get Required Tokens (2 minutes)

```bash
# 1. Get Expo token
npx eas login
cat ~/.expo/state.json | jq -r '.auth.sessionSecret'

# 2. Get Firebase token
npm install -g firebase-tools
firebase login:ci

# Save these tokens, you'll need them in Step 3
```

### Step 2: Prepare Keys Files (1 minute)

You should already have these from local development:

- `keys.development.json`
- `keys.staging.json`
- `keys.production.json`

Make sure each includes Firebase App IDs:

```json
{
  "public": {
    "FIREBASE_ANDROID_APP_ID": "1:123:android:abc",
    "FIREBASE_IOS_APP_ID": "1:123:ios:def",
    "FIREBASE_GROUP": "testers"
  }
}
```

### Step 3: Add Secrets to GitHub (2 minutes)

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these 5 secrets:

| Name                    | Value                                 |
| ----------------------- | ------------------------------------- |
| `EXPO_TOKEN`            | Token from Step 1                     |
| `FIREBASE_TOKEN`        | Token from Step 1                     |
| `KEYS_FILE_DEVELOPMENT` | Full content of keys.development.json |
| `KEYS_FILE_STAGING`     | Full content of keys.staging.json     |
| `KEYS_FILE_PRODUCTION`  | Full content of keys.production.json  |

**Quick add via CLI**:

```bash
gh secret set EXPO_TOKEN --body "your-expo-token"
gh secret set FIREBASE_TOKEN --body "your-firebase-token"
gh secret set KEYS_FILE_DEVELOPMENT < keys.development.json
gh secret set KEYS_FILE_STAGING < keys.staging.json
gh secret set KEYS_FILE_PRODUCTION < keys.production.json
```

---

## ✅ Verify Setup

### Test Your First Build

1. Go to **Actions** tab in your GitHub repository
2. Click **Build & Deploy** workflow
3. Click **Run workflow**
4. Select:
   - Workflow type: `build-android`
   - Profile: `development`
5. Click **Run workflow**

If successful, you're all set! 🎉

---

## 📖 Common Workflows

### Scenario 1: Push to Main (Staging Auto-Deploy)

```bash
git checkout main
git merge feature/my-feature
git push origin main
```

**What happens**:

1. ✅ Runs linting, formatting, tests
2. 🏗️ Builds Android & iOS (staging) in parallel
3. 📤 Deploys to Firebase App Distribution in parallel
4. 📧 Testers get notified automatically

### Scenario 2: Manual Development Build

1. Go to **Actions** → **Build & Deploy**
2. Select:
   - `build-deploy-android`
   - `development`
   - Add release notes (optional)
3. Run workflow

### Scenario 3: Production Release

1. Go to **Actions** → **Build & Deploy**
2. Select:
   - `build-deploy-both`
   - `production`
   - Add release notes
3. Run workflow
4. Builds are submitted to stores automatically
5. Add release notes manually in App Store Connect / Play Console

### Scenario 4: Deploy Existing Build

Already have a build artifact from a previous run?

1. Go to **Actions** → **Build & Deploy**
2. Select:
   - `deploy-android` (or ios/both)
   - Choose profile
3. Run workflow

---

## 🎯 Workflow Decision Tree

```
Need to build?
├─ Yes
│  ├─ Which platform?
│  │  ├─ Android → build-android
│  │  ├─ iOS → build-ios
│  │  └─ Both → build-both
│  │
│  └─ Need to deploy too?
│     └─ Yes → build-deploy-{platform}
│
└─ No (already built)
   └─ deploy-{platform}

Special cases:
├─ Just merged to main? → Auto-deploys staging automatically
├─ Testing code quality? → CI runs automatically
└─ Production release? → Use build-deploy-both with production profile
```

---

## 🔧 Configuration

### Use Self-Hosted Runner

If you have a self-hosted runner configured:

1. Run workflow with **"Use local runner"** checked
2. Benefits:
   - Faster builds (local caching)
   - No GitHub Actions minute costs
   - Full control over build environment

### Customize Auto-Deploy

Edit `.github/workflows/auto-deploy-main.yml`:

```yaml
# Change profile (default: staging)
profile: 'production' # or 'development'

# Change branch (default: main)
branches:
  - main
  - develop # Add more branches

# Change release notes
release-notes: 'Custom message'
```

### Change Build Numbers

Build numbers auto-increment from `github.run_number`. To customize:

```yaml
# In build-reusable.yml
BUILD_NUMBER: ${{ github.run_number }}  # Current
BUILD_NUMBER: ${{ github.run_id }}     # Alternative: unique ID
BUILD_NUMBER: "1.0.${{ github.run_number }}"  # With prefix
```

---

## 🎨 GitHub Actions Minutes Cost

### Free Tier Limits

- **Public repos**: Unlimited ✨
- **Private repos**: 2,000 minutes/month

### Cost per Workflow

| Workflow      | Platform | Runner        | Minutes Used | Multiplier | Cost    |
| ------------- | -------- | ------------- | ------------ | ---------- | ------- |
| CI            | Linux    | ubuntu-latest | ~3 min       | 1x         | 3 min   |
| Build Android | Linux    | ubuntu-latest | ~15 min      | 1x         | 15 min  |
| Build iOS     | macOS    | macos-14      | ~20 min      | 10x        | 200 min |
| Build Both    | Both     | Both          | ~20 min      | Mixed      | 215 min |
| Deploy        | Linux    | ubuntu-latest | ~5 min       | 1x         | 5 min   |

### Cost Optimization Tips

1. **Use local runner** for development builds (free)
2. **Only use cloud** for staging/production
3. **Android is cheaper** (1x vs 10x)
4. **Cache dependencies** (already configured)
5. **Skip CI** on docs changes (already configured)

**Monthly estimate** (private repo):

- 10 feature branches/week: ~30 min CI
- 5 dev builds/week: ~75 min
- 2 staging auto-deploys/week: ~430 min (includes iOS)
- 1 prod release/month: ~220 min

**Total**: ~755 min/month (within free tier) ✅

---

## 📊 Monitoring

### View Build Status

**GitHub UI**:

- Actions tab → Select workflow → View runs
- Badge on README (optional)
- Email notifications (Settings → Notifications)

**Status Badge** (add to README.md):

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Build](https://github.com/username/repo/workflows/Build%20%26%20Deploy/badge.svg)
```

### Build Artifacts

All builds are saved for 30 days:

- Actions → Select run → Artifacts section
- Download: `android-{profile}-{build-number}`
- Download: `ios-{profile}-{build-number}`

### Firebase App Distribution

View deployments:

- [Firebase Console](https://console.firebase.google.com)
- App Distribution → Releases

---

## 🐛 Troubleshooting

### Build Fails: "Not authenticated"

```bash
# Fix: Get new Expo token
npx eas login
cat ~/.expo/state.json | jq -r '.auth.sessionSecret'

# Update GitHub secret
gh secret set EXPO_TOKEN --body "new-token"
```

### Deploy Fails: "Firebase App ID not found"

Add to your keys file:

```json
{
  "public": {
    "FIREBASE_ANDROID_APP_ID": "1:123:android:abc",
    "FIREBASE_IOS_APP_ID": "1:123:ios:def"
  }
}
```

Then update the GitHub secret:

```bash
gh secret set KEYS_FILE_STAGING < keys.staging.json
```

### iOS Build Slow/Expensive

Options:

1. Use self-hosted Mac runner (free)
2. Build iOS less frequently
3. Use simulator builds for development
4. Only cloud-build staging/production

---

## 📚 Learn More

- **[Full Documentation](.github/workflows/README.md)** - Complete guide
- **[Secrets Setup](.github/SECRETS_SETUP.md)** - Detailed secret configuration
- **[Environments](.github/ENVIRONMENTS.md)** - Environment variables reference
- **[Local Build](../docs/LOCAL_BUILD.md)** - Local build guide

---

## 🎉 Success Checklist

- [ ] All 5 secrets added to GitHub
- [ ] First test build succeeded
- [ ] Auto-deploy works on main push
- [ ] Firebase deployments working
- [ ] Team has access to workflows
- [ ] Production build tested (optional)
- [ ] Store submission tested (optional)

---

## 🚀 Next Steps

1. **Set up branch protection**:
   - Settings → Branches → Add rule
   - Require CI to pass before merge

2. **Configure notifications**:
   - Settings → Notifications
   - Get emails on workflow failures

3. **Add team members**:
   - Settings → Collaborators
   - Grant appropriate access

4. **Create release workflow**:
   - Tag commits: `git tag v1.0.0`
   - Auto-trigger production builds on tags (optional)

5. **Monitor usage**:
   - Settings → Actions → Usage
   - Track GitHub Actions minutes

---

## 💡 Pro Tips

1. **Use draft PRs** to trigger CI without notifying everyone
2. **Cancel running workflows** if you push again (saves minutes)
3. **Download artifacts** before they expire (30 days)
4. **Use staging extensively** before production releases
5. **Keep tokens secure** - rotate every 90 days
6. **Tag production releases** for easier tracking
7. **Monitor Firebase testers** - ensure they receive builds

---

## 🆘 Need Help?

1. Check [Troubleshooting](#troubleshooting) section
2. Review workflow logs in Actions tab
3. Read full documentation in `.github/workflows/README.md`
4. Check Expo status: https://status.expo.dev/
5. Open an issue in the repository

---

**You're all set! Happy building! 🚀**
