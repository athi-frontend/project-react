/**
 * Classification: Confidential
 * Default form data and utilities for Vendor Re-Evaluation Criteria module
 */

import { FormData } from '@/types/modules/vendor-management/vendorReEvaluationCriteria'

export const DEFAULT_FORM_DATA: FormData = {
  partType: '',
  partSubType: '',
  partSubClass: '',
  partCategoryName: '',
  status: '',
  logo: [],
}

/**
 * Formats the form data for API submission
 * @param formData - The form data to format
 * @returns Formatted data object
 */
export const formatVendorReEvaluationCriteriaData = (formData: FormData) => {
  return {
    part_type: formData.partType,
    part_sub_type: formData.partSubType,
    part_sub_class: formData.partSubClass,
    part_category_name: formData.partCategoryName,
  }
}

/**
 * Validates the part type field
 * @param value - The value to validate
 * @returns Error message or empty string if valid
 */
export const validateReEvaluationPartType = (value: string): string => {
  if (!value || value.trim() === '') {
    return 'Part Type is required'
  }
  return ''
}

/**
 * Validates the part sub type field
 * @param value - The value to validate
 * @returns Error message or empty string if valid
 */
export const validateReEvaluationPartSubType = (value: string): string => {
  if (!value || value.trim() === '') {
    return 'Part Sub Type is required'
  }
  return ''
}

/**
 * Validates the part sub class field
 * @param value - The value to validate
 * @returns Error message or empty string if valid
 */
export const validateReEvaluationPartSubClass = (value: string): string => {
  if (!value || value.trim() === '') {
    return 'Part Sub Class is required'
  }
  return ''
}

/**
 * Validates the part category name field
 * @param value - The value to validate
 * @returns Error message or empty string if valid
 */
export const validateReEvaluationPartCategoryName = (value: string): string => {
  if (!value || value.trim() === '') {
    return 'Part Category Name is required'
  }
  return ''
}

/**
 * Resets form data to default values
 * @returns Default form data
 */
export const resetReEvaluationFormData = (): FormData => {
  return { ...DEFAULT_FORM_DATA }
}

