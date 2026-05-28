import { API_ENDPOINTS } from "@/constants/modules/vendor-management/sampleOrders"
import { apiClient } from "@/shared/apiClient"
/**
*Classification : Confidential
**/

export const getSampleOrdersList = async (status?: string) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SAMPLE_ORDERS(status))
  return response.data
}

export const getSampleOrder = async (sample_order_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SAMPLE_ORDER(sample_order_id))
  return response.data
}

export const deleteSampleOrder = async (sample_order_id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE_SAMPLE_ORDER(sample_order_id))
  return response.data
}

export const fetchVendorTypes = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_VENDOR_TYPES)
  return response.data
}

export const fetchVendorList = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_VENDOR_LIST)
  return response.data
}

export const fetchPartNumbers = async (part_category_id?:number) => {
  let params = {}
  if(part_category_id){
    params ={part_category_id:part_category_id}
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PART_NUMBERS,{params:params})
  return response.data
}

export const fetchProductsByPart = async (part_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PRODUCTS_BY_PART(part_id))
  return response.data
}

export const postSampleOrder = async (payload: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_SAMPLE_ORDER, payload)
  return response.data
}
