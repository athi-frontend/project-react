import { useMutation, useQuery } from "@tanstack/react-query"
import {fetchAllNeeds, fetchSkills, fetchSources, fetchEmployee, fetchById, generateRecords} from "@/services/modules/hr/trainingNeeds"
import {QUERY_KEY} from "@/constants/modules/hr/trainingNeeds"

export const useFetchAllNeeds = () => {
    return useQuery({
        queryKey: [QUERY_KEY.TRAINING_NEEDS],
        queryFn: () => fetchAllNeeds()
    })
}

export const useFetchSkills = (status?: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.SKILLS],
        queryFn: () => fetchSkills(status)
    })
}

export const useFetchSources = (status?: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.SOURCE],
        queryFn: () => fetchSources(status)
    })
}

export const useFetchEmployee = () => {
    return useQuery({
        queryKey: [QUERY_KEY.EMPLOYEE],
        queryFn: () => fetchEmployee()
    })
}

export const useFetchNeedById = (need_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.TRAINING_NEEDS, need_id],
        queryFn: () => fetchById(need_id),
        enabled: !!need_id
    })
}

export const useGenerateRecords = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.TRAINING_NEEDS_GENERATE],
    mutationFn: (employee_id: number) => generateRecords(employee_id),
  });
};
