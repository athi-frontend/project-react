import { useMutation } from '@tanstack/react-query'
import { recoverPin } from '@/services/modules/dnd/forgotPin'

export const useRecoverPin = () => {
  return useMutation({
    mutationFn: recoverPin,
  })
}
