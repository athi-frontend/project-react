/**
 * Classification: Confidential
 * Burn In Types
 */

export interface BurnInFeatureDetail {
  model_feature_mapper_id: number
  feature_name: string
  feature_description?: string
  test_protocol_id?: number | null
  burn_in_test_protocol_id?: number | null
}

export interface BurnInData {
  burn_in_id?: number
  product_variants_id: number
  model_name?: string
  feature_details?: BurnInFeatureDetail[]
  is_burn_in_required: string | number | null
  description: string | null
}

export interface BurnInApiResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description?: string
  data: BurnInData[]
}

export interface BurnInPayload {
  burn_in_id?: number
  project_id: number | string
  product_variants_id: number
  is_burn_in_required: string | number
  description: string
}

export interface ProductFeatureData {
  feature_model_id: number
  model_id: number
  product_feature_id: number
  feature_name: string
  feature_description: string
}

export interface ProductFeatureApiResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description?: string
  data: ProductFeatureData[]
}

