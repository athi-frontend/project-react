import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProductCategory,
  fetchPNDByProjectId,
  submitProjectPND,
  createPNDSpecification,
  fetchPNDSpecification,
  deletePNDSpecification,
  updatePNDSpecification,
  getEndUser,
  getBuyer,
  downloadTemplate,
} from '../../../services/modules/dnd/pnd'
import { FAILED, PND_QUERY_KEYS, SUCCESS } from '@/constants/modules/dnd/pnd'
import { PNDSpecificationListQueryKey } from '@/types/modules/dnd/pnd'
import { showActionAlert } from '@/components/ui'

export const useGetProductCategory = () => {
  return useQuery({
    queryKey: [PND_QUERY_KEYS.CATEGORY_LIST_QUERY_KEY],
    queryFn: getProductCategory,
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetEndUser = () => {
  return useQuery({
    queryKey: [PND_QUERY_KEYS.END_USER_LIST_QUERY_KEY],
    queryFn: getEndUser,
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetBuyer = () => {
  return useQuery({
    queryKey: [PND_QUERY_KEYS.BUYER_LIST_QUERY_KEY],
    queryFn: getBuyer,
    staleTime: 5 * 60 * 1000,
  })
}

export const usePNDFetch = (projectId: number) => {
  return useQuery({
    queryKey: [PND_QUERY_KEYS.PND_FETCH_QUERY_KEY, projectId],
    queryFn: () => fetchPNDByProjectId(projectId),
    enabled: !!projectId,
  })
}

export const usePNDSubmit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      submitProjectPND(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PND_QUERY_KEYS.PND_FETCH_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [PND_QUERY_KEYS.PND_SPECIFICATION_FETCH_QUERY_KEY],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: any) => {
      showActionAlert(FAILED)
    },
  })
}

export const usePNDSpecificationList = (project_id: number) => {
  return useQuery({
    queryKey: [
      PND_QUERY_KEYS.PND_SPECIFICATION_FETCH_QUERY_KEY,
      project_id,
    ] as PNDSpecificationListQueryKey,
    queryFn: () => fetchPNDSpecification(project_id),
    enabled: !!project_id,
  })
}

export const usePNDSpecificationCreate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      specificationFormData,
    }: {
      specificationFormData: FormData
    }) => createPNDSpecification(specificationFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PND_QUERY_KEYS.PND_SPECIFICATION_FETCH_QUERY_KEY],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: any) => {
      showActionAlert(FAILED)
    },
  })
}

export const usePNDSpecificationUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      id: number
      parameter: string
      specification: string
    }) =>
      updatePNDSpecification(payload.id, {
        parameter: payload.parameter,
        specification: payload.specification,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PND_QUERY_KEYS.PND_SPECIFICATION_FETCH_QUERY_KEY],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: any) => {
      showActionAlert(FAILED)
    },
  })
}

export const useDeletePNDSpecification = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pnd_specification_id: number) =>
      deletePNDSpecification(pnd_specification_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PND_QUERY_KEYS.PND_SPECIFICATION_FETCH_QUERY_KEY, projectId],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: any) => {
      showActionAlert(FAILED)
    },
  })
}

export const useDownloadTemplate = (templateId:number) => {
    return useMutation({
    mutationFn:()=>downloadTemplate(templateId) ,
    onError: (error: Error) => {
      showActionAlert(FAILED)
    },
  })
}
