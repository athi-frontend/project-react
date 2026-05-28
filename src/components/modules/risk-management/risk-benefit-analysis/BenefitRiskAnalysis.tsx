'use client'
import React, { useEffect, useState } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { ButtonGroup, DataGridTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { PADDING } from '@/styles/common'
import {
  useGetRiskBenefit,
  useSubmitBenefitRiskAnalysis,
} from '@/hooks/modules/risk-management/useRiskBenefitAnalysis'
import { useParams, useRouter } from 'next/navigation'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import { InlineStyles } from '@/styles/modules/dnd/dir'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import { RISK_BENEFIT_CONSTANTS } from '@/constants/modules/risk-management/riskBenefitAnalysis'
import { RiskMatrixRow } from '@/types/modules/risk-management/riskBenefitAnalysis'
import { PageContainer, ClickableCountCell } from '@/styles/modules/risk-management/riskBenefitAnalysis'
import RiskDetailsModal from '@/components/modules/risk-management/report/RiskDetailsModal'
import HazardList from '@/components/modules/risk-management/hazard-list/HazardList'
import { useHazardList } from '@/hooks/modules/risk-management/useHazardList'
import { MATRIX_TYPES, RiskControlMeasure, RiskDetailRow, SelectedCellData } from '@/types/modules/risk-management/mitigationMatrix'
import { useRiskDetailsById } from '@/hooks/modules/risk-management/useMitigationMatrix'
import { useHazards, useDeleteRCM, useRCMById, useUpsertRCM } from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import { MITIGATION_MATRIX_CONSTANTS } from '@/constants/modules/risk-management/mitigationMatrix'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { RCMApiResponseWithWorkflow, RCMFormData, UpsertRCMRequest } from '@/types/modules/risk-management/riskAnalysisControl'
import { findRiskIdByRCMId, getRCMModalInitialData, handleDeleteRCM, handleToggleHazard, handleToggleRisk } from '@/lib/modules/risk-management/hazardTransformer'
import AddRCMModal from '../hazard-list/AddRCMModal'

/**
 * Risk Benefit Analysis
    Classification : Confidential
**/

const BenefitRiskPage: React.FC = () => {

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
  const [hazardsExpand, setHazardsExpand] = useState<Set<string>>(new Set())
  const [risksExpand, setRisksExpand] = useState<Set<string>>(new Set())
  const params = useParams()
  const project_id = Number(params.id)
  const router = useRouter()

  const { data: RiskBenefitData, isLoading } = useGetRiskBenefit(project_id)
  const { mutate: submitBenefitRiskAnalysis, isPending: isSubmitting } =
    useSubmitBenefitRiskAnalysis()

  // Initialize state with default data
  const [matrixData, setMatrixData] = useState<RiskMatrixRow[]>([])

  const {
    data: riskDetails,
    isLoading: isRiskDetailsLoading,
    refetch: refetchRiskDetails,
  } = useRiskDetailsById(
    project_id,
    selectedCellData?.probabilityLevelId ?? NUMBERMAP.ZERO,
    selectedCellData?.severityLevelId ?? NUMBERMAP.ZERO,
    MATRIX_TYPES.AFTER
  )

  const { data: hazardsData, refetch: refetchHazards } = useHazards(
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

  const [isRCMModalOpen, setIsRCMModalOpen] = useState(false)
  const [editRCMId, setEditRCMId] = useState<number | null>(null)
  const [selectedRiskId, setSelectedRiskId] = useState<string>('')
  const [editRCM, setEditRCM] = useState<RiskControlMeasure | null>(null)

  // Individual entity fetching hooks for edit operations
  const { data: singleRCM, refetch: refetchRCM } = useRCMById(editRCMId ?? NUMBERMAP.ZERO)

  // Update selected risk details when API data changes
  useEffect(() => {
    if (riskDetails?.data) {
      setSelectedRiskDetails(riskDetails.data)

      // Set the subcategory applicability ID from the risk details that match the selected cell
      if (riskDetails.data.length > NUMBERMAP.ZERO && selectedCellData) {
        // Find the risk detail that matches the selected cell's probability and severity levels
        const matchingRiskDetailData = riskDetails.data.find(
          (riskDetail: RiskDetailRow) =>
            riskDetail.probability_level_id ===
            selectedCellData.probabilityLevelId &&
            riskDetail.severity_level_id === selectedCellData.severityLevelId
        )

        if (matchingRiskDetailData) {
          const subcategoryId = matchingRiskDetailData.subcategory_applicability_id
          setSelectedSubcategoryApplicabilityId(subcategoryId)
        } else {
          const subcategoryId =
            riskDetails.data[NUMBERMAP.ZERO].subcategory_applicability_id
          setSelectedSubcategoryApplicabilityId(subcategoryId)
        }
      }
    }
  }, [riskDetails, selectedCellData])

  // Transform hazard data for UI display with expansion state
  const { hazards: hazardsListData } = useHazardList({
    hazardsApiData: hazardsData,
    expandedHazards:hazardsExpand,
    expandedRisks: risksExpand,
  })

  // Update selected question from hazard data when risk details are selected
  useEffect(() => {
    if (
      selectedRiskDetails.length > NUMBERMAP.ZERO &&
      hazardsListData.length > NUMBERMAP.ZERO
    ) {
      // Get the subcategory name from the first hazard's risk_subcategory
      const subcategoryName =
      hazardsListData[NUMBERMAP.ZERO]?.risk_subcategory?.subcategory_name
      if (subcategoryName) {
        setSelectedQuestion(subcategoryName)
      }
    }
  }, [selectedRiskDetails, hazardsListData])

  // Ensure selectedQuestion is populated from hazard fetch (subcategory_name) as fallback
  useEffect(() => {
    // Only set from hazardsListData if no risk details are selected and no question is set
    if (
      !selectedQuestion &&
      hazardsListData.length > NUMBERMAP.ZERO &&
      selectedRiskDetails.length === NUMBERMAP.ZERO
    ) {
      const firstHazard = hazardsListData[NUMBERMAP.ZERO]
      const questionFromHazard =
        firstHazard?.risk_subcategory?.subcategory_name ?? ''
      if (questionFromHazard) {
        setSelectedQuestion(questionFromHazard)
      }
    }
  }, [hazardsListData, selectedQuestion, selectedRiskDetails.length])

  // Handle single RCM data for editing
  useEffect(() => {
    if (singleRCM?.data && singleRCM.data.length > NUMBERMAP.ZERO) {
      const rcmInfo = singleRCM.data[NUMBERMAP.ZERO]
      if (rcmInfo.rcm_id) {
        setEditRCM({
          ...rcmInfo,
          id: rcmInfo.rcm_id.toString(),
          title: rcmInfo.rcm_title ?? '',
          description: rcmInfo.rcm_description ?? '',
          probability_level_id: rcmInfo.probability_level,
          severity_level_id: rcmInfo.severity_level,
        })
        setIsRCMModalOpen(true)
      }
    }
  }, [singleRCM])

  const handleAddRCM = (riskId: string) => {
    setSelectedRiskId(riskId)
    setIsRCMModalOpen(true)
  }

  const handleRCMEdit = (rcmId: string) => {
    // Find the risk ID for this RCM from existing data
    const foundRiskId = findRiskIdByRCMId(rcmId, hazardsListData)

    if (!foundRiskId) {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      return
    }

    const rcmIdNumber = parseInt(rcmId)
    if (rcmIdNumber) {
      setEditRCMId(rcmIdNumber)
      setSelectedRiskId(foundRiskId)
    }
  }

  const handleCloseRCMModal = () => {
    setIsRCMModalOpen(false)
    setEditRCM(null)
    setEditRCMId(null)
  }

  const handleUpdateRCM = (formData: RCMFormData) => {
    // For creating new RCM, we only have selectedRiskId
    // For editing existing RCM, we have editRCMId
    let riskId: number

    if (editRCMId) {
      // Editing existing RCM - find the risk that contains this RCM
      const riskWithRCM = hazardsListData
        .flatMap((hazard) => hazard.risks)
        .find((risk) =>
          risk.rcms.some(
            (rcm) =>
              rcm.rcm_id === editRCMId ||
              rcm.rcm_id.toString() === editRCMId.toString()
          )
        )

      if (!riskWithRCM) {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
        return
      }

      riskId = riskWithRCM.risk_id
    } else {
      // Creating new RCM - find the risk by selectedRiskId
      const risk = hazardsListData
        .flatMap((hazards) => hazards.risks)
        .find((r) => r.risk_id.toString() === selectedRiskId)

      if (!risk) {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
        return
      }

      riskId = risk?.risk_id
    }

    const upsertPayload: UpsertRCMRequest = {
      risk_id: riskId,
      rcm_type_id: parseInt(formData.rcmTypeId),
      rcm_title: formData?.title,
      rcm_description: formData?.description,
      rationale: formData?.rationale,
      control_effectiveness: formData?.controlEffectiveness,
      probability_level_id: formData.probability
        ? parseInt(formData.probability)
        : null,
      severity_level_id: formData.severity ? parseInt(formData.severity) : null,
    }

    if (formData?.rcmInducedHazardIdentified) {
      upsertPayload.reference_rcm_slug = formData.rcmInducedHazardIdentified
    }

    if (editRCM?.rcm_id) {
      upsertPayload.rcm_id = editRCM.rcm_id
    }

    updateRCM(upsertPayload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        setEditRCMId(null)
        setEditRCM(null)
        setIsRCMModalOpen(false)
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

  useEffect(() => {
    if (
      selectedCellData?.probabilityLevelId &&
      selectedCellData?.severityLevelId
    ) {
      refetchRiskDetails()
    }
  }, [selectedCellData, refetchRiskDetails])

  const handleHazardCodeClick = (
    hazardId?: number,
    subcategoryApplicabilityId?: number
  ) => {
    setShowHazardList(true)
    // Close the risk details modal
    setSelectedCellData(null)
    // Reset all expanded states when opening hazard list
    setHazardsExpand(new Set())
    setRisksExpand(new Set())

    // If subcategoryApplicabilityId is provided, set it for hazard fetching
    if (subcategoryApplicabilityId) {
      setSelectedSubcategoryApplicabilityId(subcategoryApplicabilityId)
    }

    // If hazardId is provided, expand that specific hazard
    if (hazardId) {
      setHazardsExpand(new Set([hazardId.toString()]))
    }
  }

  /**
   * Description: Handle risk link click in modal and navigates to hazard list view and optionally expands specific hazard and risk
   */
  const handleRiskCodeClick = (
    hazardId?: number,
    riskId?: number,
    subcategoryApplicabilityId?: number
  ) => {
    setShowHazardList(true)
    // Close the risk details modal
    setSelectedCellData(null)
    // Reset all expanded states when opening hazard list
    setHazardsExpand(new Set())
    setRisksExpand(new Set())

    // If subcategoryApplicabilityId is provided, set it for hazard fetching
    if (subcategoryApplicabilityId) {
      setSelectedSubcategoryApplicabilityId(subcategoryApplicabilityId)
    }

    // If hazardId and riskId are provided, expand both hazard and risk
    if (hazardId && riskId) {
      setHazardsExpand(new Set([hazardId.toString()]))
      setRisksExpand(new Set([riskId.toString()]))
    } else if (hazardId) {
      // If only hazardId is provided, expand just the hazard
      setHazardsExpand(new Set([hazardId.toString()]))
    }
  }

  /**
   * Description: Handle back navigation from hazard list and returns to matrix view and resets expansion states
   */
  const handleBackToBenefitRiskAnalysis = () => {
    setShowHazardList(false)
    // Reset all expanded states when going back
    setHazardsExpand(new Set())
    setRisksExpand(new Set())
  }

  // Update matrixData when API response is received
  useEffect(() => {
    if (
      RiskBenefitData?.data.length > NUMBERMAP.ZERO &&
      RiskBenefitData?.data[NUMBERMAP.ZERO]?.criteriaEvaluation
    ) {
      const criteriaData =
        RiskBenefitData.data[NUMBERMAP.ZERO].criteriaEvaluation
      setMatrixData(criteriaData)
    }
  }, [RiskBenefitData])

  // Define columns for risk matrix
  const columns: GridColDef[] = [
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.BENEFIT_CRITERIA.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.BENEFIT_CRITERIA.HEADER_NAME,
      flex: NUMBERMAP.ONE,
      tooltip: true,
    },
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.DESC.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.DESC.HEADER_NAME,
      flex: NUMBERMAP.ONE,
      tooltip: true,
    },
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.ACTUAL_COUNT.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.ACTUAL_COUNT.HEADER_NAME,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => {
        const count = params?.value ?? NUMBERMAP.ZERO
        const isClickable = count > NUMBERMAP.ZERO
        return (
          <ClickableCountCell
            isClickable={isClickable}
            onClick={() => {
              if (isClickable) {
                setSelectedCellData({
                  probabilityLevelId: params.row.probability_level_id,
                  severityLevelId: params.row.severity_level_id,
                })
              }
            }}
          >
            {count}
          </ClickableCountCell>
        )
      },
    },
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.MAX_COUNT.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.MAX_COUNT.HEADER_NAME,
      flex: NUMBERMAP.HALF,
    },
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.COMPARISON.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.COMPARISON.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
      tooltip: true,
    },
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.RESULT.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.RESULT.HEADER_NAME,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => (
        <span
          style={
            params.value === RISK_BENEFIT_CONSTANTS.PASS_VALUE
              ? InlineStyles.statusActive
              : InlineStyles.statusInactive
          }
        >
          {params.value}
        </span>
      ),
    },
    {
      field: RISK_BENEFIT_CONSTANTS.COLUMNS.OVERALL_BENEFIT.FIELD_NAME,
      headerName: RISK_BENEFIT_CONSTANTS.COLUMNS.OVERALL_BENEFIT.HEADER_NAME,
      flex: NUMBERMAP.HALF,
    },
  ]

  const handleCancel = () => {
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  const handleApprove = () => {
    if (!project_id) {
      return
    }
    submitBenefitRiskAnalysis({
      context_id: [project_id],
      context_type: RISK_BENEFIT_CONSTANTS.CONTEXT_TYPE.PROJECT,
      verification_type: RISK_BENEFIT_CONSTANTS.VERIFICATION_TYPE.APPROVED,
    })
  }

  const handleReject = () => {
    if (!project_id) {
      return
    }
    submitBenefitRiskAnalysis({
      context_id: [project_id],
      context_type: RISK_BENEFIT_CONSTANTS.CONTEXT_TYPE.PROJECT,
      verification_type: RISK_BENEFIT_CONSTANTS.VERIFICATION_TYPE.REJECTED,
    })
  }

  const isAnyLoading = () => {
    if (isLoading) return true
    if (isSubmitting) return true
    return false
  }

  return (
    <PageContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {showHazardList ? (
        <HazardList
          handleHazardback={handleBackToBenefitRiskAnalysis}
          hazards={hazardsListData}
          selectedQuestion={selectedQuestion}
          onToggleHazard={(hazardId: string) =>
            handleToggleHazard(hazardId, setHazardsExpand)
          }
          onToggleRisk={(riskId: string) =>
            handleToggleRisk(riskId, setRisksExpand)
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
          onEditRCM={handleRCMEdit}
          onDeleteRCM={(rcmId: string) =>
            handleDeleteRCM(rcmId, deleteRCM, showActionAlert, COMMON_CONSTANTS)
          }
          isRiskControlMeasureMode={true}
        />
      ) : (
        <CommonSharedTale
          title={RISK_BENEFIT_CONSTANTS.PAGE_TITLE}
          Table={
            <Box sx={PADDING}>
              <DataGridTable
                rows={matrixData}
                columns={columns}
                idField={RISK_BENEFIT_CONSTANTS.ID_FIELD}
                hideFooter
              />
              <ButtonGroup
                buttons={[
                  { label: BUTTON_LABEL.APPROVE, onClick: handleApprove },
                  { label: BUTTON_LABEL.REJECT, onClick: handleReject },
                  { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
                ]}
              />
            </Box>
          }
        />
      )}

      <RiskDetailsModal
        open={selectedCellData !== null}
        onClose={() => setSelectedCellData(null)}
        selectedRiskDetails={riskDetails?.data ?? []}
        isRiskDetailsLoading={isRiskDetailsLoading}
        onHazardLinkClick={handleHazardCodeClick}
        onRiskLinkClick={handleRiskCodeClick}
      />

      <AddRCMModal
        open={isRCMModalOpen}
        onClose={handleCloseRCMModal}
        onSave={handleUpdateRCM}
        riskId={selectedRiskId}
        projectId={project_id}
        isPending={false}
        initialData={getRCMModalInitialData(editRCM)}
        isEditMode={!!editRCMId}
        workflowData={singleRCM as RCMApiResponseWithWorkflow}
        onRefetch={refetchRCM}
        onRefetchHazards={refetchHazards}
      />
    </PageContainer>
  )
}
export default BenefitRiskPage
