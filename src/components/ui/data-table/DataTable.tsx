'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowClassNameParams,
  GridSortModel,
  GridFilterModel,
} from '@mui/x-data-grid'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IconButton } from '@mui/material'
import TableFooter from './CustomPagination'
import { applyTableFilters } from './TableFilter'
import {
  InlineStyles,
  StyledDataGrid,
  TableContainer,
  TableFilters,
} from '@/styles/components/ui/datatable'
import { NUMBERMAP } from '@/constants/common'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'
import { GenericTooltip } from '../tooltip/Tooltip'
import { CustomColDef } from '@/types/components/modules/dirSpecifications'

/**
 Classification : Confidential
**/

export const renderFieldWithTooltip = (params: GridRenderCellParams) => {
  return (
  <GenericTooltip 
        content={params.value ?? ''} 
      />
  )
}

interface RowData {
  [key: string]: any
}

type FilterMode = 'server' | 'client'

interface DataTableProps {
  IdField?: string
  rows: RowData[]
  columns: GridColDef[]
  checkbox?: boolean
  loading?: boolean
  pagination?: boolean
  handlePageUpdate?: (model: GridPaginationModel) => void
  totalRows?: number
  customClassName?: string
  searchValue?: string
  filterMode?: FilterMode
}
type SortDirection = 'asc' | 'desc' | null;
interface ColumnHeaderSortIconProps {
  sortDirection: SortDirection| null
  isActive: boolean
  field: string
  onSortChange: (field: string, direction: SortDirection| null) => void
}

const ColumnHeaderSortIcon: React.FC<ColumnHeaderSortIconProps> = ({
  sortDirection,
  isActive,
  field,
  onSortChange,
}) => {
  const handleAscClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent event bubbling to DataGrid
    if (sortDirection === 'asc') {
      onSortChange(field, null) // Reset to no sort
    } else {
      onSortChange(field, 'asc')
    }
  }

  const handleDescClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent event bubbling to DataGrid
    if (sortDirection === 'desc') {
      onSortChange(field, null) // Reset to no sort
    } else {
      onSortChange(field, 'desc')
    }
  }

  return (
    <div style={InlineStyles.columnHeaderSortIconContainer as React.CSSProperties}>
      <IconButton
        size="small"
        onClick={handleAscClick}
        sx={{
          padding: NUMBERMAP.ZERO,
          color: sortDirection === 'asc' ? 'primary.main' : 'text.secondary',
        }}
      >
        <ExpandLessIcon
          style={InlineStyles.columnHeaderSortIcon('asc', sortDirection === 'asc')}
        />
      </IconButton>
      <IconButton
        size="small"
        onClick={handleDescClick}
        sx={{
          padding: NUMBERMAP.ZERO,
          color: sortDirection === 'desc' ? 'primary.main' : 'text.secondary',
        }}
      >
        <ExpandMoreIcon
          style={InlineStyles.columnHeaderSortIcon('desc', sortDirection === 'desc')}
        />
      </IconButton>
    </div>
  )
}

const renderColumnHeaderSortIcon =
  (sortModel: GridSortModel, onSortChange: (field: string, direction: 'asc' | 'desc' | null) => void) => (params: { field: string }) => {
    const currentSort = sortModel[0] ?? {}
    const isActive = currentSort.field === params.field
    const sortDirection = isActive ? currentSort.sort : null
    return (
      <ColumnHeaderSortIcon
        sortDirection={sortDirection ?? null}
        isActive={isActive}
        field={params.field}
        onSortChange={onSortChange}
      />
    )
  }


const ActionRow = (col: CustomColDef) =>  {
 return col.field === 'action' || col.field === 'actions' ? {
        ...col,
        sortable: false,
        disableColumnMenu: true,
        filterable: false,
      } : col
}
const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  IdField = 'id',
  checkbox = false,
  loading = false,
  pagination = true,
  handlePageUpdate,
  totalRows,
  customClassName,
  searchValue,
  filterMode = TableFilters.filterModeServer,
}) => {
  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: NUMBERMAP.ZERO,
    pageSize: NUMBERMAP.TEN,
  })

  /**
 * Author: Harsithiga B
 * Date: 23-08-2025
 * Description: Added rows to trigger pagination re-rendering
 * Classification: Confidential
 */
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: NUMBERMAP.ZERO }));
  }, [searchValue, rows]);

  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  })

  // Apply filtering to the data using the extracted filter utility
  const filteredRows = useMemo(() => {
    // Get searchable column field names (exclude action columns and serial number)
    const searchableColumns = columns
      .filter(col => col.field !== DATA_GRID_CONSTANTS.ACTION && col.field !== DATA_GRID_CONSTANTS.ACTIONS && col.field !== DATA_GRID_CONSTANTS.SNO)
      .map(col => col.field)
    
    return applyTableFilters(rows, filterModel, searchValue, searchableColumns)
  }, [rows, filterModel, searchValue])


  // Use the current pagination model without interference
  const validPaginationModel = paginationModel

  // Let the DataGrid handle pagination naturally without interference

  const handlePageChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
    handlePageUpdate?.(model)
  }

  const handleSortChange = (field: string, direction: 'asc' | 'desc' | null) => {
    // Prevent event bubbling to avoid DataGrid's default behavior
    const newSortModel = direction === null ? [] : [{ field, sort: direction }]
    setSortModel(newSortModel)
  }

  const updatedColumns = columns.map((col: CustomColDef) => {
    if (col.field === 'sno') {
      return {
      ...col,
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
         const visibleIndex = params.api.getRowIndexRelativeToVisibleRows(params.id)
          const index = (paginationModel.page * paginationModel.pageSize) + visibleIndex + NUMBERMAP.ONE
          return index
        },
      }
    }
    
    if (col.tooltip) {
    return {
      ...ActionRow(col),
      renderCell: (params: GridRenderCellParams) => {
        const renderedContent = col.renderCell ? col.renderCell(params) : params.value
        return (
          <GenericTooltip content={renderedContent}>  
            {renderedContent}
          </GenericTooltip>
        )
      },
    }
}   
  return ActionRow(col)
  })
  

  return (
    <TableContainer>
      <StyledDataGrid
        getRowId={(row) => row[IdField]}
        rows={filteredRows}
        columns={updatedColumns}
        getRowHeight={() => 'auto'}
        checkboxSelection={checkbox}
        disableRowSelectionOnClick
        sortModel={sortModel}
        filterModel={filterModel}
        filterMode={filterMode}
        paginationModel={validPaginationModel}
        localeText={{
          noRowsLabel: 'No Records Found...',
        }}
        onSortModelChange={setSortModel}
        onFilterModelChange={setFilterModel}
        initialState={{
          pagination: { paginationModel: validPaginationModel },
        }}
        pageSizeOptions={[NUMBERMAP.TEN, NUMBERMAP.TWENTY, NUMBERMAP.FIFTY]}
        slots={{
          footer: TableFooter as any,
          columnHeaderSortIcon: renderColumnHeaderSortIcon(sortModel, handleSortChange),
        }}
        slotProps={{
          footer: {
            paginationModel: validPaginationModel,
            onPaginationModelChange: handlePageChange,
            totalRows: filteredRows.length,
            serverPagination: false,
          } as any,
        }}
        sx={InlineStyles.dataGrid}
        loading={loading}
        getRowClassName={(params: GridRowClassNameParams) => {
          const classes = []

          if (params.row.status === 'inactive') {
            classes.push('inactive')
          }

          if (params.row.isMemberRow) {
            classes.push('member-row')
          }

          if (customClassName && params.row.expandedMarker) {
            classes.push(`${customClassName}${params.row.expandedMarker}`)
          } else if (customClassName) {
            classes.push(`${customClassName}${params.id}`)
          }

          return classes.join(' ')
        }}
      />
    </TableContainer>
  )
}

export default DataTable
