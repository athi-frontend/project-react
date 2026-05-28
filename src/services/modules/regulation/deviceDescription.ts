import { apiClient } from '@/shared/apiClient'
import { DEVICE_DESCRIPTION_API_ENDPOINTS } from '@/constants/modules/regulation/deviceDescription'

export const submitDeviceDescription = async (data: any) => {
  const response = await apiClient.post(
    DEVICE_DESCRIPTION_API_ENDPOINTS.POST,
    data
  )
  return response.data
}

export const getDeviceDescriptionData = async (deviceMasterFileId: number) => {
  const response = await apiClient.get(
    DEVICE_DESCRIPTION_API_ENDPOINTS.FETCH_BY_ID(deviceMasterFileId)
  )
  return response.data
}

export const fetchSpecificationAspects = async () => {
  const response = await apiClient.get(
    DEVICE_DESCRIPTION_API_ENDPOINTS.FETCH_SPECIFICATION_ASPECTS
  )
  return response.data
}
