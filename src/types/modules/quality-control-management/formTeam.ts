/**
 * Quality Control Form Team Types
 * Classification: Confidential
 */

export interface FormTeamData {
  team_id: number
  status: number
  purchase_order_id: number
  purchase_order_no: string
  purchase_order_date: string
}

export interface FormTeamResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: FormTeamData[]
}

export interface FormTeamDetailData {
  team_id: number
  purchase_order_number_id: number
  purchase_order_date: string
  status_id?: number
  status_name?: string
  status_slug?: string
  purchase_team_details: PurchaseTeamDetail[]
}

export interface FormTeamDetailResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: FormTeamDetailData[]
}

export interface PurchaseTeamDetail {
  purchase_team_detail_id?: number
  part_category_id: number
  purchase_part_category_name?: string // API response field
  skill_id: number
  skill_name?: string // API response field
  employee_id: number
  employee_first_name?: string // API response field
  employee_last_name?: string // API response field
  responsibility: string
  responsibility_description?: string
  status: number
}

export interface FormTeamRequest {
  team_id?: number
  purchase_order_number_id: number
  status_id?: number
  purchase_team_details: PurchaseTeamDetail[]
}

export interface PurchaseOrderData {
  purchase_order_id: number
  vendor_id: number
  vendor_name: string
  purchase_order_number: string
  purchase_order_date: string
  status: number
}

export interface PurchaseOrderResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: PurchaseOrderData[]
}

export interface PartCategoryData {
  part_category_id: number
  part_category_name: string
  status: number
}

export interface PartCategoryResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: PartCategoryData[]
}

export interface SkillData {
  skill_id: number
  skill_name: string
  status: number
  [key: string]: any
}

export interface SkillResponse {
  data: SkillData[]
  success: boolean
  message?: string
}

export interface EmployeeData {
  id: number
  employee_name: string
  role_name?: string
  department_name?: string
  status: number
  [key: string]: any
}

export interface EmployeeResponse {
  data: EmployeeData[]
  success: boolean
  message?: string
}

export interface StatusData {
  status_id: number
  status_name: string
  status: number
  [key: string]: any
}

export interface ApiResponse<T> {
  data: T[]
  success: boolean
  message?: string
}

// Form Team Form Types
export interface FormTeamFormData {
  purchase_order_number_id: number | null
  purchase_order_date: string
  status_id: number | null
  purchase_team_details: TeamMemberRow[]
}

export interface FormTeamFormErrors {
  purchase_order_number_id?: string
  purchase_order_date?: string
  status_id?: string
  purchase_team_details?: string
}

// Team Member Row Types
export interface TeamMemberRow {
  purchase_team_detail_id?: number
  part_category_id: number
  part_category_name?: string
  skill_id: number
  skill_name?: string
  employee_id: number
  employee_name?: string
  responsibility: string
  responsibility_description?: string
  status: number
  status_name?: string
  serialNo?: number
  temp_id?: string
}

// Team Member Modal Types
export interface TeamMemberModalData {
  part_category_id: number | null
  skill_id: number | null
  employee_id: number | null
  employee_name?: string // Include employee name from modal
  responsibility: string
  responsibility_description: string
  status: number | null
}

export interface TeamMemberModalFormErrors {
  part_category_id: string
  skill_id: string
  employee_id: string
  responsibility: string
  responsibility_description: string
  status: string
}

export interface TeamMemberModalProps {
  onSave?: (data: TeamMemberModalData) => void
  onCancel?: () => void
  onClose?: () => void
  open: boolean
  initialData?: TeamMemberRow
  purchaseOrderId?: number | null
  partCategories?: PartCategoryData[]
  skills?: SkillData[]
  employees?: EmployeeData[]
  statusOptions?: StatusData[]
}

// Expandable Team Table Types
export interface TeamMember {
  id: number | string
  skillRequired: string
  resource: string
  responsibility: string
  status: string
  statusValue?: number // Status value for delete disable check
  memberData?: any // Store full member data for edit/delete
}

export interface TeamGroup {
  id: number
  category: string
  members: TeamMember[]
}

export interface ExpandableTeamTableProps {
  groups: TeamGroup[]
  onEditMember: (member: TeamMember) => void
  onDeleteMember: (memberId: number) => void
  onAddNew?: () => void
}

