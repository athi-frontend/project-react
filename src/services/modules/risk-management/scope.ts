import { API_ENDPOINTS } from '@/constants/modules/risk-management/scope'
import { apiClient } from '@/shared/apiClient'

/**
 * Classification: Confidential
 */
// API for Post scope
export const postScope = async (payload: any) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_SCOPE_API, payload)
  return response.data
}

// API for scope fetch
export const getScopeById = async (project_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_SCOPE(project_id))
  return response.data
}

// API for risk stages fetch
export const getRiskStages = async (status?: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_RISK_STAGES, {params: {status}}
  )
  return response.data
}
