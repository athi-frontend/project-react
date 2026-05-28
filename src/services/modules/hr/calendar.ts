import { API_ENDPOINTS } from "@/constants/modules/hr/calendar"
import { apiClient } from "@/shared/apiClient"

export const fetchCalendarTrainingSchedule = async (month: string, year: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.FETCH_ALL}?month=${month}&year=${year}`)
  return response
}
