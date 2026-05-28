/**
 * Classification: Confidential
 */

import { useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchFileUrl,
  submitProjectStage,
  getProjectStageDropdown,
  fetchFileUrlInfo,
  getEmployeeListDropdown,
  getDocumentbyidver,
  getEmploymentTypes,
  getCategoryList,
  getFilterUsers,
  getGenders,
  getUserProfiles,
  getOrganizationStatus,
  getOperators,
  getHeadRoles,
} from '@/services/common'
import {
  CATEGORY_KEY,
  PROJECT_STAGE_KEY,
  GETGENDERS,
  GETUSERPROFILES,
  ORGANIZATION_STATUS_KEY,
  OPERATOR_QUERY_KEY,
  PROCESS_CHECKLIST_GROUP_KEY,
  PROCESS_CHECKLIST_KEY,
} from '@/constants/common'
import {
  getProcessChecklistGroups,
  getProcessChecklists,
} from '@/services/modules/production/productTraceabilityCard'

export const useDownloadFile = (documentMediaID: string | number) => {
  return useQuery({
    queryKey: ['fileURLQueryKey', documentMediaID],
    queryFn: fetchFileUrl,
    enabled: false,
  })
}

export const useGetProjectStages = () => {
  return useQuery({
    queryKey: [PROJECT_STAGE_KEY],
    queryFn: getProjectStageDropdown,
    enabled: false,
  })
}

export const useGetEmployesList = () => {
  return useQuery({
    queryKey: ['EmployeeList'],
    queryFn: getEmployeeListDropdown,
  })
}

export const useProjectStageSubmit = () => {
  return useMutation({
    mutationFn: (projectStageBody: any) => submitProjectStage(projectStageBody),
  })
}

export const downloadFile = async (documentId: number | string) => {
  const blob = await fetchFileUrlInfo({ queryKey: ['file', documentId] })
  return blob
}
export const getfileURL = async (documentId: number | string) => {
  const res = await fetchFileUrl({ queryKey: ['file', documentId] })
  return res
}

export const downloadDocumentURL = async (
  documentId: number | string,
  version: string | number
) => {
  const blob = await getDocumentbyidver(documentId, version)
  return blob
}

export const useEmploymentTypes = (status?: number) => {
  return useQuery({
    queryKey: ['employmentTypes'],
    queryFn: () => getEmploymentTypes(status),
  })
}

export const useGetFileCategoryList = () => {
  return useQuery({
    queryKey: [CATEGORY_KEY],
    queryFn: getCategoryList,
  })
}

export const useUserCustomFilter = (params: {}) => {
  return useQuery({
    queryKey: ['user_filter'],
    queryFn: () => getFilterUsers(params),
  })
}

// Organization level hooks
export const useGetGenders = (status?: number) => {
  return useQuery({
    queryKey: [GETGENDERS, status],
    queryFn: () => getGenders(status),
  })
}

export const useGetUserProfiles = (status?: number) => {
  return useQuery({
    queryKey: [GETUSERPROFILES, status],
    queryFn: () => getUserProfiles(status),
  })
}

export const useOrganizationStatus = (status?: number) => {
  return useQuery({
    queryKey: [ORGANIZATION_STATUS_KEY, status],
    queryFn: () => getOrganizationStatus(status),
  })
}

export const useGetOperators = (status?: number) => {
  return useQuery({
    queryKey: [OPERATOR_QUERY_KEY],
    queryFn: () => getOperators(status),
  });
};

export const useProcessChecklistGroups = (status?: number) => {
  return useQuery({
    queryKey: [PROCESS_CHECKLIST_GROUP_KEY, status],
    queryFn: () => getProcessChecklistGroups(status),
  })
}

export const useProcessChecklists = (status?: number) => {
  return useQuery({
    queryKey: [PROCESS_CHECKLIST_KEY, status],
    queryFn: () => getProcessChecklists(status),
  })
}

export const useHeadRoles = () => {
  return useQuery({
    queryKey: ['headRoles'],
    queryFn: getHeadRoles,
  })
}