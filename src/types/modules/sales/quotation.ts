/**
 * Classification : Confidential
 **/

export interface ProductDetail {
  product_id: number;
  product_name: string;
  model_id: number;
  model_name: string;
  quantity: string;
  price: string;
  product_status: number;
}

export type InputValue = string | number | null;

export interface ProductDetailForm {
  id?: string;
  product_id: number | null;
  product_name: string;
  model_id: number | null;
  model_name: string;
  quantity: string;
  price: string;
  product_status: number;
  product_name?: string;
  model_name?: string;
}

export interface QuotationRequest {
  quotation_id?: number;
  quotation_number: string;
  customer_type?: string;
  customer_id?: number;
  customer_name?: string;
  address: string;
  feature_and_application: string;
  contact_person_name: string;
  email_id: string;
  product_supply: string;
  product_details: ProductDetail[];
  quotation_date: string;
  status: number;
  terms_and_condition: number;
  documents_to_delete?: string;
  update_meta_data?: string;
}

export interface Quotation {
  quotation_id: number;
  quotation_number: string;
  customer_id: number | null;
  quotation_date: string | null;
  status: number;
  customer_name?: string;
}

export interface QuotationResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: Quotation[];
}

export interface QuotationListResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: Quotation[];
}

export interface QuotationFormData {
  quotation_id: number | null;
  quotation_number: string;
  customer_type: string;
  customer_id: number | null;
  customer_name: string;
  address: string;
  feature_and_application: string;
  contact_person_name: string;
  email_id: string;
  product_supply: string;
  product_details: ProductDetail[];
  quotation_date: string;
  status: number;
  terms_and_condition: number;
  documents_to_delete: string;
  update_meta_data: string;
}

export interface QuotationFormState {
  quotation_id: number | null;
  quotation_number: string;
  customer_type: string;
  customer_id: number | null;
  customer_name: string;
  address: string;
  feature_and_application: string;
  contact_person_name: string;
  email_id: string;
  product_supply: string;
  quotation_date: any;
  status: number | null;
  terms_and_condition: number;
}

export interface QuotationTableRow {
  id: number;
  sno: number;
  quotation_number: string;
  customer_name: string;
  quotation_date: string;
  status: number;
  actions?: React.ReactNode;
}

export interface QuotationFilters {
  status?: number;
  customer_id?: number;
  customer_name?: string;
  quotation_number?: string;
  date_from?: string;
  date_to?: string;
}

export interface QuotationDropdownOption {
  quotation_id: number;
  quotation_number: string;
  customer_name: string;
  customer_id: number;
}

// Files attached to a quotation in supporting_files
export interface SupportingFile {
  file_id?: number | string;
  file_name?: string;
  extension?: string;
  file_category?: string;
  source?: string;
  uploaded_date?: string;
  status?: number | string;
  file_status?: string;
}

// Quotation shape when API includes supporting_files
export interface QuotationWithFiles extends Quotation {
  supporting_files?: SupportingFile[];
}

// Customer interfaces
export interface Customer {
  customer_id: number;
  customer_name: string;
  status?: number;
  address?: string;
  contact_person_name?: string;
  email_id?: string;
}

export interface CustomerResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: Customer[];
}

// Quotation by ID response (single item in data array)
export interface QuotationByIdData {
  quotation_id: number;
  quotation_number: string;
  customer_id: number | null;
  feature_and_application: string;
  product_supply: string;
  quotation_date: string | null;
  status: number;
  terms_and_condition: number;
  products: ProductDetail[];
  customer: Customer | null;
  supporting_files: SupportingFile[];
  customer_name?: string;
  address?: string;
  contact_person_name?: string;
  email_id?: string;
}

export interface QuotationByIdResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: QuotationByIdData[];
}
