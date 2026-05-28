import { TRAINING_SCHEDULE_QUERY_KEY } from "@/constants/modules/hr/trainingSchedule"
import { fetchByScheduleId, fetchTrainingSchedule } from "@/services/modules/hr/trainingSchedule"
import {  useQuery, useQueryClient } from "@tanstack/react-query"

export const fetchAllTraining = () => {
  return useQuery({
    queryKey: [TRAINING_SCHEDULE_QUERY_KEY.LIST],
    queryFn: () => fetchTrainingSchedule(),
  })
}

export const useTrainingNeedById = (scheduleId: number) => {
  const queryClient = useQueryClient() 

  return {
    ...useQuery({
      queryKey: [TRAINING_SCHEDULE_QUERY_KEY.SCHEDULE_ID, scheduleId],
      queryFn: () => fetchByScheduleId(scheduleId),
      enabled: !!scheduleId, 
    }),
    invalidateQuery: () => {

      queryClient.invalidateQueries({ queryKey: [TRAINING_SCHEDULE_QUERY_KEY.LIST, scheduleId] })
    },
  }
}