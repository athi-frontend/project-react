import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVendorReEvaluationCriteria,
  getVendorReEvaluationCriteriaById,
  upsertVendorReEvaluationCriteria,
  deleteVendorReEvaluationCriteria,
  getVendorReEvaluationGroups,
  getVendorReEvaluationGroupCriteria,
  getReEvaluationRequirements,
  getReEvaluationPartCategoryTypes,
  getReEvaluationPartSubcategoryTypes,
  getReEvaluationPartCategorySubclasses,
  getReEvaluationPartCategories,
  postVendorReEvaluationCriteria,
} from '@/services/modules/vendor-management/vendorReEvaluationCriteria';
import { VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY } from '@/constants/modules/vendor-management/vendorReEvaluationCriteria';

export const useVendorReEvaluationCriteria = () => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'all'],
    queryFn: () => getVendorReEvaluationCriteria(),
    enabled: true,
  });
};

export const useVendorReEvaluationCriteriaById = (id: number | string) => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'byId', id],
    queryFn: () => getVendorReEvaluationCriteriaById(id),
    refetchOnMount: 'always',
    enabled: !!id,
  });
};

export const useUpsertVendorReEvaluationCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertVendorReEvaluationCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY] });
    },
  });
};

export const useDeleteVendorReEvaluationCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vendorReEvaluationCriteriaId: number) => deleteVendorReEvaluationCriteria(vendorReEvaluationCriteriaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY] });
    },
  });
};

export const useVendorReEvaluationGroups = () => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'vendorReEvaluationGroups'],
    queryFn: () => getVendorReEvaluationGroups(),
  });
};

export const useVendorReEvaluationGroupCriteria = (group_ids: string) => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'vendorReEvaluationGroupCriteria', group_ids],
    queryFn: () => getVendorReEvaluationGroupCriteria(group_ids),
    enabled: !!group_ids && group_ids.length > 0,
  });
};

export const useReEvaluationRequirements = () => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'requirements'],
    queryFn: () => getReEvaluationRequirements(),
  });
};

export const useReEvaluationPartCategoryTypes = () => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'partCategoryTypes'],
    queryFn: () => getReEvaluationPartCategoryTypes(),
  });
};

export const useReEvaluationPartSubcategoryTypes = (part_category_type_id?: number) => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'partSubcategoryTypes', part_category_type_id],
    queryFn: () => getReEvaluationPartSubcategoryTypes(part_category_type_id),
    enabled: !!part_category_type_id,
  });
};

export const useReEvaluationPartCategorySubclasses = (part_subcategory_type_id?: number) => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'partCategorySubclasses', part_subcategory_type_id],
    queryFn: () => getReEvaluationPartCategorySubclasses(part_subcategory_type_id),
    enabled: !!part_subcategory_type_id,
  });
};

export const useReEvaluationPartCategories = (part_category_subclass?: number) => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'partCategories', part_category_subclass],
    queryFn: () => getReEvaluationPartCategories(part_category_subclass),
    enabled: !!part_category_subclass,
  });
};

export const usePostVendorReEvaluationCriteria = (vendorReEvaluationCriteriaId?: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY, 'post', vendorReEvaluationCriteriaId],
    mutationFn: (payload: any) => postVendorReEvaluationCriteria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY],
      });
    },
  });
};

