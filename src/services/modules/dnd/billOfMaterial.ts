import { apiClient } from '@/shared/apiClient';
import { SUB_BASE_URL_BOM, BOM_API_ENDPOINTS } from '@/constants/modules/dnd/bom';
import { NUMBERMAP } from '@/constants/common';

export const fetchBillOfMaterialByProductId = async (productId: number) => {
  const response = await apiClient.get(BOM_API_ENDPOINTS.ALL, {
    params: { product_id: productId },
  });
  return response.data;
};

export const fetchModelsByProjectId = async (projectId: number) => {
  const response = await apiClient.get(BOM_API_ENDPOINTS.MODELS, {
    params: { project_id: projectId },
  });
  return response.data;
};

export const fetchVersionsByProjectId = async (projectId: number) => {
  const response = await apiClient.get(BOM_API_ENDPOINTS.VERSIONS, {
    params: { project_id: projectId },
  });
  return response.data;
};

export const fetchBomUploadList = async (projectId: number) => {
  const response = await apiClient.get(`${SUB_BASE_URL_BOM}`, {
    params: { project_id: projectId },
  });
  return response.data;
};

export const publishBillOfMaterial = async (product_id: number, project_id: number) => {
  const response = await apiClient.post(BOM_API_ENDPOINTS.PUBLISH, {
    product_id,
    project_id: project_id,
  });
  return response.data;
};

export const uploadBomFile = async (formData: FormData) => {
  const response = await apiClient.post(BOM_API_ENDPOINTS.UPLOAD, formData);
  return response.data;
};

export const fetchBomUploadDetail = async (bom_upload_id: number) => {
  const response = await apiClient.get(SUB_BASE_URL_BOM, {
    params: { bom_upload_id },
  });
  return response.data;
};

export const fetchOrganizationUnits = async () => {
  const response = await apiClient.get(BOM_API_ENDPOINTS.ORGANIZATION_UNITS, {
    params: { status:  NUMBERMAP.ONE },
  });
  return response.data;
};

export const fetchOrganizationSites = async () => {
  const response = await apiClient.get(BOM_API_ENDPOINTS.ORGANIZATION_SITES, {
    params: { status: NUMBERMAP.ONE },
  });
  return response.data;
};

export const fetchAssemblyTypes = async () => {
  const response = await apiClient.get(BOM_API_ENDPOINTS.ASSEMBLY_TYPES, {
    params: { status: NUMBERMAP.ONE },
  });
  return response.data;
};

export const saveBomPart = async (formData: FormData) => {
  const response = await apiClient.post(`${SUB_BASE_URL_BOM}/`, formData);
  return response.data;
};

export const fetchBomPartById = async (bom_part_id: number) => {
  const response = await apiClient.get(`${SUB_BASE_URL_BOM}/${bom_part_id}`);
  return response.data;
};

export const deleteBomPart = async (bom_part_id: number) => {
  const response = await apiClient.delete(`${SUB_BASE_URL_BOM}/${bom_part_id}`);
  return response.data;
};