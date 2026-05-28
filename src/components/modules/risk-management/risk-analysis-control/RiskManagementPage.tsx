'use client'
/**
 * Classification: Confidential
 */

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Grid2 } from '@mui/material'
import DIRComponent from '@/components/ui/stepper/DIRComponent'
import RiskCategoryForm from '@/components/modules/risk-management/risk-analysis-control/RiskCategoryForm'
import HazardList from '@/components/modules/risk-management/hazard-list/HazardList'
import AddHazardModal from '@/components/modules/risk-management/hazard-list/AddHazardModal'
import AddRiskModal from '@/components/modules/risk-management/hazard-list/AddRiskModal'
import AddRCMModal from '@/components/modules/risk-management/hazard-list/AddRCMModal'
import AccessDenied from '@/components/shared/AccessDenied'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { TableContainer } from '@/styles/common'
import { gridSectionStyles } from '@/styles/modules/dnd/dirSpecification'
import { Label, showActionAlert } from '@/components/ui'
import {
  CategoryApiResponse,
  CategoryWithSubcategoriesApiResponse,
  HazardActionPermissions,
  HazardFormData,
  RCMFormData,
  RiskCategoryFormData,
  RiskCategorySaveData,
  RiskFormData,
  SubcategoryApiResponse,
} from '@/types/modules/risk-management/riskAnalysisControl'
import {
  useHazards,
  useRiskCategories,
  useRiskSubcategories,
  useUpsertRiskCategory,
} from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import { useHazardList } from '@/hooks/modules/risk-management/useHazardList'
import { useRiskManagementHandlers } from '@/hooks/modules/risk-management/useRiskManagementHandlers'
import {
  ACCESS_DENIED_CONSTANTS,
  RISK_CATEGORY_CONSTANTS,
  SUBCATEGORY_RESPONSE_REQUIRED_MODES,
} from '@/constants/modules/risk-management/riskAnalysisControl'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { NUMBERMAP } from '@/constants/common'

export type RiskManagementPageMode =
  | 'risk-analysis'
  | 'hazard-identification'
  | 'risk-assessment'
  | 'risk-control-measure'

export interface RiskManagementPageConfig {
  mode: RiskManagementPageMode
  hazardListPermissions: HazardActionPermissions
  formReadOnly: boolean
  hazardLinkText: string
  showFormActions: boolean
  allowHazardModal: boolean
  allowRiskModal: boolean
  allowRCMModal: boolean
  enableAddHazardFromLink: boolean
  showApplicabilityCheckbox: boolean
}

const defaultActionPermissions: HazardActionPermissions = {
  allowAddHazard: true,
  allowEditHazard: true,
  allowDeleteHazard: true,
  allowAddRisk: true,
  allowEditRisk: true,
  allowDeleteRisk: true,
  allowAddRCM: true,
  allowEditRCM: true,
  allowDeleteRCM: true,
  showRiskSection: true,
}

const defaultConfig: RiskManagementPageConfig = {
  mode: 'risk-analysis',
  hazardListPermissions: defaultActionPermissions,
  formReadOnly: false,
  hazardLinkText: RISK_CATEGORY_CONSTANTS.HAZARDS_LINK_TEXT,
  showFormActions: true,
  allowHazardModal: true,
  allowRiskModal: true,
  allowRCMModal: true,
  enableAddHazardFromLink: true,
  showApplicabilityCheckbox: true,
}

interface RiskManagementPageProps {
  config?: Partial<RiskManagementPageConfig>
}

/**
 * Risk Management Page
 * Configurable page used for Risk Analysis, Hazard Identification, Risk Assessment, and Risk Control Measure flows
 * Classification: Confidential
 */
const RiskManagementPage: React.FC<RiskManagementPageProps> = ({ config }) => {
  const params = useParams()
  const projectId = params.id as string

  const mergedPermissions: HazardActionPermissions = useMemo(
    () => ({
      ...defaultActionPermissions,
      ...(config?.hazardListPermissions ?? {}),
    }),
    [config?.hazardListPermissions]
  )

  const mergedConfig: RiskManagementPageConfig = useMemo(
    () => ({
      ...defaultConfig,
      ...config,
      hazardListPermissions: mergedPermissions,
    }),
    [config, mergedPermissions]
  )

  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [formData, setFormData] = useState<RiskCategoryFormData>({})

  // Show hazard list state
  const [showHazardList, setShowHazardList] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string>('')
  const [selectedRiskApplicabilityId, setSelectedRiskApplicabilityId] =
    useState<number>(NUMBERMAP.ONE)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  )

  // Expanded states for hazards and risks
  const [expandedHazards, setExpandedHazards] = useState<Set<string>>(new Set())
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set())

  // Updated data state
  const [updatedRiskCategoriesData, setUpdatedRiskCategoriesData] = useState<
    CategoryWithSubcategoriesApiResponse[]
  >([])

  // Scroll state
  const [previousShowHazardList, setPreviousShowHazardList] = useState(false)

  // Main data hooks
  const { data: categoriesData, isLoading: categoriesLoading } =
    useRiskCategories(Number(projectId))

  const shouldRequireSubcategoryResponse = SUBCATEGORY_RESPONSE_REQUIRED_MODES.includes(
    mergedConfig.mode as typeof SUBCATEGORY_RESPONSE_REQUIRED_MODES[number]
  )

  const isRiskAssessmentMode = mergedConfig.mode === 'risk-assessment'
  const isRiskControlMeasureMode = mergedConfig.mode === 'risk-control-measure'

  // Get current step data from API data or fallback to static data
  const currentStepData = useMemo(() => {
    if (
      categoriesData?.data &&
      Array.isArray(categoriesData.data) &&
      currentStep !== null
    ) {
      const categoryIndex = currentStep - NUMBERMAP.ONE
      return (
        categoriesData.data[categoryIndex] ??
        categoriesData.data[NUMBERMAP.ZERO]
      )
    }
    return null
  }, [categoriesData, currentStep])

  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useRiskSubcategories(
      currentStepData?.category_id ?? NUMBERMAP.ZERO,
      Number(projectId),
      shouldRequireSubcategoryResponse
    )

  // Mutation hooks - following the same pattern as existing screen
  const { mutate: updateRiskCategory, isPending: isSaving } =
    useUpsertRiskCategory(currentStepData?.category_id, Number(projectId))

  // Hazard management hooks
  const { data: hazardsApiData, refetch: refetchHazards, isLoading: hazardsLoading } =
    useHazards(selectedRiskApplicabilityId, showHazardList)

  // Transform API data to UI format with expansion state
  const { hazards } = useHazardList({
    hazardsApiData,
    expandedHazards,
    expandedRisks,
  })

  // Use the custom hook for risk management handlers
  const {
    isAddHazardModalOpen,
    isAddRiskModalOpen,
    isAddRCMModalOpen,
    editingHazard,
    editingRiskFormData,
    editingRCM,
    selectedHazardId,
    selectedRiskId,
    harmOptions,
    singleRiskLoading: hookSingleRiskLoading,
    isHazardPending,
    isRiskPending,
    isRCMPending,
    handleAddHazard: hookHandleAddHazard,
    handleEditHazard: hookHandleEditHazard,
    handleUpdateHazard: hookHandleUpdateHazard,
    handleAddRisk: hookHandleAddRisk,
    handleEditRisk: hookHandleEditRisk,
    handleUpdateRisk: hookHandleUpdateRisk,
    handleAddRCM: hookHandleAddRCM,
    handleEditRCM: hookHandleEditRCM,
    handleUpdateRCM: hookHandleUpdateRCM,
    handleCloseHazardModal: hookHandleCloseHazardModal,
    handleCloseRiskModal: hookHandleCloseRiskModal,
    handleCloseRCMModal: hookHandleCloseRCMModal,
    handleToggleHazard,
    handleToggleRisk,
    handleDeleteHazard,
    handleDeleteRisk,
    handleDeleteRCM,
    getHazardModalInitialData,
    getRCMModalInitialData,
    singleRCMData,
    refetchRCM,
  } = useRiskManagementHandlers(
    selectedRiskApplicabilityId,
    Number(projectId),
    hazards,
    hazardsApiData
  )

  // Scroll to top when hazard list is shown (only when transitioning from form view)
  useEffect(() => {
    if (showHazardList && !previousShowHazardList) {
      // Only scroll when transitioning from false to true (form view to hazard list)
      window.scrollTo({ top: NUMBERMAP.ZERO, behavior: 'smooth' })
    }
    setPreviousShowHazardList(showHazardList)
  }, [showHazardList, previousShowHazardList])

  // ===== EVENT HANDLERS =====
  // Initialize currentStep with the first available category when categories data is loaded
  useEffect(() => {
    if (
      categoriesData?.data &&
      Array.isArray(categoriesData.data) &&
      categoriesData.data.length > NUMBERMAP.ZERO &&
      currentStep === null
    ) {
      setCurrentStep(NUMBERMAP.ONE)
    }
  }, [categoriesData, currentStep])

  // Create a wrapper function to debug step changes
  const handleStepChange = (stepId: number) => {
    // Only update if the step is actually different to prevent infinite loops
    if (stepId !== currentStep) {
      setCurrentStep(stepId)
      // Clear form data when changing steps to ensure fresh initialization
      setFormData({})
      // Reset hazard-related state when changing categories
      setShowHazardList(false)
      setSelectedQuestion('')
      // Reset selectedRiskApplicabilityId when changing categories to ensure fresh value
      setSelectedRiskApplicabilityId(NUMBERMAP.ONE)
    }
  }

  // Get current category data with questions and responses from updated state or API data
  const currentCategoryData = useMemo(() => {
    // Get the actual category ID for the current step
    const currentCategoryId = currentStepData?.category_id

    // First check if we have updated data for this category
    const updatedData = updatedRiskCategoriesData.find(
      (category) => category.category_id === currentCategoryId
    )

    if (updatedData) {
      return updatedData
    }

    // Create category data by combining category info with subcategories
    if (currentStepData && subcategoriesData?.data) {
      return {
        category_id: currentStepData.category_id,
        category_applicability_id: currentStepData.category_applicability_id,
        category_name: currentStepData.category_name,
        project_id: currentStepData.project_id,
        status: currentStepData.status,
        subcategory_and_response: subcategoriesData.data,
      }
    }
    return null
  }, [subcategoriesData, updatedRiskCategoriesData, currentStepData])

  const currentSubcategories =
    (currentCategoryData?.subcategory_and_response ??
      []) as SubcategoryApiResponse[]

  // Prepare steps for DIRComponent
  const stepperSteps = useMemo(() => {
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      return categoriesData.data.map(
        (step: CategoryApiResponse, index: number) => ({
          id: index + NUMBERMAP.ONE,
          title: step.category_name,
          categoryId: step.category_id,
        })
      )
    }
    return []
  }, [categoriesData])

  const handleFieldChange = (questionId: string, value: string) => {
    setFormData((prev: RiskCategoryFormData) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleUpdate = (
    updatedData: RiskCategorySaveData,
    showAlerts: boolean = true
  ): void => {
    // Validation: Ensure required data is available
    if (
      !currentStepData?.category_id ||
      !currentStepData?.category_applicability_id
    ) {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      return
    }

    if (mergedConfig.formReadOnly) {
      return
    }

    const missingResponseItem = updatedData.applicability_list.find(
      (item) =>
        item.is_applicable === NUMBERMAP.ONE &&
        (!item.response || item.response.trim() === '')
    )

    if (missingResponseItem) {
      showActionAlert('customAlert', {
        title:
          RISK_CATEGORY_CONSTANTS.FORM_VALIDATION
            .SUBCATEGORY_RESPONSE_REQUIRED_TITLE,
        text: RISK_CATEGORY_CONSTANTS.FORM_VALIDATION
          .SUBCATEGORY_RESPONSE_REQUIRED_TEXT,
        icon: 'error',
        cancelButton: false,
        confirmButton: true,
      })
      return
    }

    // Format the request body according to the specified structure
    const payload = {
      project_id: Number(projectId),
      category_id: currentStepData.category_id,
      category_applicability_id: currentStepData.category_applicability_id,
      applicability_list: updatedData.applicability_list.map(
        (item: {
          sub_category_id: number
          is_applicable: number
          response: string
        }) => ({
          sub_category_id: item.sub_category_id,
          is_applicable: item.is_applicable,
          response: item.response?.trim() === '' ? null : item.response,
        })
      ),
    }

    updateRiskCategory(payload, {
      onSuccess: () => {
        // Extract the filter predicate to reduce nesting depth
        const isNotCurrentCategory = (
          category: CategoryWithSubcategoriesApiResponse
        ) => category.category_id !== currentStepData?.category_id

        const filterUpdatedCategories = (
          prevData: CategoryWithSubcategoriesApiResponse[]
        ) => {
          return prevData.filter(isNotCurrentCategory)
        }
        setUpdatedRiskCategoriesData(filterUpdatedCategories)
        // Only show success alert if showAlerts is true
        if (showAlerts) {
          showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        }
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
      },
    })
  }

  const handleHazardClick = (questionId: string) => {
    setCurrentQuestionId(questionId)
    // Find the question text from the current category data
    const question = currentSubcategories.find(
      (q) => q.sub_category_id.toString() === questionId
    )
    if (question) {
      setSelectedQuestion(question.subcategory)
      // Set the subcategory_applicability_id for this specific question
      if (question.subcategory_applicability_id) {
        setSelectedRiskApplicabilityId(question.subcategory_applicability_id)
      }
    }
    // Reset accordion states to closed when showing hazard list
    setExpandedHazards(new Set())
    setExpandedRisks(new Set())
    setShowHazardList(true)
  }

  // Hazard management handlers with permission guards
  const handleAddHazard = (questionId?: string) => {
    if (!mergedConfig.allowHazardModal || !mergedPermissions.allowAddHazard)
      return
    if (questionId) {
      const question = currentSubcategories.find(
        (q) => q.sub_category_id.toString() === questionId
      )
      if (question?.subcategory_applicability_id) {
        setSelectedRiskApplicabilityId(question.subcategory_applicability_id)
      }
    }
    hookHandleAddHazard()
  }

  const handleAddRisk = (hazardId: string) => {
    if (!mergedConfig.allowRiskModal || !mergedPermissions.allowAddRisk) return
    hookHandleAddRisk(hazardId)
  }

  const handleAddRCM = (riskId: string) => {
    if (!mergedConfig.allowRCMModal || !mergedPermissions.allowAddRCM) return
    hookHandleAddRCM(riskId)
  }

  const handleUpdateHazard = (updatedData: HazardFormData): void => {
    if (!mergedConfig.allowHazardModal) return
    hookHandleUpdateHazard(updatedData)
  }

  const handleUpdateRisk = (updatedData: RiskFormData): void => {
    if (!mergedConfig.allowRiskModal) return
    hookHandleUpdateRisk(updatedData)
  }

  const handleUpdateRCM = (updatedData: RCMFormData): void => {
    if (!mergedConfig.allowRCMModal) return
    hookHandleUpdateRCM(updatedData)
  }

  const handleEditHazard = (hazardId: string) => {
    if (!mergedConfig.allowHazardModal || !mergedPermissions.allowEditHazard)
      return
    hookHandleEditHazard(hazardId)
  }

  const handleEditRisk = (riskId: string) => {
    if (!mergedConfig.allowRiskModal || !mergedPermissions.allowEditRisk) return
    hookHandleEditRisk(riskId)
  }

  const handleEditRCM = (rcmId: string) => {
    if (!mergedConfig.allowRCMModal || !mergedPermissions.allowEditRCM) return
    hookHandleEditRCM(rcmId)
  }

  const loading = () => {
    if (categoriesLoading) return true
    if (subcategoriesLoading) return true
    if (hookSingleRiskLoading) return true
    return false
  }
  // Modal close handlers
  const handleCloseHazardModal = () => {
    hookHandleCloseHazardModal()
  }

  const handleCloseRiskModal = () => {
    hookHandleCloseRiskModal()
  }

  const handleCloseRCMModal = () => {
    hookHandleCloseRCMModal()
  }

  const handleHazardBack = () => {
    setShowHazardList(false)
    // Reset hazard-related state when going back to category list
    setSelectedQuestion('')
  }

  // Risk category form props
  const getRiskCategoryFormProps = () => {
    if (!currentCategoryData) return null
    return {
      currentQuestionId: currentQuestionId,
      currentStep: {
        id: currentCategoryData.category_id,
        name: currentCategoryData.category_name,
        subcategory_and_response: currentSubcategories,
      },
      formData,
      onFieldChange: handleFieldChange,
      onHazardClick: handleHazardClick,
      onAddHazard: handleAddHazard,
      onSave: handleUpdate,
      isSaving: isSaving,
      readOnly: mergedConfig.formReadOnly,
      hazardLinkText: mergedConfig.hazardLinkText,
      showActions: mergedConfig.showFormActions,
      enableAddHazardFromLink: mergedConfig.enableAddHazardFromLink,
      showApplicabilityCheckbox: mergedConfig.showApplicabilityCheckbox,
    }
  }

  // Check if categoriesData is empty array
  const isCategoriesEmpty =
    categoriesData?.data &&
    Array.isArray(categoriesData.data) &&
    categoriesData.data.length === NUMBERMAP.ZERO

  // If categories are empty, show AccessDenied with custom message
  if (isCategoriesEmpty) {
    return (
      <AccessDenied
        customMessage={{
          heading: ACCESS_DENIED_CONSTANTS.HEADING,
          description: ACCESS_DENIED_CONSTANTS.DESCRIPTION,
        }}
      />
    )
  }

  const shouldShowHazardModal =
    mergedConfig.allowHazardModal &&
    (mergedPermissions.allowAddHazard || mergedPermissions.allowEditHazard)

  const shouldShowRiskModal =
    mergedConfig.allowRiskModal &&
    mergedPermissions.showRiskSection &&
    (mergedPermissions.allowAddRisk || mergedPermissions.allowEditRisk)

  const shouldShowRCMModal =
    mergedConfig.allowRCMModal &&
    mergedPermissions.showRiskSection &&
    (mergedPermissions.allowAddRCM || mergedPermissions.allowEditRCM)

  return (
    <>
      <GlobalLoader loading={loading()} />
      <TableContainer>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          {!showHazardList && (
            <>
              <Grid2 size={{ md: NUMBERMAP.TWELVE }} sx={gridSectionStyles}>
                <DIRComponent
                  steps={stepperSteps}
                  getCurrentStep={handleStepChange}
                  currentSteps={currentStep ?? undefined}
                />
              </Grid2>
              <Label title={currentStepData?.category_name ?? ''} />
            </>
          )}

          {showHazardList ? (
            <Grid2 size={NUMBERMAP.TWELVE}>
              <GlobalLoader loading={hazardsLoading} />
              <HazardList
                handleHazardback={handleHazardBack}
                hazards={hazards}
                isLoading={hazardsLoading}
                selectedQuestion={selectedQuestion}
                onAddHazard={handleAddHazard}
                onAddRisk={handleAddRisk}
                onAddRCM={handleAddRCM}
                onToggleHazard={(hazardId) =>
                  handleToggleHazard(hazardId, setExpandedHazards)
                }
                onToggleRisk={(riskId) =>
                  handleToggleRisk(riskId, setExpandedRisks)
                }
                onEditHazard={handleEditHazard}
                onEditRisk={handleEditRisk}
                onEditRCM={handleEditRCM}
                onDeleteHazard={handleDeleteHazard}
                onDeleteRisk={handleDeleteRisk}
                onDeleteRCM={handleDeleteRCM}
                actionPermissions={mergedPermissions}
                isRiskAssessmentMode={isRiskAssessmentMode}
                isRiskControlMeasureMode={isRiskControlMeasureMode}
              />
            </Grid2>
          ) : (
            (() => {
              const formProps = getRiskCategoryFormProps()
              return formProps ? <RiskCategoryForm {...formProps} /> : null
            })()
          )}
        </Grid2>

        {/* Modals */}
        {shouldShowHazardModal && (
          <AddHazardModal
            open={isAddHazardModalOpen}
            onClose={handleCloseHazardModal}
            onSave={handleUpdateHazard}
            hazardId={editingHazard?.hazard_id}
            isPending={isHazardPending}
            initialData={getHazardModalInitialData(editingHazard, harmOptions)}
          />
        )}

        {shouldShowRiskModal && (
          <AddRiskModal
            open={isAddRiskModalOpen}
            onClose={handleCloseRiskModal}
            onSave={handleUpdateRisk}
            hazardId={selectedHazardId}
            projectId={Number(projectId)}
            isPending={isRiskPending}
            initialData={editingRiskFormData ?? undefined}
          />
        )}

        {shouldShowRCMModal && (
          <AddRCMModal
            open={isAddRCMModalOpen}
            onClose={handleCloseRCMModal}
            onSave={handleUpdateRCM}
            riskId={selectedRiskId}
            projectId={Number(projectId)}
            isPending={isRCMPending}
            initialData={getRCMModalInitialData(editingRCM)}
            isEditMode={!!editingRCM}
            workflowData={singleRCMData}
            onRefetch={refetchRCM}
            onRefetchHazards={refetchHazards}
          />
        )}
      </TableContainer>
    </>
  )
}

export default RiskManagementPage
