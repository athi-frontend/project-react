/**
 * Classification: Confidential
 * Types for Vendor Re-Evaluation Criteria module
 */

import { FileDocument } from '@/types/components/ui/fileUploadV3'

export interface FormData {
  partType: string
  partSubType: string
  partSubClass: string
  partCategoryName: string
  status: string
  logo: (File | FileDocument)[]
}

// Modal specific form data
export interface VendorReEvaluationCriteriaFormData {
  partGroupName: string
  criteria: string
  requirement: string
  status: string
  vendorGroupId?: string
  criteriaId?: string
  requirementId?: string
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
export interface VendorReEvaluationCriteriaFormErrors {
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

export interface VendorReEvaluationCriteriaData {
  id?: number
  part_type: string
  part_sub_type: string
  part_sub_class: string
  part_category_name: string
  logo?: (File | FileDocument)[]
  created_at?: string
  updated_at?: string
}

export interface VendorReEvaluationCriteriaResponse {
  data: VendorReEvaluationCriteriaData[]
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

export interface VendorReEvaluationCriteriaListItem {
  id: number
  sno: number
  part_type: string
  part_sub_type: string
  part_sub_class: string
  part_category_name: string
}

// Modal specific props
export interface VendorReEvaluationCriteriaModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: VendorReEvaluationCriteriaFormData) => Promise<void>
  initialData?: VendorReEvaluationCriteriaFormData
  criteriaId?: number
  existingGroupNames?: string[] // Array of existing group names to check for duplicates
  currentGroupName?: string // Current group name when editing (to exclude from duplicate check)
  existingCriteriaInGroup?: string[] // Array of existing criteria names in the current group to check for duplicates
}

// API Response Types
export interface VendorReEvaluationCriteriaApiData {
  criteria_id: number;
  part_type_id: number;
  part_type_name: string;
  part_subtype_id: number;
  part_subtype_name: string;
  part_subclass_id: number;
  part_subclass_name: string;
  part_category_id: number | null;
  part_category_name: string | null;
  status_id: number;
  criteria_details: CriteriaDetail[];
  supporting_files: any[];
  created_at?: string;
  updated_at?: string;
}

export interface CriteriaDetail {
  group_mapper_id: string | number;
  group_id: string | number;
  is_new_group: string;
  group_name: string;
  status_id: number;
  display_order: number;
  criteria: CriteriaItem[];
}

export interface CriteriaItem {
  criteria_mapper_id: string | number;
  criteria_id: string | number;
  is_new_criteria: string;
  criteria_name: string;
  requirement_id: number;
  requirement_name?: string;
  requirement_type?: string;
  display_order: number;
  status_id: number;
}

export interface VendorReEvaluationCriteriaApiResponse {
  data: VendorReEvaluationCriteriaApiData[];
  message: string;
  code: number;
}

export interface VendorGroupData {
  group_id: number;
  group_name: string;
  status_id: number;
  type: string;
}

export interface VendorGroupCriteriaData {
  criteria_id: number;
  criteria_name: string;
  group_id: number;
  status_id: number;
  type: string;
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

