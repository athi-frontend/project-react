import type { GridRenderCellParams } from '@mui/x-data-grid';

export interface FormTeamModalData {
    role: string
    resource: string
    responsibility: string
    status: string
  }
  
  export interface FormTeamModalSaveData extends FormTeamModalData {
    role_name: string
    employee_name: string
  }
  
  export interface FormTeamModalProps {
    open: boolean
    onClose: () => void
    onSave: (data: FormTeamModalSaveData) => void
    mode?: 'add' | 'edit'
    initialData?: FormTeamModalData
    existingRows?: FormTeamTableRow[]
    editingRowId?: number | string
  }
  
  export interface FormTeamRow extends FormTeamModalData {
    id: string
    teamDetailsId?: number // For updates
  }
  
  export interface FormErrors {
    teamName?: string
    formTeam?: string
    remark?: string
  }
  
  // API Payload Types
  export interface TeamDetailPayload {
    team_details_id?: number // Optional, only for updates
    role_id: number
    employee_id: number
    responsibility_description: string
    status_id: number
  }
  
  export interface FormTeamPostPayload {
    project_id: number
    team_name: string
    remarks: string
    team_details: TeamDetailPayload[]
  }
  
  // API Response Types
  export interface FormTeamResponse {
    project_id: number
    team_name: string
    remarks: string
    team_details: {
      team_details_id?: number
      role_id: number
      employee_id: number
      responsibility_description: string
      status_id: number
    }[]
  }
  
  // Organization status type for dropdown/common organization statuses
  export interface OrganizationStatus {
    status_id: number;
    status_name: string;
    // add other fields if needed
  }
  
  // FormTeamData: Top-level object for extractFormTeamData (API response shape, flexible to array or object)
  export type FormTeamDataResponse = FormTeamResponse | FormTeamResponse[]

  // Extracted team details (used in updateRowsFromTeamDetails): can be array or undefined
  export type TeamDetailsType = FormTeamResponse["team_details"] | undefined

  // Generic object for grid row, but strongly typed fields
  export interface DataGridRow {
    id: string;
    role: string;
    resource: string;
    responsibility: string;
    status: string;
    teamDetailsId?: number;
  }
  
  // Custom type for DataGrid renderCell params matching grid row
  export type DataGridRenderCellParams = GridRenderCellParams<DataGridRow, any, any>;
  
  export interface Role {
  [key: string]: string | number | null | undefined;
}

  // Row type for the DataGrid table in the component
  export interface FormTeamTableRow {
    team_details_id: number | string // Can be number (from API) or string (temporary ID for new rows)
    role_id: number
    role_name: string
    employee_id: number
    employee_name: string
    responsibility_description: string
    status_id: number
  }

  // Type for editing row (combines table row with modal data)
  export type EditingRow = (FormTeamTableRow & Partial<FormTeamModalData>) | null

  // Custom type for DataGrid renderCell params matching FormTeamTableRow
  export type FormTeamTableRowRenderCellParams = GridRenderCellParams<FormTeamTableRow, any, any>
  
  