/**
 * Classification : Confidential
**/

export interface VendorEvaluationObservation {
  area: string;
  observation: string;
}

export interface VendorEvaluationRequest {
  create_meta_data: string;
  update_meta_data: string;
  documents_to_create: string;
  documents_to_delete: string;
  audit_conclusion: string;
  customer_support_observation: VendorEvaluationObservation[];
  logistics_observation: VendorEvaluationObservation[];
  quality_control_observation: VendorEvaluationObservation[];
  manufacturing_observation: VendorEvaluationObservation[];
  design_observation: VendorEvaluationObservation[];
  vendor_part_category_mapper_id: number;
}

export interface VendorEvaluation {
  vendor_evaluation_id: number;
  vendor_id: number;
  vendor_name: string;
  part_category_name: string;
  vendor_part_category_mapper_id: number;
  criteria_evaluations: CriteriaEvaluation[];
  design: string;
  manufacturing: string;
  quality_control: string;
  logistics: string;
  customer_support: string;
  audit_conclusion: string;
  documents: Document[];
}

export interface CriteriaEvaluation {
  group_id: number;
  group_name: string;
  criteria_items: CriteriaItem[];
}

export interface CriteriaItem {
  vendor_group_criteria_mapper_id: number;
  criteria_id: number;
  criteria_name: string;
  requirement_type: string;
  requirement_id: number;
  status: number;
  remarks: string;
}

export interface Document {
  file_id: number;
  file_name: string;
  file_description: string | null;
  file_category: string;
  file_category_id: number;
  file_object_key: string;
  purpose: string;
  source: string;
  file_size: number;
  version: string;
  updated_date: string | null;
  updated_by: string | null;
  status: number;
  uploaded_date: string;
  extension: string;
  file_tags: FileTag[];
}

export interface FileTag {
  tag_id: number;
  tag_name: string;
}

export interface VendorEvaluationResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: VendorEvaluation[];
}

export interface VendorEvaluationListResponse {
  data: VendorEvaluation[];
  total: number;
  page: number;
  limit: number;
}

export interface CriteriaEvaluationItem {
  vendor_group_criteria_mapper_id: number;
  selection_status: number;
  remarks: string;
}

export interface VendorEvaluationFormData {
  create_meta_data: string;
  update_meta_data: string;
  documents_to_create: string;
  documents_to_delete: string;
  audit_conclusion: string;
  customer_support_observation: string;
  logistics_observation: string;
  quality_control_observation: string;
  manufacturing_observation: string;
  design_observation: string;
  vendor_part_category_mapper_id: number | null;
  criteria_evaluations: CriteriaEvaluationItem[];
}

export interface VendorEvaluationTableRow {
  id: number;
  sno: number;
  vendor_name: string;
  product_name: string;
  model_name: string;
  status: number;
  actions?: any;
}

export interface VendorEvaluationListItem {
  vendor_id: number;
  vendor_name: string;
  vendor_part_category_mapper_id: number | null;
  part_category_name: string | null;
  part_category_type: string | null;
  part_sub_class: string | null;
  part_sub_type: string | null;
}

export interface VendorEvaluationListApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: VendorEvaluationListItem[];
}
