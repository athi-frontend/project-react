import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getGeneralInformation,
  updateGeneralInformation,
} from '@/services/modules/regulation/generalInformation'
import { STATUS } from '@/constants/common'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { showActionAlert } from '@/components/ui'
import { GeneralInformationData } from '@/types/modules/regulation/generalInformation'

export const useGeneralInformation = (
  organizationSiteId: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GENERAL_INFORMATION.FETCH_BY_ID,organizationSiteId],
    queryFn: () => getGeneralInformation(organizationSiteId),
    enabled: enabled && !!organizationSiteId,
  })
}

export const useUpdateGeneralInformation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData }: { formData: Partial<GeneralInformationData> }) =>
      updateGeneralInformation(formData),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GENERAL_INFORMATION.FETCH_BY_ID],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
