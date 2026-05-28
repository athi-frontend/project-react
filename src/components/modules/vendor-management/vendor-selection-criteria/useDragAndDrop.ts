/**
 * Classification: Confidential
 */

import { useState, useCallback } from 'react';
import { GridRowParams } from '@mui/x-data-grid';
import { NumericStringNullable, DragPosition } from './types';

/**
 * Custom hook for managing drag and drop state and handlers
 */
export const useDragAndDrop = () => {
  const [selectedRowId, setSelectedRowId] = useState<NumericStringNullable>(null);
  const [draggedRowId, setDraggedRowId] = useState<NumericStringNullable>(null);
  const [dragOverRowId, setDragOverRowId] = useState<NumericStringNullable>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition>('top');

  const handleRowClick = useCallback((params: GridRowParams) => {
    if (selectedRowId === params.id) {
      setSelectedRowId(null);
      return;
    }
    // Allow selection of both parent and child rows
    setSelectedRowId(params.id as number | string);
  }, [selectedRowId]);

  const handleDragStart = useCallback((event: React.DragEvent, rowId: number | string) => {
    setDraggedRowId(rowId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', rowId.toString());
    setTimeout(() => {
      const rowElement = document.querySelector(`[data-id="${rowId}"]`);
      if (rowElement) {
        rowElement.classList.add('dragging');
      }
    }, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    const allRows = document.querySelectorAll('.MuiDataGrid-row');
    allRows.forEach(row => {
      row.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
    });
    setDraggedRowId(null);
    setDragOverRowId(null);
  }, []);

  return {
    selectedRowId,
    draggedRowId,
    dragOverRowId,
    dragPosition,
    setSelectedRowId,
    setDraggedRowId,
    setDragOverRowId,
    setDragPosition,
    handleRowClick,
    handleDragStart,
    handleDragEnd,
  };
};

