import { GridRenderCellParams } from '@mui/x-data-grid'
import { 
  UserContact, 
  UserRole as userData, 
  MetaInfo, 
  BaseUserResponse, 
  RowsAffected 
} from './shared'
export interface FormData {
  firstName: string
  lastName: string
  nickName: string
  emailId: string
  contactNumber: string
  department: string
  responsibility: string
  role: string[]
  groupName: string
  designation: string
  employeeId: string
  employeeRole: string // Added for Employee Role display
}

export interface FormErrors {
  firstName?: string
  lastName?: string
  nickName?: string
  emailId?: string
  department?: string
  responsibility?: string
  role?: string
  groupName?: string
  designation?: string
  contactNumber?: string
  employeeId?: string
}

export interface UserInsertData {
  first_name: string
  last_name: string
  nick_name: string
  email: string
  contact_number: string
  department: number
  responsibility: number
  designation: number
  roles: number[]
  group_name: number
}

// Legacy types - keeping for backward compatibility
export interface Contact {
  contact_type: string
  contact: string
}
export interface Role {
  role_name: string
}
export interface RawUser {
  id: string
  firstName: string
  lastName: string
  contact: Contact[]
  roles: Role[]
  department_name: string
  status: number
  emailId: string
  roleName: string
}
export interface ProjectUser {
  id: string
  emailId: string
  Name: string
  roleName: string
  department_name: string
  status: string
}

export interface StatusCellProps {
  status: string
}

export interface ActionCellProps {
  params: GridRenderCellParams
  onDelete: (row: any) => void
}
// Legacy UserRole - keeping for backward compatibility
export interface UserRole {
  role_Id: number
  role_name: string
}

export interface InsertUserData {
  firstName: string
  lastName: string
  email: string
}

export interface UpdateUserData {
  id: string
  data: InsertUserData
}

export interface UserListQueryResponse {
  data: RawUser[]
  [key: string]: any
}

// Workflow action types for user onboarding
export interface WorkflowActionData {
  context_id: number
  context_type: string
  new_status_id: number
  comment: string
  menu_id: number
  reviewer?: number
}

// User onboarding API response types
export interface UserOnboardData {
  id: number
  tenantKey: number
  organizationId: number
  firstName: string
  lastName: string
  nickName: string
  userSub: string | null
  status: number
  user_status_id: number
  user_status_name: string
  contact: UserContact[]
  roles: userData[]
}

export interface UserOnboardResponse extends BaseUserResponse {
  data: UserOnboardData[]
  rowsAffected: RowsAffected
  meta_info?: MetaInfo
}

export interface UserRegisterResponse extends BaseUserResponse {
  data: any[]
}