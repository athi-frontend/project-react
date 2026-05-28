/**
 *Classification : Confidential
 **/
import { NUMBERMAP } from '@/constants/common'
import {
  RESIDUAL_RISK_CRITERIA_SECTIONS,
  RESIDUAL_RISK_CRITERIA_SECTION_IDS,
  RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES,
  RESIDUAL_RISK_CRITERIA_REQUIRED_FIELDS,
} from '@/constants/modules/risk-management/residualRiskCriteria'
import {
  FormData,
  FormErrors,
  CriteriaSection,
  ValidationResult,
} from '@/types/modules/risk-management/residualRiskCriteria'

// Mapping of section keys to risk acceptability type IDs
const SECTION_TYPE_ID_MAPPING: Record<keyof typeof RESIDUAL_RISK_CRITERIA_SECTION_IDS, number> = {
  PATIENT_SURVIVAL: 1,
  QUALITY_OF_LIFE: 2,
  FUNCTION_PRESERVATION: 3,
  FUNCTION_ENHANCEMENT: 4,
  SYMPTOM_RELIEF: 5,
  LIFE_SUPPORT: 6,
  DURATION_OF_EFFECT: 7,
}

// Helper function to create section data
export const createSectionData = (
  sectionKey: keyof typeof RESIDUAL_RISK_CRITERIA_SECTION_IDS
): CriteriaSection => ({
  id: RESIDUAL_RISK_CRITERIA_SECTION_IDS[sectionKey],
  title: RESIDUAL_RISK_CRITERIA_SECTIONS[sectionKey],
  description: '',
  severityLevel: '',
  maxAllowed : '',
  operator: '',
  probabilityLevel: '',
  riskAcceptabilityTypeId: SECTION_TYPE_ID_MAPPING[sectionKey],
})

// Initial form data
export const initialFormData: FormData = {
  patientSurvival: createSectionData('PATIENT_SURVIVAL'),
  qualityOfLife: createSectionData('QUALITY_OF_LIFE'),
  functionPreservation: createSectionData('FUNCTION_PRESERVATION'),
  functionEnhancement: createSectionData('FUNCTION_ENHANCEMENT'),
  symptomRelief: createSectionData('SYMPTOM_RELIEF'),
  lifeSupport: createSectionData('LIFE_SUPPORT'),
  durationOfEffect: createSectionData('DURATION_OF_EFFECT'),
}

/**
 * Function Name: getSectionKeyByTypeName
 * Params: typeName
 * Description: Used to get section key from risk acceptability type name (from API)
 * Author: Madhumitha G,
 * Created: 25-09-2025,
 * Modified:
 * Classification : Confidential
 **/
export const getSectionKeyByTypeName = (
  typeName: string
): keyof FormData | null => {
  // Map API type names to section keys using loop
  const sectionKeys = Object.keys(RESIDUAL_RISK_CRITERIA_SECTIONS) as Array<
    keyof typeof RESIDUAL_RISK_CRITERIA_SECTIONS
  >

  for (const sectionKey of sectionKeys) {
    if (RESIDUAL_RISK_CRITERIA_SECTIONS[sectionKey] === typeName) {
      return RESIDUAL_RISK_CRITERIA_SECTION_IDS[sectionKey] as keyof FormData
    }
  }

  return null
}

export const validateForm = (
  formData: FormData,
): ValidationResult => {
  const newErrors: FormErrors = {}
  let isValid = true

  // Field-specific error message mapping
  const fieldErrorMessages: Record<string, string> = {
    description:
      RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES.ACCEPTANCE_CRITERIA_DESCRIPTION_REQUIRED,
    maxAllowed: RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES.MAX_ALLOWED_REQUIRED,
    severityLevel:
      RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES.SEVERITY_LEVEL_REQUIRED,
    operator: RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES.OPERATOR_REQUIRED,
    probabilityLevel:
      RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES.PROBABILITY_LEVEL_REQUIRED,
  }

  const isEmpty = (value: string | number[]): boolean => {
    if (!value) return true
    if (Array.isArray(value))
      return (
        value.length === NUMBERMAP.ZERO ||
        value.every((item) => !item?.toString().trim())
      )
    if (typeof value === 'string') return value.trim() === ''
    return false
  }

  const validateSectionField = (
    sectionKey: string,
    section: CriteriaSection,
    field: string
  ) => {
    const value = section[field as keyof CriteriaSection]
    if (isEmpty(value as string | number[])) {
      newErrors[`${sectionKey}_${field}`] =
        fieldErrorMessages[field] ??
        RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES.REQUIRED_FIELD
      isValid = false
    }
  }

  // Use filtered form data for validation
  Object.entries(formData).forEach(([sectionKey, section]) => {
    RESIDUAL_RISK_CRITERIA_REQUIRED_FIELDS.forEach((field) => {
      validateSectionField(sectionKey, section, field)
    })
  })

  return { isValid, errors: newErrors }
}

/**
 * Function Name: findDuplicateProbabilitySeverityCombination
 * Params: formData
 * Description: Finds duplicate probability & severity combinations across sections
 * Author: Harsithiga B,
 * Created: 08-12-2025,
 * Classification : Confidential
 **/
export const findDuplicateProbabilitySeverityCombination = (formData: FormData) => {
  const combinationMap = new Map<
    string,
    { sectionTitle: string }
  >()

  for (const section of Object.values(formData)) {
    const probabilityLevel = section.probabilityLevel?.toString().trim()
    const severityLevel = section.severityLevel?.toString().trim()

    if (!probabilityLevel || !severityLevel) continue

    const combinationKey = `${probabilityLevel}-${severityLevel}`
    if (combinationMap.has(combinationKey)) {
      const existingSection = combinationMap.get(combinationKey)!
      return {
        duplicateSections: [existingSection.sectionTitle, section.title],
        probabilityLevel,
        severityLevel,
      }
    }

    combinationMap.set(combinationKey, { sectionTitle: section.title })
  }

  return null
}

/**
 * Function Name: transformFormDataToPayload
 * Params: formData
 * Description: Used to transform form data into API payload format for submission
 * Author: Madhumitha G,
 * Created: 25-09-2025,
 * Modified:
 * Classification : Confidential
 **/
export const transformFormDataToPayload = (formData: FormData, projectId: number) => {
  const criteriaData = Object.values(formData).map((section) => ({
    ...(section.criteriaId && { criteria_id: section.criteriaId }),
    risk_acceptability_type_id: section.riskAcceptabilityTypeId,
    acceptance_criteria_description: section.description,
    max_allowed: parseInt(section.maxAllowed),
    severity_level_id: parseInt(section.severityLevel),
    probability_level_id: parseInt(section.probabilityLevel),
    operator_id: parseInt(section.operator),
  }))

  return { project_id: projectId, criteria_data: criteriaData }
}
/**
 * Function Name: transformPayloadToDraftSaveFormat
 * Params: payload, formData
 * Description: Used to transform payload to match API response format for draft saves
 * This ensures draft save payload has all key-value pairs matching the fetch API response
 * Author: Auto-generated
 * Created: 2025-01-01,
 * Classification : Confidential
 **/
export const transformPayloadToDraftSaveFormat = (
  payload: ReturnType<typeof transformFormDataToPayload>,
  formData: FormData
) => {
  const sectionsArray = Object.values(formData)
  const transformedCriteriaData = payload.criteria_data.map((criteria) => {
    // Find the corresponding section by risk_acceptability_type_id
    const matchingSection = sectionsArray.find(
      (section) => section.riskAcceptabilityTypeId === criteria.risk_acceptability_type_id
    )
    
    // Handle null values properly - preserve null instead of NaN or undefined
    const maxAllowed = Number.isNaN(criteria.max_allowed) ? null : criteria.max_allowed
    const severityLevelId = Number.isNaN(criteria.severity_level_id) ? null : criteria.severity_level_id
    const probabilityLevelId = Number.isNaN(criteria.probability_level_id) ? null : criteria.probability_level_id
    const operatorId = Number.isNaN(criteria.operator_id) ? null : criteria.operator_id
    
    return {
      criteria_id: criteria.criteria_id ?? null,
      risk_acceptability_type_id: criteria.risk_acceptability_type_id,
      risk_acceptability_type: matchingSection?.title ?? '',
      acceptance_criteria_description: criteria.acceptance_criteria_description ?? null,
      max_allowed: maxAllowed,
      severity_level_id: severityLevelId,
      probability_level_id: probabilityLevelId,
      operator_id: operatorId,
    }
  })

  return {
    project_id: payload.project_id,
    criteria_data: transformedCriteriaData,
  }
}