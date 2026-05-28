import { apiClient } from '@/shared/apiClient';
import { API_ENDPOINTS, PILOT_VALIDATION } from '@/constants/modules/dnd/pilotValidationReport';
import { PlaceOfValidation, ValidationReport, FunctionalBlockOption, DirOption } from '@/types/modules/dnd/pilotValidationReport';
import { NUMBERMAP } from '@/constants/common';

export const getPlaceOfValidation = async (projectId: number): Promise<PlaceOfValidation[]> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_PLACE_OF_VALIDATION(projectId));
  return response.data;
};

export const getValidationReport = async (validationId: number): Promise<ValidationReport> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_VALIDATION_REPORT(validationId));
  return response.data;
};

export const getFunctionalBlock = async (projectId: number): Promise<{ data: FunctionalBlockOption[] }> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_FUNCTIONAL_BLOCK(projectId));
  return response.data;
};

export const postValidationReport = async (data: FormData): Promise<ValidationReport> => {
  const response = await apiClient.post(API_ENDPOINTS.POST_VALIDATION_REPORT(), data);
  return response.data;
};

export const getDirOptions = async (projectId: number, projectStageOrderId: number): Promise<{ data: DirOption[] }> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_DIR_OPTIONS(projectId, projectStageOrderId));
  return response.data;
};

export const getDecisionOptions = async (): Promise<{ data: { id: number; name: string }[] }> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_DECISION)
  return response.data
}

export const downloadTemplate = async (templateId: number): Promise<{ assetUrl: string }> => {
  const apiResponse = await apiClient.get(API_ENDPOINTS.TEMPLATE_DOWNLOAD(templateId))
  const assetUrl = apiResponse.data?.data?.[NUMBERMAP.ZERO]?.assetUrl
  if (!assetUrl) {
    throw new Error(PILOT_VALIDATION.DOWNLOAD_TEMPLATE.ERROR_MESSAGES.ASSET_URL_NOT_FOUND)
  }

  return { assetUrl }
}