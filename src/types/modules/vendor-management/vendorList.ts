/**
    Classification : Confidential
**/

import { FileDocument } from '@/types/components/ui/fileUploadV3'

// Type aliases for union types
export type StringOrNumberOrNull = string | number | null
export type NumberOrStringOrNull = number | string | null

export interface Vendor {
  id: number
  vendor_type_id: number
  vendor_type_name: string
  vendor_name: string
  address: string
  location: string
  contact_person_name: string
  telephone_number: string
  email: string
  website: string
  is_iso_certified: boolean
  status: number
  sno?: number
  vendor_reevaluation_frequency_id?: number
  documents?: VendorFormFile[]
  part_categories?: VendorPartCategory[]
}

// Define VendorPartCategory interface
/**
 * The VendorPartCategory interface defines the structure for vendor part category entities within the system.
 *
 * Properties:
 * - `id`: The unique identifier for the vendor part category.
 * - `sno`: A unique serial number assigned to each vendor part category. It is primarily used
 *   as an identifier or for ordering purposes in vendor part category listings.
 * - `part_category_type_name`: The name of the part category type.
 */
export interface VendorPartCategory {
  id?: number | string
  tempId?: number | string
  /**
   * Serial number uniquely identifying the vendor.
   * Often used for sorting or indexing vendor records.
   */
  sno?: number
  part_category_type_name?: string
  part_subcategory_type_name?: string
  part_category_subclass_name?: string
  part_category_name?: string
  part_category_id?: string
  part_category_type_id?: string
  part_subcategory_type_id?: string
  part_category_subclass_id?: string
  part_category_selection_criteria_id?: string | number
  vendor_selection_criteria_id?: string | number
  part_type_id?: string
  part_sub_type_id?: string
  part_sub_class_id?: string
  leadTimeDays?: string
  lead_time_days?: number | null
  minOrderQty?: string
  moq_detail?: number | null
}

export interface VendorListResponse {
  code: number
  message: string
  data: Vendor[]
}
/**
 * The Vendor interface defines the structure for vendor entities within the system.
 *
 * Properties:
 * - `sno`: A unique serial number assigned to each vendor. It is primarily used
 *   as an identifier or for ordering purposes in vendor listings.
 * - `location`: The location of the vendor.
 * - `contact_person_name`: The name of the contact person for the vendor.
 * - `telephone_number`: The telephone number of the vendor.
 * - `email`: The email address of the vendor.
 * - `website`: The website of the vendor.
 * - `is_iso_certified`: Whether the vendor is ISO certified.
 * - `status`: The status of the vendor.
 */

export interface VendorListTableRow {
  id: number
  /**
   * Serial number uniquely identifying the vendor.
   * Often used for sorting or indexing vendor records.
   */
  sno: number
  vendor_type_name: string
  vendor_name: string
  telephone_number: string
  status: number
  actions?: any
}

export interface VendorFormData {
  vendor_name: string
  vendor_type_id: number | null
  address: string
  location: string
  contact_person_name: string
  telephone_number: string
  email: string
  status: number
  website: string
  vendor_reevaluation_frequency_id: number | null
  create_meta_data?: any
  update_meta_data?: any
  documents_to_create?: File[]
  documents_to_delete?: string[]
  vendor_id?: number
}

export interface VendorCreateUpdateResponse {
  code: number
  message: string
  data: any
}

export type VendorFormFile = File | FileDocument

export interface FormErrors {
  vendor_type_id?: string
  vendor_name?: string
  address?: string
  location?: string
  contact_person_name?: string
  telephone_number?: string
  email?: string
  website?: string
  vendor_reevaluation_frequency_id?: string
  is_iso_certified?: string
  status?: string
  form?: string
  certificate_documents?: string
}

export const DEFAULT_FORM_DATA: VendorFormData = {
  vendor_name: '',
  vendor_type_id: null,
  address: '',
  location: '',
  contact_person_name: '',
  telephone_number: '',
  email: '',
  website: '',
  vendor_reevaluation_frequency_id: null,
  is_iso_certified: null,
  status: null,
  documents_to_create: [],
  documents_to_delete: [],
}

export interface VendorPartCategoryFormData {
  part_type_id: string
  part_sub_type_id: string
  part_sub_class_id: string
  part_category_id: string
  leadTimeDays: string
  minOrderQty: string
  vendor_selection_criteria_id: string | null
  part_category_type_id?: string
  part_subcategory_type_id?: string
  part_category_subclass_id?: string
  part_category_type_name?: string
  part_subcategory_type_name?: string
  part_category_subclass_name?: string
  part_category_name?: string
  part_category_selection_criteria_id?: string | number | null
}
