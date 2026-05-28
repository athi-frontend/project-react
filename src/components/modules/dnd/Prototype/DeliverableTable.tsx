'use client'
import React from 'react'
import { TextField } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import DataGridTable from '@/components/ui/data-grid-table/DataGridTable'
import {
  TableWrapper,
  TableTitle,
} from '@/styles/components/modules/table'
import { DeliverableTableProps } from '@/types/components/modules/prototypeForm'
import { NUMBERMAP } from '@/constants/common'
import { getDeliverableColumns, PROTOTYPE_FORM_CONSTANTS } from '@/constants/components/ui/prototypeForm'
import { designInputAdequacyStyles } from '@/styles/modules/dnd/designInputAdequacyChecklist'

const DeliverableTable: React.FC<DeliverableTableProps> = ({
  deliverables,
  onRowChange,
  disabled = false,
}) => {
  const renderCommentsCell = (params: GridRenderCellParams) => {
    return (
        <TextField
          fullWidth
          multiline
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.stopPropagation()
            }
          }}
          value={params.row.comments ?? ''}
          onChange={(e) => {
            const newRow = { ...params.row, comments: e.target.value }
            if (onRowChange) {
              const updatedRows = deliverables.map((row) =>
                row.id === newRow.id ? newRow : row
              )
              onRowChange(updatedRows)
            }
          }}
          sx={designInputAdequacyStyles.textField}
          placeholder={PROTOTYPE_FORM_CONSTANTS.COMMENTS_PLACEHOLDER}
          disabled={disabled}
        />
    )
  }

  const columns = getDeliverableColumns(renderCommentsCell)

  return (
    <TableWrapper>
      <TableTitle>Execution DIR's</TableTitle>
      <DataGridTable
        columns={columns}
        rows={deliverables}
        hideFooter={true}
        autoHeight={true}
        disableColumnMenu={true}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        disableSelectionOnClick={true}
        getRowHeight={() =>(NUMBERMAP.TEN*NUMBERMAP.SEVEN)}
        idField="id"
        onRowChange={(newRow) => {
          if (onRowChange) {
            const updatedRows = deliverables.map((row) =>
              row.id === newRow.id ? newRow : row
            )
            onRowChange(updatedRows)
          }
        }}
      />
    </TableWrapper>
  )
}

export default DeliverableTable
