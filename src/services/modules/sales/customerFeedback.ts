import { apiClient } from '@/shared/apiClient'
import { CUSTOMER_FEEDBACK } from '@/constants/modules/sales/customerFeedback'
import { SALES_DROPDOWN_ENDPOINTS } from '@/constants/modules/sales/common'
import { CustomerFeedbackApiResponse, CustomerFeedbackDetailApiResponse, OrderAcknowledgementApiResponse, OrderApprovalModeApiResponse, CustomerApiResponse, ProductGroupApiResponse, ProductCategoryApiResponse, ProductTypeApiResponse, ProductSubTypeApiResponse, ProductApiResponse, CustomerFeedbackCriteriaApiResponse, RatingApiResponse } from '@/types/modules/sales/customerFeedback'

/**
 * Classification : Confidential
 **/

const {
  CUSTOMER_FEEDBACK_API_ENDPOINTS: {
    GET_CUSTOMER_FEEDBACK_LIST,
    GET_CUSTOMER_FEEDBACK_BY_ID,
    DELETE_CUSTOMER_FEEDBACK,
  },
} = CUSTOMER_FEEDBACK

const {
  GET_ORDER_ACKNOWLEDGEMENT_LIST,
  GET_ORDER_APPROVAL_MODE_LIST,
  GET_CUSTOMER_LIST,
  GET_PRODUCT_GROUP_LIST,
  GET_PRODUCT_CATEGORY_LIST,
  GET_PRODUCT_TYPE_LIST,
  GET_PRODUCT_SUBTYPE_LIST,
  GET_PRODUCT_LIST,
  GET_CUSTOMER_FEEDBACK_CRITERIA,
  GET_RATING_LIST,
} = SALES_DROPDOWN_ENDPOINTS

export const getCustomerFeedbackList = async (): Promise<CustomerFeedbackApiResponse> => {
  const response = await apiClient.get(GET_CUSTOMER_FEEDBACK_LIST)
  return response.data
}

export const getCustomerFeedbackById = async (customerFeedbackId: number): Promise<CustomerFeedbackDetailApiResponse> => {
  const response = await apiClient.get(`${GET_CUSTOMER_FEEDBACK_BY_ID}/${customerFeedbackId}`)
  return response.data
}

export const getOrderAcknowledgementList = async (): Promise<OrderAcknowledgementApiResponse> => {
  const response = await apiClient.get(GET_ORDER_ACKNOWLEDGEMENT_LIST)
  return response.data
}

export const getOrderApprovalModeList = async (): Promise<OrderApprovalModeApiResponse> => {
  const response = await apiClient.get(GET_ORDER_APPROVAL_MODE_LIST)
  return response.data
}

export const getCustomerList = async (): Promise<CustomerApiResponse> => {
  const response = await apiClient.get(GET_CUSTOMER_LIST)
  return response.data
}

export const getProductGroupList = async (): Promise<ProductGroupApiResponse> => {
  const response = await apiClient.get(GET_PRODUCT_GROUP_LIST)
  return response.data
}

export const getProductCategoryList = async (): Promise<ProductCategoryApiResponse> => {
  const response = await apiClient.get(GET_PRODUCT_CATEGORY_LIST)
  return response.data
}

export const getProductTypeList = async (): Promise<ProductTypeApiResponse> => {
  const response = await apiClient.get(GET_PRODUCT_TYPE_LIST)
  return response.data
}

export const getProductSubTypeList = async (
  productTypeId: string | number
): Promise<ProductSubTypeApiResponse> => {
  const id = String(productTypeId ?? '').trim()
  if (!id) {
    return { code: 200, status: 'success', message: '', response_timestamp: '', description: '', data: [] }
  }
  const url = `${GET_PRODUCT_SUBTYPE_LIST}?product_type_id=${id}`
  const response = await apiClient.get(url)
  return response.data
}

export const getProductList = async (): Promise<ProductApiResponse> => {
  const response = await apiClient.get(GET_PRODUCT_LIST)
  return response.data
}

export const getCustomerFeedbackCriteria = async (productId: string | number): Promise<CustomerFeedbackCriteriaApiResponse> => {
  const id = String(productId ?? '').trim()
  if (!id) {
    return { code: 200, status: 'success', message: '', response_timestamp: '', description: '', data: [] }
  }
  const response = await apiClient.get(`${GET_CUSTOMER_FEEDBACK_CRITERIA}/${id}`)
  return response.data
}

export const getRatingList = async (): Promise<RatingApiResponse> => {
  const response = await apiClient.get(GET_RATING_LIST)
  return response.data
}

export const deleteCustomerFeedback = async (customerFeedbackId: number): Promise<any> => {
  const response = await apiClient.delete(`${DELETE_CUSTOMER_FEEDBACK}/${customerFeedbackId}`)
  return response.data
}

export const upsertCustomerFeedback = async (payload: FormData): Promise<any> => {
  // Uses the base customer feedback endpoint for create/update via POST (form-data)
  const response = await apiClient.post(GET_CUSTOMER_FEEDBACK_BY_ID, payload)
  return response.data
}
