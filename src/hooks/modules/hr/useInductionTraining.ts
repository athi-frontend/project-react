import { useQuery } from '@tanstack/react-query';
import { getInductionTrainings,getDesignOutputDocuments ,getSpecificInductionTraining, getInductionTopics} from '@/services/modules/hr/inductionTraining';
import { getUsers } from '@/services/common';
import { INDUCTION_TRAINING_CONSTANTS } from '@/constants/modules/hr/inductionTraining';

const { INDUCTION_TRAINING, USERS } = INDUCTION_TRAINING_CONSTANTS.RESPONSE_KEYS;
const { FETCH_DESIGN_OUTPUT_DOCUMENT_KEY } = INDUCTION_TRAINING_CONSTANTS.DESIGN_OUTPUT_DOCUMENT_QUERY_KEYS

export const useInductionTrainingData = () => {
  return useQuery({
    queryKey: [INDUCTION_TRAINING],
    queryFn: () => getInductionTrainings(),
    enabled: false, // Set to false if you want to manually trigger the query
  });
};

export const useInductionTrainingTopics = () => {
  return useQuery({
    queryKey: [INDUCTION_TRAINING+'_Topics'],
    queryFn: () => getInductionTopics(),
  });
};

export const useInductionTrainingById = (id:string) => {
  return useQuery({
    queryKey: [INDUCTION_TRAINING+id],
    queryFn: () => getSpecificInductionTraining(id),
    enabled:false
  });
};

export const useUsersData = () => {
  return useQuery({
    queryKey: [USERS],
    queryFn: () => getUsers(),
  });
};

export const useGetDesignOutputDocuments = (projectId: number) => {
  return useQuery({
    queryKey: [FETCH_DESIGN_OUTPUT_DOCUMENT_KEY],
    queryFn: () => getDesignOutputDocuments(projectId),
  })
}