import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FETCH_JIG_FIXTURE_VALIDATION_LIST_KEY, FETCH_JIG_FIXTURE_VALIDATION_BY_ID_KEY, ERROR_MESSAGES } from '@/constants/modules/production/jigsAndFixtureValidation';
import { getJigFixtureValidationList, getJigFixtureValidationById, upsertJigFixtureValidation, deleteJigFixtureValidation } from '@/services/modules/production/jigsAndFixtureValidation';
import { 
  JigFixtureValidationListResponse,
  JigFixtureValidationByIdResponse,
  JigFixtureValidationUpsertRequest,
} from '@/types/modules/production/jigsAndFixtureValidation';
import { showActionAlert } from '@/components/ui';
import { NUMBERMAP, STATUS } from '@/constants/common';

/**
 * Classification : Confidential
 **/

export const useGetJigFixtureValidationList = (projectId: number) => {
  return useQuery<JigFixtureValidationListResponse>({
    queryKey: [FETCH_JIG_FIXTURE_VALIDATION_LIST_KEY, projectId],
    queryFn: () => getJigFixtureValidationList(projectId),
    enabled: !!projectId,
  });
};

export const useGetJigFixtureValidationById = (jig_fixture_validation_id: number | null | undefined) => {
  return useQuery<JigFixtureValidationByIdResponse>({
    queryKey: [FETCH_JIG_FIXTURE_VALIDATION_BY_ID_KEY, jig_fixture_validation_id],
    queryFn: () => {
      if (jig_fixture_validation_id == null) {
        throw new Error(ERROR_MESSAGES.JIG_FIXTURE_VALIDATION_ID_REQUIRED);
      }
      return getJigFixtureValidationById(jig_fixture_validation_id);
    },
    enabled: !!jig_fixture_validation_id,
    placeholderData: undefined,
    gcTime: NUMBERMAP.ZERO
  });
};

export const useUpsertJigFixtureValidation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JigFixtureValidationUpsertRequest) => upsertJigFixtureValidation(data),
    onSuccess: (_, variables) => {
      // Invalidate list query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: [FETCH_JIG_FIXTURE_VALIDATION_LIST_KEY, variables.project_id],
      });
      
      // If editing, also invalidate the individual item query to clear cached data
      if (variables.jig_fixture_validation_id) {
        queryClient.invalidateQueries({
          queryKey: [FETCH_JIG_FIXTURE_VALIDATION_BY_ID_KEY, variables.jig_fixture_validation_id],
        });
      }
      
      showActionAlert(STATUS.SUCCESS);
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};

export const useDeleteJigFixtureValidation = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJigFixtureValidation,
    onSuccess: (_, jig_fixture_validation_id) => {
      // Invalidate list query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: [FETCH_JIG_FIXTURE_VALIDATION_LIST_KEY, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [FETCH_JIG_FIXTURE_VALIDATION_BY_ID_KEY, jig_fixture_validation_id],
      });
    },
  });
};

