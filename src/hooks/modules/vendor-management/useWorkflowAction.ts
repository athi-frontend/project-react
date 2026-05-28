import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postVendorWorkflowAction, putVendorWorkflowAction } from '@/services/modules/vendor-management/workflowAction';
import { showActionAlert } from '@/components/ui';
import { STATUS } from '@/constants/common';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { VendorWorkflowActionData } from '@/types/modules/vendor-management/workflowAction';

const createVendorWorkflowActionHook = (method: 'POST' | 'PUT') => (menuName?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VendorWorkflowActionData) => 
      method === 'POST' ? postVendorWorkflowAction(data) : putVendorWorkflowAction(data),
    onSuccess: () => {
      if (menuName && QUERY_KEYS[menuName]?.FETCH_BY_ID) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS[menuName].FETCH_BY_ID] });
      }
      if (menuName && QUERY_KEYS[menuName]?.FETCH_LIST) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS[menuName].FETCH_LIST] });
      }
      showActionAlert(STATUS.SUCCESS);
    },
    onError: () => {
      showActionAlert(STATUS.FAILED);
    },
  });
};

export const useVendorWorkflowAction = createVendorWorkflowActionHook('POST');

export const useVendorWorkflowActionUpdate = createVendorWorkflowActionHook('PUT');

