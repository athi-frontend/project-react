import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/regulation/testLicenseCheckList'
import { TestLicenseChecklistItem } from '@/types/modules/regulation/testLicenseChecklist'

export const getTestLicenseChecklistById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(id))
  return response.data
}

export const postTestLicenseChecklist = async (
  checklistData: TestLicenseChecklistItem[],
  id: number
) => {
  const response = await apiClient.post(
    API_ENDPOINTS.POST_CHECKLIST(id),
    checklistData
  )
  return response.data
}

export const getAddTestLicense = async (userId: string) => {
  const endpoint = API_ENDPOINTS.GET_ADD_TEST_LICENSE(userId);
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const getAddTestLicenseById = async (id: number) => {
  const endpoint = API_ENDPOINTS.GET_ADD_TEST_LICENSE_BY_ID(id);
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const getAddTestLicenseFiles = async (checklistId: number) => {
  const endpoint = API_ENDPOINTS.GET_ADD_TEST_LICENSE_FILES(checklistId);
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const postAddTestLicense = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_ADD_TEST_LICENSE, formData);
  return response.data;
};