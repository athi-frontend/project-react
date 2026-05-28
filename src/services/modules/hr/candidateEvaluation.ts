// services/modules/hr/candidateEvaluation.ts
import { apiClient } from '@/shared/apiClient';
import { CandidateEvaluationResponse, CandidateEvaluationDetailsResponse } from '@/types/modules/hr/candidateEvaluation';
import { CANDIDATE_EVALUATION_CONSTANTS } from '@/constants/modules/hr/candidateEvaluation';
import { NUMBERMAP } from '@/constants/common';

export const getCandidateEvaluations = async (workflow_status?:string): Promise<{ data: CandidateEvaluationResponse[] }> => {
  try {
    const response = await apiClient.get(
      CANDIDATE_EVALUATION_CONSTANTS.CANDIDATE_EVALUATION_SERVICE.ENDPOINTS.GET_CANDIDATE_EVALUATIONS,
      {
        params:{
          workflow_status:workflow_status
        }
      }
    );
    return response.data;
  } catch {
    throw new Error(CANDIDATE_EVALUATION_CONSTANTS.CANDIDATE_EVALUATION_SERVICE.ERRORS.FAILED_TO_FETCH_CANDIDATE_EVALUATIONS);
  }
};


export const getCandidateEvaluationsByInterviewStatus = async (id:string,status?:boolean): Promise<{ data: CandidateEvaluationResponse[] }> => {
  try {
    const response = await apiClient.get(
      CANDIDATE_EVALUATION_CONSTANTS.CANDIDATE_EVALUATION_SERVICE.ENDPOINTS.GET_CANDIDATE_EVALUATIONS,{
        params: { resource_requisition_id: id ,interview_status:NUMBERMAP.THREE,onboard_status:status ,workflow_status:"Approved"}
      }
    );
    return response.data;
  } catch {
    throw new Error(CANDIDATE_EVALUATION_CONSTANTS.CANDIDATE_EVALUATION_SERVICE.ERRORS.FAILED_TO_FETCH_CANDIDATE_EVALUATIONS);
  }
};

export const getCandidateEvaluationById = async (id: number): Promise<{ data: CandidateEvaluationDetailsResponse[] }> => {
  try {
    const response = await apiClient.get(
      CANDIDATE_EVALUATION_CONSTANTS.CANDIDATE_EVALUATION_SERVICE.ENDPOINTS.GET_CANDIDATE_EVALUATION_BY_ID(id)
    );
    return response.data;
  } catch {
    throw new Error(CANDIDATE_EVALUATION_CONSTANTS.CANDIDATE_EVALUATION_SERVICE.ERRORS.FAILED_TO_FETCH_CANDIDATE_EVALUATION_BY_ID);
  }
};