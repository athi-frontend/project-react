import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEssentialPrinciplesChecklistAll,
  getEssentialPrinciplesChecklistById,
  createEssentialPrinciplesChecklist,
  updateEssentialPrinciplesChecklist,
  deleteEssentialPrinciplesChecklist,
} from '@/services/modules/regulation/essentialPrinciplesChecklist'
import { STATUS } from '@/constants/common'
import { showActionAlert } from '@/components/ui'
import {
  CreateEssentialPrinciplesChecklistPayload
} from '@/types/modules/regulation/essentialPrinciplesChecklist'
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys'

/**
    Classification : Confidential
**/

export const useEssentialPrinciplesChecklistAll = (projectId: number) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ESSENTIAL_PRINCIPLES_CHECKLIST.LIST],
    queryFn: () => getEssentialPrinciplesChecklistAll(projectId),
    enabled: !!projectId,
  })
}

export const useEssentialPrinciplesChecklistById = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ESSENTIAL_PRINCIPLES_CHECKLIST.FETCH_BY_ID],
    queryFn: () => getEssentialPrinciplesChecklistById(id),
    enabled: enabled && !!id,
  })
}

export const useCreateEssentialPrinciplesChecklist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEssentialPrinciplesChecklistPayload) =>
      createEssentialPrinciplesChecklist(payload),
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS)
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ESSENTIAL_PRINCIPLES_CHECKLIST.LIST],
      })
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useUpdateEssentialPrinciplesChecklist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateEssentialPrinciplesChecklistPayload }) =>
      updateEssentialPrinciplesChecklist(id, payload),
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS)
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ESSENTIAL_PRINCIPLES_CHECKLIST.LIST],
      })
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useDeleteEssentialPrinciplesChecklist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEssentialPrinciplesChecklist(id),
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS)
      queryClient.invalidateQueries({ queryKey: [REGULATION_QUERY_KEYS.ESSENTIAL_PRINCIPLES_CHECKLIST.LIST] })
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
} 