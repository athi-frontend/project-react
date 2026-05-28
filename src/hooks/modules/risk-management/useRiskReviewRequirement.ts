import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import {
  fetchRiskReviewRequirement,
  upsertRiskReviewRequirement,
} from '@/services/modules/risk-management/risk-review-requirement'
import { CreateRiskReviewRequirementRequest } from '@/types/modules/risk-management/risk-review-requirement'

/**
 * Risk Review Requirement Hooks
 * Classification: Confidential
 */

export const useRiskReviewRequirement = (projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW_REQUIREMENT.LIST, projectId],
    queryFn: () => fetchRiskReviewRequirement(projectId),
    enabled: !!projectId,
  })
}

export const useUpsertRiskReviewRequirement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRiskReviewRequirementRequest) => upsertRiskReviewRequirement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW_REQUIREMENT.LIST],
      })
      // Invalidate Risk Review Fetch ALL after risk review requirement is upserted
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_ALL],
      })
    },
  })
}
