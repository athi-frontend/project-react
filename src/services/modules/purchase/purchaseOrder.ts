import { API_ENDPOINTS } from "@/constants/modules/purchase/purchaseOrder"
import { apiClient } from "@/shared/apiClient"
/**
*Classification : Confidential
**/

export const getPurchaseOrdersList = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PURCHASE_ORDERS)
  return response.data
}

export const getPurchaseOrder = async (purchase_order_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PURCHASE_ORDER(purchase_order_id))
  return response.data
}

export const deletePurchaseOrder = async (purchase_order_id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE_PURCHASE_ORDER(purchase_order_id))
  return response.data
}

export const fetchOrderTypes = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ORDER_TYPES)
  return response.data
}

export const fetchPartNumbers = async (vendor_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PART_NUMBERS(vendor_id))
  return response.data
}

export const postPurchaseOrder = async (payload: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_PURCHASE_ORDER, payload)
  return response.data
}

export const fetchPurchaseInformation = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PURCHASE_INFORMATION)
  return response.data
}
