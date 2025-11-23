# GitHub Actions Caching Guide

## 🎯 What is Caching?

Caching saves files/folders from one workflow run to reuse in future runs. Instead of downloading/installing everything from scratch each time, GitHub Actions can restore previously saved data.

**Think of it like:** Saving your shopping list so you don't have to write it again next time (if nothing changed).

---

## 💡 Why Use Caching?

### Without Cache:
```
Run 1: Install 500 npm packages (2 minutes)
Run 2: Install 500 npm packages (2 minutes) ❌ Wasted time
Run 3: Install 500 npm packages (2 minutes) ❌ Wasted time
```

### With Cache:
```
Run 1: Install 500 npm packages (2 minutes) → Save to cache
Run 2: Restore from cache (10 seconds) ✅ 12x faster!
Run 3: Restore from cache (10 seconds) ✅ 12x faster!
```

**Benefits:**
- ⚡ **Faster builds** - Skip downloading/installing dependencies
- 💰 **Cost savings** - Less compute time = lower GitHub Actions costs
- 🌍 **Less network usage** - Fewer downloads from package registries

---

## 🔑 How GitHub Actions Cache Works

### Basic Structure

```yaml
- name: 💾 Cache something
  uses: actions/cache@v4
  with:
    path: folder/to/cache
    key: unique-cache-key
    restore-keys: |
      fallback-key-prefix-
```

### Key Components

#### 1. **`path`** - What to Cache
The folder(s) you want to save and restore.

```yaml
path: |
  node_modules/
  ~/.gradle/caches
  android/.gradle
```

**Example from your workflow:**
```yaml
# Cache Gradle dependencies
path: |
  ~/.gradle/caches      # Gradle's downloaded dependencies
  ~/.gradle/wrapper     # Gradle wrapper files
  android/.gradle        # Project-specific Gradle cache
```

#### 2. **`key`** - Unique Cache Identifier
A unique string that identifies this specific cache. If the key matches, the cache is restored.

```yaml
key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*') }}
```

**Breaking it down:**
- `${{ runner.os }}` = Operating system (Linux, macOS, Windows)
  - Why? Different OS = different cache (can't use macOS cache on Linux)
- `gradle-` = Cache type identifier
- `${{ hashFiles('**/*.gradle*') }}` = Hash of Gradle files
  - Why? If Gradle config changes, we need a new cache

**Key Rule:** Same key = same cache. Different key = different cache.

#### 3. **`restore-keys`** - Fallback Strategy
If exact key doesn't match, try these partial matches (prefix matching).

```yaml
restore-keys: |
  ${{ runner.os }}-gradle-
```

**How it works:**
1. Try exact key match: `Linux-gradle-abc123` ❌ Not found
2. Try restore-key match: `Linux-gradle-` ✅ Found `Linux-gradle-xyz789`
3. Use the closest match (most recent cache with that prefix)

**Why useful?** If you change one small file, you still get 95% of the cache.

---

## 📊 Real Examples from Your Workflows

### Example 1: Simple Cache (node_modules)

```yaml
- name: 📦 Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'  # ← This automatically caches node_modules!
```

**What happens:**
- GitHub Actions automatically:
  1. Checks if `yarn.lock` changed (creates hash)
  2. If hash matches → restore `node_modules/` from cache
  3. If hash changed → install fresh, then save to cache

**No manual cache step needed!** `setup-node@v4` handles it.

---

### Example 2: Manual Cache (Gradle)

```yaml
- name: 💾 Cache Gradle dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
      android/.gradle
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: |
      ${{ runner.os }}-gradle-
```

**Step-by-step:**
1. **Before build:** Check if cache exists with this key
   - Key = `Linux-gradle-abc123def456` (hash of Gradle files)
2. **If found:** Restore folders → Skip downloading dependencies ✅
3. **If not found:** Download dependencies → Save to cache
4. **After build:** Save updated cache for next time

**Cache key breakdown:**
- `Linux-` = Only works on Linux runners
- `gradle-` = Identifies this as Gradle cache
- `abc123def456` = Hash of all `.gradle*` files
  - If you change `build.gradle` → new hash → new cache

---

### Example 3: Native Folders Cache

```yaml
- name: 💾 Restore native folders cache
  id: cache-native
  uses: actions/cache@v4
  with:
    path: |
      android/
      ios/
    key: ${{ runner.os }}-native-${{ inputs.platform }}-${{ inputs.profile }}-${{ hashFiles('app.config.ts', 'package.json', 'yarn.lock', 'babel.config.js') }}
    restore-keys: |
      ${{ runner.os }}-native-${{ inputs.platform }}-${{ inputs.profile }}-
      ${{ runner.os }}-native-${{ inputs.platform }}-
```

**Why so complex?**
- `${{ inputs.platform }}` = Different cache for android vs ios
- `${{ inputs.profile }}` = Different cache for dev/staging/prod
- `hashFiles(...)` = If config changes, need new native folders

**Restore strategy:**
1. Try exact match (same OS + platform + profile + config hash)
2. Try partial match (same OS + platform + profile, different config)
3. Try broader match (same OS + platform, different profile/config)

---

## 🔄 Cache Lifecycle

### Typical Workflow Run

```
┌─────────────────────────────────────────┐
│ 1. Checkout code                        │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 2. Restore Cache                        │
│    - Check if key exists                │
│    - If yes: Restore files              │
│    - If no: Continue (empty)            │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 3. Install/Build                        │
│    - Use cached files if available     │
│    - Only download/build what's missing │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 4. Save Cache (if changed)             │
│    - Upload updated files to cache     │
│    - Store with the key                │
└─────────────────────────────────────────┘
```

### Cache Hit vs Cache Miss

**Cache Hit** ✅
```
Key: Linux-gradle-abc123
Status: Found in cache!
Action: Restore ~/.gradle/caches (saves 2 minutes)
```

**Cache Miss** ❌
```
Key: Linux-gradle-xyz789 (new hash, never seen before)
Status: Not found
Action: Install from scratch, then save to cache
```

---

## 🎯 Cache Scoping & Limits

### Cache Scopes

Caches are scoped to:
- **Repository** - Only your repo can access its caches
- **Branch** - Caches are shared across branches (but keys can be branch-specific)
- **Workflow** - All workflows in the repo share the cache namespace

### Cache Limits

- **Size:** 10 GB per repository (total)
- **Retention:** 7 days of unused caches (auto-deleted)
- **Count:** No hard limit, but oldest caches are evicted when you hit 10 GB

**Best Practice:** Use specific keys to avoid cache bloat.

---

## 💡 Best Practices

### ✅ DO

1. **Include OS in key**
   ```yaml
   key: ${{ runner.os }}-my-cache-${{ hashFiles('file.txt') }}
   ```
   Different OS = different binaries = different cache needed

2. **Hash dependency files**
   ```yaml
   key: ${{ hashFiles('package.json', 'yarn.lock') }}
   ```
   If dependencies change, you need a fresh cache

3. **Use restore-keys for fallback**
   ```yaml
   restore-keys: |
     ${{ runner.os }}-my-cache-
   ```
   Get partial cache if exact match not found

4. **Cache after install, before use**
   ```yaml
   - run: yarn install        # Install dependencies
   - uses: actions/cache@v4   # Cache them
   - run: yarn build          # Use cached deps
   ```

### ❌ DON'T

1. **Don't cache build outputs**
   ```yaml
   # ❌ BAD - Build outputs change every run
   path: build/
   
   # ✅ GOOD - Dependencies rarely change
   path: node_modules/
   ```

2. **Don't use too generic keys**
   ```yaml
   # ❌ BAD - Too generic, might use wrong cache
   key: my-cache
   
   # ✅ GOOD - Specific to your needs
   key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*') }}
   ```

3. **Don't cache secrets or sensitive data**
   ```yaml
   # ❌ BAD - Secrets in cache = security risk
   path: keys/
   ```

---

## 🔍 Debugging Cache

### Check Cache Status

GitHub Actions shows cache status in logs:

```
Post job cleanup.
Cache saved with key: Linux-gradle-abc123def456
```

Or:

```
Cache restored from key: Linux-gradle-abc123def456
```

### Common Issues

**Issue:** Cache not restoring
- **Check:** Key matches exactly (including OS, hashes, etc.)
- **Fix:** Verify `hashFiles()` includes all relevant files

**Issue:** Cache too large
- **Check:** Are you caching unnecessary files?
- **Fix:** Be more specific with `path`

**Issue:** Stale cache
- **Check:** Is your key too generic?
- **Fix:** Include more specific identifiers in key

---

## 📚 Your Workflow's Cache Strategy

### Current Caching Setup (Optimized)

1. **node_modules** - Auto-cached by `setup-node@v4`
   - Key: Based on `yarn.lock` hash
   - Saves: ~2-3 minutes per run
   - **Auto-resets:** When `yarn.lock` changes ✅
   - **Cache ID:** `node-cache` (automatic)

2. **Gradle (Android)** - Manual cache
   - Key: OS + Gradle files hash + `yarn.lock` hash
   - Saves: ~1-2 minutes per run
   - **Auto-resets:** When `yarn.lock` or Gradle files change ✅
   - **Cache ID:** `gradle-cache` (for monitoring)

3. **CocoaPods (iOS)** - Manual cache
   - Key: OS + `Podfile.lock` hash + `yarn.lock` hash
   - Saves: ~1-2 minutes per run
   - **Auto-resets:** When `yarn.lock` or `Podfile.lock` changes ✅
   - **Cache ID:** `pods-cache` (for monitoring)

4. **EAS build cache** - Manual cache
   - Key: OS + `eas.json` + `app.config.ts` hash + `yarn.lock` hash
   - Saves: Varies based on build complexity
   - **Auto-resets:** When `yarn.lock`, `eas.json`, or `app.config.ts` changes ✅
   - **Cache ID:** `eas-cache` (for monitoring)

5. **Android build outputs** - Manual cache ⚡ NEW
   - Key: OS + profile + Android source code hash
   - Saves: **10-20 minutes** (major time saver!)
   - **Auto-resets:** When Android native code, Gradle files, or config changes ✅
   - **Cache ID:** `android-build-cache` (for monitoring)
   - **What it caches:** `android/app/build` and `android/build` (compiled artifacts)

6. **iOS build outputs (Xcode DerivedData)** - Manual cache ⚡ NEW
   - Key: OS + profile + iOS source code hash
   - Saves: **10-20 minutes** (major time saver!)
   - **Auto-resets:** When iOS native code, Xcode config, or config changes ✅
   - **Cache ID:** `ios-build-cache` (for monitoring)
   - **What it caches:** `~/Library/Developer/Xcode/DerivedData` (Xcode build cache)

**Total time saved:** 
- **First build:** ~4-7 minutes (dependencies only)
- **Subsequent builds (no code changes):** ~14-27 minutes (dependencies + build outputs) 🚀
- **Subsequent builds (code changes):** ~4-7 minutes (dependencies, incremental compilation)

### 🔄 Automatic Cache Invalidation

**All manual caches automatically reset when `yarn.lock` changes!**

This ensures that:
- ✅ When you update dependencies, caches are invalidated
- ✅ No stale dependency issues
- ✅ No need to manually clear caches after `yarn add` or `yarn remove`
- ✅ Fresh builds when dependencies change

**How it works:**
- Each cache key includes `yarn.lock` in the hash
- When `yarn.lock` changes → hash changes → new cache key → cache miss → fresh build
- Old cache expires after 7 days of non-use

### 📊 Cache Monitoring

**Cache status is automatically reported in workflow summaries:**
- Each cache step has an ID for tracking
- Cache hit/miss status is displayed in the workflow summary
- Helps identify when caches aren't working effectively

### ⚠️ Why Native Folders Cache Was Removed

**Previously cached:** `android/` and `ios/` folders

**Why removed:**
- ❌ **Generated files** - Created by `expo prebuild`, not source code
- ❌ **Large size** - 100-500MB+ per cache entry
- ❌ **Fragile** - Small config changes might require regeneration
- ❌ **Risk of stale builds** - If cache key misses a config change
- ✅ **Prebuild is fast** - Only ~30-60s with cached dependencies

**Result:** Simpler, more reliable workflow with minimal time impact.

---

## 🚀 Quick Reference

### Simple Cache Template

```yaml
- name: 💾 Cache something
  uses: actions/cache@v4
  with:
    path: path/to/cache
    key: ${{ runner.os }}-cache-name-${{ hashFiles('relevant-file.txt') }}
    restore-keys: |
      ${{ runner.os }}-cache-name-
```

### Check Cache Hit/Miss

```yaml
- name: 💾 Cache with status check
  id: cache
  uses: actions/cache@v4
  with:
    path: node_modules/
    key: ${{ hashFiles('yarn.lock') }}

- name: Show cache status
  run: |
    if [ "${{ steps.cache.outputs.cache-hit }}" == "true" ]; then
      echo "✅ Cache hit!"
    else
      echo "❌ Cache miss - installing fresh"
    fi
```

---

## 🗑️ How to Reset/Delete Manual Caches

Sometimes you need to clear caches (corrupted cache, dependency issues, etc.). Here are several methods:

### Method 1: GitHub UI (Easiest) ⭐

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **Caches** (left sidebar)
3. You'll see all caches with their keys
4. Click the **🗑️** button next to the cache you want to delete
5. Or use **"Delete all caches"** to clear everything

**Path:** `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/actions/cache`

### Method 2: GitHub CLI (Command Line)

```bash
# List all caches
gh cache list

# Delete a specific cache by key
gh cache delete "Linux-gradle-abc123def456"

# Delete all caches (careful!)
gh cache delete --all
```

**Prerequisites:**
- Install GitHub CLI: `brew install gh` (macOS) or [download](https://cli.github.com/)
- Authenticate: `gh auth login`

### Method 3: GitHub API

```bash
# Get cache list
curl -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/actions/caches

# Delete specific cache by ID
curl -X DELETE \
     -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/actions/caches?key=CACHE_KEY
```

### Method 4: Change Cache Key (Workaround)

If you can't delete the cache, change the key to force a new cache:

```yaml
# Old key
key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*') }}

# New key (add version number)
key: ${{ runner.os }}-gradle-v2-${{ hashFiles('**/*.gradle*') }}
```

**Note:** Old cache will expire after 7 days of non-use.

### Method 5: Create a Cache Cleanup Workflow

Create `.github/workflows/clear-cache.yml`:

```yaml
name: Clear Cache

on:
  workflow_dispatch:
    inputs:
      cache-key:
        description: 'Cache key to delete (leave empty to delete all)'
        required: false
        type: string

jobs:
  clear-cache:
    runs-on: ubuntu-latest
    steps:
      - name: Delete cache
        uses: actions/github-script@v7
        with:
          script: |
            const cacheKey = '${{ inputs.cache-key }}';
            
            if (cacheKey) {
              // Delete specific cache
              const caches = await github.rest.actions.getActionsCacheList({
                owner: context.repo.owner,
                repo: context.repo.repo,
                key: cacheKey
              });
              
              for (const cache of caches.data.actions_caches) {
                await github.rest.actions.deleteActionsCacheById({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  cache_id: cache.id
                });
                console.log(`Deleted cache: ${cache.key}`);
              }
            } else {
              // Delete all caches
              const caches = await github.rest.actions.getActionsCacheList({
                owner: context.repo.owner,
                repo: context.repo.repo
              });
              
              for (const cache of caches.data.actions_caches) {
                await github.rest.actions.deleteActionsCacheById({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  cache_id: cache.id
                });
                console.log(`Deleted cache: ${cache.key}`);
              }
            }
```

**Usage:**
1. Go to **Actions** tab → **Clear Cache** workflow
2. Click **Run workflow**
3. Optionally enter a cache key to delete specific cache
4. Or leave empty to delete all caches

### Method 6: Force Cache Miss (Temporary)

Add a version to your cache key that you can increment:

```yaml
- name: 💾 Cache Gradle dependencies
  uses: actions/cache@v4
  with:
    path: ~/.gradle/caches
    key: ${{ runner.os }}-gradle-v1-${{ hashFiles('**/*.gradle*') }}
    # Change v1 to v2 to force new cache
```

### Quick Reference: Your Cache Keys

Based on your workflows, here are the cache keys you might want to delete:

- **Gradle:** `Linux-gradle-*` or `macOS-gradle-*`
- **CocoaPods:** `macOS-pods-*`
- **Native folders:** `Linux-native-*` or `macOS-native-*`
- **EAS build:** `Linux-eas-build-local-*` or `macOS-eas-build-local-*`
- **Yarn global:** `Linux-yarn-global-*` or `macOS-yarn-global-*`

### When to Reset Cache

Reset cache when:
- ✅ Build fails with dependency errors
- ✅ Cache seems corrupted
- ✅ Dependencies updated but cache not refreshing
- ✅ Switching between major dependency versions
- ✅ Debugging cache-related issues

### Cache Auto-Expiration

GitHub automatically deletes caches that:
- Haven't been used in **7 days**
- Exceed the **10 GB repository limit** (oldest first)

So sometimes you can just wait for automatic cleanup!

---

## 📖 Further Reading

- [GitHub Actions Cache Documentation](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [actions/cache@v4 Documentation](https://github.com/actions/cache)
- [GitHub CLI Cache Commands](https://cli.github.com/manual/gh_cache)

---

**Remember:** Caching is about saving time and money. Start simple, then optimize based on your build times!

