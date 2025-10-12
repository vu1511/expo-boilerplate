/**
 * useAuthForm Hook
 * Handles form state and validation for auth forms
 */

import { useState } from 'react'

interface FormErrors {
  [key: string]: string | undefined
}

interface UseAuthFormOptions {
  initialValues?: Record<string, string>
  onSubmit?: (values: Record<string, string>) => void | Promise<void>
}

export function useAuthForm(options: UseAuthFormOptions = {}) {
  const [values, setValues] = useState<Record<string, string>>(options.initialValues || {})
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (field: string) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Invalid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return undefined
  }

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    return undefined
  }

  const validate = (fields: string[]): boolean => {
    const newErrors: FormErrors = {}

    fields.forEach((field) => {
      if (field === 'email') {
        newErrors.email = validateEmail(values.email || '')
      } else if (field === 'password') {
        newErrors.password = validatePassword(values.password || '')
      } else if (field === 'name') {
        newErrors.name = validateName(values.name || '')
      } else if (field === 'confirmPassword') {
        if (values.password !== values.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
      }
    })

    setErrors(newErrors)
    return Object.values(newErrors).every((error) => !error)
  }

  const reset = () => {
    setValues(options.initialValues || {})
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setErrors,
  }
}
