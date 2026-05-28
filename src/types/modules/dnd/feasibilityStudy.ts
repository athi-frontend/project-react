import { GridColDef } from '@mui/x-data-grid'

export interface FormDatas {
  scope: string
  designMethodology: string
  projectDuration: string
  technicalFeasibility: string
  trainingRequirement: string
  projectRisk: string
  totalcost: string
  dependencies: string
  impact: string
  regulatoryImplications: string
  otherRequirements: string
  conclusion: string
  roles: string
  currency: string
  documents: string
  uploadedFile: File[]
}
export interface FormData {
  scope: string
  designMethodology: string
  projectDuration: string
  technicalFeasibility: string
  trainingRequirement: string
  projectRisk: string
  totalcost: string
  dependencies: string
  impact: string
  regulatoryImplications: string
  otherRequirements: string
  conclusion: string
  roles: string
  currency: string
  documents: string
  uploadedFile: File[]
}

export interface CostFormData {
  productCost: string
  equipmentCost: string
  developmentalCost: string
  manufacturingCost: string
  otherCost: string
}

export interface FormErrors {
  scope: string
  designMethodology: string
  projectDuration: string
  technicalFeasibility: string
  trainingRequirement: string
  projectRisk: string
  totalcost: string
  dependencies: string
  impact: string
  regulatoryImplications: string
  otherRequirements: string
  conclusion: string
  roles: string
  currency: string
  productCost: string
  equipmentCost: string
  developmentalCost: string
  manufacturingCost: string
  otherCost: string
  [key: string]: string
}

export interface FieldMappingEntry {
  field: keyof FormData
  name: string
  validationName: string
  apiKey: string
}

export type StringFormField = keyof FormData | keyof CostFormData

export type FormFieldConfig =
  | {
      type: 'InputField' | 'Description'
      label: string
      placeholder: string
      field: keyof FormData
      apiKey: string
      numeric?: boolean
      validationLabel: string
    }
  | {
      type: 'MultiSelect'
      label: string
      placeholder: string
      field: keyof FormData
      apiKey: string
      idField: string
      valueField: string
      validationLabel: string
    }
  | {
      type: 'DataGrid'
      label: string
      placeholder: string
      field: keyof FormData
      rows: any[]
      columns: GridColDef[]
      validationLabel: string
    }

export type CostFormFieldConfig = {
  type: 'InputField'
  label: string
  placeholder: string
  field: keyof CostFormData
  apiKey: string
  numeric: boolean
  validationLabel: string
  maxLength?: number
}

export interface DesignTeamRoleData {
  id?: string
  sNo?: number
  role: string
  onEdit?: (row: DesignTeamRoleData) => void
  onDelete?: (id: string) => void
}

export interface ApiData {
  scope: string
  design_methodology: string
  project_duration: string
  technical_feasibility: string
  training_requirements: string
  project_risks: string
  dependencies: string
  project_impact: string
  regulatory_implications: string
  other_requirements: string
  conclusion: string
  currency_id: number
  cost: { cost_heading: string; value: string }[]
  design_team_role: string[]
}

export interface FeasibilityStudyFormData {
  project_id: number
  scope: string
  design_methodology: string
  project_duration: string
  technical_feasibility: string
  training_requirement: string
  project_risk: string
  dependencies: string
  project_impact: string
  regulatory_implications: string
  other_requirements: string
  conclusion: string
  status: number
  currency: string
  cost: {
    cost_id: number
    cost_heading: string
    value: string
  }[]
  roles: string[]
}

export interface CostInputFormProps {
  initialData?: {
    productCost: string
    equipmentCost: string
    developmentalCost: string
    manufacturingCost: string
    otherCost: string
  }
  errors?: {
    productCost: string
    equipmentCost: string
    developmentalCost: string
    manufacturingCost: string
    otherCost: string
  }
  onCostChange?: (costType: string, value: string) => void
  onErrorChange?: (costType: string, error: string) => void
  hasEditable:boolean
}

export interface FileData2 {
  id?: string
  file_id?: number
  document_id?: number
  name: string
  file_name?: string
  file_size?: number
  file_object_key?: string
  file_extension?: string
  created_date?: string
  source?: string
  purpose?: string
  file_category?: string
  tags?: string[]
  file?: File
}

export interface Currency {
  currency_id: number
  currency_name: string
}

export interface CurrencyResponse {
  data: Currency[]
}