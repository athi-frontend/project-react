import { API_ENDPOINTS } from '@/constants/modules/risk-management/productionPostProduction'
import { apiClient } from '@/shared/apiClient'

/**
 * Classification: Confidential
 */
// API for Post production post-production
export const postProductionPostProduction = async (payload: any) => {
  const response = await apiClient.post(
    API_ENDPOINTS.POST_PRODUCTION_POST_PRODUCTION_API,
    payload
  )
  return response.data
}

// API for production post-production fetch
export const getProductionPostProduction = async (project_id: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_PRODUCTION_POST_PRODUCTION,
    { params: { project_id } }
  )
  return response.data
}
