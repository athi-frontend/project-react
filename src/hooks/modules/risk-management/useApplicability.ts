import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import {
  fetchApplicability,
  upsertApplicability,
} from '@/services/modules/risk-management/applicability'
import { CreateApplicabilityRequest } from '@/types/modules/risk-management/applicability'
import { NUMBERMAP, USER_ACCESS_KEY } from '@/constants/common'

/**
 * Applicability Hooks
 * Classification: Confidential
 */

export const useApplicability = (projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.APPLICABILITY.LIST, projectId],
    queryFn: () => fetchApplicability(projectId),
    enabled: !!projectId,
    refetchOnMount : 'always'
  })
}

export const useUpsertApplicability = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateApplicabilityRequest) => upsertApplicability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => 
          [RISK_MANAGEMENT_QUERY_KEYS.APPLICABILITY.LIST,USER_ACCESS_KEY, RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL.FETCH_CATEGORIES].includes(query.queryKey[NUMBERMAP.ZERO] as string)
      })
    },
  })
}
