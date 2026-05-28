import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAllPartCategories,
  fetchPartCategoryById,
  upsertPartCategory,
  deletePartCategory,
  fetchPartCategoryTypes,
  fetchPartSubcategoryTypes,
  fetchPartCategorySubclasses,
} from '@/services/modules/vendor-management/partCategory'
import { 
  FormData, 
  PartCategoryListResponse,
  PartCategoryTypesResponse,
  PartSubcategoryTypesResponse,
  PartCategorySubclassesResponse
} from '@/types/modules/vendor-management/partCategory'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { QUERY_KEYS } from '@/constants/modules/vendor-management/partCategory'

/**
 * Classification: Confidential
 */

// Fetch all part categories
export const usePartCategoryList = (status?: number) => {
  return useQuery<PartCategoryListResponse>({
    queryKey: [QUERY_KEYS.LIST, status],
    queryFn: () => fetchAllPartCategories(status),
  })
}

// Fetch part category by ID
export const usePartCategoryDetail = (part_category_id: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DETAIL, part_category_id],
    queryFn: () => fetchPartCategoryById(part_category_id),
    enabled: !!part_category_id,
  })
}

// Create or update part category
export const useUpsertPartCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => upsertPartCategory(formData),
    onSuccess: (response) => {
      const partCategoryId = response?.data?.part_category_id
      // Invalidate and refetch part category list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LIST],
      })
      
      if (partCategoryId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.DETAIL, partCategoryId],
        })
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DETAIL],
      })
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

// Fetch part category types (independent dropdown)
export const usePartCategoryTypes = (status?: number) => {
  return useQuery<PartCategoryTypesResponse>({
    queryKey: [QUERY_KEYS.TYPES, status],
    queryFn: () => fetchPartCategoryTypes(status),
  })
}

// Fetch part subcategory types (dependent on part category type)
export const usePartSubcategoryTypes = (part_category_type_id: number | null, status?: number) => {
  return useQuery<PartSubcategoryTypesResponse>({
    queryKey: [QUERY_KEYS.SUBTYPES, part_category_type_id, status],
    queryFn: () => fetchPartSubcategoryTypes(part_category_type_id, status),
    enabled: !!part_category_type_id,
  })
}

// Fetch part category subclasses (dependent on part subcategory type)
export const usePartCategorySubclasses = (part_subcategory_type_id: number | null) => {
  return useQuery<PartCategorySubclassesResponse>({
    queryKey: [QUERY_KEYS.SUBCLASSES, part_subcategory_type_id],
    queryFn: () => fetchPartCategorySubclasses(part_subcategory_type_id),
    enabled: !!part_subcategory_type_id,
  })
}

// Soft delete part category
export const useDeletePartCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (part_category_id: number) => deletePartCategory(part_category_id),
    onSuccess: () => {
      // Invalidate and refetch part category list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LIST],
      })
      
      // Show success message
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}