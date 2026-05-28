import { apiClient } from "@/shared/apiClient";

import { API_ENDPOINTS, DESIGN_STAGES } from "@/constants/modules/dnd/prototype";
import { ApiPrototype } from "@/types/modules/dnd/prototype";

export const getPrototypeList = async (projectId: number,stage_type?:string): Promise<ApiPrototype[]> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_PROTOTYPE_PROJECT_STAGE(projectId),{params:{design_stage: stage_type??DESIGN_STAGES.PROTOTYPE}});
  return response.data;
};
export const getAction = async (execution_stage_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_ACTION(execution_stage_id))
  return response.data;
};

export const postPrototype = async (payload: FormData, projectId) => {
  const response = await apiClient.put(API_ENDPOINTS.POST_PROTOTYPE(projectId), payload)
  return response.data
}
