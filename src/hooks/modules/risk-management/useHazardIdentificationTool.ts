/**
 * Hazard Identification Tool Hooks
 * Classification: Confidential
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NUMBERMAP } from '@/constants/common'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import {
  fetchHazardIdentificationToolByProject,
  fetchHazardIdentificationToolDropdown,
  upsertHazardIdentificationTool,
} from '@/services/modules/risk-management/hazardIdentificationTool'

export const useHazardIdentificationToolDropdown = (
  status: number = NUMBERMAP.ONE
) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_TOOL.DROPDOWN
    ],
    queryFn: () => fetchHazardIdentificationToolDropdown(status),
  })
}

export const useHazardIdentificationToolByProject = (projectId: number) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_TOOL.FETCH_BY_PROJECT,
      projectId,
    ],
    queryFn: () => fetchHazardIdentificationToolByProject(projectId),
    enabled: projectId > NUMBERMAP.ZERO,
    refetchOnWindowFocus: false,
  })
}

export const useUpsertHazardIdentificationTool = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: upsertHazardIdentificationTool,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_TOOL.FETCH_BY_PROJECT,
          projectId,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_USED.LIST,
        ],
      })
    },
  })
}
