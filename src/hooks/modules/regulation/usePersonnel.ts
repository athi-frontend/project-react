import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPersonnel, postPersonnel } from '@/services/modules/regulation/personnel';
import { showActionAlert } from '@/components/ui';
import { COMMON_CONSTANTS } from '@/lib/utils/common';
import { REGULATION_QUERY_KEYS } from '@/constants/queryKeys';
const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS;

export const useFetchPersonnel = (organizationSiteId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_QUERY_KEYS.PERSONNEL.FETCH_BY_ID,organizationSiteId],
    queryFn: () => fetchPersonnel(organizationSiteId),
    enabled: enabled && !!organizationSiteId,
  });
};

export const usePostPersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPersonnel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGULATION_QUERY_KEYS.PERSONNEL.FETCH_BY_ID] });
      showActionAlert(SUCCESS_ALERT);
    },
    onError: () => {
      showActionAlert(FAILED_ALERT);
    },
  });
}; 