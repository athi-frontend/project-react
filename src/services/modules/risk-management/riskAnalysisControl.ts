import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS, HAZARD_API_ENDPOINTS, HARM_API_ENDPOINTS, REFERENCE_RCM_API_ENDPOINTS } from '@/constants/modules/risk-management/riskAnalysisControl'
import {
  CategoriesApiResponse,
  SubcategoriesApiResponse,
  UpsertCategoryRequest,
  UpsertRiskRequest,
  RiskApiResponse,
  SingleRiskApiResponse,
  ProbabilityLevelsApiResponse,
  SeverityLevelsApiResponse,
  RiskIdentificationMethodsApiResponse,
  RCMApiResponseWrapper,
  UpsertRCMRequest,
  RCMTypesApiResponse,
  RiskAcceptabilityApiResponseWrapper,
  HazardsApiResponse,
  SingleHazardApiResponseWrapper,
  UpsertHazardRequest,
  HarmDropdownResponse,
  ReferenceRCMResponse
} from '@/types/modules/risk-management/riskAnalysisControl'
import { NUMBERMAP } from '@/constants/common'
/**
 * Classification: Confidential
 */
export const fetchRiskCategories = async (
  projectId: number
): Promise<CategoriesApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_CATEGORIES, {
    params: { project_id: projectId, status: NUMBERMAP.ONE },
  })
  return response.data
}

export const fetchRiskSubcategories = async (
  categoryId: number,
  projectId: number,
  responseRequired?: boolean
): Promise<SubcategoriesApiResponse> => {
  const params = {
    category_id: categoryId,
    project_id: projectId,
    ...(responseRequired
      ? { response_required: true }
      : {}),
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SUBCATEGORIES, {
    params,
  })
  return response.data
}

export const upsertRiskCategory = async (data: UpsertCategoryRequest): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT_CATEGORY, data);
  return response.data;
};

// Risk Management Services
export const upsertRisk = async (data: UpsertRiskRequest): Promise<RiskApiResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT_RISK(), data);
  return response.data;
};

export const fetchRiskById = async (riskId: number): Promise<SingleRiskApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_RISK_BY_ID(riskId));
  return response.data;
};

export const deleteRisk = async (riskId: number): Promise<any> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE_RISK(riskId));
  return response.data;
};

// Dropdown Services
export const fetchProbabilityLevels = async (projectId: number): Promise<ProbabilityLevelsApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PROBABILITY_LEVELS(projectId));
  return response.data;
};

export const fetchSeverityLevels = async (projectId: number): Promise<SeverityLevelsApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SEVERITY_LEVELS(projectId));
  return response.data;
};

export const fetchRiskIdentificationMethods = async (): Promise<RiskIdentificationMethodsApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_RISK_IDENTIFICATION_METHODS());
  return response.data;
};

// RCM Services
export const fetchRCM = async (rcmId: number): Promise<RCMApiResponseWrapper> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_RCM(rcmId));
  return response.data;
};

export const upsertRCM = async (data: UpsertRCMRequest): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT_RCM(), data);
  return response.data;
};

export const deleteRCM = async (rcmId: number): Promise<any> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE_RCM(rcmId));
  return response.data;
};

export const fetchRCMTypes = async (): Promise<RCMTypesApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_RCM_TYPES());
  return response.data;
};

export const fetchRiskAcceptability = async (
  probabilityLevelId: number, 
  severityLevelId: number
): Promise<RiskAcceptabilityApiResponseWrapper> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_RISK_ACCEPTABILITY(),{
    params: { probability_level_id: probabilityLevelId, severity_level_id: severityLevelId }
  });
  return response.data;
};

// Hazard Management Services
/**
 * Fetch all hazards for a specific subcategory applicability
 */
export const fetchAllHazards = async (subcategoryApplicabilityId: number): Promise<HazardsApiResponse> => {
  const response = await apiClient.get(HAZARD_API_ENDPOINTS.FETCH_ALL(subcategoryApplicabilityId), {
    params: { status: NUMBERMAP.ONE }
  });
  return response.data;
};

/**
 * Fetch a specific hazard by ID
 */
export const fetchHazardById = async (hazardId: number): Promise<SingleHazardApiResponseWrapper> => {
  const response = await apiClient.get(HAZARD_API_ENDPOINTS.FETCH_BY_ID(hazardId));
  return response.data;
};

/**
 * Create or update a hazard
 */
export const upsertHazard = async (hazardData: UpsertHazardRequest): Promise<any> => {
  const response = await apiClient.post(HAZARD_API_ENDPOINTS.UPSERT, hazardData);
  return response.data;
};

/**
 * Delete a hazard by ID
 */
export const deleteHazard = async (hazardId: number): Promise<any> => {
  const response = await apiClient.delete(HAZARD_API_ENDPOINTS.DELETE(hazardId));
  return response.data;
};

/**
 * Fetch all harm options for dropdown
 */
export const fetchAllHarms = async (): Promise<HarmDropdownResponse> => {
  const response = await apiClient.get(HARM_API_ENDPOINTS.FETCH_ALL);
  return response.data;
};

/**
 * Fetch all reference RCM options for dropdown
 */
export const fetchReferenceRCM = async (
  projectId: number
): Promise<ReferenceRCMResponse> => {
  const response = await apiClient.get(REFERENCE_RCM_API_ENDPOINTS.FETCH_ALL, {
    params: { project_id: projectId }
  });
  return response.data;
};

