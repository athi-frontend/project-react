import { TableProps } from '@/types/components/ui/table'
import { GridRenderCellParams } from '@mui/x-data-grid'

export interface StageRow {
  id: string
  stage_id: string
  stage_name: string
  type_of_stage: string
  status_of_stage: string
}

export interface VerificationTableProps extends TableProps {
  projectStageOrderId: number
}

export interface ColumnDefinition {
  field: string
  headerName: string
  width: number
  sortable?: boolean
  renderCell?: (params: GridRenderCellParams) => React.ReactNode
}

export interface StageListResponse {
  data: StageRow[]
  rowsAffected: {
    total_count: number
  }
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface StageHookResult {
  data: StageListResponse
  isLoading: boolean
  error: string
}

export interface DeleteStageHookResult {
  mutate: (id: string) => void
  isLoading?: boolean
  error?: string
}

export interface ProjectStagesFormData {
  stage: string
  typeOfStage: string
  numberOfStages: string
  stageName?: string
  activity?: string
  design_stage: string
  stage_id: string
  stage_count?: string
}

export interface VerificationPlanFormData {
  dir_id: number | null
  numberOfUnits: string
  verification_plan: string
  acceptance_criteria: string
}

export interface ProtocolModalProps {
  onSave: (data?: VerificationPlanFormData) => void
  onClose: () => void
  open: boolean

  initialData?: {} | string | number
}

export interface ProjectStageResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: {
    dataFetch: Array<{
      project_stage_order_id: number
      project_stage_id: number
      stage: string
      stage_order: number
      stage_number: number
    }>
    pagination: {
      total_pages: number
      total_count: number
      current_page: number
      page_size: number
      next_page: string | null
      prev_page: string | null
      first_page: string
      last_page: string
    }
  }
}

export interface StageDropdownItem {
  design_stage: string
  stage_id: number
  [key: string]: string | number | null
}

export interface StageDropdownResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: StageDropdownItem[]
}

export interface CreateProjectStageData {
  project_id: number
  stage_id: number | null
  stage_count: number
  activities?: string[]
  stage_name?: string
}

export interface UpdateProjectStageData {
  project_id: number
  stage_id: number | null
  stage_count: number
  activities?: Activities[]
  stage_name?: string
}

export interface Activities{
  activity_id: number
  activity_name: string
  status?: string | number
}

export interface PrototypeResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: Array<{
    project_stage_order_id: number
    id: number
    description: string
    other_details: string
    additional_design_quality_requirement: string
    conclusion: string
    comments: string
    remarks?: string
    advisory?: string
    verification_method?: string
    regulatory_applicable?: number
    quality_objective: string | null
    design_stage: string
    stage_number: number
    units_to_be_verified: number
    item_for_test: Array<{
      id: number
      batch_number: string
      batch_name: string
    }>
    execution_dir?: Array<{
      execution_stage_deliverables_id: number
      comments: string
      dir_category?: string
      dir_id?: string
    }>
    deliverables: Array<{
      id: number
      status: number
      dir_id: string
      dir_category: string
    }>
    members: Array<{
      id: number
      employee_id: number
      firstName: string
      lastName: string
    }>
    owner_first_name: string
    owner_last_name: string
  }>
}

export interface UpdatePrototypeData {
  description: string
  other_details: string
  additional_design_quality_requirement: string
  conclusion: string
  comments: string
  units_to_be_verified: number
  item_for_test: Array<{
    batch_number: string | number
    batch_name: string
  }>
  execution_dir: Array<{
    execution_stage_deliverables_id: number
    comments: string
  }>
  verification_method?: string
  regulatory_applicable?: number
  advisory?: string
}

export interface DirItem {
  dir_id: any
  design_input_requirement_id: number
  dir_name: string
}

export interface DirDropdownResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: DirItem[]
  rowsAffected: {
    total_pages: number
    total_count: number
    current_page: number
    page_size: number
    next_page: string | null
    prev_page: string | null
    first_page: string
    last_page: string
  }
}

export interface CreateVerificationPlanData {
  dir_id: number
  units_to_be_verified: number
  acceptance_criteria: string
  verification_plan: string
  project_stage_order_id: number
}

export interface VerificationPlanItem {
  verification_plan_id: number
  dir_id: string | null
  design_input_requirement_id: number | null
  stage_deliverable_id: number
  units_to_be_verified: number
  verification_plan: string
  acceptance_criteria: string
}

export interface VerificationPlanResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: VerificationPlanItem[]
}

export interface VerificationPlanByIdResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description?: string
  data: {
    verification_plan_id?: number
    dir_id: string
    dir_name: string | null
    design_input_requirement_id: number
    stage_deliverable_id?: number
    units_to_be_verified: number | null
    verification_plan: string
    acceptance_criteria: string | null
    execution_plan_id?: number
    project_id: number
    status: string | number | null
    verification_stage_id?: number | null
    supporting_documents?: any[]
    dir?: Array<{
      id: number
      dir_id: string
      dir_unit: string
      dir_value: string
    }>
    dir_category?: Array<{
      id: number
      dir_id: string
      dir_category: string
    }>
    dir_units?: Array<{
      id: number
      dir_id: string
      dir_unit: string
      dir_value: string
    }>
    fk_eqms_execution_stage_id?: number
  }
}

export interface UpdateVerificationPlanData {
  dir_id: number
  units_to_be_verified: number
  acceptance_criteria: string
  verification_plan: string
  project_stage_order_id: number
  execution_plan_id?: number | null
  verification_stage_id?: number | null
}

export interface PrototypeDataItem {
  description: string
  other_details: string
  additional_design_quality_requirement: string
  conclusion: string
  comments: string
  verification_method: string
  regulatory_applicable: number
  advisory: string
  owner_first_name: string
  owner_last_name: string
  members: Array<{
    firstName: string
    lastName: string
  }>
  quality_objective: string
  design_stage: string
  deliverables: Array<{
    id: number
    dir_category: string
    dir_id: string
    status: number
  }>
}

export interface PrototypeDataResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: PrototypeDataItem[]
}