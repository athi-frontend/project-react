export interface ItemForTest {
    s_no: string
    id: number
    items_for_test: string
    sl_no_batch_no: string
}

export interface ReportForm {
    verification_plan_dir_id: number | string
    verification_plan_id: number | string
    dir_name: string
    dir_id: string
    units_to_be_verified: number | string
    item_for_test: ItemForTest[]
    item_for_test_id: number | string,
    batch_no: number | string,
    software_version: string
    jigs_used: (string | number)[]
    jigs: Jigs[]
    acceptance_criteria: string
    aim: string
    test_equipments: (string | number)[]
    equipments: Equipment[]
    tool_used: (string | number)[]
    tools_used: (string | number)[]
    tools: any[]
    parameter_checked: string
    parameters_checked: string
    test_value: string
    test_result: string
    verification_result: number | string,
    verification_result_id: number,
    tested_by: number | string,
    tested_by_id: number | string,
    tested_user_id: number | string,
    tested_date: string
    tested_on: string
    documents: File[]
    supporting_documents: any[]
    documents_to_delete: number[]
    create_meta_data: Record<string, any>
    update_meta_data: Record<string, any>
    design_input_requirement_id: number
}

export interface Jigs {
    id: number
    jig_name: string

}

export interface Equipment {
    id: number
    equipment_name: string
}

export interface UploadedFileData {
  id: string
  name: string
  file?: File
  source: string
  uploadDate: string
  category: string
  status: string
  document_id?: number
}

export interface DocumentStructure {
  documents_to_create: string[]
  documents_to_delete: string[]
  create_meta_data: Record<string, string>
  update_meta_data: Record<string, string>
  local_files_to_delete: string[]
}

export interface VerificationReportItem {
  execution_plan_id?: number
  verification_stage_id?: number | null
  dir_id: string | number
  design_input_requirement_id?: number
  units_to_be_verified: number
  verification_plan_dir_id: number
  dir_no: string
  status: number
  dir_category: string
  dir_category_slug: string
  report_type_slug: string
}