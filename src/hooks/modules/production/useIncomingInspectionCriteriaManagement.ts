/**
 * Classification: Confidential
 * Custom hook for managing incoming inspection criteria operations
 */

import { useState } from 'react';
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types';
import { NUMBERMAP } from '@/constants/common';
import { createChildRow, createParentRow } from '@/lib/modules/vendor-management/vendorSelectionCriteriaUtils';

export const useIncomingInspectionCriteriaManagement = (
  criteriaData: VendorCriteria[], 
  setCriteriaData: React.Dispatch<React.SetStateAction<VendorCriteria[]>>, 
  handleCriteriaChange?: (criteria: VendorCriteria[]) => void
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<VendorCriteria | null>(null);
  const [editingParentGroup, setEditingParentGroup] = useState<VendorCriteria | null>(null);

  const handleCriteriaReorder = (updatedCriteria: VendorCriteria[]) => {
    setCriteriaData(updatedCriteria);
    handleCriteriaChange?.(updatedCriteria);
  };

  const handleAddIncommingCriteria = () => {
    setSelectedCriteria(null);
    setIsModalOpen(true);
  };

  const handleEditIncommingCriteria = (criteria: VendorCriteria) => {
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

  const handleIncomingModalClose = () => {
    setIsModalOpen(false);
    setSelectedCriteria(null);
    setEditingParentGroup(null);
  };

  const getInitialIncomingModalData = (): any => {
    const baseData = { inspectionGroupName: '', criteria: '', status: '' };
    
    if (selectedCriteria) {
      const mapperId = selectedCriteria.group_criteria_mapper_id ?? selectedCriteria.sub_group_id ?? selectedCriteria.id
      return {
        inspectionGroupName: selectedCriteria.vendorGroupId ?? '',
        criteria: selectedCriteria.criteriaId ?? '',
        status: selectedCriteria.statusId ?? selectedCriteria.status?.toString() ?? '',
        criteria_mapper_id: mapperId ?? "",
      };
    }
    
    if (editingParentGroup) {
      return { 
        inspectionGroupName: editingParentGroup.vendorGroupId ?? editingParentGroup.group.toString(),
        criteria: '',
        status: '',
      };
    }
    
    return baseData;
  };

  const getNextGroupId = () => 
    criteriaData.length > NUMBERMAP.ZERO ? Math.max(...criteriaData.map(item => item.group)) + NUMBERMAP.ONE : NUMBERMAP.ONE;

  const findExistingGroup = (groupName: string) => 
    criteriaData.find(item => item.isParent && (item.criteria === groupName || item.inspectionGroupLabel === groupName));

  const getNextOrderInGroup = (groupId: number) => 
    criteriaData.filter(item => item.group === groupId && !item.isParent).length + NUMBERMAP.ONE;

  const updateExistingCriteria = (data: any) => {
    if (!selectedCriteria) return;
    
    const groupName = data.inspectionGroupName;
    const criteriaValue = data.criteriaLabel ?? data.criteria;
    const groupLabel = data.inspectionGroupLabel ?? data.inspectionGroupName;
    
    setCriteriaData(prev => prev.map(item => {
      if (item.id === selectedCriteria.id) {
        let statusValue = item.status;
        if (data.status) {
          statusValue = typeof data.status === 'string' ? Number(data.status) : data.status;
        }
        return { 
          ...item, 
          criteria: criteriaValue,
          criteriaLabel: data.criteriaLabel,
          requirement: '-', 
          status: statusValue,
          vendorGroupId: data.isCustomGroup ? '' : (data.group_id ?? groupName),
          criteriaId: data.isCustomCriteria ? '' : (data.criteria_id ?? data.criteria),
          statusId: data.status ?? item.statusId,
          inspectionGroupLabel: groupLabel,
        };
      }
      if (item.group === selectedCriteria.group && item.isParent) {
        return { 
          ...item, 
          criteria: groupLabel ?? item.criteria,
          vendorGroupId: data.isCustomGroup ? '' : (data.group_id ?? groupName),
          inspectionGroupLabel: groupLabel,
        };
      }
      return item;
    }));
  };

  const updateParentGroup = (data: any) => {
    if (!editingParentGroup) return;
    const groupName = data.inspectionGroupName;
    const groupLabel = data.inspectionGroupLabel ?? data.inspectionGroupName;
    
    setCriteriaData(prev => prev.map(item => {
      if ((item.group === editingParentGroup.group || item.group_id == editingParentGroup.group_id) && item.isParent) {
        return { 
          ...item, 
          criteria: groupLabel ?? item.criteria,
          vendorGroupId: data.isCustomGroup ? '' : (data.group_id ?? groupName),
          inspectionGroupLabel: groupLabel,
        };
      }
      if ((item.group === editingParentGroup.group || item.group_id == editingParentGroup.group_id) && !item.isParent) {
        return {
          ...item,
          vendorGroupId: data.isCustomGroup ? '' : (data.group_id ?? groupName),
        };
      }
      return item;
    }));
  };

  const addToExistingGroup = (data: any, existingGroup: VendorCriteria) => {
    const groupName = data.inspectionGroupName;
    const criteriaValue = data.criteriaLabel ?? data.criteria;
    const groupData = {
      ...data,
      vendorGroupId: data.isCustomGroup ? '' : (data.group_id ?? groupName),
      criteria: criteriaValue,
      criteriaId: data.isCustomCriteria ? '' : (data.criteria_id ?? data.criteria),
      criteriaLabel: data.criteriaLabel,
      inspectionGroupLabel: data.inspectionGroupLabel ?? groupName,
      statusId: data.status,
    };
    const childRow = createChildRow(groupData, existingGroup.group, getNextOrderInGroup(existingGroup.group));
    setCriteriaData(prev => {
      const updatedCriteria = [...prev, childRow]
      handleCriteriaChange?.(updatedCriteria)
      return updatedCriteria
    });
  };

  const createNewGroup = (data: any) => {
    const newGroupId = getNextGroupId();
    const groupName = data.inspectionGroupName;
    const groupLabel = data.inspectionGroupLabel ?? data.inspectionGroupName;
    const criteriaValue = data.criteriaLabel ?? data.criteria;
    
    const parentData = {
      ...data,
      partGroupName: groupLabel,
      vendorGroupId: data.isCustomGroup ? '' : (data.group_id ?? groupName),
      inspectionGroupLabel: groupLabel,
    };
    const parentRow = createParentRow(parentData, newGroupId);
    
    const childData = {
      ...data,
      criteria: criteriaValue,
      criteriaId: data.isCustomCriteria ? '' : (data.criteria_id ?? data.criteria),
      criteriaLabel: data.criteriaLabel,
      statusId: data.status,
    };
    const childRow = createChildRow(childData, newGroupId, NUMBERMAP.ONE);
    setCriteriaData(prev => {
      const updatedCriteria = [...prev, parentRow, childRow]
      handleCriteriaChange?.(updatedCriteria)
      return updatedCriteria
    });
  };

  const handleIncomingModalSave = async (data: any) => {
    const groupName = data.inspectionGroupLabel ?? data.inspectionGroupName;
    if (selectedCriteria) {
      updateExistingCriteria(data);
    } else if (editingParentGroup && !data.criteria) {
      updateParentGroup(data);
    } else {
      const existingGroup = findExistingGroup(groupName);
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
      handleCriteriaChange?.(updatedCriteria)
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
      handleCriteriaChange?.(updatedCriteria)
      return updatedCriteria
    }
    );
  };

  const handleDeleteIncomingCriteria = (id: number, showActionAlert?: (status: string) => Promise<{ isConfirmed: boolean }>) => {
    const itemToDelete = criteriaData.find(item => item.id === id);
    
    if (showActionAlert) {
      showActionAlert('delete').then((result: { isConfirmed: boolean }) => {
        if (!result.isConfirmed) return;
        performDeleteIncomingCriteria(id, itemToDelete);
      });
    } else {
      performDeleteIncomingCriteria(id, itemToDelete);
    }
  };

  const performDeleteIncomingCriteria = (id: number, itemToDelete: VendorCriteria | undefined) => {
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
    handleAddIncommingCriteria,
    handleEditIncommingCriteria,
    handleIncomingModalClose,
    getInitialIncomingModalData,
    handleIncomingModalSave,
    handleDeleteIncomingCriteria,
  };
};

