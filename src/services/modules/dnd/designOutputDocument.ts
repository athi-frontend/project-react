import { apiClient } from "@/shared/apiClient"
import { DESIGN_OUTPUT_DOCUMENT_API_ENDPOINTS } from "@/constants/modules/dnd/design-output-document"
const {GET_DESIGN_OUTPUT_DOCUMENTS, SUBMIT_DESIGN_OUTPUT, FETCH_DESIGN_TRANSFER_PLAN_BY_ID} = DESIGN_OUTPUT_DOCUMENT_API_ENDPOINTS

export const getDesignOutputDocuments = async (projectId: number) => {
  const response = await apiClient.get(GET_DESIGN_OUTPUT_DOCUMENTS(projectId))
  return response.data
}


export const submitDesignOutputDocument = async (designOutputDocument: FormData) => {
  const response = await apiClient.post(
    SUBMIT_DESIGN_OUTPUT,
    designOutputDocument
  )

  return response.data
}

export const getDesignTransferPlanById = async (designTransferPlanId: number) => {
    const response = await apiClient.get(FETCH_DESIGN_TRANSFER_PLAN_BY_ID(designTransferPlanId))
    return response.data
}