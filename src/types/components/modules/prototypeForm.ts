import { ProjectStagesFormData } from '@/types/modules/dnd/projectStages'
import { ProtocolModalProps } from '@/types/modules/dnd/stageTypes'
import { FileDocument } from '@/types/components/ui/fileUploadV3'

export interface FormState {
  description: string
  otherDetails: string
  additionalRequirements: string
  conclusion: string
  remarks: string
  verificationMethod: string
  isRegulatoryCheck: string
  advisory: string
}

export interface ButtonProps {
  label: string
  onClick: () => void
}

export interface RadioOption {
  value: string
  label: string
}

export interface PrototypeFormProps {
  projectStageOrderId: number
}

export interface VerificationPlanFormData {
  dir_id: number | null
  dir_name: string
  design_input_requirement_id: number | null
  verification_plan: string
  acceptance_criteria: string
  dir_category?: string[]
  equipment_type?: string
  jig_type?: string
  tool_type?: string
  dir_numbers?: string[]
  documents?: (File | FileDocument)[]
}

export interface FormErrors {
  dir_id?: string
  design_input_requirement_id?: string
  verification_plan?: string
  acceptance_criteria?: string
  dir_category?: string
  equipment_type?: string
  jig_type?: string
  tool_type?: string
  general?: string
}

export interface ProjectStagesModalProps {
  onSave: (data: ProjectStagesFormData) => void
  onClose: () => void
  open: boolean
  initialData: ProjectStagesFormData
  projectId: number
  isEditMode: boolean
  projectStageOrderId: number
  hasEditPermission?: boolean
}

export interface ExtendedProjectStagesModalProps extends ProtocolModalProps {
  mode: 'add' | 'edit'
  projectStageOrderId: number
  verificationPlanId: number | null
  execution_plan_id?: number | null
  design_input_requirement_id?: number | null
}

export interface Deliverable {
  id: number
  dir_category: string
  dir_id: string
  status: string
  comments?: string
  execution_stage_deliverables_id?: number
}

export interface DeliverableTableProps {
  deliverables: Deliverable[]
  onRowChange?: (rows: Deliverable[]) => void
  disabled?: boolean
}

export interface ItemForTest {
  id: number
  batch_number: string
  batch_name: string
}