export interface UserInfoProps {
  userData: {
    id: number
    tenantKey: number
    organizationId: number
    firstName: string
    lastName: string
    nickName: string
    status: number
    contact: Array<{
      contact_id: number
      contact_type: string
      contact: string
    }>
    roles: Array<{
      role_Id: number
      role_name: string
    }>
    department_id: number
    department_name: string
    designation_id: number
    designation_name: string
    service_group_id: number
    service_group_name: string
    responsibility_id: number
    responsibility: string
    profile_url: Record<string, unknown>
  }
}

export const EMPTY_USER: UserInfoProps['userData'] = {
  id: 0,
  tenantKey: 0,
  organizationId: 0,
  firstName: '',
  lastName: '',
  nickName: '',
  status: 0,
  contact: [
    {
      contact_id: 0,
      contact_type: '',
      contact: '',
    },
  ],
  roles: [
    {
      role_Id: 0,
      role_name: '',
    },
  ],
  department_id: 0,
  department_name: '',
  designation_id: 0,
  designation_name: '',
  service_group_id: 0,
  service_group_name: '',
  responsibility_id: 0,
  responsibility: '',
  profile_url: {},
}

export interface UserStatusProps {
  user_status: string
  status_reason: string
}
