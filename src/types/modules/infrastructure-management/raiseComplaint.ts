/**
 * Classification : Confidential
 **/

import { FileDocument, FileData } from '@/types/components/ui/fileUploadV3'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { FinalFileData } from '@/lib/utils/common'
export interface ComplaintAPI {
  complaint_id: number
  complaint_title: string
  acknowledge_date: string
  serial_number: string
  status_id: number
}

export interface ComplaintDetailAPI {
  complaint_id: number
  infrastructure_category_id: number
  infrastructure_type_id: number
  serial_number: string
  complaint_date: string
  complaint_title: string
  complaint_description: string
  status_id: number
  root_cause?: string
  resolution?: string
  acknowledge_date?: string
  infrastructure_id?: number
  documents?: FileDocument[]
}

export interface InfrastructureCategory {
  infrastructure_category_id: number
  infrastructure_category_name: string
  status: number
}

export interface InfrastructureType {
  infrastructure_type_id: number
  infrastructure_type_name: string
  status: number
}

export interface SerialNumber {
  infrastructure_id: number
  serial_number: string
  status_id: number
}

export interface ComplaintFormData {
  infrastructure_category_id: number | null
  infrastructure_type_id: number | null
  infrastructure_id: number | null
  serial_number: string
  complaint_date: string
  complaint_title: string
  complaint_description: string
  status_id: number | null
  root_cause: string
  resolution: string
  acknowledge_date: string
  documents: FileDocument[]
}

export interface ComplaintFormErrors {
  infrastructure_category_id?: string
  infrastructure_type_id?: string
  infrastructure_id?: string
  serial_number?: string
  complaint_date?: string
  complaint_title?: string
  complaint_description?: string
  status_id?: string
  root_cause?: string
  resolution?: string
  acknowledge_date?: string
  documents?: string
}

export interface AddComplaintModalProps {
  formData: ComplaintFormData
  errors: ComplaintFormErrors
  onChange: (field: keyof ComplaintFormData, value: string | number | null) => void
  onFileUpload?: (file: FileData | FileData2) => void
  onFileEdit?: (file: FileData | FileData2) => void
  onFileSubmit?: (data: Partial<FinalFileData>) => void
  documents?: FileDocument[]
  isEditMode?: boolean
}

