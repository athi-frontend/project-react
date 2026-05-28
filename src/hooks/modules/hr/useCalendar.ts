import { CALENDAR_QUERY_KEY } from "@/constants/modules/hr/calendar"
import { fetchCalendarTrainingSchedule } from "@/services/modules/hr/calendar"
import { useQuery } from "@tanstack/react-query"

export const useCalendarTrainingSchedule = (month: string, year: string) => {
  return useQuery({
    queryKey: [CALENDAR_QUERY_KEY.LIST, month, year],
    queryFn: () => fetchCalendarTrainingSchedule(month, year),
    enabled: !!month && !!year,
  })
}
