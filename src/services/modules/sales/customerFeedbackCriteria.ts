import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/sales/customerFeedbackCriteria";
import { NUMBERMAP } from "@/constants/common";
import { 
  CustomerFeedbackCriteriaResponse,
  CustomerFeedbackCriteriaByIdResponse,
  CustomerFeedbackCriteriaRequest,
  GroupsResponse,
  CriteriaResponse,
  SystemDefinedResponse,
  ProductAllResponse,
} from "@/types/modules/sales/customerFeedbackCriteria";

/**
 * Classification : Confidential
 **/

/**
 * Fetch all customer feedback criteria
 * @returns Promise<CustomerFeedbackCriteriaResponse>
 */
export const fetchAllCustomerFeedbackCriteria = async (): Promise<CustomerFeedbackCriteriaResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, {
    params: { 
      status: NUMBERMAP.ONE 
    }
  });
  return response.data;
};

/**
 * Fetch customer feedback criteria by ID
 * @param id - The ID of the customer feedback criteria
 * @returns Promise<CustomerFeedbackCriteriaByIdResponse>
 */
export const fetchCustomerFeedbackCriteriaById = async (id: number): Promise<CustomerFeedbackCriteriaByIdResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(id));
  return response.data;
};

/**
 * Insert or update customer feedback criteria
 * @param payload - The customer feedback criteria data
 * @returns Promise<CustomerFeedbackCriteriaByIdResponse>
 */
export const upsertCustomerFeedbackCriteria = async (payload: CustomerFeedbackCriteriaRequest): Promise<CustomerFeedbackCriteriaByIdResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, payload);
  return response.data;
};

/**
 * Delete customer feedback criteria
 * @param id - The ID of the customer feedback criteria to delete
 * @returns Promise<CustomerFeedbackCriteriaResponse>
 */
export const deleteCustomerFeedbackCriteria = async (id: number): Promise<CustomerFeedbackCriteriaResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(id));
  return response.data;
};

/**
 * Fetch all groups
 * @param includeInactive - Whether to include inactive groups (default: false)
 * @returns Promise<GroupsResponse>
 */
export const fetchGroups = async (includeInactive: boolean = false): Promise<GroupsResponse> => {
  const params: { status?: number } = {};
  if (!includeInactive) {
    params.status = NUMBERMAP.ONE;
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_GROUPS, { params });
  return response.data;
};

/**
 * Fetch criteria by group ID
 * @param groupId - The group ID
 * @param includeInactive - Whether to include inactive criteria (default: false)
 * @returns Promise<CriteriaResponse>
 */
export const fetchCriteria = async (groupId: number, includeInactive: boolean = false): Promise<CriteriaResponse> => {
  const params: { group_id: number; status?: number } = { 
    group_id: groupId
  };
  if (!includeInactive) {
    params.status = NUMBERMAP.ONE;
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_CRITERIA, { params });
  return response.data;
};

/**
 * Fetch system defined criteria
 * @returns Promise<SystemDefinedResponse>
 */
export const fetchSystemDefined = async (): Promise<SystemDefinedResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SYSTEM_DEFINED);
  return response.data;
};

/**
 * Fetch all products
 * @param subtypeId - Optional product subtype ID
 * @param typeId - Optional product type ID
 * @returns Promise<ProductAllResponse>
 */
export const fetchProductAll = async (subtypeId?: number, typeId?: number): Promise<ProductAllResponse> => {
  const params: { subtype_id?: number; type_id?: number } = {};
  if (subtypeId) {
    params.subtype_id = subtypeId;
  }
  if (typeId) {
    params.type_id = typeId;
  }
  const response = await apiClient.get(API_ENDPOINTS.ALL, { params });
  return response.data;
};

