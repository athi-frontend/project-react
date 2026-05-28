import { AppConfig } from '@/config/app-config'
import { API_CLIENT_ERROR, NUMBERMAP, unHandledErrorMessage } from '@/constants/common'
import {
  getRoleId,
  getTenantKey,
  waitForCriticalRequestIfNeeded,
  setLastApiError,
  getOrgId,
} from '@/lib/utils/common'
import { refreshSessionOnce, isRefreshBlocked, setRefreshBlocked, handleSessionTimeout } from '@/lib/utils/session'
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: AppConfig.baseURL,
  timeout: AppConfig.timeOut,
})

// Helper function to update request headers with new tokens
const updateRequestHeaders = (request: any, refreshResult: any) => {
  if (refreshResult.access_token) {
    request.headers['Authorization'] = `Bearer ${refreshResult.access_token}`
  }
  if (refreshResult.rbac_token) {
    request.headers['rbac_token'] = refreshResult.rbac_token
  }
  if (refreshResult.refresh_token) {
    request.headers['refresh_token'] = refreshResult.refresh_token
  }
}

// Helper function to handle unauthorized error
const handleUnauthorizedError = async (error: any) => {
  const description = error?.response?.data?.description ?? ''
  if(unHandledErrorMessage.includes(description)){
    setRefreshBlocked(true)
    handleSessionTimeout()
    return Promise.reject(error)
  }
  const refreshResult = await refreshSessionOnce()
  if (!refreshResult.success ) {
    return Promise.reject(error)
  }
  const originalRequest = error.config
  if (!originalRequest) {
    return Promise.reject(error)
  }
  updateRequestHeaders(originalRequest, refreshResult)
  return apiClient(originalRequest)
}

// Helper function to check if error is unauthorized
const isUnauthorizedError = (error: any) => {
  const description = error?.response?.data?.description ?? ''
  return error.response?.status === NUMBERMAP.UNAUTHORIZED_401 || (error.response?.status === NUMBERMAP.TOKENREVOKE_403 && unHandledErrorMessage.includes(description))
}

apiClient.interceptors.request.use(
  async (config) => {
    if (isRefreshBlocked()) {
      // Immediately reject if refresh has failed
      return Promise.reject(
        new Error(API_CLIENT_ERROR.SESSION_EXPIRED)
      )
    }
    const accessToken = localStorage.getItem('access_token')
    const rbacToken = localStorage.getItem('rbac_token')
    const refreshToken = localStorage.getItem('refresh_token')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    if (rbacToken) {
      config.headers['rbac_token'] = rbacToken
      config.headers['refresh_token'] = refreshToken
    }
    if (!config.skipCriticalWait) {
      await waitForCriticalRequestIfNeeded()
    }
    const roleId = getRoleId()
    const tenantKey = getTenantKey()
    const orgId = getOrgId()

    if (tenantKey) {
      config.headers['tenant_key'] = tenantKey
    }
    if (roleId) {
      config.headers.set('role_id', roleId)
    }
    if (orgId != null && orgId !== '') {
      config.headers.set('org_id', orgId);
      config.headers.set('organization_id', orgId);
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Store the error globally for alert modal access
    setLastApiError(error)

    if (error.response && isUnauthorizedError(error) && !error.config?.skipAuthRetry) {
      return handleUnauthorizedError(error)
    }
    return Promise.reject(error)
  }
)
