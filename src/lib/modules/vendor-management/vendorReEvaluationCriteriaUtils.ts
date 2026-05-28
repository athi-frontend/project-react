/**
 * Classification: Confidential
 * Utility functions for Vendor Re-Evaluation Criteria data transformation
 */

import { CriteriaDetail } from '@/types/modules/vendor-management/vendorReEvaluationCriteria';
import { VendorReEvaluationCriteria } from '@/components/modules/vendor-management/vendor-re-evaluation-criteria/VendorReEvaluationCriteriaTable';
import { NUMBERMAP } from '@/constants/common';

/**
 * Sorts criteria data by display order
 */
export const sortReEvaluationGroupsByDisplayOrder = (apiCriteriaData: CriteriaDetail[]) => {
  return [...apiCriteriaData].sort((a, b) => (a.display_order ?? NUMBERMAP.ZERO) - (b.display_order ?? NUMBERMAP.ZERO));
};

/**
 * Creates a parent row from API data
 */
export const createReEvaluationParentRowFromAPI = (item: CriteriaDetail, groupIndex: number): VendorReEvaluationCriteria => {
  // Use group_mapper_id as the unique ID (it's the primary identifier for the group)
  // If group_mapper_id is not available, use group_id
  // As a last resort, create a unique negative number to avoid conflicts with positive IDs
  let uniqueId: number | string;
  if (typeof item.group_mapper_id === 'string' && item.group_mapper_id) {
    uniqueId = parseInt(item.group_mapper_id);
  } else if (typeof item.group_mapper_id === 'number' && item.group_mapper_id) {
    uniqueId = item.group_mapper_id;
  } else if (typeof item.group_id === 'string' && item.group_id) {
    // Use negative of group_id to distinguish from group_mapper_id
    uniqueId = -Math.abs(parseInt(item.group_id));
  } else if (typeof item.group_id === 'number' && item.group_id) {
    uniqueId = -Math.abs(item.group_id);
  } else {
    // Last resort: use negative groupIndex to ensure uniqueness
    uniqueId = -(10000 + groupIndex);
  }
  
  const vendorGroupId = typeof item.group_id === 'string' 
    ? item.group_id 
    : (item.group_id?.toString() ?? '');
  
  // Store group_mapper_id separately if it exists (from previously saved groups)
  let groupMapperId: string | null = null;
  if (typeof item.group_mapper_id === 'string' && item.group_mapper_id) {
    groupMapperId = item.group_mapper_id;
  } else if (typeof item.group_mapper_id === 'number') {
    groupMapperId = item.group_mapper_id.toString();
  }
  
  return {
    id: uniqueId,
    sno: groupIndex + NUMBERMAP.ONE,
    criteria: item.group_name,
    requirement: '-',
    category: '',
    group: groupIndex + NUMBERMAP.ONE,
    isParent: true,
    order: NUMBERMAP.ZERO,
    status: item.status_id,
    vendorGroupId,
    group_mapper_id: groupMapperId, // Store group_mapper_id separately
  };
};

/**
 * Creates a child row from API data
 */
export const createReEvaluationChildRowFromAPI = (criteriaItem: any, groupIndex: number, childIndex: number, groupId: number | string, requirementMap?: Map<number, string>,group_mapper_id:number|string): VendorReEvaluationCriteria => {
  const criteriaId = typeof criteriaItem.criteria_id === 'string' && criteriaItem.criteria_id 
    ? parseInt(criteriaItem.criteria_id) 
    : (criteriaItem.criteria_id ?? null);
  
  // Keep criteria_mapper_id for API communication
  const criteriaMapperId = typeof criteriaItem.criteria_mapper_id === 'string' && criteriaItem.criteria_mapper_id 
    ? parseInt(criteriaItem.criteria_mapper_id) 
    : criteriaItem.criteria_mapper_id;
  
  // Generate unique row ID with prefix to avoid collision with parent rows
  let uniqueRowId: string;
  if (criteriaMapperId) {
    uniqueRowId = `criteria_${criteriaMapperId}`;
  } else if (criteriaId !== null) {
    uniqueRowId = `criteria_id_${criteriaId}`;
  } else {
    uniqueRowId = `criteria_${groupIndex}_${childIndex}_${crypto.randomUUID()}`;
  }
  
  // Get requirement name from API response if available, otherwise from requirementMap
  let requirementName = '-';
  if (criteriaItem.requirement_name || criteriaItem.requirement_type) {
    requirementName = criteriaItem.requirement_name ?? criteriaItem.requirement_type ?? '-';
  } else if (requirementMap && criteriaItem.requirement_id) {
    requirementName = requirementMap.get(criteriaItem.requirement_id) ?? '-';
  }
  
  return {
    id: uniqueRowId,
    sno: NUMBERMAP.ZERO,
    criteria: criteriaItem.criteria_name,
    requirement: requirementName,
    category: '',
    group: groupIndex + NUMBERMAP.ONE,
    isParent: false,
    group_mapper_id:group_mapper_id,
    order: criteriaItem.display_order ?? childIndex + NUMBERMAP.ONE,
    status: criteriaItem.status_id,
    group_criteria_mapper_id: criteriaMapperId,
    criteria_id: criteriaId,
    display_order: criteriaItem.display_order,
    criteriaId: criteriaItem.criteria_id?.toString() ?? '',
    requirementId: criteriaItem.requirement_id?.toString() ?? '',
    vendorGroupId: typeof groupId === 'number' ? groupId.toString() : groupId,
  };
};

/**
 * Builds hierarchical data structure from API data
 */
export const buildReEvaluationHierarchicalData = (apiCriteriaData: CriteriaDetail[], requirementMap?: Map<number, string>): VendorReEvaluationCriteria[] => {
  const hierarchicalData: VendorReEvaluationCriteria[] = [];
  
  // Sort by display_order
  const sortedGroups = sortReEvaluationGroupsByDisplayOrder(apiCriteriaData);
  
  sortedGroups.forEach((groupItem, groupIndex) => {
    let groupId: number;
    if (groupItem.group_id) {
      groupId = Number(groupItem.group_id);
    } else if (typeof groupItem.group_mapper_id === 'string' && groupItem.group_mapper_id) {
      groupId = Number(groupItem.group_mapper_id);
    } else if (typeof groupItem.group_mapper_id === 'number') {
      groupId = groupItem.group_mapper_id;
    } else {
      groupId = groupIndex + 1;
    }
    let group_mapper_id = null
    if ( groupItem.group_mapper_id) {
      group_mapper_id = Number(groupItem.group_mapper_id);
    }
    // Create parent row
    const parentRow = createReEvaluationParentRowFromAPI(groupItem, groupIndex);
    hierarchicalData.push(parentRow);
    
    // Process criteria items within each group
    if (groupItem.criteria && Array.isArray(groupItem.criteria)) {
      const sortedCriteria = [...groupItem.criteria].sort((a, b) => (a.display_order ?? NUMBERMAP.ZERO) - (b.display_order ?? NUMBERMAP.ZERO));
      sortedCriteria.forEach((criteriaItem, childIndex) => {
        const childRow = createReEvaluationChildRowFromAPI(criteriaItem, groupIndex, childIndex, groupId, requirementMap,group_mapper_id);
        hierarchicalData.push(childRow);
      });
    }
  });
  
  return hierarchicalData;
};

/**
 * Creates a child row for new criteria
 */
export const createReEvaluationChildRow = (data: any, groupId: number, order: number): VendorReEvaluationCriteria => {
  const statusValue = data.status ? Number(data.status) : NUMBERMAP.ONE;
  return {
    id: data.vendor_re_evaluation_criteria_id ? `criteria_${data.vendor_re_evaluation_criteria_id}` : `criteria_new_${crypto.randomUUID()}`,
    sno: NUMBERMAP.ZERO,
    criteria: data.criteria,
    requirement: data.requirement ?? '-',
    category: '',
    group: groupId,
    isParent: false,
    order,
    status: statusValue,
    group_criteria_mapper_id: undefined,
    criteria_id: data.criteriaId ?? "",
    display_order: undefined,
    vendorGroupId: data.vendorGroupId,
    criteriaId: data.criteriaId,
    requirementId: data.requirementId,
  };
};

/**
 * Creates a parent row for new criteria group
 */
export const createReEvaluationParentRow = (data: any, groupId: number): VendorReEvaluationCriteria => {
  // Generate a unique ID with 'group_' prefix to avoid collision with child rows
  // Parent rows use 'group_<id>' format, child rows use 'criteria_<id>' format
  let uniqueId: string;
  if (data.group_id) {
    uniqueId = `group_${data.group_id}`;
  } else {
    // Use group_new prefix with groupId for new groups
    uniqueId = `group_new_${groupId}`;
  }
  
  const statusValue = data.status ? Number(data.status) : NUMBERMAP.ONE;
  
  // group_mapper_id should only exist if the group was previously saved (from API)
  // For new groups or groups selected from dropdown, group_mapper_id should be null
  let groupMapperId: string | null = null;
  if (data.group_mapper_id && data.group_mapper_id !== "" && data.group_mapper_id !== null) {
    if (typeof data.group_mapper_id === 'string') {
      groupMapperId = data.group_mapper_id;
    } else {
      groupMapperId = data.group_mapper_id.toString();
    }
  }
  
  return {
    id: uniqueId,
    sno: groupId,
    criteria: data.partGroupName ?? `Group ${groupId}`,
    requirement: '-',
    category: '-',
    group: groupId,
    isParent: true,
    order: NUMBERMAP.ZERO,
    status: statusValue,
    vendorGroupId: data.vendorGroupId ?? null, // group_id (from dropdown or null for new groups)
    group_mapper_id: groupMapperId, // group_mapper_id (from previously saved groups, or null)
  };
};

