import {
  addMarket,
  deleteMarketResearch,
  getMarketResearchList,
  fetchMarketResearchStudyById,
  updateMarketResearch,
} from '@/services/modules/dnd/marketStudy'
import { QUERY_KEYS } from '@/constants/modules/dnd/marketStudy'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAddMarketResearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (marketStudy: any) => addMarket(marketStudy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKET] })
    },
  })
}
export const useMarketResearchList = (projectId: string | number) => {
  return useQuery({
    queryKey: ['market-research-list', projectId],
    queryFn: () => getMarketResearchList(projectId),
    enabled: !!projectId,
  })
}

export const useMarketResearchById = (id: number | null) => {
  return useQuery({
    queryKey: ['market-research-by-id', id],
    queryFn: () => fetchMarketResearchStudyById(id),
    enabled: false,
  })
}

export const useDeleteMarketResearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMarketResearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKET] })
    },
  })
}

export const useUpdateMarketResearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: number; data: any }) =>
      updateMarketResearch(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKET] })
    },
  })
}
