import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVendorSelectionCriteria,
  getVendorSelectionCriteriaById,
  upsertVendorSelectionCriteria,
  deleteVendorSelectionCriteria,
  getVendorGroups,
  getVendorGroupCriteria,
  getRequirements,
  getPartCategoryTypes,
  getPartSubcategoryTypes,
  getPartCategorySubclasses,
  getPartCategories,
  postVendorSelectionCriteria,
  getVendorSelectionCriteriaGroupsAll,
} from '@/services/modules/vendor-management/vendorSelectionCriteria';
import { VENDOR_SELECTION_CRITERIA_QUERY_KEY } from '@/constants/modules/vendor-management/vendorSelectionCriteria';

export const useVendorSelectionCriteria = () => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'all'],
    queryFn: () => getVendorSelectionCriteria(),
    enabled: true,
  });
};

export const useVendorSelectionCriteriaById = (id: number | string) => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'byId', id],
    queryFn: () => getVendorSelectionCriteriaById(id),
    enabled: !!id,
  });
};

export const useUpsertVendorSelectionCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertVendorSelectionCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY] });
    },
  });
};

export const useDeleteVendorSelectionCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vendorSelectionCriteriaId: number) => deleteVendorSelectionCriteria(vendorSelectionCriteriaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY] });
    },
  });
};

export const useVendorGroups = () => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'vendorGroups'],
    queryFn: () => getVendorGroups(),
  });
};

export const useVendorGroupCriteria = (vendor_group_id: number) => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'vendorGroupCriteria', vendor_group_id],
    queryFn: () => getVendorGroupCriteria(vendor_group_id),
    enabled: !!vendor_group_id,
  });
};

export const useRequirements = () => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'requirements'],
    queryFn: () => getRequirements(),
  });
};

export const usePartCategoryTypes = () => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'partCategoryTypes'],
    queryFn: () => getPartCategoryTypes(),
  });
};

export const usePartSubcategoryTypes = (part_category_type_id?: number) => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'partSubcategoryTypes', part_category_type_id],
    queryFn: () => getPartSubcategoryTypes(part_category_type_id),
    enabled: !!part_category_type_id,
  });
};

export const usePartCategorySubclasses = (part_subcategory_type_id?: number) => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'partCategorySubclasses', part_subcategory_type_id],
    queryFn: () => getPartCategorySubclasses(part_subcategory_type_id),
    enabled: !!part_subcategory_type_id,
  });
};

export const usePartCategories = (part_category_subclass?: number) => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'partCategories', part_category_subclass],
    queryFn: () => getPartCategories(part_category_subclass),
    enabled: !!part_category_subclass,
  });
};

export const usePostVendorSelectionCriteria = (vendorSelectionCriteriaId?: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'post', vendorSelectionCriteriaId],
    mutationFn: (payload: any) => postVendorSelectionCriteria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY],
      });
    },
  });
};

// Hook to fetch all vendor selection criteria groups (for prefill in create mode)
export const useVendorSelectionCriteriaGroupsAll = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [VENDOR_SELECTION_CRITERIA_QUERY_KEY, 'groups', 'all'],
    queryFn: () => getVendorSelectionCriteriaGroupsAll(),
    enabled,
  });
};
