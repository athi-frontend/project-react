import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { 
    getClinicalEvaluationById, 
    postEvaluation,
    getClinicalEvaluationPlanById,
    postClinicalEvaluationPlan,
    getClinicalEvaluationReportById,
    postClinicalEvaluationReport
} from "@/services/modules/dnd/clinicalEvaluation";
import { QUERY_KEYS } from "@/constants/modules/dnd/clinicalEvaluation";
import { STATUS } from '@/constants/common'
import { showActionAlert } from '@/components/ui'


export const useClinicalEvaluationById = (evaluationId: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CLINICAL_EVALUATION, evaluationId],
        queryFn: () => getClinicalEvaluationById(evaluationId),
        enabled: !!evaluationId
    })
}

export const useSaveEvaluationData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (evaluationData: any) => postEvaluation(evaluationData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CLINICAL_EVALUATION]})
        },
         onError: () => {
              showActionAlert(STATUS.FAILED)
            },
    })
}

// Plan hooks
export const useClinicalEvaluationPlanById = (projectId: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CLINICAL_EVALUATION_PLAN, projectId],
        queryFn: () => getClinicalEvaluationPlanById(projectId),
        enabled: !!projectId
    })
}

export const useSaveClinicalEvaluationPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (evaluationData: FormData) => postClinicalEvaluationPlan(evaluationData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CLINICAL_EVALUATION_PLAN]})
        },
        onError: () => {
            showActionAlert(STATUS.FAILED)
        },
    })
}

// Report hooks
export const useClinicalEvaluationReportById = (projectId: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CLINICAL_EVALUATION_REPORT, projectId],
        queryFn: () => getClinicalEvaluationReportById(projectId),
        enabled: !!projectId
    })
}

export const useSaveClinicalEvaluationReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (evaluationData: FormData) => postClinicalEvaluationReport(evaluationData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CLINICAL_EVALUATION_REPORT]})
        },
        onError: () => {
            showActionAlert(STATUS.FAILED)
        },
    })
}