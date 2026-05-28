import { apiClient } from '@/shared/apiClient'
import { MEDICAL_API } from '@/constants/modules/regulation/medicalDevice'

export const fetchMedicalDeviceComplaints = async (
  organizationSiteId: number
) => {
  const url = MEDICAL_API.FETCH(organizationSiteId)
  const response = await apiClient.get(url)
  return response.data
}

export const postMedicalDeviceComplaints = async (data: {
  organization_site_id: number
  handling_complaints: string
  handling_field_safety_action: string
}) => {
  const response = await apiClient.post(MEDICAL_API.POST, data)
  return response.data
}
