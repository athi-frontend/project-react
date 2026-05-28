import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchSpecifications,
  saveSpecifications,
  fetchLifetimeOfDevice,
} from '../../../services/modules/dnd/digSpecification'
import { SpecificationResponse } from '@/types/modules/dnd/digSpecification'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { QUERY_KEY } from '@/constants/modules/dnd/digSpecificaton'
/**
      *Classification : Confidential
**/
interface SpecificationPayloadItem {
  data: SpecificationResponse[]
  action_control: {
    formType?: string
    formId?: string
    menuId?: string
    formName?: string
    permissions: Array<{
      action: string
      trigger_status_id?: number
    }>
  }
  }

export const useSpecifications = (
  projectId: number
): UseQueryResult<SpecificationPayloadItem, unknown> => {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => fetchSpecifications(projectId),
  })
}

export const useSaveTeam = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveSpecifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, projectId] })
      showActionAlert('success')
    },
    onError: (error) => {
      showActionAlert('failed')
    },
  })
}

/**
 * Custom hook to fetch lifetime of device specification data
 * Uses React Query for data fetching, caching, and state management
 * @param specificationApplicabilityId - The ID of the specification applicability
 * @returns React Query result object containing data, loading state, and error handling
 * @author Harsithiga B
 * @created 23-08-2025
 * @classification Confidential
 */
export const useLifetimeOfDevice = (specificationApplicabilityId: number) => {
  return useQuery({
    queryKey: ['lifetimeOfDevice', specificationApplicabilityId],
    queryFn: () => fetchLifetimeOfDevice(specificationApplicabilityId),
    enabled: !!specificationApplicabilityId,
  })
}
