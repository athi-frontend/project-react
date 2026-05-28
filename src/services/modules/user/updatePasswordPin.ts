import { ApiEndpoints } from '@/constants/modules/auth/forgotPassword'
import { apiClient } from '@/shared/apiClient'

export const updatePassword = async (payload: {
  old_password: string
  new_password: string
}) => {
  const response = await apiClient.post(ApiEndpoints.RESET_PASSWORD_URL, payload)
  return response.data
}

export const resetPin = async (
  oldPin: string,
  newPin: string
): Promise<any> => {
  const response = await apiClient.put(ApiEndpoints.RESET_PIN_URL, {
    old_pin: oldPin,
    new_pin: newPin,
  })

  return response.data
}
