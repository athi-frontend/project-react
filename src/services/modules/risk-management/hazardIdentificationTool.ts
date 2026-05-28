/**
 * Hazard Identification Tool Services
 * Classification: Confidential
 */
import { NUMBERMAP } from '@/constants/common'
import { HAZARD_IDENTIFICATION_TOOL_CONSTANTS } from '@/constants/modules/risk-management/hazardIdentificationTool'
import { apiClient } from '@/shared/apiClient'
import {
  HazardIdentificationToolUpsertRequest,
} from '@/types/modules/risk-management/hazardIdentificationTool'

const { API } = HAZARD_IDENTIFICATION_TOOL_CONSTANTS

export const fetchHazardIdentificationToolDropdown = async (
  statusVal: number = NUMBERMAP.ONE
) => {
  const response = await apiClient.get(API.DROPDOWN, {
    params: { status: statusVal },
  })
  return response.data
}

export const upsertHazardIdentificationTool = async (
  payload: HazardIdentificationToolUpsertRequest
): Promise<void> => {
  await apiClient.post(API.UPSERT, payload)
}

export const fetchHazardIdentificationToolByProject = async (
  projectId: number
) => {
  const response = await apiClient.get(API.FETCH_BY_PROJECT, {
    params: { project_id: projectId },
  })
  return response.data
}
