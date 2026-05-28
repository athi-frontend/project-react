import { apiClient } from '@/shared/apiClient'
import {
  ToolOption,
  DesignInputGatheringFormData,
  DesignTransferChecklist,
  DocRef,
} from '@/types/modules/dnd/projectPlan'
import { API_ENDPOINTS } from '@/constants/modules/dnd/projectPlan'

export const getDesignTools = async (): Promise<ToolOption[]> => {
  const response = await apiClient.get(API_ENDPOINTS.DESIGN_TOOLS)
  const tools = response.data?.data
  return tools
}

export const getDesignEquipments = async (): Promise<ToolOption[]> => {
  const response = await apiClient.get(API_ENDPOINTS.DESIGN_EQUIPMENTS)
  const equipments = response.data?.data
  return equipments
}

export const getDesignTransfer = async (projectId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.DESIGN_TRANSFER(projectId))
  const DesignData = response.data?.data
  return DesignData
}

export const getDocRef = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DOCUMENT_REFERENCE)
  const DocData = response.data?.data
  return DocData
}

export const projectPlanApi = {
  getProjectPlan: async (projectId: number) => {
    const response = await apiClient.get(API_ENDPOINTS.PROJECT_PLAN(projectId))
    return response.data
  },
}

export const fetchDesignTeamData = async (projectId: string): Promise<any> => {
  const response = await apiClient.get(API_ENDPOINTS.DESIGN_TEAM(projectId))
  return response.data
}

export const upsertProjectPlan = async (payload: any): Promise<any> => {
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT_PROJECT_PLAN,
    payload
  )
  return response.data
}

export const getDesignInputGatheringDropdown = async (projectId: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_DESIGN_INPUT_GATHERING(projectId)
  )
  return response.data
}

export const submitDesignInputGathering = async (
  digData: DesignInputGatheringFormData
) => {
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT_DESIGN_INPUT_GATHERING,
    digData
  )
  return response.data
}

export const submitStageWiseVariable = async (stageWise: any) => {
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT_STAGE_WISE,
    stageWise
  )
  return response.data
}

export const getStageWiseListById = async (stageId: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_STAGE_WISE_LIST_BY_ID(stageId)
  )
  return response.data
}

/**
 * Description: service to submit Design Transfer
 * Author: Harsithiga B
 * Data: 09-06-2025
 */
export const submitDesignTransfer = async (
  designTransfer: DesignTransferChecklist,
  projectId: number
) => {
  const response = await apiClient.post(
    API_ENDPOINTS.DESIGN_TRANSFER(projectId),
    designTransfer
  )
  return response.data
}

/**
 * Description: service to submit Document Reference
 * Author: Harsithiga B
 * Data: 09-06-2025
 */
export const submitDocumentReference = async (documentReference: DocRef) => {
  const response = await apiClient.post(
    API_ENDPOINTS.POST_DOCUMENT_REFERENCE,
    documentReference
  )  
  return response.data
}
