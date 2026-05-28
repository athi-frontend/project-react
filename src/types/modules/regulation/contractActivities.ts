// Import common types
import { MetaInfo } from './common';

export interface ContractActivitiesData {
  organization_site_id: number;
  contract_activities: string;
}

// Updated API response type
export interface ContractActivitiesApiResponse {
  data: ContractActivitiesData[];
  meta_info: MetaInfo;
}
