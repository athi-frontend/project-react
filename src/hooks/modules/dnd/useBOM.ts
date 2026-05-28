import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBillOfMaterialByProductId,
  fetchModelsByProjectId,
  fetchVersionsByProjectId,
  fetchBomUploadList,
  publishBillOfMaterial,
  uploadBomFile,
  fetchBomUploadDetail,
  fetchOrganizationUnits,
  fetchOrganizationSites,
  fetchAssemblyTypes,
  saveBomPart,
  deleteBomPart,
  fetchBomPartById,
} from "@/services/modules/dnd/billOfMaterial";
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useBillOfMaterial = (productId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BILL_OF_MATERIAL, productId],
    queryFn: () => fetchBillOfMaterialByProductId(productId),
    enabled: !!productId && enabled,
  });
};

export const useBomUploadList = (projectId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BOM_UPLOAD_LIST, projectId],
    queryFn: () => fetchBomUploadList(projectId),
    enabled: !!projectId && enabled,
  });
};

export const useBomUploadDetail = (bomUploadId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BOM_UPLOAD_DETAIL, bomUploadId],
    queryFn: () => fetchBomUploadDetail(bomUploadId),
    enabled: !!bomUploadId && enabled,
  });
};

export const useModelOptions = (projectId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.MODELS, projectId],
    queryFn: () => fetchModelsByProjectId(projectId),
    enabled: !!projectId && enabled,
  });
};

export const useVersionOptions = (projectId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BOM_VERSIONS, projectId],
    queryFn: () => fetchVersionsByProjectId(projectId),
    enabled: !!projectId && enabled,
  });
};

export const usePublishBillOfMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ product_id, project_id }: { product_id: number; project_id: number }) => publishBillOfMaterial(product_id, project_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOM.FETCH_ALL] });
    },
  });
};

export const useUploadBomFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadBomFile(formData),
    onSuccess: () => {
      showActionAlert('success');
      queryClient.invalidateQueries();
    },
    onError: () => {
      showActionAlert('failed');
    },
  });
};

export const useOrganizationUnits = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.ORGANIZATION_UNITS],
    queryFn: () => fetchOrganizationUnits(),
  });
};

export const useOrganizationSites = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.ORGANIZATION_SITES],
    queryFn: () => fetchOrganizationSites(),
  });
};

export const useAssemblyTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.ASSEMBLY_TYPES],
    queryFn: () => fetchAssemblyTypes(),
  });
};

export const useSaveBomPart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => saveBomPart(formData),
    onSuccess: () => {
      showActionAlert('success');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOM.BILL_OF_MATERIAL] });
    },
    onError: () => {
      showActionAlert('failed');
    },
  });
};

export const useBomPartById = (bom_part_id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BOM_PART, bom_part_id],
    queryFn: () => fetchBomPartById(bom_part_id),
    enabled: !!bom_part_id,
    refetchOnMount: 'always',
  });
};

export const useDeleteBomPart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bom_part_id: number) => deleteBomPart(bom_part_id),
    onSuccess: () => {
      showActionAlert('success');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOM.BILL_OF_MATERIAL] });
    },
    onError: () => {
      showActionAlert('failed');
    },
  });
};
