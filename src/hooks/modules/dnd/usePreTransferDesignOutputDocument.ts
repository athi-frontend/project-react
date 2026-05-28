import { FIELDS, PROJECT, QUERY_KEYS } from "@/constants/modules/dnd/preTransferDesignOutputDocument"
import { fetchAllPreTransfer, fetchByIDPreTransfer, uploadPreTransferDocument } from "@/services/modules/dnd/preTransferDesignOutputDocument"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { NUMBERMAP } from '@/constants/common'

export const usePreTransfer = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRE_TRANSFER, projectId],
    queryFn: () => fetchAllPreTransfer(projectId),
    enabled: !!projectId,
  })
}

export const useUploadPreTransferDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => uploadPreTransferDocument(formData),
    onSuccess: (_, variables) => {
      const designTransferPlanId = Number(variables.get(FIELDS.DESIGN_TRANSFER_PLAN_ID))
      const projectId = Number(variables.get(PROJECT))

      if (designTransferPlanId) {
        queryClient.invalidateQueries([QUERY_KEYS.PRE_TRANSFER_BY_ID, designTransferPlanId])
      }

      if (projectId) {
        queryClient.invalidateQueries([QUERY_KEYS.PRE_TRANSFER, projectId])
      }
    },
  })
}

export const usePreTransferByID = (design_transfer_plan_id: number) => {
 
  return useQuery({
    queryKey: [QUERY_KEYS.PRE_TRANSFER_BY_ID, design_transfer_plan_id],
    queryFn: () => {
      return fetchByIDPreTransfer(design_transfer_plan_id)
    },
    enabled: !!design_transfer_plan_id && design_transfer_plan_id !== NUMBERMAP.ZERO, 
  })
}