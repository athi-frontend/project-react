/**
 * Classification: Confidential
 */

export interface PatientPopulationData {
  patient_population_id?: number
  age_range: string
  gender_id?: number
  gender: string
  disease_state: string
  serialNo?: string
  id?: string
}

export interface AnatomicalScopeData {
  anatomical_scope_id?: number
  body_part: string
  type_of_tissue: string
  serialNo?: string
  id?: string
}

export interface UserProfileData {
  user_type_id: number
  user_type_name: string
}

export interface RiskStageData {
  stage_id: number;
  stage_name: string;
  slug: string;
  status: number;
}

export interface GenderData {
  id: number
  gender_name: string
}

export interface UserProfileOptionData {
  id: number
  user_type_name: string
}

export interface ScopeFormData {
  planTitle: string
  medicalDeviceDescription: string
  intendedUse: string
  userProfiles: number[]
  operatingPrincipleDescription: string
  applicableStages: number[]
}

export interface ScopeFormErrors {
  planTitle?: string
  medicalDeviceDescription?: string
  intendedUse?: string
  userProfiles?: string
  operatingPrincipleDescription?: string
  applicableStages?: string
  patientPopulation?: string
  anatomicalScope?: string
}

export interface ScopeApiResponse {
  risk_management_plan_id: number
  project_id: number
  plan_title: string
  medical_device_description: string
  intended_use: string
  operating_principle: string
  patient_population: PatientPopulationData[]
  anatomical_scope: AnatomicalScopeData[]
  user_profiles: UserProfileData[]
  applicable_stages: RiskStageData[]
}

export interface ScopePayload {
  type : string
  risk_management_plan_id?: number
  project_id: number
  plan_title: string
  medical_device_description: string
  intended_use: string
  operating_principle: string
  patient_population: PatientPopulationData[]
  anatomical_scope: AnatomicalScopeData[]
  user_profiles: UserProfileData[]
  applicable_stages: RiskStageData[]
}

// Patient Population Modal Types
export interface PatientPopulationModalData {
  ageRange: string
  gender: string
  diseaseState: string
}

export interface PatientPopulationModalFormErrors {
  ageRange: string
  gender: string
  diseaseState: string
}

export interface AnatomicalScopeModalData {
  bodyPart: string
  typeOfTissue: string
}

export interface PatientPopulationModalProps {
  onSave?: (data: PatientPopulationModalData) => void
  onCancel?: () => void
  onClose?: () => void
  open: boolean
  initialData?: PatientPopulationModalData
  genderData?: GenderData[]
  genderLoading?: boolean
  genderError?: Error | null
  readOnly?: boolean;
}
