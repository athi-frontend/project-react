import { API_ENDPOINTS } from "@/constants/modules/dnd/installation"
import { apiClient } from "@/shared/apiClient"

export const getInstallationList = async (projectId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INSTALLATION(projectId))
  return response.data
}

export const getTools = async () => {
  const response = await apiClient.get(API_ENDPOINTS.TOOLS, {})
  return response.data
}
export const getEquipment = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EQUIPMENTS, {})
  return response.data
}
export const getSkill = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SKILL, {})
  return response.data
}

export const postInstallation = async (payload: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_INSTALLATION, payload)
  return response.data
}

export const getInstallationById = async (installation_procedure_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_INSTALLATION(installation_procedure_id));
  return response.data;
};

export const deleteInstallation = async (installation_procedure_id: number) => {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_RECORD(installation_procedure_id));
    return response.data;
}