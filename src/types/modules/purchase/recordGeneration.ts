/**
 * Classification : Confidential
 **/

import { OrganizationRecord } from '@/services/modules/hr/organizationRecord'

// Extended interface for Purchase Record with Vendor Name
export interface PurchaseRecord extends OrganizationRecord {
  vendor_name?: string | null
}

// Record Generation Request Interface
export interface RecordGenerationRequest {
  menu_id: number
  context_id: number[]
  context_type: string
  version_type?: string
  verification_type?: string
  water_mark_text?: string
}

// Record Generation Response Interface
export interface RecordGenerationResponse {
  code: number
  status: string
  message: string
  description: string
  response_timestamp: string
  data: any[]
}
