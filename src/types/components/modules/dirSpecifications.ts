import { DocumentStructure } from '@/types/modules/dnd/hld'
import { FileDocument } from '../ui/fileUploadV3'
import { GridColDef } from '@mui/x-data-grid'

/**
    Classification : Confidential
**/

export interface PerformanceFormData {
  parameter: string
  unit: string
  value: string
  functionalBlock: string
  models: string[] | string
  accuracylevel: string
  uploadedFile: File[] | FileDocument[]
}

export interface ApiResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data?: any
}

export interface Model {
  model_id: number
  model_name: string
  model_number: string
}

export interface FetchModelsResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: Option[]
}

export interface Option {
  [key: string]: string | number
}

export interface FormData {
  functionalBlockMultiselect: number[]
  parameter: string
  unit: string
  value: string
  functionalBlock: string | []
  models: []
  accuracylevel: string
  description: string
  uploadedFile: File[] | FileDocument[]
  performanceSpecification?: string | null
  specification_applicability_id?: number
  applicableStandardsField?: string
  deviceName?: string
  standards?: string
  connectivity?: string
  connectivityMode?: string
  communicationProtocol?: string
}

export interface FormErrors {
  parameter: string
  unit: string
  value: string
  functionalBlock: string
  models: string
  accuracylevel: string
  description: string
  uploadedFile: string
}

export interface FunctionalSpecFormErrors {
  functionalBlock: string
  functionalBlockMultiselect: string,
  models: string
  description: string
  performanceSpecification: string
  type: string
  accessories: string
  lifeTimeOfDevice: string
  adverseEvents: string
  deviceName: string
}

export interface PerformanceSpecificationProps {
  id: string
  ref: React.RefObject<HTMLDivElement>
  open: boolean
  onClose: () => void
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  errors: FunctionalSpecFormErrors
  handleSave: () => void
  handleCancel: () => void
  handleFileUpload: (uploadedFile: File | FileDocument) => void
  handleFileEdit: (uploadedFile: FileDocument) => void
  handleFileSubmit: (data: DocumentStructure) => void
}

export interface SpecificationItem {
  design_input_requirement_id: number
  specification_description: string
  parameter: string
  value: string
  unit: string
  [key: string]: any
}

export interface ApiResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: SpecificationItem[]
}

export interface FormErrors {
  parameter: string
  unit: string
  value: string
  functionalBlock: string
  models: string
  accuracylevel: string
  uploadedFile: string
}

export interface PerformanceSpecificationProps {
  open: boolean
  onClose: () => void
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  errors: FormErrors
  functionalBlockOptions: Option[]
  modelsOptions: Option[]
  handleSave: () => void
  handleCancel: () => void
  isEditMode?: boolean
  isLoading?: boolean
  fetchError?: string | null
}

export interface DeviceLifetimeFormProps {
  specificationApplicabilityId: number;
  specificationName: string;
  projectID?: number
}

export type keyValueType = {
  [key: string]: string | SubType;
}

type SubType = {
  [key: string]: string | number | string[] | number[];
}

// New type definitions for Specification component
export interface ProjectFormData {
  market: (string | number)[]
  regulations: (string | number)[]
}

export interface StepData {
  id: number
  specificationApplicabilityID: number
  title: string
  subtitle: string
}

export interface SpecsDataItem {
  applicable_status: number
  design_specification_type_id: number
  specification_applicability_id: number
  specification_type: string
}

export interface SpecsDataResponse {
  data: SpecsDataItem[]
}

export interface RegulationItem {
  regulation_id: number | string
}

export interface RegulationsListResponse {
  data: RegulationItem[]
}

export interface RegulationMarketDataResponse {
  data: {
    markets: (string | number)[]
    regulations: (string | number)[]
  }
}

export interface MagicSaveResponse {
  response?: {
    code?: string | number
  }
}

export interface StepConfiguration {
  [key: number]: {
    columns: any
    modal: string
    listApi: string
    addApi: string
  }
}

export interface BaseFrame {
    [key: string]: Array<Record<string, string | number | boolean | null>>
  }

export type CustomColDef = GridColDef & {
  tooltip?: boolean;
};