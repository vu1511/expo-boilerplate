/**
 * Login Screen
 * Route file that uses the auth feature
 */

import { LoginForm, useAuth } from '@/features/auth'

export default function LoginScreen() {
  const { login, isLoading } = useAuth()

  return <LoginForm onSubmit={login} isLoading={isLoading} />
}
