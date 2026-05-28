import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUATValidationData, postUATValidationData } from '@/services/modules/dnd/uatValidation';
import { UAT_VALIDATION } from '@/constants/modules/dnd/uatValidation';

export const useUatValidation = (projectId: number) => {
  return useQuery({
    queryKey: [UAT_VALIDATION, projectId],
    queryFn: () => fetchUATValidationData(projectId),
  });
};

export const usePostUatValidation = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => postUATValidationData(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UAT_VALIDATION, projectId] });
    },
  });
};