/**
 * Classification: Confidential
 * Process Validation Types
 */
import React from 'react'

// Installation Qualification Types
export interface InstallationQualificationDetail {
  installation_qualification_id?: number
  temp_id?: string
  sno: number
  parameter: string
  requirement_specification: string
  measurement: string
  result?: string
  result_id?: number
  result_slug?: string
  status: number | string
  status_id?: number
  iq_group_id?: number
  iq_group_name?: string
  installation_qualification_group?: string
}

export interface InstallationQualificationFormData {
  installationQualificationReportBy: string | number
  installationQualificationReportByName?: string
  installationQualificationDoneInHouse: string | number
  installationQualificationDetails: InstallationQualificationDetail[]
}

export interface InstallationQualificationItem {
  installation_qualification_id?: number
  iq_group_id?: number
  iq_group_name?: string
  parameter: string
  requirement_specification: string
  measurement: string
  result: string
  status_id: number
}

export interface InstallationQualificationUpsertPayload {
  process_checklist_id: number
  reported_by: string
  reported_by_name: string
  iqc_done_in_house: number
  installation_qualification: InstallationQualificationItem[]
}

export interface InstallationQualificationFetchResponse {
  process_checklist_id: number
  reported_by: string
  reported_by_name: string
  iqc_done_in_house: number
  installation_qualification: Array<{
    installation_qualification_id: number
    parameter: string
    requirement_specification: string
    measurement: string
    result_id: number
    result_slug: string
    status_id: number
  }>
}

export interface InstallationQualificationFetchByIdResponse {
  installation_qualification_id: number
  parameter: string
  requirement_specification: string
  measurement: string
  result_id: number
  result_slug: string
  status_id: number
  iq_group_id: number
  installation_qualification_group: string
}

// Operational Qualification Types
export interface OperationalQualificationDetail {
  oqc_detail_id?: number
  sno: number
  critical_parameter: string
  worst_case_setting?: string
  best_case_setting?: string
  result_expected: string
  result_measured_later?: number | string
  status: number | string
  status_id?: number
  oqc_type: 'best' | 'worst'
  case_type_name?: string
}

export interface OperationQualityFormData {
  worstCaseSettings: OperationalQualificationDetail[]
  bestCaseSettings: OperationalQualificationDetail[]
}

export interface OperationalQualificationUpsertPayload {
  oqc_detail_id?: number
  process_checklist_id: number
  oqc_type: 'best' | 'worst'
  critical_parameter: string
  case_setting: string
  result_expected: string
  measured_later: number
  status_id: number
}

export interface OperationalQualificationFetchResponse {
  process_validation_id: number
  process_checklist_id: number
  status: number
  best_case: OperationalQualificationCase[]
  worst_case: OperationalQualificationCase[]
}

export interface OperationalQualificationCase {
  oqc_detail_id: number
  case_type: 'best' | 'worst'
  case_type_name: string
  case_setting: string
  critical_parameter: string
  result_expected: string
  result_measured_later: number | null
  status_id: number
}

// Performance Qualification Types
export interface PerformanceQualificationDetail {
  perf_qualification_id?: number
  temp_id?: string
  sno: number
  critical_parameter: string
  critical_parameters?: string
  optimum_range: string
  value_set: string
  result?: string
  status: number | string
  status_id?: number
  verification_id?: number
  verification_result_id?: number
  min_value?: string
  max_value?: string
}

export interface FinalResultDetail {
  id: number | string
  sno: number
  critical_parameter: string
  critical_parameters?: string
  min: string
  max: string
  final_result_id?: number
  perf_qualification_id?: number
}

export interface PerformanceQualityFormData {
  performanceQualificationDetails: PerformanceQualificationDetail[]
  finalResultDetails: FinalResultDetail[]
}

export interface PerformanceQualificationItem {
  perf_qualification_id?: number
  critical_parameter: string
  optimum_range: string
  value_set: string
  verification_id: number
  status: number
}

export interface FinalResultItem {
  perf_qualification_id: number
  critical_parameter: string
  final_result_id?: number
  min_value: string
  max_value: string
}

export interface PerformanceQualificationUpsertPayload {
  process_checklist_id: number
  performance_qualification: PerformanceQualificationItem[]
  final_result: FinalResultItem[]
}

export interface PerformanceQualificationFetchResponse {
  process_checklist_id: number
  performance_qualification: Array<{
    perf_qualification_id: number
    critical_parameters: string
    optimum_range: string
    value_set: string
    verification_result_id: number
    result: string
    status_id: number
    status: string
  }>
  final_result: Array<{
    perf_qualification_id: number
    final_result_id: number
    critical_parameters: string
    min_value: string
    max_value: string
  }>
}

export interface PerformanceQualificationFetchByIdResponse {
  pqc_detail_id: number
  critical_parameter: string
  optimum_range: string
  value_set: string
  verification_id: number
  result: string
  status: number
}

// IQC Group Types
export interface IqcGroup {
  id: number
  iqc_group_name: string
  iqc_group_type: string
  status: number
}

// Component Props Interfaces
export interface InstallationQualityFormProps {
  processChecklistId: number
  processChecklistDetailId: number
}

export interface FormErrors {
  installationQualificationReportBy?: string
  installationQualificationReportByName?: string
  installationQualificationDoneInHouse?: string
}

export interface ModalFormErrors {
  iqGroupName?: string
  parameter?: string
  requirementSpecification?: string
  measurement?: string
  installationQualificationResult?: string
  status?: string
}

export interface OperationQualityFormProps {
  processChecklistId: number
  formData: OperationQualityFormData
  onFormDataChange: (data: OperationQualityFormData) => void
}

export interface WorstCaseModalErrors {
  criticalParameter?: string
  worstCaseSetting?: string
  resultExpected?: string
  resultMeasuredLater?: string
  status?: string
}

export interface BestCaseModalErrors {
  criticalParameter?: string
  bestCaseSetting?: string
  resultExpected?: string
  resultMeasuredLater?: string
  status?: string
}

export interface PerformanceQualityFormProps {
  processChecklistDetailId: number
  processChecklistId: number
  formData: PerformanceQualityFormData
  onFormDataChange: (data: PerformanceQualityFormData) => void
}

export interface PerformanceModalErrors {
  criticalParameters?: string
  optimumRange?: string
  valueSet?: string
  result?: string
  status?: string
}

// Process Checklist List Types
export interface ProcessChecklistItem {
  id: number
  process_checklist_group_id: number
  process_checklist_group_name: string
  process_checklist_id: number
  process_checklist_name: string
  is_special_process: number | null
  status_id: number
}

export interface ProcessChecklistListResponse {
  project_id: number
  product_traceability_card_id: number
  product_type: string
  product_subtype: string
  product_name: string
  product_code: string | null
  part_details: Array<{
    part_id: number
    part_name: string
    part_number: string
  }>
  quality_check_report_id: number
  process_checklist: ProcessChecklistItem[]
}

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface ResultAndStatusFieldsProps {
  result: string
  status: string
  resultError?: string
  statusError?: string
  statusOptions: any[]
  onResultChange: (value: string | number) => void
  onStatusChange: (value: string) => void
}

