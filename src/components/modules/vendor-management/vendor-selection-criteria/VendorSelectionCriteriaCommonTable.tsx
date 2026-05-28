"use client";
import React, { useCallback, useMemo } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
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
import { AddIconStyle, dragComponent } from '@/styles/modules/vendor-management/vendorSelectionCriteria';
import { transformNestedHierarchicalData, NestedTransformConfig } from '@/lib/modules/vendor-management/transformNestedHierarchicalData';
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
  criteria?: VendorCriteria[]; // Optional: use if data is already transformed
  rawData?: any[]; // Optional: raw nested API data (groups with criteria arrays)
  transformConfig?: NestedTransformConfig; // Required if rawData is provided
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

const VendorSelectionCriteriaCommonTable: React.FC<VendorSelectionCriteriaTableProps> = ({
  criteria: providedCriteria,
  rawData,
  transformConfig,
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

  // Transform raw data if provided, otherwise use provided criteria
  const transformedCriteria = useMemo(() => {
    if (rawData && transformConfig) {
      return transformNestedHierarchicalData(rawData, transformConfig);
    }
    return providedCriteria ?? [];
  }, [rawData, transformConfig, providedCriteria]);

  // Sort by grouping column, then by order (order is within group)
  const sortedCriteria = useMemo(() => {
    return sortCriteriaByGroupAndOrder(transformedCriteria, groupingColumn);
  }, [transformedCriteria, groupingColumn]);

  // Helper function to extract row ID from target element
  const getRowIdFromTarget = useCallback((target: HTMLElement, draggedRowId: number | string): number | string | null => {
    let rowIdAttr = target.getAttribute('data-row-id');
    
    if (!rowIdAttr) {
      const rowElement = target.closest('.MuiDataGrid-row');
      if (!rowElement) {
        return null;
      }
      rowIdAttr = rowElement.getAttribute('data-id');
      if (!rowIdAttr) {
        return null;
      }
    }

    // Try to match the ID type (number or string) with the draggedRowId
    if (typeof draggedRowId === 'number') {
      const rowId = Number(rowIdAttr);
      return isNaN(rowId) ? null : rowId;
    }
    
    return rowIdAttr;
  }, []);

  const getRowInfoFromTarget = useCallback((event: React.DragEvent, draggedRowId: number | string): DragOverRowInfo | null => {
    const target = event.currentTarget as HTMLElement;
    const rowId = getRowIdFromTarget(target, draggedRowId);
    
    if (rowId === null) {
      return null;
    }

    const rowElement = target.closest('.MuiDataGrid-row');
    if (!rowElement || !(rowElement instanceof HTMLElement)) {
      return null;
    }

    return { rowId, rowElement };
  }, [getRowIdFromTarget]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    processDragOver({
      event,
      draggedRowId,
      sortedCriteria,
      parentColumn,
      groupingColumn,
      getRowInfo: getRowInfoFromTarget,
      setDragOverRowId,
      setDragPosition,
    });
  }, [draggedRowId, sortedCriteria, parentColumn, groupingColumn, getRowInfoFromTarget, setDragOverRowId, setDragPosition]);

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

  // Handler wrappers to reduce nesting levels
  const handleCellDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleDragOver(event);
  }, [handleDragOver]);

  const handleCellDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleDrop(event);
  }, [handleDrop]);

  const handleTableWrapperDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Extract drag handle rendering to reduce nesting
  const dragHandleElement = useMemo(() => {
    if (!selectedRowId || selectedRowIndex === -1 || !enableDragDrop) {
      return null;
    }

    const selectedRow = sortedCriteria.find(r => r.id === selectedRowId);
    if (!selectedRow) {
      return null;
    }

    const position = getDragHandlePosition(selectedRowIndex);
    const dragStartHandler = (event: React.DragEvent) => {
      handleDragStart(event, selectedRowId);
    };

    return (
      <DragHandle
        className="visible"
        draggable
        onDragStart={dragStartHandler}
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
  }, [selectedRowId, selectedRowIndex, enableDragDrop, sortedCriteria, getDragHandlePosition, handleDragStart, handleDragEnd]);

  // Use custom columns if provided, otherwise use default columns
  // Wrap each column's renderCell to add drag handlers
  const columnsWithDragHandlers = useMemo(() => {
    if (!customColumns || customColumns.length === NUMBERMAP.ZERO) return [];
    
    return customColumns.map((col) => ({
      ...col,
      renderCell: (params: any) => {
        let content;
        if (col.renderCell) {
          content = col.renderCell(params);
        } else {
          content = params.value;
        }
        
        // Wrap content in a div with drag handlers
        // Store row ID in data attribute for easier access
        return (
          <Box
            component="div"
            sx={dragComponent}
            draggable={false}
            data-row-id={params.id}
            onDragOver={handleCellDragOver}
            onDrop={handleCellDrop}
          >
            {content}
          </Box>
        );
      },
    }));
  }, [customColumns, handleCellDragOver, handleCellDrop]);

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
          onDragOver={handleTableWrapperDragOver}
        >
          <StyledDataGrid
            rows={sortedCriteria}
            columns={columnsWithDragHandlers}
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
          {dragHandleElement}
        </TableWrapper>
      </TableContainer>
    </Box>
  );
};

export default VendorSelectionCriteriaCommonTable;
