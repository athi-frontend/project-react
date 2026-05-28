import { useQuery } from '@tanstack/react-query'
import { getOrganizationRecords, OrganizationRecordResponse } from '@/services/modules/hr/organizationRecord'
import { selectCurrentMenuId,selectCurrentSlug} from '@/store/slices/menuSlice'
import { useSelector } from 'react-redux'

export const useOrganizationRecord = ( contextId: number, fixedContextType?: string) => {

  const menuId = useSelector(selectCurrentMenuId)
  const contextType : string | null = fixedContextType ?? useSelector(selectCurrentSlug)
  
  return useQuery<OrganizationRecordResponse, Error>({
    queryKey: ['organizationRecord', menuId, contextType, contextId],
    queryFn: () => {
      if (!menuId) {  
        throw new Error('Menu ID not found')
      }
      return getOrganizationRecords(menuId, contextType, contextId)
    },
    // Ensures data loads on page refresh and navigation
    // Only disable query when required parameters are null/undefined
    enabled: menuId !== null && contextType !== null && contextId !== null
  })
}