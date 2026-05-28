/**
 * Classification: Confidential
 */

import { useQuery } from '@tanstack/react-query'
import {
  fetchPurchaseOrders,
  fetchPurchaseOrderDetails,
  getPartDetails,
} from '@/services/modules/quality-control-management/common'
import {
  PURCHASE_ORDERS_HOOK,
  PURCHASE_ORDER_DETAILS_HOOK,
  PART_DETAILS_HOOK
} from '@/constants/modules/quality-control-management/common'
import {
  PurchaseOrderListResponse,
  PurchaseOrderDetailsListResponse,
  SanityCheckInspectionFetchResponse
} from '@/types/modules/quality-control-management/sanityCheckInspection'
import { NUMBERMAP } from '@/constants/common';

/**
 * Hook to fetch purchase orders with optional vendor filter
 * @param vendorId - Optional vendor ID filter
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Promise<PurchaseOrderListResponse>
 */
export const usePurchaseOrders = (vendorId?: number, enabled: boolean = true) => {
  return useQuery<PurchaseOrderListResponse, Error>({
    queryKey: [PURCHASE_ORDERS_HOOK, vendorId],
    queryFn: () => fetchPurchaseOrders(vendorId),
    enabled: enabled && !!vendorId,
  });
};

/**
 * Hook to fetch purchase order details by ID
 * @param purchaseOrderId - Purchase order ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Promise<PurchaseOrderDetailsListResponse>
 */
export const usePurchaseOrderDetails = (purchaseOrderId: number | null, enabled: boolean = true) => {
  return useQuery<PurchaseOrderDetailsListResponse, Error>({
    queryKey: [PURCHASE_ORDER_DETAILS_HOOK, purchaseOrderId],
    queryFn: () => fetchPurchaseOrderDetails(purchaseOrderId),
    enabled: enabled && !!purchaseOrderId,
  });
};

/**
 * Hook to fetch part details by purchase order ID and part detail ID
 * @param purchaseOrderId - Purchase order ID
 * @param partDetailId - Part detail ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Promise<SanityCheckInspectionFetchResponse>
 */
export const useGetPartDetails = (
  purchaseOrderId: number | null,
  partDetailId: number | null,
  enabled: boolean = true
) => {
  return useQuery<SanityCheckInspectionFetchResponse, Error>({
    queryKey: [PART_DETAILS_HOOK, purchaseOrderId, partDetailId],
    queryFn: () => getPartDetails(purchaseOrderId, partDetailId),
    enabled: enabled && !!(purchaseOrderId && partDetailId),
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};
