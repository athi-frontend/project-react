import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { VerificationValidationApiResponse } from '@/types/modules/regulation/verificationValidation';
import { VERIFICATION_VALIDATION_QUERY_KEY } from '@/constants/modules/regulation/verificationValidation';
import { getVerificationValidation, postVerificationValidation } from '@/services/modules/regulation/verificationValidation';

export const useVerificationValidation = (deviceMasterId: number, enabled: boolean = false) => {
  return useQuery<VerificationValidationApiResponse, Error>({
    queryKey: [VERIFICATION_VALIDATION_QUERY_KEY, deviceMasterId],
    queryFn: () => getVerificationValidation(deviceMasterId),
    enabled: enabled && !!deviceMasterId,
  });
};

export const usePostVerificationValidation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postVerificationValidation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VERIFICATION_VALIDATION_QUERY_KEY] });
    },
  });
}; 