import { apiClient } from '@/shared/apiClient';

/**
 * Classification: Confidential
 * Service functions for Sample Inspection Criteria module
 */

const SAMPLE_INSPECTION_CRITERIA_API_BASE = '/api/v1/vendor-purchase/sample-inspection-criteria';

// Fetch all sample inspection criteria
export const getAllSampleInspectionCriteria = async (status?: number) => {
  const response = await apiClient.get(`${SAMPLE_INSPECTION_CRITERIA_API_BASE}/all`, {
    params: {
      status: status ?? null,
    },
  });
  return response.data;
};

// Fetch sample inspection criteria by ID
export const getSampleInspectionCriteriaById = async (id: number | string) => {
  const response = await apiClient.get(`${SAMPLE_INSPECTION_CRITERIA_API_BASE}/${id}`);
  return response.data;
};

// Create or update sample inspection criteria
export const postSampleInspectionCriteria = async (payload: any) => {
  const response = await apiClient.post(SAMPLE_INSPECTION_CRITERIA_API_BASE, payload);
  return response.data;
};

// Delete sample inspection criteria
export const deleteSampleInspectionCriteria = async (id: number | string) => {
  const response = await apiClient.delete(`${SAMPLE_INSPECTION_CRITERIA_API_BASE}/${id}`);
  return response.data;
};

