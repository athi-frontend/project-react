/**
 * Classification: Confidential
 * Utility functions for Vendor Selection Criteria data transformation
 */

import { CriteriaDetail } from '@/types/modules/vendor-management/vendorSelectionCriteria';
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types';
import { NUMBERMAP } from '@/constants/common';

/**
 * Groups criteria data by group ID
 */
export const groupDataByGroupId = (apiCriteriaData: CriteriaDetail[]) => {
  return apiCriteriaData.reduce((acc: Record<number, CriteriaDetail[]>, item) => {
    const groupId = item.group_id;
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(item);
    return acc;
  }, {});
};

/**
 * Sorts grouped data by display order
 */
export const sortGroupsByDisplayOrder = (groupedData: Record<number, CriteriaDetail[]>) => {
  return Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => {
      const minA = Math.min(...groupedData[a].map(item => item.display_order ?? NUMBERMAP.ZERO));
      const minB = Math.min(...groupedData[b].map(item => item.display_order ?? NUMBERMAP.ZERO));
      return minA - minB;
    });
};

/**
 * Creates a parent row from API data
 */
export const createParentRowFromAPI = (item: CriteriaDetail, groupId: number, groupIndex: number): VendorCriteria => ({
  id: groupId,
  sno: groupIndex + NUMBERMAP.ONE,
  criteria: item.group_value,
  requirement: '-',
  category: '',
  group: groupIndex + NUMBERMAP.ONE,
  isParent: true,
  order: NUMBERMAP.ZERO,
  status: item.status,
  vendorGroupId: groupId.toString(),
});

/**
 * Creates a child row from API data
 */
export const createChildRowFromAPI = (item: CriteriaDetail, groupIndex: number, childIndex: number, groupId: number): VendorCriteria => ({
  id: item.group_criteria_mapper_id,
  sno: NUMBERMAP.ZERO,
  criteria: item.sub_group_value,
  requirement: item.requirement_type_name ?? '-',
  category: '',
  group: groupIndex + NUMBERMAP.ONE,
  isParent: false,
  order: childIndex + NUMBERMAP.ONE,
  status: item.status,
  group_criteria_mapper_id: item.group_criteria_mapper_id,
  sub_group_id: item.sub_group_id,
  display_order: item.display_order,
  criteriaId: item.sub_group_id?.toString(),
  requirementId: item.requirement_type?.toString(),
  statusId: item.status?.toString(),
  vendorGroupId: groupId.toString(),
});

/**
 * Builds hierarchical data structure from grouped data
 */
export const buildHierarchicalData = (groupedData: Record<number, CriteriaDetail[]>, sortedGroupIds: number[]): VendorCriteria[] => {
  const hierarchicalData: VendorCriteria[] = [];
  
  sortedGroupIds.forEach((groupId, groupIndex) => {
    const sortedItems = groupedData[groupId].toSorted((a, b) => (a.display_order ?? NUMBERMAP.ZERO) - (b.display_order ?? NUMBERMAP.ZERO));
    
    const parentRow = createParentRowFromAPI(sortedItems[NUMBERMAP.ZERO], groupId, groupIndex);
    hierarchicalData.push(parentRow);
    
    sortedItems.forEach((item, childIndex) => {
      const childRow = createChildRowFromAPI(item, groupIndex, childIndex, groupId);
      hierarchicalData.push(childRow);
    });
  });
  
  return hierarchicalData;
};

/**
 * Creates a child row for new criteria
 */
export const createChildRow = (data: any, groupId: number, order: number): VendorCriteria => {
  // Convert statusId to number if it's a string
  let statusValue = NUMBERMAP.ONE;
  if (data.statusId) {
    statusValue = typeof data.statusId === 'string' ? Number(data.statusId) : data.statusId;
  }
  return {
    id: data.vendor_selection_criteria_id ?? crypto.randomUUID(),
    sno: NUMBERMAP.ZERO,
    criteria: data.criteria,
    requirement: data.requirement ?? '-',
    category: '',
    group: groupId,
    isParent: false,
    order,
    status: statusValue,
    group_criteria_mapper_id: undefined,
    sub_group_id: data.criteriaId ?? "",
    display_order: undefined,
    vendorGroupId: data.vendorGroupId,
    criteriaId: data.criteriaId,
    requirementId: data.requirementId,
    statusId: data.statusId,
  };
};

/**
 * Creates a parent row for new criteria group
 */
export const createParentRow = (data: any, groupId: number): VendorCriteria => ({
  id: data.group_id ?? groupId,
  sno: groupId,
  criteria: data.partGroupName ?? `Group ${groupId}`,
  requirement: '-',
  category: '-',
  group: groupId,
  isParent: true,
  order: NUMBERMAP.ZERO,
  status: data.status_id,
  vendorGroupId: data.vendorGroupId ?? '',
});

