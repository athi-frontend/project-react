/**
 Classification : Confidential
**/

export interface FormTeamComponentProps {}

export interface TableComponentProps {
  data: Array<{
    [key: string]: string
  }>
  headers: Array<{
    headerName: string
    field: string
    action: React.ReactNode | null
  }>
}

export interface TableRowComponentProps {
  data: {
    [key: string]: string
  }
  headers: Array<{
    headerName: string
    field: string
    action: React.ReactNode | null
  }>
}

export interface AddRowButtonProps {
  title: string
  onClick: () => void
}

export interface TableData {
  id: number
  specification: string
  description: string
  applicable_status: number
}

export interface FormData {
  role: string
  user: string
  responsibility: string
  project_id: number
  design_team_id: number
}

export interface FormTeamProps {
  open: boolean
  onClose: () => void
  onSave: (formData: FormData) => void
  teamToEdit?: FormData & { id: number }
}
export interface UpdateTeamData {
  design_team_id: number
  project_id: number
  role: string
  user: string
  responsibility: string
  status: number
  modified_by: number
}

export interface TeamData {
  role: string | number
  user: string | number
  responsibility: string
  project_id: number
}
export interface Option {
  id: string | number
  roleName: string
}
export interface FetchTeamsParams {
  queryKey: [string, number]
}

export interface SpecificationResponse {
  id: number
  tenant_id: number
  entity_id: number
  specification_type: string
  default_applicability: number
  description: string
  specification_applicability_id: number
  applicable_status: number
  design_specification_type_id: number
}

export interface SpecificationPayloadItem {
  specification_id: string
  is_applicable: number
}

export interface RegulationMarketResponse {
  data: RegulationMarketData[]
  action_control: {
    formType?: string
    formId?: string
    menuId?: string
    formName?: string
    permissions: Array<{
      action: string
      trigger_status_id?: number
    }>
  }
}

export interface RegulationMarketData {
  id: number
  name: string
  status: string
  [key: string]: any
}

export interface RegulationMarketPrefillResponse {
  data: {
    regulations: number[]
    markets: number[]
  }
}