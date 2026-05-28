import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/dnd/clinicalEvaluation";

export const getClinicalEvaluationById = async(evaluationId: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(evaluationId))
    return response.data
}

export const postEvaluation = async(evaluationData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.POST_EVALUATION, evaluationData);
    return response.data
}

// Plan functions
export const getClinicalEvaluationPlanById = async(projectId: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_PLAN_BY_ID(projectId))
    return response.data
}

export const postClinicalEvaluationPlan = async(evaluationData: FormData) => {
    const response = await apiClient.post(API_ENDPOINTS.POST_PLAN, evaluationData);
    return response.data
}

// Report functions
export const getClinicalEvaluationReportById = async(projectId: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_REPORT_BY_ID(projectId))
    return response.data
}

export const postClinicalEvaluationReport = async(evaluationData: FormData) => {
    const response = await apiClient.post(API_ENDPOINTS.POST_REPORT, evaluationData);
    return response.data
}