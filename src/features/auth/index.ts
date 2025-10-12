/**
 * Auth Feature - Public API
 * Only exports what other features/screens should use
 * Internal implementation details are kept private
 */

// Hooks
export { useAuth } from './hooks/useAuth'
export { useAuthForm } from './hooks/useAuthForm'

// Components
export { LoginForm } from './components/LoginForm'
export { RegisterForm } from './components/RegisterForm'

// Store
export { useAuthStore } from './store/authStore'

// Types
export type {
  AuthState,
  AuthStore,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  SocialLoginOptions,
  SocialProvider,
  User,
} from './types'
