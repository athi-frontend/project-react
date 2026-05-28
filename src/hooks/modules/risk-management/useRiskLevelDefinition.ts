/**
 *Classification : Confidential
 **/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllProbabilityLevels,
  getAllSeverityLevels,
  getProbabilityLevelById,
  getSeverityLevelById,
  upsertProbabilityLevel,
  upsertSeverityLevel,
} from '@/services/modules/risk-management/riskLevelDefinition'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'

export const useGetAllProbabilityLevels = (projectId: number) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.PROBABILITY_LEVELS.LIST,
      projectId,
    ],
    queryFn: () => getAllProbabilityLevels(projectId),
    enabled: !!projectId,
  })
}

export const useGetAllSeverityLevels = (projectId: number) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.SEVERITY_LEVELS.LIST,
      projectId,
    ],
    queryFn: () => getAllSeverityLevels(projectId),
    enabled: !!projectId,
  })
}

export const useGetProbabilityLevelById = (
  projectId: number,
  templateId: number
) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.PROBABILITY_LEVELS.FETCH_BY_ID,
      projectId,
      templateId,
    ],
    queryFn: () => getProbabilityLevelById(projectId, templateId),
    enabled: !!projectId && !!templateId,
  })
}

export const useGetSeverityLevelById = (
  projectId: number,
  templateId: number
) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.SEVERITY_LEVELS.FETCH_BY_ID,
      projectId,
    ],
    queryFn: () => getSeverityLevelById(projectId, templateId),
    enabled: !!projectId,
  })
}

export const useUpsertProbabilityLevel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => upsertProbabilityLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.PROBABILITY_LEVELS.LIST,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS.FETCH_PROBABILITY_LEVELS],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: (error: any) => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useUpsertSeverityLevel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => upsertSeverityLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.SEVERITY_LEVELS.LIST,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS.FETCH_SEVERITY_LEVELS],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: (error: any) => {
      showActionAlert(STATUS.FAILED)
    },
  })
}