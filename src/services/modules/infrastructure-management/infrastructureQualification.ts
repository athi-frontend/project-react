/**
 * Infrastructure Qualification Services
 * Classification: Confidential
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/infrastructure-management/infrastructureQualification'
import type { InfrastructureQualificationPayload } from '@/types/modules/infrastructure-management/infrastructureQualification'

/**
 * Fetch all infrastructure qualifications
 */
export const fetchAllInfrastructureQualifications = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL)
  return response.data
}

/**
 * Fetch infrastructure qualification by ID
 */
export const fetchInfrastructureQualificationById = async (
  infrastructureQualificationId: number | null
) => {
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_BY_ID(infrastructureQualificationId)
  )
  return response.data
}

/**
 * Create or update infrastructure qualification (upsert)
 */
export const upsertinfrastructureQualification = async (data: InfrastructureQualificationPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE, data)
  return response.data
}

/**
 * Delete infrastructure qualification
 */
export const deleteInfrastructureQualification = async (
  infrastructureQualificationId: number | null
) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DELETE(infrastructureQualificationId)
  )
  return response.data
}

/**
 * Fetch qualification checklist by infrastructure ID
 */
export const fetchQualificationChecklistByInfrastructureId = async (
  infrastructureId: number | null
) => {
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_QUALIFICATION_CHECKLIST(infrastructureId)
  )
  return response.data
}