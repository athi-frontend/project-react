/**
 * Classification: Confidential
 * Bill of Material Service
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/production/billOfMaterial'
import {
    BillOfMaterialListResponse,
    BillOfMaterialDeleteResponse,
    PartSettingDetailResponse,
    PartSettingUpsertRequest,
    PartSettingUpsertResponse,
    PartDetailsUpsertResponse,
    PartDetailsResponse,
    EquipmentItemResponse,
} from '@/types/modules/production/billOfMaterial'
import { NUMBERMAP } from '@/constants/common'

/**
 * Fetch all bill of materials with optional project_id filter
 * @param projectId - Optional project ID filter
 * @returns Promise<BillOfMaterialListResponse>
 */
export const fetchAllBillOfMaterials = async (
    projectId?: number
): Promise<BillOfMaterialListResponse> => {
    const endpoint = API_ENDPOINTS.FETCH_ALL(projectId)
    const response = await apiClient.get(endpoint)
    return response.data
}

/**
 * Fetch part setting detail by part_item_detail_id
 * @param partItemDetailId - The part item detail ID
 * @returns Promise<PartSettingDetailResponse>
 */
export const fetchPartSettingDetail = async (
    partItemDetailId: number
): Promise<PartSettingDetailResponse> => {
    const response = await apiClient.get(
        API_ENDPOINTS.PART_SETTING_DETAIL(partItemDetailId)
    )
    return response.data
}

/**
 * Upsert (create or update) part setting configuration
 * @param payload - The part setting upsert request payload
 * @returns Promise<PartSettingUpsertResponse>
 */
export const upsertPartSetting = async (
    payload: PartSettingUpsertRequest
): Promise<PartSettingUpsertResponse> => {
    const response = await apiClient.post(
        API_ENDPOINTS.PART_SETTING_UPSERT,
        payload
    )
    return response.data
}

/**
 * Fetch part details by part_item_id
 * @param partItemId - The part item ID
 * @returns Promise<PartDetailsResponse>
 */
export const fetchPartDetailsById = async (
    partItemId: number
): Promise<PartDetailsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_PART_DETAILS_BY_ID(partItemId))
    return response.data
}

/**
 * Upsert (create or update) part details
 * @param payload - The part details upsert request payload (FormData for file uploads)
 * @returns Promise<PartDetailsUpsertResponse>
 */
export const upsertPartDetails = async (
    payload: FormData
): Promise<PartDetailsUpsertResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.UPSERT, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

/**
 * Delete bill of material by ID
 * @param id - The bill of material ID to delete
 * @returns Promise<BillOfMaterialDeleteResponse>
 */
export const deleteBillOfMaterial = async (
    id: number
): Promise<BillOfMaterialDeleteResponse> => {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE(id))
    return response.data
}

/**
 * Fetch equipment items for equipment type dropdown
 * @param equipmentId - Optional equipment ID filter
 * @param status - Optional status filter (default: active status)
 * @returns Promise<EquipmentItemResponse>
 */
export const fetchEquipmentItems = async (
    equipmentId?: number,
    status?: number
): Promise<EquipmentItemResponse> => {
    const params: Record<string, number> = {}

    if (equipmentId !== undefined) {
        params.equipment_id = equipmentId
    }

    if (status !== undefined) {
        params.status = status
    }

    const response = await apiClient.get(
        API_ENDPOINTS.FETCH_EQUIPMENT_ITEMS,
        {
            params: Object.keys(params).length > NUMBERMAP.ZERO ? params : undefined,
        }
    )
    return response.data
}
