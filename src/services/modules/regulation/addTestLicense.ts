import { apiClient } from '@/shared/apiClient'
import { ADD_TEST_LICENSE_API_ENDPOINTS } from '@/constants/modules/regulation/addTestLicense'

export const getAddTestLicenseById = async (id: number) => {
  const response = await apiClient.get(
    ADD_TEST_LICENSE_API_ENDPOINTS.FETCH_BY_ID(id)
  )
  return response.data
}

export const getAddTestLicenseFiles = async (checklistId: number) => {
  const response = await apiClient.get(
    ADD_TEST_LICENSE_API_ENDPOINTS.FETCH_LICENSE_CHECKLIST_FILES(checklistId)
  )
  return response.data
}

export const postAddTestLicense = async (formData: FormData) => {
  const response = await apiClient.post(
    ADD_TEST_LICENSE_API_ENDPOINTS.POST,
    formData
  )
  return response.data
}
