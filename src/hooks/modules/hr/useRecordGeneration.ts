import { useMutation } from '@tanstack/react-query'
import { generateDocument, RecordGenerationRequest, RecordGenerationResponse } from '@/services/modules/hr/recordGeneration'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { useAppSelector,selectMenuData, selectCurrentMenuId } from '@/store/slices/menuSlice'
import { usePathname } from 'next/navigation'
import { getMenuIdFromPath, getContextIdFromResponse, getEntityTypeFromPath } from '@/lib/utils/recordGeneration'
import { useSelector } from 'react-redux'

const {  FAILED_ALERT } = COMMON_CONSTANTS

export const useRecordGeneration = () => {
  return useMutation<RecordGenerationResponse, Error, RecordGenerationRequest>({
    mutationFn: generateDocument,
  })
}

/**
 * Enhanced hook that automatically handles menu_id extraction and provides utilities
 * for record generation based on current path and save response
 */
export const useRecordGenerationHelper = (contexttype?: string) => {
  const recordGeneration = useRecordGeneration()
  const pathname = usePathname()
  const menuData = useAppSelector(selectMenuData)
  const menuId = useSelector(selectCurrentMenuId)
  const generateDocumentFromSaveResponse = (saveResponseData: any[], waterMarkText: string = 'DRAFT') => {
    const entityType = getEntityTypeFromPath(pathname)
    const contextIds = getContextIdFromResponse(saveResponseData, entityType)

    
    if (!menuId || !contextIds || contextIds.length === 0) {
      showActionAlert(FAILED_ALERT)
      return
    }

    recordGeneration.mutate({
      menu_id: menuId,
      context_id: contextIds,
      water_mark_text: waterMarkText
    })
  }

  const generateDocumentFromContextIds = (contextIds: number[], waterMarkText: string = 'DRAFT') => {
    
    if (!menuId || !contextIds || contextIds.length === 0) {
      showActionAlert(FAILED_ALERT)
      return
    }

    recordGeneration.mutate({
      menu_id: menuId,
      context_type: contexttype ?? '',
      context_id: contextIds,
      water_mark_text: waterMarkText
    })
  }

  return {
    ...recordGeneration,
    generateDocumentFromSaveResponse,
    generateDocumentFromContextIds,
    menuData,
    pathname,
    entityType: getEntityTypeFromPath(pathname),
    menuId: getMenuIdFromPath(pathname, menuData)
  }
} 