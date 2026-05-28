/**
 * Classification : Confidential
 **/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllOtherHazards,
  getOtherHazardById,
  upsertOtherHazard,
  deleteOtherHazard,
} from '@/services/modules/risk-management/otherHazards'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { OTHER_HAZARD_QUERY_KEYS } from '@/constants/modules/risk-management/otherHazards'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'

export const useGetAllOtherHazards = (projectId: number | null) => {
  return useQuery({
    queryKey: [OTHER_HAZARD_QUERY_KEYS.LIST, projectId],
    queryFn: () => getAllOtherHazards(projectId),
    enabled: !!projectId && !isNaN(projectId),
     refetchOnMount: 'always'
  })
}

export const useGetOtherHazardById = (subCategoryId: number, projectId: number) => {
  return useQuery({
    queryKey: [OTHER_HAZARD_QUERY_KEYS.FETCH_BY_ID, subCategoryId],
    queryFn: () => getOtherHazardById(subCategoryId, projectId),
    enabled: !!subCategoryId && !isNaN(subCategoryId),
  })
}

export const useUpsertOtherHazard = (categoryId?: number, projectId?: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => upsertOtherHazard(data),
    onSuccess: () => {
      // Invalidate other hazard queries
      queryClient.invalidateQueries({
        queryKey: [OTHER_HAZARD_QUERY_KEYS.LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [OTHER_HAZARD_QUERY_KEYS.FETCH_BY_ID],
      })
      
      // Invalidate risk analysis control subcategories queries
      if (categoryId && projectId) {
        // Invalidate specific subcategory query
        queryClient.invalidateQueries({
          queryKey: [
            RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL.FETCH_SUBCATEGORIES,
            categoryId,
            projectId,
          ],
        })
      } else {
        // Invalidate all subcategory queries
        queryClient.invalidateQueries({
          queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL.FETCH_SUBCATEGORIES],
        })
      }
      
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useDeleteOtherHazard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subCategoryId: number) => deleteOtherHazard(subCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OTHER_HAZARD_QUERY_KEYS.LIST],
      })
      queryClient.invalidateQueries({
          queryKey: [
            RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL.FETCH_SUBCATEGORIES,
          ],
        })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
