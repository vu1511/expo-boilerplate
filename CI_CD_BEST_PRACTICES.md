# CI/CD Best Practices for Expo React Native

> **TL;DR**: Use EAS Build for native builds, self-hosted GitHub Actions for CI, and Firebase App Distribution for tester distribution. This combination provides the best balance of cost, simplicity, and reliability for Expo projects.

---

## 🎯 Executive Summary

### What We Implemented

Your project now has a production-ready CI/CD pipeline:

- ✅ **Automated Testing & Linting** on every push
- ✅ **EAS Build Integration** for iOS & Android
- ✅ **Firebase App Distribution** for testers
- ✅ **Self-Hosted Runner** for cost savings
- ✅ **Version Management** with conventional commits
- ✅ **Automated Releases** with changelog generation

### Why This Architecture?

| Decision | Rationale | Alternative Considered |
|----------|-----------|----------------------|
| **EAS Build** | Native Expo integration, handles code signing, build iOS without Mac | Fastlane (more complex for Expo) |
| **Self-Hosted Runner** | Free CI minutes, faster with local cache | GitHub-hosted (costs money) |
| **Firebase App Distribution** | Free, easy tester management, crash tracking | TestFlight (iOS only), HockeyApp (deprecated) |

---

## 📐 Architecture Principles

### 1. Separation of Concerns

```
Self-Hosted Runner (Your Mac)
  ↓
  Handles: Lint, Test, Type Check
  Why: Fast, free, low resource usage
  
EAS Build (Expo Cloud)
  ↓
  Handles: iOS/Android builds
  Why: Requires native tooling, code signing, heavy compute
  
Firebase App Distribution
  ↓
  Handles: Distribution, notifications
  Why: Specialized service, free, integrated analytics
```

**Principle**: Run fast, cheap operations locally; offload heavy, specialized work to cloud services.

### 2. Security Layers

```
Layer 1: GitHub Repository Secrets
  ├─► EXPO_TOKEN (for EAS authentication)
  ├─► FIREBASE_* (for distribution)
  └─► GPG_PASSPHRASE (for decrypting env keys)

Layer 2: GPG-Encrypted Files (committed to repo)
  ├─► config/encrypted/keys.development.json.gpg
  ├─► config/encrypted/keys.staging.json.gpg
  └─► config/encrypted/keys.production.json.gpg

Layer 3: Decrypted Files (temporary, gitignored)
  ├─► keys.development.json (local dev)
  ├─► keys.staging.json (CI only)
  └─► keys.production.json (CI only)

Layer 4: Runtime Environment Variables
  └─► Embedded in native app at build time
```

**Principle**: Defense in depth - multiple security layers, no single point of failure.

### 3. Cost Optimization

```
FREE:
├─► GitHub Actions (self-hosted: unlimited minutes)
├─► Firebase App Distribution (unlimited apps/testers)
└─► EAS Build (30 builds/month on free tier)

PAID (if needed):
└─► EAS Build Priority ($29/month for unlimited builds)
```

**Principle**: Maximize free tiers, pay only for what you need.

---

## 🏆 Best Practices by Category

### A. Code Quality & Testing

#### 1. Conventional Commits ✅

```bash
# GOOD ✅
git commit -m "feat(auth): add biometric authentication"
git commit -m "fix(api): handle network timeout errors"
git commit -m "docs(readme): update installation instructions"

# BAD ❌
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "updates"
```

**Why**: Enables automated changelog generation and version bumping.

**Implementation**:
- Use `yarn commit` for interactive commit helper
- Enforced by `commitlint` in pre-commit hook
- Validated in CI for pull requests

#### 2. Automated Testing ✅

```yaml
# ci.yml runs on every push/PR:
- Lint (ESLint)
- Tests (Jest with coverage)
- Type checking (TypeScript)
- Commit validation (commitlint)
```

**Why**: Catch issues before they reach production.

**Best Practice**:
- Maintain >80% test coverage
- Write tests before fixing bugs
- Use meaningful test descriptions
- Run tests locally before pushing

#### 3. Branch Protection ⚠️

```
Main branch should:
├─► Require PR reviews
├─► Require CI passing
├─► Prevent force pushes
└─► Require up-to-date branches
```

**Setup**: GitHub → Settings → Branches → Add rule

---

### B. Build & Deployment

#### 1. EAS Build Profiles ✅

```json
{
  "development": {
    "distribution": "internal",
    "android": { "buildType": "apk" },
    "ios": { "simulator": true }
  },
  "staging": {
    "distribution": "internal",
    "android": { "buildType": "apk" },
    "ios": { "simulator": false }
  },
  "production": {
    "distribution": "store",
    "android": { "buildType": "aab" },
    "ios": { "simulator": false }
  }
}
```

**Why**:
- `development`: Fast local testing (simulator only)
- `staging`: QA validation (real devices)
- `production`: Store submission (optimized builds)

**Best Practice**:
- Use APK for staging (faster builds, easier distribution)
- Use AAB for production (required by Play Store)
- Keep separate credentials for each environment

#### 2. Version Management ✅

```bash
# Single source of truth
package.json → version: "1.0.0"

# Auto-increment build numbers
app.config.ts → buildNumber: Math.floor(Date.now() / 1000)
```

**Why**:
- Package.json is standard across all projects
- Timestamp-based build numbers never conflict
- No manual version syncing needed

**Best Practice**:
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Let `standard-version` handle version bumps
- Tag releases consistently (`v1.0.0` format)

#### 3. Release Workflow ✅

```
1. Development
   ├─► Feature branches
   ├─► Conventional commits
   └─► CI validates

2. Merge to develop
   ├─► CI runs
   └─► build-preview.yml triggers

3. QA Testing
   ├─► Testers get Firebase notification
   └─► Validate on staging

4. Release
   ├─► yarn release (interactive)
   ├─► CHANGELOG auto-updated
   └─► Git tag created

5. Deploy
   ├─► Push tag
   ├─► EAS builds
   └─► Firebase distributes

6. Submit to stores (manual)
   └─► eas submit
```

**Best Practice**:
- Never skip stages (dev → staging → prod)
- Always test on staging before production
- Keep release notes detailed and clear
- Notify team before production releases

---

### C. Security

#### 1. Self-Hosted Runner Security 🔒

```
✅ DO:
├─► Use only with PRIVATE repositories
├─► Run as dedicated user (not admin)
├─► Keep runner software updated
├─► Monitor runner logs
├─► Restrict network access (firewall)
└─► Use runner groups for access control

❌ DON'T:
├─► Use with public repos (security risk!)
├─► Run as root/administrator
├─► Share runner across projects
├─► Ignore security updates
└─► Allow unrestricted network access
```

**Why**: Public repos can execute malicious code on your machine.

**Critical**: If you must use public repos, use GitHub-hosted runners instead.

#### 2. Secrets Management 🔐

```
GitHub Secrets:
├─► Rotate every 90 days
├─► Use service accounts (not personal)
├─► Minimum permissions (least privilege)
└─► Audit access regularly

GPG Encryption:
├─► Strong passphrase (20+ characters)
├─► Store passphrase in password manager
├─► Share passphrase securely (1Password, etc.)
└─► Re-encrypt if passphrase compromised
```

**Best Practice**:
- Never commit unencrypted secrets
- Use different credentials per environment
- Revoke compromised credentials immediately
- Document secret rotation procedures

#### 3. Code Signing 🔏

```
iOS:
├─► Let EAS manage certificates
├─► Use App Store Connect API key
├─► Separate profiles per environment
└─► Store in EAS secure storage

Android:
├─► Let EAS manage keystores
├─► Backup keystore securely (encrypted)
├─► Never commit keystore to git
└─► Document keystore recovery process
```

**Critical**: Losing Android keystore = can't update app!

---

### D. Performance

#### 1. CI Performance ⚡

```yaml
Optimization strategies:
├─► Cache dependencies (yarn cache)
├─► Parallel jobs (lint + type-check)
├─► Conditional execution (skip on docs changes)
└─► Fast feedback (fail fast on errors)
```

**Best Practice**:
```yaml
# Skip CI on documentation-only changes
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

#### 2. Build Performance 🏗️

```
EAS Build optimizations:
├─► Use appropriate profiles (APK vs AAB)
├─► Cache enabled by default
├─► Parallel iOS + Android builds
└─► Monitor build times (optimize slow builds)
```

**Best Practice**:
- Use `--local` flag for testing (faster iteration)
- Profile builds to identify bottlenecks
- Keep dependencies up to date (performance fixes)

#### 3. Runner Maintenance 🔧

```bash
# Weekly maintenance checklist
├─► Check disk space: df -h
├─► Clean old builds: yarn cache clean
├─► Update runner: ./svc.sh stop; # update; ./svc.sh start
└─► Review logs: tail -f _diag/Runner_*.log
```

---

### E. Monitoring & Observability

#### 1. CI/CD Metrics 📊

```
Key metrics to track:
├─► CI success rate (target: >95%)
├─► CI duration (target: <5 min)
├─► Build success rate (target: >90%)
├─► Build duration (target: <25 min)
└─► Deployment frequency
```

**Tools**:
- GitHub Actions Insights (built-in)
- EAS Build Dashboard
- Firebase App Distribution Analytics

#### 2. Application Monitoring 📱

```
Post-deployment monitoring:
├─► Firebase Crashlytics (crashes)
├─► App Store Connect (iOS metrics)
├─► Google Play Console (Android metrics)
└─► User feedback (in-app + reviews)
```

**Best Practice**:
- Set up alerts for crash rate spikes
- Monitor adoption rate of new releases
- Track version distribution
- Review user feedback regularly

#### 3. Logging 📝

```
What to log:
├─► CI workflow runs (automatic)
├─► Build requests and outcomes
├─► Distribution events
├─► Deployment successes/failures
└─► Security events (failed auth, etc.)
```

**Implementation**:
- GitHub Actions logs (automatic)
- EAS Build logs (automatic)
- Firebase Analytics (configure in app)

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Runner Disk Space Issues

**Problem**: Runner runs out of disk space, builds fail.

**Solution**:
```bash
# Monitor disk space
df -h

# Clean up
yarn cache clean
rm -rf node_modules/.cache
docker system prune -a  # If using Docker

# Automate cleanup
# Add to cron: 0 2 * * * yarn cache clean
```

### Pitfall 2: EAS Build Quota Exceeded

**Problem**: Exceeded 30 free builds/month.

**Solutions**:
1. **Optimize build frequency**:
   - Only build on `develop` and tagged releases
   - Skip builds for documentation changes
   - Use `--local` for testing

2. **Upgrade to paid plan** ($29/month):
   ```bash
   # Upgrade at expo.dev
   ```

3. **Use GitHub-hosted builds** (last resort):
   - More complex setup
   - Requires managing credentials
   - Higher maintenance cost

### Pitfall 3: Firebase Testers Not Receiving Notifications

**Problem**: Builds uploaded but testers don't get emails.

**Solutions**:
```
1. Check tester group configuration
   ├─► Firebase Console → App Distribution → Testers & Groups
   └─► Ensure "testers" group exists and has members

2. Verify workflow configuration
   ├─► Check FIREBASE_*_APP_ID secrets
   └─► Review workflow logs for errors

3. Ask testers to check spam folders
   └─► Add noreply@firebase.com to contacts

4. Re-invite testers
   └─► Firebase Console → Invite testers
```

### Pitfall 4: iOS Provisioning Profile Errors

**Problem**: "No matching provisioning profile found"

**Solutions**:
```bash
# Reset iOS credentials
eas credentials --platform ios

# Regenerate profiles
eas build --platform ios --profile staging

# Check expiration
eas credentials:list --platform ios
```

---

## 📚 Decision Matrix: When to Use What

### When to Use GitHub-Hosted Runners vs Self-Hosted?

| Scenario | Recommendation | Why |
|----------|---------------|-----|
| Private repo, Mac available | Self-hosted ✅ | Free, faster, full control |
| Public repo | GitHub-hosted ✅ | Security risk with self-hosted |
| No Mac available | GitHub-hosted ✅ | Linux runners available |
| Team of 5+ | Self-hosted ✅ | Cost savings scale up |

### When to Use EAS Build vs Local Builds?

| Scenario | Recommendation | Why |
|----------|---------------|-----|
| CI/CD pipeline | EAS Build ✅ | Consistent environment |
| Production releases | EAS Build ✅ | Code signing handled |
| Quick local testing | Local build ✅ | Faster iteration |
| iOS without Mac | EAS Build ✅ | Only option |

### When to Use Firebase vs TestFlight/Google Play Internal Testing?

| Scenario | Recommendation | Why |
|----------|---------------|-----|
| Cross-platform (iOS + Android) | Firebase ✅ | Single tool for both |
| iOS only | TestFlight ✅ | Native integration |
| Need crash analytics | Firebase ✅ | Built-in Crashlytics |
| Large tester groups (100+) | TestFlight/Google Play ✅ | Better scalability |

---

## 🎓 Advanced Topics

### 1. Multi-Environment Strategies

```
Recommended setup:

Development → Local machine + Self-hosted CI
    ├─► Fast iteration
    ├─► Local debugging
    └─► Quick feedback

Staging → EAS Build + Firebase Distribution
    ├─► QA validation
    ├─► Client demos
    └─► Pre-production testing

Production → EAS Build + App Stores
    ├─► Optimized builds
    ├─► Store submission
    └─► Production monitoring
```

### 2. Monorepo Considerations

If you have a monorepo with multiple apps:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    paths:
      - 'apps/mobile/**'  # Only run for mobile app changes
      - 'packages/**'     # Or shared packages

jobs:
  mobile-ci:
    runs-on: self-hosted
    defaults:
      run:
        working-directory: apps/mobile
    steps:
      # ... CI steps
```

### 3. Feature Flags Integration

```typescript
// Integrate with LaunchDarkly, Firebase Remote Config, etc.
import { getRemoteConfig } from '@/lib/remoteConfig'

const config = getRemoteConfig()

if (config.newFeatureEnabled) {
  // Show new feature
}
```

**Best Practice**: Use feature flags for:
- Gradual rollouts
- A/B testing
- Kill switches
- Environment-specific features

---

## ✅ Checklist: Are You Following Best Practices?

### CI/CD Setup
- [ ] Self-hosted runner configured (private repo only)
- [ ] All GitHub secrets added
- [ ] EAS credentials configured
- [ ] Firebase App Distribution set up
- [ ] Tester groups configured
- [ ] Branch protection enabled

### Code Quality
- [ ] Commitlint enforced
- [ ] Tests run in CI
- [ ] Code coverage tracked
- [ ] Linting enforced
- [ ] TypeScript strict mode enabled
- [ ] Pre-commit hooks active

### Security
- [ ] Secrets encrypted (GPG)
- [ ] Credentials rotated regularly
- [ ] Runner access restricted
- [ ] No hardcoded secrets
- [ ] Service accounts used (not personal)
- [ ] Audit logs reviewed

### Operations
- [ ] Runner monitored
- [ ] Disk space checked
- [ ] Build times tracked
- [ ] Crashlytics configured
- [ ] Release notes automated
- [ ] Team workflows documented

---

## 📖 Further Reading

### Official Documentation
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Your Project Documentation
- [Complete CI/CD Guide](./docs/CI_CD.md)
- [Quick Start Guide](./docs/CI_CD_QUICKSTART.md)
- [Architecture Overview](./docs/CI_CD_ARCHITECTURE.md)
- [Setup Summary](./SETUP_SUMMARY.md)

### Community Resources
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [GitHub Actions Community](https://github.community/c/actions/37)

---

## 🎯 Conclusion

Your CI/CD pipeline is now production-ready with best practices implemented:

✅ **Cost-effective**: Free CI minutes with self-hosted runner  
✅ **Secure**: Multi-layer security with encryption and secrets management  
✅ **Automated**: Hands-off builds and distribution  
✅ **Scalable**: Supports team growth and increased build frequency  
✅ **Maintainable**: Well-documented with clear workflows  

**Next steps**: Complete the [Quick Start Guide](./docs/CI_CD_QUICKSTART.md) to activate your pipeline.

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Maintained by:** Development Team

