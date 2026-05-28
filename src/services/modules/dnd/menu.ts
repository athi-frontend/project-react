import { apiClient } from '@/shared/apiClient'
import { MenuApiResponse } from '@/types/components/layout/sidebar'
import { MENU_SERVICE_CONSTANTS } from '@/constants/components/menu'

export const fetchMenuData = async (): Promise<MenuApiResponse> => {
  const endpoint = MENU_SERVICE_CONSTANTS.MENU_ENDPOINT
  const token = localStorage.getItem(MENU_SERVICE_CONSTANTS.AUTH_TOKEN_KEY)
  const response = await apiClient.get(endpoint, {
    skipCriticalWait: true,
    headers: token
      ? { Authorization: `${MENU_SERVICE_CONSTANTS.BEARER_PREFIX}${token}` }
      : {},
  })

  return response.data
}
