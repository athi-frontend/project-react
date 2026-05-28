import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  submitDeviceDescription,
  getDeviceDescriptionData,
  fetchSpecificationAspects,
} from '@/services/modules/regulation/deviceDescription'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { QUERY_KEYS } from '@/constants/queryKeys'
const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS

export const useDeviceDescriptionQuery = (deviceMasterFileId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE_DESCRIPTION.FETCH_BY_ID],
    queryFn: () => getDeviceDescriptionData(deviceMasterFileId),
    enabled: enabled && !!deviceMasterFileId,
  })
}

export const useSaveDeviceDescription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: any) => submitDeviceDescription(formData),
    onSuccess: () => {
      showActionAlert(SUCCESS_ALERT)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVICE_DESCRIPTION.FETCH_BY_ID],
      })
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}

export const useSpecificationAspectsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE_DESCRIPTION.FETCH_SPECIFICATION_ASPECTS],
    queryFn: fetchSpecificationAspects,
  })
}
