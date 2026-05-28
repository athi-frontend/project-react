/**
 * Classification : Confidential
 **/

import { MetaInfo } from './common'

export interface CustomerFeedbackData {
  customer_feedback_id: number;
  product_type: string;
  product_sub_type: string;
  product_name: string;
  customer_name: string;
  status: number;
}

export interface CustomerFeedbackApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: CustomerFeedbackData[];
}

export interface OrderAcknowledgementData {
  order_acknowledgement_id: number;
  quotation_number: string;
  quotation_date: string;
  customer_id: number;
  customer_name: string;
  order_number: string;
}

export interface OrderAcknowledgementApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: OrderAcknowledgementData[];
}

export interface OrderApprovalModeData {
  approval_mode_id: number;
  approval_mode_name: string;
}

export interface OrderApprovalModeApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: OrderApprovalModeData[];
}

export interface CustomerData {
  customer_id: number;
  customer_name: string | null;
}

export interface CustomerApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: CustomerData[];
}

export interface EmployeeData {
  id: number;
  role_name: string;
  department_name: string;
  status: number;
  employee_name: string;
}

export interface EmployeeApiResponse {
  code: number;
  status: string;
  message: string;
  description: string;
  response_timestamp: string;
  data: EmployeeData[];
}

export interface ProductGroupData {
  product_group_id: number;
  product_group: string;
  status: number;
}

export interface ProductGroupApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: ProductGroupData[];
}

export interface ProductCategoryData {
  product_category_id: number;
  product_category: string;
  status: number;
}

export interface ProductCategoryApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: ProductCategoryData[];
}

export interface ProductTypeData {
  product_type_id: number;
  product_type: string;
  status: number;
}

export interface ProductTypeApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: ProductTypeData[];
}

export interface ProductSubTypeData {
  product_sub_type_id: number;
  product_sub_type: string;
  status: number;
}

export interface ProductSubTypeApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: ProductSubTypeData[];
}

export interface ProductData {
  product_id: number;
  product_name: string;
  status: number;
}

export interface ProductApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: ProductData[];
}

export interface CustomerFeedbackCriteriaItem {
  criteria_mapper_id: number;
  criteria_id: number;
  criteria_name: string;
  status_id: number;
  display_order: number;
  is_system_defined: boolean;
}

export interface CustomerFeedbackCriteriaGroup {
  group_id: number;
  group_name: string;
  criteria: CustomerFeedbackCriteriaItem[];
}

export interface CustomerFeedbackCriteriaDetail {
  criteria_mapper_id: number;
  group_id: number;
  group_name: string;
  criteria_id: number;
  criteria_name: string;
  status_id: number;
  display_order: number;
  is_system_defined?: boolean;
}

export interface CustomerFeedbackCriteriaData {
  customer_feedback_criteria_id: number;
  product_id: number;
  product_name: string;
  product_group_id: number;
  product_group: string;
  product_category_id: number;
  product_category: string;
  product_type_id: number;
  product_type: string;
  product_sub_type_id: number;
  product_sub_type: string;
  status: number;
  criteria_details: CustomerFeedbackCriteriaGroup[];
}

export interface CustomerFeedbackCriteriaApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: CustomerFeedbackCriteriaData[];
}

export interface RatingData {
  id: number;
  rating_name: string;
  status: number;
}

export interface RatingApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: RatingData[];
}

export interface CustomerFeedbackDocument {
  file_id: number;
  file_name: string;
  file_description: string | null;
  file_object_key: string;
  purpose: string | null;
  source: string | null;
  file_size: number;
  version: string;
  updated_date: string | null;
  updated_by: string | null;
  status: number;
  uploaded_date: string;
  extension: string;
  file_tags: any[];
}

export interface CustomerFeedbackPersonDetail {
  customer_feedback_person_id: number;
  person_name: string;
  person_role: string;
  status: number;
  documents: CustomerFeedbackDocument[];
}

export interface CustomerFeedbackCriteria {
  customer_feedback_response_id: number;
  feedback_criteria_detail_id: number | null;
  group_name: string | null;
  group_id: number | null;
  criteria: string | null;
  criteria_id: number | null;
  display_order: number | null;
  rating_id: number | null;
  rating_name: string | null;
}

export interface CustomerFeedbackDetailData {
  customer_feedback_id: number;
  product_group_id: number;
  product_group: string;
  product_category_id: number;
  product_category: string;
  product_type_id: number;
  product_type: string;
  product_sub_type_id: number;
  product_sub_type: string;
  product_id: number;
  product_name: string;
  customer_id: number;
  customer_name: string;
  order_id: number;
  product_serial: string;
  date_of_installation: string;
  source: string;
  feedback_date: string;
  captured_by_id: number;
  feedback: string | null;
  status: number;
  persons_detail: CustomerFeedbackPersonDetail[];
  customer_feedback_criteria: CustomerFeedbackCriteria[];
  documents: CustomerFeedbackDocument[];
}

export interface CustomerFeedbackDetailApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: CustomerFeedbackDetailData[];
  meta_info?: MetaInfo;
}

// UI local types moved from page component
export interface FeedbackCriteriaData {
  id: string;
  serialNo: string;
  criteria: string;
  excellent?: string;
  satisfied?: string;
  poor?: string;
  criteria_mapper_id?: number;
}

export interface ProductDetailData {
  id: string;
  serialNo: string;
  name: string;
  role: string;
  document?: any[];
}

export interface CustomerFeedbackFormData {
  documents?: File[] | any[];
  productGroup: string;
  productCategory: string;
  productType: string;
  productSubtype: string;
  productName: string;
  customerName: string;
  orderNo: string;
  productSerialNo: string;
  dateOfInstallation: any;
  source: string;
  feedbackDate: any;
  capturedBy: string;
  feedback: string;
  status_id?: number | null;
}