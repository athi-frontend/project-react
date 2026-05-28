import { apiClient } from '../../../shared/apiClient'

export interface RecordGenerationRequest {
  menu_id: number
  context_id: number[]
  context_type?: string
  water_mark_text?: string
}

export interface RecordGenerationResponse {
  code: number
  status: string
  message: string
  description: string
  response_timestamp: string
  data: any[]
}

const RECORD_GENERATION_ENDPOINT = 'api/v1/organization/record/generate-document'

export const generateDocument = async (request: RecordGenerationRequest): Promise<RecordGenerationResponse> => {
  const response = await apiClient.post(RECORD_GENERATION_ENDPOINT, request)
  return response.data
} 