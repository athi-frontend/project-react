import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAddTestLicenseById,
  getAddTestLicenseFiles,
  postAddTestLicense,
} from '@/services/modules/regulation/addTestLicense'
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { showActionAlert } from '@/components/ui'

export const useAddTestLicenseById = (id: number) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_BY_ID, id],
    queryFn: () => getAddTestLicenseById(id),
    enabled: !!id,
  })
}
export const useAddTestLicenseFiles = (checklistId?: number) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_TEST_LICENSE_FILES, checklistId],
    queryFn: () => getAddTestLicenseFiles(checklistId || NUMBERMAP.ZERO),
    enabled: !!checklistId,
  })
}

export const useSaveAddTestLicense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => postAddTestLicense(formData),
    onSuccess: () => {
      // Invalidate all queries that start with these keys
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_BY_ID],
      })
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_TEST_LICENSE_FILES],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
