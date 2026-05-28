import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/dnd/inputOutputTraceabilityMatrix";
import { TraceabilityMatrixForm } from "@/types/modules/dnd/inputOutputTraceabilityMatrix";

export const fetchAllTraceability = async(project_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL(project_id));
    return response.data;
}

export const fetchDocumentsById = async(dir: number, project_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETC_BY_ID(dir,project_id));
    return response.data;
}

export const saveTraceabilityForm = async(data: TraceabilityMatrixForm) => {

    const response = await apiClient.post(API_ENDPOINTS.POST, data)
    return response.data
}