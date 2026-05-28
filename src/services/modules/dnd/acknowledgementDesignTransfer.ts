import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/dnd/acknowledgmentTransfer";
import { AcknowledgementFormData } from "@/types/modules/dnd/acknowledgementTransfer";


export const fetchAcknowledgement = async(acknowledgement_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH(acknowledgement_id))
    return response.data
}

export const createAcknowledgement = async(uploadData: AcknowledgementFormData, ack_id: number) => {
    const response = await apiClient.post(API_ENDPOINTS.POST_EVALUATION(ack_id), uploadData);
    return response.data;
}

export const fetchDocuments = async(design_transfer_document_id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_DOCUMENTS_BY_ID(design_transfer_document_id));
    return response.data
}