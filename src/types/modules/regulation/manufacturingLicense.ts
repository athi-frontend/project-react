// Import common types
import { MetaInfo } from './common';

export interface ManufacturingLicenseData {
  id: number;
  section_no: string;
  checklist_name: string;
  file_id?: number;
  file_name?: string;
}

// Updated API response type
export interface ManufacturingLicenseApiResponse {
  data: ManufacturingLicenseData[];
  meta_info: MetaInfo;
}
