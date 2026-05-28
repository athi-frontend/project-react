/**
 * Classification : Confidential
 **/

export interface NonConformanceDetail {
  inspection_result_id: number
  non_conformance_details_id?: number
  purchase_order_number: string
  purchase_order_date: string | null
  part_category: string
  part_number: string
  status?: number
}

export interface NonConformanceDetailsResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: NonConformanceDetail[]
}

export interface LocationDetails {
  id: number
  floor: string
  room: string
  shelf_details: string
  unit_name: string
  address: string
}

export interface ActionPlanDetails {
  disposal_informmation: string
  type: string
  id?: number
  return_description?: string
  scrap_description?: string
  scrap_disposal_remarks?: string
  employee_id?: number
  rework_instructions?: string
  status: number
}

export interface FileDocument {
  file_id: number
  file_name: string
  file_description: string | null
  file_object_key: string
  purpose: string | null
  source: string | null
  file_size: number
  version: string
  updated_date: string | null
  updated_by: string | null
  status: number
  uploaded_date: string
  extension: string
  file_tags: any[]
}

export interface NonConformanceDetailById {
  part_category: string
  part_number: string
  part_name: string
  unit_batch: string
  aql: string | null
  serial_number: number
  date_inspected: string | null
  test_observation: string
  location: LocationDetails
  defects_description: string
  status: number
  action_plan_id: number
  action_plan_name: string
  action_plan_details: ActionPlanDetails
  file_ids: number[]
  non_conformance_details_id: number
  file_documents: FileDocument[]
}

export interface NonConformanceDetailByIdResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: NonConformanceDetailById[]
}

export interface NonConformanceDetailsUpsertResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: {
    non_conformance_details_id: number
    inspection_result_id: number
  }
}

export interface NonConformanceDetailsTableRow {
  id: number
  sno: number
  purchase_order_number: string
  purchase_order_date: string | null
  part_category: string
  part_number: string
  inspection_result_id: number
  non_conformance_details_id?: number
  actions?: React.ReactNode
}

export interface NonConformanceDetailsFilters {
  status?: number
  purchase_order_number?: string
  part_category?: string
  part_number?: string
}

export interface NonConformanceDetailsUpsertRequest {
  inspection_result_id: number
  non_conformance_details_id: number
  defect_details: string
  action_plan_slug: string
  return_details?: string | null
  disposal_informmation?: string | null
  scrap_description?: string | null
  employee_id?: number | string
  rework_instruction?: string | null
  create_meta_data?: string | null
  update_meta_data?: string | null // JSON string
  documents_to_delete?: string | null // JSON string array of file IDs
  status: number
  documentsToCreate?: File[] // Files array for multipart/form-data
}

export interface NonConformanceDetailsFormData {
  partCategory: string
  partNumber: string
  partName: string
  unitBatch: string
  aql: string
  batchSerialNo: string
  dateInspected: string
  testObservation: string
  floor: string
  room: string
  shelfDetails: string
  unitName: string
  address: string
  defectDescription: string
  actionPlanned: string
  returnDetails: string
  scrapDetails1: string
  scrapDetails2: string
  reworkEmployee: string
  reworkDetails: string
  documents: (File | FileDocument)[]
}

export interface NonConformanceDetailsFormErrors {
  defectDescription?: string
  actionPlanned?: string
  returnDetails?: string
  scrapDetails1?: string
  reworkEmployee?: string
  reworkDetails?: string
  fileUpload?:string
}
