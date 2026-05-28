import { NUMBERMAP } from '@/constants/common'
import { API_ENDPOINTS, RT_API_CONSTANTS } from '@/constants/modules/risk-management/riskTeam'
import { apiClient } from '@/shared/apiClient'
import {
  RiskTeamResponse,
  RiskTeamRequest,
  Stage,
  Responsibility,
  Employee,
  ApiResponse,
} from '@/types/modules/risk-management/riskTeam'

/**
 * Classification: Confidential
 */

/**
 * Function Name: getAllRiskTeam
 * Params: projectId
 * Description: API for fetching all risk team data by project ID
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const getAllRiskTeam = async (
  projectId: number
): Promise<RiskTeamResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_RISK_TEAM_ALL, {
    params: { project_id: projectId },
  })
  return response.data
}

/**
 * Function Name: postRiskTeam
 * Params: data
 * Description: API for creating/updating risk team data
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const postRiskTeam = async (data: RiskTeamRequest): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.POST_RISK_TEAM, data)
}

/**
 * Function Name: getRiskTeamById
 * Params: risk_team_id
 * Description: API for fetching risk team by ID
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const getRiskTeamById = async (
  risk_team_id: number,
  projectId: number
): Promise<RiskTeamResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_RISK_TEAM_BY_ID(risk_team_id),
    {
      params: { project_id: projectId },
    }
  )
  return response.data
}

/**
 * Function Name: getStages
 * Params: project_id, status
 * Description: API for fetching risk applicability stages by project ID. Status is only included in query params when explicitly provided.
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const getStages = async (
  project_id: number,
  status?: number
): Promise<ApiResponse<Stage>> => {
  const params: { project_id: number; status?: number } = { project_id }
  
  // Only include status in params if it's explicitly provided
  if (status !== undefined) {
    params.status = status
  }
  
  const response = await apiClient.get(API_ENDPOINTS.GET_STAGES, {
    params,
  })
  return response.data
}

/**
 * Function Name: getResponsibilities
 * Params: None
 * Description: API for fetching all risk responsibilities
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const getResponsibilities = async (stage_id?: number): Promise<
  ApiResponse<Responsibility>
> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_RESPONSIBILITIES, {
    params: { stage_id,  status: NUMBERMAP.ONE },
  })
  return response.data
}

/**
 * Function Name: getEmployeesBySkills
 * Params: skill_ids, status
 * Description: API for fetching employees by skills with status filter
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const getEmployeesBySkills = async (
  skill_ids: number[],
  status: number
): Promise<ApiResponse<Employee>> => {
  const skillIdsString = skill_ids.join(',')
  const response = await apiClient.get(
    API_ENDPOINTS.GET_EMPLOYEES_BY_SKILLS(skillIdsString),
    {
      params: { status, workflow_status: RT_API_CONSTANTS.WORKFLOW_STATUS },
    }
  )
  return response.data
}

/**
 * Function Name: deleteRiskTeam
 * Params: risk_team_id
 * Description: API for deleting risk team data by ID
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const deleteRiskTeam = async (risk_team_id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DELETE_RISK_TEAM(risk_team_id))
}
