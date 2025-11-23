# GitHub Secrets Setup Guide

Quick reference for configuring GitHub Actions secrets.

## 📋 Required Secrets Checklist

### ✅ Essential Secrets (Required)

- [ ] `EXPO_TOKEN` - Expo authentication token
- [ ] `KEYS_FILE_DEVELOPMENT` - Development environment keys
- [ ] `KEYS_FILE_STAGING` - Staging environment keys
- [ ] `KEYS_FILE_PRODUCTION` - Production environment keys
- [ ] `FIREBASE_TOKEN` - Firebase CI token (for dev/staging)

### 🔧 Optional Secrets

- [ ] `CODECOV_TOKEN` - Code coverage reporting

**Note**: Store credentials (Google Play, App Store) are configured in Expo dashboard using `eas credentials`, not GitHub secrets.

---

## 🚀 Setup Commands

### 1. Get Expo Token

```bash
# Login to Expo
npx eas login

# Get token from state file
cat ~/.expo/state.json | jq -r '.auth.sessionSecret'

# Or create a new token in Expo dashboard
# https://expo.dev/accounts/[account]/settings/access-tokens
```

**Add to GitHub**:

- Name: `EXPO_TOKEN`
- Value: `your-expo-token-here`

---

### 2. Get Firebase Token

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login and get CI token
firebase login:ci
```

**Add to GitHub**:

- Name: `FIREBASE_TOKEN`
- Value: `your-firebase-token-here`

---

### 3. Prepare Keys Files

For each profile (development, staging, production):

```bash
# View your keys file
cat keys.development.json

# Copy to clipboard (macOS)
cat keys.development.json | pbcopy

# Copy to clipboard (Linux)
cat keys.development.json | xclip -selection clipboard
```

**Keys File Format**:

```json
{
  "public": {
    "APP_NAME": "MyApp Dev",
    "BUNDLE_ID": "com.company.app.dev",
    "PACKAGE_NAME": "com.company.app.dev",
    "FIREBASE_ANDROID_APP_ID": "1:123456789:android:abcdef123456",
    "FIREBASE_IOS_APP_ID": "1:123456789:ios:abcdef123456",
    "FIREBASE_GROUP": "testers",
    "API_URL": "https://api-dev.example.com"
  },
  "private": {
    "API_KEY": "your-private-api-key"
  }
}
```

**Add to GitHub**:

- Name: `KEYS_FILE_DEVELOPMENT`
- Value: `{entire-json-content}`

Repeat for `KEYS_FILE_STAGING` and `KEYS_FILE_PRODUCTION`.

---

## 🔑 How to Add Secrets to GitHub

### Via Web UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter secret name and value
5. Click **Add secret**

### Via GitHub CLI

```bash
# Install GitHub CLI if needed
brew install gh  # macOS
# or apt install gh  # Linux

# Login
gh auth login

# Add secrets
gh secret set EXPO_TOKEN < expo-token.txt
gh secret set FIREBASE_TOKEN < firebase-token.txt

# Add keys file (from file)
gh secret set KEYS_FILE_DEVELOPMENT < keys.development.json

# Add keys file (inline)
gh secret set KEYS_FILE_STAGING --body "$(cat keys.staging.json)"
```

---

## 📝 Firebase App IDs Setup

### Get Firebase App IDs

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project settings** (gear icon)
4. Scroll to **Your apps** section
5. For each app (Android/iOS):
   - Click the app
   - Copy the **App ID** (format: `1:123456789:android:abc123` or `1:123456789:ios:def456`)

### Add to Keys Files

Update each keys file with Firebase App IDs:

```json
{
  "public": {
    "FIREBASE_ANDROID_APP_ID": "1:123456789:android:abc123",
    "FIREBASE_IOS_APP_ID": "1:123456789:ios:def456",
    "FIREBASE_GROUP": "testers"
  }
}
```

### Create Tester Group

1. Go to Firebase Console → **App Distribution**
2. Click **Testers & Groups** tab
3. Click **Add Group**
4. Name: `testers` (or customize in keys file)
5. Add tester emails

---

## 🏪 Production Store Setup (Optional)

### Google Play (Android)

1. Go to [Google Play Console](https://play.google.com/console)
2. **Setup** → **API access**
3. Click **Create new service account**
4. Follow the wizard
5. **Grant access** to the service account
6. Download the JSON key file

**Add to Expo** (required - not GitHub secrets):

```bash
# Upload to Expo
eas credentials
# Select: Android → Production → Google Service Account
# Upload the JSON file
```

### App Store (iOS)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **Users and Access** → **Keys** tab
3. Click **+** to create new key
4. Name: "EAS Submit" (or similar)
5. Access: **App Manager**
6. Download the `.p8` key file
7. Note the **Key ID** and **Issuer ID**

**Add to Expo** (required):

```bash
# Upload to Expo
eas credentials
# Select: iOS → Production → App Store Connect API Key
# Provide Key ID, Issuer ID, and upload .p8 file
```

---

## ✅ Verify Setup

### Check Secrets

```bash
# List all secrets (names only, not values)
gh secret list

# Expected output:
# EXPO_TOKEN
# FIREBASE_TOKEN
# KEYS_FILE_DEVELOPMENT
# KEYS_FILE_STAGING
# KEYS_FILE_PRODUCTION
```

### Test Build

1. Go to **Actions** tab
2. Select **Build & Deploy** workflow
3. Click **Run workflow**
4. Choose:
   - Workflow: `build-android`
   - Profile: `development`
5. Click **Run workflow**

If it succeeds, your setup is correct! ✅

---

## 🔒 Security Best Practices

1. **Never commit secrets to git**

   ```bash
   # Add to .gitignore
   echo "keys.*.json" >> .gitignore
   echo "!keys.example.json" >> .gitignore
   ```

2. **Rotate tokens regularly**
   - Expo tokens: Every 90 days
   - Firebase tokens: Every 90 days
   - Store credentials: As needed

3. **Use environment-specific secrets**
   - Different Firebase projects for dev/staging/prod
   - Different bundle IDs
   - Different API keys

4. **Limit token permissions**
   - Firebase: Only App Distribution permission
   - Google Play: Only Release Manager permission
   - App Store: Only App Manager permission

5. **Audit access**
   - Review who has access to secrets
   - Remove access for former team members
   - Use team-specific tokens

---

## 🆘 Troubleshooting

### "Invalid EXPO_TOKEN"

```bash
# Generate a new token
npx eas login
npx eas whoami
cat ~/.expo/state.json | jq -r '.auth.sessionSecret'

# Update in GitHub secrets
gh secret set EXPO_TOKEN --body "your-new-token"
```

### "Firebase authentication failed"

```bash
# Generate a new token
firebase logout
firebase login:ci

# Update in GitHub secrets
gh secret set FIREBASE_TOKEN --body "your-new-token"
```

### "Keys file is invalid JSON"

```bash
# Validate JSON
cat keys.development.json | jq .

# If valid, copy exactly as-is (including newlines)
cat keys.development.json | gh secret set KEYS_FILE_DEVELOPMENT
```

### "Firebase App ID not found"

Make sure your keys file includes:

```json
{
  "public": {
    "FIREBASE_ANDROID_APP_ID": "1:123456789:android:abc",
    "FIREBASE_IOS_APP_ID": "1:123456789:ios:def"
  }
}
```

---

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Expo Authentication](https://docs.expo.dev/accounts/programmatic-access/)
- [Firebase CI](https://firebase.google.com/docs/cli#cli-ci-systems)
- [EAS Credentials](https://docs.expo.dev/app-signing/app-credentials/)
- [Google Play Service Account](https://docs.expo.dev/submit/android/#google-play-service-account)
- [App Store Connect API](https://docs.expo.dev/submit/ios/#app-store-connect-api)

---

## 🎯 Quick Start Checklist

For a new project, follow these steps in order:

1. [ ] Create Expo account and login: `npx eas login`
2. [ ] Configure EAS: `npx eas build:configure`
3. [ ] Get Expo token: `cat ~/.expo/state.json | jq -r '.auth.sessionSecret'`
4. [ ] Setup Firebase project and App Distribution
5. [ ] Get Firebase token: `firebase login:ci`
6. [ ] Create keys files for each environment
7. [ ] Add Firebase App IDs to keys files
8. [ ] Add all secrets to GitHub
9. [ ] Run test build: Actions → Build & Deploy
10. [ ] Verify deployment works

Done! Your CI/CD is ready! 🚀
