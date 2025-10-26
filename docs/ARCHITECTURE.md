# Architecture Documentation

## Overview

This project uses a **feature-based architecture** for scalability and maintainability. Code is organized by business domain rather than technical layers.

## Folder Structure

```
/src/
├── app/                    # Expo Router - Routes only
│   ├── _layout.tsx
│   ├── (auth)/            # Auth route group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   └── profile.tsx
│   └── modal.tsx
│
├── features/              # Business logic by domain
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Auth-specific components
│   │   ├── hooks/        # Auth-specific hooks
│   │   ├── store/        # Auth state (Zustand)
│   │   ├── api/          # Auth API calls
│   │   ├── types/        # Auth TypeScript types
│   │   └── index.ts      # Public API
│   └── README.md         # Features documentation
│
├── components/           # Shared/reusable UI components
│   ├── ui/              # Generic UI components
│   ├── themed-text.tsx
│   └── themed-view.tsx
│
├── hooks/               # Global shared hooks
│   ├── useTranslation.ts
│   └── useTheme.ts
│
├── locales/            # i18n translations
│   ├── en.json
│   ├── vi.json
│   └── index.ts
│
├── constants/          # Global constants
│   └── theme.ts
│
├── utils/              # Global utilities
│   └── translation.ts
│
└── types/              # Global TypeScript types
    └── i18next.d.ts

/assets/                # Static assets (images, fonts)
/__tests__/            # Test files
```

## Architecture Principles

### 1. Feature-Based Organization

**Why?** Code is organized by business domain (features) rather than by technical layer (screens, components, etc.)

**Benefits:**
- Related code stays together
- Easy to find and modify code
- Better team collaboration
- Simple to add/remove features
- Scales well with app growth

### 2. Thin Routes, Fat Features

Routes (`/app`) are thin and only handle routing. All business logic lives in features.

```typescript
// ✅ Good - Route file (app/(auth)/login.tsx)
import { LoginForm, useAuth } from '@/features/auth'

export default function LoginScreen() {
  const { login, isLoading } = useAuth()
  return <LoginForm onSubmit={login} isLoading={isLoading} />
}
```

```typescript
// ❌ Bad - Business logic in route
export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const handleSubmit = async () => {
    // API call, validation, etc.
  }
  // 100+ lines of logic...
}
```

### 3. Public API Pattern

Each feature exports only what other features need via `index.ts`:

```typescript
// features/auth/index.ts
export { useAuth } from './hooks/useAuth'
export { LoginForm } from './components/LoginForm'
export type { User, AuthTokens } from './types'
// Internal components NOT exported
```

Other code imports from the public API:
```typescript
import { useAuth, LoginForm } from '@/features/auth'
```

### 4. Encapsulation

Features are self-contained and hide implementation details.

**Benefits:**
- Clear boundaries
- Easier refactoring
- Prevents tight coupling
- Better TypeScript support

## State Management

We use **Zustand** for state management.

### Why Zustand?

- ✅ Lightweight (< 1kb)
- ✅ Simple API
- ✅ TypeScript-first
- ✅ No boilerplate
- ✅ Works with React Native
- ✅ Built-in persistence

### Store Structure

Each feature can have its own store:

```typescript
// features/auth/store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: async (credentials) => {
        // Login logic
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)
```

### Storage

We use **MMKV** for high-performance persistent storage:

```typescript
// features/auth/store/storage.ts
import { MMKV } from 'react-native-mmkv'

const mmkv = new MMKV()

export const storage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.delete(name),
}
```

## Routing

We use **Expo Router** for file-based routing.

### Route Groups

Routes are organized into groups:

- `(auth)` - Authentication screens (login, register)
- `(tabs)` - Main tab navigation
- `(modal)` - Modal screens

### Navigation

```typescript
import { router } from 'expo-router'

// Navigate to route
router.push('/(auth)/login')

// Navigate with params
router.push({ pathname: '/profile', params: { id: '123' } })

// Go back
router.back()

// Replace (no back)
router.replace('/(tabs)')
```

## TypeScript

### Path Aliases

We use `@/` alias for absolute imports:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
import { useAuth } from '@/features/auth'
import { ThemedText } from '@/components/themed-text'
```

### Type Safety

All features export their types:

```typescript
// features/auth/types/index.ts
export interface User {
  id: string
  email: string
  name: string
}

// Usage
import type { User } from '@/features/auth'
```

## Internationalization (i18n)

We use **i18next** for translations.

### Adding Translations

1. Add keys to translation files:
```json
// locales/en.json
{
  "auth": {
    "login": {
      "title": "Welcome Back",
      "button": "Sign In"
    }
  }
}
```

2. Use in components:
```typescript
import { useTranslation } from '@/hooks/useTranslation'

function MyComponent() {
  const { t } = useTranslation()
  return <Text>{t('auth.login.title')}</Text>
}
```

### Type Safety

Translation keys are type-checked:
```typescript
t('auth.login.title')  // ✅ Valid key
t('invalid.key')       // ❌ TypeScript error
```

## Styling

### Theme Support

Components use themed styles:

```typescript
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

function MyScreen() {
  return (
    <ThemedView>
      <ThemedText>Hello World</ThemedText>
    </ThemedView>
  )
}
```

### StyleSheet

Use React Native's StyleSheet:

```typescript
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
})
```

## Testing

### Unit Tests

Test features independently:

```typescript
// features/auth/__tests__/useAuth.test.ts
import { renderHook } from '@testing-library/react-hooks'
import { useAuth } from '../hooks/useAuth'

describe('useAuth', () => {
  it('should login user', async () => {
    // Test implementation
  })
})
```

### Running Tests

```bash
yarn test              # Run once
yarn test:watch        # Watch mode
yarn test:coverage     # With coverage
```

## Best Practices

### ✅ Do

- Keep routes thin (< 30 lines)
- Put business logic in features
- Use TypeScript strictly
- Export types from features
- Write tests for features
- Use absolute imports (`@/`)
- Follow the folder structure
- Document complex logic

### ❌ Don't

- Put business logic in routes
- Import feature internals
- Create circular dependencies
- Mix concerns
- Skip TypeScript types
- Use relative imports for distant files

## Adding a New Feature

1. **Create folder structure:**
```bash
mkdir -p src/features/my-feature/{components,hooks,store,types}
```

2. **Create types:**
```typescript
// src/features/my-feature/types/index.ts
export interface MyFeatureData {
  // Your types
}
```

3. **Create store:**
```typescript
// src/features/my-feature/store/myFeatureStore.ts
import { create } from 'zustand'

export const useMyFeatureStore = create((set) => ({
  // Your state
}))
```

4. **Create hooks:**
```typescript
// src/features/my-feature/hooks/useMyFeature.ts
export function useMyFeature() {
  // Your hook logic
}
```

5. **Create components:**
```typescript
// src/features/my-feature/components/MyFeatureComponent.tsx
export function MyFeatureComponent() {
  // Your component
}
```

6. **Create public API:**
```typescript
// src/features/my-feature/index.ts
export { useMyFeature } from './hooks/useMyFeature'
export { MyFeatureComponent } from './components/MyFeatureComponent'
export type { MyFeatureData } from './types'
```

7. **Use in routes:**
```typescript
// src/app/my-screen.tsx
import { MyFeatureComponent, useMyFeature } from '@/features/my-feature'
```

## Common Patterns

### Pattern 1: API Calls

```typescript
// features/my-feature/api/myFeatureService.ts
export const myFeatureService = {
  getData: async () => {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed')
    return response.json()
  },
}
```

### Pattern 2: Form Handling

```typescript
// features/my-feature/hooks/useMyForm.ts
export function useMyForm() {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  
  return { values, errors, /* ... */ }
}
```

### Pattern 3: Cross-Feature Usage

```typescript
// features/profile/hooks/useProfile.ts
import { useAuth } from '@/features/auth'

export function useProfile() {
  const { user } = useAuth() // ✅ Using another feature
  // ...
}
```

## Performance

### Code Splitting

Expo Router automatically code-splits routes.

### Lazy Loading

Use React.lazy for large components:

```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

function MyScreen() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## Deployment

### Build Commands

```bash
# Development
yarn start

# Production builds
yarn android        # Android
yarn ios           # iOS
yarn web           # Web
```

### Environment Variables

Use `.env` files for configuration:

```bash
# .env
API_URL=https://api.example.com
```

## Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [i18next Docs](https://www.i18next.com/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

## Questions?

See `/src/features/README.md` for more details on feature-based architecture.

