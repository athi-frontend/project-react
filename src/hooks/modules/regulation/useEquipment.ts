import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEquipment,
  createEquipment,
} from '@/services/modules/regulation/equipment'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { showActionAlert } from '@/components/ui'
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys'
const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS

export const useEquipment = (organizationSiteId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.EQUIPMENT.FETCH_BY_ID,organizationSiteId],
    queryFn: () => fetchEquipment(organizationSiteId),
    enabled: enabled && !!organizationSiteId,
  })
}

export const useCreateEquipment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.EQUIPMENT.FETCH_BY_ID],
      })
      showActionAlert(SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}
