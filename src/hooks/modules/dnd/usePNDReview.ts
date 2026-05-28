import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchPNDReview,
  upsertPNDReview,
} from '@/services/modules/dnd/pndReview'
import { KEYS } from '@/constants/modules/dnd/pnd-review'
import { PndReviewData } from '@/types/modules/dnd/pndReview'

export const usePndReviewFetch = (projectId: number) => {
  return useQuery({
    queryKey: [KEYS.FETCH_PND_REVIEW],
    queryFn: () => fetchPNDReview(projectId),
    enabled: !!projectId
  })
}

export const usePNDReviewUpsert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PndReviewData) => upsertPNDReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.FETCH_PND_REVIEW],
      })
    },
  })
}
