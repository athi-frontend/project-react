/**
 * Classification: Confidential
 * Production Module Common Dropdown Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllUnits, UnitResponse } from '@/services/modules/production/commonProduction'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { showActionAlert } from '@/components/ui'
import {
  fetchJigFixtureValidations,
  fetchAllJigsTypes,
  JigTypeResponse,
  fetchJigNumbersByType,
  fetchJigNumberDetail,
  JigFixtureValidationTypeResponse,
  JigNumberResponse,
  fetchJigFixtureValidationList,
  JigFixtureValidationDetailResponse,
  fetchBillOfMaterialList,
  BillOfMaterialResponse,
  fetchBillOfMaterialSettings,
  BillOfMaterialSettingsResponse,
  fetchJigFixturesValidationReports,
  fetchJigFixturesValidationReportById,
  upsertJigFixturesValidationReport,
  deleteJigFixturesValidationReport,
  JigFixturesValidationReportResponse,
  JigFixturesValidationReportPayload,
  JigFixturesValidationReportUpsertResponse,
} from '@/services/modules/production/commonProductionService';

/**
 * Hook to fetch all units with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for units
 */
export const useAllUnits = (status?: number, enabled: boolean = true) => {
  return useQuery<UnitResponse, Error>({
    queryKey: [QUERY_KEYS.UNIT_ALL, status],
    queryFn: () => fetchAllUnits(status),
    enabled,
  })
}

/**
 * Hook to fetch all jigs types with optional status filter
 * @param status - Optional status filter (1 for active)
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for jigs types
 */
export const useAllJigsTypes = (status: number = NUMBERMAP.ONE, enabled: boolean = true) => {
  return useQuery<JigTypeResponse, Error>({
    queryKey: [QUERY_KEYS.JIGS_TYPE_ALL, status],
    queryFn: () => fetchAllJigsTypes(status),
    enabled,
  })
}

/**
 * Hook to fetch all jig fixture validation types for a project
 */
export const useJigFixtureValidations = (projectId: number, enabled: boolean = true) => {
  return useQuery<JigFixtureValidationTypeResponse, Error>({
    queryKey: ['jigFixtureValidationTypes', projectId],
    queryFn: () => fetchJigFixtureValidations(projectId),
    enabled: enabled && !!projectId,
  });
};

/**
 * Hook to fetch all jig numbers for a jig type
 */
export const useJigNumbersByType = (jigTypeId: number, enabled: boolean = true) => {
  return useQuery<JigNumberResponse, Error>({
    queryKey: ['jigNumbersByType', jigTypeId],
    queryFn: () => fetchJigNumbersByType(jigTypeId),
    enabled: enabled && !!jigTypeId,
  });
};

/**
 * Hook to fetch jig number detail (last validation, etc)
 */
export const useJigNumberDetail = (jigItemId: number, enabled: boolean = true) => {
  return useQuery<any, Error>({
    queryKey: ['jigNumberDetail', jigItemId],
    queryFn: () => fetchJigNumberDetail(jigItemId),
    enabled: enabled && !!jigItemId,
  });
};

/**
 * Hook to fetch Jig Fixture Validation List by jig_fixture_validation_id
 */
export const useJigFixtureValidationList = (jigFixtureValidationId: number | string, enabled: boolean = true) => {
  return useQuery<JigFixtureValidationDetailResponse, Error>({
    queryKey: ['jigFixtureValidationList', jigFixtureValidationId],
    queryFn: () => fetchJigFixtureValidationList(jigFixtureValidationId),
    enabled: enabled && !!jigFixtureValidationId,
  });
};

export const useBillOfMaterialList = (projectId: number, enabled: boolean = true) => {
  return useQuery<BillOfMaterialResponse, Error>({
    queryKey: ['billOfMaterialList', projectId],
    queryFn: () => fetchBillOfMaterialList(projectId),
    enabled: enabled && !!projectId,
  });
};

export const useBillOfMaterialSettings = (partItemDetailId: number, enabled: boolean = true) => {
  return useQuery<BillOfMaterialSettingsResponse, Error>({
    queryKey: ['billOfMaterialSettings', partItemDetailId],
    queryFn: () => fetchBillOfMaterialSettings(partItemDetailId),
    enabled: enabled && !!partItemDetailId,
  });
};

/**
 * Hook to fetch all jig fixtures validation reports
 */
export const useJigFixturesValidationReports = (status: number = 1, enabled: boolean = true) => {
  return useQuery<JigFixturesValidationReportResponse, Error>({
    queryKey: ['jigFixturesValidationReports', status],
    queryFn: () => fetchJigFixturesValidationReports(status),
    enabled,
  });
};

/**
 * Hook to fetch jig fixtures validation report by ID
 */
export const useJigFixturesValidationReportById = (reportId: number | null | undefined, enabled: boolean = true) => {
  return useQuery<any, Error>({
    queryKey: ['jigFixturesValidationReportById', reportId],
    queryFn: () => {
      if (!reportId) {
        throw new Error('Report ID is required');
      }
      return fetchJigFixturesValidationReportById(reportId);
    },
    enabled: enabled && !!reportId,
  });
};

/**
 * Hook to upsert jig fixtures validation report
 */
export const useUpsertJigFixturesValidationReport = (status: number = NUMBERMAP.ONE) => {
  const queryClient = useQueryClient();
  
  return useMutation<JigFixturesValidationReportUpsertResponse, Error, JigFixturesValidationReportPayload>({
    mutationFn: upsertJigFixturesValidationReport,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jigFixturesValidationReports', status],
      });
      showActionAlert(STATUS.SUCCESS);
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};

/**
 * Hook to delete jig fixtures validation report
 */
export const useDeleteJigFixturesValidationReport = (status: number = NUMBERMAP.ONE) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: (reportId: number) => deleteJigFixturesValidationReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jigFixturesValidationReports', status],
      });
      showActionAlert(STATUS.SUCCESS);
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};

