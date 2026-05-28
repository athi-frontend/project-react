/**
 *Classification : Confidential
 **/
export interface CriteriaSection {
  id: string
  title: string
  description: string
  maxAllowed: string
  severityLevel: string
  operator: string
  probabilityLevel: string
  criteriaId?: number
  riskAcceptabilityTypeId: number
}

export interface FormData {
  patientSurvival: CriteriaSection
  qualityOfLife: CriteriaSection
  functionPreservation: CriteriaSection
  functionEnhancement: CriteriaSection
  symptomRelief: CriteriaSection
  lifeSupport: CriteriaSection
  durationOfEffect: CriteriaSection
}

export interface FormErrors {
  [key: string]: string | undefined
}

export interface ApiCriteriaData {
  criteria_id?: number
  risk_acceptability_type_id: number
  acceptance_criteria_description: string
  severity_level_id: number
  probability_level_id: number
  max_allowed : number
  operator_id: number
}

export interface SubmitPayload {
  criteria_data: ApiCriteriaData[]
}

export interface ApiResponse {
  criteria_id: number
  risk_acceptability_type_id: number
  risk_acceptability_type: string
  acceptance_criteria_description: string
  severity_level_id: number
  severity_level_name: string
  max_allowed : number
  probability_level_id: number
  probability_level_name: string
  operator_id: number
  operator_symbol: string
  operator_name: string
}

export interface ProbabilityLevel {
  id: number
  template_id: number
  level_name: string
  level_value: string
  numerator: number
  denominator: number
  description: string
  project_id: number
}

export interface SeverityLevel {
  id: number
  template_id: number
  level_name: string
  level_value: string
  description: string
  project_id: number
}

export interface Operator {
  operator_id: number
  operator_name: string
  operator_description: string
  operator: string
  status: number
}

export interface ResidualRiskCriteriaFormProps {
  projectId: number
}

export interface ResidualRiskCriteriaPageProps {
  params: Promise<{ id: string }>
}

// Form field value type
export type FormFieldValue = number | number[] | string

export interface CriteriaSectionProps {
  section: CriteriaSection
  errors: FormErrors
  sectionKey: keyof FormData
  severityOptions: SeverityLevel[]
  probabilityOptions: ProbabilityLevel[]
  operatorOptions: Operator[]
  disabled?: boolean
  onChange: (
    sectionId: keyof FormData,
    field: keyof CriteriaSection,
    value: FormFieldValue
  ) => void
}

export interface ResidualRiskCriteriaSectionsProps {
  formData: FormData
  errors: FormErrors
  probabilityOptions: ProbabilityLevel[]
  severityOptions: SeverityLevel[]
  operatorOptions: Operator[]
  isReadOnly?: boolean
  onSectionChange: (
    sectionId: keyof FormData,
    field: keyof CriteriaSection,
    value: FormFieldValue
  ) => void
}

// Utility types for better type safety
export type SectionKey = keyof FormData
export type CriteriaField = keyof CriteriaSection
export type ErrorKey = `${string}_${string}`

// useFormState hook types
export interface UseFormStateReturn {
  formData: FormData
  errors: FormErrors
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
  updateField: (
    sectionId: keyof FormData,
    field: keyof CriteriaSection,
    value: FormFieldValue
  ) => void
}

// useResidualRiskCriteriaForm hook types
export interface UseResidualRiskCriteriaFormProps {
  criteriaData:
    | { data?: ApiResponse[] }
    | { data?: { project_id?: number; criteria_data?: ApiResponse[] } }
    | undefined
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

// ============================================================================
// UTILITY FUNCTIONS TYPES
// ============================================================================

// residualRiskCriteriaUtils types
export interface ValidationResult {
  isValid: boolean
  errors: FormErrors
  filteredFormData?: FormData
}
