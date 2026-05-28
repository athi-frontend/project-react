/**
 * Classification : Confidential
 **/
import { apiClient } from '@/shared/apiClient'
import { COMMITTEE_API_ENDPOINTS } from '@/constants/modules/risk-management/committee'
import {
  CommitteeFormData,
  CommitteeListResponse,
  CommitteeFetchResponse,
  EmployeeListResponse,
} from '@/types/modules/risk/committee'
import { NUMBERMAP } from '@/constants/common'
import { RT_API_CONSTANTS } from '@/constants/modules/risk-management/riskTeam'

export const getCommitteeList = async (
  projectId: number
): Promise<CommitteeListResponse> => {
  const response = await apiClient.get(
    COMMITTEE_API_ENDPOINTS.GET_COMMITTEE_ALL,
    {
      params: { project_id: projectId },
    }
  )
  return response.data
}

export const getCommitteeById = async (
  committeeId: number,
  projectId: number
): Promise<CommitteeFetchResponse> => {
  const url = COMMITTEE_API_ENDPOINTS.GET_COMMITTEE_BY_ID(committeeId)
  const response = await apiClient.get(url, {
    params: { project_id: projectId },
  })
  return response.data
}

export const upsertCommittee = async (committeeData: CommitteeFormData) => {
  const response = await apiClient.post(
    COMMITTEE_API_ENDPOINTS.UPSERT_COMMITTEE,
    committeeData
  )
  return response.data
}

export const deleteCommittee = async (committeeId: number) => {
  const url = COMMITTEE_API_ENDPOINTS.DELETE_COMMITTEE(committeeId)
  const response = await apiClient.delete(url)
  return response.data
}

export const getEmployees = async (
  roleId?: number
): Promise<EmployeeListResponse> => {
  const params = roleId
    ? {
        selected_role_id: roleId,
        status: NUMBERMAP.ONE,
        workflow_status: RT_API_CONSTANTS.WORKFLOW_STATUS,
      }
    : {}
  const response = await apiClient.get(COMMITTEE_API_ENDPOINTS.GET_EMPLOYEES, {
    params,
  })
  return response.data
}
