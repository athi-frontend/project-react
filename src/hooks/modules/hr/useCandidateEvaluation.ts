import { useQuery } from '@tanstack/react-query';
import { getCandidateEvaluations, getCandidateEvaluationById, getCandidateEvaluationsByInterviewStatus } from '@/services/modules/hr/candidateEvaluation';
import { getInterviewStatus, getUsers } from '@/services/common';
import { CANDIDATE_EVALUATION_CONSTANTS, INTERVIEW_STATUS, USERS } from '@/constants/modules/hr/candidateEvaluation';

export const useCandidateEvaluationData = (workflow_status?:string) => {
  return useQuery({
    queryKey: [CANDIDATE_EVALUATION_CONSTANTS.RESPONSE_KEYS.CANDIDATE_EVALUATION],
    queryFn:()=> getCandidateEvaluations(workflow_status),
    enabled: false, // Set to false if you want to manually trigger the query
  });
};


export const useCandidateEvaluationDataByInterview = (id:string,status?:boolean) => {
  return useQuery({
    queryKey: [CANDIDATE_EVALUATION_CONSTANTS.RESPONSE_KEYS.CANDIDATE_EVALUATION+id],
    queryFn: () => getCandidateEvaluationsByInterviewStatus(id,status),
    enabled: false
  });
};



export const useCandidateEvaluationById = (id: number) => {
  return useQuery({
    queryKey: [CANDIDATE_EVALUATION_CONSTANTS.RESPONSE_KEYS.CANDIDATE_EVALUATION, id],
    queryFn: () => getCandidateEvaluationById(id),
    enabled: !!id, 
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: [USERS],
    queryFn: getUsers,
  })
}

// hook method to bind values for interview status dropdown
export const useInterviewStatus = () => {
  return useQuery({
    queryKey: [INTERVIEW_STATUS],
    queryFn: getInterviewStatus,
  })
}