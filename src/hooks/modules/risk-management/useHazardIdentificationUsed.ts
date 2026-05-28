import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchHazardIdentificationUsed,
  fetchHazardIdentificationUsedList,
  upsertHazardIdentificationUsed,
} from '@/services/modules/risk-management/hazardIdentificationUsedService'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { STATUS } from '@/constants/common'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'

/**
 * Classification: Confidential
 */

// Fetch API - GET by ToolMapperId
export const useHazardIdentificationUsedByToolMapperId = (
  tool_mapper_id: number
) =>
  useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_USED
        .FETCH_BY_TOOL_MAPPER_ID,
      tool_mapper_id,
    ],
    queryFn: () => fetchHazardIdentificationUsed(tool_mapper_id),
    enabled: !!tool_mapper_id,
  })

// Fetch API - GET List (by project_id & status)
export const useHazardIdentificationUsedList = (
  project_id: number,
  status: number
) =>
  useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_USED.LIST,
    ],
    queryFn: () => fetchHazardIdentificationUsedList(project_id, status),
    enabled: !!project_id,
  })

// Upsert API - POST
export const useUpsertHazardIdentificationUsed = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => upsertHazardIdentificationUsed(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_USED
            .FETCH_BY_TOOL_MAPPER_ID,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD_IDENTIFICATION_USED.LIST,
        ],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
