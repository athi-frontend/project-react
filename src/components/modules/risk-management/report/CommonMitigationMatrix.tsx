/**
 * Classification: Confidential
 */
'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import AccessDenied from '@/components/shared/AccessDenied'
import MatrixTable from './MatrixTable'
import RiskDetailsModal from './RiskDetailsModal'
import HazardList from '../hazard-list/HazardList'
import { useMatrixDataProcessor } from './MatrixDataProcessor'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { TableContainer } from '@/styles/common'
import {
  RiskDetailRow,
  SelectedCellData,
  CommonMitigationMatrixProps,
  MATRIX_TYPES,
} from '@/types/modules/risk-management/mitigationMatrix'
import {
  RCMFormData,
  UpsertRCMRequest,
  RiskControlMeasure,
  RCMApiResponseWithWorkflow,
} from '@/types/modules/risk-management/riskAnalysisControl'
import {
  MITIGATION_MATRIX_CONSTANTS,
  BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS,
  AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS,
} from '@/constants/modules/risk-management/mitigationMatrix'
import { NUMBERMAP } from '@/constants/common'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  useHazards,
  useUpsertRCM,
  useDeleteRCM,
  useRCMById,
} from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import {
  useMitigationMatrix,
  useRiskDetailsById,
} from '@/hooks/modules/risk-management/useMitigationMatrix'
import { useHazardList } from '@/hooks/modules/risk-management/useHazardList'
import {
  getRCMModalInitialData,
  handleToggleHazard,
  handleToggleRisk,
  handleDeleteRCM,
  findRiskIdByRCMId,
} from '@/lib/modules/risk-management/hazardTransformer'
import AddRCMModal from '../hazard-list/AddRCMModal'

const CommonMitigationMatrix: React.FC<CommonMitigationMatrixProps> = ({
  title,
  matrixType = BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE,
}) => {
  const params = useParams()
  const projectId = parseInt(params.id as string)

  // View state management
  const [showHazardList, setShowHazardList] = useState(false)
  const [selectedRiskDetails, setSelectedRiskDetails] = useState<
    RiskDetailRow[]
  >([])
  const [
    selectedSubcategoryApplicabilityId,
    setSelectedSubcategoryApplicabilityId,
  ] = useState<number | null>(null)
  const [selectedCellData, setSelectedCellData] =
    useState<SelectedCellData | null>(null)

  const [selectedQuestion, setSelectedQuestion] = useState<string>('')

  // Accordion expansion state management
  const [expandedHazards, setExpandedHazards] = useState<Set<string>>(new Set())
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set())

  // Unified matrix data fetching hook
  const {
    data: matrixApiData,
    isLoading: isMatrixLoading,
    error: matrixError,
  } = useMitigationMatrix(
    projectId,
    matrixType === AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE
      ? MATRIX_TYPES.AFTER
      : MATRIX_TYPES.BEFORE
  )

  // Use API data if available
  const apiResponse = matrixApiData?.data

  // Matrix data processing hook
  const { severityColumns, matrixData, findCellData } =
    useMatrixDataProcessor({
      apiResponse,
      isMatrixLoading,
    })

  // Unified risk details fetching hook
  const {
    data: riskDetailsData,
    isLoading: isRiskDetailsLoading,
    refetch: refetchRiskDetails,
  } = useRiskDetailsById(
    projectId,
    selectedCellData?.probabilityLevelId ?? NUMBERMAP.ZERO,
    selectedCellData?.severityLevelId ?? NUMBERMAP.ZERO,
    matrixType === AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE
      ? MATRIX_TYPES.AFTER
      : MATRIX_TYPES.BEFORE
  )

  // Data fetching hooks
  const { data: hazardsApiData, refetch: refetchHazards } = useHazards(
    selectedSubcategoryApplicabilityId ?? NUMBERMAP.ZERO,
    !!selectedSubcategoryApplicabilityId
  )

  // CRUD operation mutation hooks
  const { mutate: updateRCM } = useUpsertRCM(
    selectedSubcategoryApplicabilityId ?? NUMBERMAP.ZERO
  )
  const { mutate: deleteRCM } = useDeleteRCM(
    selectedSubcategoryApplicabilityId ?? NUMBERMAP.ZERO
  )

  // Modal states
  const [isAddRCMModalOpen, setIsAddRCMModalOpen] = useState(false)

  // Edit states
  const [editingRCMId, setEditingRCMId] = useState<number | null>(null)

  // Selected IDs for modals
  const [selectedRiskId, setSelectedRiskId] = useState<string>('')

  // Form data for editing
  const [editingRCM, setEditingRCM] = useState<RiskControlMeasure | null>(null)

  // Individual entity fetching hooks for edit operations
  const { data: singleRCMData, refetch: refetchRCM } = useRCMById(editingRCMId ?? NUMBERMAP.ZERO)


  // Update selected risk details when API data changes
  useEffect(() => {
    if (riskDetailsData?.data) {
      setSelectedRiskDetails(riskDetailsData.data)

      // Set the subcategory applicability ID from the risk details that match the selected cell
      if (riskDetailsData.data.length > NUMBERMAP.ZERO && selectedCellData) {
        // Find the risk detail that matches the selected cell's probability and severity levels
        const matchingRiskDetail = riskDetailsData.data.find(
          (riskDetail: RiskDetailRow) =>
            riskDetail.probability_level_id ===
              selectedCellData.probabilityLevelId &&
            riskDetail.severity_level_id === selectedCellData.severityLevelId
        )

        if (matchingRiskDetail) {
          const subcategoryId = matchingRiskDetail.subcategory_applicability_id
          setSelectedSubcategoryApplicabilityId(subcategoryId)
        } else {
          // Fallback to first risk detail if no exact match found
          const subcategoryId =
            riskDetailsData.data[NUMBERMAP.ZERO].subcategory_applicability_id
          setSelectedSubcategoryApplicabilityId(subcategoryId)
        }
      }
    }
  }, [riskDetailsData, selectedCellData])

  // Transform hazard data for UI display with expansion state
  const { hazards } = useHazardList({
    hazardsApiData,
    expandedHazards,
    expandedRisks,
  })

  // Update selected question from hazard data when risk details are selected
  useEffect(() => {
    if (
      selectedRiskDetails.length > NUMBERMAP.ZERO &&
      hazards.length > NUMBERMAP.ZERO
    ) {
      // Get the subcategory name from the first hazard's risk_subcategory
      const subcategoryName =
        hazards[NUMBERMAP.ZERO]?.risk_subcategory?.subcategory_name
      if (subcategoryName) {
        setSelectedQuestion(subcategoryName)
      }
    }
  }, [selectedRiskDetails, hazards])

  // Ensure selectedQuestion is populated from hazard fetch (subcategory_name) as fallback
  useEffect(() => {
    // Only set from hazards if no risk details are selected and no question is set
    if (
      !selectedQuestion &&
      hazards.length > NUMBERMAP.ZERO &&
      selectedRiskDetails.length === NUMBERMAP.ZERO
    ) {
      const firstHazard = hazards[NUMBERMAP.ZERO]
      const questionFromHazard =
        firstHazard?.risk_subcategory?.subcategory_name ?? ''
      if (questionFromHazard) {
        setSelectedQuestion(questionFromHazard)
      }
    }
  }, [hazards, selectedQuestion, selectedRiskDetails.length])

  // Handle single RCM data for editing
  useEffect(() => {
    if (singleRCMData?.data && singleRCMData.data.length > NUMBERMAP.ZERO) {
      const rcmInfo = singleRCMData.data[NUMBERMAP.ZERO]
      if (rcmInfo.rcm_id) {
        setEditingRCM({
          ...rcmInfo,
          id: rcmInfo.rcm_id.toString(),
          title: rcmInfo.rcm_title ?? '',
          description: rcmInfo.rcm_description ?? '',
          probability_level_id: rcmInfo.probability_level,
          severity_level_id: rcmInfo.severity_level,
        })
        setIsAddRCMModalOpen(true)
      }
    }
  }, [singleRCMData])

  const handleAddRCM = (riskId: string) => {
    setSelectedRiskId(riskId)
    setIsAddRCMModalOpen(true)
  }

  const handleEditRCM = (rcmId: string) => {
    // Find the risk ID for this RCM from existing data
    const foundRiskId = findRiskIdByRCMId(rcmId, hazards)

    if (!foundRiskId) {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      return
    }

    const rcmIdNumber = parseInt(rcmId)
    if (rcmIdNumber) {
      setEditingRCMId(rcmIdNumber)
      setSelectedRiskId(foundRiskId)
    }
  }

  const handleCloseRCMModal = () => {
    setIsAddRCMModalOpen(false)
    setEditingRCM(null)
    setEditingRCMId(null)
  }

  const handleUpdateRCM = (formData: RCMFormData) => {
    // For creating new RCM, we only have selectedRiskId
    // For editing existing RCM, we have editingRCMId
    let riskId: number

    if (editingRCMId) {
      // Editing existing RCM - find the risk that contains this RCM
      const riskWithRCM = hazards
        .flatMap((hazard) => hazard.risks)
        .find((risk) =>
          risk.rcms.some(
            (rcm) =>
              rcm.rcm_id === editingRCMId ||
              rcm.rcm_id.toString() === editingRCMId.toString()
          )
        )

      if (!riskWithRCM) {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
        return
      }

      riskId = riskWithRCM.risk_id
    } else {
      // Creating new RCM - find the risk by selectedRiskId
      const risk = hazards
        .flatMap((hazard) => hazard.risks)
        .find((r) => r.risk_id.toString() === selectedRiskId)

      if (!risk) {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
        return
      }

      riskId = risk.risk_id
    }

    const payload: UpsertRCMRequest = {
      risk_id: riskId,
      rcm_type_id: parseInt(formData.rcmTypeId),
      rcm_title: formData.title,
      rcm_description: formData.description,
      rationale: formData.rationale,
      control_effectiveness: formData.controlEffectiveness,
      probability_level_id: formData.probability
        ? parseInt(formData.probability)
        : null,
      severity_level_id: formData.severity ? parseInt(formData.severity) : null,
    }

    if (formData.rcmInducedHazardIdentified) {
      payload.reference_rcm_slug = formData.rcmInducedHazardIdentified
    }

    if (editingRCM?.rcm_id) {
      payload.rcm_id = editingRCM.rcm_id
    }

    updateRCM(payload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        setEditingRCM(null)
        setEditingRCMId(null)
        setIsAddRCMModalOpen(false)
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      },
    })
  }

  /**
   * Description: Scroll to top when HazardList is shown and provides better UX when switching between matrix and hazard list views
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   */
  useEffect(() => {
    if (showHazardList) {
      window.scrollTo({
        top: NUMBERMAP.ZERO,
        behavior: MITIGATION_MATRIX_CONSTANTS.SMOOTH_SCROLL,
      })
    }
  }, [showHazardList])

  // Refetch risk details when selectedCellData changes
  useEffect(() => {
    if (
      selectedCellData?.probabilityLevelId &&
      selectedCellData?.severityLevelId
    ) {
      refetchRiskDetails()
    }
  }, [selectedCellData, refetchRiskDetails])

  /**
   * Description: Handle count cell click in the risk matrix and opens modal with risk details when count > 0
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @param rowId - The row identifier
   * @param field - The field identifier
   * @param count - The count value in the cell
   */
  const handleCountClick = (rowId: string, field: string, count: number) => {
    if (count > NUMBERMAP.ZERO) {
      // Find the cell data to get probability and severity level IDs
      const severityTemplateId = parseInt(field.replace('col_', ''))

      // Find the cell data from API response
      const cellData = findCellData(parseInt(rowId), severityTemplateId)
      if (
        cellData?.probability_level?.probability_level_id &&
        cellData?.severity_level?.severity_level_id
      ) {
        // Set the selected cell data for the API call
        const newCellData = {
          probabilityLevelId: cellData.probability_level.probability_level_id,
          severityLevelId: cellData.severity_level.severity_level_id,
        }

        setSelectedCellData(newCellData)
        // Modal will be handled by RiskDetailsModal
      }
    }
  }

  /**
   * Description: Handle hazard link click in modal and navigates to hazard list view and optionally expands specific hazard
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @param question - The question text to display
   * @param hazardId - Optional hazard ID to expand
   * @param subcategoryApplicabilityId - Optional subcategory applicability ID from the clicked row
   */
  const handleHazardLinkClick = (
    hazardId?: number,
    subcategoryApplicabilityId?: number
  ) => {
    setShowHazardList(true)
    // Close the risk details modal
    setSelectedCellData(null)
    // Reset all expanded states when opening hazard list
    setExpandedHazards(new Set())
    setExpandedRisks(new Set())

    // If subcategoryApplicabilityId is provided, set it for hazard fetching
    if (subcategoryApplicabilityId) {
      setSelectedSubcategoryApplicabilityId(subcategoryApplicabilityId)
    }

    // If hazardId is provided, expand that specific hazard
    if (hazardId) {
      setExpandedHazards(new Set([hazardId.toString()]))
    }
  }

  /**
   * Description: Handle risk link click in modal and navigates to hazard list view and optionally expands specific hazard and risk
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @param question - The question text to display
   * @param hazardId - Optional hazard ID to expand
   * @param riskId - Optional risk ID to expand
   * @param subcategoryApplicabilityId - Optional subcategory applicability ID from the clicked row
   */
  const handleRiskLinkClick = (
    hazardId?: number,
    riskId?: number,
    subcategoryApplicabilityId?: number
  ) => {
    setShowHazardList(true)
    // Close the risk details modal
    setSelectedCellData(null)
    // Reset all expanded states when opening hazard list
    setExpandedHazards(new Set())
    setExpandedRisks(new Set())

    // If subcategoryApplicabilityId is provided, set it for hazard fetching
    if (subcategoryApplicabilityId) {
      setSelectedSubcategoryApplicabilityId(subcategoryApplicabilityId)
    }

    // If hazardId and riskId are provided, expand both hazard and risk
    if (hazardId && riskId) {
      setExpandedHazards(new Set([hazardId.toString()]))
      setExpandedRisks(new Set([riskId.toString()]))
    } else if (hazardId) {
      // If only hazardId is provided, expand just the hazard
      setExpandedHazards(new Set([hazardId.toString()]))
    }
  }

  /**
   * Description: Handle back navigation from hazard list and returns to matrix view and resets expansion states
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleHazardBack = () => {
    setShowHazardList(false)
    // Reset all expanded states when going back
    setExpandedHazards(new Set())
    setExpandedRisks(new Set())
  }

  // Handle matrix errors and empty responses
  if (matrixError) {
    // Show action alert for API errors and return only title
    return (
      <PageContainer>
        <CommonSharedTale title={title} Table={null} />
      </PageContainer>
    )
  } else if (
    matrixApiData?.data &&
    matrixApiData.data.length === NUMBERMAP.ZERO
  ) {
    // Show AccessDenied for empty response array
    return (
      <PageContainer>
        <AccessDenied
          customMessage={
            MITIGATION_MATRIX_CONSTANTS.ERROR_MESSAGES
              .PROBABILITY_SEVERITY_NOT_FOUND
          }
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {showHazardList ? (
        <TableContainer>
          <HazardList
            handleHazardback={handleHazardBack}
            hazards={hazards}
            selectedQuestion={selectedQuestion}
            onToggleHazard={(hazardId: string) =>
              handleToggleHazard(hazardId, setExpandedHazards)
            }
            onToggleRisk={(riskId: string) =>
              handleToggleRisk(riskId, setExpandedRisks)
            }
            onAddRCM={handleAddRCM}
            actionPermissions={{
              allowAddHazard: false,
              allowEditHazard: false,
              allowDeleteHazard: false,
              allowAddRisk: false,
              allowEditRisk: false,
              allowDeleteRisk: false,
              allowAddRCM: true,
              allowEditRCM: true,
              allowDeleteRCM: true,
              showRiskSection: true,
            }}
            onEditRCM={handleEditRCM}
            onDeleteRCM={(rcmId: string) =>
              handleDeleteRCM(rcmId, deleteRCM, showActionAlert, COMMON_CONSTANTS)
            }
            isRiskControlMeasureMode={true}
          />
        </TableContainer>
      ) : (
        <CommonSharedTale
          title={title}
          Table={
            <MatrixTable
              matrixData={matrixData}
              severityColumns={severityColumns}
              isMatrixLoading={isMatrixLoading}
              onCountClick={handleCountClick}
            />
          }
        />
      )}

      <RiskDetailsModal
        open={selectedCellData !== null}
        onClose={() => setSelectedCellData(null)}
        selectedRiskDetails={selectedRiskDetails}
        isRiskDetailsLoading={isRiskDetailsLoading}
        onHazardLinkClick={handleHazardLinkClick}
        onRiskLinkClick={handleRiskLinkClick}
      />

      <AddRCMModal
        open={isAddRCMModalOpen}
        onClose={handleCloseRCMModal}
        onSave={handleUpdateRCM}
        riskId={selectedRiskId}
        projectId={projectId}
        isPending={false}
        initialData={getRCMModalInitialData(editingRCM)}
        isEditMode={!!editingRCMId}
        workflowData={singleRCMData as RCMApiResponseWithWorkflow}
        onRefetch={refetchRCM}
        onRefetchHazards={refetchHazards}
      />
    </PageContainer>
  )
}

export default CommonMitigationMatrix
