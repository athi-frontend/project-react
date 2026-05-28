import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { apiClient } from '@/shared/apiClient'
import { MenuApiResponse } from '@/types/components/layout/sidebar'
import { MENU_SERVICE_CONSTANTS } from '@/constants/modules/dnd/menuService'

const fetchMenuData = async (
  isActive: number,
  roleId: number
): Promise<MenuApiResponse> => {
  const url =
    MENU_SERVICE_CONSTANTS.MENU_URL +
    isActive +
    MENU_SERVICE_CONSTANTS.ROLE_ID +
    roleId
  const response = await apiClient.get(url)
  return response.data
}

export const useMenuData = (
  isActive: number,
  roleId: number
): UseQueryResult<MenuApiResponse, Error> => {
  return useQuery({
    queryKey: [MENU_SERVICE_CONSTANTS.MENU_DATA, isActive, roleId],
    queryFn: () => fetchMenuData(isActive, roleId),
    staleTime: 5 * 60 * 1000,
  })
}
