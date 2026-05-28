import { apiClient } from '@/shared/apiClient'
import { API_URLS } from '@/constants/modules/production/packageStorageInstructions'

/**
 * Classification: Confidential
 */

export interface StorageType {
  storage_type_id: number
  storage_type: string
  status: number
  slug: string
}

export interface StorageTypeResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: StorageType[]
}

export interface PackagingMaterial {
  part_number: string
  part_name: string
}

export interface PackagingStorageInstruction {
  packaging_storage_instruction_id: number
  project_id: number
  model_id: number
  packaging_materials_required: PackagingMaterial[]
  storage_type_id: number
  storage_type_name: string
  is_dismantle_during_packing: number
  is_assemble_complete_unit: number
  specific_instruction: string
  remarks: string
  packaging_instruction_supporting_file_documents: any[]
  storage_instruction_supporting_file_documents: any[]
}

export interface PackagingStorageInstructionResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: PackagingStorageInstruction[]
}

export const fetchStorageTypes = async (): Promise<StorageTypeResponse> => {
  const response = await apiClient.get(API_URLS.STORAGE_TYPE.ALL)
  return response.data
}

export const fetchPackagingStorageInstructionById = async (
  id: string | number , project_id 
): Promise<PackagingStorageInstructionResponse> => {
  const response = await apiClient.get(
    API_URLS.PACKAGING_STORAGE_INSTRUCTION.FETCH_BY_ID(id, project_id)
  )
  return response.data
}

export const postPackagingStorageInstruction = async (
  payload: FormData
): Promise<any> => {
  const response = await apiClient.post(
    API_URLS.PACKAGING_STORAGE_INSTRUCTION.POST,
    payload
  )
  return response.data
}


