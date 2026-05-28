import { API_ENDPOINTS } from "@/constants/modules/dnd/verificationReport";
import { apiClient } from "@/shared/apiClient";

export const fetchReport = async(verification_plan_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_REPORT(verification_plan_id))
    return response.data
}

export const getJigs = async() => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_JIGS);
    return response.data
}

export const getEquipments = async() => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_EQUIPMENTS);
    return response.data
}

export const getItemsToTest = async() => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ITEM_TO_TEST);
    return response.data
}

export const getVerificationResult = async() => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_RESULT);
    return response.data
}

export const fetchUsers = async (roleID: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_USERS(roleID))
  return response.data
}

export const saveReport = async(data: ReportForm) => {
    const response = await apiClient.post(API_ENDPOINTS.POST_REPORT, data);
    return response.data
}

export const fetchAllReports = async(project_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_REPORT(project_id))
    return response.data
}
