import { apiClient } from "@/shared/apiClient"
import {API_ENDPOINTS} from "@/constants/modules/dnd/designInputAdequacyChecklist"


export const fetchAdequacy = async(project_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL(project_id))
    return response.data
}

export const postAdequacy = async(data: { project_id: number; checkListItems: any[] }) => {
    const response = await apiClient.post(API_ENDPOINTS.POST_ADEQUACY(data.project_id), data.checkListItems);
    return response.data
}