import { apiClient } from '../../../shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/hr/resourceRequisition'

export const fetchRecruitmentTypes = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.RECRUITMENT.FETCH_RECRUITMENT_TYPES
  )
  return response.data
}

export const fetchResourceRequiredTypes = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.RECRUITMENT.FETCH_RESOURCE_REQUIRED_TYPES
  )
  return response.data
}

export const fetchRecruitments = async (status?:number,workflow_status?:string) => {
  const response = await apiClient.get(API_ENDPOINTS.RECRUITMENT.FETCH_ALL,
    {
    params: { status: status,workflow_status:workflow_status },
    }
  )
  return response.data
}

export const fetchRecruitmentById = async (id: string) => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.RECRUITMENT.FETCH_ID}/${id}`
  )
  return response.data
}

export const fetchRoles = async () => {
  const response = await apiClient.get(API_ENDPOINTS.RECRUITMENT.FETCH_ROLES)
  return response.data
}

export const fetchDepartments = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.RECRUITMENT.FETCH_DEPARTMENTS
  )
  return response.data
}

export const fetchUsers = async (roleID: number) => {
  const response = await apiClient.get(API_ENDPOINTS.RECRUITMENT.FETCH_USERS(roleID))
  return response.data
}

export const fetchProduct = async () => {
  const response = await apiClient.get(API_ENDPOINTS.RECRUITMENT.FETCH_PRODUCT)
  return response.data
}
