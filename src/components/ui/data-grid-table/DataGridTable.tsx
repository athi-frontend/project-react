/**
 * Classification: Confidential
 */

import React from 'react'
import { Box, IconButton, Checkbox, SxProps, Theme } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowClassNameParams,
  GridRowsProp,
} from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { Download } from '@mui/icons-material'
import { Edit, Trash } from 'iconsax-react'

import {
  TableContainer,
  HeaderContainer,
  HeaderTitle,
  StyledTextField,
  AddButton,
  FontSize24,
  tableOverFlow,
} from '@/styles/components/ui/commonTable'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'
import {
  HEADER_ICON_STYLES,
  EDIT_DELETE_CELL_STYLES,
  TEXT_FIELD_STYLES,
  DATA_GRID_STYLES,
  downloadStyles,
  COLUMN_HEADER_TITLE_STYLES,
  COLUMN_HEADER_STYLES,
  COLUMN_HEADERS_STYLES,
  DATA_GRID_CELL_STYLES,
} from '@/styles/components/ui/datatable'
import { fullWidth } from '@/styles/components/ui/layout'
import { NUMBERMAP } from '@/constants/common'
import { CustomColDef } from '@/types/components/modules/dirSpecifications'
import { GenericTooltip } from '../tooltip/Tooltip'

/**
    Classification : Confidential
**/
export interface DataGridTableProps {
  title?: string
  columns: GridColDef[]
  rows: GridRowsProp
  idField?: string
  onAddRow?: () => void
  onEditRow?: (row: any) => void
  onDeleteRow?: (id: string) => void
  onRowChange?: (row: any) => void
  showAddButton?: boolean
  hideFooter?: boolean
  autoHeight?: boolean
  getRowHeight?: () => number
  disableColumnMenu?: boolean
  disableColumnFilter?: boolean
  disableColumnSelector?: boolean
  disableDensitySelector?: boolean
  disableSelectionOnClick?: boolean
  checkboxSelection?: boolean
  hideHeader?: boolean
  loading?: boolean
  customClassName?: string
  enableTableOverflow?: boolean
  showColumnLines?: boolean
  customCellStyles?: SxProps
}

export const renderEditDeleteCell = (
  params: GridRenderCellParams,
  onEdit: (row: any) => void,
  onDelete: (id: string) => void,
  onDownload?: (row: any) => void
) => {
  return (
    <Box sx={EDIT_DELETE_CELL_STYLES}>
      {onDownload && (
        <IconButton
          aria-label={DATA_GRID_CONSTANTS.DOWNLOAD_ICON_ARIA_LABEL}
          data-testid={`download-icon-${params.row.id}`}
          onClick={(e) => {
            e.stopPropagation()
            onDownload(params.row)
          }}
          size="small"
          sx={downloadStyles.icon}
        >
          <Download style={FontSize24} />
        </IconButton>
      )}
      <IconButton onClick={() => onEdit(params.row)} size="small">
        <Edit
          size={NUMBERMAP.EIGHTEEN}
          color={DATA_GRID_CONSTANTS.EDIT_ICON_COLOR}
        />
      </IconButton>
      <IconButton onClick={() => onDelete(params.id.toString())} size="small">
        <Trash
          size={NUMBERMAP.EIGHTEEN}
          color={DATA_GRID_CONSTANTS.DELETE_ICON_COLOR}
        />
      </IconButton>
    </Box>
  )
}

export const renderCheckboxCell = (
  params: GridRenderCellParams,
  onChange: (row: any) => void
) => {
  return (
    <Checkbox
      checked={params.value === DATA_GRID_CONSTANTS.CHECKBOX_CHECKED_VALUE}
      onChange={(e) => {
        const newRow = {
          ...params.row,
          [params.field]: e.target.checked
            ? DATA_GRID_CONSTANTS.CHECKBOX_CHECKED_VALUE
            : DATA_GRID_CONSTANTS.CHECKBOX_UNCHECKED_VALUE,
        }
        onChange(newRow)
      }}
    />
  )
}

export const renderTextFieldCell = (
  params: GridRenderCellParams,
  onChange: (row: any) => void
) => {
  return (
    <StyledTextField
      fullWidth
      sx={TEXT_FIELD_STYLES}
      value={params.value ?? ''}
      onChange={(e) => {
        const newRow = { ...params.row, [params.field]: e.target.value }
        onChange(newRow)
      }}
      placeholder={DATA_GRID_CONSTANTS.TEXT_FIELD_PLACEHOLDER_PREFIX}
      variant="outlined"
      size="small"
    />
  )
}

const DataGridTable: React.FC<DataGridTableProps> = ({
  title,
  columns,
  rows,
  onAddRow,
  idField,
  onEditRow,
  onDeleteRow,
  onRowChange,
  showAddButton = false,
  hideFooter = false,
  autoHeight = true,
  getRowHeight,
  disableColumnMenu = true,
  disableColumnFilter = true,
  disableColumnSelector = true,
  disableDensitySelector = true,
  disableSelectionOnClick = true,
  checkboxSelection = false,
  hideHeader = false,
  loading = false,
  customClassName,
  enableTableOverflow = false,
  showColumnLines = false,
  customCellStyles,
}) => {
  // Inject custom row number logic if `sno` column exists
  const updatedColumns = columns.map((col : CustomColDef) => {
    if(col.field === 'sno'){
       return {
          ...col,
          renderCell: (params: GridRenderCellParams) => {
            const index = params.api.getAllRowIds().indexOf(params.id)
            return index + NUMBERMAP.ONE
          },
        }
      }

      if (col.tooltip) {
          return {
            ...col,
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
      
      return col
    }    
  )
  return (
    <Box sx={fullWidth}>
      {!hideHeader && (title ?? showAddButton) && (
        <HeaderContainer>
          {title && <HeaderTitle>{title}</HeaderTitle>}
          {showAddButton && onAddRow && (
            <AddButton variant="outlined" onClick={onAddRow}>
              <AddIcon sx={HEADER_ICON_STYLES} />
              <span>{DATA_GRID_CONSTANTS.ADD_NEW_BUTTON}</span>
            </AddButton>
          )}
        </HeaderContainer>
      )}
      <TableContainer>
        <DataGrid
          rows={rows}
          getRowHeight={() => 'auto'}
          columns={updatedColumns}
          getRowId={(row) => row[idField ?? 'id']}
          disableColumnResize
          disableColumnMenu={disableColumnMenu}
          disableColumnFilter={disableColumnFilter}
          disableColumnSelector={disableColumnSelector}
          disableDensitySelector={disableDensitySelector}
          disableRowSelectionOnClick
          checkboxSelection={checkboxSelection}
          disableColumnSorting
          autoHeight={autoHeight}
          localeText={{
            noRowsLabel: 'No Records Found...',
          }}
          hideFooter={hideFooter}
          hideFooterPagination={hideFooter}
          hideFooterSelectedRowCount={hideFooter}
          loading={loading}
          processRowUpdate={(newRow, oldRow) => {
            if (onRowChange) {
              onRowChange(newRow)
            }
            return newRow
          }}
          sx={{
            ...(enableTableOverflow ? tableOverFlow : {}),
            '& .MuiDataGrid-columnHeaderTitle': COLUMN_HEADER_TITLE_STYLES,
            '& .MuiDataGrid-columnHeader': COLUMN_HEADER_STYLES,
            '& .MuiDataGrid-columnHeaders': COLUMN_HEADERS_STYLES,
            '& .MuiDataGrid-cell--editing': {
              bgcolor: DATA_GRID_STYLES.EDITING_CELL_BG,
              color: DATA_GRID_STYLES.EDITING_CELL_COLOR,
            },
            '& .Mui-error': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? DATA_GRID_STYLES.ERROR_CELL_BG_DARK
                  : DATA_GRID_STYLES.ERROR_CELL_BG_LIGHT,
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? DATA_GRID_STYLES.ERROR_CELL_COLOR_DARK
                  : DATA_GRID_STYLES.ERROR_CELL_COLOR_LIGHT,
            },
            '& .MuiDataGrid-cell': {
              ...DATA_GRID_STYLES.CELL_STYLES,
              ...DATA_GRID_CELL_STYLES,
              ...(customCellStyles ?? {}),
            },
            ...(showColumnLines && {
              '& .MuiDataGrid-cell + .MuiDataGrid-cell': {
                borderInlineStart: (theme) =>
                  `1px solid ${theme.palette.text.disabled}`,
              },
              '& .MuiDataGrid-columnHeader + .MuiDataGrid-columnHeader': {
                borderInlineStart: (theme) =>
                  `1px solid ${theme.palette.text.disabled}`,
              },
            }),
          } as SxProps<Theme>}
          getRowClassName={(params: GridRowClassNameParams) => {
            const classes = []

            if (params.row.status === 'inactive') {
              classes.push('inactive')
            }

            if (customClassName) {
              classes.push(`${customClassName}${params.id}`)
            }

            return classes.join(' ')
          }}
        />
      </TableContainer>
    </Box>
  )
}

export default DataGridTable
