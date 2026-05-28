import { NUMBERMAP } from '@/constants/common';
import { apiClient } from '@/shared/apiClient';
import {
  VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS,
  VENDOR_GROUP_API_ENDPOINTS,
  VENDOR_GROUP_CRITERIA_API_ENDPOINTS,
  REQUIREMENT_API_ENDPOINTS,
  PART_CATEGORY_TYPE_API_ENDPOINTS,
  PART_SUBCATEGORY_TYPE_API_ENDPOINTS,
  PART_CATEGORY_SUBCLASS_API_ENDPOINTS,
  PART_CATEGORY_API_ENDPOINTS,
} from '@/constants/modules/vendor-management/vendorReEvaluationCriteria';
import {
  VendorReEvaluationCriteriaApiResponse,
  VendorGroupData,
  VendorGroupCriteriaData,
  RequirementData,
  PartTypeData,
  PartSubTypeData,
  PartSubClassData,
  PartCategoryData,
} from '@/types/modules/vendor-management/vendorReEvaluationCriteria';

// Fetch all vendor re-evaluation criteria
export const getVendorReEvaluationCriteria = async (): Promise<VendorReEvaluationCriteriaApiResponse> => {
  const response = await apiClient.get(VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS.GET_ALL());
  return response.data;
};

// Fetch vendor re-evaluation criteria by ID
export const getVendorReEvaluationCriteriaById = async (id: number | string): Promise<VendorReEvaluationCriteriaApiResponse> => {
  const response = await apiClient.get(VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

// Upsert vendor re-evaluation criteria
export const upsertVendorReEvaluationCriteria = async (data: FormData): Promise<VendorReEvaluationCriteriaApiResponse> => {
  const response = await apiClient.post(VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS.UPSERT, data);
  return response.data;
};

// Delete vendor re-evaluation criteria
export const deleteVendorReEvaluationCriteria = async (id: number | string): Promise<VendorReEvaluationCriteriaApiResponse> => {
  const response = await apiClient.delete(VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS.DELETE(id));
  return response.data;
};

// Fetch all vendor groups
export const getVendorReEvaluationGroups = async (): Promise<{ data: VendorGroupData[] }> => {
  const response = await apiClient.get(VENDOR_GROUP_API_ENDPOINTS.GET_ALL());
  return response.data;
};

// Fetch vendor group criteria
export const getVendorReEvaluationGroupCriteria = async (group_ids: string): Promise<{ data: VendorGroupCriteriaData[] }> => {
  const response = await apiClient.get(VENDOR_GROUP_CRITERIA_API_ENDPOINTS.GET_ALL(group_ids));
  return response.data;
};

// Fetch requirements
export const getReEvaluationRequirements = async (): Promise<{ data: RequirementData[] }> => {
  const response = await apiClient.get(REQUIREMENT_API_ENDPOINTS.GET_ALL(), {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch part category types (Part Type*)
export const getReEvaluationPartCategoryTypes = async (): Promise<{ data: PartTypeData[] }> => {
  const response = await apiClient.get(PART_CATEGORY_TYPE_API_ENDPOINTS.GET_ALL(), {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch part subcategory types (Part Sub Type*)
export const getReEvaluationPartSubcategoryTypes = async (part_category_type_id?: number): Promise<{ data: PartSubTypeData[] }> => {
  const response = await apiClient.get(PART_SUBCATEGORY_TYPE_API_ENDPOINTS.GET_ALL(), {
    params: { 
      part_category_type_id: part_category_type_id || NUMBERMAP.ONE,
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

// Fetch part category subclasses (Part Sub Class*)
export const getReEvaluationPartCategorySubclasses = async (part_subcategory_type_id?: number): Promise<{ data: PartSubClassData[] }> => {
  const response = await apiClient.get(PART_CATEGORY_SUBCLASS_API_ENDPOINTS.GET_ALL(), {
    params: { 
      part_subcategory_type_id: part_subcategory_type_id 
    }
  });
  return response.data;
};

// Fetch part categories (Part Category Name*)
export const getReEvaluationPartCategories = async (part_category_subclass?: number): Promise<{ data: PartCategoryData[] }> => {
  const response = await apiClient.get(PART_CATEGORY_API_ENDPOINTS.GET_ALL(), {
    params: { 
      part_category_subclass_id: part_category_subclass,
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

export const postVendorReEvaluationCriteria = async (payload: any): Promise<any> => {
  const response = await apiClient.post(VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS.UPSERT, payload);
  return response.data;
};

