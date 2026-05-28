import { useMutation } from '@tanstack/react-query'
import { recoverPassword } from '@/services/modules/dnd/forgotPassword'

export const useRecoverPassword = () => {
  return useMutation({
    mutationFn: recoverPassword,
  })
}
