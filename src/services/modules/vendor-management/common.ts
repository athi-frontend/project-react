import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/vendor-management/common";
import { VendorListResponse } from "@/types/modules/vendor-management/vendorList";

/**
    Classification : Confidential
**/
export interface VendorType {
  id: number;
  vendor_type_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface VendorTypesResponse {
  data: VendorType[];
  total: number;
  page: number;
  limit: number;
}

export interface PartCategory {
  id: number;
  part_category_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface PartSubcategoryType {
  id: number;
  part_subcategory_type_name: string;
  part_category_type_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface PartCategorySubclass {
  id: number;
  part_category_subclass_name: string;
  part_subcategory_type_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface PartCategoryResponse {
  data: PartCategory[];
  total: number;
  page: number;
}

export interface PartSubcategoryTypeResponse {
  data: PartSubcategoryType[];
  total: number;
  page: number;
}

export interface PartCategorySubclassResponse {
  data: PartCategorySubclass[];
  total: number;
  page: number;
}

export interface VendorSelectionCriteria {
  id: number;
  criteria: string;
  desirable_mandatory: string;
  part_type_id: number;
  part_sub_type_id: number;
  part_sub_class_id: number;
  part_category_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface VendorSelectionCriteriaResponse {
  data: VendorSelectionCriteria[];
  total: number;
  page: number;
}

export interface VendorReEvaluationFrequency {
  id: number;
  frequency_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface VendorReEvaluationFrequencyResponse {
  data: VendorReEvaluationFrequency[];
  total: number;
  page: number;
  limit: number;
}

export interface PurchaseOrder {
  purchase_order_id: number;
  vendor_id: number;
  vendor_name: string;
  purchase_order_number: string;
  purchase_order_date: string;
  status: number;
}

export interface PurchaseOrderResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: PurchaseOrder[];
}

/**
 * Fetch all vendor types with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<VendorTypesResponse>
 */
export const fetchAllVendorTypes = async (status?: number): Promise<VendorTypesResponse> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get(API_ENDPOINTS.VENDOR_TYPES_ALL, { params });
  return response.data;
};

/**
 * Fetch all vendors with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<VendorListResponse>
 */
export const fetchAllVendors = async (status?: number, vendorTypeId?: number): Promise<VendorListResponse> => {
  let params = {}
  if (status) params = { status }
  if (vendorTypeId) params = { ...params, vendor_type_id: vendorTypeId }
const response = await apiClient.get(API_ENDPOINTS.VENDOR_LIST_ALL, { params: { ...params } });
return response.data;
};

/**
 * Fetch vendor agreement checklist list with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<any> - Response from the vendor agreement checklist list API
 */
export const fetchVendorAgreementChecklistList = async (status?: number): Promise<any> => {
  const params = status !== undefined ? { status } : {};

  try {
    const response = await apiClient.get(API_ENDPOINTS.VENDOR_AGREEMENT_CHECKLIST_LIST, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch vendor agreement checklist list."
    );
  }
};

/**
 * Fetch all part categories with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<PartCategoryResponse>
 */
export const fetchAllPartCategories = async (status?: number, part_category_subclass_id?: number): Promise<PartCategoryResponse> => {
  let params: any = {};
  if (status !== undefined) params.status = status;
  if (part_category_subclass_id) params.part_category_subclass_id = part_category_subclass_id;
  const response = await apiClient.get(API_ENDPOINTS.PART_CATEGORY_ALL, { params: { ...params } });
  return response.data;
};

export const fetchAllPartTypes = async (status?: number): Promise<PartCategoryResponse> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get(API_ENDPOINTS.PART_TYPE_ALL, { params });
  return response.data;
};

/**
 * Fetch all part subcategory types with optional filters
 * @param partCategoryTypeId - Part category type ID filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<PartSubcategoryTypeResponse>
 */
export const fetchAllPartSubcategoryTypes = async (partCategoryTypeId?: number, status?: number): Promise<PartSubcategoryTypeResponse> => {
  let params: any = {};
  if (partCategoryTypeId) params.part_category_type_id = partCategoryTypeId;
  if (status !== undefined) params.status = status;
  
  const response = await apiClient.get(API_ENDPOINTS.PART_SUBCATEGORY_TYPE_ALL, { params });
  return response.data;
};

/**
 * Fetch all part category subclasses with optional filters
 * @param partSubcategoryTypeId - Part subcategory type ID filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<PartCategorySubclassResponse>
 */
export const fetchAllPartCategorySubclasses = async (partSubcategoryTypeId?: number, status?: number): Promise<PartCategorySubclassResponse> => {
  let params: any = {};
  if (partSubcategoryTypeId) params.part_subcategory_type_id = partSubcategoryTypeId;
  if (status !== undefined) params.status = status;
  
  const response = await apiClient.get(API_ENDPOINTS.PART_CATEGORY_SUBCLASS_ALL, { params });
  return response.data;
};

/**
 * Fetch vendor selection criteria with optional filters
 * @param partTypeId - Part type ID filter
 * @param partSubTypeId - Part sub type ID filter
 * @param partSubClassId - Part sub class ID filter
 * @param partCategoryId - Part category ID filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<VendorSelectionCriteriaResponse>
 */
export const fetchVendorSelectionCriteria = async (
  partTypeId?: number, 
  partSubTypeId?: number, 
  partSubClassId?: number, 
  partCategoryId?: number, 
  status?: number
): Promise<VendorSelectionCriteriaResponse> => {
  let params: any = {};
  if (partTypeId) params.part_type_id = partTypeId;
  if (partSubTypeId) params.part_sub_type_id = partSubTypeId;
  if (partSubClassId) params.part_sub_class_id = partSubClassId;
  if (partCategoryId) params.part_category_id = partCategoryId;
  if (status !== undefined) params.status = status;
  
  const response = await apiClient.get(API_ENDPOINTS.VENDOR_SELECTION_CRITERIA_ALL, { params });
  return response.data;
};

/**
 * Fetch all vendor re-evaluation frequency types with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<VendorReEvaluationFrequencyResponse>
 */
export const fetchAllVendorReEvaluationFrequency = async (status?: number): Promise<VendorReEvaluationFrequencyResponse> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get(API_ENDPOINTS.VENDOR_RE_EVALUATION_FREQUENCY_ALL, { params });
  return response.data;
};

/**
 * Fetch all purchase orders with optional status and vendor_id filters
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param vendor_id - Optional vendor ID filter
 * @param type - Optional type filter
 * @returns Promise<PurchaseOrderResponse>
 */
export const fetchAllPurchaseOrders = async (status?: number, vendor_id?: number, type?: string): Promise<PurchaseOrderResponse> => {
  const params = {status, vendor_id, type}
  const response = await apiClient.get(API_ENDPOINTS.PURCHASE_ORDER_ALL, {params});
  return response.data;
};