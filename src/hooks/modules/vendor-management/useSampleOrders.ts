import { 
  SAMPLE_ORDERS_LIST_KEY, 
  FETCH_SAMPLE_ORDER, 
  FETCH_VENDOR_TYPES, 
  FETCH_VENDOR_LIST, 
  FETCH_PART_NUMBERS, 
  FETCH_PRODUCTS_BY_PART,
  POST_SAMPLE_ORDER, 
  FORM_DATA_FIELDS, 
  COMMON_STRINGS 
} from "@/constants/modules/vendor-management/sampleOrders"
import { 
  getSampleOrdersList, 
  getSampleOrder, 
  deleteSampleOrder, 
  fetchVendorTypes, 
  fetchVendorList, 
  fetchPartNumbers, 
  fetchProductsByPart,
  postSampleOrder 
} from "@/services/modules/vendor-management/sampleOrders"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
/**
*Classification : Confidential
**/
export const useGetSampleOrdersList = (status?: string) => {
  return useQuery({
    queryKey: [SAMPLE_ORDERS_LIST_KEY, status],
    queryFn: () => getSampleOrdersList(status),
  })
}

export const useGetSampleOrder = (sample_order_id: number) => {
  return useQuery({
    queryKey: [FETCH_SAMPLE_ORDER, sample_order_id],
    queryFn: () => getSampleOrder(sample_order_id),
    enabled: !!sample_order_id,
  })
}

export const useDeleteSampleOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSampleOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SAMPLE_ORDERS_LIST_KEY] })
    },
  })
}

export const useVendorTypes = () => {
  return useQuery({
    queryKey: [FETCH_VENDOR_TYPES],
    queryFn: fetchVendorTypes,
  })
}

export const useVendorList = () => {
  return useQuery({
    queryKey: [FETCH_VENDOR_LIST],
    queryFn: fetchVendorList,
  })
}

export const usePartNumbers = (part_category_id?: number) => {
  return useQuery({
    queryKey: [FETCH_PART_NUMBERS, part_category_id],
    queryFn: () => fetchPartNumbers(part_category_id),
  })
}

export const useProductsByPart = (part_id: number | null) => {
  return useQuery({
    queryKey: [FETCH_PRODUCTS_BY_PART, part_id],
    queryFn: () => fetchProductsByPart(part_id),
    enabled: !!part_id,
  })
}

export const usePostSampleOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [POST_SAMPLE_ORDER],
    mutationFn: postSampleOrder,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SAMPLE_ORDERS_LIST_KEY] })
      const formData = variables as FormData
      const sampleOrderId = formData.get(FORM_DATA_FIELDS.SAMPLE_ORDER_ID)
      if (sampleOrderId && typeof sampleOrderId === COMMON_STRINGS.STRING) {
        queryClient.invalidateQueries({ queryKey: [FETCH_SAMPLE_ORDER, parseInt(sampleOrderId as string)] })
      }
    },
  })
}
