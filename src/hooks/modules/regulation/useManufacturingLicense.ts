import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchManufacturingLicenseChecklist, saveManufacturingLicenseChecklist, fetchAddManufacturingLicense, fetchAllAddManufacturingLicense, saveAddManufacturingLicense, getAddManufacturingLicense } from "@/services/modules/regulation/manufacturingLicense";
import { ManufacturingLicenseApiResponse } from "@/types/modules/regulation/manufacturingLicense";
/**
    Classification : Confidential
**/

export const MANUFACTURING_LICENCE_CHECKLIST_QUERY_KEY = "manufacturing_license_checklist";
export const ADD_TEST_LICENSE_QUERY_KEY = "add_manufacturing_license";
export const ALL_ADD_TEST_LICENSE_QUERY_KEY = "all_add_manufacturing_license";

export const useManufacturingLicenseChecklist = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [MANUFACTURING_LICENCE_CHECKLIST_QUERY_KEY, id],
    queryFn: () => fetchManufacturingLicenseChecklist(id),
    enabled: enabled && !!id,
  });
};

export const useSaveManufacturingLicenseChecklist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: Array<{ checklist_id: number; is_mandatory: number }> }) =>
      saveManufacturingLicenseChecklist(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MANUFACTURING_LICENCE_CHECKLIST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ALL_ADD_TEST_LICENSE_QUERY_KEY] });
    },
  });
};

export const useFetchAddManufacturingLicense = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [ADD_TEST_LICENSE_QUERY_KEY, id],
    queryFn: () => fetchAddManufacturingLicense(id),
    enabled: enabled && !!id,
  });
};

export const useFetchAllAddManufacturingLicense = (id: number) => {
  return useQuery<ManufacturingLicenseApiResponse, Error>({
    queryKey: [ALL_ADD_TEST_LICENSE_QUERY_KEY, id],
    queryFn: () => fetchAllAddManufacturingLicense(id),
    enabled: !!id,
  });
};

export const useSaveAddManufacturingLicense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => saveAddManufacturingLicense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALL_ADD_TEST_LICENSE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADD_TEST_LICENSE_QUERY_KEY] }); // specific checklist files
    },
  });
};

export const useAddManufacturingLicense = (userId: string) => {
  return useQuery({
    queryKey: [ADD_TEST_LICENSE_QUERY_KEY, userId],
    queryFn: () => getAddManufacturingLicense(userId),
    enabled: !!userId,
  });
};
