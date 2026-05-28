import { NUMBERMAP } from '@/constants/common'
import { DESIGN_QUALITY_PLAN } from '@/constants/modules/dnd/designQualityPlan'

import { apiClient } from '@/shared/apiClient'

/**
    Classification : Confidential
**/
const {
  DESIGN_QUALITY_PLAN_API_ENDPOINTS: {
    GET_DESIGN_QUALITY_PLAN,
    UPSERT_DESIGN_QUALITY_PLAN,
    GET_DESIGN_STAGE_ITEMS,
    GET_SPECIFICATION_APPLICABILITY,
    GET_DESIGN_QUALITY_PLAN_BY_ID,
  },
} = DESIGN_QUALITY_PLAN

export const getDesignQualityPlan = async (projectId: number) => {
  const response = await apiClient.get(GET_DESIGN_QUALITY_PLAN(projectId))
  return response.data
}

export const upsertDesignQualityPlan = async (projectId: number, data: any) => {
  const response = await apiClient.post(
    UPSERT_DESIGN_QUALITY_PLAN(projectId),
    data
  )
  return response.data
}

export const getDesignStageItems = async () => {
  const response = await apiClient.get(GET_DESIGN_STAGE_ITEMS)
  return response.data
}

export const getSpecificationApplicability = async (projectId: number) => {
  const response = await apiClient.get(
    GET_SPECIFICATION_APPLICABILITY(projectId)
  )
  return response.data
}

export const fetchDesignQualityPlanByStageOrderId = async (
  projectId: number,
  stageOrderId: number
) => {
  const response = await apiClient.get(
      GET_DESIGN_QUALITY_PLAN_BY_ID(projectId, stageOrderId)
  );
  const item = response.data?.data?.[NUMBERMAP.ZERO];
  if (!item) throw new Error(DESIGN_QUALITY_PLAN.VALIDATION.FETCH_BY_ID);
  return item; 
};