import { apiClient } from '@/shared/apiClient';
import { API_ENDPOINTS } from "@/constants/modules/regulation/manufacturing-license"

export const fetchManufacturingLicenseChecklist = async (id: number) => {
  const endpoint = API_ENDPOINTS.FETCH_MANUFACTURING_LICENCE_CHECKLIST(id);
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const saveManufacturingLicenseChecklist = async (
  id: number,
  payload: Array<{ checklist_id: number; is_mandatory: number }>
) => {
  const endpoint = API_ENDPOINTS.UPSERT_MANUFACTURING_LICENCE_CHECKLIST(id);
  const response = await apiClient.post(endpoint, payload);
  return response.data;
};

export const fetchAddManufacturingLicense = async (id: number) => {
  const endpoint = API_ENDPOINTS.FETCH_ADD_TEST_LICENSE(id);
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const fetchAllAddManufacturingLicense = async (id: number) => {
  const endpoint = API_ENDPOINTS.FETCH_ALL_ADD_TEST_LICENSE(id);
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const saveAddManufacturingLicense = async (formData: FormData) => {
  return apiClient.post(API_ENDPOINTS.UPSERT_ADD_TEST_LICENSE, formData);
};

export const getAddManufacturingLicense = async (userId: string) => {
  const endpoint = API_ENDPOINTS.GET_ADD_MANUFACTURING_LICENSE(userId);
  const response = await apiClient.get(endpoint);
  return response.data;
};