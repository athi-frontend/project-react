export interface Acknowledgement {
  design_transfer_plan_id: number,
  document_id: number;
  document_title: string;
  is_verified: number;
}

export interface AcknowledgementFormData {
  acknowledgement_statement: number;
  documents: Acknowledgement[];
}