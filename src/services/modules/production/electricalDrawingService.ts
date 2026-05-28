import { apiClient } from '@/shared/apiClient';

export interface ElectricalDrawingDocument {
  file_id: number;
  file_name: string;
  file_description: string | null;
  file_object_key: string;
  purpose: string | null;
  guid: string;
  source: string | null;
  file_size: number;
  version: string;
  updated_date: string | null;
  updated_by: string | null;
  status: number;
  uploaded_date: string;
  extension: string;
  file_bucket: string;
  file_tags: any[];
}

export interface ElectricalDrawingApi {
  electrical_drawing_id: number;
  applicable_settings_id: number;
  drawing_name: string;
  drawing_description: string;
  drawing_type_slug: string;
  document: ElectricalDrawingDocument[];
  [key: string]: any;
}

export interface ElectricalDrawingListResponse {
  data: ElectricalDrawingApi[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ElectricalDrawingPayload {
  electrical_drawing_id?: number;
  applicable_settings_id: number;
  drawing_name: string;
  drawing_description: string;
  drawing_type_slug: string;
  // File-related
  documents_to_create?: File[];
  create_meta_data?: string;
  update_meta_data?: string;
  documents_to_delete?: string;
}

export const fetchElectricalDrawingList = async (assemblyPartItemDetailId: number): Promise<ElectricalDrawingListResponse> => {
  const response = await apiClient.get(`/api/v1/production/electrical-drawing/all`, { params: { applicable_settings_id: assemblyPartItemDetailId } });
  return response.data;
};

export const fetchElectricalDrawingById = async (electricalDrawingId: number): Promise<ElectricalDrawingApi> => {
  const response = await apiClient.get(`/api/v1/production/electrical-drawing/${electricalDrawingId}`);
  return response.data;
};

export const upsertElectricalDrawing = async (payload: ElectricalDrawingPayload): Promise<any> => {
  const formData = new FormData();
  if (payload.electrical_drawing_id) formData.append('electrical_drawing_id', payload.electrical_drawing_id.toString());
  formData.append('applicable_settings_id', payload.applicable_settings_id.toString());
  formData.append('drawing_name', payload.drawing_name);
  formData.append('drawing_description', payload.drawing_description);
  formData.append('drawing_type_slug', payload.drawing_type_slug);
  // File uploads
  // documents_to_create: File[]
  if (payload.documents_to_create && payload.documents_to_create.length > 0) {
    payload.documents_to_create.forEach(file => {
      formData.append('documents_to_create', file);
    });
  } else {
    formData.append('documents_to_create', '[]'); // Always send
  }
  formData.append('create_meta_data', payload.create_meta_data || '{}');
  formData.append('update_meta_data', payload.update_meta_data || '{}');
  formData.append('documents_to_delete', payload.documents_to_delete || '[]');
  const response = await apiClient.post(`/api/v1/production/electrical-drawing`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

/**
 * Delete an electrical drawing by ID
 * @param electricalDrawingId - Electrical Drawing ID
 * @returns Promise<any>
 */
export const deleteElectricalDrawing = async (electricalDrawingId: number): Promise<any> => {
  const response = await apiClient.delete(`/api/v1/production/electrical-drawing/${electricalDrawingId}`);
  return response.data;
};
