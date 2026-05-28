import { FileDocument } from '@/types/components/ui/fileUploadV3'
import { GridColDef } from '@mui/x-data-grid'

export interface Task {
  activity_id: number
  activity: string
  activity_start_date: Date
  activity_end_date: Date
}

export interface Stage {
  project_build_stage_order_id: number
  stage_id: number
  stage_name: string
  stage_order: number
  design_stage_id: number
  activity: Task[]
}

export interface MarketRegulation {
  regulation_id: number
  regulation_name: string
  market_id: number
  market_name: string
}

export interface ProjectFormData {
  designType: string
  basicModel: string
  designObjective: string
  marketsIntended: MarketRegulation[]
  riskManagement: string
  verificationMethod: string
  validationMethod: string
  otherDetails: string
  traceabilityMethod: string
  toolsRequired: string[]
  tools: string[] | number[]
  equipmentsRequired: string[]
  equipments: string[] | number[]
  models: string[]
  projectStages: ProjectStage[]
  stageResources: ProjectStage[]
  designTeam: DesignTeamResponse[]
  designTransfer: DesignTransfer[]
  documentReferences: DocumentReference[] 
  schedule: Stage[]
  uploadedFile: File[] | FileDocument[]
  documentIdToDelete: number[]
  stageData: ProjectStage[]
}

export type FormErrors = Partial<
  Record<keyof ProjectFormData | 'schedule', string>
>

export type StringFormField = keyof Omit<
  ProjectFormData,
  'tools' | 'designTransfer' | 'documentReferences' | 'equipments'
>
export type ArrayFormField =
  | 'tools'
  | 'designTransfer'
  | 'documentReferences'
  | 'equipments'

export interface FormFieldConfig {
  field: keyof ProjectFormData
  label: string
  placeholder: string
  required?: boolean
  type: string
  idField?: string
  valueField?: string
  disabled?: boolean
}

export interface FieldMapping {
  field: keyof ProjectFormData
  name: string
}

export interface ButtonConfig {
  label: string
  onClick?: () => void
  handlerKey?: string
}

export interface DesignTeamMember {
  id?: number
  design_team_id: number
  project_id: number
  role: number
  role_name: string
  user: number
  user_name: string
  other_resource: string | null
  responsibility: string
  responsibility_description: string
  project_stage_id: number
  project_stage_order_id: number
  stage_name: string
  start_date: string | null
  end_date: string | null
  status: number
}

export interface FileInfo {
  id: number
  fileName: string
  source: string
  dateOfUpload: string
  fileCategory: string
  fileStatus: string
}

export interface DropdownOption {
  key: string
  value: string
}
export interface ToolOption {
  key: string
  value: string
}
export interface DesignTeamSectionProps {
  title?: string
  designTeamData?: DesignTeamResponse[]
  onEdit?: (id: number) => void
  onDelete?: any
}
interface Activities {
  activity_id: number;
  activity: string;
}

export interface ProjectStage {
  project_stage_order_id: number;
  project_stage_id: number;
  stage: string;
  stage_type_id: number;
  stage_type: string;
  stage_order: number;
  stage_number: number;
  activities: Activities[];
  status: number;
}

export interface StageResourceSectionProps {
  title?: string
  stageResourceData?: ProjectStage[]
  onEdit: (id: number,data:any) => void
}

interface TeamMember {
  user_id: number;
  role_id: number;
  responsibility: string;
}

export interface ProjectStageResource {
  stageName: string;
  project_build_stage_order_id: number;
  input: string;
  owner_id: number;
  description: string;
  deliverables: string;
  design_review_team: TeamMember[];
}

export interface FileUploadSectionProps {
  onFileUpload: (file: File[] | []) => void
  error?: string
  file: File[] | []
}
export interface FormSectionProps {
  children: React.ReactNode
  spacing?: number
  marginTop?: number
}

export interface ScheduleStage {
  stage_order_id: number
  description: string
  start_date: Date | null
  end_date: Date | null
}

export interface TaskData {
  id: number
  serialNumber: string
  description: string
  startDate: Date | null
  endDate: Date | null
  weekSpan?: {
    startMonth: number
    startWeek: number
    endMonth: number
    endWeek: number
  } | null
}

export interface TaskDatePickerProps {
  open: boolean
  onClose: () => void
  task: Task
  onSave: (taskId: number, startDate: Date | null, endDate: Date | null) => void
  displayMonths?: { month: number; year: number }[]
}

export interface FileData {
  id: string
  name: string
  source: string
  uploadDate: string
  category: string
  status: string
  purpose: string
  description: string
  tags: string[]
}

export interface FileUploadManagerProps {
  initialFiles?: FileData[]
  onFileUpload?: (file: File, fileData: FileData) => void
  onFileEdit?: (fileData: FileData) => void
  onFileDelete?: (fileId: string) => void
}

export interface ScheduleData {
  project_build_stage_order_id: number
  stage_name: string
  stage_order: number
  stage_number: number
  stage_id: number
  design_stage_id: number
  activity: Task[]
}

export interface StageData {
  stage_order_id: number
  design_stage: string
}
export interface Tool {
  tool_id: number
  tool_name: string
}
export interface Equipment {
  equipment_id: number
  equipment_name: string
}
export interface DesignTransfer {
  transfer_id: number
  transfer_type: string
}
export interface DocumentReference {
  document_id: number
  document_name: string
}
export interface Document {
  id: number
  document_name: string
  source: string
  created_date: string
  category_name: string
  status: number
}
export interface ProjectPlan {
  design_type: string
  organization_product_id?: number
  design_objective: string
  market_name?: string[]
  market_regulations?: MarketRegulation[]
  tool?: Tool[]
  equipment?: Equipment[]
  risk_management_activities: string
  method_of_traceability: string
  verification_method: string
  validation_method: string
  design_transfer?: DesignTransfer[]
  document_reference?: DocumentReference[]
  other_details: string
  schedule: ScheduleData[]
  documents?: File[]
  projectStages: ProjectStage[],
  stageResources: ProjectStage[],
  designTeam: DesignTeamResponse[],
  models: string[],
}
export interface ProjectPlanResponse {
  data: ProjectPlan[]
   action_control: {
    formType?: string
    formId?: string
    menuId?: string
    formName?: string
    permissions: Array<{
      action: string
      trigger_status_id: number
    }>
  }
}
export interface Option {
  [key: string]: string | number | string[] | number[]
}


export interface ProjectPlanPayload {
  project_id: number
  design_type: string
  organization_product_id: number | null
  design_objective: string
  market_name: string[]
  tools: Array<{ tool_id: number }>
  equipments: Array<{ equipment_id: number }>
  models: string[]
  risk_management_activities: string
  method_of_traceability: string
  verification_method: string
  validation_method: string
  design_transfer: Array<{ transfer_id: number }>
  document_reference: Array<{ document_id: number }>
  other_details: string
  documents_to_delete: string[]
  schedule: ScheduleData[]
}

export interface DesignInputGatheringFormData {
  project_id: string | number
  is_software_applicable: string | number
  is_usability_requirements_applicable: string | number
  is_pov_applicable: string | number
  is_frs_applicable: string | number
}
export interface DocumentStructure {
  documents_to_create: string[]
  documents_to_delete: string[]
  create_meta_data: Record<string, string>
  update_meta_data: Record<string, string>
  local_files_to_delete: string[]
}
export interface UploadedFileData {
  id: string
  name: string
  file?: File
  source: string
  uploadDate: string
  category: string
  status: string
  document_id?: number
}

export interface DesignTeamResponse {
  design_team_id: number
  role: number
  role_name: string
  user: number
  user_name: string
  other_resource?: string
  responsibility: string
  responsibility_description: string
  project_id: number
  project_stage_id: number
  project_stage_order_id: number
  stage_name: string
  start_date: string
  end_date: string
  status: number
}

export interface DesignTransferData {
  id: number
  transfer_id: number
  transfer_type: string
  pre_transfer: string
  final_design_transfer: string
}

export interface DocumentReferenceData {
  id: number
  document_id: number
  document_name: string
}

export interface DesignTransferProps {
  title?: string
  designTransferData?: DesignTransferData[]
  onEdit?: () => void
  onDelete?: () => void
}

export interface DocumentReferenceProps {
  title?: string
  documentReferenceData?: DocumentReferenceData[]
  onEdit?: () => void
  onDelete?: () => void
}

type DocumentRef = {
  document_id: number;
  is_applicable: number;
}

export type DocRef = {
  project_id: number;
  applicable_document: DocumentRef[];
}

type Checklist = {
  checklist_id: number;
  pre_transfer: number;
  final_design_transfer: number;
}

export type DesignTransferChecklist = {
  checklists: Checklist[];
}

export interface Stages {
  project_build_stage_order_id: number
  stage_name: string
  stage_order: number
  stage_number: number
  stage_id: number
  design_stage_id: number
  activity: Activity[]
  isExpanded?: boolean
}

interface Activity {
  activity_id: number
  activity: string
  activity_start_date: string | null
  activity_end_date: string | null
  status?: string | number
}

export interface ProjectStagesTableProps {
  stages: ProjectStage[];
  onStagesReorder: (newStages: ProjectStage[]) => void;
  columns: GridColDef[];
  onEdit?: (stage: ProjectStage) => void;
  onDelete?: (stage: ProjectStage) => void;
}

export interface DesignReviewData {
  id?: string
  user: string
  role: string
  responsibility: string
}

export interface DesignReviewFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: DesignReviewData) => void
  editingData?: DesignReviewData | null
  mode: 'add' | 'edit'
  hasEditPermission?: boolean
}

export type MonthYearValue = string | number | null