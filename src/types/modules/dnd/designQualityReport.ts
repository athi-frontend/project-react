import { FileDocument } from '@/types/components/ui/fileUploadV3'
export interface QualityReport {
  project_quality_plan_id: number | string
  item_for_test: string
//   uploadedFile: File[] | FileDocument[];
  uploadedFile: File[] | FileDocument[];
  stage_name: string,
  stage_number?: string,
  item_for_test_id: number,
  test_method_acceptance_criteria: string,
  parameters_for_inspection?: { specification_type: string }[]
}


export interface Test {
stage_item_id: number
item_type:string
}

export interface StageRowData {
  stage_name?: string;
  stage_number?: string;
}

export interface QualityReportRow extends StageRowData {
  id: number;
  parameters_for_inspection?: { specification_type: string }[];
}