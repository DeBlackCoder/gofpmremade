/**
 * TanStack Query (React Query) configuration
 * Centralized setup for caching, refetching, and error handling
 */

import { QueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/utils/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (garbage collection)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error instanceof ApiClientError) {
          if (error.status >= 400 && error.status < 500) {
            if (![408, 429].includes(error.status)) {
              return false;
            }
          }
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
