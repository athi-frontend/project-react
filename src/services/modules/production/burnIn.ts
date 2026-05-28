/**
 * Classification: Confidential
 * Burn In Service
 */

import { apiClient } from '@/shared/apiClient'
import { BURN_IN_API } from '@/constants/modules/production/burnIn'
import { BurnInApiResponse, BurnInPayload, ProductFeatureApiResponse } from '@/types/modules/production/burnIn'

/**
 * Fetch burn-in data by project ID
 */
export const fetchBurnInByProjectId = async (
  project_id: string | number,
  product_variants_id?: number | string
): Promise<BurnInApiResponse> => {
  const params = product_variants_id ? { product_variants_id } : {}
  const response = await apiClient.get(BURN_IN_API.FETCH_BY_PROJECT_ID(project_id), {
    params,
  })
  return response.data
}

/**
 * Create or update burn-in record
 */
export const createOrUpdateBurnIn = async (
  payload: BurnInPayload
): Promise<BurnInApiResponse> => {
  const response = await apiClient.post(BURN_IN_API.CREATE_UPDATE, payload)
  return response.data
}

/**
 * Fetch product features by project ID and model ID
 */
export const fetchProductFeatures = async (
  project_id: string | number,
  model_id: string | number
): Promise<ProductFeatureApiResponse> => {
  const response = await apiClient.get(BURN_IN_API.FETCH_PRODUCT_FEATURES, {
    params: {
      project_id,
      model_id,
    },
  })
  return response.data
}

