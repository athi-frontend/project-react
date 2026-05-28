export interface EssentialPrinciplesChecklistItem {
  id: number;
  device_master_file_id: number;
  principles_checklist: string;
  is_relevant: number; // 1 or 0
  specification_standard_subclause_reference: string;
  is_complies: number; // 1 or 0
  document_reference_notes: string;
}

export type CreateEssentialPrinciplesChecklistPayload = {
  project_id: number;
  principles_checklist: string;
  is_relevant: number;
  specification_standard_subclause_reference: string;
  is_complies: number;
  document_reference_notes: string;
};

export type FormData = {
    essentialPrinciple: string;
    relevant: string;
    specification: string;
    complies: string;
    documentRef: string;
};

export type FormErrors = Partial<Record<keyof FormData, string>>; 