/**
 * Classification: Confidential
 */

import { NUMBERMAP } from '@/constants/common';
import { VendorCriteria, DragPosition } from './types';

/**
 * Validates if drag-over is allowed between two rows
 */
export const canPerformDragOver = (
  draggedRow: VendorCriteria,
  overRow: VendorCriteria,
  parentColumn: string,
  groupingColumn: string
): boolean => {
  const isDraggedParent = draggedRow[parentColumn as keyof VendorCriteria] as boolean;
  const isOverParent = overRow[parentColumn as keyof VendorCriteria] as boolean;
  const draggedGroup = draggedRow[groupingColumn as keyof VendorCriteria] as number;
  const overGroup = overRow[groupingColumn as keyof VendorCriteria] as number;

  // Allow drag-over for:
  // 1. Parent rows (existing behavior)
  // 2. Child rows within the same group
  return (isDraggedParent && isOverParent) || 
         (!isDraggedParent && !isOverParent && draggedGroup === overGroup);
};

/**
 * Applies visual feedback for drag-over state
 */
export const applyDragOverVisualFeedback = (rowElement: HTMLElement, position: DragPosition): void => {
  const allRows = document.querySelectorAll('.MuiDataGrid-row');
  allRows.forEach(row => row.classList.remove('drag-over', 'drag-over-bottom'));

  const className = position === 'top' ? 'drag-over' : 'drag-over-bottom';
  rowElement.classList.add(className);
};

/**
 * Calculates the drag handle position based on row index
 */
export const getDragHandlePosition = (rowIndex: number): number => {
  const headerHeight = NUMBERMAP.FIFTY;
  const rowHeight = NUMBERMAP.SEVENTY;
  const scrollY = document.querySelector('.MuiDataGrid-virtualScroller')?.scrollTop || NUMBERMAP.ZERO;
  const position = headerHeight + (rowIndex * rowHeight) - scrollY + (rowHeight / NUMBERMAP.TWO);
  return position;
};

/**
 * Sorts criteria by grouping column, then by order
 */
export const sortCriteriaByGroupAndOrder = (
  criteria: VendorCriteria[],
  groupingColumn: string
): VendorCriteria[] => {
  return [...criteria].sort((a, b) => {
    const aGroup = a[groupingColumn as keyof VendorCriteria] as number;
    const bGroup = b[groupingColumn as keyof VendorCriteria] as number;
    const aOrder = a.order;
    const bOrder = b.order;
    return (aGroup - bGroup) || (aOrder - bOrder);
  });
};

/**
 * Parameters for child row reordering
 */
export interface ChildRowReorderParams {
  sortedCriteria: VendorCriteria[];
  draggedGroup: number;
  draggedRowId: number | string;
  targetRowId: number | string;
  dragPosition: DragPosition;
  groupingColumn: string;
  onReorder: (updatedCriteria: VendorCriteria[]) => void;
  onDragEnd: () => void;
}

/**
 * Handles child row reordering within the same group
 */
export const handleChildRowReorder = (params: ChildRowReorderParams): void => {
  const {
    sortedCriteria,
    draggedGroup,
    draggedRowId,
    targetRowId,
    dragPosition,
    groupingColumn,
    onReorder,
    onDragEnd,
  } = params;
  const groupItems = sortedCriteria.filter(
    item => (item[groupingColumn as keyof VendorCriteria] as number) === draggedGroup
  );
  const draggedIndex = groupItems.findIndex(item => item.id === draggedRowId);
  const targetIndex = groupItems.findIndex(item => item.id === targetRowId);
  
  if (draggedIndex === -1 || targetIndex === -1) return;

  // Create new order array
  const newOrder = [...groupItems];
  const [draggedItem] = newOrder.splice(draggedIndex, NUMBERMAP.ONE);
  
  let insertIndex = targetIndex;
  if (dragPosition === 'bottom') insertIndex += NUMBERMAP.ONE;
  if (draggedIndex < targetIndex) insertIndex -= NUMBERMAP.ONE;
  
  newOrder.splice(insertIndex, 0, draggedItem);

  // Update order values
  const updatedOrder = newOrder.map((item, index) => ({
    ...item,
    order: index + NUMBERMAP.ONE
  }));

  // Merge back with other groups
  const otherGroups = sortedCriteria.filter(
    item => (item[groupingColumn as keyof VendorCriteria] as number) !== draggedGroup
  );
  const updatedCriteria = [...otherGroups, ...updatedOrder]
    .sort((a, b) => {
      const aGroup = (a as any)[groupingColumn] as number;
      const bGroup = (b as any)[groupingColumn] as number;
      return (aGroup - bGroup) || (a.order - b.order);
    });

  onReorder(updatedCriteria);
  onDragEnd();
};

/**
 * Parameters for parent row reordering
 */
export interface ParentRowReorderParams {
  sortedCriteria: VendorCriteria[];
  draggedGroup: number;
  targetGroup: number;
  dragPosition: DragPosition;
  groupingColumn: string;
  onReorder: (updatedCriteria: VendorCriteria[]) => void;
  onDragEnd: () => void;
}

/**
 * Handles parent row reordering (group reordering)
 */
export const handleParentRowReorder = (params: ParentRowReorderParams): void => {
  const {
    sortedCriteria,
    draggedGroup,
    targetGroup,
    dragPosition,
    groupingColumn,
    onReorder,
    onDragEnd,
  } = params;
  const groupsInOrder = Array.from(
    new Set(sortedCriteria.map(i => i[groupingColumn as keyof VendorCriteria] as number))
  );
  const draggedGroupIndex = groupsInOrder.indexOf(draggedGroup);
  const targetGroupIndex = groupsInOrder.indexOf(targetGroup);
  if (draggedGroupIndex === -1 || targetGroupIndex === -1) return;
  
  const newOrder = [...groupsInOrder];
  const [g] = newOrder.splice(draggedGroupIndex, NUMBERMAP.ONE);
  let insertIndex = targetGroupIndex;
  if (dragPosition === 'bottom') insertIndex += NUMBERMAP.ONE;
  if (draggedGroupIndex < targetGroupIndex) insertIndex -= NUMBERMAP.ONE;
  newOrder.splice(insertIndex, NUMBERMAP.ZERO, g);

  // Remap group ids to sequential numbers based on new order (01, 02, ...)
  const groupMapping = newOrder.reduce<Record<number, number>>((acc, groupId, idx) => {
    acc[groupId] = idx + NUMBERMAP.ONE;
    return acc;
  }, {} as Record<number, number>);

  const updated = sortedCriteria.map(item => ({
    ...item,
    [groupingColumn]: groupMapping[item[groupingColumn as keyof VendorCriteria] as number],
  }));

  const updatedCriteria = updated
    .toSorted((a, b) => {
      const aGroup = a[groupingColumn as keyof VendorCriteria] as number;
      const bGroup = b[groupingColumn as keyof VendorCriteria] as number;
      return (aGroup - bGroup) || (a.order - b.order);
    })
    .map((item) => item);

  onReorder(updatedCriteria);
  onDragEnd();
};

/**
 * Result type for extracting row information from drag event
 */
export interface DragOverRowInfo {
  rowId: number | string;
  rowElement: HTMLElement;
}

/**
 * Parameters for processing drag over event
 */
type DraggedRowId = number | string | null;

export interface ProcessDragOverParams {
  event: React.DragEvent;
  draggedRowId: DraggedRowId;
  sortedCriteria: VendorCriteria[];
  parentColumn: string;
  groupingColumn: string;
  getRowInfo: (event: React.DragEvent, draggedRowId: number | string) => DragOverRowInfo | null;
  setDragOverRowId: (rowId: number | string) => void;
  setDragPosition: (position: DragPosition) => void;
}

/**
 * Processes drag over event with common logic
 * @returns true if drag over was processed, false otherwise
 */
export const processDragOver = (params: ProcessDragOverParams): boolean => {
  const {
    event,
    draggedRowId,
    sortedCriteria,
    parentColumn,
    groupingColumn,
    getRowInfo,
    setDragOverRowId,
    setDragPosition,
  } = params;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  if (draggedRowId === null) {
    return false;
  }

  const rowInfo = getRowInfo(event, draggedRowId);
  if (!rowInfo) {
    return false;
  }

  const { rowId, rowElement } = rowInfo;

  if (rowId === draggedRowId) {
    return false;
  }

  const overRow = sortedCriteria.find(item => item.id === rowId);
  const draggedRow = sortedCriteria.find(item => item.id === draggedRowId);

  if (!overRow || !draggedRow) {
    return false;
  }

  if (!canPerformDragOver(draggedRow, overRow, parentColumn, groupingColumn)) {
    return false;
  }

  const rect = rowElement.getBoundingClientRect();
  const midPoint = rect.top + rect.height / 2;
  const position: DragPosition = event.clientY < midPoint ? 'top' : 'bottom';

  setDragOverRowId(rowId);
  setDragPosition(position);
  applyDragOverVisualFeedback(rowElement, position);

  return true;
};

/**
 * Parameters for processing drop event
 */
export interface ProcessDropParams {
  event: React.DragEvent;
  draggedRowId: DraggedRowId;
  targetRowId: DraggedRowId;
  dragPosition: DragPosition;
  sortedCriteria: VendorCriteria[];
  parentColumn: string;
  groupingColumn: string;
  onCriteriaReorder: (updatedCriteria: VendorCriteria[]) => void;
  handleDragEnd: () => void;
}

/**
 * Extracts target row ID from event if not provided
 */
const getTargetRowIdFromEvent = (
  event: React.DragEvent,
  targetRowId: DraggedRowId,
  draggedRowId: number | string
): DraggedRowId => {
  if (targetRowId) {
    return targetRowId;
  }

  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  const rowElement = elements.find(el => el.classList.contains('MuiDataGrid-row'));
  if (!rowElement) {
    return null;
  }

  const rowIdAttr = rowElement.getAttribute('data-id');
  if (!rowIdAttr) {
    return null;
  }

  return typeof draggedRowId === 'number' ? Number(rowIdAttr) : rowIdAttr;
};

/**
 * Finds and validates dragged and target rows
 */
const findDropRows = (
  sortedCriteria: VendorCriteria[],
  draggedRowId: number | string,
  targetRowId: number | string
): { draggedRow: VendorCriteria; targetRow: VendorCriteria } | null => {
  const draggedRow = sortedCriteria.find(item => item.id === draggedRowId);
  const targetRow = sortedCriteria.find(item => item.id === targetRowId);

  if (!draggedRow || !targetRow) {
    return null;
  }

  return { draggedRow, targetRow };
};

/**
 * Extracts row type and group information
 */
const extractRowInfo = (
  draggedRow: VendorCriteria,
  targetRow: VendorCriteria,
  parentColumn: string,
  groupingColumn: string
) => {
  const isDraggedParent = draggedRow[parentColumn as keyof VendorCriteria] as boolean;
  const isTargetParent = targetRow[parentColumn as keyof VendorCriteria] as boolean;
  const draggedGroup = draggedRow[groupingColumn as keyof VendorCriteria] as number;
  const targetGroup = targetRow[groupingColumn as keyof VendorCriteria] as number;

  return { isDraggedParent, isTargetParent, draggedGroup, targetGroup };
};

/**
 * Parameters for executing reorder logic
 */
interface ExecuteReorderParams {
  isDraggedParent: boolean;
  isTargetParent: boolean;
  draggedGroup: number;
  targetGroup: number;
  draggedRowId: number | string;
  targetRowId: number | string;
  dragPosition: DragPosition;
  sortedCriteria: VendorCriteria[];
  groupingColumn: string;
  onCriteriaReorder: (updatedCriteria: VendorCriteria[]) => void;
  handleDragEnd: () => void;
}

/**
 * Handles the reordering logic based on row types
 */
const executeReorder = (params: ExecuteReorderParams): boolean => {
  const {
    isDraggedParent,
    isTargetParent,
    draggedGroup,
    targetGroup,
    draggedRowId,
    targetRowId,
    dragPosition,
    sortedCriteria,
    groupingColumn,
    onCriteriaReorder,
    handleDragEnd,
  } = params;

  if (isDraggedParent && isTargetParent) {
    handleParentRowReorder({
      sortedCriteria,
      draggedGroup,
      targetGroup,
      dragPosition,
      groupingColumn,
      onReorder: onCriteriaReorder,
      onDragEnd: handleDragEnd,
    });
    return true;
  }

  if (!isDraggedParent && !isTargetParent && draggedGroup === targetGroup) {
    handleChildRowReorder({
      sortedCriteria,
      draggedGroup,
      draggedRowId,
      targetRowId,
      dragPosition,
      groupingColumn,
      onReorder: onCriteriaReorder,
      onDragEnd: handleDragEnd,
    });
    return true;
  }

  return false;
};

/**
 * Processes drop event with common logic
 * @returns true if drop was processed, false otherwise
 */
export const processDrop = (params: ProcessDropParams): boolean => {
  const {
    event,
    draggedRowId,
    targetRowId,
    dragPosition,
    sortedCriteria,
    parentColumn,
    groupingColumn,
    onCriteriaReorder,
    handleDragEnd,
  } = params;
  event.preventDefault();

  if (!draggedRowId) {
    return false;
  }

  const finalTargetRowId = getTargetRowIdFromEvent(event, targetRowId, draggedRowId);
  if (!finalTargetRowId) {
    return false;
  }

  const rows = findDropRows(sortedCriteria, draggedRowId, finalTargetRowId);
  if (!rows) {
    return false;
  }

  const { draggedRow, targetRow } = rows;
  const { isDraggedParent, isTargetParent, draggedGroup, targetGroup } = extractRowInfo(
    draggedRow,
    targetRow,
    parentColumn,
    groupingColumn
  );

  const reordered = executeReorder({
    isDraggedParent,
    isTargetParent,
    draggedGroup,
    targetGroup,
    draggedRowId,
    targetRowId: finalTargetRowId,
    dragPosition,
    sortedCriteria,
    groupingColumn,
    onCriteriaReorder,
    handleDragEnd,
  });

  if (!reordered) {
    handleDragEnd();
  }

  return reordered;
};

