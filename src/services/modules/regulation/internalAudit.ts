import { apiClient } from '@/shared/apiClient';
import { INTERNAL_AUDIT_SELF_INSPECTION_API } from '@/constants/modules/regulation/internalAudit';
import { InternalAuditSelfInspectionPayload } from '@/types/modules/regulation/internalAudit';

export const fetchInternalAuditSelfInspection = async (id: number) => {
  const response = await apiClient.get(INTERNAL_AUDIT_SELF_INSPECTION_API.FETCH(id));
  return response.data;
};

export const saveInternalAuditSelfInspection = async (payload: InternalAuditSelfInspectionPayload) => {
  const response = await apiClient.post(INTERNAL_AUDIT_SELF_INSPECTION_API.SAVE, payload);
  return response.data;
}; 