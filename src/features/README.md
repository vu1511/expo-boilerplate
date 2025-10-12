# Features Directory

This directory contains all feature modules organized by business domain.

## What is a Feature?

A **feature** is a self-contained module that represents a business domain or functionality. Each feature contains all the code related to that domain: components, hooks, state management, API calls, types, and utilities.

## Structure

Each feature follows this standard structure:

```
/features/[feature-name]/
  ├── components/       # Feature-specific UI components
  ├── hooks/            # Feature-specific hooks
  ├── store/            # Feature state management (Zustand)
  ├── api/              # Feature API calls
  ├── types/            # Feature TypeScript types
  ├── utils/            # Feature utilities
  ├── constants/        # Feature constants
  └── index.ts          # Public API exports
```

> **Note:** Only create folders you need. Not every feature requires all folders.

## Rules

### 1. Encapsulation
- Only export what other features need via `index.ts`
- Keep internal implementation details private
- Use the public API pattern

### 2. Self-Contained
- Feature should work independently
- Minimize dependencies on other features
- If features are tightly coupled, consider merging them

### 3. Import from Public API
```typescript
// ✅ Good
import { useAuth, LoginForm } from '@/features/auth'

// ❌ Bad - Don't import internals
import { LoginForm } from '@/features/auth/components/LoginForm'
```

## Examples

### Auth Feature

The `auth` feature demonstrates the complete pattern:

```typescript
// Public API (features/auth/index.ts)
export { useAuth } from './hooks/useAuth'
export { LoginForm } from './components/LoginForm'
export type { User, AuthTokens } from './types'
```

Usage in a route:
```typescript
// app/(auth)/login.tsx
import { LoginForm, useAuth } from '@/features/auth'

export default function LoginScreen() {
  const { login, isLoading } = useAuth()
  return <LoginForm onSubmit={login} isLoading={isLoading} />
}
```

## Creating a New Feature

1. **Create the folder structure:**
```bash
mkdir -p src/features/my-feature/{components,hooks,store,types}
```

2. **Create the public API file:**
```typescript
// src/features/my-feature/index.ts
export { useMyFeature } from './hooks/useMyFeature'
export type { MyFeatureType } from './types'
```

3. **Add your implementation:**
- Components in `components/`
- Hooks in `hooks/`
- State in `store/`
- Types in `types/`

4. **Use in your app:**
```typescript
import { useMyFeature } from '@/features/my-feature'
```

## State Management

We use **Zustand** for state management. Each feature can have its own store:

```typescript
// features/my-feature/store/myFeatureStore.ts
import { create } from 'zustand'

export const useMyFeatureStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
```

For persistent state, use the `persist` middleware:
```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@/features/auth/store/storage'

export const useMyFeatureStore = create(
  persist(
    (set) => ({
      // Your state
    }),
    {
      name: 'my-feature-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)
```

## Best Practices

### ✅ Do

- Group related functionality together
- Use clear, descriptive names
- Export only what's needed
- Document complex logic
- Write tests for features
- Keep routes thin (logic in features)

### ❌ Don't

- Create circular dependencies
- Export everything
- Mix business logic in routes
- Create features for every screen
- Tightly couple features

## Feature Naming

Use business/domain names, not technical names:

- ✅ `auth`, `profile`, `dashboard`, `notifications`
- ❌ `forms`, `api`, `store`, `screens`

## Common Patterns

### Pattern 1: Cross-Feature Usage
```typescript
// features/profile/hooks/useProfile.ts
import { useAuth } from '@/features/auth'

export function useProfile() {
  const { user } = useAuth() // ✅ Using another feature
  // ...
}
```

### Pattern 2: Shared Components
If a component is used by multiple features:
- Move it to `/components` if it's generic UI
- Keep it in the feature if it contains business logic

### Pattern 3: API Services
```typescript
// features/my-feature/api/myFeatureService.ts
export const myFeatureService = {
  getData: async () => {
    const response = await fetch('/api/data')
    return response.json()
  },
}
```

## Testing

Test features as units:

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

## Migration Guide

If you're moving from a different structure:

1. Create feature folder
2. Move related files to feature
3. Create public API (index.ts)
4. Update imports across codebase
5. Test thoroughly

## Questions?

- **When to create a new feature?** When you have multiple related screens or complex business logic
- **When to merge features?** When features are tightly coupled
- **How to share code?** Via public API exports
- **Where to put shared UI?** In `/components`
- **Where to put global utils?** In `/utils`

