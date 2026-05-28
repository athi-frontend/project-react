import { COMMON_APIS } from '@/constants/apiEndPoints';
import { NUMBERMAP } from '@/constants/common';
import { DRAFT_SAVE_CONFIG } from '@/constants/modules/regulation/draftSave';
import { mapDocumentsByCategory, mapFileResponse } from '@/lib/utils/common';
import { apiClient } from '@/shared/apiClient';


/**
    Classification : Confidential
**/

export interface DraftSavePayload {
  draft_data: string; // JSON stringified form data
  context_type: string;
  context_instance_id: number | string;
  documents: {}
  menu_id: number | string;
}

export interface FetchDraftPayload {
  context_type: string;
  context_instance_id: number | string | null;
  menu_id: number | string;
}

const prepareDocuments = (documents: any, formData: FormData) => {
  if (documents.documents_to_create && documents.documents_to_create.length > NUMBERMAP.ZERO) {
    documents.documents_to_create.forEach((file: File) => {
      formData.append('documents_to_create', file, file.name);
    });
  }
  if (documents.create_meta_data && Object.keys(documents.create_meta_data).length > NUMBERMAP.ZERO) {
    formData.append('create_meta_data', JSON.stringify(documents.create_meta_data));
  }
  if (documents.update_meta_data && Object.keys(documents.update_meta_data).length > NUMBERMAP.ZERO) {
    const UpdateMeta = Object.values(documents.update_meta_data).reduce((acc, obj) => {
      Object.assign(acc, obj);
      return acc;
    }, {});
    formData.append('update_meta_data', JSON.stringify(UpdateMeta));
  }
  if (documents.documents_to_preserve && documents.documents_to_preserve.length > NUMBERMAP.ZERO) {
    formData.append('documents_to_preserve', JSON.stringify(documents?.documents_to_preserve?.map(Number)??[]));
  }

  return formData;
}
export const postDraftSave = async (data: DraftSavePayload, signal?: AbortSignal) => {
  if (!data.draft_data) {
    throw new Error('Invalid draft save payload');
  }
  const formData = new FormData();
  formData.append('draft_data', data.draft_data);
  formData.append('context_type', data.context_type);
  formData.append('context_instance_id', String(data.context_instance_id));
  formData.append('menu_id', String(data.menu_id));
  if (data.documents) {
    prepareDocuments(data.documents, formData);
  }
  const response = await apiClient.post(DRAFT_SAVE_CONFIG.API_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    signal, // Pass the abort signal to the request
  });
  return response.data;
};

export const fetchDraftSave = async (data: FetchDraftPayload, signal?: AbortSignal) => {

  if (!data.context_type) {
    throw new Error('Invalid draft save payload');
  }

  const response = await apiClient.post(COMMON_APIS.draft.getByIdUrl(), {
    context_type: data.context_type,
    context_instance_id: data.context_instance_id,
    menu_id: data.menu_id
  });
  if(response.data?.data){
    let draftData = response.data;
    if(draftData?.data?.documents){
      draftData.data.documents = mapFileResponse(draftData.data.documents??[]);
      draftData.data.draftDocuments = mapDocumentsByCategory(draftData.data?.draftDocuments??{});
    }
    return draftData;
  }
  return response.data;
};