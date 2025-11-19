# Expo Boilerplate

A production-ready Expo boilerplate with feature-based architecture, TypeScript, Zustand state management, and i18next internationalization.

## 🚀 Features

- ✅ **Expo Router** - File-based routing
- ✅ **TypeScript** - Type safety throughout
- ✅ **Zustand** - Lightweight state management
- ✅ **MMKV** - High-performance storage
- ✅ **i18next** - Internationalization (English, Vietnamese)
- ✅ **Feature-based architecture** - Scalable folder structure
- ✅ **Authentication example** - Complete auth flow with Zustand
- ✅ **Dark mode** - Theme support
- ✅ **Environment variables** - Secure config with react-native-keys
- ✅ **ESLint + Prettier** - Code formatting
- ✅ **Jest** - Testing setup
- ✅ **Husky** - Git hooks
- ✅ **Version Management** - Automated versioning with conventional commits
- ✅ **Custom Icon System** - Path-based SVG icons with theme integration
- ✅ **💰 100% FREE CI/CD** - Local EAS builds, GitHub Actions, saves $1,188-$3,588/year!
- ✅ **Firebase Distribution** - Automated app distribution to testers (FREE!)

## 📁 Project Structure

```
/src/
├── app/                 # Expo Router - Routes only
│   ├── (auth)/         # Auth screens (login, register)
│   └── (tabs)/         # Tab navigation
├── features/           # Business logic by domain
│   └── auth/          # Auth feature (complete example)
├── components/         # Shared UI components
├── hooks/             # Global hooks
├── lib/               # Library utilities
│   └── icons/         # Icon system (path-based)
├── locales/           # i18n translations
├── constants/         # Global constants
├── utils/             # Global utilities
└── types/             # Global TypeScript types

/assets/
└── icons/             # Icon definitions
    ├── home.tsx       # Individual icon files
    ├── edit.tsx       # Path-based icons
    └── index.ts       # Central exports
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 🏃 Quick Start

### 1. Install dependencies

```bash
yarn install
# or
npm install
```

### 2. Setup environment variables

**For new projects (first time):**
```bash
# Create development keys file
yarn env:setup

# Edit keys.development.json with your configuration
# Then encrypt for team sharing
yarn env:encrypt
```

**For team members (joining existing project):**
```bash
# Interactive environment selector
yarn env

# Select environment (e.g., 1 for development)
# Enter password (get from team lead)
# ✅ Environment decrypted and ready!
```

See [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) for complete guide.

### 3. Start the app

```bash
yarn start
# 🚀 Select Profile for: Start
#   1. development   ✅ Ready (default)
#   2. staging       ✅ Ready
#   3. production    ❌ Not decrypted
# Select profile (1-3) [default: 1]:
```

The app will prompt you to select an environment profile. Just press Enter for development or choose another profile.

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

### 3. Try the demo

The app includes a complete authentication example:

1. Go to the **Profile** tab
2. Click **Sign In**
3. Use any email and password (min 6 characters)
4. See the auth flow in action!

## 🎯 Key Commands

```bash
# Development (with interactive profile selection) ⭐ NEW!
yarn start              # Start dev server with profile selector
yarn prebuild           # Prebuild native with profile selector
yarn ios                # Build & run iOS with profile selector
yarn android            # Build & run Android with profile selector
yarn web                # Run on web (no profile needed)

# Direct environment commands (skip profile selection)
yarn start:dev          # Start with development profile
yarn start:staging      # Start with staging profile
yarn start:production   # Start with production profile
yarn ios:dev            # Build & run iOS with development
yarn ios:staging        # Build & run iOS with staging
yarn ios:production     # Build & run iOS with production
yarn android:dev        # Build & run Android with development
yarn android:staging    # Build & run Android with staging
yarn android:production # Build & run Android with production

# Environment Management
yarn env                # Select and decrypt environment
yarn env:encrypt        # Encrypt environment files
yarn env:status         # Check encryption status
yarn env:verify         # Verify configuration

# Testing
yarn test               # Run tests
yarn test:watch         # Watch mode
yarn test:coverage      # With coverage

# Linting
yarn lint               # Run ESLint
yarn format             # Format with Prettier

# Version Management
yarn release            # Interactive release (bump version, generate changelog)
yarn commit             # Interactive commit helper (conventional commits)

# Build & Deploy (100% FREE Local Builds!) ⭐ NEW!
yarn build                  # Build only (no deployment)
yarn build:deploy           # Build + interactive Firebase distribution
yarn deploy                 # Deploy existing builds to Firebase
yarn build:setup            # Setup local build environment (first time)
```

## 🏗️ Architecture

This project uses **feature-based architecture**:

### What's a Feature?

A feature is a self-contained module organized by business domain:

```
/features/auth/
├── components/      # Auth-specific components
├── hooks/          # Auth-specific hooks
├── store/          # Auth state (Zustand)
├── api/            # Auth API calls
├── types/          # Auth TypeScript types
└── index.ts        # Public API exports
```

### Creating a New Feature

1. **Create the structure:**
```bash
mkdir -p src/features/my-feature/{components,hooks,store,types}
```

2. **Add your code** in the appropriate folders

3. **Export public API:**
```typescript
// src/features/my-feature/index.ts
export { useMyFeature } from './hooks/useMyFeature'
export type { MyType } from './types'
```

4. **Use in routes:**
```typescript
import { useMyFeature } from '@/features/my-feature'
```

See [src/features/README.md](./src/features/README.md) for more details.

## 🔐 Authentication Example

The project includes a complete auth feature:

### Store (Zustand)
```typescript
// src/features/auth/store/authStore.ts
export const useAuthStore = create(
  persist((set) => ({
    user: null,
    login: async (credentials) => { /* ... */ },
    logout: async () => { /* ... */ },
  }), {
    name: 'auth-storage',
    storage: createJSONStorage(() => storage),
  })
)
```

### Hook
```typescript
// src/features/auth/hooks/useAuth.ts
export function useAuth() {
  const store = useAuthStore()
  return {
    user: store.user,
    login: store.login,
    logout: store.logout,
  }
}
```

### Usage in Route
```typescript
// src/app/(auth)/login.tsx
import { LoginForm, useAuth } from '@/features/auth'

export default function LoginScreen() {
  const { login, isLoading } = useAuth()
  return <LoginForm onSubmit={login} isLoading={isLoading} />
}
```

## 🌍 Internationalization

The app supports multiple languages using i18next:

```typescript
import { useTranslation } from '@/hooks/useTranslation'

function MyComponent() {
  const { t, changeLanguage } = useTranslation()
  
  return (
    <>
      <Text>{t('auth.login.title')}</Text>
      <Button onPress={() => changeLanguage('vi')}>Vietnamese</Button>
    </>
  )
}
```

Add translations in `src/locales/`:
- `en.json` - English
- `vi.json` - Vietnamese

## 🎨 Theming & Icons

### Theming
Components automatically adapt to dark/light mode:

```typescript
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

function MyScreen() {
  return (
    <ThemedView>
      <ThemedText>Automatically themed!</ThemedText>
    </ThemedView>
  )
}
```

### Icon System
Custom path-based SVG icon system with theme integration:

```typescript
import { Home, Edit, ChevronDown } from '@/assets/icons'

<Home size="lg" />
<Edit size={28} fill="#FF0000" />
<ChevronDown size="md" fill={theme.colors.tint} />
```

**Available icons:** Home, Explore, Edit, Delete, Plus, Search, Close, Settings, ChevronDown/Up/Left/Right, CheckCircle, AlertCircle

**Creating new icons:**
```typescript
// assets/icons/my-icon.tsx
import { createSinglePathSVG } from '@/lib/icons'

export const MyIcon = createSinglePathSVG({
  path: 'M12 2L2 7v10l10 5 10-5V7L12 2z'
})

// Export from index.ts
export * from './my-icon'
```

## 📦 State Management

We use **Zustand** for state management:

### Why Zustand?
- Lightweight (< 1kb)
- No boilerplate
- TypeScript-first
- Built-in persistence (using MMKV)

### Example Store
```typescript
import { create } from 'zustand'

export const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### With Persistence
```typescript
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@/features/auth/store/storage'

export const useMyStore = create(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'my-store',
      storage: createJSONStorage(() => storage),
    }
  )
)
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# With coverage
yarn test:coverage
```

Example test:
```typescript
import { renderHook } from '@testing-library/react-hooks'
import { useAuth } from '@/features/auth'

describe('useAuth', () => {
  it('should login user', async () => {
    const { result } = renderHook(() => useAuth())
    await result.current.login({ email: 'test@test.com', password: '123456' })
    expect(result.current.isAuthenticated).toBe(true)
  })
})
```

## 📦 Version Management

This project uses **automated version management** with conventional commits:

### Quick Release

```bash
# Interactive release menu
yarn release

# Choose from:
# 1. Auto-detect (analyzes commits)
# 2. Patch (bug fixes: 1.0.0 → 1.0.1)
# 3. Minor (new features: 1.0.0 → 1.1.0)
# 4. Major (breaking changes: 1.0.0 → 2.0.0)
# 5. First Release (initial setup)
# 6. Dry Run (preview changes)
```

### Conventional Commits

All commits must follow the conventional format:

```bash
# Use interactive helper
yarn commit

# Or write manually
git commit -m "feat(auth): add biometric login"
git commit -m "fix(ui): resolve button alignment"
```

**Commit types:**
- `feat:` → New feature (triggers MINOR bump)
- `fix:` → Bug fix (triggers PATCH bump)
- `feat!:` or `BREAKING CHANGE:` → Breaking change (triggers MAJOR bump)

### Release Workflow

```bash
# 1. Make changes with conventional commits
git commit -m "feat(auth): add OAuth login"

# 2. Release (interactive menu)
yarn release
# ✅ Updates package.json version
# ✅ Generates CHANGELOG.md
# ✅ Creates git tag

# 3. Push
git push --follow-tags origin main

# 4. Build (version automatically correct)
yarn prebuild:production
eas build --platform all
```

**Key Benefits:**
- ✅ Single source of truth: `package.json` version
- ✅ Automatic changelog generation
- ✅ No manual version syncing
- ✅ Build numbers auto-increment (timestamp-based)

See [VERSION_MANAGEMENT.md](./docs/VERSION_MANAGEMENT.md) for complete guide.

## 📚 Documentation

### 💰 Local Builds (100% FREE!) ⭐ NEW!
- [docs/BUILD_DEPLOY_WORKFLOWS.md](./docs/BUILD_DEPLOY_WORKFLOWS.md) - **Build & Deploy Workflows** (separated processes, examples)
- [docs/LOCAL_BUILD_GUIDE.md](./docs/LOCAL_BUILD_GUIDE.md) - **Complete local builds guide** (setup, build, troubleshoot)
- [docs/FIREBASE_DISTRIBUTION.md](./docs/FIREBASE_DISTRIBUTION.md) - **Firebase App Distribution** (automated tester distribution)
- [docs/CI_CD.md](./docs/CI_CD.md) - **Full CI/CD pipeline** (GitHub Actions + local builds)
- [docs/CI_CD_QUICKSTART.md](./docs/CI_CD_QUICKSTART.md) - Quick start checklist

### 📖 General
- [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) - Environment configuration (GPG encryption, profile selector)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Project architecture
- [docs/VERSION_MANAGEMENT.md](./docs/VERSION_MANAGEMENT.md) - Version management (automated releases)
- [src/features/README.md](./src/features/README.md) - Feature-based architecture
- [assets/icons/README.md](./assets/icons/README.md) - Icon system

**Quick reference:**
- Environment: `{ "public": { "APP_NAME": "..." }, "secure": { "API_KEY": "..." } }`
- Access: `keys.APP_NAME`, `keys.API_KEY` (flat, no nesting)
- Icons: `import { Home, Edit } from '@/assets/icons'`
- Version: Managed in `package.json` (single source of truth)
- CI/CD: **100% FREE** local EAS builds on GitHub Actions + GitHub Releases 💰

## 🔧 Configuration

### TypeScript Paths

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint + Prettier

Code is automatically formatted on commit using Husky + lint-staged.

### Version Management

- **Single source of truth:** `package.json` version
- **Automatic changelog:** Generated from conventional commits
- **Commit validation:** Enforced via commitlint (Husky hook)
- **Build numbers:** Auto-increment via timestamp in `app.config.ts`

## 🚢 Deployment

### Local Builds (100% FREE!)

```bash
# Interactive build menu
yarn build

# First time setup
yarn build:setup
```

**Available workflows:**

```bash
# Build only (skip deployment)
yarn build

# Build and deploy together
yarn build:deploy

# Deploy existing builds
yarn deploy
```

**Interactive features:**
- Platform selection (Android, iOS, Both)
- Profile selection (Development, Staging, Production)
- Build summaries and progress
- Optional Firebase App Distribution
- Helpful tips and next steps

See [docs/LOCAL_BUILD_GUIDE.md](./docs/LOCAL_BUILD_GUIDE.md) for complete guide.

## 📖 Learn More

- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) - State management
- [i18next](https://www.i18next.com/) - Internationalization
- [MMKV](https://github.com/mrousavy/react-native-mmkv) - Storage
- [Expo docs](https://docs.expo.dev/) - Expo documentation

## 🤝 Contributing

Contributions are welcome! Please read the architecture docs first to understand the folder structure.

## 📄 License

MIT

---

**Happy coding!** 🎉
