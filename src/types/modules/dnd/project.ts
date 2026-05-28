import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { JSX } from 'react'

/**
 Classification : Confidential
**/
export type ColumnDefinition = GridColDef & {
  renderCell?: (params: GridRenderCellParams) => JSX.Element
}
type NullableId = string | number | null

export interface ProjectFormData {
  tid?: number
  eid?: number
  org_id?: number
  project_id?: number
  organization_project_id?: number
  status: number
  project_reason: string
  is_hld_required: number | string
  is_pnd_required: number | string
  product_category_id: string | number
  product_type_id: NullableId
  product_sub_type_id: NullableId
  product_sub_type: string
  product_name: string
  product_generic_name: string
  product_group_id: string | number
  is_feasibility_study_required: number | string
  product_description: string
  market: string[] | number[]
  regulations: string[] | number[]
  documents: File[]
  steps: Array<{ id: number; title: string; subtitle: string }>
}

type RequiredFieldKeys = Exclude<
  keyof ProjectFormData,
  'tid' | 'eid' | 'org_id' | 'project_id' | 'organization_project_id'
>

export const fieldLabels: Record<RequiredFieldKeys, string> = {
  status: 'Status',
  project_reason: 'Project Reason',
  is_hld_required: 'HLD Required',
  is_pnd_required: 'PND Required',
  product_category_id: 'Product Category',
  product_type_id: 'Product Type',
  product_sub_type_id: 'Product Sub Type',
  product_sub_type: 'Product Sub Type',
  product_name: 'Product Name',
  product_generic_name: 'Product Generic Name',
  product_group_id: 'Product Group',
  is_feasibility_study_required: 'Feasibility Study Required',
  product_description: 'Product Description',
  market: 'Market',
  regulations: 'Regulations',
  documents: 'Documents',
  steps: 'Project Steps',
}

export interface FormDataForProjectSave {
  product_name: string
  generic_name: string
  product_group: string
  product_category: string
  product_type: string
  product_sub_type: string
  product_reason: string
  is_hld_required: string
  is_pnd_required: string
  is_design_feasibility_study_required: string
  description: string
  market: string
  regulations: string
  steps: string
  documents_to_create?: File[]
  status: string
  organization_project_id?: string
  documents_to_delete?: string
}

export type ProjectListQueryKey = [string, number, number]

export interface DocumentItem {
  name: string
  extension: string
  created_date: string
  description?: string
  document_id?: number
  media_id?: string | number
}

export interface ProjectInfoProps {
  projectFormData: {
    decision : string
    product_name: string
    product_generic_name: string
    product_description: string
    product_group: string
    product_category: string
    product_type: string
    product_subtype: string
    product_type_id: string | number | null
    product_sub_type_id: string | number | null
    project_reason: string
    is_hld_required: string | number
    is_feasibility_study_required: string | number
    is_pnd_required: string | number
    market_name: string[]
    regulation_name: string[]
    documents: DocumentItem[]
    steps: Array<{ id: number; title: string; subtitle: string }>
  }, 
  isDataLoading: boolean
}

export interface ProjectRow {
  project_id: number | string
  product_name: string
  product_category_id: string
  product_type_id: string
  product_subtype_id: string
  project_reason: string
  status: number
}

export interface FileItemProps {
  file: File
  name: string
  extension: string
  created_date: string
  document_id?: string | number
  media_id?: string | number
  description?: string
}

export interface CustomError {
  response?: {
    data?: {
      code?: number
      message?: string
      status?: string
    }
  }
  message?: string
  status?: number
}

export interface InfoFieldProps {
  label: string | null
  value: string | number | boolean | null | JSX.Element
}

export type FormItem = {
  id: string
  name: string
  source: string
  uploadDate?: string
  category?: string
  description?: string
  file: File
  purpose: string
  status: string | number
  tags?: string[]
}

export type NewFormat = {
  [fileName: string]: {
    fileName: string
    source: string
    date_of_upload: string
    categoryId: number
    purpose: string
    file_status: string | number
    tags: string[]
  }
}

export type ExistingFormat = {
  [id: string]: {
    fileName: string
    source: string
    categoryId: number
    purpose: string
    file_status: string | number
  }
}
