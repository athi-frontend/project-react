/**
 * Classification: Confidential
 * Utility functions for building form data payload for vendor re-evaluation criteria
 */

import { VendorReEvaluationCriteria } from '@/components/modules/vendor-management/vendor-re-evaluation-criteria/VendorReEvaluationCriteriaTable';
import { FinalFileData } from '@/lib/utils/common';
import { NUMBERMAP } from '@/constants/common';
import { VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS } from '@/constants/modules/vendor-management/vendorReEvaluationCriteria';

/**
 * Builds criteria details for API payload
 */
export const buildReEvaluationCriteriaDetails = (criteriaData: VendorReEvaluationCriteria[]) => {
  // Group criteria by group ID
  const groupedByGroup = criteriaData.reduce((acc: Record<number, VendorReEvaluationCriteria[]>, item) => {
    const groupId = item.group;
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(item);
    return acc;
  }, {});

  // Build the criteria_details array
  const criteriaDetails: any[] = [];
  
  Object.keys(groupedByGroup).forEach((groupIdStr) => {
    const groupId = Number(groupIdStr);
    const groupItems = groupedByGroup[groupId];
    
    // Find parent row
    const parentRow = groupItems.find(item => item.isParent);
    if (!parentRow) return;
    
    // Find child rows
    const childRows = groupItems.filter(item => !item.isParent).sort((a, b) => a.order - b.order);
    
    // Build group object
    // vendorGroupId is the group_id (the actual group ID from dropdown or null for new groups)
    // group_mapper_id is a separate field that exists only if the group was previously saved (from API)
    const hasValidGroupId = parentRow.vendorGroupId && 
                            parentRow.vendorGroupId !== "" && 
                            parentRow.vendorGroupId !== NUMBERMAP.ONE.toString() &&
                            parentRow.vendorGroupId !== null &&
                            parentRow.vendorGroupId !== undefined && 
                            !isNaN(Number(parentRow.vendorGroupId));
    
    // group_mapper_id should only be set if it exists (from previously saved group)
    // If it doesn't exist, set it to null
    const groupMapperId = (parentRow as any).group_mapper_id && 
                         (parentRow as any).group_mapper_id !== "" && 
                         (parentRow as any).group_mapper_id !== null &&
                         (parentRow as any).group_mapper_id !== undefined
      ? (parentRow as any).group_mapper_id
      : null;
    const groupObj: any = {
      group_mapper_id: groupMapperId, // Use group_mapper_id if it exists, otherwise null
      group_id: hasValidGroupId ? parentRow.vendorGroupId : null,
      is_new_group: hasValidGroupId ? "false" : "true",
      group_name: parentRow.criteria ?? null,
      status_id: parentRow.status ?? NUMBERMAP.ONE,
      display_order: groupId,
      criteria: childRows.map((childRow) => {
        // If group_criteria_mapper_id exists, it's an existing record that should be updated
        const hasMapperId = childRow.group_criteria_mapper_id !== undefined && childRow.group_criteria_mapper_id !== null && childRow.group_criteria_mapper_id !== "";
        
        // Check if criteriaId is a valid numeric ID (existing criteria from dropdown) or custom text (new criteria)
        const isNumericId = childRow.criteriaId && !isNaN(Number(childRow.criteriaId)) && childRow.criteriaId.toString().trim() !== "";
        
        // If mapper ID exists, it's an existing record (update), otherwise check if criteriaId is numeric
        // If criteriaId is numeric, it's an existing criteria (either being mapped or updated)
        // If criteriaId is not numeric or empty, it's a new custom criteria
        const isNewCriteria = hasMapperId ? false : (!isNumericId || !childRow.criteriaId || childRow.criteriaId.toString().trim() === "");
        
        return {
          criteria_mapper_id: childRow.group_criteria_mapper_id ? childRow.group_criteria_mapper_id.toString() : null,
          criteria_id: isNewCriteria ? null : (childRow.criteriaId?.toString() ?? null),
          is_new_criteria: isNewCriteria ? "true" : "false",
          criteria_name: childRow.criteria ?? "",
          requirement_id: childRow.requirementId ? Number(childRow.requirementId) : NUMBERMAP.ONE,
          display_order: childRow.order ?? NUMBERMAP.ONE,
          status_id: childRow.status ?? NUMBERMAP.ONE,
        };
      })
    };
    
    criteriaDetails.push(groupObj);
  });
  
  // Sort by display_order
  criteriaDetails.sort((a, b) => a.display_order - b.display_order);
  
  return criteriaDetails;
};

/**
 * Builds form data payload
 */
export const buildReEvaluationFormDataPayload = (
  isAddMode: boolean,
  vendorReEvaluationCriteriaId: number | null,
  formData: any,
  criteriaData: VendorReEvaluationCriteria[],
  finalFileData: FinalFileData
): FormData => {
  const payload = new FormData();
  
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.CRITERIA_ID, isAddMode ? "" : (vendorReEvaluationCriteriaId ?? "").toString());
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.PART_TYPE_ID, formData.partType);
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.PART_SUB_TYPE_ID, formData.partSubType);
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.PART_SUB_CLASS_ID, formData.partSubClass);
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.PART_CATEGORY_ID, formData.partCategoryName ?? "");
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.STATUS, formData.status ?? "");
  
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.CRITERIA_DETAILS, JSON.stringify(buildReEvaluationCriteriaDetails(criteriaData)));
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.CREATE_META_DATA, JSON.stringify(finalFileData.create_meta_data));
  
  // Only append update_meta_data for update operations
  if (!isAddMode) {
    payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.UPDATE_META_DATA, JSON.stringify(finalFileData.update_meta_data));
  }
  
  payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.DOCUMENTS_TO_DELETE, JSON.stringify(finalFileData.documents_to_delete));
  
  finalFileData.documents_to_create.forEach(file => {
    payload.append(VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS.DOCUMENTS_TO_CREATE, file, file.name);
  });
  
  return payload;
};

