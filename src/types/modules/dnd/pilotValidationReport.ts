import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
/**
    Classification : Confidential
**/
export interface PlaceOfValidation {
  id: number;
  place: string;
}
export interface DirOption {
  id: string;
  name: string;
}
export interface FunctionalBlockOption  {
  id: string;
  name: string;
}
export interface Patient {
  id: number | null;
  patientName: string;
  dateTime: string;
  age: number;
  gender: string;
  parameters_measured: string;
  measured_value: string;
  comments: string;
}
export interface Feedback {
  id: number | null;
  feedback: string;
  functional_block: number;
  dir: number[];
  decision: number;
  measured_value: string;
  comments: string;
}
export interface ValidationReport {
  data: any[];
}
export interface PostValidationReportRequest {
  placeOfValidation: string;
  productSerialNo: string;
  swVersionNo: string;
  correctionsText: string;
  patients: Patient[];
  feedbacks: Feedback[];
  feedbackFiles: File[];
  uploadFiles: File[];
}
export interface PatientForm {
    id: number | null
    patientName: string
    dateTime: string
    age: number
    gender: string
    parameters_measured: string
    measured_value: string
    comments: string
}
export interface PatientModalProps {
    open: boolean
    onClose: () => void
    onSave: () => void
    patientForm: PatientForm
    handlePatientChange: (field: string, value: any) => void
    editPatientId: number | null
    hasEditPermission?: boolean
}
export interface FeedbackForm {
  id: number | null
  intended_use_met: string
  feedback: string
  functional_block: number
  dir: number[]
  decision: number
  measured_value: string
  comments: string
}
export interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  feedbackForm: FeedbackForm
  handleFeedbackChange: (field: string, value: any) => void
  editFeedbackId: number | null
  projectStageOrderId: number
  hasEditPermission?: boolean
}
export interface FileMetadata {
  fileName: string
  source: string
  date_of_upload: string
  categoryId: number
  purpose: string
  file_status: number
  tags: string[]
  file_type: string
}

export interface CustomFile extends File {
  file_id?: number
  temp_id?: string
}

export interface ValidationFormData {
  placeOfValidation: string
  productSerialNo: string
  swVersionNo: string
  correctionsText: string
  conclusion: string
  feedbackDocuments: (File | FileData2)[]
  supportingDocuments: (File | FileData2)[]
  patient_details: any[]
  feedback_details: any[]
}

export interface DirApiResponse {
  id: number;
  dir_id: string;
  dir_name: string;
}

export interface ApiFeedbackDetail {
  id: number;
  feedback_details: string;
  functional_block_id: number;
  dir: DirApiResponse[];
  decision_id: number;
  value: string;
  comments: string;
}

// Type for tooltip content
export type TooltipContent = string | number | null | undefined