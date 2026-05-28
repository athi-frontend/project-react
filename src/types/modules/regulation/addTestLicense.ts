// Import common types
import { MetaInfo } from './common';

export interface AddTestLicenseData {
  checklist_id: number;
  section_no: string;
  checklist_name: string;
  file_id?: number;
  file_name?: string;
}

// Updated API response type
export interface AddTestLicenseApiResponse {
  data: AddTestLicenseData[];
  meta_info: MetaInfo;
}
