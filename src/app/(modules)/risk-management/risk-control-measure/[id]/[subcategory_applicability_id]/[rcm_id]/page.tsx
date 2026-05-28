'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Grid2 } from '@mui/material'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { NUMBERMAP } from '@/constants/common'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import AddRCMModal from '@/components/modules/risk-management/hazard-list/AddRCMModal'
import HazardList from '@/components/modules/risk-management/hazard-list/HazardList'
import {
  HazardApiResponse,
  SubcategoryWithHazardsApiResponse,
} from '@/types/modules/risk-management/riskAnalysisControl'
import { useHazards } from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import { useHazardList } from '@/hooks/modules/risk-management/useHazardList'
import { useRiskManagementHandlers } from '@/hooks/modules/risk-management/useRiskManagementHandlers'
import { TableContainer } from '@/styles/common'

/**
 * Classification: Confidential
 */

/**
 * Comprehensive Risk Control Measure Page
 * Shows hierarchical list view of hazards, risks, and RCMs with modal editing
 * Based on URL parameters to determine which entity to load and prefill
 */
const ComprehensiveRiskControlMeasurePage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)
  const subcategoryApplicabilityId = Number(params.subcategory_applicability_id)
  const rcmId = Number(params.rcm_id)

  // Expanded states for hazards and risks - initialize as expanded
  const [expandedHazards, setExpandedHazards] = useState<Set<string>>(new Set())
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set())

  // Track if we've already auto-expanded to prevent re-expansion
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false)

  // Store subcategory name for display
  const [subcategoryName, setSubcategoryName] = useState<string>('')

  // API hooks for hazard management
  const {
    data: hazardsApiData,
    refetch: refetchHazards,
    isLoading: hazardsLoading,
  } = useHazards(subcategoryApplicabilityId)

  // Transform API data to UI format with expansion state
  // The API returns subcategory wrapper data, but useHazardList expects flattened hazards
  const flattenedHazardsApiData = () => {
    if (hazardsApiData?.data) {
      const subcategoryData =
        hazardsApiData.data as unknown as SubcategoryWithHazardsApiResponse[]
      const flattenedHazards: HazardApiResponse[] = []

      subcategoryData.forEach((subcategory) => {
        if (subcategory.hazards && Array.isArray(subcategory.hazards)) {
          subcategory.hazards.forEach((hazard) => {
            flattenedHazards.push({
              ...hazard,
              subcategory_name: subcategory.subcategory_name,
              subcategory_applicability_id:
                subcategory.subcategory_applicability_id,
            })
          })
        }
      })

      return {
        ...hazardsApiData,
        data: flattenedHazards,
      }
    }
    return hazardsApiData
  }

  const { hazards } = useHazardList({
    hazardsApiData: flattenedHazardsApiData(),
    expandedHazards,
    expandedRisks,
  })

  // Use the custom hook for risk management handlers
  const {
    isAddRCMModalOpen,
    editingRCM,
    selectedRiskId,
    handleAddRCM: addNewRCM,
    handleEditRCM: editRCM,
    handleUpdateRCM: updateRCM,
    handleCloseRCMModal,
    handleToggleHazard,
    handleToggleRisk,
    handleDeleteRCM: deleteRCMItem,
    getRCMModalInitialData,
    extractIdsFromRCMId,
    singleRCMData,
    refetchRCM,
  } = useRiskManagementHandlers(
    subcategoryApplicabilityId,
    projectId,
    hazards,
    hazardsApiData,
    rcmId
  )

  // Helper function to process risks within a hazard
  const processRisksInHazard = (hazard: any, allRiskIds: Set<string>) => {
    if (
      hazard?.risks &&
      Array.isArray(hazard.risks) &&
      hazard.risks.length > NUMBERMAP.ZERO
    ) {
      hazard.risks.forEach((risk: any) => {
        if (risk?.risk_id != null) {
          allRiskIds.add(risk.risk_id.toString())
        }
      })
    }
  }

  // Helper function to expand all hazards and risks
  const expandAllHazardsAndRisks = (
    subcategoryData: SubcategoryWithHazardsApiResponse[],
    allHazardIds: Set<string>,
    allRiskIds: Set<string>
  ) => {
    subcategoryData.forEach((subcategory) => {
      if (subcategory.hazards && Array.isArray(subcategory.hazards)) {
        subcategory.hazards.forEach((hazard) => {
          if (hazard?.hazard_id != null) {
            allHazardIds.add(hazard.hazard_id.toString())
          }
          processRisksInHazard(hazard, allRiskIds)
        })
      }
    })
  }

  // Helper function to expand specific RCM hazard and risk
  const expandSpecificRCM = (
    rcmId: number,
    subcategoryData: SubcategoryWithHazardsApiResponse[],
    allHazardIds: Set<string>,
    allRiskIds: Set<string>
  ) => {
    const extractedIds = extractIdsFromRCMId(rcmId, subcategoryData)

    if (extractedIds.found && extractedIds.hazardId) {
      allHazardIds.add(extractedIds.hazardId.toString())
    }
    if (extractedIds.found && extractedIds.riskId) {
      allRiskIds.add(extractedIds.riskId.toString())
    }
  }

  // Auto-expand hazards and risks when data is loaded
  useEffect(() => {
    if (
      hazardsApiData?.data &&
      hazardsApiData.data.length > NUMBERMAP.ZERO &&
      !hasAutoExpanded
    ) {
      const allHazardIds = new Set<string>()
      const allRiskIds = new Set<string>()

      // The actual data structure is an array of subcategory objects with hazards
      const subcategoryData =
        hazardsApiData.data as unknown as SubcategoryWithHazardsApiResponse[]

      // Extract subcategory name from the first subcategory
      if (subcategoryData[NUMBERMAP.ZERO]?.subcategory_name) {
        setSubcategoryName(subcategoryData[NUMBERMAP.ZERO].subcategory_name)
      }

      // If we have an RCM ID in the URL, find and expand only the specific hazard and risk
      if (rcmId) {
        expandSpecificRCM(rcmId, subcategoryData, allHazardIds, allRiskIds)
      } else {
        // No RCM ID, expand all hazards and risks
        expandAllHazardsAndRisks(subcategoryData, allHazardIds, allRiskIds)
      }

      // Update state with hazard and risk IDs
      setExpandedHazards(allHazardIds)
      setExpandedRisks(allRiskIds)
      setHasAutoExpanded(true)
    }
  }, [hazardsApiData, hasAutoExpanded, rcmId])

  return (
    <>
      <GlobalLoader loading={hazardsLoading} />
      <TableContainer>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <HazardList
              handleHazardback={() =>
                router.push(
                  `${APPLICABILITY_ROUTES.RISK_MANAGEMENT}/risk-control-measure/${projectId}`
                )
              }
              hazards={hazards}
              isLoading={hazardsLoading}
              selectedQuestion={subcategoryName}
              onAddHazard={() => {}}
              onAddRisk={() => {}}
              onAddRCM={addNewRCM}
              onToggleHazard={(hazardId) =>
                handleToggleHazard(hazardId, setExpandedHazards)
              }
              onToggleRisk={(riskId) =>
                handleToggleRisk(riskId, setExpandedRisks)
              }
              onEditHazard={() => {}}
              onEditRisk={() => {}}
              onEditRCM={editRCM}
              onDeleteHazard={() => {}}
              onDeleteRisk={() => {}}
              onDeleteRCM={(rcmId) => deleteRCMItem(rcmId)}
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
              isRiskControlMeasureMode={true}
            />
          </Grid2>
        </Grid2>

        <AddRCMModal
          open={isAddRCMModalOpen}
          onClose={handleCloseRCMModal}
          onSave={updateRCM}
          riskId={selectedRiskId}
          projectId={projectId}
          isPending={false}
          initialData={getRCMModalInitialData(editingRCM)}
          isEditMode={!!editingRCM}
          workflowData={singleRCMData}
          onRefetch={refetchRCM}
          onRefetchHazards={refetchHazards}
        />
      </TableContainer>
    </>
  )
}

export default ComprehensiveRiskControlMeasurePage
