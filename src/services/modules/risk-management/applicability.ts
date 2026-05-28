import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/risk-management/applicability'
import {
  ApplicabilityApiResponse,
  CreateApplicabilityRequest,
} from '@/types/modules/risk-management/applicability'
import { NUMBERMAP } from '@/constants/common'

/**
 * Applicability Services
 * Classification: Confidential
 */

export const fetchApplicability = async (
  projectId: number
): Promise<ApplicabilityApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, {
    params: {
      project_id: projectId,
      status: NUMBERMAP.ONE,
    },
  })
  return response.data
}

export const upsertApplicability = async (data: CreateApplicabilityRequest) => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, data)
  return response.data
}
