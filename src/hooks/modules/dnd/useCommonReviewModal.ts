import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getReviewers, submitReview } from '@/services/modules/dnd/submitReviewModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSubmitReview = (menuName: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => submitReview(data),
    onSuccess: () => {
      const queryKey = QUERY_KEYS[menuName].FETCH_BY_ID 
      const listQueryKey = QUERY_KEYS[menuName].FETCH_LIST 
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
      if (listQueryKey) {
        queryClient.invalidateQueries({ queryKey: [listQueryKey] })
      }
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useReviewers = (department_id: number) => {
  return useQuery({
    queryKey: ['reviewers'],
    queryFn: () => getReviewers(department_id),
  })
}