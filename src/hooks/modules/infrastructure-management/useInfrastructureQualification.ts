/**
 * Infrastructure Qualification Hooks
 * Classification: Confidential
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAllInfrastructureQualifications,
  fetchInfrastructureQualificationById,
  upsertinfrastructureQualification,
  deleteInfrastructureQualification,
  fetchQualificationChecklistByInfrastructureId,
} from '@/services/modules/infrastructure-management/infrastructureQualification'
import { INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS } from '@/constants/modules/infrastructure-management/infrastructureQualification'
import type { InfrastructureQualificationPayload } from '@/types/modules/infrastructure-management/infrastructureQualification'
import { NUMBERMAP } from '@/constants/common'
import { showActionAlert } from '@/components/ui'

/**
 * Hook to fetch all infrastructure qualifications
 */
export const useAllInfrastructureQualifications = () => {
  return useQuery({
    queryKey: [INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS.FETCH_ALL],
    queryFn: () => fetchAllInfrastructureQualifications(),
    enabled: true,
  })
}

/**
 * Hook to fetch infrastructure qualification by ID
 */
export const useInfrastructureQualificationById = (
  infrastructureQualificationId: number | null
) => {
  return useQuery({
    queryKey: [
      INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS.FETCH_BY_ID,
      infrastructureQualificationId,
    ],
    queryFn: () =>
      fetchInfrastructureQualificationById(infrastructureQualificationId),
    enabled:
       infrastructureQualificationId !== null  && !!infrastructureQualificationId,
    placeholderData: undefined,
          // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

/**
 * Hook to create or update infrastructure qualification (upsert)
 */
export const useUpsertInfrastructureQualification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InfrastructureQualificationPayload) => upsertinfrastructureQualification(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch all infrastructure qualifications
      queryClient.invalidateQueries({
        queryKey: [INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS.FETCH_ALL],
      })

      // If editing an existing qualification, also invalidate the individual cache
      if (variables.infrastructure_qualification_id) {
        queryClient.invalidateQueries({
          queryKey: [
            INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS.FETCH_BY_ID,
            variables.infrastructure_qualification_id,
          ],
        })
      }
    },
  })
}

/**
 * Hook to delete infrastructure qualification
 */
export const useDeleteInfrastructureQualification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (infrastructureQualificationId: number | null) =>
      deleteInfrastructureQualification(infrastructureQualificationId),
    onSuccess: () => {
        showActionAlert("success")
      // Invalidate and refetch all infrastructure qualifications
      queryClient.invalidateQueries({
        queryKey: [INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS.FETCH_ALL],
      })
    },
  })
}

/**
 * Hook to fetch qualification checklist by infrastructure ID
 */
export const useQualificationChecklistByInfrastructureId = (
  infrastructureId: number | null,
  isEnabled: boolean
) => {
  return useQuery({
    queryKey: [
      INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS.FETCH_QUALIFICATION_CHECKLIST,
      infrastructureId,
    ],
    queryFn: () =>
      fetchQualificationChecklistByInfrastructureId(infrastructureId),
    enabled:
      !!infrastructureId && !isNaN(Number(infrastructureId)) && isEnabled,
    placeholderData: undefined,
          // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}