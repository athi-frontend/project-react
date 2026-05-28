/**
 * Risk Review Hooks
 * Classification: Confidential
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRiskReviewAll,
  fetchRiskReviewById,
  fetchRiskReviewSummary,
  upsertRiskReview,
} from '@/services/modules/risk-management/riskReview'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { UpsertRiskReviewRequest } from '@/types/modules/risk-management/riskReview'

export const useRiskReviewAll = (projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_ALL, projectId],
    queryFn: () => fetchRiskReviewAll(projectId),
    enabled: !!projectId,
  })
}

export const useRiskReviewById = (reviewRequirementId: number) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_BY_ID,
      reviewRequirementId,
    ],
    queryFn: () => fetchRiskReviewById(reviewRequirementId),
    enabled: !!reviewRequirementId,
    refetchOnMount: 'always', // Always refetch when navigating to the screen
  })
}

export const useRiskReviewSummary = () => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_SUMMARY],
    queryFn: () => fetchRiskReviewSummary(),
  })
}

export const useUpsertRiskReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertRiskReviewRequest) => upsertRiskReview(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_BY_ID,
          variables.review_requirement_id,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_ALL],
      })
    },
  })
}
