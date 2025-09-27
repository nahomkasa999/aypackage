// Diagnostic log for query client
console.log('Loading query client...');

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
      gcTime: 30 * 60 * 1000, // 30 minutes - keep cache longer
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Retry failed requests once
      refetchOnReconnect: false, // Don't refetch on reconnect
    },
  },
})
