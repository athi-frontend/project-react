"use client";
import React, { useCallback, useMemo } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

import {
  HeaderContainer,
  HeaderTitle,
  AddButton,
} from '@/styles/components/ui/commonTable';
import {
  TableContainer,
  StyledDataGrid,
  DragHandle,
  TableWrapper,
  DataGridReOrderTableStyles,
  getDragHandlerCriteriaTable,
} from '@/styles/components/ui/TableRowReOrder';
import { fullWidth } from '@/styles/components/ui/layout';
import { NUMBERMAP } from '@/constants/common';
import { DATA_GRID_REORDER, DRAGANDDROP } from '@/constants/modules/dnd/projectPlan';
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid';
import { AddIconStyle } from '@/styles/modules/vendor-management/vendorSelectionCriteria';
import { VendorCriteria } from './types';
import { useDragAndDrop } from './useDragAndDrop';
import {
  sortCriteriaByGroupAndOrder,
  getDragHandlePosition,
  processDragOver,
  processDrop,
  DragOverRowInfo,
} from './dragAndDropHelpers';

/**
 * Classification: Confidential
 */

export interface VendorSelectionCriteriaTableProps {
  criteria: VendorCriteria[];
  onCriteriaReorder: (updatedCriteria: VendorCriteria[]) => void;
  onAddCriteria?: () => void;
  onEditCriteria?: (criteria: VendorCriteria) => void;
  onDeleteCriteria?: (id: number) => void;
  title?: string;
  showAddButton?: boolean;
  loading?: boolean;
  columns?: GridColDef[];
  groupingColumn?: string; // Field name for grouping (e.g., 'group')
  parentColumn?: string; // Field name that indicates parent rows (e.g., 'isParent')
  enableDragDrop?: boolean;
  orderField?: string;
  hideHeader?: boolean
  // Field name for ordering (e.g., 'order')
}

const VendorSelectionCriteriaTable: React.FC<VendorSelectionCriteriaTableProps> = ({
  criteria,
  onCriteriaReorder,
  onAddCriteria,
  onEditCriteria,
  onDeleteCriteria,
  title = "Vendor Selection Criteria",
  showAddButton = true,
  loading = false,
  columns: customColumns,
  groupingColumn = 'group',
  parentColumn = 'isParent',
  enableDragDrop = true,
  orderField = 'order',
  hideHeader = false,
}) => {
  const {
    selectedRowId,
    draggedRowId,
    dragOverRowId,
    dragPosition,
    setDragOverRowId,
    setDragPosition,
    handleRowClick,
    handleDragStart,
    handleDragEnd,
  } = useDragAndDrop();

  // Sort by grouping column, then by order (order is within group)
  const sortedCriteria = useMemo(() => {
    return sortCriteriaByGroupAndOrder(criteria, groupingColumn);
  }, [criteria, groupingColumn]);

  const getRowInfoFromPoint = useCallback((event: React.DragEvent, draggedRowId: number | string): DragOverRowInfo | null => {
    // Find the row element under the mouse cursor
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const rowElement = elements.find(el => el.classList.contains('MuiDataGrid-row'));
    
    if (!rowElement || !(rowElement instanceof HTMLElement)) {
      return null;
    }

    const rowId = Number(rowElement.getAttribute('data-id'));
    
    if (!rowId) {
      return null;
    }

    return { rowId, rowElement };
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    processDragOver({
      event,
      draggedRowId,
      sortedCriteria,
      parentColumn,
      groupingColumn,
      getRowInfo: getRowInfoFromPoint,
      setDragOverRowId,
      setDragPosition,
    });
  }, [draggedRowId, sortedCriteria, parentColumn, groupingColumn, getRowInfoFromPoint, setDragOverRowId, setDragPosition]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    processDrop({
      event,
      draggedRowId,
      targetRowId: dragOverRowId,
      dragPosition,
      sortedCriteria,
      parentColumn,
      groupingColumn,
      onCriteriaReorder,
      handleDragEnd,
    });
  }, [draggedRowId, dragOverRowId, dragPosition, sortedCriteria, parentColumn, groupingColumn, onCriteriaReorder, handleDragEnd]);


  const selectedRowIndex = useMemo(() => {
    const index = sortedCriteria.findIndex(item => item.id === selectedRowId);
    return index;
  }, [selectedRowId, sortedCriteria]);


  // Use custom columns if provided, otherwise use default columns
  const columns = customColumns ?? [];

  return (
    <Box sx={fullWidth}>
      {!hideHeader && (title ?? showAddButton) && (
        <HeaderContainer>
        {title && <HeaderTitle>{title}</HeaderTitle>}
        {showAddButton && onAddCriteria && (
          <AddButton variant="outlined" onClick={onAddCriteria}>
            <AddIcon sx={AddIconStyle} />
            <span>{DATA_GRID_CONSTANTS.ADD_NEW_BUTTON}</span>
          </AddButton>
        )}
      </HeaderContainer>
      )}
      <TableContainer>
        <TableWrapper
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <StyledDataGrid
            rows={sortedCriteria}
            columns={columns}
            hideFooter
            disableRowSelectionOnClick
            disableColumnResize
            disableColumnSorting
            disableColumnFilter
            disableColumnMenu
            onRowClick={handleRowClick}
            getRowId={(row) => row.id}
            rowHeight={NUMBERMAP.SEVENTY}
            columnHeaderHeight={NUMBERMAP.FIFTY}
            loading={loading}
            localeText={{
              noRowsLabel: 'No Records Found...',
            }}
            sx={{
              '& .MuiDataGrid-row.dragging': DataGridReOrderTableStyles.draggingRow,
              '& .MuiDataGrid-row.drag-over': DataGridReOrderTableStyles.dragOverRow,
              '& .MuiDataGrid-row.drag-over-bottom': DataGridReOrderTableStyles.dragOverBottomRow,
            }}
          />
          {selectedRowId && selectedRowIndex !== -1 && enableDragDrop && (() => {
            const selectedRow = sortedCriteria.find(r => r.id === selectedRowId);
            if (!selectedRow) {
              return null;
            }
            const position = getDragHandlePosition(selectedRowIndex);
            return (
              <DragHandle
                className="visible"
                draggable
                onDragStart={(e) => {
                  handleDragStart(e, selectedRowId);
                }}
                onDragEnd={handleDragEnd}
                style={getDragHandlerCriteriaTable(position)}
              >
                <Image
                height={NUMBERMAP.HUNDRED}
                width={NUMBERMAP.HUNDRED}
                src={DRAGANDDROP}
                alt={DATA_GRID_REORDER.DRAGGING}
              />
              </DragHandle>
            );
          })()}
        </TableWrapper>
      </TableContainer>
    </Box>
  );
};

export default VendorSelectionCriteriaTable;