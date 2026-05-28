import React from 'react'
import { IconButton, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { TableData } from '@/types/modules/dnd/formTeam'
import { NUMBERMAP } from '@/constants/common'

interface TeamActionsProps {
  row: TableData
  teamsData: { data: TableData[] }
  handleEdit: (team: TableData | undefined) => void
  handleDelete: (id: number) => void
  isDeleting: boolean
}

export const TeamActions: React.FC<TeamActionsProps> = ({
  row,
  teamsData,
  handleEdit,
  handleDelete,
  isDeleting,
}) => {
  const team = teamsData.data.find((team) => team['design_team_id'] === row.id)

  return (
    <>
      <IconButton onClick={() => handleEdit(team)}>
        <EditIcon color="primary" />
      </IconButton>
      <IconButton onClick={() => handleDelete(row.id)} disabled={isDeleting}>
        {isDeleting ? (
          <CircularProgress size={NUMBERMAP.TWENTYFOUR} />
        ) : (
          <DeleteIcon color="error" />
        )}
      </IconButton>
    </>
  )
}

interface GetTeamHeadersParams {
  teamsData: { data: TableData[] }
  handleEdit: (team: TableData) => void
  handleDelete: (id: number) => void
  isDeleting: boolean
}

export const getTeamHeaders = ({
  teamsData,
  handleEdit,
  handleDelete,
  isDeleting,
}: GetTeamHeadersParams) => [
  { headerName: 'Role', field: 'role' },
  { headerName: 'User', field: 'user' },
  { headerName: 'Responsibility', field: 'responsibility' },
  { headerName: 'Stage', field: 'responsibility' },
  {
    headerName: 'Actions',
    field: 'actions',
    action: (row: TableData) => (
      <TeamActions
        row={row}
        teamsData={teamsData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
      />
    ),
  },
]
