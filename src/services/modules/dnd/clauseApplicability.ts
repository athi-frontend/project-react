import { API_ENDPOINTS } from "@/constants/modules/dnd/clauseApplicability";
import { apiClient } from "@/shared/apiClient";


export const fetchClauseApplocability = async(project_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_LIST(project_id))
    return response.data
}

export const submitApplicability = async(data: any) => {
    const response = await apiClient.post(API_ENDPOINTS.SUBMIT_APPLICABILITY, data)
    return response.data
}