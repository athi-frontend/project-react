import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updatePassword,
  resetPin,
} from '@/services/modules/user/updatePasswordPin'
import { showActionAlert } from '@/components/ui'

export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      showActionAlert('success')
    },
    onError: (error: any) => {
      showActionAlert('failed')
    },
  })
}

interface ResetPinParams {
  old_pin: string
  new_pin: string
}

export const useResetPin = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (params: ResetPinParams) =>
      resetPin(params.old_pin, params.new_pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return {
    resetPin: (params: ResetPinParams) => mutation.mutateAsync(params),
    loading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
    success: mutation.isSuccess,
    reset: mutation.reset,
  }
}
