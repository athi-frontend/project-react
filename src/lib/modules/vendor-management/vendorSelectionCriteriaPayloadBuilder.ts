/**
 * Classification: Confidential
 * Utility functions for building form data payload for vendor selection criteria
 */

import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types';
import { FinalFileData } from '@/lib/utils/common';
import { NUMBERMAP } from '@/constants/common';
import { VENDOR_SELECTION_CRITERIA_CONSTANTS } from '@/constants/modules/vendor-management/vendorSelectionCriteria';

/**
 * Builds criteria details for API payload
 */
const getfinalCriteriaId = (subGroupIdValue) =>{
  if(!isNaN(subGroupIdValue)){
    return subGroupIdValue
  }
  return NaN
}
export const buildCriteriaDetails = (criteriaData: VendorCriteria[]) => {
  const list = Array.isArray(criteriaData) ? criteriaData : [];
  // Include all child items (including those with status: 2 for deleted groups/subgroups)
  // This ensures deleted parent groups are included in payload with status: 2
  return list
    .filter(item => !item.isParent)
    .sort((a, b) => a.group - b.group || a.order - b.order)
    .map((item, index) => {
      // Find parent group (even if it has status: 2)
      const parentGroup = list.find(parent => parent.group === item.group && parent.isParent);

      // Check if vendorGroupId exists (selected from dropdown) or is newly created
      // If vendorGroupId exists and is a valid number (not NaN), it was selected from dropdown (is_new_group = false)
      // If vendorGroupId is NaN, null, undefined, or empty, it's newly created (is_new_group = true)
      const vendorGroupIdRaw = item.vendorGroupId ?? parentGroup?.vendorGroupId ?? null
      const vendorGroupIdValue = vendorGroupIdRaw != null && vendorGroupIdRaw !== ""
        ? Number(vendorGroupIdRaw)
        : NaN;
      const hasVendorGroupId = !isNaN(vendorGroupIdValue) && vendorGroupIdValue != null;

      // Check if criteriaId exists (selected from dropdown) or is newly created
      // Check both criteriaId (from form) and sub_group_id (from API) to determine if it's a system criteria
      const criteriaIdRaw = item.criteriaId as any;
      const criteriaIdValue = criteriaIdRaw != null && criteriaIdRaw !== ""
        ? Number(criteriaIdRaw)
        : NaN;
      const subGroupIdValue = item.sub_group_id != null && item.sub_group_id !== ""
        ? Number(item.sub_group_id)
        : NaN;
      // Use criteriaId if available (from form), otherwise use sub_group_id (from API)
      const finalCriteriaId = !isNaN(criteriaIdValue) ? criteriaIdValue : getfinalCriteriaId(subGroupIdValue);
      const hasCriteriaId = !isNaN(finalCriteriaId) && finalCriteriaId != null;
      return {
        group_criteria_mapper_id: item.group_criteria_mapper_id ? Number(item.group_criteria_mapper_id) : null,
        group_id: hasVendorGroupId ? vendorGroupIdValue : null, // null for custom groups, number for system groups
        group_value: parentGroup?.criteria ?? null,
        is_new_group: !hasVendorGroupId,
        sub_group_id: hasCriteriaId ? finalCriteriaId : null, // null for custom criteria, number for system criteria
        sub_group_value: item.criteria,
        is_new_sub_group: !hasCriteriaId,
        requirement_type: item.requirementId ? Number(item.requirementId) : null,
        display_order: index + NUMBERMAP.ONE,
        group_status: Number(parentGroup?.group_status ?? parentGroup?.status ?? parentGroup?.applicable_group_status ?? NUMBERMAP.ONE),
        subgroup_status: Number(item.status ?? NUMBERMAP.ONE),
        group_display_order: Number(parentGroup?.group ?? parentGroup?.applicable_group_display_order ?? (index + NUMBERMAP.ONE))
      };
    });
};

/**
 * Builds form data payload
 */
export const buildFormDataPayload = (
  vendorSelectionCriteriaId: number | null,
  formData: any,
  criteriaData: VendorCriteria[],
  finalFileData: FinalFileData,
  applicableSettingsId?: string | number
): FormData => {
  const payload = new FormData();
  if (applicableSettingsId) {
    payload.append('incoming_inspection_criteria_id', (vendorSelectionCriteriaId ?? "").toString());
    payload.append('equipment_id', formData.equipment_id);
    payload.append('applicable_settings_id', applicableSettingsId.toString());
    payload.append('status_id', formData.status);
  } else {
    payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.STATUS, formData.status_id?.toString() ?? NUMBERMAP.ONE.toString());
    payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.VENDOR_SELECTION_CRITERIA_ID, (vendorSelectionCriteriaId == null ? "" : String(vendorSelectionCriteriaId)));

  }
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.PART_TYPE_ID, formData.partType);
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.PART_SUB_TYPE_ID, formData.partSubType);
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.PART_SUB_CLASS_ID, formData.partSubClass);
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.PART_CATEGORY_ID, formData.partCategoryName);

  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.CRITERIA_DETAILS, JSON.stringify(buildCriteriaDetails(criteriaData)));
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.CREATE_META_DATA, JSON.stringify(finalFileData?.create_meta_data ?? []));
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.UPDATE_META_DATA, JSON.stringify(finalFileData?.update_meta_data ?? []));
  payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.DOCUMENTS_TO_DELETE, JSON.stringify(finalFileData?.documents_to_delete ?? []));

  (finalFileData.documents_to_create ?? []).forEach(file => {
    payload.append(VENDOR_SELECTION_CRITERIA_CONSTANTS.DOCUMENTS_TO_CREATE, file, file.name);
  });

  return payload;
};

