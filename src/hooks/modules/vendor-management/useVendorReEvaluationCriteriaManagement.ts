/**
 * Classification: Confidential
 * Custom hook for managing vendor re-evaluation criteria operations
 */

import { useState } from 'react';
import { VendorReEvaluationCriteria } from '@/components/modules/vendor-management/vendor-re-evaluation-criteria/VendorReEvaluationCriteriaTable';
import { NUMBERMAP } from '@/constants/common';
import { createReEvaluationChildRow, createReEvaluationParentRow } from '@/lib/modules/vendor-management/vendorReEvaluationCriteriaUtils';

export const useVendorReEvaluationCriteriaManagement = (criteriaData: VendorReEvaluationCriteria[], setCriteriaData: React.Dispatch<React.SetStateAction<VendorReEvaluationCriteria[]>>, handleCriteriaChange: (criteria: VendorReEvaluationCriteria[]) => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<VendorReEvaluationCriteria | null>(null);
  const [editingParentGroup, setEditingParentGroup] = useState<VendorReEvaluationCriteria | null>(null);

  const handleReEvaluationCriteriaReorder = (updatedCriteria: VendorReEvaluationCriteria[]) => {
    // Create a map of original criteria by ID to preserve mapper IDs and vendorGroupId
    const originalCriteriaMap = new Map<string | number, VendorReEvaluationCriteria>();
    criteriaData.forEach(item => {
      originalCriteriaMap.set(item.id, item);
    });

    // Preserve vendorGroupId and group_criteria_mapper_id from original data
    // These fields are critical for determining if records are new or existing
    const preservedCriteria = updatedCriteria.map(updatedItem => {
      const originalItem = originalCriteriaMap.get(updatedItem.id);
      if (originalItem) {
        return {
          ...updatedItem,
          // Preserve vendorGroupId for parent rows (groups) - this identifies existing groups
          vendorGroupId: originalItem.vendorGroupId ?? updatedItem.vendorGroupId,
          // Preserve group_criteria_mapper_id for child rows (criteria) - this identifies existing criteria
          group_criteria_mapper_id: originalItem.group_criteria_mapper_id ?? updatedItem.group_criteria_mapper_id,
          // Preserve criteria_id and criteriaId for child rows
          criteria_id: originalItem.criteria_id ?? updatedItem.criteria_id,
          criteriaId: originalItem.criteriaId ?? updatedItem.criteriaId,
          // Preserve requirementId
          requirementId: originalItem.requirementId ?? updatedItem.requirementId,
          // Preserve display_order if it exists
          display_order: originalItem.display_order ?? updatedItem.display_order,
        };
      }
      return updatedItem;
    });

    setCriteriaData(preservedCriteria);
    handleCriteriaChange(preservedCriteria);
  };

  const handleAddReEvaluationCriteria = () => {
    setSelectedCriteria(null);
    setIsModalOpen(true);
  };

  const handleEditReEvaluationCriteria = (criteria: VendorReEvaluationCriteria) => {
    if (criteria.isParent) {
      setSelectedCriteria(null);
      setEditingParentGroup(criteria);
      setIsModalOpen(true);
    } else {
      setSelectedCriteria(criteria);
      setEditingParentGroup(null);
      setIsModalOpen(true);
    }
  };

  const handleReEvaluationModalClose = () => {
    setIsModalOpen(false);
    setSelectedCriteria(null);
    setEditingParentGroup(null);
  };

  // Helper function to check if a string is empty or invalid
  const isValidGroupId = (groupId: string | undefined | null): boolean => {
    return !!(groupId && groupId !== '' && groupId !== '0');
  };

  // Helper function to get partGroupName for selected criteria
  const getPartGroupNameForSelectedCriteria = (criteria: VendorReEvaluationCriteria): string => {
    const partGroupName = criteria.vendorGroupId ?? '';

    if (isValidGroupId(partGroupName)) {
      return partGroupName;
    }

    const parentRow = criteriaData.find(
      item => item.isParent && item.group === criteria.group
    );

    return parentRow?.vendorGroupId ?? parentRow?.criteria ?? '';
  };

  // Helper function to check if criteriaId is valid
  const hasValidCriteriaId = (criteriaId: string | undefined | null): boolean => {
    return !!(criteriaId && criteriaId !== '');
  };

  // Helper function to check if criteria_id is valid
  const hasValidCriteriaIdSnakeCase = (criteriaId: string | number | undefined | null): boolean => {
    return criteriaId !== undefined && criteriaId !== null && criteriaId !== '';
  };

  // Helper function to extract criteria ID and name from selected criteria
  const getCriteriaIdAndName = (criteria: VendorReEvaluationCriteria): { criteriaId: string; criteriaName: string } => {
    // First check criteriaId (camelCase)
    if (hasValidCriteriaId(criteria.criteriaId)) {
      const criteriaName = (criteria.criteria_id && typeof criteria.criteria_id === 'number' && criteria.criteria)
        ? criteria.criteria
        : '';
      return { criteriaId: criteria.criteriaId ?? '', criteriaName };
    }

    // Then check criteria_id (snake_case)
    if (hasValidCriteriaIdSnakeCase(criteria.criteria_id)) {
      const criteriaId = typeof criteria.criteria_id === 'number'
        ? criteria.criteria_id.toString()
        : String(criteria.criteria_id);
      const criteriaName = (typeof criteria.criteria_id === 'number' && criteria.criteria)
        ? criteria.criteria
        : '';
      return { criteriaId, criteriaName };
    }

    // Fallback to criteria name if no ID is available
    return {
      criteriaId: criteria.criteria ?? '',
      criteriaName: ''
    };
  };

  // Helper function to get requirement value
  const getRequirementValue = (criteria: VendorReEvaluationCriteria): string => {
    return criteria.requirementId ?? criteria.requirement ?? '';
  };

  // Helper function to get status value
  const getStatusValue = (criteria: VendorReEvaluationCriteria): string => {
    return criteria.status ? criteria.status.toString() : '';
  };

  // Helper function to get partGroupName for parent group editing
  const getPartGroupNameForParentGroup = (parentGroup: VendorReEvaluationCriteria): string => {
    if (isValidGroupId(parentGroup.vendorGroupId)) {
      return parentGroup.vendorGroupId ?? '';
    }
    return parentGroup.criteria ?? parentGroup.group.toString();
  };

  const getReEvaluationInitialModalData = (): any => {
    const baseData = { partGroupName: '', criteria: '', requirement: '', status: '' };

    // Early return for selected criteria
    if (selectedCriteria) {
      const partGroupName = getPartGroupNameForSelectedCriteria(selectedCriteria);
      const { criteriaId, criteriaName } = getCriteriaIdAndName(selectedCriteria);
      const requirement = getRequirementValue(selectedCriteria);
      const status = getStatusValue(selectedCriteria);

      const result: any = {
        partGroupName: partGroupName ?? '',
        criteria: criteriaId ?? '',
        requirement,
        status,
      };

      if (criteriaName) {
        result.criteriaName = criteriaName;
      }

      return result;
    }

    // Early return for editing parent group
    if (editingParentGroup) {
      const partGroupName = getPartGroupNameForParentGroup(editingParentGroup);
      const status = getStatusValue(editingParentGroup);
      return { ...baseData, partGroupName, status };
    }

    return baseData;
  };

  const getReEvaluationNextGroupId = () =>
    criteriaData.length > NUMBERMAP.ZERO ? Math.max(...criteriaData.map(item => item.group)) + NUMBERMAP.ONE : NUMBERMAP.ONE;

  const findReEvaluationExistingGroup = (groupName: string) =>
    criteriaData.find(item => item.isParent && item.criteria === groupName);

  const getReEvaluationNextOrderInGroup = (groupId: number) =>
    criteriaData.filter(item => item.group === groupId && !item.isParent).length + NUMBERMAP.ONE;

  const moveReEvaluationCriteriaToExistingGroup = (
    item: VendorReEvaluationCriteria, 
    currentGroupId: number, 
    targetGroupId: number, 
    options: {
      orderMap: Map<string | number, number>;
      maxOrderInTargetGroup: number;
      finalStatusValue: number;
      data: any;
      existingGroup: VendorReEvaluationCriteria;
    }
  ) => {
      const { orderMap, maxOrderInTargetGroup, finalStatusValue, data, existingGroup } = options;
      const newOrder = orderMap.get(item.id) ?? (maxOrderInTargetGroup + NUMBERMAP.ONE);
      const isSelectedItem = item.id === selectedCriteria.id;
      return {
        ...item,
        group: targetGroupId,
        order: newOrder,
        // Update selected criteria with new values
        criteria: isSelectedItem ? (data.criteria ?? item.criteria) : item.criteria,
        requirement: isSelectedItem ? (data.requirement ?? item.requirement) : item.requirement,
        category: isSelectedItem ? (data.partCategory ?? item.category) : item.category,
        status: isSelectedItem ? finalStatusValue : item.status,
        // Preserve all mapper IDs and identifiers
        group_criteria_mapper_id: item.group_criteria_mapper_id,
        criteria_id: item.criteria_id,
        criteriaId: isSelectedItem ? (data.criteriaId ?? item.criteriaId) : item.criteriaId,
        requirementId: isSelectedItem ? (data.requirementId ?? item.requirementId) : item.requirementId,
        vendorGroupId: existingGroup.vendorGroupId ?? item.vendorGroupId,
        display_order: item.display_order,
      };
  }
  const updateReEvaluationExistingCriteria = (data: any) => {
    // Early return if no criteria is selected for re-evaluation
    if (!selectedCriteria) return;

    // Convert status to number, defaulting to ONE if invalid or empty
    const finalStatusValue = data?.status ? Number(data.status) : NUMBERMAP.ONE;
    const newGroupName = data.partGroupName;

    setCriteriaData(prev => {
      // Check if parent group name is being changed and if that name already exists
      const currentGroup = prev.find(item => item.group === selectedCriteria.group && item.isParent);
      const groupNameChanged = newGroupName && currentGroup && currentGroup.criteria !== newGroupName;
      
      if (groupNameChanged) {
        // Check if the new group name already exists (excluding the current group)
        const existingGroup = prev.find(
          item => item.isParent && 
          item.criteria === newGroupName && 
          item.group !== selectedCriteria.group
        );

        if (existingGroup) {
          // Group name already exists - merge all criteria from current group to existing group
          const currentGroupId = selectedCriteria.group;
          const targetGroupId = existingGroup.group;
          
          // Get the maximum order in the target group to append new criteria
          const maxOrderInTargetGroup = prev
            .filter(item => item.group === targetGroupId && !item.isParent)
            .reduce((max, item) => Math.max(max, item.order ?? 0), 0);

          // Collect all child criteria from current group to move, sorted by order
          const criteriaToMove = prev
            .filter(item => item.group === currentGroupId && !item.isParent)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          // Create a map to track new orders for moved criteria
          const orderMap = new Map<string | number, number>();
          criteriaToMove.forEach((item, index) => {
            orderMap.set(item.id, maxOrderInTargetGroup + index + NUMBERMAP.ONE);
          });

          const updatedCriteria = prev
            .map(item => {
              // Skip the current parent group - it will be removed
              if (item.group === currentGroupId && item.isParent) {
                return null; // Mark for removal
              }
              if (item.group === currentGroupId && !item.isParent) {
                return moveReEvaluationCriteriaToExistingGroup(item, currentGroupId, targetGroupId, {
                  orderMap,
                  maxOrderInTargetGroup,
                  finalStatusValue,
                  data,
                  existingGroup,
                });
              }
              // Move all child criteria from current group to existing group
              // Keep other items unchanged
              return item;
            })
            .filter((item): item is VendorReEvaluationCriteria => item !== null); // Remove deleted group
          
          handleCriteriaChange(updatedCriteria);
          
          // Update selectedCriteria reference
          const updatedItem = updatedCriteria.find(item => item.id === selectedCriteria.id);
          if (updatedItem) {
            setSelectedCriteria(updatedItem);
          }
          
          return updatedCriteria;
        }
      }

      // Normal update - group name doesn't exist or hasn't changed
      const updatedCriteria = prev.map(item => {
        // Update the selected re-evaluation criteria item
        if (item.id === selectedCriteria.id) {
          return {
            ...item,
            criteria: data.criteria,
            requirement: data.requirement ?? '-',
            category: data.partCategory,
            status: finalStatusValue,
            // Preserve mapper IDs and identifiers to ensure update instead of create
            group_criteria_mapper_id: item.group_criteria_mapper_id,
            criteria_id: item.criteria_id,
            criteriaId: data.criteriaId ?? item.criteriaId,
            requirementId: data.requirementId ?? item.requirementId,
            vendorGroupId: item.vendorGroupId,
            display_order: item.display_order,
          };
        }
        // Update parent group if it matches the selected criteria's group for re-evaluation
        if (item.group === selectedCriteria.group && item.isParent) {
          return {
            ...item,
            criteria: newGroupName ?? item.criteria,
            // Preserve vendorGroupId to ensure update instead of create
            vendorGroupId: item.vendorGroupId,
            // Preserve group_mapper_id if it exists (from previously saved groups)
            group_mapper_id: item.group_mapper_id ?? null,
          };
        }
        // Keep other items unchanged
        return item;
      });
      handleCriteriaChange(updatedCriteria);
      
      // Update selectedCriteria reference with new status from updated criteria
      const updatedItem = updatedCriteria.find(item => item.id === selectedCriteria.id);
      if (updatedItem) {
        setSelectedCriteria(updatedItem);
      }
      
      return updatedCriteria;
    });
  };

  const addReEvaluationToExistingGroup = (data: any, existingGroup: VendorReEvaluationCriteria) => {
    const childRow = createReEvaluationChildRow(data, existingGroup.group, getReEvaluationNextOrderInGroup(existingGroup.group));
    setCriteriaData(prev => {
      const updatedCriteria = [...prev, childRow]
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    });
  };

  const createReEvaluationNewGroup = (data: any) => {
    const newGroupId = getReEvaluationNextGroupId();
    const parentRow = createReEvaluationParentRow(data, newGroupId);
    const childRow = createReEvaluationChildRow(data, newGroupId, NUMBERMAP.ONE);
    setCriteriaData(prev => {
      const updatedCriteria = [...prev, parentRow, childRow]
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    });
  };

  const updateReEvaluationParentGroup = (data: any) => {
    // Early return if no parent group is being edited
    if (!editingParentGroup) return;

    // Convert status to number, defaulting to ONE if invalid or empty
    const finalStatusValue = data?.status ? Number(data.status) : NUMBERMAP.ONE;
    const newGroupName = data.partGroupName ?? editingParentGroup.criteria;

    // Check if the new group name already exists (excluding the current group being edited)
    const existingGroup = criteriaData.find(
      item => item.isParent && 
      item.criteria === newGroupName && 
      item.group !== editingParentGroup.group
    );

    // If duplicate group name exists, don't update - validation should have prevented this
    // But if it somehow gets here, just return without updating
    if (existingGroup) {
      // Validation should have caught this, but as a safety measure, don't proceed
      return;
    }

    // Group name doesn't exist - update the group normally
    setCriteriaData(prev => {
      let updatedCriteria = prev.map(item => {
        // Update the parent group being edited
        if (item.group === editingParentGroup.group && item.isParent) {
          return {
            ...item,
            criteria: newGroupName,
            status: finalStatusValue,
            // Preserve vendorGroupId to ensure update instead of create
            vendorGroupId: data.vendorGroupId ?? item.vendorGroupId,
            // Preserve group_mapper_id if it exists (from previously saved groups)
            group_mapper_id: item.group_mapper_id ?? null,
          };
        }
        // Also update all child rows in this group to use the new vendorGroupId if provided
        if (item.group === editingParentGroup.group && !item.isParent && data.vendorGroupId) {
          return {
            ...item,
            vendorGroupId: data.vendorGroupId,
          };
        }
        // Keep other items unchanged
        return item;
      });
      
      // Check if criteria data is provided - if so, add a new criteria to this group
      if (data.criteria && data.criteria.trim() !== '') {
        const newOrder = getReEvaluationNextOrderInGroup(editingParentGroup.group);
        const childRow = createReEvaluationChildRow(data, editingParentGroup.group, newOrder);
        updatedCriteria = [...updatedCriteria, childRow];
      }
      
      handleCriteriaChange(updatedCriteria);
      return updatedCriteria;
    });
  };

  const handleReEvaluationModalSave = async (data: any) => {
    if (selectedCriteria) {
      updateReEvaluationExistingCriteria(data);
    } else if (editingParentGroup) {
      updateReEvaluationParentGroup(data);
    } else {
      const existingGroup = findReEvaluationExistingGroup(data.partGroupName);
      if (existingGroup) {
        addReEvaluationToExistingGroup(data, existingGroup);
      } else {
        createReEvaluationNewGroup(data);
      }
    }
  };

  const deleteReEvaluationGroup = (groupToDelete: number) => {
    setCriteriaData(prev => {
      const updatedCriteria = prev.map(item =>
        item.group === groupToDelete
          ? { ...item, status: NUMBERMAP.TWO }
          : item
      )
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    });
  };

  const deleteReEvaluationChildItem = (itemId: number | string) => {
    setCriteriaData(prev => {
      const updatedCriteria = prev.map(item =>
        item.id === itemId
          ? { ...item, status: NUMBERMAP.TWO }
          : item
      )
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    });
  };

  const handleDeleteReEvaluationCriteria = (id: number | string) => {
    const itemToDelete = criteriaData.find(item => item.id === id);

    if (!itemToDelete) return;

    if (itemToDelete.isParent) {
      deleteReEvaluationGroup(itemToDelete.group);
    } else {
      deleteReEvaluationChildItem(id);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedCriteria,
    setSelectedCriteria,
    editingParentGroup,
    setEditingParentGroup,
    handleReEvaluationCriteriaReorder,
    handleAddReEvaluationCriteria,
    handleEditReEvaluationCriteria,
    handleReEvaluationModalClose,
    getReEvaluationInitialModalData,
    handleReEvaluationModalSave,
    handleDeleteReEvaluationCriteria,
  };
};

