export interface FileData {
  id?: number | string
  file_id?:number|string
  name?: string
  source?: string
  status?: string | number
  uploadDate?: string
  category?: string
  purpose?: string
  description?: string
  created_date?: string
  date_of_upload?: string
  tags?: string[]
  file_tags?: string[]
  categoryId?: number | null
  file?: File | null
}

export interface FileMetaData {
  description: string
  source: string
  tags: string[]
  purpose: string
  file_status: string
  category: string
  fileName: string
}

export interface FileTag {
  file_tag_id: number
  tag_id: number
  tag_name: string
}

export interface FileDocument {
  id: number
  file_id: number
  name: string
  document_object_key: string
  size: number
  extension: string
  created_date: string
  categoryId?: number
  description?: string
  file_category: string
  status: number
  source: string
  purpose: string
  tags?: string[]
  file_tags: FileTag[]
  file: File[] | File
}

export interface FileUploadManagerProps {
  onFileUpload?: (file: FileData) => void
  onFileEdit?: (file: FileData) => void
  initialFiles?: FileDocument[] | File[]
  onSubmit: (data: any) => void
  uploadMandError?: string
  subHeader?: string
  hasEditable?:boolean
  allowedFileTypes?: string
  fileTypeErrorMessage?: string
  supportedFormats?: string
  isEditPopupOpen?: boolean,
  size?:number
}

export interface FileFormData {
  fileName: string
  source: string
  purpose: string
  categoryId: number | null
  file_status: string
  description?: string
  date_of_upload?: string
  tags: string[]
}


export interface TagOption {
  key: string
  value: string
}

export interface ApiTag {
  tag_name: string
  tag_id: string
}
