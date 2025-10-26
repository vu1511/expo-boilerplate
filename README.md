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
├── locales/           # i18n translations
├── constants/         # Global constants
├── utils/             # Global utilities
└── types/             # Global TypeScript types
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

## 🎨 Theming

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

## 📚 Documentation

- [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) - **Complete environment configuration guide** (GPG encryption, profile selector, react-native-keys)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Detailed architecture docs
- [src/features/README.md](./src/features/README.md) - Feature-based architecture guide

**Additional References:**
- [docs/CONFIGURATION.md](./docs/CONFIGURATION.md) - Detailed react-native-keys configuration
- [docs/ENVIRONMENT-SETUP.md](./docs/ENVIRONMENT-SETUP.md) - GPG encryption setup
- [docs/PROFILE-SELECTOR.md](./docs/PROFILE-SELECTOR.md) - Interactive profile selector details

**Quick reference:**
- JSON structure: `{ "public": { "APP_NAME": "..." }, "secure": { "API_KEY": "..." } }`
- JavaScript access: `keys.APP_NAME`, `keys.API_KEY` (flat, no nesting)

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

## 🚢 Deployment

### Build for production

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Both
eas build --platform all
```

See [Expo EAS Build docs](https://docs.expo.dev/build/introduction/) for more info.

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
