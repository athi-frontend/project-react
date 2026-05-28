/**
 *Classification : Confidential
 **/
export interface ProbabilityLevel {
  probability_level_id?: number
  template_id: number
  level_name: string
}

export interface SeverityLevel {
  severity_level_id?: number
  template_id: number
  level_name: string
}

export interface RiskMatrixCell {
  row: number
  column: number
  reference_value: number
  actual_value: number | null
  probability_level: ProbabilityLevel
  severity_level: SeverityLevel
}

export interface RiskMatrixRow {
  id: number
  probabilityLevel: string
  [key: string]: string | number | boolean // Dynamic severity columns
}

export interface RiskAssessmentMatrixResponse {
  data: RiskMatrixCell[]
}

export interface RiskMatrixMapping {
  probability_template_id: number
  severity_template_id: number
  is_acceptable: number
}

export interface RiskAssessmentMatrixPayload {
  project_id: number
  matrix_mappings: RiskMatrixMapping[]
}
