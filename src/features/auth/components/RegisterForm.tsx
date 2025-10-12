/**
 * RegisterForm Component
 * Reusable registration form with validation
 */

import { Link } from 'expo-router'
import React from 'react'
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useTranslation } from '@/hooks/use-translation'

import { useAuthForm } from '../hooks/useAuthForm'
import type { RegisterCredentials } from '../types'

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>
  isLoading?: boolean
}

export function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
  const { t } = useTranslation()
  const { values, errors, handleChange, validate } = useAuthForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = async () => {
    if (!validate(['name', 'email', 'password', 'confirmPassword'])) {
      return
    }

    try {
      await onSubmit({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Registration failed')
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('auth.register.title', 'Create Account')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{t('auth.register.subtitle', 'Sign up to get started')}</ThemedText>

      <View style={styles.form}>
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>{t('auth.name', 'Full Name')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={values.name}
            onChangeText={handleChange('name')}
            editable={!isLoading}
          />
          {errors.name && <ThemedText style={styles.error}>{errors.name}</ThemedText>}
        </View>

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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>{t('auth.confirmPassword', 'Confirm Password')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            secureTextEntry
            editable={!isLoading}
          />
          {errors.confirmPassword && <ThemedText style={styles.error}>{errors.confirmPassword}</ThemedText>}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? t('common.loading', 'Loading...') : t('auth.register.button', 'Sign Up')}
          </ThemedText>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            {t('auth.register.hasAccount', 'Already have an account?')}{' '}
          </ThemedText>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.link}>{t('auth.login.title', 'Sign In')}</ThemedText>
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
