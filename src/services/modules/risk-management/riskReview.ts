/**
 * Risk Review Services
 * Classification: Confidential
 */

import { apiClient } from '@/shared/apiClient'
import { RISK_REVIEW_API_ENDPOINTS } from '@/constants/modules/risk-management/riskReview'
import { UpsertRiskReviewRequest } from '@/types/modules/risk-management/riskReview'
import { NUMBERMAP } from '@/constants/common'

export const fetchRiskReviewAll = async (projectId: number) => {
  const response = await apiClient.get(RISK_REVIEW_API_ENDPOINTS.FETCH_ALL, {
    params: {
      project_id: projectId,
      is_review_required: NUMBERMAP.ONE,
    },
  })
  return response.data
}

export const fetchRiskReviewById = async (reviewRequirementId: number) => {
  const response = await apiClient.get(
    RISK_REVIEW_API_ENDPOINTS.FETCH_BY_ID(reviewRequirementId)
  )
  return response.data
}

export const fetchRiskReviewSummary = async () => {
  const response = await apiClient.get(RISK_REVIEW_API_ENDPOINTS.FETCH_SUMMARY)
  return response.data
}

export const upsertRiskReview = async (data: UpsertRiskReviewRequest) => {
  const response = await apiClient.post(RISK_REVIEW_API_ENDPOINTS.UPSERT, data)
  return response.data
}
