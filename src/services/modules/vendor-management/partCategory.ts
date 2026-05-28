import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS, PART_CATEGORY_CONSTANTS } from '@/constants/modules/vendor-management/partCategory'
import { 
  PartCategoryListResponse,
  PartCategoryTypesResponse,
  PartCategorySubclassesResponse
} from '@/types/modules/vendor-management/partCategory'

/**
 * Classification: Confidential
 */

// Fetch all part categories
export const fetchAllPartCategories = async (status?: number): Promise<PartCategoryListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, {
    params: { status: status }
  })
  return response.data
}

// Fetch part category by ID
export const fetchPartCategoryById = async (part_category_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(part_category_id))
  return response.data
}

// Create or update part category
export const upsertPartCategory = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, formData, {
    headers: {
      'Content-Type': PART_CATEGORY_CONSTANTS.MULTIPART_FORM_DATA,
    },
  })
  return response.data
}

// Soft delete part category
export const deletePartCategory = async (part_category_id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(part_category_id))
  return response.data
}

// Fetch part category types (independent dropdown)
export const fetchPartCategoryTypes = async (status?: number): Promise<PartCategoryTypesResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.PART_CATEGORY_TYPES, {
    params: { status: status }
  })
  return response.data
}

// Fetch part subcategory types (dependent on part category type)
export const fetchPartSubcategoryTypes = async (part_category_type_id: number, status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.PART_SUBCATEGORY_TYPES, {
    params: { 
      part_category_type_id: part_category_type_id,
      status: status 
    }
  })
  return response.data
}

// Fetch part category subclasses (dependent on part subcategory type)
export const fetchPartCategorySubclasses = async (part_subcategory_type_id: number): Promise<PartCategorySubclassesResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.PART_CATEGORY_SUBCLASSES, {
    params: { 
      part_subcategory_type_id: part_subcategory_type_id
    }
  })
  return response.data
}
