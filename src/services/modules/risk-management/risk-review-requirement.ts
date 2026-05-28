import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/risk-management/risk-review-requirement'
import {
  RiskReviewRequirementApiResponse,
  CreateRiskReviewRequirementRequest,
} from '@/types/modules/risk-management/risk-review-requirement'
import { NUMBERMAP } from '@/constants/common'

/**
 * Risk Review Requirement Services
 * Classification: Confidential
 */

export const fetchRiskReviewRequirement = async (
  projectId: number
): Promise<RiskReviewRequirementApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, {
    params: {
      project_id: projectId,
      status: NUMBERMAP.ONE,
    },
  })
  return response.data
}

export const upsertRiskReviewRequirement = async (data: CreateRiskReviewRequirementRequest) => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, data)
  return response.data
}
