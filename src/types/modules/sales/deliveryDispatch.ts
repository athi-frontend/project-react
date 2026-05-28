/**
 * Classification : Confidential
 **/

import { MetaInfo } from './common'

export interface ProductDetailRequest {
  product_id: number;
  units: number;
}

export interface CreateMetaData {
  file_name: string;
  file_type: string;
}

export interface UpdateMetaData {
  file_id: number;
  file_name: string;
}

export interface DeliveryDispatchRequest {
  quotation_id: number;
  delivery_dispatch_id?: number;
  invoice_location?: string;
  ship_to_contact_person?: string;
  ship_to_address?: string;
  ship_to_location?: string;
  remarks?: string;
  product_configuration?: string;
  shipping_date?: string;
  product_details?: ProductDetailRequest[];
  documents_to_create?: File[];
  documents_to_delete?: number[];
  create_meta_data?: CreateMetaData[];
  update_meta_data?: UpdateMetaData[];
}

export interface SiteRequirement {
  factors: string;
  details: string;
}

export interface ProductDetailResponse {
  product_id: number;
  quotation_product_id?: number;
  number_of_units: number | null;
  status: number | null;
  product_name?: string;
  model_name?: string;
  model_number?: string;
}

export interface DeliveryDispatch {
  delivery_dispatch_id: number | null;
  delivery_instruction_id?: number | null;
  quotation_id: number;
  quotation_number: string;
  quotation_date: string;
  customer_name: string | null;
  order_number: string;
  invoice_location?: string | null;
  ship_to_contact_person?: string | null;
  ship_to_address?: string | null;
  ship_to_location?: string | null;
  remarks_special_instruction?: string;
  product_configuration?: string | null;
  expected_shipping_date?: string;
  expected_delivery_date?: string;
  status: number | null;
  status_id?: number | null;
  created_at?: string;
  updated_at?: string;
  address?: string | null;
  invoice_contact_person?: string | null;
  product_details?: ProductDetailResponse[];
  site_requirements?: SiteRequirement[];
  documents?: any[];
}

export interface DeliveryDispatchResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: DeliveryDispatch[];
  meta_info?: MetaInfo;
}

export interface DeliveryDispatchListResponse {
  data: DeliveryDispatch[];
  total: number;
  page: number;
  limit: number;
}

export interface DeliveryDispatchFormData {
  quotation_id: number | null;
  delivery_dispatch_id: number;
  customer_name: string;
  order_number: string;
  invoice_location: string;
  ship_to_contact_person: string;
  ship_to_address: string;
  ship_to_location: string;
  remarks_special_instruction: string;
  product_configuration: string;
  expected_shipping_date: string;
  status_id: number | null;
}

export interface DeliveryDispatchTableRow {
  id: number;
  sno: number;
  order_no: string;
  product_name: string;
  customer_name: string;
  actions?: React.ReactNode;
}

export interface DeliveryDispatchFilters {
  status_id?: number;
  quotation_id?: number;
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

export interface ProductDetailsData {
  id: string;
  product_id: number;
  serialNo: string;
  productName: string;
  model: string;
  numberOfUnits: string;
}

export interface SiteRequirementData {
  id: string;
  serialNo: string;
  factors: string;
  details: string;
}

