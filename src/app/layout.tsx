
import '@/styles/global/global.css'
import Providers from '@/lib/provider/index'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { CssBaseline } from '@mui/material'
import { poppins } from '@/config/constants'
import { metadata } from '@/config/site'
export { metadata }
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.className}>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>
            <CssBaseline />
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
