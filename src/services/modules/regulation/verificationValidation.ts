import { apiClient } from '@/shared/apiClient';
import { VERIFICATION_VALIDATION_API } from '@/constants/modules/regulation/verificationValidation';

export const getVerificationValidation = async (deviceMasterId: number) => {
  const response = await apiClient.get(VERIFICATION_VALIDATION_API.FETCH(deviceMasterId));
  return response.data;
};

export const postVerificationValidation = async (payload: any) => {
  const response = await apiClient.post(VERIFICATION_VALIDATION_API.POST, payload);
  return response.data;
}; 