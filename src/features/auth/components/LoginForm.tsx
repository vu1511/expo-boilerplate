/**
 * LoginForm Component
 * Reusable login form with validation
 */

import { Link } from 'expo-router'
import React from 'react'
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useTranslation } from '@/hooks/useTranslation'

import { useAuthForm } from '../hooks/useAuthForm'
import type { LoginCredentials } from '../types'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const { t } = useTranslation()
  const { values, errors, handleChange, validate } = useAuthForm({
    initialValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async () => {
    if (!validate(['email', 'password'])) {
      return
    }

    try {
      await onSubmit({
        email: values.email,
        password: values.password,
      })
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed')
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('auth.login.title', 'Welcome Back')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{t('auth.login.subtitle', 'Sign in to continue')}</ThemedText>

      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>{t('auth.email', 'Email')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="demo@example.com"
            value={values.email}
            onChangeText={handleChange('email')}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          {errors.email && <ThemedText style={styles.error}>{errors.email}</ThemedText>}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>{t('auth.password', 'Password')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={values.password}
            onChangeText={handleChange('password')}
            secureTextEntry
            editable={!isLoading}
          />
          {errors.password && <ThemedText style={styles.error}>{errors.password}</ThemedText>}
        </View>

        {/* Forgot Password Link */}
        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity>
            <ThemedText style={styles.forgotPassword}>{t('auth.forgotPassword', 'Forgot Password?')}</ThemedText>
          </TouchableOpacity>
        </Link>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? t('common.loading', 'Loading...') : t('auth.login.button', 'Sign In')}
          </ThemedText>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>{t('auth.login.noAccount', "Don't have an account?")} </ThemedText>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.link}>{t('auth.register.title', 'Sign Up')}</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
})
