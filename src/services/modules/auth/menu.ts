import { apiClient } from '../../../shared/apiClient'
import { MenuApiResponse } from '@/types/components/layout/sidebar'
import { MENU_SERVICE_CONSTANTS } from '@/constants/modules/dnd/menuService'

export const fetchMenuData = async (
  isActive: number,
  roleId: number
): Promise<MenuApiResponse> => {
  try {
    const endpoint = MENU_SERVICE_CONSTANTS.MENU_ENDPOINT
    const token = localStorage.getItem(MENU_SERVICE_CONSTANTS.AUTH_TOKEN_KEY)

    const response = await apiClient.get(endpoint, {
      params: {
        is_active: isActive,
        role_id: roleId,
      },
      headers: token
        ? { Authorization: `${MENU_SERVICE_CONSTANTS.BEARER_PREFIX}${token}` }
        : {},
    })

    return response.data
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const apiError = error as {
        response?: { status: number; data?: any; headers?: any }
      }
      throw new Error(
        apiError.response?.data?.message ??
          MENU_SERVICE_CONSTANTS.FETCH_MENU_FAILED_DEFAULT_MESSAGE
      )
    }

    throw new Error(MENU_SERVICE_CONSTANTS.UNEXPECTED_ERROR_MESSAGE)
  }
}
