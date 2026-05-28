/**
 * Risk Analysis Control Types
 * Classification: Confidential
 */

import { ReactNode } from 'react'
import { AcceptabilityType } from './mitigationMatrix'

// API Response Types
export interface CategoryApiResponse {
  category_id: number
  category_applicability_id: number
  project_id: number
  category_name: string
  status: number
  [key: string]: string | number
}

export interface SubcategoryApiResponse {
  sub_category_id: number
  subcategory_applicability_id: number | null
  subcategory: string
  response: string | null
  is_applicable: number
}

export interface CategoryWithSubcategoriesApiResponse {
  category_id: number
  category_applicability_id: number
  category_name: string
  project_id: number
  status: number
  subcategory_and_response: SubcategoryApiResponse[]
}

// Base API Response Wrapper
export interface BaseApiResponse<T> {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: T[]
}

// Base Modal Props
export interface BaseModalProps {
  open: boolean
  onClose: () => void
  isPending?: boolean
}

// Base Hazard/Risk Action Props
export interface BaseHazardRiskActions {
  onAddRisk: (hazardId: string) => void
  onAddRCM: (riskId: string) => void
  onToggleHazard: (hazardId: string) => void
  onToggleRisk: (riskId: string) => void
  onEditHazard: (hazardId: string) => void
  onEditRisk: (riskId: string) => void
  onEditRCM: (rcmId: string) => void
  onDeleteHazard: (hazardId: string) => void
  onDeleteRisk: (riskId: string) => void
  onDeleteRCM: (rcmId: string) => void
}

export interface HazardActionPermissions {
  allowAddHazard?: boolean
  allowEditHazard?: boolean
  allowDeleteHazard?: boolean
  allowAddRisk?: boolean
  allowEditRisk?: boolean
  allowDeleteRisk?: boolean
  allowAddRCM?: boolean
  allowEditRCM?: boolean
  allowDeleteRCM?: boolean
  showRiskSection?: boolean
}

// Base Entity with ID and Name
export interface BaseEntity {
  id: string
  name: string
}

// Base Entity with ID, Name and Description
export interface BaseEntityWithDescription extends BaseEntity {
  description: string
}

// Base API Entity with ID and Name
export interface BaseApiEntity {
  id: number
  name: string
}

// Base API Entity with ID, Name and Description
export interface BaseApiEntityWithDescription extends BaseApiEntity {
  description: string
}

// Base Subcategory Structure
export interface BaseSubcategory {
  subcategory_id: number
  subcategory_name: string
}

// Base Category Structure
export interface BaseCategory {
  category_id: number
  category_name: string
}

// Base Entity with Title and Description
export interface BaseEntityWithTitleDescription {
  title: string
  description: string
}

// API Response Wrapper Types
export interface CategoriesApiResponse {
  data: CategoryApiResponse[]
}

export interface SubcategoriesApiResponse {
  data: CategoryWithSubcategoriesApiResponse[]
}

// Request/Response Types for Upsert
export interface UpsertApplicabilityItem {
  sub_category_id: number
  is_applicable: number
  response: string
}

export interface UpsertCategoryRequest {
  project_id: number
  category_id: number
  category_applicability_id: number
  applicability_list: UpsertApplicabilityItem[]
}

// Form Data Types
export interface RiskCategoryFormData {
  [key: string]: string
}

export interface RiskCategorySaveData {
  applicability_list: {
    sub_category_id: number
    is_applicable: number
    response: string
  }[]
}

// Component Props Types
export interface RiskCategoryFormProps {
  currentQuestionId?: string | null
  currentStep: {
    id: number
    name: string
    subcategory_and_response: SubcategoryApiResponse[]
  }
  formData: RiskCategoryFormData
  onFieldChange: (questionId: string, value: string) => void
  onHazardClick: (questionId: string) => void
  onAddHazard: (questionId?: string) => void
  onSave: (data: RiskCategorySaveData, showAlerts?: boolean) => void
  isSaving?: boolean
  readOnly?: boolean
  hazardLinkText?: string
  showActions?: boolean
  enableAddHazardFromLink?: boolean
  showApplicabilityCheckbox?: boolean
}

export interface QuestionFieldProps {
  question: {
    id: string
    label: string
    required: boolean
    hazardLink: boolean
    riskApplicabilityId?: number | null
  }
  value: string
  isChecked: boolean
  onChange: (value: string, isApplicable: boolean) => void
  onHazardClick: () => void
  onAddHazard: (questionId?: string) => void
  onSave?: (showAlerts?: boolean) => void
  readOnly?: boolean
  hazardLinkText?: string
  enableAddHazardFromLink?: boolean
  showApplicabilityCheckbox?: boolean
}

export interface HazardLinkProps {
  onClick?: () => void
  onAddHazard?: () => void
  disabled?: boolean
  label?: string
  showAddIcon?: boolean
}

// Risk Management Types
export interface UpsertRiskRequest {
  risk_applicability_id: number
  hazard_id: number
  risk_id?: number
  risk_title: string
  risk_description: string
  probability_level_id: number
  severity_level_id: number
  is_acceptable: number
}

export interface RiskApiResponse {
  risk_id: number
  risk_code: string
  risk_title: string
  risk_description: string
  is_acceptable: number
  status: number
  risk_identification_method: {
    risk_identification_method_id: number
    method_name: string
    description: string
  }
  probability_level_id: number
  severity_level_id: number
  risk_control_measures?: RCMApiResponse[]
}

// Dropdown API Types
export interface ProbabilityLevelApiResponse {
  id: number
  level_name: string
  level_value: string
  numerator: number
  denominator: number
  description: string
  project_id: number
  template_id: number
}

export interface SeverityLevelApiResponse {
  id: number
  template_id: number
  project_id: number
  level_name: string
  level_value: string
  description: string
  status_id: number
  status_name: string
}

export interface RiskIdentificationMethodApiResponse {
  risk_identification_id: number
  method_name: string
  description: string
}

// Dropdown API Wrapper Types
export type ProbabilityLevelsApiResponse =
  BaseApiResponse<ProbabilityLevelApiResponse>
export type SeverityLevelsApiResponse =
  BaseApiResponse<SeverityLevelApiResponse>
export interface RiskIdentificationMethodsApiResponse {
  data: RiskIdentificationMethodApiResponse[]
}

// Single Risk API Response Wrapper
export interface SingleRiskApiResponse {
  data: RiskApiResponse[]
}

// RCM Types
export interface RCMApiResponse {
  rcm_id: number
  rcm_title: string
  rcm_code: string
  rcm_description: string
  rationale?: string
  risk_id: number
  rcm_type_id: number | null
  status: number
  probability_level: number | null
  severity_level: number | null
  control_effectiveness: string
  rcm_induced_hazard_identified?: number | null
  reference_rcm_slug?: string | null
  rcm_status?: {
    approval_status_id: number
    approval_status_name: string
  }
}

export interface UpsertRCMRequest {
  risk_id: number
  rcm_id?: number
  rcm_type_id: number
  rcm_title: string
  rcm_description: string
  rationale: string
  control_effectiveness: string
  probability_level_id: number | null
  severity_level_id: number | null
  reference_rcm_slug?: string
}

export interface RCMTypeApiResponse {
  rcm_type_id: number
  type_name: string
  status: number
}

// RCM API Response Wrapper Types
export type RCMApiResponseWrapper = BaseApiResponse<RCMApiResponse>
export type RCMTypesApiResponse = BaseApiResponse<RCMTypeApiResponse>

// RCM API Response with Workflow Data
export interface RCMApiResponseWithWorkflow
  extends BaseApiResponse<RCMApiResponse> {
  meta_info: {
    action_control: {
      formId: number
      menuId: number
      formName: string
      formType: string
      permissions: Array<{ action: string; trigger_status_id?: number }>
    }
    task_info: {
      task_comments: any[]
      reviewer_list: any[]
      task_id: number
    }
  }
}

// Subcategory with Hazards Response Types
export interface SubcategoryWithHazardsApiResponse {
  subcategory_name: string
  subcategory_applicability_id: number
  hazards: HazardApiResponse[]
}

// API Response Wrapper for Subcategory with Hazards
export type SubcategoryWithHazardsResponse =
  BaseApiResponse<SubcategoryWithHazardsApiResponse>

// Risk Acceptability Types
export interface RiskAcceptabilityApiResponse {
  is_acceptable: number | null
}

export type RiskAcceptabilityApiResponseWrapper =
  BaseApiResponse<RiskAcceptabilityApiResponse>

// Risk Management Modal Base Types
export interface RiskManagementModalBaseProps extends BaseModalProps {
  onSave: () => void
  title: string
  modalMaxWidth: string
  projectId: number
  children: ReactNode
  cancelButtonLabel: string
  saveButtonLabel: string
  customButtons?: ReactNode
}

export interface ProbabilitySeverityState {
  probabilityId: number | null
  severityId: number | null
  acceptabilityValue: number | null
}

export interface UseProbabilitySeverityReturn {
  probabilityOptions: BaseEntity[]
  severityOptions: BaseEntity[]
  probabilityLoading: boolean
  severityLoading: boolean
  acceptabilityValue: number | null
  setProbabilityId: (id: number | null) => void
  setSeverityId: (id: number | null) => void
  acceptabilityLoading: boolean
}

// Hazard Management Types
// API Response Types for Fetch All Hazards
export interface HazardApiResponse {
  hazard_id: number
  event_description: string
  harm_description: string
  subcategory_applicability_id: number
  status: number
  risks: RiskApiResponse[]
  subcategory_name?: string
}

// API Response Types for Fetch Single Hazard (Edit)
export interface SingleHazardApiResponse {
  hazard_id: number
  event_description: string
  harm_description: string
  subcategory_applicability_id: number
  hazard_code: string
  risk_subcategory: BaseSubcategory
  risk_category: BaseCategory
  harms: HarmApiResponse[]
  rcm_id?: number
}

export interface HarmApiResponse {
  harm_id: number
  harm_to_value: string
  harm_description: string
}

// Reference RCM dropdown API types
export interface ReferenceRCMApiResponse {
  id: number
  rcmTitle: string
  riskId: number
  hazardId: number
  subCategoryApplicabilityId: number
}

// Harm dropdown API types
export interface HarmDropdownApiResponse {
  harm_id: number
  harm_name: string
  harm_description: string
}

export interface HarmOption {
  id: string
  name: string
  harmId: number // The actual harm ID from the backend
  [key: string]: any // Index signature for compatibility
}

export type HarmDropdownResponse = BaseApiResponse<HarmDropdownApiResponse>
export type ReferenceRCMResponse = BaseApiResponse<ReferenceRCMApiResponse>
export type HazardsApiResponse = BaseApiResponse<HazardApiResponse>
export type SingleHazardApiResponseWrapper =
  BaseApiResponse<SingleHazardApiResponse>

// API Request Types
export interface UpsertHazardRequest {
  subcategory_applicability_id: number
  hazard_id?: number // Optional - if provided, update; if not, create
  event_description: string
  harm_description: string
  harm_id: number[] // Array of harm IDs
  reference_rcm_id?: number | null
}

// Transformed Types (for UI components)
export interface Hazard {
  id: string
  hazard_id: number
  name: string
  description: string
  event_description: string
  harm_description: string
  subcategory_applicability_id: number
  hazard_code: string
  risk_subcategory: BaseSubcategory
  risk_category: BaseCategory
  harms: Harm[]
  risks: Risk[]
  expanded: boolean
  reference_rcm_id?: number
}

export interface Harm {
  harm_id: number
  harm_to_value: string
  harm_description: string
}

export interface Risk extends BaseEntityWithTitleDescription {
  id: string
  risk_id: number
  rcms: RiskControlMeasure[]
  expanded: boolean
}

export interface RiskControlMeasure extends BaseEntityWithTitleDescription {
  id: string
  rcm_id: number
  rcm_type_id?: number | null
  rationale?: string
  control_effectiveness?: string
  rcm_induced_hazard_identified?: number | null
  reference_rcm_slug?: string | null
  probability_level_id?: number | null
  severity_level_id?: number | null
  rcm_status?: {
    approval_status_id: number
    approval_status_name: string
  }
}

// Form data types
export interface HazardFormData {
  referenceRcm: string
  hazardEvent: string
  harm: string
  harmTo: string[]
  harmIds?: number[] // For edit mode
}

// Utility type for transforming API response to UI format
export type HazardTransformer = (apiResponse: HazardApiResponse) => Hazard

// Hook Types
export interface UseHazardListProps {
  hazardsApiData?: HazardsApiResponse | null
  expandedHazards: Set<string>
  expandedRisks: Set<string>
}

export interface UseHazardListReturn {
  hazards: Hazard[]
}

// Hazard List and Risk Management Component Types
export interface RiskFormData extends BaseEntityWithTitleDescription {
  probability: string
  severity: string
  acceptability: AcceptabilityType | ''
}

export interface RCMFormData extends BaseEntityWithTitleDescription {
  rcmTypeId: string
  probability: string
  severity: string
  rationale: string
  controlEffectiveness: string
  rcmInducedHazardIdentified: string
  acceptability: AcceptabilityType | ''
}

// Props for components
export interface HazardListProps extends BaseHazardRiskActions {
  handleHazardback: () => void
  hazards: Hazard[]
  isLoading?: boolean
  selectedQuestion: string
  onAddHazard: () => void
  actionPermissions?: HazardActionPermissions
  isRiskAssessmentMode?: boolean
  isRiskControlMeasureMode?: boolean
}

export interface ExpandableHazardItemProps extends BaseHazardRiskActions {
  hazard: Hazard
  actionPermissions?: HazardActionPermissions
  isRiskAssessmentMode?: boolean
  isRiskControlMeasureMode?: boolean
}

export interface AddRiskModalProps extends BaseModalProps {
  onSave: (data: RiskFormData) => void
  hazardId: string
  projectId: number
  initialData?: Partial<RiskFormData>
}

export interface AddRCMModalProps extends BaseModalProps {
  onSave: (data: RCMFormData) => void
  riskId: string
  projectId: number
  initialData?: Partial<RCMFormData>
  isEditMode?: boolean
  workflowData?: RCMApiResponseWrapper | RCMApiResponseWithWorkflow
  onRefetch?: () => void
  onRefetchHazards?: () => void
}

export interface AddHazardModalProps extends BaseModalProps {
  onSave: (data: HazardFormData) => void
  initialData?: Partial<HazardFormData>
  hazardId?: number // For edit mode
}

// Options for dropdowns
export interface DropdownOption extends BaseEntity {}

export interface HarmToOption extends BaseEntity {
  selected: boolean
}
