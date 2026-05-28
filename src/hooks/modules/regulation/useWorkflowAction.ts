import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRegulationWorkflowAction, putRegulationWorkflowAction } from '@/services/modules/regulation/workflowAction';
import { showActionAlert } from '@/components/ui';
import { STATUS } from '@/constants/common';
import { RegulationWorkflowActionData } from '@/types/modules/regulation/workflowAction';

export const useRegulationWorkflowAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegulationWorkflowActionData) => postRegulationWorkflowAction(data),
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS);
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['regulation']
      });
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};

export const useRegulationWorkflowActionUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegulationWorkflowActionData) => putRegulationWorkflowAction(data),
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS);
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['regulation']
      });
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};
