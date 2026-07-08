/**
 * HealthQuest — TanStack Query Client Configuration
 *
 * Centralized query client with retry logic, stale time, and
 * garbage collection tuned for a mobile educational app.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes before background refetch
      staleTime: 5 * 60 * 1000,
      // Cache persists for 30 minutes after last usage
      gcTime: 30 * 60 * 1000,
      // Retry failed queries 2 times with exponential backoff
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      // Don't refetch on window focus (mobile doesn't have window focus like web)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
