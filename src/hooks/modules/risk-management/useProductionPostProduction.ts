import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import {
  getProductionPostProduction,
  postProductionPostProduction,
} from '@/services/modules/risk-management/productionPostProduction'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
const { PRODUCTION_POST_PRODUCTION_INFO } = RISK_MANAGEMENT_QUERY_KEYS
/**
 * Classification: Confidential
 */
export const usUpsertProductionPostProduction = (project_id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [PRODUCTION_POST_PRODUCTION_INFO.UPSERT, project_id],
    mutationFn: postProductionPostProduction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTION_POST_PRODUCTION_INFO.FETCH_BY_ID, project_id],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useGetProductionPostProduction = (project_id: number) => {
  return useQuery({
    queryKey: [PRODUCTION_POST_PRODUCTION_INFO.FETCH_BY_ID, project_id],
    queryFn: () => getProductionPostProduction(project_id),
    enabled: !!project_id,
    refetchOnMount: 'always',
  })
}
