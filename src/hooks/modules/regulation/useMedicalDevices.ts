import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMedicalDeviceComplaints,
  postMedicalDeviceComplaints,
} from '@/services/modules/regulation/medicalDevice'
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS

export const useFetchMedicalDeviceComplaints = (organizationSiteId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.MEDICAL_DEVICE.FETCH_BY_ID],
    queryFn: () => fetchMedicalDeviceComplaints(organizationSiteId),
    enabled: enabled && !!organizationSiteId,
  })
}

export const usePostMedicalDeviceComplaints = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postMedicalDeviceComplaints,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.MEDICAL_DEVICE.FETCH_BY_ID],
      })
      showActionAlert(SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}
