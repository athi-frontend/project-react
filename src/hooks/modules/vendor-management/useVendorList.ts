// External dependencies
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Internal services
import { 
  fetchAllVendors, 
  fetchVendorById,
  deleteVendor,
  createUpdateVendor
} from "@/services/modules/vendor-management/vendorList";
// Internal constants and types
import { 
  VENDOR_LIST_HOOK, 
  VENDOR_LIST_BY_ID_HOOK
} from "@/constants/modules/vendor-management/vendorList";
import { 
  VendorListResponse,
  VendorCreateUpdateResponse
} from "@/types/modules/vendor-management/vendorList";
import { VENDOR_EVALUATION_HOOK } from "@/constants/modules/vendor-management/vendorEvaluation";
import { NUMBERMAP } from "@/constants/common";

/**
    Classification : Confidential
**/

export const useAllVendors = (enabled: boolean = true,status?:number) => {
  return useQuery<VendorListResponse, Error>({
    queryKey: [VENDOR_LIST_HOOK],
    queryFn: () => fetchAllVendors(status),
    enabled,
  });
};

export const useVendorById = (vendorId: string, enabled?: boolean) => {
  return useQuery<VendorListResponse, Error>({
    queryKey: [VENDOR_LIST_BY_ID_HOOK, vendorId],
    queryFn: () => fetchVendorById(vendorId),
    enabled: enabled ?? !!vendorId,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorListResponse, Error, number>({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDOR_LIST_HOOK] });
    },
  });
};

export const useCreateUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorCreateUpdateResponse, Error, FormData>({
    mutationFn: createUpdateVendor,
    onSuccess: (_, formData) => {    
      const vendorIdFromForm = formData.get('vendor_id');
      const vendorId = vendorIdFromForm ?? null;
      queryClient.invalidateQueries({ queryKey: [VENDOR_LIST_HOOK] });
      queryClient.invalidateQueries({ queryKey: [VENDOR_EVALUATION_HOOK] });
      if (vendorId) {
        queryClient.invalidateQueries({ queryKey: [VENDOR_LIST_BY_ID_HOOK, vendorId.toString()] });
      }
    },
  });
};
