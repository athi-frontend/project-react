import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIncomingInspectionCriteriaList,
  getIncomingInspectionCriteriaById,
  deleteIncomingInspectionCriteria,
  upsertIncomingInspectionCriteria,
  fetchInspectionGroups,
  fetchCriteriaByGroupId
} from "@/services/modules/production/incomingInspectionCriteria"
import {
  FETCH_INCOMING_INSPECTION_CRITERIA_LIST_KEY,
  FETCH_INCOMING_INSPECTION_CRITERIA_BY_ID_KEY,
} from "@/constants/modules/production/incomingInspectionCriteria";

const INSPECTION_GROUP_DROPDOWN_KEY = 'inspection-group-dropdown';
const CRITERIA_DROPDOWN_KEY = 'criteria-dropdown';

/**
 * Classification: Confidential
 * Hooks for Incoming Inspection Criteria
 */

/**
 * Hook to fetch all incoming inspection criteria
 * @param applicableSettingsId - Optional applicable settings ID filter
 */
export const useGetIncomingInspectionCriteriaList = (applicableSettingsId?: number) => {
  return useQuery({
    queryKey: [FETCH_INCOMING_INSPECTION_CRITERIA_LIST_KEY, applicableSettingsId],
    queryFn: () => getIncomingInspectionCriteriaList(applicableSettingsId),
    enabled: applicableSettingsId !== undefined,
  });
};

/**
 * Hook to fetch incoming inspection criteria by ID
 * @param id - The incoming inspection criteria ID
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useGetIncomingInspectionCriteriaById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [FETCH_INCOMING_INSPECTION_CRITERIA_BY_ID_KEY, id],
    queryFn: () => getIncomingInspectionCriteriaById(id),
    enabled: enabled && !!id,
  });
};

/**
 * Hook to delete incoming inspection criteria
 */
export const useDeleteIncomingInspectionCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteIncomingInspectionCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_INCOMING_INSPECTION_CRITERIA_LIST_KEY],
      });
    },
  });
};

/**
 * Hook for fetching inspection group dropdown data for incoming inspection criteria
 */
export const useInspectionGroups = (status: number = 1) => {
  return useQuery({
    queryKey: [INSPECTION_GROUP_DROPDOWN_KEY, status],
    queryFn: () => fetchInspectionGroups(status),
  });
};

/**
 * Hook for fetching criteria for a given inspection group (for dependent dropdowns)
 */
export const useCriteriaByGroupId = (groupId?: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [CRITERIA_DROPDOWN_KEY, groupId],
    queryFn: () => (groupId ? fetchCriteriaByGroupId(groupId) : Promise.resolve({ data: [] })),
    enabled: !!groupId && enabled,
    staleTime: 0,
  });
};

/**
 * Hook to upsert (create or update) incoming inspection criteria
 * @param incomingInspectionCriteriaId - Optional ID for update mode
 */
export const useUpsertIncomingInspectionCriteria = (incomingInspectionCriteriaId?: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [FETCH_INCOMING_INSPECTION_CRITERIA_LIST_KEY, 'upsert', incomingInspectionCriteriaId],
    mutationFn: (payload: FormData) => upsertIncomingInspectionCriteria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_INCOMING_INSPECTION_CRITERIA_LIST_KEY],
      });
      if (incomingInspectionCriteriaId) {
        queryClient.invalidateQueries({
          queryKey: [FETCH_INCOMING_INSPECTION_CRITERIA_BY_ID_KEY, incomingInspectionCriteriaId],
        });
      }
    },
  });
};

