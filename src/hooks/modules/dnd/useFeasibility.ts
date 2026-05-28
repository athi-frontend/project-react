import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchFeasibilityStudy,
  saveFeasibilityStudy,
  getRoles,
} from '@/services/modules/dnd/feasibilityStudy'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'

export const listById = (projectId: number) => {
  return useQuery({
    queryKey: ['feasibilityStudy', projectId],
    queryFn: () => fetchFeasibilityStudy(projectId),
  })
}

export const useSaveFeasibilityStudy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      formData,
      hasData,
    }: {
      formData: any
      hasData: boolean
    }) => {
      return saveFeasibilityStudy(formData, hasData)
    },
    onError: (err) => {
      showActionAlert('denied')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feasibilityStudy'])
      showActionAlert('success')
    },
  })
}

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    initialData: [{ data: [] }],
    staleTime: 0,
  })
}
