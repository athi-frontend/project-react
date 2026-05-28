import React from 'react'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { DataGridTable } from '@/components/ui'
import { PndReviewStatusRow } from '@/types/modules/dnd/pndReview'
import {
  COLUMN_WIDTH,
  DEFAULT_VALUE,
  PND_REVIEW_STATUS_TABLE,
  PND_REVIEW_STATUS_TITLE,
} from '@/constants/modules/dnd/pnd-review'
import { NUMBERMAP } from '@/constants/common'
import { EDIT_DELETE_CELL_STYLES } from '@/styles/components/ui/datatable'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'
import { Edit, Trash } from 'iconsax-react'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { formatDate } from '@/lib/utils/common'

interface PndReviewStatusTableProps {
  rows: PndReviewStatusRow[]
  onEdit: (row: PndReviewStatusRow) => void
  onDelete: (row: PndReviewStatusRow) => void
  onAdd: () => void
  hasEditPermission: boolean
}

const getRowId = (row: PndReviewStatusRow, index: number) => {
  return row.id ?? `pnd-review-status-${index}`
}

const PndReviewStatusTable: React.FC<PndReviewStatusTableProps> = ({
  rows,
  onEdit,
  onDelete,
  onAdd,
  hasEditPermission,
}) => {
  const rowsWithId = rows.map((row, index) => ({
    ...row,
    id: getRowId(row, index),
  }))

  const columns: GridColDef[] = [
    {
      field: PND_REVIEW_STATUS_TABLE.FIELDNAME.SNO,
      headerName: PND_REVIEW_STATUS_TABLE.HEADERNAME.SNO,
      flex: NUMBERMAP.HALF,
      minWidth: COLUMN_WIDTH.SERIAL_NUMBER,
      sortable: false,
    },
    {
      field: PND_REVIEW_STATUS_TABLE.FIELDNAME.ROLE,
      headerName: PND_REVIEW_STATUS_TABLE.HEADERNAME.ROLE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: PND_REVIEW_STATUS_TABLE.FIELDNAME.DATE,
      headerName: PND_REVIEW_STATUS_TABLE.HEADERNAME.DATE,
      flex: NUMBERMAP.ONE,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
      renderCell: (params) => {
        if (!params.value) return DEFAULT_VALUE
        return formatDate(params.value)
      },
    },
    {
      field: PND_REVIEW_STATUS_TABLE.FIELDNAME.STATUS,
      headerName: PND_REVIEW_STATUS_TABLE.HEADERNAME.STATUS,
      flex: NUMBERMAP.ONE_HALF,
      minWidth: COLUMN_WIDTH.TEXT_FIELD,
      renderCell: (params) => {
        const statusValue = params.row?.status_id
        if(params?.row?.transition_name)
          return params?.row?.transition_name
        else
          return <StatusTypography value={Number(statusValue)}/>
      },
    },
    {
      field: PND_REVIEW_STATUS_TABLE.FIELDNAME.ACTION,
      headerName: PND_REVIEW_STATUS_TABLE.HEADERNAME.ACTION,
      flex: NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as PndReviewStatusRow
        const isInactive = Number(row?.status_id) === NUMBERMAP.TWO

        return (
          <Box sx={EDIT_DELETE_CELL_STYLES}>
            <IconButton
              onClick={() => onEdit(row)}
              disabled={!hasEditPermission}
            >
              <Edit
                size={NUMBERMAP.EIGHTEEN}
                color={DATA_GRID_CONSTANTS.EDIT_ICON_COLOR}
              />
            </IconButton>
            <IconButton
              onClick={() => !isInactive && onDelete(row)}
              disabled={isInactive || !hasEditPermission}
            >
              <Trash
                size={NUMBERMAP.EIGHTEEN}
                color={
                  isInactive ? 'gray' : DATA_GRID_CONSTANTS.DELETE_ICON_COLOR
                }
              />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
      <DataGridTable
        title = {PND_REVIEW_STATUS_TITLE}
        showAddButton
        onAddRow={onAdd}
        rows={rowsWithId}
        columns={columns}
        idField="id"
        hideFooter
      />
  )
}

export default PndReviewStatusTable
