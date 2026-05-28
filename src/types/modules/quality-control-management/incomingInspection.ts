export interface IncomingInspectionPartDetail {
  goods_inward_detail_id: number
  part_id: number
  part_number: string
  quantity: number
  safety_critical: string | null
  batch_unit: string | null
  aql: string | null
  hardware_software: string | null
  status: string | null
}

export interface IncomingInspectionData {
  purchase_order_number: string
  purchase_order_date: string
  vendor_type: string
  vendor_name: string
  part_details: IncomingInspectionPartDetail[][]
}

export interface IncomingInspectionResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: IncomingInspectionData[]
}

export interface CalibrationDetail {
  calibration_status: string
  calibration_date: string
  calibration_due_date: string
  fk_eqms_file_id: number
}

export interface DocumentTag {
  tag_id: number
  tag_name: string
}

export interface InspectionDocument {
  file_id: number
  file_name: string
  file_description: string | null
  file_category: string
  file_category_id: number
  file_object_key: string
  purpose: string
  guid: string
  source: string
  file_size: number
  version: string
  updated_date: string | null
  updated_by: string | null
  status: number
  uploaded_date: string
  extension: string
  file_bucket: string
  file_tags: DocumentTag[]
}

export interface SpecificationObservation {
  specification_result_id: number
  unit_number: number
  serial_number: string
  test_observation: string
  test_result: number
  batch_number?: string | null
  test_result_slug: string
  test_result_verification_result: string
}

export interface InspectionSpecificationDetail {
  specification_criteria_id: number
  observation: SpecificationObservation[]
}

export interface DeviationNote {
  deviation_note_id: number
  deviation_approval: number
  reason_for_deviation: string
  deviation_comments: string
  reason_decision: string
}

export interface InitiateInspectionRecord {
  initiate_inspection_result_id: number
  goods_inward_detail_id: number
  part_number: string | null
  part_description: string | null
  safety_critical: string | null
  aql: string | null
  drawing_number: string | null
  inspection_procedure: string | null
  po_reference_number: string | null
  supply_reference_number: string | null
  order_quantity: number | null
  supply_received: number | null
  quantity_received: number | null
  no_of_batch_received: number | null
  unit_per_batch: number | null
  unit_test_per_batch: number | null
  inspection_quantity: number | null
  equipment_type: string | null
  equipment_type_id: number | null
  equipment_item_id: number | null
  calibration_details: CalibrationDetail[]
  inspected_by: number | null
  inspection_date: string | null
  inspection_result_id: number | null
  remarks: string | null
  deviation_note: DeviationNote[] | null
  documents: InspectionDocument[]
  inspection_result: number | null
  inspection_result_slug: string | null
  inspection_result_verification_result: string | null
  inspection_specification_details: InspectionSpecificationDetail[]
  part_quantity_type_id: number | null
  rejection_per_batch: number | null
  rejection_confirmation: number | null
}

export interface InitiateInspectionResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: InitiateInspectionRecord[]
}

export interface FileMetaPayload {
  fileName: string
  source: string
  date_of_upload: string
  categoryId: number
  purpose: string
  file_status: number
  tags: string[]
}

/** Unit inspection: observation uses unit_number and unit_serial_no */
export interface SpecificationObservationPayload {
  specification_result_id: number | string
  unit_number: number
  unit_serial_no: string
  test_observation: string
  test_result: number
}

/** Batch inspection: observation uses batch_number and batch_unit_number */
export interface BatchSpecificationObservationPayload {
  specification_result_id: number | string
  batch_number: string
  batch_unit_number: number
  test_observation: string
  test_result: number
}

export interface InspectionSpecificationPayload {
  specification_criteria_id: number
  observation: SpecificationObservationPayload[] | BatchSpecificationObservationPayload[]
}

export interface DeviationNotePayload {
  deviation_note_id: number | string
  deviation_approval: number
  reason_for_deviation: string
  deviation_comments: string
  reason_decision: string
}

export interface InitiateInspectionPayload {
  /** Present for unit (edit); empty/omitted for batch create */
  incoming_inspection_result_id?: number | ''
  goods_inward_detail_id: number
  inspection_quantity: number
  equipment_item_id: number
  batch_received: number
  unit_per_batch: number
  unit_tested_per_batch: number
  inspected_by: number
  create_meta_data: Record<string, FileMetaPayload>
  documents_to_delete?: number[]
  update_meta_data?: Record<string, FileMetaPayload>
  inspected_date: string
  remarks: string
  /** Unit only; batch does not send inspection_result */
  inspection_result?: number
  inspection_specification_details: InspectionSpecificationPayload[]
  deviation_note?: DeviationNotePayload
  part_quantity_type_id?: number
  rejection_per_batch?: number
  rejection_confirmation?: number
}

// Incoming inspection initiate form (UI state)
export interface IncomingInspectionInitiateFormErrors {
  numberOfBatches?: string
  unitsPerBatch?: string
  unitsToTest?: string
  inspectionQuantity?: string
  rejectionsPerBatch?: string
  confirmAQL?: string
  equipmentUsed?: string
  inspectedBy?: string
  inspectionDate?: string
  inspectionResult?: string
  remarks?: string
}

export interface IncomingInspectionInitiateFormState {
  numberOfBatches: string
  unitsPerBatch: string
  unitsToTest: string
  inspectionQuantity: string
  rejectionsPerBatch: string
  confirmAQL: boolean
  equipmentUsed: string
  inspectedBy: string
  inspectionDate: import('dayjs').Dayjs | null
  inspectionResult: number
  remarks: string
  deviationApproval: number
  reasonForDecision: string
}

/**
 * Response structure from Fetch All API
 * GET /api/v1/quality-control/incoming-inspection/all
 */
export interface IncomingInspectionListData {
  inspection_result_id: number
  purchase_order_number: string
  part_number: string
  sno?: number
}

export interface IncomingInspectionListResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: IncomingInspectionListData[]
}