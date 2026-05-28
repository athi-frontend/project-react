/**
 * Classification: Confidential
 * Transformation utility for nested hierarchical API data structure
 * Handles groups with nested criteria arrays
 */

import { NUMBERMAP } from '@/constants/common';
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types';

/**
 * Configuration for transforming nested hierarchical data
 */
export interface NestedTransformConfig {
  // Group level field mappings
  groupIdField: string; // Field name for group ID (e.g., 'group_id')
  groupNameField: string; // Field name for group name (e.g., 'group_value')
  groupOrderField?: string; // Field name for group display order (e.g., 'applicable_group_display_order') - also known as parent_order_field
  criteriaArrayField: string; // Field name for criteria array (e.g., 'criteria') - also known as child_key
  
  // Child/Criteria level field mappings
  childIdField?: string; // Field name for child ID (e.g., 'group_criteria_mapper_id', 'sub_group_id') - also known as unique_id
  childNameField: string; // Field name for child name (e.g., 'sub_group_value')
  childOrderField?: string; // Field name for child display order (e.g., 'criteria_display_order', 'display_order') - also known as child_order_field
  
  // Additional field mappings
  fieldMappings: {
    criteria?: string; // Field name for criteria display (defaults to childNameField)
    requirement?: string; // Field name for requirement (e.g., 'requirement_type_name')
    requirementId?: string; // Field name for requirement ID (e.g., 'requirement_type')
    category?: string; // Field name for category
    status?: string; // Field name for status
    remarks?: string; // Field name for remarks
    [key: string]: string | undefined; // Allow additional custom fields
  };
  
  // ID generation configuration
  parentIdPrefix?: string; // Prefix for parent row IDs (default: 'parent_')
  childIdPrefix?: string; // Prefix for child row IDs (default: 'child_')
  
  // Custom row creation functions (optional)
  createParentRow?: (config: NestedParentRowConfig) => VendorCriteria;
  createChildRow?: (config: NestedChildRowConfig) => VendorCriteria;
}

export interface NestedParentRowConfig {
  id: string | number;
  sno: number;
  groupId: number;
  groupName: string;
  groupData: any;
  groupIndex: number;
  globalSno: number;
  hasChildren: boolean;
  type?: string;
}

export interface NestedChildRowConfig {
  id: string | number;
  sno: number;
  groupId: number;
  groupName: string;
  childData: any;
  childIndex: number;
  globalSno: number;
  groupIndex: number;
  groupData: any; // Add groupData to access parent order field
  type?: string;
}

/**
 * Transforms nested hierarchical data (groups with criteria arrays) into flat VendorCriteria array
 * @param data - Array of group objects with nested criteria arrays
 * @param config - Configuration object defining field mappings and behavior
 * @returns Array of transformed hierarchical rows
 */
export function transformNestedHierarchicalData(
  data: any[],
  config: NestedTransformConfig
): VendorCriteria[] {
  const flatData: VendorCriteria[] = [];

  if (!data || !Array.isArray(data)) {
    return flatData;
  }

  // Sort groups by display order if orderField is provided
  const sortedGroups = config.groupOrderField
    ? [...data].sort((a, b) => {
        const orderField = config.groupOrderField;
        const orderA = a[orderField] ?? Number.MAX_SAFE_INTEGER;
        const orderB = b[orderField] ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      })
    : data;

  let globalSno = NUMBERMAP.ONE;
  let groupIndex = NUMBERMAP.ZERO;

  // Process each group
  sortedGroups.forEach((group: any) => {
    const groupId = group[config.groupIdField];
    const groupName = group[config.groupNameField] ?? '';
    const criteriaArray = group[config.criteriaArrayField] ?? [];

    // Check if group has children
    const hasChildren = Array.isArray(criteriaArray) && criteriaArray.length > NUMBERMAP.ZERO;
    const parentRowConfig: NestedParentRowConfig = {
      id: `${config.parentIdPrefix || 'parent_'}_${groupId}`,
      sno: groupIndex + NUMBERMAP.ONE,
      groupId,
      groupName,
      groupData: group,
      groupIndex,
      globalSno,
      hasChildren,
      type:group?.type
    };

    if (hasChildren) {
      // Has children: always add parent row, then child rows (regardless of count)
      const parentRow = config.createParentRow
        ? config.createParentRow(parentRowConfig)
        : createDefaultNestedParentRow(parentRowConfig, config);

      flatData.push(parentRow);
      globalSno++;

      // Sort children by display order if orderField is provided
      const sortedChildren = config.childOrderField
        ? [...criteriaArray].sort((a, b) => {
            const orderField = config.childOrderField;
            const orderA = a[orderField] ?? Number.MAX_SAFE_INTEGER;
            const orderB = b[orderField] ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          })
        : criteriaArray;

      // Add child rows
      sortedChildren.forEach((childItem: any, childIndex: number) => {
         // Use globalSno (index) as unique identifier for child rows to avoid duplicate keys
         const childId = globalSno;
        
        const childRowConfig: NestedChildRowConfig = {
          id: `${config.childIdPrefix || 'child_'}_${childId}`,
          sno: globalSno,
          groupId,
          groupName,
          childData: childItem,
          childIndex,
          globalSno,
          groupIndex,
          groupData: group, // Pass group data to access parent order field
        };

        const childRow = config.createChildRow
          ? config.createChildRow(childRowConfig)
          : createDefaultNestedChildRow(childRowConfig, config);

        flatData.push(childRow);
        globalSno++;
      });
    } else {
      // Empty group: add parent row only
      const parentRow = config.createParentRow
        ? config.createParentRow(parentRowConfig)
        : createDefaultNestedParentRow(parentRowConfig, config);

      flatData.push(parentRow);
      globalSno++;
    }

    groupIndex++;
  });

  return flatData;
}

/**
 * Creates a default parent row based on configuration
 */
function createDefaultNestedParentRow(
  config: NestedParentRowConfig,
  transformConfig: NestedTransformConfig
): VendorCriteria {
  const { id, sno, groupId,groupName, groupData, groupIndex, hasChildren, type } = config;

  // Get parent order from groupOrderField (parent_order_field)
  const parentOrder = transformConfig.groupOrderField && groupData[transformConfig.groupOrderField]
    ? groupData[transformConfig.groupOrderField]
    : groupIndex + NUMBERMAP.ONE;

  // Create base parent row with all fields from groupData
  const parentRow: VendorCriteria = {
    id,
    sno,
    criteria: groupName,
    vendorGroupId: groupId?.toString(),
    requirement: '-',
    group_id:groupId,
    category: groupName,
    group: parentOrder, // Use parent_order_field value for group ordering
    isParent: true,
    isChild: false,
    isChildAvailable: hasChildren,
    order: NUMBERMAP.ONE, // Parent rows always have order 1
    status: undefined,
    remarks: undefined,
    type: type ?? "",
    // Preserve all other fields from groupData
    ...Object.keys(groupData).reduce((acc, key) => {
      // Skip fields that are already mapped or are the child array
      if (
        key !== transformConfig.groupIdField &&
        key !== transformConfig.groupNameField &&
        key !== transformConfig.groupOrderField &&
        key !== transformConfig.criteriaArrayField
      ) {
        acc[key] = groupData[key];
      }
      return acc;
    }, {} as Record<string, any>)
  };

  return parentRow;
}

/**
 * Creates a default child row based on configuration
 */
function createDefaultNestedChildRow(
  config: NestedChildRowConfig,
  transformConfig: NestedTransformConfig
): VendorCriteria {
  const { id, sno, groupId, groupName, childData, childIndex, groupIndex, groupData } = config;
  const criteriaField = transformConfig.fieldMappings.criteria || transformConfig.childNameField;
  const criteriaValue = childData[criteriaField] ?? '';
  // Get parent order from groupOrderField (parent_order_field) - same as parent
  const parentOrder = transformConfig.groupOrderField && groupData[transformConfig.groupOrderField]
    ? groupData[transformConfig.groupOrderField]
    : groupIndex + NUMBERMAP.ONE;

  // Get child order from childOrderField (child_order_field)
  const childOrder = transformConfig.childOrderField
    ? (childData[transformConfig.childOrderField] ?? childIndex + NUMBERMAP.ONE)
    : childIndex + NUMBERMAP.ONE;
  // Create base child row with all fields from childData
  const childRow: VendorCriteria = {
    id,
    sno,
    criteria: criteriaValue,
    requirement: transformConfig.fieldMappings.requirement
      ? (childData[transformConfig.fieldMappings.requirement] ?? '-')
      : '-',
    category: transformConfig.fieldMappings.category
      ? childData[transformConfig.fieldMappings.category]
      : groupName,
    group: parentOrder, // Use same parent order as parent row
    isParent: false,
    isChild: true,
    isChildAvailable: false, // Child rows never have children
    group_id:groupData.group_id??null,
    order: childOrder, // Use child_order_field value for ordering within group
    status: transformConfig.fieldMappings.status
      ? childData[transformConfig.fieldMappings.status]
      : undefined,
    remarks: transformConfig.fieldMappings.remarks
      ? childData[transformConfig.fieldMappings.remarks]
      : undefined,
    // Preserve original IDs for API operations
    group_criteria_mapper_id: transformConfig.childIdField
      ? childData[transformConfig.childIdField]
      : undefined,
    sub_group_id: childData['sub_group_id'],
    display_order: transformConfig.childOrderField
      ? childData[transformConfig.childOrderField]
      : undefined,
    // Map additional fields if provided
    requirementId: transformConfig.fieldMappings.requirementId
      ? childData[transformConfig.fieldMappings.requirementId]?.toString()
      : undefined,
    statusId: transformConfig.fieldMappings.status
      ? childData[transformConfig.fieldMappings.status]?.toString()
      : undefined,
    // criteriaId should be sub_group_id (matches ref_id in dropdown), not group_criteria_mapper_id
    criteriaId: childData.sub_group_id??childData.group_criteria_id,
    vendorGroupId: groupId?.toString(),
    type: childData?.type,
    // Preserve all other fields from childData
    ...Object.keys(childData).reduce((acc, key) => {
      // Skip fields that are already mapped
      if (
        key !== transformConfig.childIdField &&
        key !== transformConfig.childNameField &&
        key !== transformConfig.childOrderField &&
        key !== criteriaField &&
        key !== transformConfig.fieldMappings.requirement &&
        key !== transformConfig.fieldMappings.requirementId &&
        key !== transformConfig.fieldMappings.category &&
        key !== transformConfig.fieldMappings.status &&
        key !== transformConfig.fieldMappings.remarks
      ) {
        acc[key] = childData[key];
      }
      return acc;
    }, {} as Record<string, any>)
  };

  return childRow;
}
