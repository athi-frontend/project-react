/**
 * Infrastructure Qualification Types
 * Classification: Confidential
 */

import { Dayjs } from 'dayjs'

export interface InfrastructureQualificationTableData {
  id: string;  
  sno?: string; 
  qualification_test_id: string | number;
  qualification_checklist_items_id: string | number;
  test_observation: string;
  verification_result: string; 
  test_performed?: string; 
  acceptance_criteria?: string; 
}

/**
 * Infrastructure Qualification Item (for API payload)
 */
export interface InfrastructureQualificationItem {
  qualification_test_id : number | string
  qualification_checklist_items_id: number | string
  test_observation: string
  verification_result: string
}

/**
 * Infrastructure Qualification Payload (for create/upsert)
 */
export interface InfrastructureQualificationPayload {
  infrastructure_qualification_id?: number | string
  infrastructure_id: number | string
  infrastructure_qualification_checklist_id?: number | string
  application_of_infrastructure: string
  qualification_procedure_and_acceptance_criteria: string
  maintenance_service_type_lk_id: number | string
  inspection_date: Dayjs | string | null
  infrastructure_qualification: InfrastructureQualificationItem[]
  status?: number | string
}