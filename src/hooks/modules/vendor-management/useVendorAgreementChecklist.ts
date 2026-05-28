import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllVendorAgreementChecklists, 
  fetchVendorAgreementChecklistById, 
  upsertVendorAgreementChecklist,
  deleteVendorAgreementChecklist
} from "@/services/modules/vendor-management/vendorAgreementChecklist";
import { 
  VENDOR_AGREEMENT_CHECKLIST_HOOK, 
  VENDOR_AGREEMENT_CHECKLIST_BY_ID_HOOK, 
  VENDOR_AGREEMENT_CHECKLIST_LIST_HOOK
} from "@/constants/modules/vendor-management/common";
import { 
  VendorAgreementChecklistRequest, 
  VendorAgreementChecklistResponse, 
  VendorAgreementChecklistListResponse 
} from "@/types/modules/vendor-management/vendorAgreementChecklist";
import { fetchVendorAgreementChecklistList } from "@/services/modules/vendor-management/common";

/**
    Classification : Confidential
**/

export const useAllVendorAgreementChecklists = (status?: number, enabled: boolean = false) => {
  return useQuery<VendorAgreementChecklistListResponse, Error>({
    queryKey: [VENDOR_AGREEMENT_CHECKLIST_HOOK],
    queryFn: () => fetchAllVendorAgreementChecklists(status),
    enabled,
  });
};


export const useVendorAgreementChecklistById = (agreementChecklistId: string, enabled?: boolean) => {
  return useQuery<VendorAgreementChecklistResponse, Error>({
    queryKey: [VENDOR_AGREEMENT_CHECKLIST_BY_ID_HOOK, agreementChecklistId],
    queryFn: () => fetchVendorAgreementChecklistById(agreementChecklistId),
    enabled: enabled ?? !!agreementChecklistId,
    refetchOnMount: 'always', 
  });
};

/**
 * Hook to insert or update vendor agreement checklist
 */
export const useUpsertVendorAgreementChecklist = () => {
  const queryClient = useQueryClient();
 
  
  return useMutation<VendorAgreementChecklistResponse, Error, VendorAgreementChecklistRequest>({
    mutationFn: upsertVendorAgreementChecklist,
    onSuccess: async (data, variables) => {
      // Invalidate and refetch vendor agreement checklist queries
      queryClient.invalidateQueries({ queryKey: [VENDOR_AGREEMENT_CHECKLIST_HOOK] });
      queryClient.invalidateQueries({ queryKey: [VENDOR_AGREEMENT_CHECKLIST_BY_ID_HOOK] });
      
      // Optionally set the new data in cache
      if (variables.vendor_agreement_checklist_id) {
        queryClient.setQueryData(
          [VENDOR_AGREEMENT_CHECKLIST_BY_ID_HOOK, variables.vendor_agreement_checklist_id],
          data
        );
      }

    },
  });
};

export const useDeleteVendorAgreementChecklist = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorAgreementChecklistResponse, Error, number>({
    mutationFn: deleteVendorAgreementChecklist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDOR_AGREEMENT_CHECKLIST_HOOK] });
    },
  });
};

export const useVendorAgreementChecklistList = (status?: number, enabled: boolean = true) => {
  return useQuery<any, Error>({
    queryKey: [VENDOR_AGREEMENT_CHECKLIST_LIST_HOOK, status],
    queryFn: () => fetchVendorAgreementChecklistList(status),
    enabled,
  });
};
