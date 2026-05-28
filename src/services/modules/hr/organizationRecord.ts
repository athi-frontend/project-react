import { apiClient } from '@/shared/apiClient'

// TypeScript interfaces for the API response
export interface OrganizationRecord {
  file_id: number
  record_id: number
  document_name: string
  file_version_id: string
  version_no: string
  reviewed_date: string | null
  approved_date: string | null
  reviewed_by: string | null
  approved_by: string | null
}

export interface OrganizationRecordResponse {
  code: number
  status: string
  message: string
  description: string
  response_timestamp: string
  data: OrganizationRecord[]
}

// API endpoint
const ORGANIZATION_RECORD_ENDPOINT = 'api/v1/organization/record'

// Service function to fetch organization records
export const getOrganizationRecords = async (
  menuId: number,
  contextType: string | null,
  contextId: number
): Promise<OrganizationRecordResponse> => {
  const response = await apiClient.get(ORGANIZATION_RECORD_ENDPOINT, {
    params: {
      menu_id: menuId,
      context_type: contextType,
      context_id: contextId
    }
  })
  return response.data
} 