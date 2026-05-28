import { API_ENDPOINTS } from "@/constants/modules/production/incomingInspectionCriteria";
import { apiClient } from "@/shared/apiClient";
import {
  IncomingInspectionCriteriaResponse,
  InspectionGroupListResponse,
  CriteriaListResponse,
} from "@/types/modules/production/incomingInceptionCriteria";

/**
 * Classification: Confidential
 * Service functions for Incoming Inspection Criteria
 */

/**
 * Fetch all incoming inspection criteria
 * @param applicableSettingsId - Optional applicable settings ID filter
 */
export const getIncomingInspectionCriteriaList = async (applicableSettingsId?: number): Promise<IncomingInspectionCriteriaResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INCOMING_INSPECTION_CRITERIA_LIST, {
    params: applicableSettingsId !== undefined ? { applicable_settings_id: applicableSettingsId } : undefined,
  });
  return response.data;
};

/**
 * Fetch incoming inspection criteria by ID
 * @param id - The incoming inspection criteria ID
 */
export const getIncomingInspectionCriteriaById = async (id: number): Promise<IncomingInspectionCriteriaResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INCOMING_INSPECTION_CRITERIA_BY_ID(id));
  return response.data;
};

/**
 * Delete incoming inspection criteria
 * @param id - The incoming inspection criteria ID
 */
export const deleteIncomingInspectionCriteria = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DELETE_INCOMING_INSPECTION_CRITERIA(id));
};

/**
 * Upsert (create or update) incoming inspection criteria
 * @param payload - FormData containing the incoming inspection criteria data
 */
export const upsertIncomingInspectionCriteria = async (payload: FormData): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT_INCOMING_INSPECTION_CRITERIA, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchInspectionGroups = async (status: number = 1): Promise<InspectionGroupListResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.PRE_PRODUCTION_GROUP_ALL,
    { params: { status } }
  );
  return response.data;
};

/**
 * Fetch the available criteria (sub-groups) for a specific group_id
 */
export const fetchCriteriaByGroupId = async (group_id: number): Promise<CriteriaListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.PRE_PRODUCTION_GROUP_CRITERIA_ALL,
    { params: { group_id } }
  );
  return response.data;
};