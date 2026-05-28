export interface FormTeamComponentProps {}

export interface TableComponentProps {
  data: Array<{
    [key: string]: string | React.ReactNode
  }>
  headers: Array<{
    headerName: string
    field: string
    action?: (row: TableData) => React.ReactNode
  }>
}

export interface TableRowComponentProps {
  data: {
    [key: string]: string | React.ReactNode
  }
  headers: Array<{
    headerName: string
    field: string
    action?: (row: TableData) => React.ReactNode
  }>
}

export interface AddRowButtonProps {
  title: string
  onClick: () => void
}

export interface Role {
  role_id: number
  role_name: string
}

export interface User {
  id: number
  firstName?: string
  lastName?: string
  nick_name?: string
}

export interface Responsibility {
  responsibility: string
}

export interface Stage {
  project_stage_order_id: number
  design_stage: string
}

export interface TeamResponse {
  design_team_id: number
  role: number
  role_name?: string
  user: number
  first_name?: string
  last_name?: string
  other_resource?: string
  responsibility?: string
  responsibility_description?: string

  stage?: string
  project_stage_order_id: number
  start_date?: string
  end_date?: string
  status?: number
  project_id: number
}

export interface TableData {
  id: number | string
  role: number | string
  role_name?: string
  user: number | string
  user_name?: string
  other_resource?: string
  responsibility?: string
  project_stage_order_id: number | string
  responsibility_description?: string
  stage_id: number | string
  stage_name: string
  start_date?: string
  end_date?: string
  status: number
  project_id: number | string
  design_team_id: number | string
  modified_by: number | string
}

export interface FormData {
  role: number | string
  user: number | string
  other_resource: number | string
  responsibility: string
  responsibility_description: string
  project_id: number | string
  design_team_id?: number | string
  stage_id: number | string
  project_stage_order_id: number | string
  start_date: string
  stage_name: string
  end_date: string
  status: number
}

export interface FormTeamProps {
  open: boolean
  onClose: () => void
  onSave?: (formData: TableData) => void
  teamToEdit?: TableData
  hasEditPermission?: boolean
}

export interface UpdateTeamData {
  design_team_id: number | string
  project_id: number | string
  role: number | string
  responsibility: string
  responsibility_description: string
  project_stage_order_id: number | string

  start_date: string
  end_date: string
  stage_name: string
  status: number
  modified_by: number | string
  other_resource?: string
  user?: number | string
}

export interface TeamData {
  role: number | string
  responsibility?: string
  responsibility_description: string
  project_id: number | string
  project_stage_order_id: number | string

  start_date: string
  end_date: string
  status: number | string
  other_resource?: string
  user?: number | string
}

export interface Option {
  id: string | number
  roleName: string
}

export interface FetchTeamsParams {
  queryKey: [string, number]
}
