/**
 * Forgot Password Screen
 * Simple screen for password recovery
 */

import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useTranslation } from '@/hooks/use-translation'

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert('Success', 'Password reset link has been sent to your email')
    }, 1000)
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('auth.forgotPassword.title', 'Reset Password')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t('auth.forgotPassword.subtitle', 'Enter your email to receive a reset link')}
      </ThemedText>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>{t('auth.email', 'Email')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="demo@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? t('common.loading', 'Loading...') : t('auth.forgotPassword.button', 'Send Reset Link')}
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>{t('auth.forgotPassword.remember', 'Remember password?')} </ThemedText>
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
