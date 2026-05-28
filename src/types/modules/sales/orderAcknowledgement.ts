/**
 * Classification : Confidential
 **/

import { MetaInfo } from './common'

export interface OrderApprovalMode {
  approval_mode_id: number;
  approval_mode_name: string;
}

export interface OrderAcknowledgementRequest {
  quotation_id: number;
  order_acknowledgement_id?: number;
  order_number: string;
  approval_mode_id: number;
  order_date?: string;
  expected_delivery_date: string;
}

export interface OrderAcknowledgementFileTag {
  file_tag_id?: number;
  tag_id?: number;
  tag_name?: string;
}

export interface OrderAcknowledgementSupportingFileDocument {
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
  file_tags: OrderAcknowledgementFileTag[];
}

export interface QuotationSupportingFileDocument {
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
  file_tags: OrderAcknowledgementFileTag[];
}

export interface OrderAcknowledgement {
  order_acknowledgement_id: number;
  quotation_id: number;
  quotation_number: string;
  quotation_date: string;
  customer_name: string;
  order_number: string;
  approval_mode_id?: number;
  order_approval_mode?: string;
  approval_mode_id: number; // Add this to match API response
  approval_mode_name: string; // Add this to match API response
  order_date: string | null;
  expected_delivery_date: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
  quotation_supporting_file_documents?: QuotationSupportingFileDocument[];
  order_acknowledgement_supporting_file_documents?: OrderAcknowledgementSupportingFileDocument[];
}

export interface OrderAcknowledgementResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: OrderAcknowledgement[];
  meta_info?: MetaInfo;
}

export interface OrderAcknowledgementListResponse {
  data: OrderAcknowledgement[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderApprovalModeResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: OrderApprovalMode[];
}

export interface OrderAcknowledgementFormData {
  quotation_id: number | null;
  order_acknowledgement_id: number;
  customer_name: string;
  order_number: string;
  approval_mode_id: number | null;
  order_date: string;
  expected_delivery_date: string;
  status_id?: number | null;
}

export interface OrderAcknowledgementTableRow {
  id: number;
  sno: number;
  quotation_no: string;
  quotation_date: string;
  customer_name: string;
  actions?: React.ReactNode;
}

export interface DocumentData {
  id: string;
  serial_no: string;
  file_name: string;
  source: string;
  date_of_upload: string;
  file_category: string;
  file_status: string;
}

export interface OrderAcknowledgementFilters {
  status?: number;
  quotation_id?: number;
  approval_mode_id?: number;
  customer_name?: string;
  order_number?: string;
  date_from?: string;
  date_to?: string;
}

export interface QuotationDropdownOption {
  quotation_id: number;
  quotation_number: string;
  customer_name: string;
  customer_id: number;
}