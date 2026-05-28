/**
 * Classification: Confidential
 * Default form data and utilities for Part Category module
 */
import { NUMBERMAP } from '@/constants/common'
import { FormData } from '@/types/modules/vendor-management/partCategory'

export const DEFAULT_FORM_DATA: FormData = {
  partCategoryType: '',
  partCategorySubType: '',
  productCategorySubClass: '',
  partCategoryName: '',
  description: '',
  status_name: '',
  status_id: NUMBERMAP.ZERO,
  documents: [],
}


/**
 * Formats the form data for API submission
 * @param formData - The form data to format
 * @returns Formatted data object
 */
export const formatPartCategoryData = (formData: FormData) => {
  return {
    part_category_type: formData.partCategoryType ?? '',
    part_category_sub_type: formData.partCategorySubType ?? '',
    product_category_sub_class: formData.productCategorySubClass.trim() ?? '',
    part_category_name: formData.partCategoryName.trim() ?? '',
    description: (formData.description ?? '').trim(),
    status_name: formData.status_name ?? '',
    status_id: formData.status_id,
  }
}


/**
 * Validates the part category name field
 * @param value - The value to validate
 * @returns Error message or empty string if valid
 */
export const validatePartCategoryName = (value: string): string => {
  if (!value || value.trim() === '') {
    return 'Part Category Name is required'
  }
  if (value.trim().length < 2) {
    return 'Part Category Name must be at least 2 characters long'
  }
  if (value.trim().length > 100) {
    return 'Part Category Name must not exceed 100 characters'
  }
  return ''
}

/**
 * Resets form data to default values
 * @returns Default form data
 */
export const resetFormData = (): FormData => {
  return { ...DEFAULT_FORM_DATA }
}
