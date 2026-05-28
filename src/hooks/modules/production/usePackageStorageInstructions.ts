import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchStorageTypes,
  fetchPackagingStorageInstructionById,
  postPackagingStorageInstruction,
  StorageTypeResponse,
  PackagingStorageInstructionResponse,
} from '@/services/modules/production/packageStorageInstructions'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'

/**
 * Classification: Confidential
 */

export const useStorageTypes = () => {
  return useQuery<StorageTypeResponse, Error>({
    queryKey: ['storageTypes'],
    queryFn: () => fetchStorageTypes(),
  })
}

export const usePackagingStorageInstructionById = (
  id: string | number | null , project_id : number | null
) => {
  return useQuery<PackagingStorageInstructionResponse, Error>({
    queryKey: ['packagingStorageInstruction', id],
    queryFn: () => fetchPackagingStorageInstructionById(id, project_id),
    enabled: !!id,
  })
}

export const usePostPackagingStorageInstruction = (projectId: number | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['postPackagingStorageInstruction', projectId],
    mutationFn: (payload: FormData) => postPackagingStorageInstruction(payload),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ['packagingStorageInstruction'],
        })
      }
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}



