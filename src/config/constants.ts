import { Poppins } from 'next/font/google'
export const DefaultMode = 'light'
export const COMMON_API_ENDPOINTS = ''
export const server = process.env.NODE_ENV
export const ReactQueryDefaultOption = {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: 2,
}
export const supportedThemes: Record<string, string> = {
  light: 'light',
  dark: 'dark',
}

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})
export const publicPaths = ['/login', '/forgot-password', '/not-found']
