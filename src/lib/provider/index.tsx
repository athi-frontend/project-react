'use client'
import ThemeProvider from './themeProvider'
import { Provider } from 'react-redux'
import { store } from '../../store/store'
import { ChildrenProps } from '@/types/common'
import ReactQueryProvider from './queryProvider'
import { AuthProvider } from './authProvider'

function Providers({ children }: ChildrenProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
      </AuthProvider>
    </Provider>
  )
}

export default Providers
