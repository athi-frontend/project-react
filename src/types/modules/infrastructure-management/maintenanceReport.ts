/**
 * Classification : Confidential
 **/

import { Dayjs } from 'dayjs'

// API Response types
export interface MaintenanceReportItem {
  maintenance_report_id?: number;
  infrastructure_id: number;
  infrastructure_name: string;
  infrastructure_category_id: number;
  infrastructure_category: string;
  infrastructure_type_id: number;
  infrastructure_type: string;
  infrastruture_serial: string;
  inspection_on: string;
  status_id: string;
  status_slug: string;
  status: string;
}

export interface MaintenanceReportListApiResponse {
  data: MaintenanceReportItem[];
}

// Transformed types for table display
export interface MaintenanceReportTableItem {
  maintenance_id: number;
  sno: string;
  infra_category: string;
  infra_type: string;
  infra_name: string;
  infra_serial_no: string;
  inspected_on: string;
  status: number;
}

// Infrastructure Details API Response Types
export interface InfrastructureDetailsItem {
  infrastructure_id: number;
  purchase_order_number_id: number;
  purchase_order_number: string;
  infrastructure_category_id: number;
  infrastructure_category_name: string;
  infrastructure_type_id: number;
  infrastructure_type: string;
  name_of_infrastructure: string;
  model_no_id: number;
  model_no: string;
  serial_number: string;
  department_function_id: number;
  department_function_name: string;
  description_of_product: string;
  power_supply_id: number;
  power_supply: string;
  installation_procedure_available: number;
  process_equipment: number;
  maintenance_start_date: string;
  set_notification_id: number;
  set_notification: string;
  status_id: number;
  upload_image: any[];
  upload_document: any[];
}

export interface InfrastructureDetailsApiResponse {
  data: InfrastructureDetailsItem[];
}

// Maintenance Report Detail API Response Types
export interface CalibrationDetail {
  calibration_status: string;
  calibration_date: string;
  calibration_due: string;
  calibration_certificate: number;
}

export interface EquipmentItem {
  report_equipment_id: number;
  equipment_category: string;
  equipment_type: string;
  equipment_item_id: number;
  calibration_details: CalibrationDetail[];
}

export interface MaintenanceDetail {
  maintenance_report_detail_id: number;
  maintenance_plan_detail_id: number;
  description: string;
  to_be_done: string;
  frequency: string;
  frequency_slug: string;
  next_schedule_date: string;
  action_carried_out: string;
  maintenance_date: string;
  service_type_id: number;
  service_type: string;
}
export interface DocumentItem {
  file_id: number;
  file_name: string;
  file_description: string | null;
  file_object_key: string;
  purpose: string | null;
  guid: string;
  source: string | null;
  file_size: number;
  version: string;
  updated_date: string | null;
  updated_by: string | null;
  status: number;
  uploaded_date: string;
  extension: string;
  file_bucket: string;
  file_tags: any[];
}

export interface MaintenanceReportDetailItem {
  infrastructure_id: number;
  infrastructure_name: string;
  infrastructure_category_id: number;
  infrastructure_category: string;
  infrastructure_type_id: number;
  infrastructure_type: string;
  infrastruture_serial: string;
  function_department: string;
  equipment: EquipmentItem[];
  maintenance_details: MaintenanceDetail[];
  status_id: string;
  status_slug: string;
  status: string;
  document: DocumentItem[];
  meta_info?: {
    action_control?: {
      permissions?: Array<{ action: string }>
      menuId?: number
      formName?: string
    }
    task_info?: {
      task_comments?: any[]
      reviewer_list?: any[]
      task_id?: number
    }
  }
}

export interface MaintenanceReportDetailApiResponse {
  data: MaintenanceReportDetailItem[];
}

// Actions Carried Out Types
export interface ActionsCarriedOutData {
  actionCarriedOut: string
  maintenanceDate: Dayjs | null
  byWhom: string
}

export interface ByWhomOption {
  id: string | number
  name: string
}

export interface ActionsCarriedOutModalProps {
  onSave?: (data: ActionsCarriedOutData) => void
  onCancel?: () => void
  initialData?: ActionsCarriedOutData
  byWhomOptions?: ByWhomOption[]
}

// Equipment Data Types
export interface EquipmentDataItem {
  id: number
  sNo: string
  equipmentCategory: string
  equipmentType: string
  equipmentSerialNo: string
  calibrationDetails: string
  calibrationData?: any
  reportEquipmentId?: number
}

// Maintenance Details Data Types
export interface MaintenanceDetailsDataItem {
  id: number
  sNo: string
  maintenanceDescription: string
  toBeDoneBy: string
  frequency: string
  nextScheduleDate: string
  maintenancePlanDetailId?: number
  maintenanceReportDetailId?: number | string
  actionData?: any
}

// Form Data Types
export interface MaintenanceReportFormData {
  infrastructureCategory: string
  infrastructureType: string
  serialNo: string
  infrastructureName: string
  functionDepartment: string
  status: string
}

// Calibration Details Modal Types
export interface CalibrationDetailsModalData {
  status: string
  date: string
  due: string
  certificateUrl?: string
}

export interface CalibrationDetailsModalProps {
  onClose: () => void
  calibrationData?: CalibrationDetailsModalData
}

// Equipment Item API Response Types
export interface EquipmentItemApiResponse {
  equipment_item_id: number
  equipment_item: string
  status: number
}

export interface EquipmentItemsApiResponse {
  data: EquipmentItemApiResponse[]
}

// Equipment Calibration API Response Types
export interface EquipmentCalibrationItem {
  equipment_calibration_id: number
  calibration_status: string
  calibration_date: string
  calibration_due_date: string
  document_id: number
  status: number
}

export interface EquipmentCalibrationApiResponse {
  data: EquipmentCalibrationItem[]
}

