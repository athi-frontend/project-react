'use client'
import { ChildrenProps } from '@/types/common'
import { useEffect, useState } from 'react'
import { verifyTenant } from '@/services/common'
import { NotFound } from '@/components/ui'
import { finishCriticalRequest } from '../utils/common'
import { NUMBERMAP } from '@/constants/common'
import InitialLoader from '@/components/shared/Loading'

/**
 * Classification: Confidential
 */

// Custom hook to safely get domain on client side
const useDomain = () => {
  const [domain, setDomain] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const url = window.location.href
      const urlObj = new URL(url)
      // setDomain(urlObj.host)
      setDomain("dev-msi-t-1-p.i2itechsolutions.com")
    }
  }, [])

  return { domain, isClient }
}

// Separate Tenant Verification Component
export const TenantVerification = ({ children }: ChildrenProps) => {
  const [tenantVerified, setTenantVerified] = useState(false)
  const [tenantLoading, setTenantLoading] = useState(true)
  const [tenantError, setTenantError] = useState(false)
  
  // Use custom hook for safe domain extraction
  const { domain, isClient } = useDomain()

  // Verify tenant when component mounts and domain is available
  useEffect(() => {
    const verifyTenantDomain = async () => {
      try {
        setTenantLoading(true)
        setTenantError(false)
        
        // Wait for client side and domain to be available
        if (!isClient || !domain) {
          return
        }
        const response = await verifyTenant(domain)
        
        // Check if response has data and tenant_id
        if (response && response.status === 'success' && response.code === NUMBERMAP.TWOHUNDRED && response.data && response.data.length > NUMBERMAP.ZERO && response.data[NUMBERMAP.ZERO].tenant_id) {
          finishCriticalRequest('', response.data[NUMBERMAP.ZERO].tenant_id,'')
          setTenantVerified(true)
          setTenantLoading(false)
        } else {
          setTenantError(true)
        }
      } catch (error) {
        console.error('Tenant verification failed:', error)
        setTenantError(true)
      } finally {
        setTenantLoading(false)
      }
    }

    if (isClient && domain) {
      verifyTenantDomain()
    }
  }, [isClient, domain])

  // Show loading while verifying tenant
  if (tenantLoading && !tenantVerified && !tenantError) {
    return <InitialLoader />
  }

  // Show tenant not found error
  if (tenantError) {
    return <NotFound home={false} />
  }

  // Show loading while tenant verification is in progress
  if (!tenantVerified) {
    return <InitialLoader />
  }

  return <>{children}</>
} 