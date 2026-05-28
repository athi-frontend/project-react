import { API_ENDPOINTS } from '@/constants/modules/production/jigsAndFixtureValidation';
import { apiClient } from '@/shared/apiClient';
import { 
  JigFixtureValidationListResponse,
  JigFixtureValidationByIdResponse,
  JigFixtureValidationUpsertRequest,
  JigFixtureValidationUpsertResponse,
} from '@/types/modules/production/jigsAndFixtureValidation';

/**
 * Classification : Confidential
 **/

export const getJigFixtureValidationList = async (
  projectId: number
): Promise<JigFixtureValidationListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_JIG_FIXTURE_VALIDATION_ALL, {
    params: { project_id: projectId },
  });
  return response.data;
};

export const getJigFixtureValidationById = async (
  jig_fixture_validation_id: number
): Promise<JigFixtureValidationByIdResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_JIG_FIXTURE_VALIDATION_BY_ID(jig_fixture_validation_id));
  return response.data;
};

export const upsertJigFixtureValidation = async (
  data: JigFixtureValidationUpsertRequest
): Promise<JigFixtureValidationUpsertResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT_JIG_FIXTURE_VALIDATION, data);
  return response.data;
};

export const deleteJigFixtureValidation = async (jig_fixture_validation_id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DELETE_JIG_FIXTURE_VALIDATION(jig_fixture_validation_id));
};

