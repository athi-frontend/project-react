import { useQuery } from '@tanstack/react-query'
import {
  fetchRecruitmentTypes,
  fetchResourceRequiredTypes,
  fetchRecruitments,
  fetchRecruitmentById,
  fetchRoles,
  fetchDepartments,
  fetchUsers,
  fetchProduct,
} from '@/services/modules/hr/resourceRequistion'
import {
  DEPARTMENTS,
  PRODUCT,
  RECRUITMENT_BY_ID,
  RECRUITMENTS,
  RESOURCE_REQUIRED_TYPES,
  ROLES,
  USE_RECRUITMENT_TYPES,
  USERS,
  IS_NULL,
} from '@/constants/modules/hr/resourceRequisition'

export const useRecruitmentTypes = () => {
  return useQuery({
    queryKey: [USE_RECRUITMENT_TYPES],
    queryFn: fetchRecruitmentTypes,
  })
}

export const useResourceRequiredTypes = () => {
  return useQuery({
    queryKey: [RESOURCE_REQUIRED_TYPES],
    queryFn: fetchResourceRequiredTypes,
  })
}

export const useRecruitments = (status?:number,workflow_status?:string) => {
  return useQuery({
    queryKey: [RECRUITMENTS],
    queryFn: ()=>fetchRecruitments(status,workflow_status),
    enabled: false,
  })
}

export const useListWorkflowRecruitments = (status?:number,workflow_status?:string) => {
  return useQuery({
    queryKey: ['workflowresourcerequisation'],
    queryFn: ()=>fetchRecruitments(status,workflow_status),
    enabled: false,
  })
}

export const useRecruitmentById = (id: string | null) => {
  return useQuery({
    queryKey: [RECRUITMENT_BY_ID, id],
    queryFn: () => {
      if (!id) throw new Error(IS_NULL)
      return fetchRecruitmentById(id)
    },
    enabled: !!id,
  })
}

export const useRoles = () => {
  return useQuery({
    queryKey: [ROLES+'resource'],
    queryFn: fetchRoles,
  })
}

export const useDepartments = () => {
  return useQuery({
    queryKey: [DEPARTMENTS],
    queryFn: fetchDepartments,
  })
}

export const useUsers = (roleId: number) => {
  return useQuery({
    queryKey: [USERS],
    queryFn: () =>fetchUsers(roleId),
  })
}

export const useProducts = () => {
  return useQuery({
    queryKey: [PRODUCT],
    queryFn: fetchProduct,
  })
}
