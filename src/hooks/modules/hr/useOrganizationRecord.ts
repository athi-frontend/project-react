import { useAppSelector ,selectMenuData, selectCurrentSlug} from '@/store/slices/menuSlice'
import { getMenuIdFromPath } from '@/lib/utils/recordGeneration'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useOrganizationRecord } from '@/hooks/common/useRecordGeneration'

/**
 * Classification : Confidential
 */

// Hook to fetch organization records


// Helper hook that provides additional utilities
export const useOrganizationRecordHelper = (formType: string, contextId: number) => {
  const contextType = useSelector(selectCurrentSlug) ?? ''
  const query = useOrganizationRecord(contextId, contextType)
  const pathname = usePathname()
  const menuData = useAppSelector(selectMenuData)
  const menuId = getMenuIdFromPath(pathname, menuData)
  
  return {
    ...query,
    menuId,
    contextType,
    contextId,
    // Helper to manually refetch data
    refetchRecords: () => query.refetch(),
  }
} 