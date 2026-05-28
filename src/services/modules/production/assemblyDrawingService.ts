/**
 * Classification: Confidential
 * Assembly Drawing Service
 * Separate service for Assembly Drawings Form with FormData payload
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/production/common'
import { populateFormData } from '@/lib/utils/fileUploadManager'
import { FinalFileData } from '@/lib/utils/common'
import { NUMBERMAP } from '@/constants/common'

export interface AssemblyDrawingDocument {
  file_id: number
  file_name: string
  file_description: string | null
  file_object_key: string
  purpose: string | null
  guid: string
  source: string | null
  file_size: number
  version: string
  updated_date: string | null
  updated_by: string | null
  status: number
  uploaded_date: string
  extension: string
  file_bucket: string
  file_tags: any[]
}

export interface AssemblyDrawingApiResponse {
  id: number
  drawing_number: string
  document: AssemblyDrawingDocument[]
  status: number
}

export interface AssemblyDrawingListResponse {
  data: AssemblyDrawingApiResponse[]
  total?: number
  page?: number
  limit?: number
}

export interface AssemblyDrawingPayload {
  part_assembly_drawing_id?: number
  applicable_settings_id: number
  drawing_number: string
  finalFileData: FinalFileData
}

/**
 * Fetch all assembly drawings by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @returns Promise<AssemblyDrawingListResponse>
 */
export const fetchAssemblyDrawingList = async (
  assemblyPartItemDetailId: number
): Promise<AssemblyDrawingListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ELECTRICAL_DRAWING_LIST(assemblyPartItemDetailId), {
    params: { status: NUMBERMAP.ONE }
  })
  return response.data
}

/**
 * Fetch assembly drawing by ID
 * @param drawingId - Drawing ID
 * @returns Promise<AssemblyDrawingApiResponse>
 */
export const fetchAssemblyDrawingById = async (
  drawingId: number
): Promise<AssemblyDrawingApiResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ELECTRICAL_DRAWING_BY_ID(drawingId))
  return response.data
}

/**
 * Upsert assembly drawing with FormData
 * @param payload - Assembly drawing payload
 * @returns Promise<any>
 */
export const upsertAssemblyDrawing = async (
  payload: AssemblyDrawingPayload
): Promise<any> => {
  const formData = new FormData()

  // Add basic fields
  if (payload.part_assembly_drawing_id) {
    formData.append('part_assembly_drawing_id', payload.part_assembly_drawing_id.toString())
  }
  formData.append('applicable_settings_id', payload.applicable_settings_id.toString())
  formData.append('drawing_number', payload.drawing_number)

  // Add file-related fields using populateFormData utility
  populateFormData(formData, payload.finalFileData)

  // Ensure documents_to_delete is always present (even if empty)
  if (!payload.finalFileData.documents_to_delete || payload.finalFileData.documents_to_delete.length === 0) {
    formData.append('documents_to_delete', JSON.stringify([]))
  }

  // Ensure update_meta_data is always present (even if empty)
  if (!payload.finalFileData.update_meta_data || Object.keys(payload.finalFileData.update_meta_data).length === 0) {
    formData.append('update_meta_data', JSON.stringify({}))
  }

  const response = await apiClient.post(API_ENDPOINTS.ELECTRICAL_DRAWING_UPSERT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Delete assembly drawing
 * @param drawingId - Drawing ID
 * @returns Promise<any>
 */
export const deleteAssemblyDrawing = async (
  drawingId: number
): Promise<any> => {
  const response = await apiClient.delete(API_ENDPOINTS.ELECTRICAL_DRAWING_DELETE(drawingId))
  return response.data
}

