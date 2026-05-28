/**
 * Classification : Confidential
**/

import { FinalFileData } from "@/lib/utils/common";
import { FileData, FileDocument, FileDocument } from "@/types/components/ui/fileUploadV3";

export interface VendorReEvaluationResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: VendorReEvaluation[];
}

export interface VendorReEvaluation {
  vendor_reevaluation_id: number;
  vendor_type_id: number;
  vendor_type_name: string;
  vendor_id: number;
  vendor_name: string;
  last_reevaluation: string;
  from_date: string;
  to_date: string;
  status: number;
  quality_rating: number;
  delivery_rating: number;
  support_rating: number;
  overall_rating: number;
  design_observation: string;
  manufacturing_observation: string;
  quality_control_observation: string;
  logistics_observation: string;
  customer_support_observation: string;
  conclusion: string;
  conclusion_audit: string;
  vendor_reevaluation_criteria: VendorReEvaluationCriteria[];
  response_quality_issues: QualityIssue[];
  documents: FileDocument[];
}

export interface VendorReEvaluationCriteria {
  group_id: number;
  group_name: string;
  re_evaluation_applicable_group_id: number;
  applicable_group_display_order?: number;
  criteria_details: CriteriaDetail[];
  documents?: FileDocument[];
  applicable_group_files?: FileDocument[];
}

export interface CriteriaDetail {
  re_evaluation_group_criteria_mapper_id: number;
  group_criteria_id: number;
  group_criteria_name: string;
  requirement: string;
  selection_status: number;
  display_order: number;
}

export interface QualityIssue {
  evaluation_issue_response_id: number;
  serial_number: string;
  issues_raised: string;
  resolution: string;
  effectiveness: string;
  status: number;
}



export interface VendorReEvaluationFormData {
  vendor_reevaluation_id?: number;
  vendor_type_id?: number;
  vendor_id?: number;
  part_category_mapper_id: number;
  re_evaluated_date: string;
  evaluation_from_date: string;
  evaluation_to_date: string;
  reevaluation_criteria: ReEvaluationCriteriaItem[];
  quality_rating: number;
  delivery_rating: number;
  supporting_rating: number;
  overall_rating: number;
  design_observation: string;
  manufacturing_observation: string;
  quality_control_observation: string;
  logistics_observation: string;
  customer_support_observation: string;
  conculation: string;
  response_quality_issues: QualityIssueFormItem[];
  re_evaluation_conclusion: string;
  status: number;
}

export interface ReEvaluationCriteriaItem {
  vendor_selection_criteria_re_evaluation_id?: number | string;
  vendor_reevaluation_criteria_id: number;
  selection_status: number | null;
}

export interface QualityIssueFormItem {
  evaluation_issue_response_id?: number;
  serial_number: string;
  issue_raised: string;
  resolution: string;
  effectiveness: string;
  status: number;
}

export interface QualityIssueData {
  id: string;
  serial_number: string;
  issue_raised: string;
  resolution: string;
  effectiveness: string;
  status: number;
  evaluation_issue_response_id?: number;
}

export interface ExtendedFinalFileData extends FinalFileData {
  existingFiles?: FileDocument[];
  fileDataArray?: FileData[];
}