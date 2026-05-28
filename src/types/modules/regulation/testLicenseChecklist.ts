// Import common types
import { MetaInfo } from './common';

export interface TestLicenseChecklistData {
  checklist_id: number;
  section_no: string;
  checklist_name: string;
  is_mandatory: boolean;
}

// Updated API response type
export interface TestLicenseChecklistApiResponse {
  data: TestLicenseChecklistData[];
  meta_info: MetaInfo;
}

// Keep the existing interface for backward compatibility
export interface TestLicenseChecklistItem {
  checklist_id: number;
  is_mandatory: number;
}