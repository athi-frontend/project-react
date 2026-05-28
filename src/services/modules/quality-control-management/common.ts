/**
 * Classification: Confidential
 */

import { apiClient } from '@/shared/apiClient'
import { NUMBERMAP } from '@/constants/common'
import { API_ENDPOINTS } from '@/constants/modules/quality-control-management/common'
import {
  PurchaseOrderListResponse,
  PurchaseOrderDetailsListResponse,
  SanityCheckInspectionFetchResponse
} from '@/types/modules/quality-control-management/sanityCheckInspection'

/**
 * Fetch purchase orders with optional vendor filter
 * @param vendorId - Optional vendor ID filter
 * @returns Promise<PurchaseOrderListResponse>
 */
export const fetchPurchaseOrders = async (vendorId?: number): Promise<PurchaseOrderListResponse> => {
  const params: any = {
    status: NUMBERMAP.ONE,
    ...(vendorId && { vendor_id: vendorId }),
  };
  const response = await apiClient.get(API_ENDPOINTS.PURCHASE_ORDERS_ALL, {
    params,
  });
  return response.data;
};

/**
 * Fetch purchase order details by ID
 * @param purchaseOrderId - Purchase order ID
 * @returns Promise<PurchaseOrderDetailsListResponse>
 */
export const fetchPurchaseOrderDetails = async (
  purchaseOrderId: number
): Promise<PurchaseOrderDetailsListResponse> => {
  const url = API_ENDPOINTS.PURCHASE_ORDER_DETAILS(purchaseOrderId);
  const response = await apiClient.get(url, {
    params: { status: NUMBERMAP.ONE },
  });
  return response.data;
};

/**
 * Fetch part details by purchase order ID and part detail ID
 * @param purchaseOrderId - Purchase order ID
 * @param partDetailId - Part detail ID
 * @returns Promise<SanityCheckInspectionFetchResponse>
 */
export const getPartDetails = async (
  purchaseOrderId: number,
  partDetailId: number
): Promise<SanityCheckInspectionFetchResponse> => {
  const url = API_ENDPOINTS.GET_PART_DETAILS(purchaseOrderId, partDetailId);
  const response = await apiClient.get(url);
  return response.data;
};

