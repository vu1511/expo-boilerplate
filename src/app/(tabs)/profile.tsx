/**
 * Profile Screen
 * Example of using the auth feature
 */

import { router } from 'expo-router'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/features/auth'
import { useTranslation } from '@/hooks/use-translation'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogin = () => {
    router.push('/(auth)/login')
  }

  const handleLogout = async () => {
    Alert.alert(t('auth.logout', 'Logout'), 'Are you sure you want to logout?', [
      { text: t('common.cancel', 'Cancel'), style: 'cancel' },
      {
        text: t('auth.logout', 'Logout'),
        style: 'destructive',
        onPress: async () => {
          await logout()
        },
      },
    ])
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('navigation.profile', 'Profile')}
      </ThemedText>

      {isAuthenticated && user ? (
        <View style={styles.content}>
          <View style={styles.userInfo}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>{user.name}</ThemedText>
          </View>

          <View style={styles.userInfo}>
            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText style={styles.value}>{user.email}</ThemedText>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>{t('auth.logout', 'Logout')}</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <ThemedText style={styles.notLoggedIn}>You are not logged in</ThemedText>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>{t('auth.login.button', 'Sign In')}</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  content: {
    gap: 16,
  },
  userInfo: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    gap: 8,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  notLoggedIn: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
