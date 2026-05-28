import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchExecutiveSummary,
  postExecutiveSummary,
  fetchAgencies,
  fetchCountries,
} from '@/services/modules/regulation/executiveSummary'
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { Agency, Country } from '@/types/modules/regulation/executiveSummary'
const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS

export const useFetchExecutiveSummary = (projectId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.EXECUTIVE_SUMMARY.FETCH_BY_ID, projectId],
    queryFn: () => fetchExecutiveSummary(projectId),
    enabled: enabled && !!projectId,
  })
}

export const usePostExecutiveSummary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postExecutiveSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REGULATION_QUERY_KEYS.EXECUTIVE_SUMMARY.FETCH_BY_ID],
      })
      showActionAlert(SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}

export const useFetchAgencies = () => {
  return useQuery<Agency[]>({
    queryKey: ['agencies'],
    queryFn: fetchAgencies,
  });
};

export const useFetchCountries = () => {
  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });
}; 