/**
 * Individual Risk Analysis Service
 * Classification: Confidential
 */

import { INDIVIDUAL_RISK_ANALYSIS_API_ENDPOINTS } from '@/constants/modules/risk-management/individualResidualRiskAnalysis'
import { apiClient } from '@/shared/apiClient'

export const fetchAllIndividualRiskAnalysis = async (project_id: number, status: number) => {
  const response = await apiClient.get(
    INDIVIDUAL_RISK_ANALYSIS_API_ENDPOINTS.GET_ALL,
    {
      params: {
        project_id: project_id,
        status: status,
      },
    }
  )
  return response.data
}

export const fetchIndividualRiskAnalysisById = async (risk_id: number) => {
  const response = await apiClient.get(
    INDIVIDUAL_RISK_ANALYSIS_API_ENDPOINTS.GET_BY_ID(risk_id)
  )
  return response.data
}

export const upsertIndividualRiskAnalysis = async (payload: {
  risk_id: number
  justification: string
  selection: string
}) => {
  return apiClient.post(INDIVIDUAL_RISK_ANALYSIS_API_ENDPOINTS.UPSERT, payload)
}
