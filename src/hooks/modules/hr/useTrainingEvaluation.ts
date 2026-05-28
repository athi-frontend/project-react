import { useQuery } from "@tanstack/react-query"
import {fetchEvaluations, fetchEvaluationById, fetchTrainingSchedule, fetchTrainingScheduleById, fetchSkill, fetchTrainingEvaluationById} from "@/services/modules/hr/trainingEvaluation"
import {TRAINING_EVALUATION,TRAINING_EVALUATION_BY_ID, TRAINING_SCHEDULE, TRAINING_SCHEDULE_BY_ID, SKILLS, TRAINING_EVALUATION_FETCH_BY_ID} from "@/constants/modules/hr/trainingEvaluation"

export const useFetchAllEvaluation = () => {
    return useQuery({
        queryKey: [TRAINING_EVALUATION],
        queryFn: () => fetchEvaluations()
    })
}

export const useFetchEvaluationById = (id: string) => {
    return useQuery({
        queryKey: [TRAINING_EVALUATION_BY_ID, id],
        queryFn: () => fetchEvaluationById(id),
        enabled: !!id
    })
}

export const useFetchTrainingSchedule = () => {
    return useQuery({
        queryKey: [TRAINING_SCHEDULE],
        queryFn: () => fetchTrainingSchedule()
    })
}

export const useFetchTrainingScheduleById = (id: string) => {
    return useQuery({
        queryKey: [TRAINING_SCHEDULE_BY_ID, id],
        queryFn: () => fetchTrainingScheduleById(id),
        enabled: !!id
    })
}
export const useFetchTrainingEvaluationById = (id: string) => {
    return useQuery({
        queryKey: [TRAINING_EVALUATION_FETCH_BY_ID, id],
        queryFn: () => fetchTrainingEvaluationById(id),
        enabled: !!id
    })
}

export const useFetchSkill = () => {
    return useQuery({
        queryKey: [SKILLS],
        queryFn: () => fetchSkill()
    })
}
