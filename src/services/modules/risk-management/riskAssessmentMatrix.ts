import { API_ENDPOINTS } from '@/constants/modules/risk-management/riskAssessmentMatrix'
import { apiClient } from '@/shared/apiClient'
import { RiskAssessmentMatrixPayload } from '@/types/modules/risk-management/riskAssessmentMatrix'

/**
 * Classification: Confidential
 */

// API for fetching risk assessment matrix data
export const getRiskMatrix = async (project_id: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_RISK_MATRIX, { params: { project_id } }
  )
  return response.data
}

// API for upserting risk assessment matrix data
export const postRiskMatrix = async (payload: RiskAssessmentMatrixPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_RISK_MATRIX, payload)
  return response.data
}
