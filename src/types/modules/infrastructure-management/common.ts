/**
 * Infrastructure Management Common Types
 * Classification: Confidential
 */

/**
 * Infrastructure Category Item
 */
export type InfrastructureCategory = {
  id: number
  category_name: string
  status: number
  created_at?: string
  updated_at?: string
}

/**
 * Infrastructure Type Item
 */
export type InfrastructureType = {
  id: number
  type_name: string
  infrastructure_category_id: number
  status: number
  created_at?: string
  updated_at?: string
}

/**
 * Infrastructure Serial Number Item
 */
export type InfrastructureSerialNumber = {
  id: number
  serial_number: string
  infrastructure_type_id: number
  status: number
  created_at?: string
  updated_at?: string
}

/**
 * API Response Types
 */
export type InfrastructureCategoryResponse = {
  data: InfrastructureCategory[]
  total?: number
  page?: number
  limit?: number
}

export type InfrastructureTypeResponse = {
  data: InfrastructureType[]
  total?: number
  page?: number
  limit?: number
}

export type InfrastructureSerialNumberResponse = {
  data: InfrastructureSerialNumber[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Maintenance Plan Item
 */
export type MaintenancePlan = {
  id: number
  maintenance_plan_name?: string
  maintenance_service_type_lk_id?: number
  status?: number
  created_at?: string
  updated_at?: string
}

/**
 * Maintenance Plan Response
 */
export type MaintenancePlanResponse = {
  data: MaintenancePlan[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Infrastructure Type Query Parameters
 */
export interface InfrastructureTypeQueryParams {
  infrastructure_category_id?: number
  status?: number
}

/**
 * Infrastructure Serial Number Query Parameters
 */
export interface InfrastructureSerialNumberQueryParams {
  infrastructure_type_id?: number
  status?: number
}

