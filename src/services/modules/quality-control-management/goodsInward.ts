/**
 * Classification: Confidential
 * API service functions for Goods Inward module
 */

import { apiClient } from '@/shared/apiClient'
import {
  API_ENDPOINTS,
  WORKFLOW_STATUS,
} from '@/constants/modules/quality-control-management/goodsInward'
import { API_ENDPOINTS as PURCHASE_ORDER_API_ENDPOINTS } from '@/constants/modules/purchase/purchaseOrder'
import {
  PurchaseOrderResponse,
  SanityCheckInspectionResponse,
} from '@/types/modules/quality-control-management/goodsInward'

export const fetchAllGoodsInward = async (status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_GOODS_INWARD, {
    params: { status: status },
  })
  return response.data
}

export const fetchGoodsInwardById = async (goodsInwardId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(goodsInwardId))
  return response.data
}

export const upsertGoodsInward = async (payload: any) => {
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT_GOODS_INWARD,
    payload
  )
  return response.data
}

export const deleteGoodsInward = async (goodsInwardId: number) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DELETE_GOODS_INWARD(goodsInwardId)
  )
  return response.data
}



// Use purchase order API endpoint with status=1&vendor_id params
export const getPurchaseOrdersListWithParams = async (
  vendorId?: number
): Promise<PurchaseOrderResponse> => {
  const params = vendorId ? `?status=1&vendor_id=${vendorId}` : '?status=1'
  const response = await apiClient.get(
    `${PURCHASE_ORDER_API_ENDPOINTS.FETCH_PURCHASE_ORDERS}${params}`
  )
  return response.data
}

// Fetch sanity check inspection data by purchase order ID
export const fetchSanityCheckInspection = async (
  purchaseOrderId: number
): Promise<SanityCheckInspectionResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_SANITY_CHECK_INSPECTION,
    {
      params: {
        purchase_order_id: purchaseOrderId,
        workflow_status: WORKFLOW_STATUS,
      },
    }
  )
  return response.data
}
