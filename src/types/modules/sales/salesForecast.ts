/**
    Classification : Confidential
    
    NAMING CONVENTION STRATEGY:
    - API Response Fields: snake_case (e.g., sales_forecast_id, product_id, month_selection)
      These match the backend API response format and database column names.
    
    - Form Fields: camelCase (e.g., productName, monthSelection, unitsRequired)
      These match React/JavaScript conventions for form handling and component props.
    
    - Transformation: Use utility functions to convert between formats when needed.
      Example: convertSnakeToCamel() for API -> Form, convertCamelToSnake() for Form -> API.
    
    - Interface Naming: PascalCase for interfaces (e.g., SalesForecastRequest, ProductWithForecastDetails)
      This follows TypeScript conventions for type definitions.
**/

import { MetaInfo } from './common'

export interface SalesForecastDetail {
  sales_forecast_id: number;
  time_bucket: string;
  units: number;
}

export interface ProductWithForecastDetails {
  product_id: number;
  product_name: string;
  product_category_name: string;
  product_type: string;
  product_sub_type: string;
  model_id?: number;
  model_name?: string;
  sales_forecast_details: SalesForecastDetail[];
}

export interface SalesForecast {
  sales_forecast_id: number;
  product_id: number;
  model_id: number;
  month_selection: string;
  priority_id: number;
  units: number;
  remarks: string;
  status: number;
  documents: SalesForecastDocument[];
}

export interface SalesForecastDocument {
  document_id: number;
  file_name: string;
  file_path: string;
}

export interface DocumentMetadata {
  fileName: string;
  source: string;
  date_of_upload: string;
  categoryId: number;
  purpose: string;
  file_status: number;
  tags: string[];
}

export interface SalesForecastRequest {
  documents_to_delete?: (number | string)[];
  update_meta_data?: Record<string, any>;
  sales_forecast_id?: string;
  product_id: number;
  model_id: number;
  month_selection: string;
  priority_id: number;
  units: number;
  remarks: string;
  status: number;
  documents_to_create?: File[];
  create_meta_data?: string;
}

export interface SalesForecastAllResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp_utc: string;
  data: ProductWithForecastDetails[];
}

export interface SalesForecastByIdResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp_utc: string;
  data: SalesForecast[];
  meta_info?: MetaInfo;
}

export interface SalesForecastUpsertResponse {
  code: number;
  message: string;
  response_timestamp_utc: string;
  data: SalesForecast[];
}

export interface SalesForecastFormData {
  sales_forecast_id?: string;
  product_id: number;
  model_id: number;
  month_selection: string;
  priority_id: number;
  units: number;
  remarks: string;
  documents_to_create?: File[];
  create_meta_data?: string;
}

export interface SalesForecastModalFormData {
  documents_to_delete?: (number | string)[];
  documents_to_create?: File[];
  update_meta_data?: Record<string, any>;
  productName: string;
  product: Product | null;
  modelId: string;
  monthSelection: string;
  priority: string;
  unitsRequired: string;
  remarks: string;
  uploadedFile: any[];
  create_meta_data?: Record<string, any>;
  status: number;
}

export interface Product {
  product_id: number;
  product_name: string;
  product_category_name: string;
  product_type: string;
  product_sub_type: string;
  status: number;
}

export interface ProductModel {
  model_id: number;
  model_name: string;
  status: number;
}

export interface UploadedFile {
  file_id?: number;
  file_name: string;
  file_description?: string;
  file_category?: string;
  file_category_id?: number;
  file_object_key?: string;
  purpose?: string;
  source?: string;
  file_size?: number;
  version?: number;
  status?: number;
  uploaded_date?: string;
  extension?: string;
  file_tags?: string[];
}

export interface SalesForecastTableRow {
  id: number;
  sno: number;
  productName: string;
  productCategoryName: string;
  productType: string;
  productSubType: string;
  modelId?: number;
  modelName?: string;
  salesForecastDetails: SalesForecastDetail[];
  actions?: {
    edit?: () => void;
    delete?: () => void;
    view?: () => void;
  };
}

export interface SalesForecastFilterParams {
  type?: string;
  start_date?: string | null;
  end_date?: string | null;
}

// Priority related interfaces
export interface Priority {
  priority_id: number;
  priority_name: string;
  priority_description?: string;
  status: number;
}

export interface PriorityAllResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp_utc: string;
  data: Priority[];
}

export interface PriorityFilterParams {
  status?: number;
}

export interface ProductModelResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp_utc: string;
  data: ProductModel[];
}

export interface SalesForecastModalProps {
  onClose?: () => void
  onSave?: (data: SalesForecastModalFormData) => void
  mode?: 'add' | 'edit'
  forecastId?: string
  initialData?: SalesForecastModalFormData
  isSubmitting?: boolean
  workflowPermissions?: { action: string; trigger_status_id?: number }[]
  workflowTaskInfo?: { task_comments: any[]; reviewer_list: any[]; task_id?: number }
  workflowMenuId?: number
  workflowMenuName?: string
  workflowRefetch?: () => void
}