/**
 * Classification: Confidential
 * Utility functions for building form data payload for sanity check inspection
 */

import { FinalFileData } from '@/lib/utils/common'
import { SpecificationData } from '@/types/modules/quality-control-management/sanityCheckInspection'
import { SANITY_CHECK_PAYLOAD_KEYS, SANITY_CHECK_UI_CONSTANTS } from '@/constants/modules/quality-control-management/sanityCheckInspection'

/**
 * Builds form data payload
 */
export const buildSanityCheckInspectionPayload = (
  isEditMode: boolean,
  sanityCheckInspectionId: number | null,
  formData: any,
  specifications: SpecificationData[],
  finalFileData: FinalFileData
): FormData => {
  const payload = new FormData()

  // Use part_number_id if available (user selection), otherwise fall back to part_detail_id
  // part_number_id is actually purchase_order_part_details_id
  const partDetailId = formData.part_number_id ?? formData.part_detail_id
  payload.append(SANITY_CHECK_PAYLOAD_KEYS.PART_DETAIL_ID, partDetailId?.toString() ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING)
  payload.append(SANITY_CHECK_PAYLOAD_KEYS.SPECIFICATIONS, JSON.stringify(specifications))
  payload.append(SANITY_CHECK_PAYLOAD_KEYS.SUPPLY_REFERENCE_NO, formData.supply_reference_number ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING)
  payload.append(SANITY_CHECK_PAYLOAD_KEYS.SUPPLY_RECEIVED, formData.supply_received?.toString() ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING)
  payload.append(SANITY_CHECK_PAYLOAD_KEYS.REMARKS, formData.remarks ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING)

  if (isEditMode && sanityCheckInspectionId) {
    payload.append(SANITY_CHECK_PAYLOAD_KEYS.SANITY_CHECK_INSPECTION_ID, sanityCheckInspectionId.toString())
  }

  return payload
}
