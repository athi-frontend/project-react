import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import {
  getTestLicenseChecklistById,
  postTestLicenseChecklist,
  getAddTestLicense,
  getAddTestLicenseById,
  getAddTestLicenseFiles,
  postAddTestLicense,
} from '@/services/modules/regulation/testLicenseCheckList'
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys'
import { STATUS, NUMBERMAP } from '@/constants/common'
import { showActionAlert } from '@/components/ui'
import { TestLicenseChecklistItem, TestLicenseChecklistApiResponse } from '@/types/modules/regulation/testLicenseChecklist'
const QUERY_KEY_TEST_LICENSE_CHECKLIST =
  REGULATION_QUERY_KEYS.TEST_LICENSE_CHECKLIST.FETCH_BY_ID

export const useTestLicenseChecklistById = (id: number, enabled: boolean = false) => {
  return useQuery<TestLicenseChecklistApiResponse, Error>({
    queryKey: [QUERY_KEY_TEST_LICENSE_CHECKLIST, id],
    queryFn: () => getTestLicenseChecklistById(id),
    enabled: enabled && !!id,
  })
}

export const useSaveTestLicenseChecklist = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (checklistData: TestLicenseChecklistItem[]) =>
      postTestLicenseChecklist(checklistData, id),
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_TEST_LICENSE_CHECKLIST],
      })
      // Also invalidate add test license queries to keep both pages in sync
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_BY_ID],
      })
      // Also invalidate add test license files queries
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_TEST_LICENSE_FILES],
      })
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useAddTestLicense = (userId: string) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_BY_ID, userId],
    queryFn: () => getAddTestLicense(userId),
    enabled: !!userId,
  });
};

export const useAddTestLicenseById = (id: number) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_BY_ID, id],
    queryFn: () => getAddTestLicenseById(id),
    enabled: !!id,
  });
};

export const useAddTestLicenseFiles = (checklistId?: number) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_TEST_LICENSE_FILES, checklistId],
    queryFn: () => getAddTestLicenseFiles(checklistId || NUMBERMAP.ZERO),
    enabled: !!checklistId,
  });
};

export const useSaveAddTestLicense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => postAddTestLicense(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.ADD_TEST_LICENSE.FETCH_TEST_LICENSE_FILES],
      });
      showActionAlert(STATUS.SUCCESS);
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};
