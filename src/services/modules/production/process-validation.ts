/**
 * Classification: Confidential
 * Process Validation Services
 */
import { apiClient } from '@/shared/apiClient'
import { PROCESS_VALIDATION_API_ENDPOINTS } from '@/constants/modules/production/process-validation'
import {
  InstallationQualificationUpsertPayload,
  OperationalQualificationUpsertPayload,
  PerformanceQualificationUpsertPayload,
} from '@/types/modules/production/process-validation'

// Installation Qualification Services
export const upsertInstallationQualification = async (
  data: InstallationQualificationUpsertPayload
) => {
  const response = await apiClient.post(
    PROCESS_VALIDATION_API_ENDPOINTS.INSTALLATION_QUALIFICATION_UPSERT,
    data
  )
  return response.data
}

export const fetchAllInstallationQualification = async (processChecklistId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.INSTALLATION_QUALIFICATION_FETCH_ALL(processChecklistId)
  )
  return response.data
}

export const fetchInstallationQualificationById = async (iqcDetailId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.INSTALLATION_QUALIFICATION_FETCH_BY_ID(iqcDetailId)
  )
  return response.data
}

export const deleteInstallationQualification = async (iqcDetailId: number) => {
  const response = await apiClient.delete(
    PROCESS_VALIDATION_API_ENDPOINTS.INSTALLATION_QUALIFICATION_DELETE(iqcDetailId)
  )
  return response.data
}

// Operational Qualification Services
export const upsertOperationalQualification = async (
  data: OperationalQualificationUpsertPayload
) => {
  const response = await apiClient.post(
    PROCESS_VALIDATION_API_ENDPOINTS.OPERATIONAL_QUALIFICATION_UPSERT,
    data
  )
  return response.data
}

export const fetchAllOperationalQualification = async (processChecklistId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.OPERATIONAL_QUALIFICATION_FETCH_ALL(processChecklistId)
  )
  return response.data
}

export const fetchOperationalQualificationById = async (oqcDetailId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.OPERATIONAL_QUALIFICATION_FETCH_BY_ID(oqcDetailId)
  )
  return response.data
}

export const deleteOperationalQualification = async (oqcDetailId: number) => {
  const response = await apiClient.delete(
    PROCESS_VALIDATION_API_ENDPOINTS.OPERATIONAL_QUALIFICATION_DELETE(oqcDetailId)
  )
  return response.data
}

// Performance Qualification Services
export const upsertPerformanceQualification = async (
  data: PerformanceQualificationUpsertPayload
) => {
  const response = await apiClient.post(
    PROCESS_VALIDATION_API_ENDPOINTS.PERFORMANCE_QUALIFICATION_UPSERT,
    data
  )
  return response.data
}

export const fetchAllPerformanceQualification = async (processChecklistId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.PERFORMANCE_QUALIFICATION_FETCH_ALL(processChecklistId)
  )
  return response.data
}

export const fetchPerformanceQualificationById = async (pqcDetailId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.PERFORMANCE_QUALIFICATION_FETCH_BY_ID(pqcDetailId)
  )
  return response.data
}

export const deletePerformanceQualification = async (pqcDetailId: number) => {
  const response = await apiClient.delete(
    PROCESS_VALIDATION_API_ENDPOINTS.PERFORMANCE_QUALIFICATION_DELETE(pqcDetailId)
  )
  return response.data
}

// IQC Group Services
export const fetchAllIqcGroup = async () => {
  const response = await apiClient.get(PROCESS_VALIDATION_API_ENDPOINTS.IQC_GROUP_FETCH_ALL)
  return response.data
}

// Process Checklist List Services
export const fetchProcessChecklistByProject = async (projectId: number) => {
  const response = await apiClient.get(
    PROCESS_VALIDATION_API_ENDPOINTS.PROCESS_CHECKLIST_BY_PROJECT(projectId)
  )
  return response.data
}

