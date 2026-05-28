/**
 * Classification: Confidential
 * Types for Vendor Selection Criteria module
 */

import { FileDocument } from '@/types/components/ui/fileUploadV3'

export interface FormData {
  partType: string
  partSubType: string
  partSubClass: string
  partCategoryName: string
  status_id: number | null
  logo: (File | FileDocument)[]
}

// Modal specific form data
export interface VendorSelectionCriteriaFormData {
  partGroupName: string
  criteria: string
  requirement: string
  status: string
  vendorGroupId?: string
  criteriaId?: string
  requirementId?: string
  statusId?: string
}

export interface FormErrors {
  partType?: string
  partSubType?: string
  partSubClass?: string
  partCategoryName?: string
  status?: string
  logo?: string
  form?: string
}

// Modal specific form errors
export interface VendorSelectionCriteriaFormErrors {
  partGroupName?: string
  criteria?: string
  requirement?: string
  status?: string
  form?: string
}

export interface PartType {
  id: string
  name: string
}

export interface VendorSelectionCriteriaData {
  id?: number
  part_type: string
  part_sub_type: string
  part_sub_class: string
  part_category_name: string
  logo?: (File | FileDocument)[]
  created_at?: string
  updated_at?: string
}

export interface VendorSelectionCriteriaResponse {
  data: VendorSelectionCriteriaData[]
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

export interface VendorSelectionCriteriaListItem {
  id: number
  sno: number
  part_type: string
  part_sub_type: string
  part_sub_class: string
  part_category_name: string
}

// Modal specific props
export interface VendorSelectionCriteriaModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: VendorSelectionCriteriaFormData) => Promise<void>
  initialData?: VendorSelectionCriteriaFormData
  criteriaId?: number
}

// API Response Types
export interface VendorSelectionCriteriaApiData {
  vendor_selection_criteria_id: number;
  part_type_id: number;
  part_sub_type_id: number;
  part_sub_class_id: number;
  part_category_id: number;
  criteria_details: CriteriaDetail[];
  status: number;
  documents: any[];
  created_at?: string;
  updated_at?: string;
}

export interface CriteriaDetail {
  group_criteria_mapper_id: number;
  group_id: number;
  group_value: string;
  sub_group_id: number;
  sub_group_value: string;
  requirement_type: number;
  requirement_type_name: string;
  display_order: number;
  status: number;
}

export interface VendorSelectionCriteriaApiResponse {
  data: VendorSelectionCriteriaApiData[];
  message: string;
  code: number;
}

export interface VendorGroupData {
  ref_id: number;
  group_name: string;
  status: number;
}

export interface VendorGroupCriteriaData {
  ref_id: number;
  vendor_group_id: number;
  criteria: string;
  requirement_type: number;
  status: number;
}

export interface RequirementData {
  ref_id: number;
  requirement_type: string;
  status: number;
}

export interface PartTypeData {
  id: number;
  name: string;
  status: number;
}

export interface PartSubTypeData {
  id: number;
  name: string;
  part_type_id: number;
  status: number;
}

export interface PartSubClassData {
  id: number;
  name: string;
  part_sub_type_id: number;
  status: number;
}

export interface PartCategoryData {
  id: number;
  name: string;
  part_sub_class_id: number;
  status: number;
}