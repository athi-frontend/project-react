/**
 * Classification: Confidential
 * Hooks for Goods Inward module
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAllGoodsInward,
  fetchGoodsInwardById,
  upsertGoodsInward,
  deleteGoodsInward,
  getPurchaseOrdersListWithParams,
  fetchSanityCheckInspection,
} from '@/services/modules/quality-control-management/goodsInward'
import { QUERY_KEYS } from '@/constants/modules/quality-control-management/goodsInward'
import { PURCHASE_ORDERS_LIST_KEY } from '@/constants/modules/purchase/purchaseOrder'

export const useAllGoodsInward = (status?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_GOODS_INWARD, status],
    queryFn: () => fetchAllGoodsInward(status),
  })
}

export const useGoodsInwardById = (goodsInwardId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GOODS_INWARD_BY_ID, goodsInwardId],
    queryFn: () => fetchGoodsInwardById(goodsInwardId),
    enabled: !!goodsInwardId,
  })
}

export const useUpsertGoodsInward = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => upsertGoodsInward(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_GOODS_INWARD] })
      // Invalidate the specific goods inward by ID query if goods_inward_id exists (edit mode)
      if (variables.goods_inward_id) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GOODS_INWARD_BY_ID, variables.goods_inward_id],
        })
      }
    },
  })
}

export const useDeleteGoodsInward = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (goodsInwardId: number) => deleteGoodsInward(goodsInwardId),
    onSuccess: (data, goodsInwardId) => {
      // Invalidate list query to refresh the grid
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_GOODS_INWARD] })
      // Invalidate the specific goods inward by ID query
      // This ensures that when user navigates to edit page, the changes show immediately
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GOODS_INWARD_BY_ID, goodsInwardId],
      })
    },
  })
}

// Use purchase order hook pattern with status=1&vendor_id params
export const useGetPurchaseOrdersList = (vendorId?: number) => {
  return useQuery({
    queryKey: [PURCHASE_ORDERS_LIST_KEY, vendorId],
    queryFn: () => getPurchaseOrdersListWithParams(vendorId),
    enabled: !!vendorId,
  })
}

// Fetch sanity check inspection data by purchase order ID
export const useSanityCheckInspection = (
  purchaseOrderId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SANITY_CHECK_INSPECTION, purchaseOrderId],
    queryFn: () => fetchSanityCheckInspection(purchaseOrderId),
    enabled: enabled && !!purchaseOrderId,
  })
}

