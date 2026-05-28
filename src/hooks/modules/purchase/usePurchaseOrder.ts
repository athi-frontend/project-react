import { NUMBERMAP } from "@/constants/common"
import { 
  PURCHASE_ORDERS_LIST_KEY, 
  FETCH_PURCHASE_ORDER, 
  FETCH_ORDER_TYPES,
  FETCH_PART_NUMBERS,
  POST_PURCHASE_ORDER, 
  FORM_DATA_FIELDS, 
  COMMON_STRINGS 
} from "@/constants/modules/purchase/purchaseOrder"
import { 
  getPurchaseOrdersList, 
  getPurchaseOrder, 
  deletePurchaseOrder, 
  fetchOrderTypes,
  fetchPartNumbers,
  postPurchaseOrder,
  fetchPurchaseInformation
} from "@/services/modules/purchase/purchaseOrder"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from '@/constants/modules/quality-control-management/sanitySpecificationChecklist'

/**
*Classification : Confidential
**/
export const useGetPurchaseOrdersList = () => {
  return useQuery({
    queryKey: [PURCHASE_ORDERS_LIST_KEY],
    queryFn: () => getPurchaseOrdersList(),
  })
}

export const useGetPurchaseOrder = (purchase_order_id: number) => {
  return useQuery({
    queryKey: [FETCH_PURCHASE_ORDER, purchase_order_id],
    queryFn: () => getPurchaseOrder(purchase_order_id),
    enabled: !!purchase_order_id,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_LIST_KEY] })
    },
  })
}

export const useOrderTypes = () => {
  return useQuery({
    queryKey: [FETCH_ORDER_TYPES],
    queryFn: fetchOrderTypes,
  })
}

export const usePartNumbers = (vendor_id: any) => {
  return useQuery({
    queryKey: [FETCH_PART_NUMBERS, vendor_id],
    queryFn: () => fetchPartNumbers(vendor_id),
    enabled: !!vendor_id,
  })
}

export const usePostPurchaseOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationKey: [POST_PURCHASE_ORDER],
    mutationFn: postPurchaseOrder,
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_LIST_KEY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
      const formData = variables as FormData
      const purchaseOrderId = formData.get(FORM_DATA_FIELDS.PURCHASE_ORDER_ID)

      if (purchaseOrderId && typeof purchaseOrderId === COMMON_STRINGS.STRING) {
        queryClient.invalidateQueries({ queryKey: [FETCH_PURCHASE_ORDER, parseInt(purchaseOrderId as string)] })
      }
    },
  })
}

export const useFetchPurchaseInformation = () => {
  return useQuery({
    queryKey: ['fetchPurchaseInformation'],
    queryFn: () => fetchPurchaseInformation(),
  })
}