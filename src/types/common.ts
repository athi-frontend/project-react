/**
 * Classification: Confidential
 */
import { ReactNode } from 'react'
export interface ChildrenProps {
  readonly children: ReactNode
}
export interface ThemeModeType {
  themeModeType: string
}
export interface ThemeTypes {
  '--primary-color'?: string
  '--secondary-color'?: string
  '--font-family'?: string
  '--text-color'?: string
  '--text-dark-color'?: string
  '--background-color'?: string
  '--white-color'?: string
  '--dropdown-hover-color'?: string
  '--primary-hover-color'?: string
  '--grey-color'?: string
  '--btnHover-bg-color'?: string
  '--gridtable-bg-color'?: string
  '--gridtable-text-color'?: string
  '--header-title'?: string
  '--header-stroke'?: string
  '--black-color'?: string
  '--red-color'?: string
  '--menuHover-color'?: string
  '--error-color'?: string
  '--success-color'?: string
  '--error-light-color'?: string
  '--success-light-color'?: string
}

export interface ThemeTypes {
  '--primary-color'?: string
  '--secondary-color'?: string
  '--text-color'?: string
  '--text-dark-color'?: string
  '--background-color'?: string
  '--white-color'?: string
  '--dropdown-hover-color'?: string
  '--primary-hover-color'?: string
  '--grey-color'?: string
  '--btnHover-bg-color'?: string
  '--gridtable-bg-color'?: string
  '--gridtable-text-color'?: string
  '--header-title'?: string
  '--header-stroke'?: string
  '--black-color'?: string
  '--menuHover-color'?: string
  '--font-family'?: string
}

export interface FileUploadProps {
  onChange: (file: File | null) => void
  error?: string
  accept?: string | null,
  supportedFormats?: string | null
}

export interface FieldConfig {
  label: string
  value: string | number | boolean | null
}

export interface DynamicInfoFieldsProps {
  fields: FieldConfig[]
}
export interface ApiError {
  response?: {
    status: number
    data?: any
    message?: string
  }
  message?: string
}

export interface DocumentStructure {
  documents_to_create: string[]
  documents_to_delete: string[]
  create_meta_data: Record<string, string>
  update_meta_data: Record<string, string>
  local_files_to_delete: string[]
}
export interface UploadedFileData {
  id: string
  name: string
  file?: File
  source: string
  uploadDate: string
  category: string
  status: string
  document_id?: number
}

// Common types used across the application

export interface WorkflowActionData {
  // Common fields
  menu_id: string | number
  new_status_id: number
  comment: string
  
  // HR context specific fields
  context_id?: string | number
  context_type?: string
  department?: number[]
  reviewer?: number
  
  // DND context specific fields
  project_id?: number
  commentHistory?: string
  task_id?: number
  
  // Quality Control context specific fields
  unique_id?: string | number
}

export interface RefreshSessionResponse {
  success: boolean
  access_token?: string
  rbac_token?: string
  refresh_token?: string
  error?: string
}

export type InputFieldCommonType = string | number | undefined;
export interface UseWorkflowPermissionsParams {
  isLoading: boolean
  permissions: Array<{ action: string; trigger_status_id?: number }>
  buttonDetails: any[] | null | undefined
  hasEditPermission: boolean
  onPermissionChange?: (hasEditPermission: boolean) => void
}
