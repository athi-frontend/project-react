

import { API_ENDPOINTS } from "@/constants/modules/dnd/designQualityReport"
import { apiClient} from "@/shared/apiClient"


export const getQualityList = async (projectId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.QUALITY_FETCH(projectId))
  return response.data
}

export const postQuality = async (payload: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_QUALITY, payload)
  return response.data
}

export const getTest = async () => {
  const response = await apiClient.get(API_ENDPOINTS.TEST, {})
  return response.data
}

export const getQualityById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_QUALITY(id));
  return response.data;
};

export const getQualityByOrderId = async ( orderId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.QUALITY_FETCH_BY_ORDER( orderId));
  return response.data;
};