export interface ProjectFormData {
  product_description: string
  concept_status_id: string
  document: FileData[]
}

export interface FormErrors {
  product_description: string
  concept_status_id: string
  document?: string
}

export interface DocumentStructure {
  documents_to_create: File[]
  documents_to_delete: number[]
  local_files_to_delete:number[]
  create_meta_data: Record<string, any>
  update_meta_data: Record<string, any>
}

export interface FileData {
  id: number
  name: string
  description: string | null
  category: string
  categoryId: number
  objectKey: string
  purpose: string
  source: string
  size: number
  version: string
  updatedDate: string | null
  updatedBy: string | null
  status: number
  uploaded_date: string 
  extension: string
  tags: Array<{ id: number; name: string }>
  file?: File
}