/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from '../features/auth/types'

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar: 'https://i.pravatar.cc/150?img=1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockTokens: AuthTokens = {
  accessToken: 'mock-access-token-' + Date.now(),
  refreshToken: 'mock-refresh-token-' + Date.now(),
  expiresIn: 3600,
}

/**
 * Auth Service
 * Replace with real API calls in production
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials) => {
    await delay(1000) // Simulate API call

    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required')
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Mock success
    return {
      user: mockUser,
      tokens: mockTokens,
    }

    // Real API call would look like:
    // const response = await fetch(`${env.apiUrl}/auth/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-API-Key': env.apiKey,
    //   },
    //   body: JSON.stringify(credentials),
    // })
    // if (!response.ok) throw new Error('Login failed')
    // return response.json()
  },

  /**
   * Register new user
   */
  register: async (credentials: RegisterCredentials) => {
    await delay(1000) // Simulate API call

    // Mock validation
    if (!credentials.name || !credentials.email || !credentials.password) {
      throw new Error('All fields are required')
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Mock success
    return {
      user: { ...mockUser, name: credentials.name, email: credentials.email },
      tokens: mockTokens,
    }
  },

  /**
   * Logout current user
   */
  logout: async () => {
    await delay(500) // Simulate API call
    // Clear tokens on server, etc.
  },

  /**
   * Refresh access token
   */
  refreshToken: async (_refreshToken: string) => {
    await delay(500)
    return {
      ...mockTokens,
      accessToken: 'mock-access-token-' + Date.now(),
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    await delay(500)
    return mockUser
  },
}
