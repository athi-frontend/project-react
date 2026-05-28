/**
 * Classification: Confidential
 * Custom hook for managing vendor selection criteria operations
 */

import { useState } from 'react';
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable';
import { NUMBERMAP } from '@/constants/common';
import { createChildRow, createParentRow } from '@/lib/modules/vendor-management/vendorSelectionCriteriaUtils';

export const useVendorSelectionCriteriaManagement = (criteriaData: VendorCriteria[], setCriteriaData: React.Dispatch<React.SetStateAction<VendorCriteria[]>>, handleCriteriaChange: (criteria: VendorCriteria[]) => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<VendorCriteria | null>(null);
  const [editingParentGroup, setEditingParentGroup] = useState<VendorCriteria | null>(null);

  const handleCriteriaReorder = (updatedCriteria: VendorCriteria[]) => {
    setCriteriaData(updatedCriteria);
    handleCriteriaChange(updatedCriteria);
  };

  const handleAddCriteria = () => {
    setSelectedCriteria(null);
    setIsModalOpen(true);
  };

  const handleEditCriteria = (criteria: VendorCriteria) => {
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCriteria(null);
    setEditingParentGroup(null);
  };

  const getInitialModalData = (): any => {
    const baseData = { partGroupName: '', criteria: '', requirement: '', status: '' };
    
    if (selectedCriteria) {
      return {
        partGroupName: selectedCriteria.vendorGroupId ?? '',
        criteria: selectedCriteria.criteriaId ?? '',
        requirement: selectedCriteria.requirementId ?? selectedCriteria.requirement,
        status: selectedCriteria.statusId ?? selectedCriteria.status?.toString() ?? '',
      };
    }
    
    if (editingParentGroup) {
      return { ...baseData, partGroupName: editingParentGroup.vendorGroupId ?? editingParentGroup.group.toString() };
    }
    
    return baseData;
  };

  const getNextGroupId = () => 
    criteriaData.length > NUMBERMAP.ZERO ? Math.max(...criteriaData.map(item => item.group)) + NUMBERMAP.ONE : NUMBERMAP.ONE;

  const findExistingGroup = (groupName: string) => 
    criteriaData.find(item => item.isParent && item.criteria === groupName);

  const getNextOrderInGroup = (groupId: number) => 
    criteriaData.filter(item => item.group === groupId && !item.isParent).length + NUMBERMAP.ONE;

  const updateExistingCriteria = (data: any) => {
    if (!selectedCriteria) return;
    
    setCriteriaData(prev => prev.map(item => {
      if (item.id === selectedCriteria.id) {
        // Convert statusId to number if it's a string
        let statusValue = item.status;
        if (data.statusId) {
          statusValue = typeof data.statusId === 'string' ? Number(data.statusId) : data.statusId;
        }
        return { 
          ...item, 
          criteria: data.criteria, 
          requirement: data.requirement ?? '-', 
          category: data.partCategory, 
          status: statusValue,
          vendorGroupId: data.vendorGroupId ?? item.vendorGroupId,
          criteriaId: data.criteriaId ?? item.criteriaId,
          requirementId: data.requirementId ?? item.requirementId,
          statusId: data.statusId ?? item.statusId,
        };
      }
      if (item.group === selectedCriteria.group && item.isParent) {
        return { 
          ...item, 
          criteria: data.partGroupName ?? item.criteria,
          vendorGroupId: data.vendorGroupId ?? item.vendorGroupId,
        };
      }
      return item;
    }));
  };

  const updateParentGroup = (data: any) => {
    if (!editingParentGroup) return;
    
    setCriteriaData(prev => prev.map(item => {
      if (item.group === editingParentGroup.group && item.isParent) {
        return { 
          ...item, 
          criteria: data.partGroupName ?? item.criteria,
          vendorGroupId: data.vendorGroupId ?? item.vendorGroupId,
        };
      }
      // Also update all child rows in this group to use the new vendorGroupId
      if (item.group === editingParentGroup.group && !item.isParent) {
        return {
          ...item,
          vendorGroupId: data.vendorGroupId ?? item.vendorGroupId,
        };
      }
      return item;
    }));
  };

  const addToExistingGroup = (data: any, existingGroup: VendorCriteria) => {
    // Use existing group's vendorGroupId if available, otherwise use the one from data
    const groupData = {
      ...data,
      vendorGroupId: existingGroup.vendorGroupId ?? data.vendorGroupId,
    };
    const childRow = createChildRow(groupData, existingGroup.group, getNextOrderInGroup(existingGroup.group));
    setCriteriaData(prev => {
      const updatedCriteria = [...prev, childRow]
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    });
  };

  const createNewGroup = (data: any) => {
    const newGroupId = getNextGroupId();
    // Ensure parent row has vendorGroupId from data
    const parentData = {
      ...data,
      vendorGroupId: data.vendorGroupId ?? '',
    };
    const parentRow = createParentRow(parentData, newGroupId);
    const childRow = createChildRow(data, newGroupId, NUMBERMAP.ONE);
    setCriteriaData(prev => {
      const updatedCriteria = [...prev, parentRow, childRow]
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    });
  };

  const handleModalSave = async (data: any) => {
    if (selectedCriteria) {
      updateExistingCriteria(data);
    } else if (editingParentGroup) {
      updateParentGroup(data);
    } else {
      const existingGroup = findExistingGroup(data.partGroupName);
      if (existingGroup) {
        addToExistingGroup(data, existingGroup);
      } else {
        createNewGroup(data);
      }
    }
  };

  const deleteGroup = (groupToDelete: number) => {
    setCriteriaData(prev =>   
      {const updatedCriteria = prev.map(item =>  
        item.group === groupToDelete 
          ? { ...item, status: NUMBERMAP.TWO }
          : item
      )
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    }
    );
  };

  const deleteChildItem = (itemId: number) => {
    setCriteriaData(prev => 
      {const updatedCriteria = prev.map(item =>  
        item.id === itemId 
          ? { ...item, status: NUMBERMAP.TWO }
          : item
      )
      handleCriteriaChange(updatedCriteria)
      return updatedCriteria
    }
    );
  };

  const handleDeleteCriteria = (id: number, showActionAlert?: (status: string) => Promise<{ isConfirmed: boolean }>) => {
    const itemToDelete = criteriaData.find(item => item.id === id);
    
    // If showActionAlert is provided, show alert first (for standalone usage)
    // Otherwise, directly delete (when called from page component that already showed alert)
    if (showActionAlert) {
      showActionAlert('delete').then((result: { isConfirmed: boolean }) => {
        if (!result.isConfirmed) return;
        performDelete(id, itemToDelete);
      });
    } else {
      performDelete(id, itemToDelete);
    }
  };

  const performDelete = (id: number, itemToDelete: VendorCriteria | undefined) => {
    if (itemToDelete?.isParent) {
      deleteGroup(itemToDelete.group);
    } else {
      deleteChildItem(id);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedCriteria,
    setSelectedCriteria,
    editingParentGroup,
    setEditingParentGroup,
    handleCriteriaReorder,
    handleAddCriteria,
    handleEditCriteria,
    handleModalClose,
    getInitialModalData,
    handleModalSave,
    handleDeleteCriteria,
  };
};

