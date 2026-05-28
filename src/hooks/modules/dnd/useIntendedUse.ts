import { useQuery, useMutation } from '@tanstack/react-query'
import {
  fetchIntendedUse,
  useSaveService,
  fetchModels,
  fetchUseEnvironments,
} from '@/services/modules/dnd/intendedUse'
import { showActionAlert } from '@/components/ui'

export const useFetchIntendedUse = (project_id: number) => {
  return useQuery({
    queryKey: ['intendedUse', project_id],
    queryFn: () => fetchIntendedUse(project_id),
  })
}

export const useFetchModels = (project_id: number) => {
  return useQuery({
    queryKey: ['models', project_id],
    queryFn: () => fetchModels(project_id),
    enabled: !!project_id,
  })
}

export const useFetchUseEnvironments = () => {
  return useQuery({
    queryKey: ['useEnvironments'],
    queryFn: () => fetchUseEnvironments(),
  })
}

export const useIntendedUseMutation = () => {
  return useMutation({
    mutationFn: (data: any) => useSaveService(data),
    onSuccess: (res) => {
      showActionAlert('success')
    },
    onError: (res) => {
      showActionAlert('failed')
    },
  })
}
