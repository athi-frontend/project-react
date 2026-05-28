/**
    Classification : Confidential
**/
export interface ChecklistDetail {
  vendor_agreement_checklist_status_id: string | number;
  checklist_id: number;
  checklist_status: number;
}

export interface VendorAgreementChecklistRequest {
  vendor_id: number;
  vendor_agreement_checklist_id?: string;
  status?: number;
  checklist_details: ChecklistDetail[];
}

export interface VendorAgreementChecklist {
  vendor_agreement_checklist_id: number;
  vendor_id: number;
  vendor_type_id: number;
  status: number;
  status_id?: number;
  checklist_details: ChecklistDetail[];
}

export interface VendorAgreementChecklistResponse {
  code: number;
  message: string;
  data: VendorAgreementChecklist[];
}

export interface VendorAgreementChecklistListResponse {
  data: VendorAgreementChecklistResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface VendorAgreementChecklistFormData {
  vendor_id: number | null;
  vendor_agreement_checklist_id: string;
  checklist_details: ChecklistDetail[];
}

export interface VendorAgreementChecklistTableRow {
  id: number;
  sno: number;
  vendor_type: string;
  vendor_name: string;
  contact_number: string;
  status: number;
  actions?: any;
}

export type SaveType = 'draft' | 'final';

export interface DraftPayload {
  vendor_agreement_checklist_id: string | number;
  vendor_id: number | null;
  vendor_type_id: number | null;
  status: number;
  checklist_details: ChecklistDetail[];
}

export interface FinalPayload {
  vendor_id: number | null;
  vendor_agreement_checklist_id: string;
  status?: number;
  checklist_details: ChecklistDetail[];
}