/**
 * Classification : Confidential
 **/

export interface CustomerFeedbackCriteria {
  customer_feedback_criteria_id: number;
  product_id: number;
  product_type: string;
  product_sub_type: string;
  product_name: string;
  status: number;
}

export interface CustomerFeedbackCriteriaResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: CustomerFeedbackCriteria[];
}

export interface CriteriaItemDetail {
  criteria_mapper_id?: number | string | null;
  criteria_id?: number | null;
  criteria_name: string;
  status_id: number;
  display_order?: number | null;
  is_new_group?: string | boolean;
  is_new_criteria?: string | boolean;
  is_system_defined?: boolean;
}

export interface CriteriaDetail {
  group_id: number | null;
  group_name: string;
  criteria: CriteriaItemDetail[];
  group_display_order?: number | null;
}

export interface CustomerFeedbackCriteriaFormData {
  customer_feedback_criteria_id?: number;
  product_id: number;
  product_group_id?: number;
  product_group?: string;
  product_category_id?: number;
  product_category?: string;
  product_type_id?: number;
  product_type?: string;
  product_sub_type_id?: number;
  product_sub_type?: string;
  status?: number;
  criteria_details: CriteriaDetail[];
}

export interface CustomerFeedbackCriteriaByIdResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: CustomerFeedbackCriteriaFormData[];
}

export interface CustomerFeedbackCriteriaRequest {
  product_id: number;
  status_id?: number;
  criteria_details: CriteriaDetail[];
}

export interface Group {
  group_id: number;
  group_name: string;
}

export interface Criteria {
  criteria_id: number;
  criteria_name: string;
  group_id: number;
}

export interface SystemDefined {
  group_id?: number;
  group_name?: string;
  criteria_id?: number;
  criteria_name?: string;
  criteria_details?: CriteriaDetail[];
}

export interface GroupsResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: Group[];
}

export interface CriteriaResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: Criteria[];
}

export interface SystemDefinedResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: SystemDefined[];
}

export interface ProductItem {
  product_id: number;
  product_name: string;
  status: number;
}

export interface ProductAllResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: ProductItem[];
}

export interface FormData {
  productGroup: string;
  productCategory: string;
  productType: string;
  productSubtype: string;
  productName: string;
  status: string;
  customer_feedback_criteria_id?: number;
}

