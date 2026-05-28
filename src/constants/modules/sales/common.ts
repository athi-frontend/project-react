/**
 * Classification : Confidential
 **/

// Base URL for Sales API
export const BASE_SALES_API = 'api/v1/sales'

// Base URL for DND API
export const BASE_DND_API = 'api/v1/dnd'

/**
 * Common dropdown endpoints for Sales module
 * These endpoints are shared across multiple sales modules to avoid duplication
 */
export const SALES_DROPDOWN_ENDPOINTS = {
  // Order related dropdowns
  GET_ORDER_ACKNOWLEDGEMENT_LIST: `${BASE_SALES_API}/order-acknowledgement/all`,
  GET_ORDER_APPROVAL_MODE_LIST: `${BASE_SALES_API}/order-approval-mode/all?status=1`,
  
  // Customer dropdowns
  GET_CUSTOMER_LIST: `${BASE_SALES_API}/customer/all`,
  
  // Product related dropdowns
  GET_PRODUCT_GROUP_LIST: `${BASE_DND_API}/product-group/all`,
  GET_PRODUCT_CATEGORY_LIST: `${BASE_DND_API}/product-category/all?status=1`,
  GET_PRODUCT_TYPE_LIST: `${BASE_DND_API}/product-type/all?status=1`,
  GET_PRODUCT_SUBTYPE_LIST: `${BASE_DND_API}/product-subtypes/all`,
  GET_PRODUCT_LIST: `${BASE_DND_API}/product/all`,
  
  // Customer Feedback related dropdowns
  GET_CUSTOMER_FEEDBACK_CRITERIA: `${BASE_SALES_API}/customer-feedback-criteria`,
  GET_RATING_LIST: `${BASE_SALES_API}/rating/all?status=1&sort=desc`,
} as const

