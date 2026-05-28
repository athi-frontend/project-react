import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProjectDetailHLDMarket,
  getProjectDetailHLDInfo,
  getProjectDetailHLDMarketDemography,
  submitProjectHLD,
} from '@/services/modules/dnd/hld'
import { STATUS } from '@/constants/common'
import { showActionAlert } from '@/components/ui'

export const useProjectDetailHLDInfo = (projectId: number) => {
  return useQuery({
    queryKey: ['projectDetailHLDInfo', projectId],
    queryFn: () => getProjectDetailHLDInfo(projectId),
    enabled: !!projectId,
  })
}

export const useProjectDetailHLDMarket = () => {
  return useQuery({
    queryKey: ['projectDetailHLDMarket'],
    queryFn: () => getProjectDetailHLDMarket(),
  })
}

export const useProjectDetailHLDMarketDemography = () => {
  return useQuery({
    queryKey: ['projectDetailHLDMarketDemography'],
    queryFn: () => getProjectDetailHLDMarketDemography(),
  })
}

export const useSaveProjectHLD = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formData }: { projectId?: number; formData: FormData }) =>
      submitProjectHLD(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projectDetailHLDInfo'],
      })
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
