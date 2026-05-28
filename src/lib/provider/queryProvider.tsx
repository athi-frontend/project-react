import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { ReactQueryDefaultOption, server } from '@/config/constants'

export default function ReactQueryProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: ReactQueryDefaultOption,
        },
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {server === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
