# Folder Structure Research: `lib` vs `services`

## Executive Summary

After deep research into your codebase and industry best practices, here's a clear distinction between `lib/` and `services/` folders, along with recommendations for organizing your project.

---

## Core Distinction

### `lib/` (Library/Infrastructure)
**Purpose**: Low-level utilities, adapters, and infrastructure code that abstract or wrap third-party libraries.

**Characteristics**:
- Generic, reusable across entire app
- No business logic
- Abstractions over third-party libraries
- Configuration and setup code
- Infrastructure/foundation level

### `services/` (Application Services)
**Purpose**: Application-specific services that provide business capabilities and manage side effects.

**Characteristics**:
- Application-specific functionality
- May contain business logic
- Manages side effects (API calls, device features)
- User-facing capabilities
- Higher-level abstractions

---

## Current Project Analysis

### What's Currently in `lib/` ✅

```
src/lib/
├── storage.ts          # Storage adapter (MMKV wrapper) - ✅ Correct
├── icons/              # Icon factory system - ✅ Correct
└── providers/          # React providers (QueryClient) - ✅ Correct
```

**Why these belong in `lib/`:**
- `storage.ts`: Wraps MMKV library, provides adapter interface
- `icons/`: Factory functions for creating icon components
- `providers/`: React context provider configurations

### What's Currently in `services/` ✅

```
src/services/
├── haptics.ts          # Haptic feedback service - ✅ Correct
└── toast.ts            # Toast notification service - ✅ Needs implementation
```

**Why these belong in `services/`:**
- `haptics.ts`: Application-specific device interaction
- `toast.ts`: Application-specific UI capability

---

## Industry Best Practices

### Pattern 1: Infrastructure vs Application Layer

Based on Clean Architecture principles:

```
lib/         → Infrastructure layer (tools, adapters)
services/    → Application layer (use cases, business capabilities)
```

### Pattern 2: Library Wrappers vs Business Services

```
lib/         → Wrappers around external libraries
services/    → Business logic and app-specific features
```

### Pattern 3: Configuration vs Functionality

```
lib/         → Configuration, setup, utilities
services/    → Active functionality, interactions
```

---

## Decision Framework

Use this decision tree to determine where code belongs:

### Put in `lib/` if:
- ✅ Wraps a third-party library
- ✅ Provides generic utility functions
- ✅ Is configuration/setup code
- ✅ Creates adapters for external systems
- ✅ No business logic
- ✅ Reusable across projects

**Examples:**
- Storage adapters
- HTTP client configuration
- Icon factories
- React provider configurations
- Logger wrappers
- Date formatters
- Validation utilities

### Put in `services/` if:
- ✅ Provides application-specific functionality
- ✅ Manages side effects (API, device features)
- ✅ Contains business logic
- ✅ Handles user interactions
- ✅ Is domain-specific to your app

**Examples:**
- Toast service
- Modal service
- Haptic service
- Analytics service
- Notification service
- Deep linking service

---

## Specific Recommendations for Your Project

### ✅ Keep in `lib/`

1. **`lib/providers/queryClient.ts`** ✅ Already correct
   - Reason: Third-party library configuration
   - Similar to: Axios config, logger setup

2. **`lib/storage.ts`** ✅ Already correct
   - Reason: MMKV adapter wrapper
   - Generic storage interface

3. **`lib/icons/`** ✅ Already correct
   - Reason: Icon factory utilities
   - Generic component creation

### ✅ Keep in `services/`

1. **`services/haptics.ts`** ✅ Already correct
   - Reason: Application-specific device interaction
   - Manages side effects (haptic feedback)

2. **`services/toast.ts`** ✅ Correct location (needs implementation)
   - Reason: Application-specific UI capability
   - User-facing functionality

### ➕ Future Additions to `services/`

- `services/modal.ts` - Modal management service
- `services/analytics.ts` - Analytics tracking
- `services/notifications.ts` - Push notifications
- `services/deepLinking.ts` - Deep link handling
- `services/camera.ts` - Camera service wrapper
- `services/location.ts` - Location service

### ⚠️ Current Issue: `api/` folder

**Observation**: You have `src/api/authService.ts` but architecture docs say API services should be in `features/[feature]/api/`.

**Recommendation**: 
- Feature-specific APIs → `features/[feature]/api/`
- Global/shared API utilities → Could stay in `api/` OR move to `lib/apiClient.ts` if it's just HTTP client config

---

## Folder Comparison Table

| Aspect | `lib/` | `services/` |
|--------|--------|-------------|
| **Level** | Infrastructure | Application |
| **Reusability** | High (cross-project) | Medium (app-specific) |
| **Business Logic** | None | May contain |
| **Dependencies** | Third-party wrappers | Application logic |
| **Purpose** | "How" (tools) | "What" (capabilities) |
| **Examples** | Storage adapter, HTTP client config | Toast, Modal, Analytics |

---

## Real-World Examples

### Example 1: Storage
```typescript
// lib/storage.ts ✅
// Wraps MMKV, provides generic interface
export const storage = {
  getItem: (key: string) => mmkv.getString(key),
  setItem: (key: string, value: string) => mmkv.set(key, value),
}
```

### Example 2: Toast Service
```typescript
// services/toast.ts ✅
// Application-specific UI capability
export const toast = {
  show: (message: string) => { /* implementation */ },
  success: (message: string) => { /* implementation */ },
  error: (message: string) => { /* implementation */ },
}
```

### Example 3: QueryClient
```typescript
// lib/providers/queryClient.ts ✅
// Third-party library configuration
export const queryClient = new QueryClient({
  defaultOptions: { /* config */ }
})
```

---

## Edge Cases & Ambiguities

### 1. HTTP Client Configuration
**Question**: Where does Axios/Fetch client configuration go?

**Answer**: 
- Base configuration → `lib/apiClient.ts`
- Feature-specific API calls → `features/[feature]/api/`

### 2. Analytics
**Question**: Where does analytics tracking go?

**Answer**: `services/analytics.ts`
- It's application-specific business logic
- Manages side effects (tracking events)
- User-facing capability

### 3. Provider Components vs Provider Configs
**Question**: React Provider components - where?

**Answer**: 
- Provider **configuration** (QueryClient instance) → `lib/providers/`
- Provider **components** (QueryClientProvider) → Can be in `lib/providers/` or kept in `app/_layout.tsx`

---

## Migration Recommendations

### 1. Consistent API Organization
```
Current:
  src/api/authService.ts

Recommended:
  src/features/auth/api/authService.ts ✅ (Follows feature-based architecture)
  
OR if truly global:
  src/lib/apiClient.ts (if it's just HTTP client config)
```

### 2. Create Services Index
```typescript
// services/index.ts
export { haptics } from './haptics'
export { toast } from './toast'
// Future: export { modal } from './modal'
```

### 3. Document Your Patterns
Add examples in your architecture docs showing:
- What goes in `lib/` vs `services/`
- Decision criteria
- Examples from your codebase

---

## Final Recommendation

Your current organization is **mostly correct**! Here's what to maintain:

### ✅ Keep This Structure:

```
src/
├── lib/                    # Infrastructure & adapters
│   ├── storage.ts         # ✅ Adapter
│   ├── icons/             # ✅ Factory utilities
│   └── providers/         # ✅ Provider configs
│
├── services/              # Application services
│   ├── haptics.ts         # ✅ Device interaction
│   └── toast.ts           # ✅ UI capability
│
└── features/             # Business logic by domain
    └── auth/
        └── api/          # ✅ Feature-specific APIs
```

### ✅ Use This Mental Model:

**`lib/`** = "Tools and infrastructure we build to support the app"
- Think: Wrenches, adapters, configurations

**`services/`** = "Capabilities and features the app provides"
- Think: Toast notifications, modal dialogs, haptic feedback

---

## Conclusion

Your intuition about using `services/` for toast, modal, and haptic services is **100% correct**. The distinction is:

- **`lib/`** = Infrastructure utilities and adapters
- **`services/`** = Application-specific capabilities

This aligns with industry best practices and Clean Architecture principles. Keep it simple: if it's a tool/adapter → `lib/`, if it's a capability → `services/`.

---

## References

1. Clean Architecture principles
2. React Native best practices
3. Feature-based architecture patterns
4. Separation of concerns principles
5. Your project's architecture documentation

---

**Last Updated**: Based on codebase analysis and industry research

