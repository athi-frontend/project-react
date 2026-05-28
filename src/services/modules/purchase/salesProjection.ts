import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/purchase/salesProjection'
import { SalesProjectionDetailResponse } from '@/types/modules/purchase/salesProjection'

/**
 * Classification : Confidential
 **/

export const getSalesProjectionDetail = async (status_on_date: string): Promise<SalesProjectionDetailResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.SALES_PROJECTION_DETAIL(status_on_date))
  return response.data
}

export const postSalesProjection = async (payload: any) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_SALES_PROJECTION, payload)
  return response.data
}

