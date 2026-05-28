import { useMutation, useQuery } from '@tanstack/react-query'
import { generateDocument, RecordGenerationRequest, RecordGenerationResponse } from '@/services/modules/hr/recordGeneration'
import { useAppSelector, selectMenuData, selectCurrentMenuId } from '@/store/slices/menuSlice'
import { getOrganizationRecords, OrganizationRecordResponse } from '@/services/modules/hr/organizationRecord'
import { PURCHASE_RECORD_GENERATION_FORM_TYPES } from '@/constants/modules/purchase/recordGeneration'
import { usePathname } from 'next/navigation'
import { getMenuIdFromPath } from '@/lib/utils/recordGeneration'
import { NUMBERMAP } from '@/constants/common'

export const useRecordGeneration = () => {
  return useMutation<RecordGenerationResponse, Error, RecordGenerationRequest>({
    mutationFn: generateDocument,
  })
}

/**
 * Hook that automatically handles menu_id and context_type extraction from Redux state
 * for record generation (purchase order and vendor agreement checklist)
 */
export const useRecordGenerationHelper = () => {
  const recordGeneration = useRecordGeneration()
  const menuData = useAppSelector(selectMenuData)
  const menuId = useAppSelector(selectCurrentMenuId)

  const generateDocument = async (contextIds: number[], options?: {
    version_type?: string
    verification_type?: string
    water_mark_text?: string
  }) => {
    if (!menuId) {
      return
    }

    // Get context_type (slug) from menu data using menu_id
    const matchingMenu = menuData.find((menu) => menu.menu_id === menuId)
    const contextType = matchingMenu?.slug

      await recordGeneration.mutateAsync({
        menu_id: menuId,
        context_id: contextIds,
        context_type: contextType ?? '',
        water_mark_text: options?.water_mark_text ?? 'PUBLISHED',
        ...(options?.version_type && { version_type: options.version_type }),
        ...(options?.verification_type && { verification_type: options.verification_type }),
      } as RecordGenerationRequest & { version_type?: string; verification_type?: string })
  }

  return {
    ...recordGeneration,
    generateDocument,
    menuId,
  }
}

/**
 * Hook to fetch organization records for purchase record generation
 * Handles purchase-specific form types (outsource vendor agreement, purchase order, vendor agreement checklist)
 * Uses menu_id and context_type from Redux state
 */
export const usePurchaseOrganizationRecord = (formType: string, contextId: number) => {
  const pathname = usePathname()
  const menuData = useAppSelector(selectMenuData)
  
  // Check if form type requires purchase-specific handling
  const isOutsourceVendorAgreement = formType === PURCHASE_RECORD_GENERATION_FORM_TYPES.OUTSOURCE_VENDOR_AGREEMENT 
  const isPurchaseOrder = formType === PURCHASE_RECORD_GENERATION_FORM_TYPES.PURCHASE_ORDER
  const isVendorAgreementChecklist = formType === PURCHASE_RECORD_GENERATION_FORM_TYPES.VENDOR_AGREEMENT_CHECKLIST
  
  // Get menu_id from menu data using pathname
  const menuId = getMenuIdFromPath(pathname, menuData, 'purchase')
  
  // Get context_type from slug in menu data
  const matchingMenu = menuData.find((menu) => menu.menu_id === menuId)
  const contextType = matchingMenu?.slug ?? null

  // Use direct API call with values from menu data for purchase-specific form types
  return useQuery<OrganizationRecordResponse, Error>({
    queryKey: ['organizationRecord', menuId, contextType, contextId],
    queryFn: () => getOrganizationRecords(menuId, contextType, contextId),
    enabled: (isOutsourceVendorAgreement || isPurchaseOrder || isVendorAgreementChecklist) && 
             menuId !== null && menuId !== undefined && 
             contextType !== null && contextType !== undefined && 
             contextId !== null && contextId !== undefined && contextId > NUMBERMAP.ZERO,
  })
}

