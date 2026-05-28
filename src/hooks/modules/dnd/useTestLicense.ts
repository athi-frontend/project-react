import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import { getLicenseData, initiateTestLicense } from "@/services/modules/dnd/testLicense";

export const useInitiateTestLicense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { project_id: number | string, verify_pin: string, license_type: string}) => initiateTestLicense(data),
      onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['license_type'],
          })
        },
  })
};

export const useListLicense = (project_id:number,license_type:string) => {
  return useQuery({
    queryKey: ['license_type'],
    queryFn: ()=>getLicenseData(project_id,license_type),
  })
}