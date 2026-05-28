import { showActionAlert } from "@/components/ui";
import { STATUS } from "@/constants/common";
import { fetchAcknowledgement, createAcknowledgement, fetchDocuments } from "@/services/modules/dnd/acknowledgementDesignTransfer";
import { AcknowledgementFormData } from "@/types/modules/dnd/acknowledgementTransfer";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from 'next/navigation';
import { QUERY_KEYS } from "@/constants/modules/dnd/acknowledgmentTransfer";

export const useGetAcknowlegment = (ack_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ACKNOWLEDGEMENT, ack_id],
        queryFn: () => fetchAcknowledgement(ack_id),
        enabled:!!ack_id,
    })
}

export const useSaveAcknowledgement = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const ack_id = Number(params.id);
    return useMutation({
        mutationFn: (data: AcknowledgementFormData) => createAcknowledgement(data, ack_id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ACKNOWLEDGEMENT, ack_id]})
        },
        onError: () => {
              showActionAlert(STATUS.FAILED)
            },
    })
}

export const useGetDocuments = (design_transfer_document_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DOCUMENTS, design_transfer_document_id],
        queryFn: () => fetchDocuments(design_transfer_document_id),
        enabled:!!design_transfer_document_id,
    })
}
