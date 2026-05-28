/**
 *Classification : Confidential
 **/
import { apiClient } from '../../../shared/apiClient'
import { RESIDUAL_RISK_CRITERIA_API_ENDPOINTS } from '@/constants/modules/risk-management/residualRiskCriteria'
import { SubmitPayload } from '@/types/modules/risk-management/residualRiskCriteria'

export const fetchResidualRiskCriteria = async (projectId: number) => {
  const response = await apiClient.get(
    RESIDUAL_RISK_CRITERIA_API_ENDPOINTS.FETCH_CRITERIA,
    { params: { project_id: projectId } }
  )
  return response.data
}

export const submitResidualRiskCriteria = async (payload: SubmitPayload) => {
  const response = await apiClient.post(
    RESIDUAL_RISK_CRITERIA_API_ENDPOINTS.SUBMIT_CRITERIA,
    payload
  )
  return response.data
}

export const fetchRiskSubCategoriesForMultiple = async (
  categoryIds: number[],
  projectId: number
) => {
  const response = await apiClient.get(
    RESIDUAL_RISK_CRITERIA_API_ENDPOINTS.RISK_SUBCATEGORY_MULTIPLE,
    {
      params: {
        category_id: categoryIds.join(','),
        project_id: projectId,
      },
    }
  )
  return response.data
}
