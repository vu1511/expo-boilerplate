/**
 * Register Screen
 * Route file that uses the auth feature
 */

import { RegisterForm, useAuth } from '@/features/auth'

export default function RegisterScreen() {
  const { register, isLoading } = useAuth()

  return <RegisterForm onSubmit={register} isLoading={isLoading} />
}
