import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPlaceOfValidation,
  getValidationReport,
  postValidationReport,
  getDirOptions,
  getDecisionOptions,
  getFunctionalBlock,
  downloadTemplate
} from '@/services/modules/dnd/pilotValidationReport'
import { QUERY_KEYS } from '@/constants/modules/dnd/pilotValidationReport'
import { showActionAlert } from '@/components/ui'
import { FAILED } from '@/constants/modules/dnd/pnd'

export const useFetchPlaceValidation = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLACE_OF_VALIDATION, projectId],
    queryFn: () => getPlaceOfValidation(projectId),
    enabled: !!projectId,
  })
}

export const useFetchDecisionOptions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DECISION_OPTION],
    queryFn: getDecisionOptions,
  })
}

export const useFetchFunctionalBlock = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FUNCTIONAL_BLOCK_OPTION, projectId],
    queryFn: () => getFunctionalBlock(projectId),
    enabled: !!projectId,
  })
}

export const useFetchValidationReport = (validationId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VALIDATION_REPORT, validationId],
    queryFn: () => getValidationReport(validationId),
    enabled: !!validationId,
  })
}

export const useFetchDIR = (projectId: number, projectStageOrderId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DIR_OPTIONS, projectId, projectStageOrderId],
    queryFn: () => getDirOptions(projectId, projectStageOrderId),
    enabled: !!projectId && !!projectStageOrderId,
  })
}

export const usePostValidationReport = (validationId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [QUERY_KEYS.VALIDATION_REPORT],
    mutationFn: (data: FormData) => postValidationReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VALIDATION_REPORT, validationId] })
    },
  })
}

export const useDownloadTemplate = (templateId: number) => {
  return useMutation({
    mutationFn: () => downloadTemplate(templateId),
    onError: (error: Error) => {
      showActionAlert(FAILED)
    },
  })
}