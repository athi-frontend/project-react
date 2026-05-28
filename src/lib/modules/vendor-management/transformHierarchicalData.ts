/**
 * Classification : Confidential
 */

import { NUMBERMAP } from '@/constants/common';

export interface TransformConfig<T = any> {
  // Grouping configuration
  groupIdField: string; // Field name for group ID (e.g., 'group_id')
  groupNameField: string; // Field name for group name (e.g., 'group_value')
  subGroupIdField?: string; // Field name for sub-group ID (e.g., 'sub_group_id')
  subGroupNameField?: string; // Field name for sub-group name (e.g., 'sub_group_value')
  
  // Ordering configuration
  orderField?: string; // Field name for ordering (e.g., 'display_order')
  
  // ID generation configuration
  parentIdPrefix?: string; // Prefix for parent row IDs (default: 'parent_')
  childIdPrefix?: string; // Prefix for child row IDs (default: 'child_')
  childIdField?: string; // Field name for child row ID (e.g., 'vendor_group_criteria_mapper_id')
  
  // Field mapping configuration
  fieldMappings: {
    criteria: string; // Field name for criteria (e.g., 'group_value' or 'sub_group_value')
    requirement?: string; // Field name for requirement (e.g., 'requirement_type')
    category?: string; // Field name for category (e.g., 'group_value')
    status?: string; // Field name for status (e.g., 'selection_status')
    remarks?: string; // Field name for remarks (e.g., 'remarks')
  };
  
  // Custom row creation functions
  createParentRow?: (config: ParentRowConfig) => T;
  createChildRow?: (config: ChildRowConfig) => T;
}

export interface ParentRowConfig {
  id: string;
  sno: number;
  groupId: number;
  groupName: string;
  firstItem: any;
  isSingleItemGroup: boolean;
  globalSno: number;
  groupIndex: number;
}

export interface ChildRowConfig {
  id: string;
  sno: number;
  groupId: number;
  groupName: string;
  item: any;
  itemIndex: number;
  globalSno: number;
}

export interface BaseHierarchicalRow {
  id: string | number;
  sno: number;
  criteria: string;
  requirement?: string;
  category?: string;
  group: number;
  isParent?: boolean;
  order: number;
  status?: any;
  remarks?: string;
}

/**
 * Transforms flat hierarchical data into a structured format with parent-child relationships
 * @param data - Array of data items to transform
 * @param config - Configuration object defining field mappings and behavior
 * @returns Array of transformed hierarchical rows
 */
export function transformHierarchicalData<T extends BaseHierarchicalRow>(
  data: [],
  config: TransformConfig<T>
): T[] {
  const flatData: T[] = [];

  if (!data || !Array.isArray(data)) {
    return flatData;
  }

  // Group the flat data by group_id
  const groupedData = new Map<number, any[]>();
  
  data.forEach((item: any) => {
    const groupId = item[config.groupIdField];
    if (!groupedData.has(groupId)) {
      groupedData.set(groupId, []);
    }
    groupedData.get(groupId)!.push(item);
  });

  let globalSno = NUMBERMAP.ONE;
  let groupIndex = NUMBERMAP.ZERO;

  // Process each group
  groupedData.forEach((items: any[], groupId: number) => {
    // Get unique group information from the first item
    const firstItem = items[NUMBERMAP.ZERO];
    const groupName = firstItem[config.groupNameField];

    // Check if this is a single item group with null sub_group_id
    const isSingleItemGroup = items.length === NUMBERMAP.ONE && 
      (!config.subGroupIdField || items[NUMBERMAP.ZERO][config.subGroupIdField] === null);

    const parentRowConfig: ParentRowConfig = {
      id: `${config.parentIdPrefix || 'parent_'}_${groupId}`,
      sno: groupIndex + NUMBERMAP.ONE,
      groupId,
      groupName,
      firstItem,
      isSingleItemGroup,
      globalSno,
      groupIndex,
    };

    if (isSingleItemGroup) {
      // Add parent row with requirement, status, and remarks populated
      const parentRow = config.createParentRow 
        ? config.createParentRow(parentRowConfig)
        : createDefaultParentRow(parentRowConfig, config, true) as T;
      
      flatData.push(parentRow);
      globalSno++;
    } else {
      // Add parent row for the group (without requirement, status, remarks)
      const parentRow = config.createParentRow 
        ? config.createParentRow(parentRowConfig)
        : createDefaultParentRow(parentRowConfig, config, false) as T;
      
      flatData.push(parentRow);
      globalSno++;

      // Add child rows for criteria items, sorted by display_order
      const sortedItems = config.orderField 
        ? items.toSorted((a, b) => {
            const aOrder = a[config.orderField] ?? 0;
            const bOrder = b[config.orderField] ?? 0;
            return aOrder - bOrder;
          })
        : items;
      
      sortedItems.forEach((item: any, itemIndex: number) => {
        // Generate unique ID for child row
        // Use childIdField if available, otherwise fallback to globalSno for uniqueness
        const childIdValue = item[config.childIdField || 'id'];
        const childId = (childIdValue !== undefined && childIdValue !== null && childIdValue !== '')
          ? `${config.childIdPrefix || 'child_'}_${childIdValue}`
          : `${config.childIdPrefix || 'child_'}_${groupId}_${itemIndex}_${globalSno}`;
        
        const childRowConfig: ChildRowConfig = {
          id: childId,
          sno: globalSno,
          groupId,
          groupName,
          item,
          itemIndex,
          globalSno,
        };

        const childRow = config.createChildRow 
          ? config.createChildRow(childRowConfig)
          : createDefaultChildRow(childRowConfig, config) as T;
        
        flatData.push(childRow);
        globalSno++;
      });
    }

    groupIndex++;
  });

  return flatData;
}

/**
 * Creates a default parent row based on configuration
 */
function createDefaultParentRow(
  config: ParentRowConfig,
  transformConfig: TransformConfig,
  isSingleItemGroup: boolean
): BaseHierarchicalRow {
  const { id, sno, groupId, groupName, firstItem } = config;
  let requirement = '-';
  if (isSingleItemGroup) {
      const reqField = transformConfig?.fieldMappings?.requirement;
      if (reqField) {
        requirement = firstItem[reqField];
      }
  }
      
  const parentRow: any = {
    id,
    sno,
    criteria: groupName,
    requirement: requirement,
    category: groupName,
    group: groupId,
    isParent: true,
    order: NUMBERMAP.ONE,
    status: isSingleItemGroup && transformConfig.fieldMappings.status 
      ? firstItem[transformConfig.fieldMappings.status] 
      : undefined,
    remarks: isSingleItemGroup && transformConfig.fieldMappings.remarks 
      ? firstItem[transformConfig.fieldMappings.remarks] 
      : undefined,
  };

  // Preserve vendor_group_criteria_mapper_id for single-item groups
  if (isSingleItemGroup && firstItem.vendor_group_criteria_mapper_id !== undefined && firstItem.vendor_group_criteria_mapper_id !== null) {
    parentRow.vendor_group_criteria_mapper_id = firstItem.vendor_group_criteria_mapper_id;
  }

  return parentRow;
}

/**
 * Creates a default child row based on configuration
 */
function createDefaultChildRow(
  config: ChildRowConfig,
  transformConfig: TransformConfig
): BaseHierarchicalRow {
  const { id, sno, groupId, groupName, item } = config;
  
  const childRow: any = {
    id,
    sno,
    criteria: transformConfig.subGroupNameField 
      ? item[transformConfig.subGroupNameField] 
      : item[transformConfig.fieldMappings.criteria],
    requirement: transformConfig.fieldMappings.requirement 
      ? item[transformConfig.fieldMappings.requirement] 
      : undefined,
    category: groupName,
    group: groupId,
    isParent: false,
    order: transformConfig.orderField ? item[transformConfig.orderField] : NUMBERMAP.ONE,
    status: transformConfig.fieldMappings.status 
      ? item[transformConfig.fieldMappings.status] 
      : undefined,
    remarks: transformConfig.fieldMappings.remarks 
      ? item[transformConfig.fieldMappings.remarks] 
      : undefined,
  };

  // Preserve vendor_group_criteria_mapper_id if it exists in the item
  if (item.vendor_group_criteria_mapper_id !== undefined && item.vendor_group_criteria_mapper_id !== null) {
    childRow.vendor_group_criteria_mapper_id = item.vendor_group_criteria_mapper_id;
  }

  return childRow;
}
