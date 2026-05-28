import React from 'react'
import {
  HazardApiResponse,
  SingleHazardApiResponse,
  Hazard,
  Risk,
  RiskControlMeasure,
  RiskApiResponse,
  RCMApiResponse,
  HarmDropdownApiResponse,
  HarmOption,
  HazardFormData,
  RCMFormData,
} from '@/types/modules/risk-management/riskAnalysisControl'
import { StatusKey, CustomAlert } from '@/types/components/ui/alertModal'
import { NUMBERMAP } from '@/constants/common'
import { RCM_APPROVAL_STATUS, RCM_ACTION_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'

/**
 * Classification: Confidential
 */

/**
 * Common function to create base hazard fields
 */
const createBaseHazardFields = (
  hazardId: number,
  eventDescription: string,
  harmDescription: string,
  subcategoryApplicabilityId: number
) => {
  return {
    hazard_id: hazardId,
    event_description: eventDescription ?? '',
    harm_description: harmDescription ?? '',
    subcategory_applicability_id: subcategoryApplicabilityId,
  }
}

/**
 * Transform API response to UI format (for fetch all hazards)
 */
export const transformHazardApiToUI = (
  apiResponse: HazardApiResponse & {
    subcategory_applicability_id?: number
    subcategory_name?: string
  }
): Hazard => {
  const eventDescription = apiResponse.event_description ?? ''
  const subcategoryApplicabilityId =
    apiResponse.subcategory_applicability_id ?? NUMBERMAP.ZERO
  return {
    id: apiResponse.hazard_id.toString(),
    name: eventDescription,
    description: apiResponse.harm_description ?? '',
    ...createBaseHazardFields(
      apiResponse.hazard_id,
      eventDescription,
      apiResponse.harm_description ?? '',
      subcategoryApplicabilityId
    ),
    hazard_code: '',
    risk_subcategory: {
      subcategory_id: NUMBERMAP.ZERO,
      subcategory_name: apiResponse.subcategory_name ?? '',
    },
    risk_category: { category_id: NUMBERMAP.ZERO, category_name: '' }, // Not available in fetch all response
    harms: [],
    risks: transformRisksApiToUI(apiResponse.risks ?? []),
    reference_rcm_id: undefined,
    expanded: false,
  }
}

/**
 * Transform single hazard API response to UI format (for edit)
 */
export const transformSingleHazardApiToUI = (
  apiResponse: SingleHazardApiResponse
): Hazard => {
  const eventDescription = apiResponse.event_description ?? ''
  return {
    id: apiResponse.hazard_id.toString(),
    name: eventDescription,
    description: apiResponse.harm_description ?? '',
    ...createBaseHazardFields(
      apiResponse.hazard_id,
      eventDescription,
      apiResponse.harm_description ?? '',
      apiResponse.subcategory_applicability_id
    ),
    hazard_code: apiResponse.hazard_code ?? '',
    risk_subcategory: apiResponse.risk_subcategory ?? {
      subcategory_id: NUMBERMAP.ZERO,
      subcategory_name: '',
    },
    risk_category: apiResponse.risk_category ?? {
      category_id: NUMBERMAP.ZERO,
      category_name: '',
    },
    harms: apiResponse.harms ?? [],
    reference_rcm_id: apiResponse.rcm_id,
    risks: [], // Single hazard fetch doesn't include risks
    expanded: false,
  }
}

/**
 * Transform risks API response to UI format
 */
const transformRisksApiToUI = (risks: RiskApiResponse[]): Risk[] => {
  return risks.map((risk) => ({
    id: risk.risk_id.toString(),
    title: risk.risk_title ?? '',
    description: '', // Not available in API response
    rcms: transformRCMsApiToUI(risk.risk_control_measures ?? []),
    expanded: false,
    ...risk,
  }))
}

/**
 * Transform RCMs API response to UI format
 */
const transformRCMsApiToUI = (rcms: RCMApiResponse[]): RiskControlMeasure[] => {
  return rcms.map((rcm) => ({
    id: rcm.rcm_id.toString(),
    title: rcm.rcm_title ?? '',
    description: '',
    ...rcm,
  }))
}

/**
 * Transform multiple API responses to UI format
 */
export const transformHazardsApiToUI = (apiResponses: any[]): Hazard[] => {
  if (!Array.isArray(apiResponses)) return []

  const hazards: Hazard[] = []

  for (const item of apiResponses) {
    if (item && Array.isArray(item.hazards)) {
      // Wrapper shape
      const subcategoryName: string | undefined = item.subcategory_name
      const subcategoryApplicabilityId: number | undefined =
        item.subcategory_applicability_id
      for (const hazard of item.hazards) {
        // Pass through subcategory context so downstream UI has question text
        hazards.push(
          transformHazardApiToUI({
            ...hazard,
            subcategory_applicability_id: subcategoryApplicabilityId,
            subcategory_name: subcategoryName,
          })
        )
      }
    } else {
      // Flat hazard shape
      hazards.push(transformHazardApiToUI(item))
    }
  }

  return hazards.sort((a, b) => a.hazard_id - b.hazard_id)
}

// Harm Options Utilities

/**
 * Transform API response to HarmOption format
 */
export const transformHarmApiToOptions = (
  apiData: HarmDropdownApiResponse[]
): HarmOption[] => {
  return apiData.map((harm) => ({
    id: harm.harm_name.toLowerCase(),
    name: harm.harm_name,
    harmId: harm.harm_id,
  }))
}

/**
 * Get harm IDs from selected harm to values
 */
export const getHarmIdsFromSelection = (
  selectedValues: string[],
  harmOptions: HarmOption[]
): number[] => {
  return selectedValues
    .map((value) => harmOptions.find((option) => option.id === value)?.harmId)
    .filter((id): id is number => id !== undefined)
}

/**
 * Get harm to values from harm IDs
 */
export const getHarmToFromIds = (
  harmIds: number[],
  harmOptions: HarmOption[]
): string[] => {
  return harmIds
    .map((id) => harmOptions.find((option) => option.harmId === id)?.id)
    .filter((id): id is string => id !== undefined)
}

// Modal Initial Data Utilities

/**
 * Get initial data for hazard modal
 * @param editingHazard - The hazard being edited (null for new hazard)
 * @param harmOptions - Available harm options for dropdown
 * @returns Form data object for hazard creation/editing
 */
export const getHazardModalInitialData = (
  editingHazard: Hazard | null,
  harmOptions: HarmOption[]
): HazardFormData => {
  if (editingHazard) {
    return {
      referenceRcm: editingHazard.reference_rcm_id
        ? editingHazard.reference_rcm_id.toString()
        : '',
      hazardEvent: editingHazard.event_description ?? '',
      harm: editingHazard.harm_description ?? '',
      harmTo: getHarmToFromIds(
        editingHazard.harms?.map((harm) => harm.harm_id) ?? [],
        harmOptions
      ),
      harmIds: editingHazard.harms?.map((harm) => harm.harm_id) ?? [],
    }
  }
  return {
    referenceRcm: '',
    hazardEvent: '',
    harm: '',
    harmTo: [],
    harmIds: [],
  }
}

/**
 * Get initial data for RCM modal
 * @param editingRCM - The RCM being edited (null for new RCM)
 * @returns Form data object for RCM creation/editing
 */
export const getRCMModalInitialData = (
  editingRCM: RiskControlMeasure | null
): RCMFormData | undefined => {
  if (editingRCM) {
    const referenceRCMSlug =
      editingRCM.reference_rcm_slug ?? ''

    return {
      title: editingRCM.title,
      description: editingRCM.description,
      rcmTypeId: editingRCM.rcm_type_id?.toString() ?? '',
      probability: editingRCM.probability_level_id?.toString() ?? '',
      severity: editingRCM.severity_level_id?.toString() ?? '',
      controlEffectiveness: editingRCM.control_effectiveness ?? '',
      rationale: editingRCM.rationale ?? '',
      rcmInducedHazardIdentified: referenceRCMSlug,
      acceptability: '' as const,
    }
  }
  return undefined
}

// Toggle State Utilities

/**
 * Toggle hazard expansion state
 * @param hazardId - The hazard ID to toggle
 * @param setExpandedHazards - State setter function
 */
export const handleToggleHazard = (
  hazardId: string,
  setExpandedHazards: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  setExpandedHazards((prev) => {
    const newSet = new Set(prev)
    if (newSet.has(hazardId)) {
      newSet.delete(hazardId)
    } else {
      newSet.add(hazardId)
    }
    return newSet
  })
}

/**
 * Toggle risk expansion state
 * @param riskId - The risk ID to toggle
 * @param setExpandedRisks - State setter function
 */
export const handleToggleRisk = (
  riskId: string,
  setExpandedRisks: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  setExpandedRisks((prev) => {
    const newSet = new Set(prev)
    if (newSet.has(riskId)) {
      newSet.delete(riskId)
    } else {
      newSet.add(riskId)
    }
    return newSet
  })
}

// Delete Operation Utilities

/**
 * Check if any RCM in a risk has approved status
 * @param risk - The risk to check
 * @returns true if any RCM is approved, false otherwise
 */
export const hasApprovedRCM = (risk: Risk): boolean => {
  return risk.rcms.some(rcm => rcm?.rcm_status?.approval_status_name === RCM_APPROVAL_STATUS.APPROVED)
}

/**
 * Check if any RCM in a hazard's risks has approved status
 * @param hazard - The hazard to check
 * @returns true if any RCM is approved, false otherwise
 */
export const hasApprovedRCMInHazard = (hazard: Hazard): boolean => {
  return hazard.risks.some(risk => hasApprovedRCM(risk))
}

/**
 * Handle delete hazard operation
 * @param hazardId - The hazard ID to delete
 * @param hazards - Array of hazards to find the hazard
 * @param deleteHazard - Delete hazard mutation function
 * @param showActionAlert - Alert function for user feedback
 * @param COMMON_CONSTANTS - Constants for alert messages
 */
export const handleDeleteHazard = async (
  hazardId: string,
  hazards: Hazard[],
  deleteHazard: (
    hazardId: number,
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => void,
  showActionAlert: (
    status: StatusKey | 'customAlert',
    customAlert?: CustomAlert
  ) => Promise<any>,
  COMMON_CONSTANTS: {
    DELETE_ALERT: string
    SUCCESS_ALERT: string
    FAILED_ALERT: string
  }
) => {
  // Find the hazard to check for approved RCMs
  const hazard = hazards.find((h) => h.hazard_id.toString() === hazardId)

  if (hazard && hasApprovedRCMInHazard(hazard)) {
    await showActionAlert('customAlert', {
      title: RCM_ACTION_CONSTANTS.CANNOT_DELETE_HAZARD_TITLE,
      text: RCM_ACTION_CONSTANTS.HAZARD_DELETE_BLOCKED_MESSAGE,
      icon: 'warning',
      cancelButton: false,
      confirmButton: false
    })
    return
  }

  const result = await showActionAlert(
    COMMON_CONSTANTS.DELETE_ALERT as StatusKey
  )
  if (result.isConfirmed) {
    if (hazard) {
      deleteHazard(hazard.hazard_id, {
        onSuccess: () => {
          showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT as StatusKey)
        },
        onError: () => {
          showActionAlert(COMMON_CONSTANTS.FAILED_ALERT as StatusKey)
        },
      })
    }
  }
}

/**
 * Handle delete risk operation
 * @param riskId - The risk ID to delete
 * @param hazards - Array of hazards to find the risk
 * @param deleteRisk - Delete risk mutation function
 * @param showActionAlert - Alert function for user feedback
 * @param COMMON_CONSTANTS - Constants for alert messages
 */
export const handleDeleteRisk = async (
  riskId: string,
  hazards: Hazard[],
  deleteRisk: (
    riskId: number,
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => void,
  showActionAlert: (
    status: StatusKey | 'customAlert',
    customAlert?: CustomAlert
  ) => Promise<any>,
  COMMON_CONSTANTS: {
    DELETE_ALERT: string
    SUCCESS_ALERT: string
    FAILED_ALERT: string
  }
) => {
  // Find the risk to check for approved RCMs
  const risk = hazards
    .flatMap(h => h.risks ?? [])
    .find(r => r.risk_id.toString() === riskId)

  if (risk && hasApprovedRCM(risk)) {
    await showActionAlert('customAlert', {
      title: RCM_ACTION_CONSTANTS.CANNOT_DELETE_RISK_TITLE,
      text: RCM_ACTION_CONSTANTS.RISK_DELETE_BLOCKED_MESSAGE,
      icon: 'warning',
      cancelButton: false,
      confirmButton: false
    })
    return
  }

  const result = await showActionAlert(
    COMMON_CONSTANTS.DELETE_ALERT as StatusKey
  )
  if (result.isConfirmed) {
    const riskIdNumber = parseInt(riskId)
    if (riskIdNumber) {
      deleteRisk(riskIdNumber, {
        onSuccess: () => {
          showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT as StatusKey)
        },
        onError: () => {
          showActionAlert(COMMON_CONSTANTS.FAILED_ALERT as StatusKey)
        },
      })
    }
  }
}

/**
 * Handle delete RCM operation
 * @param rcmId - The RCM ID to delete
 * @param deleteRCM - Delete RCM mutation function
 * @param showActionAlert - Alert function for user feedback
 * @param COMMON_CONSTANTS - Constants for alert messages
 */
export const handleDeleteRCM = async (
  rcmId: string,
  deleteRCM: (
    rcmId: number,
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => void,
  showActionAlert: (
    status: StatusKey | 'customAlert',
    customAlert?: CustomAlert
  ) => Promise<any>,
  COMMON_CONSTANTS: {
    DELETE_ALERT: string
    SUCCESS_ALERT: string
    FAILED_ALERT: string
  }
) => {
  const result = await showActionAlert(
    COMMON_CONSTANTS.DELETE_ALERT as StatusKey
  )
  if (result.isConfirmed) {
    const rcmIdNumber = parseInt(rcmId)
    if (rcmIdNumber) {
      deleteRCM(rcmIdNumber, {
        onSuccess: () => {
          showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT as StatusKey)
        },
        onError: () => {
          showActionAlert(COMMON_CONSTANTS.FAILED_ALERT as StatusKey)
        },
      })
    }
  }
}

/**
 * Find the risk ID that contains a specific RCM ID
 * @param rcmId - The RCM ID to search for
 * @param hazards - Array of hazards containing risks and RCMs
 * @returns The risk ID as string if found, empty string if not found
 */
export const findRiskIdByRCMId = (
  rcmId: string,
  hazards: Array<{
    risks: Array<{
      risk_id: number
      rcms: Array<{ rcm_id: number }>
    }>
  }>
): string => {
  let foundRiskId = ''

  const findRCMInRisk = (risk: {
    risk_id: number
    rcms: { rcm_id: number }[]
  }) => {
    const rcm = risk.rcms.find((r) => r.rcm_id.toString() === rcmId)
    if (rcm) {
      foundRiskId = risk.risk_id.toString()
    }
  }

  const findRCMInHazard = (hazard: {
    risks: { risk_id: number; rcms: { rcm_id: number }[] }[]
  }) => {
    hazard.risks.forEach(findRCMInRisk)
  }

  hazards.forEach(findRCMInHazard)
  return foundRiskId
}
