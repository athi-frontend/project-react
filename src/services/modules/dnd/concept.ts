import { apiClient } from "@/shared/apiClient"
import { CONCEPT_API_ENDPOINTS, CONCEPT_CONSTANTS } from "@/constants/modules/dnd/concept"

const { GET_CONCEPTS, UPSERT_CONCEPT } = CONCEPT_API_ENDPOINTS

export const getConcepts = async (project_stage_order_id: number) => {
  const response = await apiClient.get(GET_CONCEPTS(project_stage_order_id))
  return response.data
}

export const upsertConcept = async (formData: FormData) => {
  const response = await apiClient.post(UPSERT_CONCEPT, formData, {
    headers: {
      'Content-Type': CONCEPT_CONSTANTS.MULTIPART_FORM_DATA,
    },
  })
  return response.data
}