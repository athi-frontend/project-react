/**
 * Classification: Confidential
 * Types for Infrastructure Request module
 */

/**
 * FileDocument interface for API response
 * This represents the file document structure returned from the API
 */
export interface InfrastructureRequestDocument {
  file_id: number
  file_name: string
  file_description: string | null
  file_category: string
  file_category_id: number
  file_object_key: string
  purpose: string
  guid: string
  source: string
  file_size: number
  version: string
  updated_date: string | null
  updated_by: string | null
  status: number
  uploaded_date: string
  extension: string
  file_bucket: string
  file_tags: Array<{
    tag_id: number
    tag_name: string
  }>
}

export interface InfrastructureRequestResponse {
  infrastructure_request_id: number
  category_id: number
  type_id: number
  category_name: string
  type_name: string
  infrastructure_name: string
  description: string
  specification: string
  required_date: string
  status: number
  documents: InfrastructureRequestDocument[]
}

export interface InfrastructureRequestDetailResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: InfrastructureRequestResponse[]
  meta_info?: {
    action_control?: {
      permissions?: Array<{ action: string }>
      menuId?: number
      formName?: string
    }
    task_info?: {
      task_comments?: any[]
      reviewer_list?: any[]
      task_id?: number
    }
  }
}

export interface InfrastructureRequestListResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: InfrastructureRequestResponse[]
}

// Dropdown interfaces
export interface InfrastructureCategory {
  infrastructure_category_id: number
  infrastructure_category_name: string
  status: number
}

export interface InfrastructureType {
  infrastructure_type_id: number
  infrastructure_type_name: string
  status: number
}

export interface DropdownResponse<T> {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: T[]
}
