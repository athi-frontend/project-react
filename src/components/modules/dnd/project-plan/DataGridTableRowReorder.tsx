"use client";
import React, { useState, useCallback, useMemo } from 'react';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import {
  TableContainer,
  StyledDataGrid,
  DragHandle,
  TableWrapper,
  DataGridReOrderTableStyles,
  getDragHandleStyle,
} from '@/styles/components/ui/TableRowReOrder';
import { Box, Button } from '@mui/material';
import { fullWidth } from '@/styles/components/ui/layout';
import { ProjectStagesTableProps } from '@/types/modules/dnd/projectPlan';
import { NUMBERMAP } from '@/constants/common';
import { DATA_GRID_REORDER, DRAG_DROP_TYPES, DRAGANDDROP } from '@/constants/modules/dnd/projectPlan';
import Image from 'next/image';

/**
    Classification : Confidential
**/
const DataGridReOrderTable: React.FC<ProjectStagesTableProps> = ({
  stages,
  onStagesReorder,
  columns,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [draggedRowId, setDraggedRowId] = useState<number | null>(null);
  const [dragOverRowId, setDragOverRowId] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom'>('top');

  // Sort stages by stage_order to ensure correct initial order
  const sortedStages = useMemo(() => {
    return [...stages].sort((a, b) => a.stage_order - b.stage_order);
  }, [stages]);

  const handleRowClick = useCallback((params: GridRowParams) => {
    if (selectedRowId === params.id) {
      setSelectedRowId(null);
    } else {
      setSelectedRowId(params.id as number);
    }
  }, [selectedRowId]);

  const handleDragStart = useCallback((event: React.DragEvent, rowId: number) => {
    setDraggedRowId(rowId);
    event.dataTransfer.effectAllowed = DRAG_DROP_TYPES.MOVE;
    event.dataTransfer.setData(DATA_GRID_REORDER.TEXT_PLAIN, rowId.toString());
    setTimeout(() => {
      const rowElement = document.querySelector(`[data-id="${rowId}"]`);
      if (rowElement) {
        rowElement.classList.add(DATA_GRID_REORDER.DRAGGING);
      }
    }, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    const allRows = document.querySelectorAll('.MuiDataGrid-row');
    allRows.forEach(row => {
      row.classList.remove(DATA_GRID_REORDER.DRAGGING, DATA_GRID_REORDER.DRAG_OVER, DATA_GRID_REORDER.DRAG_OVER_BOTTOM);
    });
    setDraggedRowId(null);
    setDragOverRowId(null);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = DRAG_DROP_TYPES.MOVE;

    if (draggedRowId === null) return;

    const target = event.currentTarget as HTMLElement;
    const rowElement = target.closest('.MuiDataGrid-row');
    if (!rowElement) return;

    const rowId = Number(rowElement.getAttribute(DATA_GRID_REORDER.DATA_ID));
    if (!rowId || rowId === draggedRowId) return;

    const rect = rowElement.getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;
    const position = event.clientY < midPoint ? DRAG_DROP_TYPES.TOP : DRAG_DROP_TYPES.BOTTOM;

    setDragOverRowId(rowId);
    setDragPosition(position);

    const allRows = document.querySelectorAll('.MuiDataGrid-row');
    allRows.forEach(row => row.classList.remove(DATA_GRID_REORDER.DRAG_OVER, DATA_GRID_REORDER.DRAG_OVER_BOTTOM));

    if (position === DRAG_DROP_TYPES.TOP) {
      rowElement.classList.add(DATA_GRID_REORDER.DRAG_OVER);
    } else {
      rowElement.classList.add(DATA_GRID_REORDER.DRAG_OVER_BOTTOM);
    }
  }, [draggedRowId]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedRowId || !dragOverRowId) return;

    const draggedIndex = sortedStages.findIndex(stage => stage.project_stage_order_id === draggedRowId);
    const targetIndex = sortedStages.findIndex(stage => stage.project_stage_order_id === dragOverRowId);
    if (draggedIndex === -NUMBERMAP.ONE || targetIndex === -NUMBERMAP.ONE || draggedIndex === targetIndex) return;

    const newStages = [...sortedStages];
    const [draggedStage] = newStages.splice(draggedIndex, NUMBERMAP.ONE);
    let insertIndex = targetIndex;

    if (dragPosition === DRAG_DROP_TYPES.BOTTOM) insertIndex += NUMBERMAP.ONE;
    if (draggedIndex < targetIndex) insertIndex -= NUMBERMAP.ONE;

    newStages.splice(insertIndex, NUMBERMAP.ZERO, draggedStage);

    const updatedStages = newStages.map((stage, index) => ({
      ...stage,
      stage_order: index + NUMBERMAP.ONE, // Update stage_order to reflect new position
      serialNumber: String(index + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, String(NUMBERMAP.ZERO)),
    }));

    onStagesReorder(updatedStages);
    handleDragEnd();
  }, [draggedRowId, dragOverRowId, dragPosition, sortedStages, onStagesReorder, handleDragEnd]);

  const getDragHandlePosition = (rowIndex: number) => {
    const headerHeight = NUMBERMAP.FIFTY;
    const rowHeight = NUMBERMAP.FIFTY;
    const scrollY = document.querySelector('.MuiDataGrid-virtualScroller')?.scrollTop || NUMBERMAP.ZERO;
    return headerHeight + (rowIndex * rowHeight) - scrollY + (rowHeight / NUMBERMAP.TWO);
  };

  const selectedRowIndex = useMemo(() => {
    return sortedStages.findIndex(stage => stage.project_stage_order_id === selectedRowId);
  }, [selectedRowId, sortedStages]);

  const updatedColumns: GridColDef[] = columns.map((col) => ({
    ...col,
    renderCell: (params) => {
      let content;
      if (col.field === DATA_GRID_REORDER.SNO) {
        content = params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE;
      } else if (col.renderCell) {
        content = col.renderCell(params);
      } else {
        content = params.value;
      }
      return (
        <Button
          sx={{all: 'unset'}}
          component="div"
          draggable={false}
          onDragOver={(e) => {
            e.stopPropagation();
            handleDragOver(e);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            handleDrop(e);
          }}
        >
          {content}
        </Button>
      );
    },
  }));

  return (
    <Box sx={fullWidth}>
      <TableContainer>
        <TableWrapper>
          <StyledDataGrid
            rows={sortedStages}
            columns={updatedColumns}
            hideFooter
            disableRowSelectionOnClick
            disableColumnResize
            disableColumnSorting
            disableColumnFilter
            disableColumnMenu
            onRowClick={handleRowClick}
            getRowId={(row) => row.project_stage_order_id}
            rowHeight={NUMBERMAP.FIFTY}
            columnHeaderHeight={NUMBERMAP.FIFTY}
            localeText={{
              noRowsLabel: 'No Records Found...',
            }}
            sx={{
              '& .MuiDataGrid-row.dragging': DataGridReOrderTableStyles.draggingRow,
              '& .MuiDataGrid-row.drag-over': DataGridReOrderTableStyles.dragOverRow,
              '& .MuiDataGrid-row.drag-over-bottom': DataGridReOrderTableStyles.dragOverBottomRow,
            }}
          />
          {selectedRowId && selectedRowIndex !== -NUMBERMAP.ONE && (
            <DragHandle
              className={DATA_GRID_REORDER.VISIBLE}
              draggable
              onDragStart={(e) => handleDragStart(e, selectedRowId)}
              onDragEnd={handleDragEnd}
              style={getDragHandleStyle(getDragHandlePosition(selectedRowIndex))}
            >
              <Image
                height={NUMBERMAP.HUNDRED}
                width={NUMBERMAP.HUNDRED}
                src={DRAGANDDROP}
                alt={DATA_GRID_REORDER.DRAGGING}
              />
            </DragHandle>
          )}
        </TableWrapper>
      </TableContainer>
    </Box>
  );
};

export default DataGridReOrderTable;

