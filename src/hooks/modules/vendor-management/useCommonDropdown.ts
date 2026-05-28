import { useQuery } from "@tanstack/react-query";
import { 
  fetchAllVendors, 
  fetchAllVendorTypes, 
  fetchAllPartCategories,
  fetchAllPartSubcategoryTypes,
  fetchAllPartCategorySubclasses,
  fetchVendorSelectionCriteria,
  fetchAllVendorReEvaluationFrequency,
  VendorTypesResponse,
  PartCategoryResponse,
  PartSubcategoryTypeResponse,
  PartCategorySubclassResponse,
  VendorSelectionCriteriaResponse,
  VendorReEvaluationFrequencyResponse,
  fetchAllPartTypes,
  fetchAllPurchaseOrders,
  PurchaseOrderResponse
} from "@/services/modules/vendor-management/common";
import { 
  VENDOR_LIST_HOOK, 
  VENDOR_TYPES_HOOK,
  PART_CATEGORY_HOOK,
  PART_SUBCATEGORY_TYPE_HOOK,
  PART_CATEGORY_SUBCLASS_HOOK,
  VENDOR_SELECTION_CRITERIA_HOOK,
  VENDOR_RE_EVALUATION_FREQUENCY_HOOK,
  PURCHASE_ORDER_ALL_HOOK
} from "@/constants/modules/vendor-management/common";
import { VendorListResponse } from "@/types/modules/vendor-management/vendorList";

/**
 * Classification : Confidential
 * Hook to fetch all vendors
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useAllVendors = (status?: number, vendorTypeId?: number, enabled: boolean = true) => {
  return useQuery<VendorListResponse, Error>({
    queryKey: [VENDOR_LIST_HOOK, status, vendorTypeId],
    queryFn: () => fetchAllVendors(status, vendorTypeId),
    enabled: enabled && !!vendorTypeId,
  });
};

export const useAllVendorTypes = (status?: number, enabled: boolean = true) => {
    return useQuery<VendorTypesResponse, Error>({
      queryKey: [VENDOR_TYPES_HOOK, status],
      queryFn: () => fetchAllVendorTypes(status),
      enabled,
    });
  };
  export const useAllPartTypes = (status?: number, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['partTypes', status],
      queryFn: () => fetchAllPartTypes(status),
      enabled,
    });
  };

/**
/**
 * Hook to fetch all part categories
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useAllPartCategories = (status?: number, part_category_subclass_id?: number, enabled: boolean = true) => {
  return useQuery<PartCategoryResponse, Error>({
    queryKey: [PART_CATEGORY_HOOK, status, part_category_subclass_id],
    queryFn: () => fetchAllPartCategories(status, part_category_subclass_id),
    enabled: enabled && !!part_category_subclass_id,
  });
};

/**
 * Hook to fetch all part subcategory types
 * @param partCategoryTypeId - Part category type ID filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useAllPartSubcategoryTypes = (partCategoryTypeId?: number, status?: number, enabled: boolean = true) => {
  return useQuery<PartSubcategoryTypeResponse, Error>({
    queryKey: [PART_SUBCATEGORY_TYPE_HOOK, partCategoryTypeId, status],
    queryFn: () => fetchAllPartSubcategoryTypes(partCategoryTypeId, status),
    enabled: enabled && !!partCategoryTypeId,
  });
};

/**
 * Hook to fetch all part category subclasses
 * @param partSubcategoryTypeId - Part subcategory type ID filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useAllPartCategorySubclasses = (partSubcategoryTypeId?: number, status?: number, enabled: boolean = true) => {
  return useQuery<PartCategorySubclassResponse, Error>({
    queryKey: [PART_CATEGORY_SUBCLASS_HOOK, partSubcategoryTypeId, status],
    queryFn: () => fetchAllPartCategorySubclasses(partSubcategoryTypeId, status),
    enabled: enabled && !!partSubcategoryTypeId,
  });
};

/**
 * Hook to fetch vendor selection criteria
 * @param partTypeId - Part type ID filter
 * @param partSubTypeId - Part sub type ID filter
 * @param partSubClassId - Part sub class ID filter
 * @param partCategoryId - Part category ID filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useVendorSelectionCriteria = (
  partTypeId?: number, 
  partSubTypeId?: number, 
  partSubClassId?: number, 
  partCategoryId?: number, 
  status?: number, 
  enabled: boolean = true
) => {
  return useQuery<VendorSelectionCriteriaResponse, Error>({
    queryKey: [VENDOR_SELECTION_CRITERIA_HOOK, partTypeId, partSubTypeId, partSubClassId, partCategoryId, status],
    queryFn: () => fetchVendorSelectionCriteria(partTypeId, partSubTypeId, partSubClassId, partCategoryId, status),
    enabled: enabled && !!(partTypeId && partSubTypeId && partSubClassId && partCategoryId),
  });
};

/**
 * Hook to fetch all vendor re-evaluation frequency types
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useAllVendorReEvaluationFrequency = (status?: number, enabled: boolean = true) => {
  return useQuery<VendorReEvaluationFrequencyResponse, Error>({
    queryKey: [VENDOR_RE_EVALUATION_FREQUENCY_HOOK, status],
    queryFn: () => fetchAllVendorReEvaluationFrequency(status),
    enabled,
  });
};

/**
 * Hook to fetch all purchase orders
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param vendor_id - Optional vendor ID filter
 * @param type - Optional type filter
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useAllPurchaseOrders = (status?: number, vendor_id?: number, type?: string, enabled: boolean = true) => {
  return useQuery<PurchaseOrderResponse, Error>({
    queryKey: [PURCHASE_ORDER_ALL_HOOK, status, vendor_id, type],
    queryFn: () => fetchAllPurchaseOrders(status, vendor_id, type),
    enabled: enabled && (!!vendor_id || !!type),
  });
};
      
