import { API_ENDPOINTS } from "@/constants/modules/hr/trainingSchedule"
import { apiClient } from "@/shared/apiClient"

export const fetchTrainingSchedule=async()=>{
    const response=await apiClient(API_ENDPOINTS.FETCH_ALL)
    return response.data
}

export const fetchByScheduleId = async(scheduleId: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_SCHEDULE_BY_ID(scheduleId))
    return response.data
}