/**
 * Classification: Confidential
 * Assembly Drawing Hooks
 * Separate hooks for Assembly Drawings Form
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchAssemblyDrawingList,
  fetchAssemblyDrawingById,
  upsertAssemblyDrawing,
  deleteAssemblyDrawing,
  AssemblyDrawingPayload,
  AssemblyDrawingListResponse,
  AssemblyDrawingApiResponse,
} from '@/services/modules/production/assemblyDrawingService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'
import { STATUS, NUMBERMAP } from '@/constants/common'

/**
 * Hook to fetch assembly drawing list
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @param enabled - Whether the query should be enabled
 */
export const useAssemblyDrawingList = (
  assemblyPartItemDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<AssemblyDrawingListResponse, Error>({
    queryKey: [QUERY_KEYS.ELECTRICAL_DRAWING_LIST, assemblyPartItemDetailId],
    queryFn: () => fetchAssemblyDrawingList(assemblyPartItemDetailId),
    enabled: enabled && !!assemblyPartItemDetailId,
  })
}

/**
 * Hook to fetch assembly drawing by ID
 * @param drawingId - Drawing ID
 * @param enabled - Whether the query should be enabled
 */
export const useAssemblyDrawingById = (
  drawingId: number,
  enabled: boolean = true
) => {
  return useQuery<AssemblyDrawingApiResponse, Error>({
    queryKey: ['assemblyDrawingList', drawingId],
    queryFn: () => fetchAssemblyDrawingById(drawingId),
    enabled: enabled && !!drawingId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

/**
 * Hook to upsert assembly drawing
 */
export const useUpsertAssemblyDrawing = () => {
  const queryClient = useQueryClient()
  return useMutation<any, Error, AssemblyDrawingPayload>({
    mutationKey: [QUERY_KEYS.ELECTRICAL_DRAWING_UPSERT],
    mutationFn: upsertAssemblyDrawing,
    onSuccess: (_, variables) => {
      // Invalidate queries with the correct query key pattern
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ELECTRICAL_DRAWING_LIST, variables.applicable_settings_id],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

/**
 * Hook to delete assembly drawing
 */
export const useDeleteAssemblyDrawing = () => {
  const queryClient = useQueryClient()
  return useMutation<any, Error, number>({
    mutationKey: ['assemblyDrawingDelete'],
    mutationFn: deleteAssemblyDrawing,
    onSuccess: () => {
      // Invalidate all assembly drawing list queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ELECTRICAL_DRAWING_LIST] })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

