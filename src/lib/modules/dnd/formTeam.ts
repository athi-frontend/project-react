export const HEADERS = [
  { headerName: 'Role', field: 'role' },
  { headerName: 'Users', field: 'user' },
  { headerName: 'Responsibility', field: 'responsibility' },
  { headerName: 'Stage', field: 'stage_name' },
  { headerName: 'Actions', field: 'Actions' },
]
import { TeamData, UpdateTeamData } from '@/types/modules/dnd/formTeam'

export const prepareSaveTeamPayload = (teamData: TeamData) => {
  return {
    ...(teamData.other_resource && { other_resource: teamData.other_resource }),
    ...(teamData.user && { user: Number(teamData.user) }),
    project_id: teamData.project_id,
    role: teamData.role ? Number(teamData.role) : 0,
    responsibility: teamData.responsibility,
    responsibility_description: teamData.responsibility_description,

    project_stage_order_id: teamData.project_stage_order_id
      ? Number(teamData.project_stage_order_id)
      : 0,
    start_date: teamData.start_date,
    end_date: teamData.end_date,
    status: teamData.status,
  }
}

export const prepareUpdateTeamPayload = (updatedData: UpdateTeamData) => {
  return {
    ...(updatedData.other_resource && {
      other_resource: updatedData.other_resource,
    }),
    ...(updatedData.user && { user: Number(updatedData.user) }),
    project_id: updatedData.project_id,
    role: updatedData.role ? Number(updatedData.role) : 0,
    responsibility: updatedData.responsibility,
    responsibility_description: updatedData.responsibility_description,
    project_stage_order_id: updatedData.project_stage_order_id
      ? Number(updatedData.project_stage_order_id)
      : 0,

    start_date: updatedData.start_date,
    end_date: updatedData.end_date,
    status: updatedData.status,
    modified_by: updatedData.modified_by,
  }
}
