/**
 * Production Common Hooks
 * Classification: Confidential
 */

import { useQuery } from '@tanstack/react-query'
import { fetchAllJigsTypes } from '@/services/modules/production/common'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import type { JigsTypeResponse } from '@/types/modules/production/common'
import { NUMBERMAP } from '@/constants/common'

/**
 * Hook to fetch all jigs types
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for jigs types
 */
export const useJigsType = (
  enabled: boolean = true, 
  status: number = NUMBERMAP.ONE
) => {
  return useQuery<JigsTypeResponse, Error>({
    queryKey: [QUERY_KEYS.JIGS_TYPE, status],
    queryFn: () => fetchAllJigsTypes(status),
    enabled,
  })
}

