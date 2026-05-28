/**
 * Classification: Confidential
 * Bill of Material Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    fetchAllBillOfMaterials,
    fetchPartSettingDetail,
    fetchPartDetailsById,
    upsertPartSetting,
    upsertPartDetails,
    deleteBillOfMaterial,
    fetchEquipmentItems,
} from '@/services/modules/production/billOfMaterial'
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
import { QUERY_KEYS } from '@/constants/modules/production/billOfMaterial'
import { NUMBERMAP } from '@/constants/common'

/**
 * Hook to fetch all bill of materials with optional project_id filter
 * @param projectId - Optional project ID filter
 * @param enabled - Whether the query should be enabled
 * @returns Query result with bill of materials data
 */
export const useAllBillOfMaterials = (
    projectId?: number,
    enabled: boolean = true
) => {
    return useQuery<BillOfMaterialListResponse, Error>({
        queryKey: [QUERY_KEYS.LIST, projectId],
        queryFn: () => fetchAllBillOfMaterials(projectId),
        enabled: enabled && !!projectId,
    })
}

/**
 * Hook to fetch part setting detail by part_item_detail_id
 * @param partItemDetailId - The part item detail ID
 * @param enabled - Whether the query should be enabled
 * @returns Query result with part setting detail data
 */
export const usePartSettingDetail = (
    partItemDetailId: number | undefined,
    enabled: boolean = true
) => {
    return useQuery<PartSettingDetailResponse, Error>({
        queryKey: [QUERY_KEYS.PART_SETTING_DETAIL, partItemDetailId],
        queryFn: () => fetchPartSettingDetail(partItemDetailId),
        enabled: enabled && !!partItemDetailId,
        placeholderData: undefined,
        staleTime: NUMBERMAP.ZERO,
        gcTime: NUMBERMAP.ZERO,
        refetchOnMount: 'always', 
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook to upsert (create or update) part setting configuration
 * @returns Mutation hook for upserting part setting
 */
export const useUpsertPartSetting = () => {
    const queryClient = useQueryClient()

    return useMutation<PartSettingUpsertResponse, Error, PartSettingUpsertRequest>(
        {
            mutationFn: upsertPartSetting,
            onSuccess: (data, variables) => {
                // Invalidate and refetch part setting detail query
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.PART_SETTING_DETAIL, variables.part_item_detail_id],
                })
                // Also invalidate the list query to refresh the list if needed
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
            },
        }
    )
}

/**
 * Hook to fetch part details by part_item_id
 * @param partItemId - The part item ID
 * @param enabled - Whether the query should be enabled
 * @returns Query result with part details data
 */
export const usePartDetailsById = (
    partItemId: number | undefined,
    enabled: boolean = true
) => {
    return useQuery<PartDetailsResponse, Error>({
        queryKey: [QUERY_KEYS.DETAIL, partItemId],
        queryFn: () => fetchPartDetailsById(partItemId),
        enabled: enabled && !!partItemId,
        placeholderData: undefined,
        staleTime: NUMBERMAP.ZERO,
        gcTime: NUMBERMAP.ZERO,
        refetchOnMount: 'always',
    })
}

/**
 * Hook to upsert (create or update) part details
 * @returns Mutation hook for upserting part details
 */
export const useUpsertPartDetails = () => {
    const queryClient = useQueryClient()

    return useMutation<PartDetailsUpsertResponse, Error, FormData>({
        mutationFn: upsertPartDetails,
        onSuccess: () => {
            // Invalidate and refetch bill of materials list
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
            // Also invalidate detail query if needed
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DETAIL] })
        },
    })
}

/**
 * Hook to delete bill of material by ID
 * @returns Mutation hook for deleting bill of material
 */
export const useDeleteBillOfMaterial = () => {
    const queryClient = useQueryClient()

    return useMutation<BillOfMaterialDeleteResponse, Error, number>({
        mutationFn: deleteBillOfMaterial,
        onSuccess: () => {
            // Invalidate and refetch bill of materials list
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
            // Also invalidate detail query if needed
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DETAIL] })
        },
    })
}

/**
 * Hook to fetch equipment items for equipment type dropdown
 * @param equipmentId - Optional equipment ID filter
 * @param status - Optional status filter (default: active status)
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with equipment items data
 */
export const useEquipmentItems = (
    equipmentId?: number,
    status?: number,
    enabled: boolean = true
) => {
    return useQuery<EquipmentItemResponse, Error>({
        queryKey: [QUERY_KEYS.EQUIPMENT_ITEMS, equipmentId, status],
        queryFn: () => fetchEquipmentItems(equipmentId, status),
        enabled,
    })
}
