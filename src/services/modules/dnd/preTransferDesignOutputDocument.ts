import { API_ENDPOINTS } from "@/constants/modules/dnd/preTransferDesignOutputDocument"
import { apiClient } from "@/shared/apiClient"

export const fetchAllPreTransfer=async(projectId:number)=>{
    const response=await apiClient.get(API_ENDPOINTS.FETCH_ALL(projectId))
    return response.data
}
export const uploadPreTransferDocument = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.DOCUMENT_UPLOAD, formData);
  return response.data;
};
export const fetchByIDPreTransfer=async(design_transfer_plan_id:number)=>{
    const response=await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(design_transfer_plan_id))
    return response.data
}