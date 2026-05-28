/**
 * Mitigation Matrix Types
 * Classification: Confidential
 */

// Import types from risk analysis control for ModalManagerProps
import {
  HazardFormData,
  RiskFormData,
  RCMFormData,
  Hazard,
  RiskControlMeasure,
  UpsertHazardRequest,
  SingleHazardApiResponse,
} from './riskAnalysisControl'
import {
  BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS,
  AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS,
  MITIGATION_MATRIX_CONSTANTS,
} from '@/constants/modules/risk-management/mitigationMatrix'

// Matrix type constants
export const MATRIX_TYPES = {
  BEFORE: BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE,
  AFTER: AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE,
} as const

export type MatrixType = typeof MATRIX_TYPES.BEFORE | typeof MATRIX_TYPES.AFTER

// Acceptability type constants
export type AcceptabilityType =
  | typeof MITIGATION_MATRIX_CONSTANTS.ACCEPTABILITY.ACCEPTABLE
  | typeof MITIGATION_MATRIX_CONSTANTS.ACCEPTABILITY.NOT_ACCEPTABLE

export interface MatrixCell {
  row: number
  column: number
  is_acceptable: number
  count: number | null
  probability_level: {
    probability_level_id: number
    template_id: number
    level_name: string
  }
  severity_level: {
    severity_level_id: number
    template_id: number
    level_name: string
  }
}

export interface RiskMatrixRow {
  id: number
  probabilitySeverity: string
  cells: { [key: string]: MatrixCell }
}

export interface RiskDetailRow {
  before_mitigation_matrix_id: number
  probability_level_id: number
  severity_level_id: number
  risk_id: number
  risk_code: string
  risk_description: string
  hazard_code: string
  hazard_id: number
  subcategory_applicability_id: number
}

export interface ClickableCellRendererProps {
  field: string
  value: string
  onHazardLinkClick: (
    hazardId?: number,
    subcategoryApplicabilityId?: number
  ) => void
  onRiskLinkClick: (
    hazardId?: number,
    riskId?: number,
    subcategoryApplicabilityId?: number
  ) => void
  rowData: {
    subcategory_name: string
    hazard_id?: number
    risk_id?: number
    subcategory_applicability_id?: number
  }
}

export interface SelectedCellData {
  probabilityLevelId: number
  severityLevelId: number
}

export interface CommonMitigationMatrixProps {
  title: string
  matrixType?: MatrixType
}

export interface MatrixDataProcessorProps {
  apiResponse: MatrixCell[] | undefined
  isMatrixLoading: boolean
}

export interface MatrixTableProps {
  matrixData: RiskMatrixRow[]
  severityColumns: SeverityLevel[]
  isMatrixLoading: boolean
  onCountClick: (rowId: string, field: string, count: number) => void
}

export interface RiskDetailsModalProps {
  open: boolean
  onClose: () => void
  selectedRiskDetails: RiskDetailRow[]
  isRiskDetailsLoading: boolean
  onHazardLinkClick: (
    hazardId?: number,
    subcategoryApplicabilityId?: number
  ) => void
  onRiskLinkClick: (
    hazardId?: number,
    riskId?: number,
    subcategoryApplicabilityId?: number
  ) => void
}

export interface SeverityLevel {
  id: number
  name: string
  column: number
  template_id?: number
}

export interface ProbabilityLevel {
  template_id: number
  level_name: string
}


// Re-export types from riskAnalysisControl for convenience
export type {
  Hazard,
  RiskControlMeasure,
  Risk,
  Harm,
} from './riskAnalysisControl'

export interface UpsertRiskRequest {
  risk_id?: number
  risk_title: string
  risk_description: string
  probability_level_id: number
  severity_level_id: number
  is_acceptable: number
  hazard_id: number
  risk_applicability_id: number
}

export interface HarmOption {
  id: string
  name: string
  harmId: number
  severity: string
}

export interface ModalManagerProps {
  // Hazard modal props
  addHazardModalOpen: boolean
  onCloseHazardModal: () => void
  onSaveHazard: (formData: HazardFormData) => void
  editingHazard: Hazard | null
  harmOptions: HarmOption[]

  // Risk modal props
  isAddRiskModalOpen: boolean
  onCloseRiskModal: () => void
  onSaveRisk: (formData: RiskFormData) => void
  selectedHazardId: string
  projectId: number
  editingRiskFormData: RiskFormData | null

  // RCM modal props
  isAddRCMModalOpen: boolean
  onCloseRCMModal: () => void
  onSaveRCM: (formData: RCMFormData) => void
  selectedRiskId: string
  editingRCM: RiskControlMeasure | null
}

export interface UpsertRiskRequest {
  risk_id?: number
  risk_title: string
  risk_description: string
  probability_level_id: number
  severity_level_id: number
  is_acceptable: number
  hazard_id: number
  risk_applicability_id: number
}

export interface ModalStateManagerProps {
  selectedSubcategoryApplicabilityId: number | null
  projectId: number
  hazards: Hazard[]
  harmOptions: { value: string; label: string }[]
  singleHazardData: { data: SingleHazardApiResponse[] } | null
  updateHazard: (
    payload: UpsertHazardRequest,
    callbacks: { onSuccess: () => void; onError: () => void }
  ) => void
  updateRisk: (
    payload: UpsertRiskRequest,
    callbacks: { onSuccess: () => void; onError: () => void }
  ) => void
  showActionAlert: (message: string) => void
  COMMON_CONSTANTS: { SUCCESS_ALERT: string; FAILED_ALERT: string }
}
