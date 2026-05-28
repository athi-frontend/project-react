import { apiClient } from '../../../shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/hr/trainingEvaluation'


export const fetchEvaluations = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EVALUATION.FETCH_ALL)
  return response.data
}

export const fetchEvaluationById = async (id: string) => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.EVALUATION.FETCH_BY_ID}${id}`
  )
  return response.data
}

export const fetchTrainingSchedule = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EVALUATION.FETCH_TRAINING_SCHEDULE)
  return response.data
}

export const fetchTrainingScheduleById = async (id:string) => {
  const response = await apiClient.get(API_ENDPOINTS.EVALUATION.FETCH_TRAINING_SCHEDULE_BY_ID(id) )
  return response.data
}
export const fetchTrainingEvaluationById = async (id:string) => {
  const response = await apiClient.get(API_ENDPOINTS.EVALUATION.FETCH_TRAINING_EVALUATION_BY_ID(id) )
  return response.data
}
export const fetchSkill = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EVALUATION.FETCH_SKILL)
  return response.data}