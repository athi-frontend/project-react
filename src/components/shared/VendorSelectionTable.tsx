'use client';

import React from 'react';
import {
  Box,
  TableBody,
  TableRow,
} from '@mui/material';
import { Edit } from 'iconsax-react';
import {
  StatusChip,
  EditIconButton,
  EditIconWrapper,
  TableWrapper,
  ScrollableContainer,
  StyledTableHead,
  HeaderTableCell,
  SampleHeaderCell,
  BodyTableCell,
  SampleBodyCell,
  StyledTable,
  SampleCellContent,
} from '@/styles/components/shared/vendorSelectionTable';
import {
  STATUS_LABELS,
  DEFAULT_KEY_FIELD,
  EDIT_ICON,
} from '@/constants/components/shared/vendorSelectionTable';
import { NUMBERMAP } from '@/constants/common';

// Sample data structure
export interface Sample {
  sample_id?: number;
  sample_number?: number;
  sample_result?: 0 | 1 | null; // 0 = Fail, 1 = Pass, null = Pending/Editable
  test_observation?: string;
  [key: string]: any; // Allow any additional fields
}

// Child column configuration
export interface ChildColumnConfig {
  field: string; // The field name in the child data
  headerName?: string; // Display label for the column
  keyField?: string; // The key field name in parent data (e.g., "samples")
}

// Column configuration
export interface ColumnConfig {
  field: string; // Field identifier in the data
  headerName: string; // Display label for the column
  flex?: number; // Flex value for column width
  child?: boolean; // Whether this column has child columns
  childColumns?: ChildColumnConfig | ChildColumnConfig[]; // Child column configuration
  keyField?: string; // Key field name for accessing nested data (e.g., "samples")
  [key: string]: any; // Allow dynamic properties
}

export interface VendorSelectionTableProps {
  data: any[]; // Dynamic data structure
  columns: ColumnConfig[]; // Column configuration
  sampleCount?: number; // Number of samples per column group (determines 1, 2, 3... numbering)
  groupCount?: number; // Number of groups (e.g., batches). Defaults to 1.
  renderGroupHeader?: (groupIndex: number) => React.ReactNode; // Optional group header renderer (adds an extra header row)
  onCellClick?: (
    row: any, // The entire row data
    columnKey: string, // The column field key
    sample: any, // The sample/item data
    sampleIndex: number // The index of the sample
  ) => void;
}

interface TableRowComponentParams {
  row: any;
  columns: ColumnConfig[];
  maxSamples: number;
  groupCount: number;
  getCellValue: (row: any, field: string) => any;
  getChildColumns: (col: ColumnConfig) => ChildColumnConfig[];
  getNestedData: (row: any, keyField: string) => any[];
  handleCellClick: (row: any, columnKey: string, sample: any, sampleIndex: number) => void;
  onCellClick: boolean;
}

const tableRowComponent = ({
  row,
  columns,
  maxSamples,
  groupCount,
  getCellValue,
  getChildColumns,
  getNestedData,
  handleCellClick,
  onCellClick,
}: TableRowComponentParams) => {

  const createEditHandler = (
    row: any,
    columnKey: string,
    sample: Sample | null,
    sampleIndex: number
  ) => () => {
    handleCellClick(row, columnKey, sample ?? null, sampleIndex);
  };

  return (
    <TableRow key={JSON.stringify(row)}>
      {columns.map((col) => {
        if (col.child) {
          const childCols = getChildColumns(col);
          const keyField = col.keyField ?? DEFAULT_KEY_FIELD;
          const nestedData = getNestedData(row, keyField);

          return childCols.flatMap((childCol) => {
            const items = childCol.keyField
              ? getNestedData(row, childCol.keyField)
              : nestedData;

            const totalCells = groupCount * maxSamples;
            return Array.from({ length: totalCells }, (_, flatIndex) => {
              const groupIndex = Math.floor(flatIndex / maxSamples);
              const unitIndex = flatIndex % maxSamples;
                const sampleIndex = groupIndex * maxSamples + unitIndex;
                const sample = items[sampleIndex];
                const status = sample ? getSampleStatus(sample?.sample_result) : null;
                const columnKey = childCol.keyField ?? keyField;

                return (
                  <SampleBodyCell key={`${col.field}-${childCol.field}-${groupIndex}-${unitIndex}`}>
                    <SampleCellContent>
                      {status === null ? (
                        <EditIconWrapper
                          onClick={createEditHandler(row, columnKey, sample, sampleIndex)}
                        >
                          <EditIconButton size="small">
                            <Edit size={EDIT_ICON.SIZE} color={EDIT_ICON.COLOR} />
                          </EditIconButton>
                        </EditIconWrapper>
                      ) : (
                        <Box
                          onClick={createEditHandler(row, columnKey, sample, sampleIndex)}
                          sx={{ cursor: onCellClick ? "pointer" : "default" }}
                        >
                          <StatusChip
                            label={status}
                            status={status}
                            size="small"
                            clickable={!!onCellClick}
                          />
                        </Box>
                      )}
                    </SampleCellContent>
                  </SampleBodyCell>
                );
            });
          });
        }

        // Regular column
        const cellValue = getCellValue(row, col.field);

        return (
          <BodyTableCell key={col.field} sx={{ flex: col.flex ?? NUMBERMAP.ONE }}>
            {cellValue != null ? String(cellValue) : ""}
          </BodyTableCell>
        );
      })}
    </TableRow>
  );
};

export const getSampleStatus = (sampleResult: typeof NUMBERMAP.ZERO | typeof NUMBERMAP.ONE | typeof NUMBERMAP.TWO | null | undefined): typeof STATUS_LABELS.PASS | typeof STATUS_LABELS.FAIL | null => {
  if (sampleResult === NUMBERMAP.ONE) return STATUS_LABELS.PASS;
  if (sampleResult === NUMBERMAP.ZERO || sampleResult === NUMBERMAP.TWO) return STATUS_LABELS.FAIL;
  return null;
};

const VendorSelectionTable: React.FC<VendorSelectionTableProps> = ({
  data,
  columns,
  sampleCount,
  groupCount,
  renderGroupHeader,
  onCellClick,
}) => {
  // Get maximum samples count - use sampleCount provided by the user
  const getMaxSamplesForColumn = () => {
    return sampleCount ?? NUMBERMAP.ZERO;
  };

  const handleCellClick = (
    row: any,
    columnKey: string,
    sample: any,
    sampleIndex: number
  ) => {
    if (onCellClick) {
      onCellClick(row, columnKey, sample, sampleIndex);
    }
  };



  // Get child columns from a column configuration
  const getChildColumns = (col: ColumnConfig): ChildColumnConfig[] => {
    if (col.childColumns) {
      return Array.isArray(col.childColumns) ? col.childColumns : [col.childColumns];
    }
    return [];
  };

  // Calculate rowSpan for parent columns
  const getParentRowSpan = () => {
    const hasChildColumns = columns.some((col) => col.child && getChildColumns(col).length > NUMBERMAP.ZERO);
    if (!hasChildColumns) return NUMBERMAP.ONE;
    return renderGroupHeader ? NUMBERMAP.THREE : NUMBERMAP.TWO;
  };

  // Get cell value from row data based on field path
  const getCellValue = (row: any, field: string): any => {
    return row?.[field];
  };

  // Get nested data using keyField
  const getNestedData = (row: any, keyField: string): any[] => {
    const nested = row?.[keyField];
    return Array.isArray(nested) ? nested : [];
  };

  const rawMaxSamples = getMaxSamplesForColumn();
  const maxSamples = rawMaxSamples > NUMBERMAP.ZERO ? rawMaxSamples : NUMBERMAP.ONE;
  const effectiveGroupCount = groupCount && groupCount > NUMBERMAP.ZERO ? groupCount : NUMBERMAP.ONE;
  const parentRowSpan = getParentRowSpan();

  return (
    <TableWrapper>
      <ScrollableContainer>
        <StyledTable>
          {/* Table Header */}
          <StyledTableHead>
            {/* First header row - Parent columns */}
            <TableRow>
              {columns.map((col, colIndex) => {
                if (col.child) {
                  // Parent column with children - calculate colspan from child columns
                  const childCols = getChildColumns(col);
                  const totalCols = childCols.length * maxSamples * effectiveGroupCount;
                  return (
                    <HeaderTableCell 
                      key={col.field} 
                      colSpan={totalCols ?? maxSamples ?? NUMBERMAP.ONE}
                      sx={{ flex: col.flex ?? NUMBERMAP.ONE }}
                    >
                      {col.headerName}
                    </HeaderTableCell>
                  );
                } else {
                  // Regular column - no children
                  return (
                    <HeaderTableCell 
                      key={col.field} 
                      rowSpan={parentRowSpan}
                      sx={{ flex: col.flex ?? NUMBERMAP.ONE }}
                    >
                      {col.headerName}
                    </HeaderTableCell>
                  );
                }
              })}
            </TableRow>

            {/* Second header row - Optional group headers (e.g., Batch 1..N) */}
            {parentRowSpan === NUMBERMAP.THREE && (
              <TableRow>
                {columns.map((col) => {
                  if (!col.child) return null;
                  const childCols = getChildColumns(col);
                  if (childCols.length === NUMBERMAP.ZERO) return null;

                  return childCols.flatMap((childCol) =>
                    Array.from({ length: effectiveGroupCount }, (_, groupIndex) => (
                      <HeaderTableCell
                        key={`${col.field}-${childCol.field}-group-${groupIndex}`}
                        colSpan={maxSamples ?? NUMBERMAP.ONE}
                        sx={{ padding: NUMBERMAP.ZERO }}
                      >
                        {renderGroupHeader ? renderGroupHeader(groupIndex) : null}
                      </HeaderTableCell>
                    ))
                  );
                })}
              </TableRow>
            )}

            {/* Child header row - Unit numbers (1..UnitsPerBatch) repeated per group */}
            {parentRowSpan >= NUMBERMAP.TWO && (
              <TableRow>
                {columns.map((col) => {
                  if (col.child) {
                    // Parent column - render all child columns
                    const childCols = getChildColumns(col);
                    if (childCols.length > NUMBERMAP.ZERO) {
                      return childCols.flatMap((childCol) =>
                        Array.from({ length: effectiveGroupCount * maxSamples }, (_, flatIndex) => {
                            const groupIndex = Math.floor(flatIndex / maxSamples);
                            const unitIndex = flatIndex % maxSamples;
                            return (
                            <SampleHeaderCell key={`${col.field}-${childCol.field}-${groupIndex}-${unitIndex}`}>
                              {unitIndex + NUMBERMAP.ONE}
                            </SampleHeaderCell>
                          );}
                        )
                      );
                    }
                  }
                  return null;
                })}
              </TableRow>
            )}
          </StyledTableHead>

          {/* Table Body */}
          <TableBody>
            {data.map((row, rowIndex) => (
              tableRowComponent({
                row,
                columns,
                maxSamples,
                groupCount: effectiveGroupCount,
                getCellValue,
                getChildColumns,
                getNestedData,
                handleCellClick,
                onCellClick: !!onCellClick,
              })
            ))}
          </TableBody>
        </StyledTable>
      </ScrollableContainer>
    </TableWrapper>
  );
};

export default VendorSelectionTable;
