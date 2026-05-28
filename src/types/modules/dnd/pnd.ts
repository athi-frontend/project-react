export interface PNDFormData {
  product_generic_name: string
  gmdn_code: string
  emdn_code: string
  abbreviation: string
  intended_use_of_product: string
  development_cost: string
  application_of_product: string
  buyer_id: number[]
  end_user_id: number[]
  competitor_information: string
  product_features: string
  product_category_id: number | null
  service_requirements: string
  packaging_requirements: string
  delivery_requirements: string
  post_delivery_requirements: string
  environmental_requirements: string
  documentation_requirements: string
  target_selling_price: string
  quantity_forecast: string
  target_product_launch_time_line: string
  documents: File[] | Document[]
  models: ModelSpecificationRow[]
  status?: 'draft' | 'submitted' | 'approved' | 'changes_requested'
}

export interface Document {
  id: number
  document_id: number
  file_name: string | null
  file_size: number | null
  file_object_key: string | null
  file_extension: string | null
  created_date: string | null
  source: string | null
  purpose: string | null
  category: string | null
  tags: { tag_id: number; tag_name: string }[]
}

export interface PNDFormErrors {
  product_generic_name?: string
  gmdn_code?: string
  emdn_code?: string
  abbreviation?: string
  intended_use_of_product?: string
  development_cost?: string
  application_of_product?: string
  buyer_id?: string
  end_user_id?: string
  competitor_information?: string
  product_features?: string
  product_category_id?: string
  service_requirements?: string
  packaging_requirements?: string
  delivery_requirements?: string
  post_delivery_requirements?: string
  environmental_requirements?: string
  documentation_requirements?: string
  target_selling_price?: string
  quantity_forecast?: string
  target_product_launch_time_line?: string
  documents?: string
  models?: string
}

export interface SpecificationRow {
  id: number | string
  parameter: string
  specification: string
  project_id?: number
  isNew?: boolean
  isEdited?: boolean
}

export interface ModelSpecificationRow {
  id: number | string
  modelName: string
  modelNumber: string
  description: string
  baseModel: '' | 'yes' | 'no'
  status: string | number
  type?: 'New' | 'Edited' | 'Deleted'
}

export interface APIRawModel {
  model_id: number
  model_name: string
  model_number: string
  model_description: string | null
  basic_model?: string | null
  is_base_version?: string | null
  status?: string | number | null
  status_id?: string | number | null
}

export const pndFieldLabels: Partial<Record<keyof PNDFormData, string>> = {
  product_generic_name: 'Generic Name of Product',
  gmdn_code: 'GMDN Code',
  emdn_code: 'EMDN Code',
  abbreviation: 'Abbreviation',
  intended_use_of_product: 'Intended Use of Product',
  development_cost: 'Development Cost',
  application_of_product: 'Application of Product',
  buyer_id: 'Buyer',
  end_user_id: 'End User',
  competitor_information: 'Competitor Information',
  product_features: 'Product Features',
  product_category_id: 'Product Category',
  service_requirements: 'Service Requirements',
  packaging_requirements: 'Packaging Requirements',
  delivery_requirements: 'Delivery Requirements',
  post_delivery_requirements: 'Post Delivery Requirements',
  environmental_requirements: 'Environmental Requirements',
  documentation_requirements: 'Documentation Requirements',
  target_selling_price: 'Target Selling Price',
  quantity_forecast: 'Quantity Forecast (3 Years)',
  target_product_launch_time_line: 'Target Timeline for Product Launch',
  documents: 'Documents',
}

export type RequiredFieldKeys = keyof typeof pndFieldLabels

export const pndInitialValues: PNDFormData = {
  product_generic_name: '',
  gmdn_code: '',
  emdn_code: '',
  abbreviation: '',
  intended_use_of_product: '',
  development_cost: '',
  application_of_product: '',
  buyer_id: [],
  end_user_id: [],
  competitor_information: '',
  product_features: '',
  product_category_id: null,
  service_requirements: '',
  packaging_requirements: '',
  delivery_requirements: '',
  post_delivery_requirements: '',
  environmental_requirements: '',
  documentation_requirements: '',
  target_selling_price: '',
  quantity_forecast: '',
  target_product_launch_time_line: '',
  documents: [],
  models:[],
  status: 'draft',
}

export interface Specification {
  id: number
  name: string
  value: string
}

export type PNDSpecificationListQueryKey = [string, number]

type CreateSpecificationPayload = {
  specificationFormData: FormData
}

type UpdateSpecificationPayload = {
  id: number
  parameter: string
  specification: string
}

export interface SpecificationTableProps {
  specifications: SpecificationRow[]
  onEdit: (specification: SpecificationRow) => void
  onDelete: (id: number | string) => void
}

export interface ModelSpecificationTableProps {
  modelSpecifications: ModelSpecificationRow[];
  onEdit: (specification: ModelSpecificationRow) => void;
  onDelete: (id: number | string) => void;
}

export interface AddSpecificationModalProps {
  hasEditable:boolean
  open: boolean
  onClose: () => void
  onSave: (specification: SpecificationRow) => void
  specification: SpecificationRow | null
}

export type SpecificationPayload =
  | CreateSpecificationPayload
  | UpdateSpecificationPayload

export interface StatusOption {
  status_id: number
  status_name: string
  [key: string]: any
}

export interface AddModelModalProps {
  onClose: () => void
  onSave: (model: ModelSpecificationRow) => void
  model: ModelSpecificationRow | null  
  hasEditable:boolean
  statusOptions?: StatusOption[]
}

