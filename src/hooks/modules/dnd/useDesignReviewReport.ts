import { useQuery, useMutation } from '@tanstack/react-query'
import { FETCH_ACTIONS } from '@/constants/modules/dnd/prototype'
import { getAction } from '@/services/modules/dnd/prototype'
import { fetchDesignReviewInfo,saveDesignReview,fetchDesignStages,fetchMembers } from '@/services/modules/dnd/designReviewReport'


export const useDesignReviewInfo = (reviewId: number) => {
  return useQuery({
    queryKey: ['designReview', reviewId],
    queryFn: () => fetchDesignReviewInfo(reviewId),
    enabled: !!reviewId,
  })
}

export const useSaveDesignReview = () => {
  return useMutation({
    mutationFn: saveDesignReview,
  })
}

export const useGetDesignStages = () => {
  return useQuery({
    queryKey: ['designStages'],
    queryFn: fetchDesignStages,
  })
}

export const useGetMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
  })
}

export const useGetAction = (execution_stage_id: number) => {
  return useQuery({
    queryKey: [FETCH_ACTIONS, execution_stage_id],
    queryFn: () => getAction(execution_stage_id),
    enabled: !!execution_stage_id,
  })
}