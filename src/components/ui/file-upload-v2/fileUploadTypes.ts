export interface TagOption {
  [key: string]: any
}

export interface TagsInputProps {
  label: string
  placeholder: string
  value: string[]
  onChange: (value: string[]) => void
  error?: string
  options: TagOption[]
  keyField?: string
  valueField?: string
}

export interface FileData2 {
  id?: number | string
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
  categoryId?: number
  file?: File | null
  document_id?: number | string
  file_id?: number
}

export interface FileData {
  id: string
  name: string
  source: string
  uploadDate: string
  category: string
  status: string
  purpose?: string
  description?: string
  tags?: string[]
  categoryId?: number
  file: File | null
}

type FileMeta = {
  fileName: string
  source?: string
  date_of_upload: string
  status?: string
  purpose?: string
  tags?: string[]
  categoryId?: number
}

export type MetaDataMap = {
  [key: string]: FileMeta
}

export interface FileUploadManagerProps {
  error: string | null
  initialFiles?: FileData[]
  onFileUpload?: (file: File, fileData: FileData) => void
  onFileEdit?: (fileData: FileData) => void
  onFileCancel?: () => void
  onFileDelete?: (fileId: string) => void
}
