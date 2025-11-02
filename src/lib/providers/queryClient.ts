/**
 * React Query QueryClient Configuration
 *
 * This module creates and configures the QueryClient instance for TanStack Query.
 * Configure default options, error handling, and query behavior here.
 *
 * @see https://tanstack.com/query/latest/docs/react/overview
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Create and configure the QueryClient instance
 *
 * Default options can be configured here:
 * - retry logic
 * - stale time
 * - cache time
 * - refetch behavior
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configure default query options here
      // retry: 3,
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      // Configure default mutation options here
      // retry: 1,
    },
  },
})
