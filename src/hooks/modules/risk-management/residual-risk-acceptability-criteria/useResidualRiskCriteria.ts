/**
 *Classification : Confidential
**/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchResidualRiskCriteria,
  submitResidualRiskCriteria,
  fetchRiskSubCategoriesForMultiple,
} from '@/services/modules/risk-management/residualRiskCriteria'
import {
  RESIDUAL_RISK_CRITERIA_QUERY_KEYS
} from '@/constants/modules/risk-management/residualRiskCriteria'
import { showActionAlert } from '@/components/ui'
import { SubmitPayload } from '@/types/modules/risk-management/residualRiskCriteria'
import { SUCCESS, FAILED } from '@/constants/modules/dnd/pnd'
import { NUMBERMAP } from '@/constants/common'

export const useFetchResidualRiskCriteria = (projectId: number) => {
  return useQuery({
    queryKey: [RESIDUAL_RISK_CRITERIA_QUERY_KEYS.CRITERIA_FETCH_QUERY_KEY, projectId],
    queryFn: () => fetchResidualRiskCriteria(projectId),
    enabled: !!projectId,
    refetchOnMount : 'always'
  })
}

export const useSubmitResidualRiskCriteria = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitPayload) => submitResidualRiskCriteria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RESIDUAL_RISK_CRITERIA_QUERY_KEYS.CRITERIA_FETCH_QUERY_KEY],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

export const useFetchRiskSubCategoriesForSection = (categoryIds: number[], projectId: number, sectionKey: string) => {
  return useQuery({
    queryKey: [RESIDUAL_RISK_CRITERIA_QUERY_KEYS.RISK_SUBCATEGORY_QUERY_KEY, categoryIds, projectId, sectionKey],
    queryFn: () => fetchRiskSubCategoriesForMultiple(categoryIds, projectId),
    enabled: !!projectId && categoryIds.length > NUMBERMAP.ZERO,
  })
}