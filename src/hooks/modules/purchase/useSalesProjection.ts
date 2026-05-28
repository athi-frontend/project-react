import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSalesProjectionDetail, postSalesProjection } from '@/services/modules/purchase/salesProjection'
import { QUERY_KEYS } from '@/constants/modules/purchase/salesProjection'
import { SalesProjectionDetailResponse } from '@/types/modules/purchase/salesProjection'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'

/**
 * Classification : Confidential
 **/

export const useGetSalesProjectionDetail = (status_on_date: string | null) => {
  return useQuery<SalesProjectionDetailResponse>({
    queryKey: [QUERY_KEYS.SALES_PROJECTION_DETAIL, status_on_date],
    queryFn: () => {
      if (!status_on_date) {
        throw new Error('status_on_date is required')
      }
      return getSalesProjectionDetail(status_on_date)
    },
    enabled: !!status_on_date,
  })
}

export const usePostSalesProjection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [QUERY_KEYS.POST_SALES_PROJECTION],
    mutationFn: postSalesProjection,
    onSuccess: () => {
      // Invalidate queries to refetch data after successful submission
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_PROJECTION_DETAIL] })
      showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
    },
  })
}

