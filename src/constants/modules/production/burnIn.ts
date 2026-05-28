/**
 * Classification: Confidential
 * Burn In API Constants
 */

const BASE_API_PATH = '/api/v1/production'

export const BURN_IN_API = {
  FETCH_BY_PROJECT_ID: (project_id: string | number) => `${BASE_API_PATH}/burn-in/${project_id}`,
  CREATE_UPDATE: `${BASE_API_PATH}/burn-in/`,
  FETCH_PRODUCT_FEATURES: `${BASE_API_PATH}/product-feature/all`,
}

export const BURN_IN_QUERY_KEYS = {
  FETCH_BURN_IN: 'burnIn',
  FETCH_PRODUCT_FEATURES: 'productFeatures',
}

