// Import common types
import { MetaInfo } from './common';

export interface DirectContactVerification {
  id?: string;
  part_name: string;
  material: string;
}
export interface IndirectContactVerification {
  id?: string;
  part_name: string;
  material: string;
}
export interface BiocompatibleTestResult {
  id?: string;
  std_ref: string;
  scope_of_plan: string;
  result: string;
}
export interface VerificationValidationData {
  verification_id: number;
  device_master_id: number;
  general: string;
  biocompatibility: string;
  biocompatibility_test_report: string;
  biological_evaluation: string;
  medicinal_substances: string;
  biological_safety: string;
  sterile_eto_method: string;
  software_verification: string;
  animal_studies: string;
  stability_data: string;
  main_unit: string;
  utility_type_details: string;
  accelerated_study_report: string;
  clinical_evidance: string;
  post_market_surveilance_data: string;
  direct_contact_verification: DirectContactVerification[];
  indirect_contact_verification: IndirectContactVerification[];
  biocompatible_test_results: BiocompatibleTestResult[];
}

export interface MaterialEditData {
  id: string;
  partName: string;
  material: string;
}

export interface BiocompatibilityTestEditData {
  id: string;
  stdRef: string;
  scopeOfStudy: string;
  result: string;
}

// Updated API response type
export interface VerificationValidationApiResponse {
  data: VerificationValidationData[];
  meta_info: MetaInfo;
} 