/**
 * Classification: Confidential
 * Process Validation Hooks
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertInstallationQualification,
  fetchAllInstallationQualification,
  fetchInstallationQualificationById,
  deleteInstallationQualification,
  upsertOperationalQualification,
  fetchAllOperationalQualification,
  fetchOperationalQualificationById,
  deleteOperationalQualification,
  upsertPerformanceQualification,
  fetchAllPerformanceQualification,
  fetchPerformanceQualificationById,
  deletePerformanceQualification,
  fetchAllIqcGroup,
  fetchProcessChecklistByProject,
} from '@/services/modules/production/process-validation'
import { PROCESS_VALIDATION_QUERY_KEYS } from '@/constants/modules/production/process-validation'
import {
  InstallationQualificationUpsertPayload,
  OperationalQualificationUpsertPayload,
  PerformanceQualificationUpsertPayload,
} from '@/types/modules/production/process-validation'
import { showActionAlert } from '@/components/ui'
import { SUCCESS, FAILED } from '@/constants/modules/dnd/pnd'
import { NUMBERMAP } from '@/constants/common'

// Installation Qualification Hooks
export const useFetchAllInstallationQualification = (processChecklistId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.INSTALLATION_QUALIFICATION_LIST, processChecklistId],
    queryFn: () => fetchAllInstallationQualification(processChecklistId),
    enabled: !!processChecklistId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

export const useFetchInstallationQualificationById = (iqcDetailId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.INSTALLATION_QUALIFICATION_BY_ID, iqcDetailId],
    queryFn: () => fetchInstallationQualificationById(iqcDetailId),
    enabled: !!iqcDetailId,
  })
}

export const useUpsertInstallationQualification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InstallationQualificationUpsertPayload) =>
      upsertInstallationQualification(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PROCESS_VALIDATION_QUERY_KEYS.INSTALLATION_QUALIFICATION_LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

export const useDeleteInstallationQualification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (iqcDetailId: number) => deleteInstallationQualification(iqcDetailId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROCESS_VALIDATION_QUERY_KEYS.INSTALLATION_QUALIFICATION_LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

// Operational Qualification Hooks
export const useFetchAllOperationalQualification = (processChecklistId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.OPERATIONAL_QUALIFICATION_LIST, processChecklistId],
    queryFn: () => fetchAllOperationalQualification(processChecklistId),
    enabled: !!processChecklistId
  })
}

export const useFetchOperationalQualificationById = (oqcDetailId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.OPERATIONAL_QUALIFICATION_BY_ID, oqcDetailId],
    queryFn: () => fetchOperationalQualificationById(oqcDetailId),
    enabled: !!oqcDetailId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

export const useUpsertOperationalQualification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OperationalQualificationUpsertPayload) =>
      upsertOperationalQualification(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PROCESS_VALIDATION_QUERY_KEYS.OPERATIONAL_QUALIFICATION_LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

export const useDeleteOperationalQualification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (oqcDetailId: number) => deleteOperationalQualification(oqcDetailId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROCESS_VALIDATION_QUERY_KEYS.OPERATIONAL_QUALIFICATION_LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

// Performance Qualification Hooks
export const useFetchAllPerformanceQualification = (processChecklistId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.PERFORMANCE_QUALIFICATION_LIST, processChecklistId],
    queryFn: () => fetchAllPerformanceQualification(processChecklistId),
    enabled: !!processChecklistId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

export const useFetchPerformanceQualificationById = (pqcDetailId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.PERFORMANCE_QUALIFICATION_BY_ID, pqcDetailId],
    queryFn: () => fetchPerformanceQualificationById(pqcDetailId),
    enabled: !!pqcDetailId,
  })
}

export const useUpsertPerformanceQualification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PerformanceQualificationUpsertPayload) =>
      upsertPerformanceQualification(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PROCESS_VALIDATION_QUERY_KEYS.PERFORMANCE_QUALIFICATION_LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

export const useDeletePerformanceQualification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pqcDetailId: number) => deletePerformanceQualification(pqcDetailId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROCESS_VALIDATION_QUERY_KEYS.PERFORMANCE_QUALIFICATION_LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: () => {
      showActionAlert(FAILED)
    },
  })
}

// IQC Group Hooks
export const useFetchAllIqcGroup = () => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.IQC_GROUP_LIST],
    queryFn: fetchAllIqcGroup,
  })
}

// Process Checklist List Hooks
export const useFetchProcessChecklistByProject = (projectId: number) => {
  return useQuery({
    queryKey: [PROCESS_VALIDATION_QUERY_KEYS.PROCESS_CHECKLIST_LIST, projectId],
    queryFn: () => fetchProcessChecklistByProject(projectId),
    enabled: !!projectId && projectId !== NUMBERMAP.ZERO,
  })
}

