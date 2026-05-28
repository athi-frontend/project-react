import { QUALITY_LIST_KEY, QUALITY_REPORT, QUALITYINSTILATION, TEST } from "@/constants/modules/dnd/designQualityReport"
import { getQualityById, getQualityByOrderId, getQualityList, getTest, postQuality } from "@/services/modules/dnd/designQualityReport"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetQalityList = (projectId: number) => {
  return useQuery({
    queryKey: [QUALITY_LIST_KEY, projectId],
    queryFn: () => getQualityList(projectId),
    enabled: !!projectId,
  })
}


export const usePostQuality = () => {
  return useMutation({
    mutationKey: [QUALITYINSTILATION],
    mutationFn: postQuality,
  })
}

export const useTest = () => {
  return useQuery({
    queryKey: [TEST],
    queryFn: getTest,
  })
}


export const useQualityById = (id: number) => {
  return useQuery({
    queryKey: [QUALITY_REPORT, id],
    queryFn: () => getQualityById(id),
    enabled: !!id, 
  })
}

export const useQualityByOrderId = ( orderId: number) => {
  return useQuery({
    queryKey: [QUALITY_REPORT, orderId],
    queryFn: () => getQualityByOrderId( orderId),
    enabled: !!orderId,
  })
}