import { useState, useEffect } from 'react'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { NUMBERMAP } from '@/constants/common'
import {
  Hazard,
  Risk,
  RiskControlMeasure,
  HazardFormData,
  UpsertHazardRequest,
  UpsertRCMRequest,
  RiskFormData,
  RCMFormData,
  SubcategoryWithHazardsApiResponse,
  SubcategoryWithHazardsResponse,
  HazardsApiResponse,
} from '@/types/modules/risk-management/riskAnalysisControl'

// Simple validation function for RiskControlMeasure
const createRCMWithValidation = (rcmId: number): RiskControlMeasure => {
  return {
    id: rcmId.toString(),
    rcm_id: rcmId,
    title: '',
    description: '',
  }
}
import {
  useHazardById,
  useUpsertHazard,
  useDeleteHazard,
  useRiskById,
  useUpsertRisk,
  useDeleteRisk,
  useRCMById,
  useUpsertRCM,
  useDeleteRCM,
  useHarms,
} from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import {
  transformSingleHazardApiToUI,
  transformHarmApiToOptions,
  getHazardModalInitialData,
  getRCMModalInitialData,
  handleToggleHazard,
  handleToggleRisk,
  handleDeleteHazard,
  handleDeleteRisk,
  handleDeleteRCM,
  findRiskIdByRCMId,
} from '@/lib/modules/risk-management/hazardTransformer'
import {
  extractIdsFromRCMId,
} from '@/lib/modules/risk-management/riskManagementHelpers'

/**
 * Classification: Confidential
 */

/**
 * Custom hook for managing risk management handlers
 * Extracts common logic between different risk management pages
 * Classification: Confidential
 */
export const useRiskManagementHandlers = (
  subcategoryApplicabilityId: number,
  projectId: number,
  hazards: Hazard[],
  hazardsApiData?: SubcategoryWithHazardsResponse | HazardsApiResponse,
  rcmId?: number | null
) => {
  // Modal states
  const [isAddHazardModalOpen, setIsAddHazardModalOpen] = useState(false)
  const [isAddRiskModalOpen, setIsAddRiskModalOpen] = useState(false)
  const [isAddRCMModalOpen, setIsAddRCMModalOpen] = useState(false)

  // Edit form data states
  const [editingHazard, setEditingHazard] = useState<Hazard | null>(null)
  const [editingRiskFormData, setEditingRiskFormData] =
    useState<RiskFormData | null>(null)
  const [editingRCM, setEditingRCM] = useState<RiskControlMeasure | null>(null)

  // Selected entities for context
  const [selectedHazardId, setSelectedHazardId] = useState<string>('')
  const [selectedRiskId, setSelectedRiskId] = useState<string>('')

  // API hooks for hazard management
  const { data: singleHazardData } = useHazardById(
    editingHazard?.hazard_id ?? NUMBERMAP.ZERO
  )
  const { mutate: updateHazard, isPending: isHazardPending } = useUpsertHazard(
    subcategoryApplicabilityId
  )
  const { mutate: deleteHazard } = useDeleteHazard(subcategoryApplicabilityId)

  // API hooks for risk management
  const { data: singleRiskData, isLoading: singleRiskLoading } = useRiskById(
    editingRiskFormData ? parseInt(selectedRiskId) : NUMBERMAP.ZERO
  )
  const { mutate: updateRisk, isPending: isRiskPending } =
    useUpsertRisk(subcategoryApplicabilityId)
  const { mutate: deleteRisk } = useDeleteRisk(subcategoryApplicabilityId)

  // API hooks for RCM management
  const { data: singleRCMData, refetch: refetchRCM } = useRCMById(
    editingRCM?.rcm_id ?? NUMBERMAP.ZERO
  )
  const { mutate: updateRCM, isPending: isRCMPending } =
    useUpsertRCM(subcategoryApplicabilityId)
  const { mutate: deleteRCM } = useDeleteRCM(subcategoryApplicabilityId)

  // Harm options hook
  const { data: harmsApiData } = useHarms(true)

  // Transform harm API data to options format
  const harmOptions = () => {
    if (harmsApiData?.data) {
      return transformHarmApiToOptions(harmsApiData.data)
    }
    return []
  }

  // Auto-trigger edit mode if RCM ID is present in URL
  useEffect(() => {
    if (rcmId) {
      // Set a placeholder RCM object with the ID to trigger the API call
      setEditingRCM(createRCMWithValidation(rcmId))
    }
  }, [rcmId])


  // Handle single hazard data for editing
  useEffect(() => {
    if (
      singleHazardData?.data &&
      singleHazardData.data.length > NUMBERMAP.ZERO &&
      editingHazard?.hazard_id
    ) {
      const hazardData = singleHazardData.data[NUMBERMAP.ZERO]
      const transformedHazard = transformSingleHazardApiToUI(hazardData)
      setEditingHazard(transformedHazard)
      setIsAddHazardModalOpen(true)
    }
  }, [singleHazardData, editingHazard?.hazard_id])

  // Handle single risk data for editing
  useEffect(() => {
    if (
      singleRiskData?.data &&
      singleRiskData.data.length > NUMBERMAP.ZERO &&
      selectedRiskId
    ) {
      const riskData = singleRiskData.data[NUMBERMAP.ZERO]
      const riskFormData = {
        title: riskData.risk_title ?? '',
        description: riskData.risk_description ?? '',
        probability: riskData.probability_level_id?.toString() ?? '',
        severity: riskData.severity_level_id?.toString() ?? '',
        acceptability:
          riskData.is_acceptable === NUMBERMAP.ONE
            ? ('acceptable' as const)
            : ('not_acceptable' as const),
      }
      setEditingRiskFormData(riskFormData)
      setIsAddRiskModalOpen(true)
    }
  }, [singleRiskData, selectedRiskId])

  // Handle single RCM data for editing
  useEffect(() => {
    if (
      singleRCMData?.data &&
      singleRCMData.data.length > NUMBERMAP.ZERO &&
      editingRCM?.rcm_id
    ) {
      const rcmInfo = singleRCMData.data[NUMBERMAP.ZERO]
      const freshRCM: RiskControlMeasure = {
        ...rcmInfo,
        id: rcmInfo?.rcm_id?.toString(),
        title: rcmInfo?.rcm_title,
        description: rcmInfo?.rcm_description ?? '',
        probability_level_id: rcmInfo?.probability_level,
        severity_level_id: rcmInfo?.severity_level,
      }

      // Find and set the selectedRiskId when opening the RCM modal
      if (!selectedRiskId && hazardsApiData?.data) {
        const subcategoryData =
          hazardsApiData.data as unknown as SubcategoryWithHazardsApiResponse[]
        const extractedIds = extractIdsFromRCMId(
          editingRCM.rcm_id,
          subcategoryData
        )
        if (extractedIds.found && extractedIds.riskId) {
          setSelectedRiskId(extractedIds.riskId.toString())
        }
      }

      setEditingRCM(freshRCM)
      setIsAddRCMModalOpen(true)
    }
  }, [singleRCMData, editingRCM?.rcm_id, hazardsApiData, selectedRiskId])

  // Hazard management handlers
  const handleAddHazard = () => {
    setEditingHazard(null)
    setIsAddHazardModalOpen(true)
  }

  const handleEditHazard = (hazardId: string) => {
    const hazardIdNumber = parseInt(hazardId)
    if (hazardIdNumber) {
      setEditingHazard({ hazard_id: hazardIdNumber } as Hazard)
    }
  }

  const handleUpdateHazard = (updatedData: HazardFormData): void => {
    const referenceRcmId = Number(updatedData.referenceRcm)

    const payload: UpsertHazardRequest = {
      subcategory_applicability_id: subcategoryApplicabilityId,
      event_description: updatedData.hazardEvent,
      harm_description: updatedData.harm,
      harm_id: updatedData.harmIds ?? [],
    }

    payload.reference_rcm_id =
      referenceRcmId > NUMBERMAP.ZERO ? referenceRcmId : null

    if (editingHazard?.hazard_id) {
      payload.hazard_id = editingHazard.hazard_id
    }

    updateHazard(payload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        setEditingHazard(null)
        setIsAddHazardModalOpen(false)
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      },
    })
  }

  const handleAddRisk = (hazardId: string) => {
    setSelectedHazardId(hazardId)
    setEditingRiskFormData(null)
    setIsAddRiskModalOpen(true)
  }

  const handleEditRisk = (riskId: string) => {
    // Find the hazard ID for this risk
    let foundHazardId = ''
    hazards.forEach((hazard: Hazard) => {
      const risk = hazard.risks.find(
        (r: Risk) => r.risk_id.toString() === riskId
      )
      if (risk) {
        foundHazardId = hazard.hazard_id.toString()
      }
    })

    if (foundHazardId) {
      setSelectedHazardId(foundHazardId)
      setSelectedRiskId(riskId)
      setEditingRiskFormData({} as RiskFormData)
    }
  }

  const handleUpdateRisk = (updatedData: RiskFormData): void => {
    // Find the hazard to get the hazard_id
    const hazard = hazards.find(
      (h: Hazard) => h.hazard_id.toString() === selectedHazardId
    )
    if (!hazard) return

    const payload = {
      risk_applicability_id: subcategoryApplicabilityId,
      hazard_id: hazard.hazard_id,
      risk_id: editingRiskFormData ? parseInt(selectedRiskId) : undefined,
      risk_title: updatedData.title,
      risk_description: updatedData.description,
      probability_level_id: parseInt(updatedData.probability),
      severity_level_id: parseInt(updatedData.severity),
      is_acceptable:
        updatedData.acceptability === 'acceptable'
          ? NUMBERMAP.ONE
          : NUMBERMAP.ZERO,
    }

    updateRisk(payload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        setEditingRiskFormData(null)
        setIsAddRiskModalOpen(false)
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      },
    })
  }

  const handleAddRCM = (riskId: string) => {
    setSelectedRiskId(riskId)
    setEditingRCM(null)
    setIsAddRCMModalOpen(true)
  }

  const handleEditRCM = (rcmId: string) => {
    const rcmIdNumber = parseInt(rcmId)
    if (!rcmIdNumber) {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      return
    }

    // Try to find risk ID from raw API data first (more reliable)
    let foundRiskId = ''
    if (hazardsApiData?.data) {
      const subcategoryData =
        hazardsApiData.data as unknown as SubcategoryWithHazardsApiResponse[]
      const extractedIds = extractIdsFromRCMId(rcmIdNumber, subcategoryData)
      if (extractedIds.found && extractedIds.riskId) {
        foundRiskId = extractedIds.riskId.toString()
      }
    }

    // Fallback to transformed hazards if raw data doesn't work
    if (!foundRiskId && hazards.length > NUMBERMAP.ZERO) {
      foundRiskId = findRiskIdByRCMId(rcmId, hazards)
    }

    if (!foundRiskId) {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      return
    }

    setSelectedRiskId(foundRiskId)
    setEditingRCM(createRCMWithValidation(rcmIdNumber))
  }

  const handleUpdateRCM = (updatedData: RCMFormData): void => {
    // Find the risk to get the risk_id
    const risk = hazards
      .flatMap((hazard: Hazard) => hazard.risks)
      .find((r: Risk) => r.risk_id.toString() === selectedRiskId)

    if (!risk) {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      return
    }

    const payload: UpsertRCMRequest = {
      risk_id: risk.risk_id,
      rcm_type_id: parseInt(updatedData.rcmTypeId),
      rcm_title: updatedData.title,
      rcm_description: updatedData.description,
      rationale: updatedData.rationale,
      control_effectiveness: updatedData.controlEffectiveness,
      probability_level_id: updatedData.probability
        ? parseInt(updatedData.probability)
        : null,
      severity_level_id: updatedData.severity
        ? parseInt(updatedData.severity)
        : null,
    }

    if (updatedData.rcmInducedHazardIdentified) {
      payload.reference_rcm_slug = updatedData.rcmInducedHazardIdentified
    }

    // Only include rcm_id when editing an existing RCM
    if (editingRCM?.rcm_id) {
      payload.rcm_id = editingRCM.rcm_id
    }

    updateRCM(payload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        setEditingRCM(null)
        setIsAddRCMModalOpen(false)
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      },
    })
  }

  // Modal close handlers
  const handleCloseHazardModal = () => {
    setIsAddHazardModalOpen(false)
    setEditingHazard(null)
  }

  const handleCloseRiskModal = () => {
    setIsAddRiskModalOpen(false)
    setEditingRiskFormData(null)
  }

  const handleCloseRCMModal = () => {
    setIsAddRCMModalOpen(false)
    setEditingRCM(null)
  }

  // Wrapper functions for delete handlers that include hazards array
  const handleDeleteHazardWrapper = (hazardId: string) => {
    return handleDeleteHazard(
      hazardId,
      hazards,
      deleteHazard,
      showActionAlert,
      COMMON_CONSTANTS
    )
  }

  const handleDeleteRiskWrapper = (riskId: string) => {
    return handleDeleteRisk(
      riskId,
      hazards,
      deleteRisk,
      showActionAlert,
      COMMON_CONSTANTS
    )
  }

  const handleDeleteRCMWrapper = (rcmId: string) => {
    return handleDeleteRCM(rcmId, deleteRCM, showActionAlert, COMMON_CONSTANTS)
  }

  return {
    // Modal states
    isAddHazardModalOpen,
    isAddRiskModalOpen,
    isAddRCMModalOpen,

    // Edit states
    editingHazard,
    editingRiskFormData,
    editingRCM,

    // Selected entities
    selectedHazardId,
    selectedRiskId,

    // Harm options
    harmOptions: harmOptions(),

    // Loading state
    singleRiskLoading,
    isHazardPending,
    isRiskPending,
    isRCMPending,

    // Handlers
    handleAddHazard,
    handleEditHazard,
    handleUpdateHazard,
    handleAddRisk,
    handleEditRisk,
    handleUpdateRisk,
    handleAddRCM,
    handleEditRCM,
    handleUpdateRCM,
    handleCloseHazardModal,
    handleCloseRiskModal,
    handleCloseRCMModal,

    // Utility functions
    handleToggleHazard,
    handleToggleRisk,
    handleDeleteHazard: handleDeleteHazardWrapper,
    handleDeleteRisk: handleDeleteRiskWrapper,
    handleDeleteRCM: handleDeleteRCMWrapper,
    getHazardModalInitialData,
    getRCMModalInitialData,
    extractIdsFromRCMId,

    // RCM data for workflow integration
    singleRCMData,
    refetchRCM,
  }
};
