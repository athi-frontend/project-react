/**
 * Classification : Confidential
 * 
 * Consolidated types for Infrastructure Onboarding
 * This file contains all types for:
 * - Grid: Infrastructure Onboarding List Page
 * - Tab 1: Infrastructure Onboarding (Infrastructure Request Form)
 * - Tab 2: Installation Report
 * - Tab 3: Infrastructure Qualification Checklist
 * - Tab 4: Maintenance Plan
 **/

import React from 'react'
import { FileDocument } from "@/types/components/ui/fileUploadV3"

// ============================================================================
// GRID: INFRASTRUCTURE ONBOARDING LIST PAGE TYPES
// ============================================================================

export interface InfrastructureOnboardingAPI {
  infrastructure_id: number
  infrastructure_category_id: number
  infrastructure_name: string
  infrastructure_category_name: string
  infrastructure_type_id: number
  infrastructure_type_name: string
  infrastructure_serial_number: string
  status_id: number
  status_slug: string
}

export interface InfrastructureOnboardingByIdAPI {
  infrastructure_id: number
  purchase_order_number_id: number
  purchase_order_number: string
  infrastructure_category_id: number
  infrastructure_category_name: string
  infrastructure_type_id: number
  infrastructure_type: string
  name_of_infrastructure: string
  model_no_id: number
  model_no: string
  serial_number: string
  department_function_id: number
  department_function_name: string
  description_of_product: string
  power_supply_id: number
  power_supply: string
  installation_procedure_available: number
  process_equipment: number
  maintenance_start_date: string
  set_notification_id: number
  set_notification: string
  status_id: number
  upload_image: FileDocument[]
  upload_document: FileDocument[]
}

// ============================================================================
// TAB 1: INFRASTRUCTURE ONBOARDING (INFRASTRUCTURE REQUEST FORM) TYPES
// ============================================================================

// Purchase Order Details Types
export interface InfrastructureDetail {
  infrastructure_detail_id: number
  model_no: string
  infrastructure_category_id?: number
  infrastructure_type_id?: number
}

export interface InfrastructurePurchaseOrderDetails {
  purchase_order_id: number
  purchase_order_number: string
  infrastructure_category_id: number
  infrastructure_category: string
  infrastructure_type_id: number
  infrastructure_type: string
  infrastructure_details: InfrastructureDetail[]
}

export interface InfrastructurePurchaseOrderDetailsResponse {
  data: InfrastructurePurchaseOrderDetails[]
}

// Service Types
export interface PowerSupplyData {
  id: number;
  power_supply_name: string;
  status: number;
}

export interface PowerSupplyResponse {
  data: PowerSupplyData[];
}

export interface InfrastructureFileData {
  file_id: number;
  file_name: string;
  file_description: string | null;
  file_object_key: string;
  purpose: string | null;
  source: string | null;
  file_size: number;
  version: string;
  updated_date: string | null;
  updated_by: number | null;
  status: number;
  uploaded_date: string;
  extension: string;
  file_bucket: string;
  file_tags: Array<{
    tag_id: number;
    tag_name: string;
  }>;
  file_category?: string;
  file_category_id?: number;
}

export interface InfrastructureOnboardingData {
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
  upload_image: InfrastructureFileData[];
  upload_document: InfrastructureFileData[];
}

export interface InfrastructureOnboardingResponse {
  data: InfrastructureOnboardingData[];
}

// Component Types
export interface InfrastructureFormData {
  purchaseOrderNumber: string;
  infrastructureCategory: string;
  infrastructureType: string;
  infrastructureName: string;
  modelNo: string;
  serialNo: string;
  departmentFunction: string;
  productDescription: string;
  powerSupply: string;
  installationProcedure: string;
  processEquipment: string;
  maintenanceStartDate: string;
  setNotifications: string;
  status: string;
  uploadImage: File[] | FileDocument[];
  uploadDocument: File[] | FileDocument[];
}

export interface InfrastructureRequestFormProps {
  infrastructureId?: number | null;
  onSaveSuccess?: (infrastructureId: number, status: number) => void;
}

// ============================================================================
// TAB 2: INSTALLATION REPORT TYPES
// ============================================================================

export interface InstallationReportDocument {
  file_id: number
  file_name: string
  file_description: string | null
  file_category: string
  file_category_id: number
  file_object_key: string
  purpose: string
  source: string
  file_size: number
  version: string
  updated_date: string | null
  updated_by: string | null
  status: number
  uploaded_date: string
  extension: string
  file_tags: Array<{
    tag_id: number
    tag_name: string
  }>
}

export interface InstallationReportResponse {
  infrastructure_id: number
  infrastructure_name: string
  serial_no: string
  supplier: string
  po_number: string
  po_date: string
  invoice_no: string
  invoice_date: string
  model_no: string
  function: string
  date_of_installation: string
  installed_by_id: number
  installed_by: string
  date_of_receipt: string
  location: string
  status_id: number
  status_slug: string
  documents: InstallationReportDocument[]
}

export interface ServiceType {
  id: number
  maintenance_service_type: string
  status: number
}

export interface InstallationReportFormData {
  infrastructure_id: number | null
  date_of_installation: string
  installed_by_id: number | null
  date_of_receipt: string
  location: string
  status: number | null
  documents: File[] | FileDocument[]
}

export interface InstallationReportFormErrors {
  date_of_installation: string
  installed_by_id: string
  date_of_receipt: string
  location: string
  upload: string
  fileUpload:string
}

export interface InstallationReportUpsertPayload {
  formData: FormData
}

export interface InstallationReportFormProps {
  infrastructureId?: number | null;
  status?: number | null;
  onSaveSuccess?: () => void;
}

// ============================================================================
// TAB 3: INFRASTRUCTURE QUALIFICATION CHECKLIST TYPES
// Note: Qualification Checklist types are also exported from services file
// ============================================================================

export interface QualificationData {
  id: number;
  sno: string;
  testPerformed: string;
  acceptanceCriteria: string;
  status: string;
  qualification_checklist_item_id: number;
}

export interface InfrastructureQualificationChecklistProps {
  infrastructureId?: number | null;
}



export interface QualificationChecklistItem {
  qualification_checklist_items_id: number | string ;
  test_performed: string;
  acceptance_criteria: string;
  status_id: number | string;
}

export interface QualificationChecklistData {
  infrastructure_id: number;
  qualification_checklist_id: number;
  infrastructure_name: string;
  status: number;
  qualification_checklist: QualificationChecklistItem[];
}

export interface QualificationChecklistResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: QualificationChecklistData[];
}


export interface UpsertQualificationChecklistPayload {
  infrastructure_id: number;
  qualification_checklist: QualificationChecklistItem[];
  status: number;
}


export interface QualificationFormData {
  testPerformed: string
  acceptanceCriteria: string
  status_id: string | number
}

export type QualificationFormErrors = Partial<Record<keyof QualificationFormData, string>>

export interface AddInfrastructureQualificationChecklistModalProps {
  formData?: QualificationFormData
  errors?: QualificationFormErrors
  onChange?: (field: keyof QualificationFormData, value: string) => void
}


// ============================================================================
// COMMON TYPES (Used across multiple tabs)
// ============================================================================

export interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
}


