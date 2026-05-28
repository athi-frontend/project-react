/**
 * Classification : Confidential
 **/

const BASE_API_PATH = 'api/v1/vendor-purchase'

export const API_ENDPOINTS = {
  SALES_PROJECTION_DETAIL: (status_on_date: string) => 
    `${BASE_API_PATH}/sales-projection/detail?status_on_date=${status_on_date}`,
  POST_SALES_PROJECTION: `${BASE_API_PATH}/sales-projection/`,
} as const

export const QUERY_KEYS = {
  SALES_PROJECTION_DETAIL: 'salesProjectionDetail',
  POST_SALES_PROJECTION: 'postSalesProjection',
} as const

export const BUTTON_LABELS = {
  INITIATE_PURCHASE_ORDER: 'Initiate Purchase Order',
} as const

