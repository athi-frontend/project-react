'use client'
import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { ACTIONS_FIELD } from '@/constants/designTeamConstants'
import { StageResourceSectionProps } from '@/types/modules/dnd/projectPlan'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { designTeamSectionStyles } from '@/styles/modules/dnd/projectPlan'
import { DataGridTable } from '@/components/ui'
import {
  STAGE_RESOURCE_COLUMNS,
  STAGE_RESOURCE_TITLE,
  ID_FIELDS,
  SCHEDULE_COLUMNS,
} from '@/constants/modules/dnd/projectPlan'
import { Edit } from 'iconsax-react'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'
import { NUMBERMAP } from '@/constants/common'

const StageResourceSection: React.FC<StageResourceSectionProps> = ({
  title = STAGE_RESOURCE_TITLE,
  stageResourceData = [],
  onEdit,
}) => {
  const updatedColumns = STAGE_RESOURCE_COLUMNS.map((column) => {
    if (column.field === ACTIONS_FIELD) {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => (
          <IconButton onClick={() => onEdit(params.row.project_stage_order_id,params.row)}>
            <Edit
              size={NUMBERMAP.EIGHTEEN}
              color={DATA_GRID_CONSTANTS.EDIT_ICON_COLOR}
            />
          </IconButton>
        ),
      }
    }
    if (column.field === SCHEDULE_COLUMNS.STAGE_NAME) {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => (
          <div>{`${params.row.stage} ${params.row.stage_number}`}</div>
        ),
      }
    }
    return column
  })

  return (
    <Box>
      <Typography sx={designTeamSectionStyles.title}>{title}</Typography>
      <DataGridTable
        columns={updatedColumns}
        rows={stageResourceData}
        hideFooter={true}
        idField={ID_FIELDS.PROJECT_STAGE_ORDER_ID}
      />
    </Box>
  )
}

export default StageResourceSection
