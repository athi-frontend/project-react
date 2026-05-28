'use client'
import React from 'react'
import { Box, Checkbox, useTheme } from '@mui/material'
import {
  FINAL_DESIGN_TRANSFER,
  PRE_TRANSFER,
  DESIGN_TRANSFER_COLUMNS,
  DESIGN_TRANSFER_TITLE,
} from '@/constants/modules/dnd/projectPlan'
import { DesignTransferProps } from '@/types/modules/dnd/projectPlan'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { DataTable } from '../../../ui'
import { CONTENT_MODE } from '@/constants/common'
import { ID_FIELD } from '@/constants/modules/dnd/formTeam'
const { CENTER } = CONTENT_MODE

const DesignTransferSection: React.FC<DesignTransferProps> = ({
  title = DESIGN_TRANSFER_TITLE,
  designTransferData = [],
}) => {
  const theme = useTheme()

  const updatedColumns = DESIGN_TRANSFER_COLUMNS.map((column) => {
    if (column.field === PRE_TRANSFER) {
      return {
        ...column,
        headerAlign: CENTER,
        align: CENTER,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Checkbox
            checked={Boolean(params.row.pre_transfer)}
            disabled={true}
            color={theme.palette.primary.main}
          />
        ),
      }
    }
    if (column.field === FINAL_DESIGN_TRANSFER) {
      return {
        ...column,
        headerAlign: CENTER,
        align: CENTER,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Checkbox
            checked={Boolean(params.row.final_design_transfer)}
            disabled={true}
            color={theme.palette.primary.main}
          />
        ),
      }
    }
    return column
  })

  return (
    <Box>
      {/* <Typography sx={designTeamSectionStyles.title}>{title}</Typography> */}
      <DataTable
        columns={updatedColumns}
        rows={designTransferData}
        IdField={ID_FIELD}
      />
    </Box>
  )
}

export default DesignTransferSection
