import { apiClient } from '@/shared/apiClient'
import {
  StageDropdownResponse,
  CreateProjectStageData,
  PrototypeResponse,
  UpdatePrototypeData,
  DirDropdownResponse,
  CreateVerificationPlanData,
  VerificationPlanResponse,
  VerificationPlanByIdResponse,
  UpdateVerificationPlanData,
  UpdateProjectStageData,
} from '@/types/modules/dnd/stageTypes'
import { PROJECT_STAGES_SERVICE } from '@/constants/modules/dnd/stageService'

export const projectStagesService = {
  getProjectStages: async (projectId: number) => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_PROJECT_STAGES(projectId)
    )
    return response.data
  },

  getStagesDropdown: async (): Promise<StageDropdownResponse> => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_STAGES_DROPDOWN
    )
    return response.data
  },

  createProjectStage: async (data: CreateProjectStageData) => {
    const response = await apiClient.post(
      PROJECT_STAGES_SERVICE.ENDPOINTS.CREATE_PROJECT_STAGE,
      data
    )
    return response.data
  },

  deleteProjectStage: async (stageId: number) => {
    const response = await apiClient.delete(
      PROJECT_STAGES_SERVICE.ENDPOINTS.DELETE_PROJECT_STAGE(stageId)
    )
    return response.data
  },

  getPrototypeData: async (
    projectStageOrderId: number
  ): Promise<PrototypeResponse> => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_PROTOTYPE_DATA(projectStageOrderId)
    )
    return response.data
  },

  updatePrototypeData: async (
    projectStageOrderId: number,
    data: UpdatePrototypeData
  ) => {
    const response = await apiClient.put(
      PROJECT_STAGES_SERVICE.ENDPOINTS.UPDATE_PROTOTYPE_DATA(
        projectStageOrderId
      ),
      data
    )
    return response.data
  },

  getDirList: async (
    projectId: number,
    projectStageOrderId: number,
    page: number,
    pageSize: number
  ): Promise<DirDropdownResponse> => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_DIR_LIST(projectId, projectStageOrderId)
    )
    return response.data
  },

  createVerificationPlan: async (data: FormData | CreateVerificationPlanData) => {
    const response = await apiClient.post(
      PROJECT_STAGES_SERVICE.ENDPOINTS.CREATE_VERIFICATION_PLAN,
      data
    )
    return response.data
  },

  getVerificationPlans: async (
    projectStageOrderId: number
  ): Promise<VerificationPlanResponse> => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_VERIFICATION_PLANS(
        projectStageOrderId
      )
    )
    return response.data
  },

  deleteVerificationPlan: async (verificationPlanId: number) => {
    const response = await apiClient.delete(
      PROJECT_STAGES_SERVICE.ENDPOINTS.DELETE_VERIFICATION_PLAN(
        verificationPlanId
      )
    )
    return response.data
  },

  getVerificationPlanById: async (
    projectStageOrderId: number,
    verificationPlanId: number
  ): Promise<VerificationPlanByIdResponse> => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_VERIFICATION_PLAN_BY_ID(
        projectStageOrderId,
        verificationPlanId
      )
    )
    return response.data
  },

  updateVerificationPlan: async (
    verificationPlanId: number,
    data: FormData | UpdateVerificationPlanData
  ) => {
    const response = await apiClient.put(
      PROJECT_STAGES_SERVICE.ENDPOINTS.UPDATE_VERIFICATION_PLAN(
        verificationPlanId
      ),
      data
    )
    return response.data ?? { success: true }
  },
  getProjectStageById: async (projectId: number) => {
    const response = await apiClient.get(
      PROJECT_STAGES_SERVICE.ENDPOINTS.GET_PROJECT_STAGE_BY_ID(projectId)
    )
    return response.data
  },

  updateProjectStage: async (
      projectStageOrderId: number,
      data: UpdateProjectStageData
    ) => {
      const response = await apiClient.patch(
      PROJECT_STAGES_SERVICE.ENDPOINTS.UPDATE_PROTOTYPE_DATA(
        projectStageOrderId
      ),
      data
    )
    return response.data
  },
}