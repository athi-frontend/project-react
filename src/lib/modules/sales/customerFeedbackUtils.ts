/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from '@/constants/common';
import { transformHierarchicalData, TransformConfig, BaseHierarchicalRow } from '@/lib/modules/vendor-management/transformHierarchicalData';
import { 
  CustomerFeedbackCriteriaDetail, 
  FeedbackCriteriaData,
  CustomerFeedbackCriteriaGroup,
  CustomerFeedbackCriteria
} from '@/types/modules/sales/customerFeedback';

/**
 * Transforms criteria from detail API (edit mode) to CustomerFeedbackCriteriaDetail format
 * @param criteriaList - Array of CustomerFeedbackCriteria from API
 * @returns Array of CustomerFeedbackCriteriaDetail
 */
export const transformDetailCriteriaToCriteriaDetail = (
  criteriaList: CustomerFeedbackCriteria[]
): CustomerFeedbackCriteriaDetail[] => {
  if (!criteriaList || criteriaList.length === NUMBERMAP.ZERO) {
    return [];
  }

  // Group by group_id and group_name, then by feedback_criteria_detail_id (criteria_mapper_id)
  const groupMap = new Map<number, { group_name: string; criteria: Map<number, CustomerFeedbackCriteria> }>();
  
  criteriaList.forEach((criteria: CustomerFeedbackCriteria) => {
    const groupId = criteria.group_id;
    const mapperId = criteria.feedback_criteria_detail_id;
    
    if (!groupId || !mapperId) {
      return;
    }
    
    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, {
        group_name: criteria.group_name ?? '',
        criteria: new Map(),
      });
    }
    
    const group = groupMap.get(groupId)!;
    // Keep the latest entry for each criteria_mapper_id (highest customer_feedback_response_id)
    const existing = group.criteria.get(mapperId);
    if (!existing || (criteria.customer_feedback_response_id ?? NUMBERMAP.ZERO) > (existing.customer_feedback_response_id ?? NUMBERMAP.ZERO)) {
      group.criteria.set(mapperId, criteria);
    }
  });
  
  // Convert to CustomerFeedbackCriteriaDetail array
  const criteriaDetails: CustomerFeedbackCriteriaDetail[] = [];
  groupMap.forEach((group, groupId) => {
    group.criteria.forEach((criteria) => {
      criteriaDetails.push({
        criteria_mapper_id: criteria.feedback_criteria_detail_id!,
        group_id: groupId,
        group_name: group.group_name,
        criteria_id: criteria.criteria_id ?? NUMBERMAP.ZERO,
        criteria_name: criteria.criteria ?? '',
        status_id: NUMBERMAP.ONE,
        display_order: criteria.display_order ?? NUMBERMAP.ZERO,
        is_system_defined: false,
      });
    });
  });
  
  // Sort by group (by minimum display_order in each group), then by display_order within each group
  const groupedCriteria = criteriaDetails.reduce((acc: Record<number, CustomerFeedbackCriteriaDetail[]>, item) => {
    acc[item.group_id] ??= [];
    acc[item.group_id].push(item);
    return acc;
  }, {});

  const sortedGroupIds = Object.keys(groupedCriteria)
    .map(id => Number.parseInt(id, NUMBERMAP.TEN))
    .sort((a, b) => {
      const itemsA = groupedCriteria[a];
      const itemsB = groupedCriteria[b];
      const minOrderA = Math.min(...itemsA.map(item => item.display_order));
      const minOrderB = Math.min(...itemsB.map(item => item.display_order));
      return minOrderA - minOrderB;
    });

  const sortedCriteriaDetails: CustomerFeedbackCriteriaDetail[] = [];
  sortedGroupIds.forEach(groupId => {
    const groupItems = groupedCriteria[groupId];
    const sortedItems = [...groupItems].sort((a, b) => a.display_order - b.display_order);
    sortedCriteriaDetails.push(...sortedItems);
  });
  
  return sortedCriteriaDetails;
};

/**
 * Flattens nested criteria details structure from API to flat array
 * @param criteriaDetails - Array of groups with nested criteria arrays
 * @returns Flat array of CustomerFeedbackCriteriaDetail
 */
export const flattenCriteriaDetails = (
  criteriaDetails: CustomerFeedbackCriteriaGroup[]
): CustomerFeedbackCriteriaDetail[] => {
  const flattenedCriteriaDetails: CustomerFeedbackCriteriaDetail[] = [];
  
  if (!criteriaDetails || criteriaDetails.length === NUMBERMAP.ZERO) {
    return flattenedCriteriaDetails;
  }

  criteriaDetails.forEach((group) => {
    if (group.criteria && group.criteria.length > NUMBERMAP.ZERO) {
      group.criteria.forEach((criteriaItem) => {
        flattenedCriteriaDetails.push({
          criteria_mapper_id: criteriaItem.criteria_mapper_id,
          group_id: group.group_id,
          group_name: group.group_name,
          criteria_id: criteriaItem.criteria_id,
          criteria_name: criteriaItem.criteria_name,
          status_id: criteriaItem.status_id,
          display_order: criteriaItem.display_order,
          is_system_defined: criteriaItem.is_system_defined,
        });
      });
    }
  });

  return flattenedCriteriaDetails;
};

/**
 * Flattens grouped CustomerFeedbackCriteria structure to flat array
 * @param criteriaList - Array that may be grouped or flat
 * @returns Flat array of CustomerFeedbackCriteria
 */
export const flattenCriteriaList = (
  criteriaList: CustomerFeedbackCriteria[] | any[]
): CustomerFeedbackCriteria[] => {
  let flattenedCriteria: CustomerFeedbackCriteria[] = [];
  
  if (!Array.isArray(criteriaList) || criteriaList.length === NUMBERMAP.ZERO) {
    return flattenedCriteria;
  }

  const firstItem = criteriaList[NUMBERMAP.ZERO];
  
  // Check if it's a grouped structure (has 'criteria' array property)
  if (firstItem && typeof firstItem === 'object' && 'criteria' in firstItem && Array.isArray(firstItem.criteria)) {
    // Flatten grouped structure to flat array
    criteriaList.forEach((group: any) => {
      if (group.criteria && Array.isArray(group.criteria)) {
        group.criteria.forEach((criteriaItem: any) => {
          flattenedCriteria.push({
            customer_feedback_response_id: criteriaItem.customer_feedback_response_id ?? "",
            feedback_criteria_detail_id: criteriaItem.feedback_criteria_detail_id ?? null,
            group_name: group.group_name ?? null,
            group_id: group.group_id ?? null,
            criteria: criteriaItem.criteria ?? null,
            criteria_id: criteriaItem.criteria_id ?? null,
            display_order: criteriaItem.display_order ?? null,
            rating_id: criteriaItem.rating_id ?? null,
            rating_name: criteriaItem.rating_name ?? null,
          });
        });
      }
    });
  } else {
    // Already flat array structure
    flattenedCriteria = criteriaList;
  }

  return flattenedCriteria;
};

/**
 * Transforms criteria data to flat structure using transformHierarchicalData
 * @param criteriaData - Array of CustomerFeedbackCriteriaDetail
 * @returns Array of FeedbackCriteriaData
 */
export const transformCriteriaToFlat = (
  criteriaData: CustomerFeedbackCriteriaDetail[]
): FeedbackCriteriaData[] => {
  if (!criteriaData || criteriaData.length === NUMBERMAP.ZERO) {
    return [];
  }

  // Sort groups by minimum display_order (same as original implementation)
  const groupedCriteria = criteriaData.reduce((acc: Record<number, CustomerFeedbackCriteriaDetail[]>, item) => {
    acc[item.group_id] ??= [];
    acc[item.group_id].push(item);
    return acc;
  }, {});

  const sortedGroupIds = Object.keys(groupedCriteria)
    .map(id => parseInt(id))
    .sort((a, b) => {
      const itemsA = groupedCriteria[a];
      const itemsB = groupedCriteria[b];
      const minOrderA = Math.min(...itemsA.map(item => item.display_order));
      const minOrderB = Math.min(...itemsB.map(item => item.display_order));
      return minOrderA - minOrderB;
    });

  // Reorder criteriaData to match sorted group order
  const sortedCriteriaData: CustomerFeedbackCriteriaDetail[] = [];
  sortedGroupIds.forEach(groupId => {
    const groupItems = groupedCriteria[groupId];
    const sortedItems = [...groupItems].sort((a, b) => a.display_order - b.display_order);
    sortedCriteriaData.push(...sortedItems);
  });

  // Create an intermediate type that extends BaseHierarchicalRow
  interface HierarchicalFeedbackCriteria extends BaseHierarchicalRow {
    serialNo?: string;
    criteria_mapper_id?: number;
  }

  const config: TransformConfig<HierarchicalFeedbackCriteria> = {
    groupIdField: 'group_id',
    groupNameField: 'group_name',
    subGroupIdField: 'criteria_mapper_id', 
    orderField: 'display_order',
    parentIdPrefix: 'group',
    childIdPrefix: 'mapper',
    childIdField: 'criteria_mapper_id',
    fieldMappings: {
      criteria: 'criteria_name',
    },
    createParentRow: (config) => {
      const groupSerialNo = config.groupIndex + NUMBERMAP.ONE;
      return {
        id: `group-${config.groupId}`,
        sno: groupSerialNo,
        criteria: config.groupName,
        group: config.groupId,
        order: NUMBERMAP.ONE,
        isParent: true,
        serialNo: String(groupSerialNo).padStart(NUMBERMAP.TWO, '0'),
      } as HierarchicalFeedbackCriteria;
    },
    createChildRow: (config) => {
      return {
        id: `mapper-${config.item.criteria_mapper_id}`,
        sno: config.globalSno,
        criteria: config.item.criteria_name,
        group: config.groupId,
        order: config.item.display_order,
        isParent: false,
        serialNo: "",
        criteria_mapper_id: config.item.criteria_mapper_id,
      } as HierarchicalFeedbackCriteria;
    },
  };

  const hierarchicalData = transformHierarchicalData(sortedCriteriaData as any, config);
  
  // Transform to FeedbackCriteriaData format
  return hierarchicalData.map((row): FeedbackCriteriaData => {
    const hierarchicalRow = row as HierarchicalFeedbackCriteria;
    // Parent rows have serialNo (like "01", "02"), child rows have empty serialNo
    const serialNo = hierarchicalRow.isParent 
      ? (hierarchicalRow.serialNo ?? String(hierarchicalRow.sno).padStart(NUMBERMAP.TWO, '0'))
      : "";
    
    return {
      id: String(row.id),
      serialNo: serialNo,
      criteria: row.criteria,
      criteria_mapper_id: hierarchicalRow.criteria_mapper_id,
    };
  });
};

