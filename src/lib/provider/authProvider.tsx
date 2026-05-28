'use client'
import { useDispatch, useSelector } from 'react-redux'
import { ChildrenProps } from '@/types/common'
import dynamic from 'next/dynamic'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RootState } from '@/types/modules/auth/login'
import { LOGIN_CONSTANTS } from '@/constants/modules/auth/login'
import { checkAuth } from '@/store/slices/authSlice'
import InitialLoader from '@/components/shared/Loading'
/**
   *Classification : Confidential
 **/
const { PATHS, PUBLIC_PATHS } = LOGIN_CONSTANTS

// Dynamic import for TenantVerification to ensure client-side only
const TenantVerification = dynamic(
  () => import('./tenantVerification').then(mod => ({ default: mod.TenantVerification })),
  {
    ssr: false,
    loading: () => <InitialLoader />
  }
)

export const getDomain = () => {
  if (typeof window !== 'undefined') {
    const url = window.location.href
    const urlObj = new URL(url)
    return urlObj.host
  }
  return ''
}

// Client-side only component
const AuthProviderClient = ({ children }: ChildrenProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  )
  const [isMounted, setIsMounted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (!authChecked) {
      dispatch(checkAuth())
    }
  }, [dispatch, authChecked])

  useEffect(() => {
    if (isMounted && !isLoading && !authChecked) {
      setAuthChecked(true)
    }
  }, [isLoading, isMounted, authChecked])

  useEffect(() => {
    if (!isMounted || !authChecked) return

    const isPublicPath = PUBLIC_PATHS.includes(pathname)
    const isPublicDynamicPath = /^\/a\/[^/]+$/.test(pathname ?? '')

    if (isAuthenticated && isPublicPath && isPublicDynamicPath) {
      router.replace(PATHS.HOME_PATH)
    } else if (!isAuthenticated && !isPublicPath && !isPublicDynamicPath) {
      router.replace(`${PATHS.LOGIN_PATH}?next=${encodeURIComponent(pathname)}`)
    }
  }, [dispatch, pathname, router, isAuthenticated, isMounted, authChecked])
  
  useEffect(() => {
    if (isMounted && authChecked && isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
      router.replace(PATHS.HOME_PATH)
    }
  }, [isMounted, authChecked, isAuthenticated, pathname, router])

  useEffect(() => {
    if (isMounted && authChecked && isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
      router.replace(PATHS.HOME_PATH)
    }
  }, [isMounted, authChecked, isAuthenticated, pathname, router])

  // Show loading while mounting or checking auth
  if (!isMounted || !authChecked) {
    return <InitialLoader />
  }

  if (isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
    return <InitialLoader />
  }

  if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
    return <InitialLoader />
  }

  return <>{children}</>
}

// Wrap with dynamic import to ensure client-side only
export const AuthProvider = dynamic(
  () => Promise.resolve(({ children }: ChildrenProps) => (
    <TenantVerification>
      <AuthProviderClient>
        {children}
      </AuthProviderClient>
    </TenantVerification>
  )),
  {
    ssr: false,
    loading: () => <InitialLoader />
  }
)
