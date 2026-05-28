// ABAC Workflow User Profile Types
import { 
  UserContact, 
  UserRole, 
  MetaInfo, 
  BaseUserResponse, 
} from './shared'

export interface UserProfileData {
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
  roles: UserRole[]
} & UserOrganizationInfo

export interface UserProfileResponse extends BaseUserResponse {
  data: UserProfileData[]
  meta_info?: MetaInfo
}

// Query key type for user profile
export type UserProfileQueryKey = [string, number]
