import { apiClient } from '@/shared/apiClient';
import { InductionTrainingResponse } from '@/types/modules/hr/inductionTraining';
import { INDUCTION_TRAINING_CONSTANTS } from '@/constants/modules/hr/inductionTraining';

export const getInductionTrainings = async (): Promise<{ data: InductionTrainingResponse[] }> => {
  try {
    const response = await apiClient.get(
      INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ENDPOINTS.GET_INDUCTION_TRAININGS+"all"
    );
    return response.data;
  } catch {
    throw new Error(INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ERRORS.FAILED_TO_FETCH_INDUCTION_TRAININGS);
  }
};

export const getInductionTopics = async (): Promise<{ data: InductionTrainingResponse[] }> => {
  try {
    const response = await apiClient.get(
      INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ENDPOINTS.GET_ALL_TOPICS
    );
    return response.data;
  } catch {
    throw new Error(INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ERRORS.FAILED_TO_FETCH_INDUCTION_TRAININGS);
  }
};

export const getSpecificInductionTraining = async (id:string): Promise<{ data: InductionTrainingResponse[] }> => {
  try {
    const response = await apiClient.get(
      INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ENDPOINTS.GET_INDUCTION_TRAININGS+id
    );
    return response.data;
  } catch {
    throw new Error(INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ERRORS.FAILED_TO_FETCH_INDUCTION_TRAININGS);
  }
};

export const getDesignOutputDocuments = async (projectId: number) => {
  try {
    const response = await apiClient.get(
      INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ENDPOINTS.GET_DESIGN_OUTPUT_DOCUMENTS(projectId)
    );
    return response.data;
  } catch {
    throw new Error(INDUCTION_TRAINING_CONSTANTS.INDUCTION_TRAINING_SERVICE.ERRORS.FAILED_TO_FETCH_DOD);
  }
};