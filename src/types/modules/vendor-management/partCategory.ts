/**
 * Classification: Confidential
 * Types for Part Category module
 */

import { FileDocument } from '@/types/components/ui/fileUploadV3'

/**
 * Represents a tag associated with a document or file
 * Used to categorize and filter documents by their tags
 */
export interface FileTag {
  tag_id: number
  tag_name: string
}

/**
 * Form data structure for Part Category create/edit forms
 * Maps frontend form field names to their values
 */
export interface FormData {
  partCategoryType: string
  partCategorySubType: string
  productCategorySubClass: string
  partCategoryName: string
  description: string
  status_name: string
  status_id: number
  documents: (File | FileDocument)[]
}

/**
 * Validation error messages for Part Category form fields
 * Used to display field-specific error messages to users
 */
export interface FormErrors {
  partCategoryType?: string
  partCategorySubType?: string
  productCategorySubClass?: string
  partCategoryName?: string
  description?: string
  status_id?: string
  documents?: string
  form?: string
}

/**
 * Represents a part category type option for dropdown selection
 * Used in part category type dropdown field
 */
export interface PartCategoryType {
  id: string
  name: string
}

/**
 * Represents a status option for dropdown selection
 * Used in status dropdown field (Active/Inactive)
 */
export interface StatusOption {
  id: string
  name: string
}

/**
 * Complete part category data structure
 * Represents a part category entity with all its properties
 */
export interface PartCategoryData {
  id?: number
  part_category_type: string
  part_category_sub_type: string
  product_category_sub_class: string
  part_category_name: string
  description?: string
  status: number
  documents?: (File | FileDocument)[]
  created_at?: string
  updated_at?: string
}

/**
 * API response structure for part category operations
 * Contains data, metadata, and response information from backend
 */
export interface PartCategoryResponse {
  data: PartCategoryData[]
  meta_info?: {
    task_info?: any
    action_control?: {
      permissions?: string[]
      menuId?: string
      formName?: string
    }
  }
  response?: {
    code: number
    message: string
  }
}

/**
 * Transformed data structure for displaying part categories in a table/list view
 * Includes display-specific fields like serial number
 */
export interface PartCategoryListItem {
  id: number
  sno: number
  part_category_type: string
  part_category_sub_type: string
  product_category_sub_class: string
  part_category_name: string
  description?: string
  status: number
}

/**
 * Raw part category item structure as returned from the API
 * Uses snake_case naming convention matching backend response
 */
export interface PartCategoryApiItem {
  part_category_id: number
  part_category_type: string
  part_category_sub_type: string
  part_category_subclass: string
  part_category_name: string
  description: string
  status_id: number
  status: string
}

/**
 * API response structure for list all part categories endpoint
 * Contains an array of part category items
 */
export interface PartCategoryListResponse {
  data: PartCategoryApiItem[]
}

/**
 * API response item for part category types dropdown
 */
export interface PartCategoryTypeApiItem {
  ref_id: number
  part_category_type: string
}

/**
 * API response item for part subcategory types dropdown
 */
export interface PartSubcategoryTypeApiItem {
  ref_id: number
  part_subcategory_type: string
}

/**
 * API response item for part category subclasses dropdown
 */
export interface PartCategorySubclassApiItem {
  ref_id: number
  part_category_subclass: string
}

/**
 * API response structure for part category types
 */
export interface PartCategoryTypesResponse {
  data: PartCategoryTypeApiItem[]
}

/**
 * API response structure for part subcategory types
 */
export interface PartSubcategoryTypesResponse {
  data: PartSubcategoryTypeApiItem[]
}

/**
 * API response structure for part category subclasses
 */
export interface PartCategorySubclassesResponse {
  data: PartCategorySubclassApiItem[]
}
