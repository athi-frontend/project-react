import { NUMBERMAP } from '@/constants/common';
import { apiClient } from '@/shared/apiClient';
import {
  VENDOR_SELECTION_CRITERIA_API_ENDPOINTS,
  VENDOR_GROUP_API_ENDPOINTS,
  VENDOR_GROUP_CRITERIA_API_ENDPOINTS,
  REQUIREMENT_API_ENDPOINTS,
  PART_CATEGORY_TYPE_API_ENDPOINTS,
  PART_SUBCATEGORY_TYPE_API_ENDPOINTS,
  PART_CATEGORY_SUBCLASS_API_ENDPOINTS,
  PART_CATEGORY_API_ENDPOINTS,
} from '@/constants/modules/vendor-management/vendorSelectionCriteria';
import {
  VendorSelectionCriteriaApiResponse,
  VendorGroupData,
  VendorGroupCriteriaData,
  RequirementData,
  PartTypeData,
  PartSubTypeData,
  PartSubClassData,
  PartCategoryData,
} from '@/types/modules/vendor-management/vendorSelectionCriteria';

// Fetch all vendor selection criteria
export const getVendorSelectionCriteria = async (): Promise<VendorSelectionCriteriaApiResponse> => {
  const response = await apiClient.get(VENDOR_SELECTION_CRITERIA_API_ENDPOINTS.GET_ALL());
  return response.data;
};

// Fetch vendor selection criteria by ID
export const getVendorSelectionCriteriaById = async (id: number | string): Promise<VendorSelectionCriteriaApiResponse> => {
  const response = await apiClient.get(VENDOR_SELECTION_CRITERIA_API_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

// Fetch all vendor selection criteria groups (for prefill in create mode)
export const getVendorSelectionCriteriaGroupsAll = async (): Promise<{ data: any[] }> => {
  const response = await apiClient.get(VENDOR_SELECTION_CRITERIA_API_ENDPOINTS.GET_GROUPS_ALL());
  return response.data;
};

// Upsert vendor selection criteria
export const upsertVendorSelectionCriteria = async (data: FormData): Promise<VendorSelectionCriteriaApiResponse> => {
  const response = await apiClient.post(VENDOR_SELECTION_CRITERIA_API_ENDPOINTS.UPSERT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete vendor selection criteria
export const deleteVendorSelectionCriteria = async (id: number | string): Promise<VendorSelectionCriteriaApiResponse> => {
  const response = await apiClient.delete(VENDOR_SELECTION_CRITERIA_API_ENDPOINTS.DELETE(id));
  return response.data;
};

// Fetch all vendor groups
export const getVendorGroups = async (): Promise<{ data: VendorGroupData[] }> => {
  const response = await apiClient.get(VENDOR_GROUP_API_ENDPOINTS.GET_ALL(), {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch vendor group criteria
export const getVendorGroupCriteria = async (vendor_group_id: number): Promise<{ data: VendorGroupCriteriaData[] }> => {
  const response = await apiClient.get(VENDOR_GROUP_CRITERIA_API_ENDPOINTS.GET_ALL(vendor_group_id), {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch requirements
export const getRequirements = async (): Promise<{ data: RequirementData[] }> => {
  const response = await apiClient.get(REQUIREMENT_API_ENDPOINTS.GET_ALL(), {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch part category types (Part Type*)
export const getPartCategoryTypes = async (): Promise<{ data: PartTypeData[] }> => {
  const response = await apiClient.get(PART_CATEGORY_TYPE_API_ENDPOINTS.GET_ALL(), {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch part subcategory types (Part Sub Type*)
export const getPartSubcategoryTypes = async (part_category_type_id?: number): Promise<{ data: PartSubTypeData[] }> => {
  const response = await apiClient.get(PART_SUBCATEGORY_TYPE_API_ENDPOINTS.GET_ALL(), {
    params: { 
      part_category_type_id: part_category_type_id || NUMBERMAP.ONE,
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch part category subclasses (Part Sub Class*)
export const getPartCategorySubclasses = async (part_subcategory_type_id?: number): Promise<{ data: PartSubClassData[] }> => {
  const response = await apiClient.get(PART_CATEGORY_SUBCLASS_API_ENDPOINTS.GET_ALL(), {
    params: { 
      part_subcategory_type_id: part_subcategory_type_id 
    }
  });
  return response.data;
};

// Fetch part categories (Part Category Name*)
export const getPartCategories = async (part_category_subclass?: number): Promise<{ data: PartCategoryData[] }> => {
  const response = await apiClient.get(PART_CATEGORY_API_ENDPOINTS.GET_ALL(), {
    params: { 
      part_category_subclass_id: part_category_subclass,
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

export const postVendorSelectionCriteria = async (payload: any): Promise<any> => {
  const response = await apiClient.post(VENDOR_SELECTION_CRITERIA_API_ENDPOINTS.UPSERT, payload);
  return response.data;
};
