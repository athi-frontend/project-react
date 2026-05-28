import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/hr/trainingNeeds";

export const fetchAllNeeds = async() => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_NEEDS);
    return response.data
}

export const fetchSkills = async (status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_SKILLS, {
    params: { status: status },
  })
  return response.data
}

export const fetchSources = async (status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SOURCE, {
    params: { status: status },
  })
  return response.data
}

export const fetchEmployee = async() => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_EMPLOYEES);
    return response.data
}

export const fetchById = async(needs_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_NEEDS_BY_ID(needs_id))
    return response.data
}

export const generateRecords = async (training_need_id: number) => {
  const response = await apiClient.post(API_ENDPOINTS.GENERATE_RECORDS, {
    training_need_id,
  });
  return response.data;
};
