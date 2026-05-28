'use client'
import React from 'react'
import { Box, IconButton } from '@mui/material'
import {
  DESIGN_TEAM_COLUMNS,
  DEFAULT_TITLE,
  ACTIONS_FIELD,
  KEY_FIELD,
} from '@/constants/designTeamConstants'
import { DesignTeamSectionProps } from '@/types/modules/dnd/projectPlan'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { DataGridTable, showActionAlert } from '../../../ui'
import { Edit, Trash } from 'iconsax-react'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'
import { TeamResponse } from '@/types/modules/dnd/formTeam'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { useDeleteTeam } from '@/hooks/modules/dnd/useFormTeam'
import { NUMBERMAP } from '@/constants/common'

const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS

const DesignTeamSection: React.FC<DesignTeamSectionProps> = ({
  title = DEFAULT_TITLE,
  designTeamData = [],
  onEdit,
  onDelete,
}) => {
  const { mutate: deleteTeam } = useDeleteTeam()

  const teamData: TeamResponse[] = designTeamData?.map(
    (team: TeamResponse) => ({
      id: team.design_team_id,
      role: team.role,
      role_name: team.role_name,
      user: team.user,
      user_name:
        team.other_resource ??
        `${team.first_name ?? ''} ${team.last_name ?? ''}`.trim(),
      responsibility: team.responsibility ?? '',
      responsibility_description: team.responsibility_description ?? '',
      stage_name: `${team.stage ?? ''} ${team.stage_number ?? ''}`,
      project_stage_order_id: team.project_stage_order_id,
      start_date: team.start_date ?? '',
      end_date: team.end_date ?? '',
      status: team.status,
      project_id: team.project_id,
      design_team_id: team.design_team_id,
    })
  )

  const updatedColumns = DESIGN_TEAM_COLUMNS.map((column) => {
    if (column.field === ACTIONS_FIELD) {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <IconButton onClick={() => onEdit(params.row.id)}>
              <Edit
                size={NUMBERMAP.EIGHTEEN}
                color={DATA_GRID_CONSTANTS.EDIT_ICON_COLOR}
              />
            </IconButton>
            <IconButton onClick={() => handleDeleteTeam(params.row.id)}>
              <Trash
                size={NUMBERMAP.EIGHTEEN}
                color={DATA_GRID_CONSTANTS.DELETE_ICON_COLOR}
              />
            </IconButton>
          </>
        ),
      }
    }
    return column
  })

  const handleDeleteTeam = (teamId: number): void => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        deleteTeam(teamId, {
          onSuccess: () => {
            showActionAlert(SUCCESS_ALERT)
            onDelete()
          },
          onError: () => {
            showActionAlert(FAILED_ALERT)
          },
        })
      }
    })
  }
  return (
    <Box>
      <DataGridTable
        columns={updatedColumns}
        rows={teamData}
        hideFooter={true}
        idField={KEY_FIELD}
      />
    </Box>
  )
}

export default DesignTeamSection
