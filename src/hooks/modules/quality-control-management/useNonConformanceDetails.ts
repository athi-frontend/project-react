import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAllNonConformanceDetails,
  fetchNonConformanceDetailById,
  upsertNonConformanceDetail,
} from '@/services/modules/quality-control-management/nonConformanceDetails'
import {
  NonConformanceDetailsResponse,
  NonConformanceDetailByIdResponse,
  NonConformanceDetailsUpsertRequest,
  NonConformanceDetailsUpsertResponse,
} from '@/types/modules/quality-control-management/nonConformanceDetails'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification : Confidential
 **/

/**
 * Hook to fetch all non-conformance details with optional status filter
 */
export const useAllNonConformanceDetails = (
  status?: number,
  enabled?: boolean
) => {
  const isEnabled = enabled ?? true

  return useQuery<NonConformanceDetailsResponse, Error>({
    queryKey: [QUERY_KEYS.NON_CONFORMANCE_DETAILS.FETCH_ALL, status],
    queryFn: () => fetchAllNonConformanceDetails(status),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch non-conformance detail by ID
 */
export const useNonConformanceDetailById = (
  inspectionResultId: number | null,
  enabled?: boolean
) => {
  return useQuery<NonConformanceDetailByIdResponse, Error>({
    queryKey: [
      QUERY_KEYS.NON_CONFORMANCE_DETAILS.FETCH_BY_ID,
      inspectionResultId,
    ],
    queryFn: () =>
      fetchNonConformanceDetailById(
        inspectionResultId,
      ),
    enabled: enabled ?? (!!inspectionResultId ),
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: () => undefined,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to create or update non-conformance detail
 */
export const useUpsertNonConformanceDetail = (
  inspectionResultId: number | null,
  nonConformanceDetailsId: number | null
) => {
  const queryClient = useQueryClient()

  return useMutation<
    NonConformanceDetailsUpsertResponse,
    Error,
    NonConformanceDetailsUpsertRequest
  >({
    mutationFn: upsertNonConformanceDetail,
    onSuccess: (data) => {
      // Invalidate and refetch all non-conformance details list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NON_CONFORMANCE_DETAILS.FETCH_ALL],
      })

      if (inspectionResultId && nonConformanceDetailsId) {
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.NON_CONFORMANCE_DETAILS.FETCH_BY_ID,
            inspectionResultId,
            nonConformanceDetailsId,
          ],
        })
      }
    },
  })
}
