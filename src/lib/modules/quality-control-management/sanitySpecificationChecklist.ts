/**
 * Classification: Confidential
 * Utility functions for Sanity Specification Checklist
 */

import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types'
import { NUMBERMAP } from '@/constants/common'
import { NestedTransformConfig } from '@/lib/modules/vendor-management/transformNestedHierarchicalData'
import {
  ReorderDataItem,
  TransformReorderDataPayload,
} from '@/types/modules/quality-control-management/sanitySpecificationChecklist'

/**
 * Type alias for specification detail ID that can be a number, string, or undefined
 */
type StatusId = number | string | undefined

/**
 * Validates and normalizes status_id to be 1 or 2, defaulting to 1 if invalid
 */
const normalizeStatusId = (
  statusId: number | string | undefined | null
): number => {
  const numStatusId = typeof statusId === 'string' ? Number(statusId) : statusId
  if (numStatusId === NUMBERMAP.ONE || numStatusId === NUMBERMAP.TWO) {
    return numStatusId
  }
  return NUMBERMAP.ONE // Default to 1 if
}

// Helper function to generate unique ID for new specifications
const generateUniqueId = (): string => {
  return crypto.randomUUID()
}

/**
 * ReorderDataItem represents the nested structure from the API
 * Groups with their specification_details arrays
 * Type is now imported from @/types/modules/qc/sanitySpecificationChecklist
 */

/**
 * Builds a map from group names to their IDs (group_id and applicable_group_id)
 */
function buildGroupNameToIdMap(
  existingSpecificationData: ReorderDataItem[],
  transformConfig: NestedTransformConfig
): Map<string, { groupId?: number; applicableGroupId?: number }> {
  const groupNameToIdMap = new Map<
    string,
    { groupId?: number; applicableGroupId?: number }
  >()

  for (const group of existingSpecificationData) {
    const groupName = group[
      transformConfig.groupNameField as keyof ReorderDataItem
    ] as string
    if (!groupName) continue

    const groupId = group[
      transformConfig.groupIdField as keyof ReorderDataItem
    ] as number | undefined
    const applicableGroupId = group.applicable_group_id

    groupNameToIdMap.set(groupName, {
      groupId:
        groupId != null && groupId !== NUMBERMAP.ZERO ? groupId : undefined,
      applicableGroupId:
        applicableGroupId != null && applicableGroupId !== NUMBERMAP.ZERO
          ? applicableGroupId
          : undefined,
    })
  }

  return groupNameToIdMap
}

/**
 * Builds a map from specification_detail_id to status_id
 */
function buildStatusIdMap(
  existingSpecificationData: ReorderDataItem[]
): Map<StatusId, number> {
  const statusIdMap = new Map<StatusId, number>()

  for (const group of existingSpecificationData) {
    if (!group.specification_details) continue

    for (const detail of group.specification_details) {
      if (detail.specification_detail_id != null) {
        statusIdMap.set(
          detail.specification_detail_id,
          detail.status_id ?? NUMBERMAP.ONE
        )
      }
    }
  }

  return statusIdMap
}

/**
 * Extracts group name from a VendorCriteria item
 */
function getGroupName(
  item: VendorCriteria,
  transformConfig: NestedTransformConfig,
  isParent: boolean
): string {
  if (isParent) {
    return (
      item.criteria ??
      item.category ??
      (item[
        transformConfig.fieldMappings.category as keyof VendorCriteria
      ] as string) ??
      ''
    )
  }
  return (
    item.category ??
    (item[
      transformConfig.fieldMappings.category as keyof VendorCriteria
    ] as string) ??
    ''
  )
}

/**
 * Normalizes an ID value: returns undefined if 0, otherwise returns the value
 */
function normalizeId(id: number | undefined | null): number | undefined {
  return id != null && id !== NUMBERMAP.ZERO ? id : undefined
}

/**
 * Creates a new group object
 */
function createGroup(
  groupName: string,
  groupDisplayOrder: number,
  originalGroupId?: number,
  originalApplicableGroupId?: number
): ReorderDataItem {
  return {
    applicable_group_id: normalizeId(originalApplicableGroupId),
    group_id: normalizeId(originalGroupId),
    group_value: groupName,
    applicable_group_display_order: groupDisplayOrder,
    specification_details: [],
  }
}

/**
 * Gets and normalizes status value from item or statusIdMap
 */
function getStatusValue(
  item: VendorCriteria,
  specificationDetailId: StatusId,
  statusIdMap: Map<StatusId, number>
): number {
  const rawStatusValue =
    (item.status_id ? Number(item.status_id) : undefined) ??
    (specificationDetailId != null
      ? statusIdMap.get(specificationDetailId)
      : undefined) ??
    NUMBERMAP.ONE

  return rawStatusValue === NUMBERMAP.ONE || rawStatusValue === NUMBERMAP.TWO
    ? rawStatusValue
    : NUMBERMAP.ONE
}

/**
 * Creates a specification detail object
 */
function createSpecificationDetail(
  specificationDetailId: StatusId,
  statusValue: number,
  specificationText: string,
  specificationDisplayOrder: number
) {
  return {
    specification_detail_id: specificationDetailId,
    status_id: statusValue,
    status_name: '',
    specification: specificationText,
    specification_display_order: specificationDisplayOrder,
  }
}

/**
 * Processes a parent item and adds it to groupsMap if not already present
 */
function processParentItem(
  item: VendorCriteria,
  groupsMap: Map<number, ReorderDataItem>,
  groupNameToIdMap: Map<
    string,
    { groupId?: number; applicableGroupId?: number }
  >,
  transformConfig: NestedTransformConfig
): void {
  const groupName = getGroupName(item, transformConfig, true)
  const groupDisplayOrder = item.group ?? NUMBERMAP.ZERO

  if (groupsMap.has(groupDisplayOrder)) return

  const originalGroupId =
    groupNameToIdMap.get(groupName)?.groupId ??
    (item )[transformConfig.groupIdField] ??
    NUMBERMAP.ZERO
  const originalApplicableGroupId =
    groupNameToIdMap.get(groupName)?.applicableGroupId ??
    (item ).applicable_group_id ??
    NUMBERMAP.ZERO

  groupsMap.set(
    groupDisplayOrder,
    createGroup(
      groupName,
      groupDisplayOrder,
      originalGroupId,
      originalApplicableGroupId
    )
  )
}

/**
 * Processes a child item and adds it to the appropriate group's specification_details
 */
function processChildItem(
  item: VendorCriteria,
  groupsMap: Map<number, ReorderDataItem>,
  groupNameToIdMap: Map<
    string,
    { groupId?: number; applicableGroupId?: number }
  >,
  statusIdMap: Map<StatusId, number>,
  transformConfig: NestedTransformConfig
): void {
  const groupDisplayOrder = item.group ?? NUMBERMAP.ZERO
  const groupName = getGroupName(item, transformConfig, false)

  let group = groupsMap.get(groupDisplayOrder)

  if (!group) {
    const originalGroupId =
      groupNameToIdMap.get(groupName)?.groupId ?? groupDisplayOrder
    const originalApplicableGroupId =
      groupNameToIdMap.get(groupName)?.applicableGroupId
    group = createGroup(
      groupName,
      groupDisplayOrder,
      originalGroupId,
      originalApplicableGroupId
    )
    groupsMap.set(groupDisplayOrder, group)
  }

  const specificationDetailId = item.group_criteria_mapper_id
  const statusValue = getStatusValue(item, specificationDetailId, statusIdMap)
  const specificationDisplayOrder =
    item.order ?? item.display_order ?? NUMBERMAP.ZERO
  const specificationText =
    item.criteria ??
    (item[
      transformConfig.fieldMappings.criteria as keyof VendorCriteria
    ] as string) ??
    ''

  const specificationDetail = createSpecificationDetail(
    specificationDetailId,
    statusValue,
    specificationText,
    specificationDisplayOrder
  )

  group.specification_details.push(specificationDetail)
}

/**
 * Sorts specification_details within each group and returns sorted array of groups
 */
function sortGroupsAndDetails(
  groupsMap: Map<number, ReorderDataItem>
): ReorderDataItem[] {
  for (const group of groupsMap.values()) {
    group.specification_details.sort((a, b) => {
      const orderA = a.specification_display_order ?? NUMBERMAP.ZERO
      const orderB = b.specification_display_order ?? NUMBERMAP.ZERO
      return orderA - orderB
    })
  }

  return Array.from(groupsMap.values()).sort((a, b) => {
    const orderA = a.applicable_group_display_order ?? NUMBERMAP.ZERO
    const orderB = b.applicable_group_display_order ?? NUMBERMAP.ZERO
    return orderA - orderB
  })
}

/**
 * Transform flat array from onCriteriaReorder to nested ReorderDataItem[] structure
 * Uses the same transformConfig pattern as transformNestedHierarchicalData for consistency
 * @param flatArray - Flat array of VendorCriteria from the table
 * @param existingSpecificationData - Existing nested ReorderDataItem[] structure to preserve IDs
 * @param transformConfig - Configuration for field mappings
 * @returns Nested ReorderDataItem[] structure
 */
export function transformFlatToNested(
  flatArray: VendorCriteria[],
  existingSpecificationData: ReorderDataItem[],
  transformConfig: NestedTransformConfig
): ReorderDataItem[] {
  const groupsMap = new Map<number, ReorderDataItem>()
  const groupNameToIdMap = buildGroupNameToIdMap(
    existingSpecificationData,
    transformConfig
  )
  const statusIdMap = buildStatusIdMap(existingSpecificationData)

  for (const item of flatArray) {
    if (item.isParent) {
      processParentItem(item, groupsMap, groupNameToIdMap, transformConfig)
    } else {
      processChildItem(
        item,
        groupsMap,
        groupNameToIdMap,
        statusIdMap,
        transformConfig
      )
    }
  }

  return sortGroupsAndDetails(groupsMap)
}

/**
 * Transforms ReorderDataItem[] to the payload format required by the API
 * Handles is_new_group logic: only the first specification in a new group should have is_new_group: "true"
 * Subsequent specifications with the same group name should have is_new_group: "false"
 */
export function transformReorderDataToPayloadWithRenaming(
  reorderData: ReorderDataItem[],
  purchaseOrderId: string | number
): TransformReorderDataPayload {
  // Transform to flat array
  const transformedSpecifications: Array<{
    specification_detail_id: string
    group_id: string
    group_name: string
    is_new_group: true | false
    applicable_group_id: string
    applicable_group_display_order: number
    specification: string
    status_id: number
    specification_display_order: number
  }> = []

  reorderData.forEach((group) => {
    const groupName = group.group_value ?? ''
    // Check if group_id exists, is not zero, and is a number (not a UUID string)
    const hasGroupId =
      group.group_id != null &&
      group.group_id !== NUMBERMAP.ZERO &&
      typeof group.group_id === 'number'
    // Check if applicable_group_id exists, is not zero, and is a number (not a UUID string)

    // Only pass group_id if it's a number, otherwise use empty string
    const groupId = hasGroupId ? String(group.group_id) : ''
    // Only pass applicable_group_id if it's a number, otherwise use empty string
    const applicableGroupId = group.applicable_group_id
      ? String(group.applicable_group_id)
      : ''

    // Check if this is a new group (no numeric group_id)
    const isNewGroup = !hasGroupId

    group.specification_details.forEach((detail, detailIndex) => {
      // Check if specification_detail_id is a number (from API) - crypto UUID strings should be "" in payload
      const hasSpecificationDetailId =
        detail.specification_detail_id != null &&
        detail.specification_detail_id !== NUMBERMAP.ZERO &&
        typeof detail.specification_detail_id === 'number'
      // If it's a number (from API), use it. If it's a string (crypto UUID) or undefined, use "" for payload
      const specificationDetailId = hasSpecificationDetailId
        ? String(detail.specification_detail_id)
        : ''

      // specification_display_order starts from 1 for each group
      const specificationDisplayOrder = detailIndex + NUMBERMAP.ONE

      // Validate and normalize status_id to be 1 or 2, defaulting to 1
      const statusId = normalizeStatusId(detail.status_id)

      // is_new_group: true only for the first item in specification_details array when it's a new group
      // For existing groups or subsequent items in new groups, set to false
      const isNewGroupFlag = isNewGroup && detailIndex === NUMBERMAP.ZERO

      transformedSpecifications.push({
        specification_detail_id: specificationDetailId,
        group_id: groupId,
        group_name: groupName,
        is_new_group: isNewGroupFlag,
        applicable_group_id: applicableGroupId,
        applicable_group_display_order: group.applicable_group_display_order,
        specification: detail.specification ?? '',
        status_id: statusId,
        specification_display_order: specificationDisplayOrder,
      })
    })
  })

  return {
    purchase_order_id: purchaseOrderId,
    specification: transformedSpecifications,
  }
}

export function addSpecificationToGroup(
  updatedSpecificationData: ReorderDataItem[],
  modalData,
  ParentId: number | string,
  editingSpecification?: VendorCriteria | null
): ReorderDataItem[] {
  // Helper function to compare group IDs (handles both numeric and string UUIDs)
  const compareGroupId = (
    groupGroupId: StatusId, targetId: StatusId
  ): boolean => {
    if (groupGroupId == null || targetId == null) return false
    if (groupGroupId === null && targetId === null) return false
    return String(groupGroupId)?.toLowerCase()?.trim() === String(targetId)?.toLowerCase()?.trim()
  }
  
  // Helper function to normalize group ID (numeric or UUID string)
  const normalizeGroupId = (id): number | string => {
    const numId = Number(id)
    const isValidNumeric = !isNaN(numId) && numId > NUMBERMAP.ZERO
    const isValidString = typeof id === 'string' && id.trim() !== ''
    
    if (isValidNumeric) return numId
    if (isValidString) return id
    return generateUniqueId()
  }

  // Helper function to get old group ID from editing specification
  const getOldGroupId = (): number | string => {
    const vendorGroupId = editingSpecification?.vendorGroupId ?? ''
    const numId = Number(vendorGroupId)
    return (!isNaN(numId) && numId > NUMBERMAP.ZERO) ? numId : vendorGroupId
  }

  // Helper function to check if group changed
  const hasGroupChanged = (oldId: number | string): boolean => {
    if (oldId == null || ParentId == null) return false
    if (oldId === NUMBERMAP.ZERO && ParentId === NUMBERMAP.ZERO.toString()) return false
    return String(oldId) !== String(ParentId)
  }

  // Helper function to get max display order from specification details
  const getMaxDisplayOrder = (details: { specification_display_order?: number }[]): number => {
    if (details.length === NUMBERMAP.ZERO) return NUMBERMAP.ZERO
    return Math.max(...details.map((d) => d.specification_display_order ?? NUMBERMAP.ZERO))
  }
  let group: ReorderDataItem | undefined
  if(ParentId?.group_value) {
    group = updatedSpecificationData.find((g) => compareGroupId(g.group_value, ParentId?.group_value ?? ''))
  }else{
    group = updatedSpecificationData.find((g) => compareGroupId(g.group_id, ParentId))
  }
  const maxGroupDisplayOrder = updatedSpecificationData?.length ?? NUMBERMAP.ZERO

  // Helper function to get specification detail ID from editingSpecification
  const getSpecificationDetailId = (): StatusId => {
    if (!editingSpecification?.isParent) {
      return editingSpecification?.group_criteria_mapper_id ?? editingSpecification?.sub_group_id
    }
    return undefined
  }

  // Helper function to normalize specification_detail_id
  const normalizeSpecificationDetailId = (id: StatusId): number | string => {
    if (id != null && id !== NUMBERMAP.ZERO) {
      return typeof id === 'string' ? id : Number(id)
    }
    return generateUniqueId()
  }

  // Helper function to create specification detail object
  const createSpecificationDetail = (
    specificationDetailId: StatusId,
    displayOrder: number
  ) => ({
    specification_detail_id: normalizeSpecificationDetailId(specificationDetailId),
    status_id: normalizeStatusId(modalData.status_id),
    status_name: '',
    specification: modalData.specification,
    specification_display_order: displayOrder,
  })

  // Helper function to remove specification from old group
  const removeFromOldGroup = (oldGroupId: number | string, specificationDetailId: StatusId): void => {
    const oldGroup = updatedSpecificationData.find((g) => compareGroupId(g.group_id, oldGroupId))
    if (!oldGroup || specificationDetailId == null) return
    
    oldGroup.specification_details = oldGroup.specification_details.filter(
      (d) => d.specification_detail_id !== specificationDetailId
    )
  }

  // Helper function to find or create target group
  const findOrCreateTargetGroup = (): ReorderDataItem => {
    let targetGroup = updatedSpecificationData.find((g) => compareGroupId(g.group_id, ParentId))
    
    if (!targetGroup) {
      targetGroup = {
        group_id: ParentId,
        group_value: modalData.group_name,
        applicable_group_id: undefined,
        applicable_group_display_order: maxGroupDisplayOrder + NUMBERMAP.ONE,
        specification_details: [],
      }
      updatedSpecificationData.push(targetGroup)
    }
    
    return targetGroup
  }

  // Helper function to update existing specification detail
  const updateExistingSpecification = (
    targetGroup: ReorderDataItem,
    specificationDetailId: StatusId
  ): boolean => {
    const detailIndex = targetGroup.specification_details.findIndex(
      (d) => d.specification_detail_id === specificationDetailId
    )
    
    if (detailIndex === -NUMBERMAP.ONE) return false
    
    targetGroup.specification_details[detailIndex] = {
      ...targetGroup.specification_details[detailIndex],
      specification: modalData.specification,
      status_id: normalizeStatusId(modalData.status_id),
    }
    return true
  }

  // Helper function to add new specification to target group
  const addNewSpecificationToGroup = (
    targetGroup: ReorderDataItem,
    specificationDetailId: StatusId
  ): void => {
    const maxOrder = getMaxDisplayOrder(targetGroup.specification_details)
    targetGroup.specification_details.push(
      createSpecificationDetail(specificationDetailId, maxOrder + NUMBERMAP.ONE)
    )
  }

  // Handle editing existing child specification
  const isEditingChild = editingSpecification && !editingSpecification.isParent
  if (isEditingChild) {
    const specificationDetailId = getSpecificationDetailId()
    const oldGroupId = getOldGroupId()
    const groupChanged = hasGroupChanged(oldGroupId)

    if (groupChanged) {
      removeFromOldGroup(oldGroupId, specificationDetailId)
    }

    const targetGroup = findOrCreateTargetGroup()
    const wasUpdated = updateExistingSpecification(targetGroup, specificationDetailId)
    
    if (!wasUpdated) {
      addNewSpecificationToGroup(targetGroup, specificationDetailId)
    }

    return updatedSpecificationData
  }

  // Handle new specification or editing parent
  const specificationDetailId = getSpecificationDetailId() ?? generateUniqueId()

  if (group) {
    const maxOrder = getMaxDisplayOrder(group.specification_details)
    group.specification_details.push(
      createSpecificationDetail(specificationDetailId, maxOrder + NUMBERMAP.ONE)
    )
    return updatedSpecificationData
  }

  // Create new group
  const newGroupId = normalizeGroupId(ParentId)
  const newGroup: ReorderDataItem = {
    group_id: newGroupId ,
    group_value: modalData.group_name,
    applicable_group_id: undefined,
    applicable_group_display_order: maxGroupDisplayOrder + NUMBERMAP.ONE,
    specification_details: [
      createSpecificationDetail(specificationDetailId, NUMBERMAP.ONE),
    ],
  }
  updatedSpecificationData.push(newGroup)

  return updatedSpecificationData
}
