/**
 *Classification : Confidential
 **/
import { apiClient } from '../../../shared/apiClient'
import { RISK_DEFINITION_LEVEL_API_ENDPOINTS } from '@/constants/modules/risk-management/riskLevelDefinition'
import {
  ProbabilityLevelAPI,
  SeverityLevelAPI,
  ProbabilityLevelUpsertPayload,
  SeverityLevelUpsertPayload,
  APIResponse,
} from '@/types/modules/risk-management/riskLevelDefinition'

export const getAllProbabilityLevels = async (
  projectId: number
): Promise<APIResponse<ProbabilityLevelAPI[]>> => {
  const response = await apiClient.get(
    RISK_DEFINITION_LEVEL_API_ENDPOINTS.GET_ALL_PROBABILITY_LEVELS,
    {
      params: { project_id: projectId },
    }
  )
  return response.data
}

export const getProbabilityLevelById = async (
  projectId: number,
  templateId: number
): Promise<APIResponse<ProbabilityLevelAPI[]>> => {
  const url = RISK_DEFINITION_LEVEL_API_ENDPOINTS.GET_PROBABILITY_LEVEL_BY_ID(
    projectId,
    templateId
  )
  const response = await apiClient.get(url)
  return response.data
}

export const upsertProbabilityLevel = async (
  data: ProbabilityLevelUpsertPayload
): Promise<APIResponse<any>> => {
  const response = await apiClient.post(
    RISK_DEFINITION_LEVEL_API_ENDPOINTS.UPSERT_PROBABILITY_LEVEL,
    data
  )
  return response.data
}

export const getAllSeverityLevels = async (
  projectId: number
): Promise<APIResponse<SeverityLevelAPI[]>> => {
  const response = await apiClient.get(
    RISK_DEFINITION_LEVEL_API_ENDPOINTS.GET_ALL_SEVERITY_LEVELS,
    {
      params: { project_id: projectId },
    }
  )
  return response.data
}

export const getSeverityLevelById = async (
  projectId: number,
  templateId: number
): Promise<APIResponse<SeverityLevelAPI[]>> => {
  const url = RISK_DEFINITION_LEVEL_API_ENDPOINTS.GET_SEVERITY_LEVEL_BY_ID(
    projectId,
    templateId
  )
  const response = await apiClient.get(url)
  return response.data
}

export const upsertSeverityLevel = async (
  data: SeverityLevelUpsertPayload
): Promise<APIResponse<any>> => {
  const response = await apiClient.post(
    RISK_DEFINITION_LEVEL_API_ENDPOINTS.UPSERT_SEVERITY_LEVEL,
    data
  )
  return response.data
}