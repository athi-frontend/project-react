import { useQuery } from '@tanstack/react-query'
import { fetchMenuData } from '@/services/modules/dnd/menu'
import { MenuApiResponse } from '@/types/components/layout/sidebar'
import { MENUDATA } from '@/constants/components/menu'

/**
*Classification : Confidential
**/

export const useMenuData = () => {
  return useQuery<MenuApiResponse, Error>({
    queryKey: [MENUDATA],
    queryFn: fetchMenuData,
    refetchOnWindowFocus: false,
  })
}
