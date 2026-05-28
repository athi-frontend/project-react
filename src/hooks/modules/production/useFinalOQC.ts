import { useQuery } from '@tanstack/react-query';
import { fetchJigs, JigsDropdownResponse } from '@/services/modules/production/finalOQC';

/**
 * Jigs dropdown data fetch
 * @returns React Query result
 */
/**
    Classification : Confidential
**/
export const useJigsDropdown = () => {
  return useQuery<JigsDropdownResponse, Error>({
    queryKey: ['jigsDropdown'],
    queryFn: fetchJigs,
  });
};
