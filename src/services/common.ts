/**
 *Classification : Confidential
**/

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/user/userOnboard'
import { API_URLS, NUMBERMAP } from '@/constants/common'
import { ProjectStagesFormData } from '@/types/modules/dnd/projectStages'
import { handleSessionTimeout, setRefreshBlocked } from '@/lib/utils/session'
import { COMMITTEE_API_ENDPOINTS } from '@/constants/modules/risk-management/committee'

export const getRoles = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ROLES, {})
  return response.data
}

export const getHeadRoles = async () => {
  const response = await apiClient.get(API_URLS.ROLES, {
    params: { status: NUMBERMAP.ONE, role_type: 'head' },
  })
  return response.data
}

export const getUsers = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GET_USER, {})
  return response.data
}

export const getEmployeesByRole = async (roleId: number) => {
  const response = await apiClient.get(COMMITTEE_API_ENDPOINTS.GET_EMPLOYEES, {
    params: {
      role_id: roleId,
    },
  })
  return response.data
}

export const getFilterUsers = async (params: {}) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_USER, {
    params: params,
  })
  return response.data
}
export const getInterviewStatus = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GET_INTERVIEW_STATUS, {})
  return response.data
}

export const getResponsibilities = async () => {
  const response = await apiClient.get(API_ENDPOINTS.RESPONSIBILITY_ALL, {})
  return response.data
}

export const getStages = async ({
  queryKey,
}: {
  queryKey: [string, string | number]
}) => {
  const [, projectId] = queryKey
  const response = await apiClient.get(
    API_ENDPOINTS.GET_STAGE + '/' + projectId,
    {}
  )
  return response.data
}

export const getGroup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GROUP_ALL)
  return response.data
}
export const getDesignation = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DESIGNATION_ALL)
  return response.data
}

export const getDepartment = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DEPARTMENT_ALL)
  return response.data
}

export const getResponsibility = async () => {
  const response = await apiClient.get(API_ENDPOINTS.RESPONSIBILITY_ALL)
  return response.data
}

export const logout = async () => {
  const response = await apiClient.post(API_ENDPOINTS.LOGOUT)
  return response.data
}

export const getTenant = async (url: string) => {
  const response = await apiClient.get(API_ENDPOINTS.TENANT_ALL, {
    params: { vanity_domain: url },
  })
  return response.data
}

// Common file download function
export const fetchFile = async (
  documentId: string | number,
  params?: Record<string, any>
) => {
  const url = `${API_URLS.FILE_DOWNLOAD}/${documentId}`.replace(/\/\/+/g, '/')
  const response = await apiClient.get(url, {
    responseType: 'blob',
    params,
  })
  if (response.headers['content-type'] === 'application/json') {
    const text = await response.data.text()
    const json = JSON.parse(text)
    throw new Error(`Server error: ${json.message ?? 'Invalid response'}`)
  }
  return response.data
}

export const fetchFileURL = async (documentId: string | number) => {
  const url = `${API_URLS.FILE_DOWNLOAD}/${documentId}`.replace(/\/\/+/g, '/')
  const response = await apiClient.get(url)
  return response.data
}

export const getDocUrl = async (
  documentId: string | number,
  versionId?: string | number
) => {
  const url =
    `${API_URLS.RECORD_DOWNLOAD}/${documentId}/version/${versionId}`.replace(
      /\/\/+/g,
      '/'
    )
  const response = await apiClient.get(url)
  return response.data
}

export const downloadS3FileAsBlob = async (
  signedUrl: string
): Promise<Blob> => {
  const response = await fetch(signedUrl)

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status}`)
  }

  const blob = await response.blob()
  return blob
}

// Usage for fetchFileUrlInfo (no params)
export const fetchFileUrlInfo = async ({
  queryKey,
}: {
  queryKey: [string, string | number]
}) => {
  const [, documentId] = queryKey
  return fetchFile(documentId)
}

// Usage for getDocumentbyidver (with version param)
export const getDocumentbyidver = async (
  documentId: string | number,
  versionId: string | number
) => {
  return getDocUrl(documentId, versionId)
}

export const fetchFileUrl = async ({
  queryKey,
}: {
  queryKey: [string, string | number]
}) => {
  const [, documentMediaID] = queryKey
  const url = `${API_URLS.FILE_DOWNLOAD}/${documentMediaID}`
  const response = await apiClient.get(url)
  return response.data
}

export const getProjectStageDropdown = async () => {
  const response = await apiClient.get(API_URLS.GET_PROJECT_STAGE_DROPDOWN)
  return response.data
}
export const getEmployeeListDropdown = async () => {
  const response = await apiClient.get(API_URLS.GET_EMPLOYEE_LIST_DROPDOWN)
  return response.data
}

export const submitProjectStage = async (
  projectStageData: ProjectStagesFormData
) => {
  const response = await apiClient.post(
    API_URLS.SUBMIT_PROJECT_STAGE,
    projectStageData
  )
  return response.data
}

export const verifyTenant = async (domain: string) => {
  const response = await apiClient.get(API_URLS.GET_TENANT, {
    params: { vanity_domain: domain },
  })
  return response.data
}

export const refreshSessionToken = async () => {
  try {
    const response = await apiClient.post(API_URLS.GET_SESSION_TOKEN, {}, {
      skipCriticalWait: true,
      skipAuthRetry: true, // Skip 401 retry handling for refresh token endpoint
    } as any)

    if (response.data?.code === NUMBERMAP.TWOHUNDRED && response.data?.status === 'success') {
      const { access_token, rbac_token, refresh_token } = response.data.data

      // Update localStorage with new tokens
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      if (rbac_token) {
        localStorage.setItem('rbac_token', rbac_token)
      }
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token)
      }

      return {
        success: true,
        access_token,
        rbac_token,
        refresh_token,
      }
    } else {
      handleSessionTimeout()
      setRefreshBlocked(false)
      return {
        success: false,
        error: response.data?.message ?? 'Failed to refresh session token',
      }
    }
  } catch (error) {
    handleSessionTimeout()
    setRefreshBlocked(false)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getEmploymentTypes = async (status?: number) => {
  const response = await apiClient.get(API_URLS.EMPLOYMENT_TYPE_ALL, {
    params: { status: status },
  })
  return response.data
}

export const getCategoryList = async () => {
  const response = await apiClient.get(API_URLS.CATEGORY)
  return response.data
}

// Organization level APIs
export const getGenders = async (status?: number) => {
  const response = await apiClient.get(API_URLS.GET_GENDERS, {
    params: { status: status },
  })
  return response.data
}

export const getUserProfiles = async (status?: number) => {
  const response = await apiClient.get(API_URLS.GET_USER_PROFILES, {
    params: { status: status },
  })
  return response.data
}
export const getOrganizationStatus = async (status?: number) => {
  const response = await apiClient.get(API_URLS.ORGANIZATION_STATUS_ALL, {
    params: { status: status },
  })
  return response.data
}

export const getOperators = async (status?: number) => {
  const response = await apiClient.get(API_URLS.OPERATORS, {
    params: { status: status },
  })
  return response.data
}
