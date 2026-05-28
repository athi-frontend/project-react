export interface FileUploadSectionProps {
  label: string
  handleFileUpload: (files: File[] | []) => void
  files: File[] | []
  error?: string
  onDelete: (documentIdToDelete: number[]) => void
}
export interface CustomFile extends File {
  extension: string
  created_date: string
  document_id?: string
  media_id?: string | number
}

export interface UploadedFileItemProps {
  file: CustomFile
  onDelete: () => void
}

export interface UploadedFilesListProps {
  files: File[]
  onDelete: (index: number) => void,
  label?:string
}
