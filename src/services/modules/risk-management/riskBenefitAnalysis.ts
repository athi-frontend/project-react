/**
 *Classification : Confidential
 */
import { RISK_BENEFIT_CONSTANTS } from '@/constants/modules/risk-management/riskBenefitAnalysis'
import { apiClient } from '@/shared/apiClient'

export const fetchAllRiskBenefit = async (project_id: number | null) => {
  const response = await apiClient.get(
    RISK_BENEFIT_CONSTANTS.API_ENDPOINTS.fetchAllRiskBenefit,
    {
      params: {
        project_id: project_id,
      },
    }
  )
  return response?.data
}

export const submitBenefitRiskAnalysis = async (payload: {
  context_id: number[]
  context_type: string
  verification_type: string
}) => {
  const response = await apiClient.post(
    RISK_BENEFIT_CONSTANTS.API_ENDPOINTS.submitBenefitRiskAnalysis,
    payload
  )
  return response?.data
}