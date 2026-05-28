import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCustomerFeedbackList, getCustomerFeedbackById, getOrderAcknowledgementList, getOrderApprovalModeList, getCustomerList, deleteCustomerFeedback, getProductGroupList, getProductCategoryList, getProductTypeList, getProductSubTypeList, getProductList, getCustomerFeedbackCriteria, getRatingList, upsertCustomerFeedback } from '@/services/modules/sales/customerFeedback'
import { CUSTOMER_FEEDBACK } from '@/constants/modules/sales/customerFeedback'
import { CustomerFeedbackApiResponse, CustomerFeedbackDetailApiResponse, OrderAcknowledgementApiResponse, OrderApprovalModeApiResponse, CustomerApiResponse, ProductGroupApiResponse, ProductCategoryApiResponse, ProductTypeApiResponse, ProductSubTypeApiResponse, ProductApiResponse, CustomerFeedbackCriteriaApiResponse, RatingApiResponse } from '@/types/modules/sales/customerFeedback'

/**
 * Classification : Confidential
 **/

const {
  CUSTOMER_FEEDBACK_API_KEYS: {
    FETCH_CUSTOMER_FEEDBACK_LIST_KEY,
    FETCH_CUSTOMER_FEEDBACK_BY_ID_KEY,
    FETCH_ORDER_ACKNOWLEDGEMENT_LIST_KEY,
    FETCH_ORDER_APPROVAL_MODE_LIST_KEY,
    FETCH_CUSTOMER_LIST_KEY,
    FETCH_PRODUCT_GROUP_LIST_KEY,
    FETCH_PRODUCT_CATEGORY_LIST_KEY,
    FETCH_PRODUCT_TYPE_LIST_KEY,
    FETCH_PRODUCT_SUBTYPE_LIST_KEY,
    FETCH_PRODUCT_LIST_KEY,
    FETCH_CUSTOMER_FEEDBACK_CRITERIA_KEY,
    FETCH_RATING_LIST_KEY,
  },
} = CUSTOMER_FEEDBACK

export const useGetCustomerFeedbackList = () => {
  return useQuery<CustomerFeedbackApiResponse>({
    queryKey: [FETCH_CUSTOMER_FEEDBACK_LIST_KEY],
    queryFn: () => getCustomerFeedbackList(),
  })
}

export const useGetCustomerFeedbackById = (customerFeedbackId: number, enabled: boolean = true) => {
  return useQuery<CustomerFeedbackDetailApiResponse>({
    queryKey: [FETCH_CUSTOMER_FEEDBACK_BY_ID_KEY, customerFeedbackId],
    queryFn: () => getCustomerFeedbackById(customerFeedbackId),
    enabled: enabled && !!customerFeedbackId,
  })
}

export const useGetOrderAcknowledgementList = () => {
  return useQuery<OrderAcknowledgementApiResponse>({
    queryKey: [FETCH_ORDER_ACKNOWLEDGEMENT_LIST_KEY],
    queryFn: () => getOrderAcknowledgementList(),
  })
}

export const useGetOrderApprovalModeList = () => {
  return useQuery<OrderApprovalModeApiResponse>({
    queryKey: [FETCH_ORDER_APPROVAL_MODE_LIST_KEY],
    queryFn: () => getOrderApprovalModeList(),
  })
}

export const useGetCustomerList = () => {
  return useQuery<CustomerApiResponse>({
    queryKey: [FETCH_CUSTOMER_LIST_KEY],
    queryFn: () => getCustomerList(),
  })
}

export const useGetProductGroupList = () => {
  return useQuery<ProductGroupApiResponse>({
    queryKey: [FETCH_PRODUCT_GROUP_LIST_KEY],
    queryFn: () => getProductGroupList(),
  })
}

export const useGetProductCategoryList = () => {
  return useQuery<ProductCategoryApiResponse>({
    queryKey: [FETCH_PRODUCT_CATEGORY_LIST_KEY],
    queryFn: () => getProductCategoryList(),
  })
}

export const useGetProductTypeList = () => {
  return useQuery<ProductTypeApiResponse>({
    queryKey: [FETCH_PRODUCT_TYPE_LIST_KEY],
    queryFn: () => getProductTypeList(),
  })
}

export const useGetProductSubTypeList = (productTypeId: string | number) => {
  return useQuery<ProductSubTypeApiResponse>({
    queryKey: [FETCH_PRODUCT_SUBTYPE_LIST_KEY, String(productTypeId ?? '')],
    queryFn: () => getProductSubTypeList(productTypeId),
    enabled: !!productTypeId && String(productTypeId).trim() !== '',
  })
}

export const useGetProductList = () => {
  return useQuery<ProductApiResponse>({
    queryKey: [FETCH_PRODUCT_LIST_KEY],
    queryFn: () => getProductList(),
  })
}

export const useGetCustomerFeedbackCriteria = (productId: string | number, enabled: boolean = true) => {
  return useQuery<CustomerFeedbackCriteriaApiResponse>({
    queryKey: [FETCH_CUSTOMER_FEEDBACK_CRITERIA_KEY, String(productId ?? '')],
    queryFn: () => getCustomerFeedbackCriteria(productId),
    enabled: enabled && !!productId && String(productId).trim() !== '',
  })
}

export const useGetRatingList = () => {
  return useQuery<RatingApiResponse>({
    queryKey: [FETCH_RATING_LIST_KEY],
    queryFn: () => getRatingList(),
  })
}

export const useDeleteCustomerFeedback = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (customerFeedbackId: number) => deleteCustomerFeedback(customerFeedbackId),
    onSuccess: () => {
      // Invalidate and refetch customer feedback list
      queryClient.invalidateQueries({ queryKey: [FETCH_CUSTOMER_FEEDBACK_LIST_KEY] })
    },
  })
}

export const useUpsertCustomerFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FormData) => upsertCustomerFeedback(payload),
    onSuccess: () => {
      // Invalidate customer feedback list
      queryClient.invalidateQueries({ queryKey: [FETCH_CUSTOMER_FEEDBACK_LIST_KEY] })
      // Invalidate all customer feedback by ID queries to ensure fresh data on edit
      queryClient.invalidateQueries({ queryKey: [FETCH_CUSTOMER_FEEDBACK_BY_ID_KEY] })
    },
  })
}
