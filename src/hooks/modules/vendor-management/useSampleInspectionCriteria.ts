import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSampleInspectionCriteria,
  getSampleInspectionCriteriaById,
  postSampleInspectionCriteria,
  deleteSampleInspectionCriteria,
} from '@/services/modules/vendor-management/sampleInspectionCriteria';
import { NUMBERMAP } from '@/constants/common';

/**
 * Classification: Confidential
 * React Query hooks for Sample Inspection Criteria module
 */

const SAMPLE_INSPECTION_CRITERIA_QUERY_KEY = 'sample_inspection_criteria';

// Fetch all sample inspection criteria
export const useSampleInspectionCriteriaList = (status?: number) => {
  return useQuery({
    queryKey: [SAMPLE_INSPECTION_CRITERIA_QUERY_KEY, 'all', status],
    queryFn: () => getAllSampleInspectionCriteria(status),
  });
};

// Fetch sample inspection criteria by ID
export const useSampleInspectionCriteriaById = (id: number | string | null) => {
  return useQuery({
    queryKey: [SAMPLE_INSPECTION_CRITERIA_QUERY_KEY, 'byId', id],
    queryFn: () => getSampleInspectionCriteriaById(id),
    enabled: !!id,
    placeholderData: undefined,
    // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};

// Create or update sample inspection criteria
export const usePostSampleInspectionCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => postSampleInspectionCriteria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SAMPLE_INSPECTION_CRITERIA_QUERY_KEY],
      });
    },
  });
};

// Delete sample inspection criteria
export const useDeleteSampleInspectionCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteSampleInspectionCriteria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SAMPLE_INSPECTION_CRITERIA_QUERY_KEY],
      });
    },
  });
};

