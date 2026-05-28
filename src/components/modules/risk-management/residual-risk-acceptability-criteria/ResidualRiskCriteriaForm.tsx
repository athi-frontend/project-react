/**
 *Classification : Confidential
 **/
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Box } from '@mui/material'
import { Label, showActionAlert } from '@/components/ui'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { NUMBERMAP, BUTTON_LABEL, KEY } from '@/constants/common'
import { FormContainer, FormWrapper } from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { ButtonContainer } from '@/styles/components/ui/button'
import { useRouter } from 'next/navigation'
import ResidualRiskCriteriaSections from './ResidualRiskCriteriaSections'
import {
  useFetchResidualRiskCriteria,
  useSubmitResidualRiskCriteria,
} from '@/hooks/modules/risk-management/residual-risk-acceptability-criteria/useResidualRiskCriteria'
import {
  useProbabilityLevels,
  useSeverityLevels,
} from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import { useGetOperators } from '@/hooks/useCommonDropdown'
import { useFormState } from '@/hooks/modules/risk-management/residual-risk-acceptability-criteria/useFormState'
import { useResidualRiskCriteriaForm } from '@/hooks/modules/risk-management/residual-risk-acceptability-criteria/useResidualRiskCriteriaForm'
import {
  RESIDUAL_RISK_CRITERIA_ALERT_MESSAGES,
  RESIDUAL_RISK_CRITERIA_FORM_LABELS,
  FIELD_ORDER,
  FIELD_LABEL_MAP
} from '@/constants/modules/risk-management/residualRiskCriteria';
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import {
  validateForm,
  transformFormDataToPayload,
  transformPayloadToDraftSaveFormat,
  findDuplicateProbabilitySeverityCombination,
} from '@/lib/utils/modules/risk-management/residualRiskCriteriaUtils'
import {
  FormData,
  CriteriaSection,
  Operator,
  ResidualRiskCriteriaFormProps,
  FormFieldValue,
} from '@/types/modules/risk-management/residualRiskCriteria'
import { ContentContainer, PADDING } from '@/styles/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import {
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

const ResidualRiskCriteriaForm: React.FC<ResidualRiskCriteriaFormProps> = ({
  projectId,
}) => {
  const router = useRouter()

  // API hooks
  const { data: criteriaData, isLoading: isCriteriaLoading } =
    useFetchResidualRiskCriteria(projectId)
  const { mutate: submitCriteria, isPending } = useSubmitResidualRiskCriteria()
  const [disabled, setDisabled] = useState(false)
  const { data: probabilityData } = useProbabilityLevels(projectId)
  const { data: severityData } = useSeverityLevels(projectId)
  const { data: operatorData } = useGetOperators(NUMBERMAP.ONE)
  const permissions =
    criteriaData?.meta_info?.action_control?.permissions ?? []

  // Use custom hooks for form state management
  const {
    formData,
    errors,
    setFormData,
    setErrors,
    updateField,
  } = useFormState()

  const isInitialLoad = useRef(true)
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave()

  useEffect(() => {
    if (!isCriteriaLoading) {
      const timer = setTimeout(() => {
        isInitialLoad.current = false
      }, NUMBERMAP.THOUSAND)
      return () => clearTimeout(timer)
    }
  }, [isCriteriaLoading])

  // Load initial data from API
  useResidualRiskCriteriaForm({
    criteriaData,
    setFormData,
  })

  /**
   * Function Name: handleDraftSave
   * Params: formDataToSave
   * Description: Used to handle draft save for residual risk criteria form data
   * Author: Harsithiga B,
   * Created: 27-01-2026,
   * Modified:
   * Classification : Confidential
   **/
  const handleDraftSave = (formDataToSave: FormData) => {
    const payload = transformFormDataToPayload(formDataToSave, projectId)
    const draftPayload = transformPayloadToDraftSaveFormat(payload, formDataToSave)
    draftSave({
      project_id: projectId,
      form_type: KEY,
      form_data: draftPayload,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Function Name: handleSectionChange
   * Params: sectionId, field, value
   * Description: Used to handle changes in form section fields and update form data
   * Author: Harsithiga B,
   * Created: 08-10-2025,
   * Modified:
   * Classification : Confidential
   **/
  const handleSectionChange = (
    sectionId: keyof FormData,
    field: keyof CriteriaSection,
    value: FormFieldValue
  ) => {
    updateField(sectionId, field, value)
    // Prepare next form data snapshot for draft save
    if (!isInitialLoad.current) {
      const nextFormData: FormData = {
        ...formData,
        [sectionId]: {
          ...formData[sectionId],
          [field]: value,
        } as CriteriaSection,
      }
      handleDraftSave(nextFormData)
    }
  }

  /**
   * Function Name: handleSave
   * Params: None
   * Description: Used to save the residual risk criteria form data after validation
   * Author: Madhumitha G,
   * Created: 25-09-2025,
   * Modified:
   * Classification : Confidential
   **/
  const handleSave = () => {
    const {
      isValid,
      errors: validationErrors,
      filteredFormData,
    } = validateForm(formData)
    if (!isValid) {
      setErrors(validationErrors)

      // Get order of sections as in formData (or FIELD_ORDER equivalent)
      const sectionEntries = Object.entries(formData);
      // Find the first section (by index) with an empty required field
      for (const [, sectionValue] of sectionEntries) {
        // Check each required field
        const emptyField = FIELD_ORDER.find(fieldName => {
          return (
            sectionValue[fieldName] === null ||
            sectionValue[fieldName] === undefined ||
            sectionValue[fieldName] === ''
          );
        });
        if (emptyField) {
          // Compose a formValues map with just this field
          const formValues = { [emptyField]: sectionValue[emptyField] ?? '' };
          // Use per-section label
          const fieldLabel = FIELD_LABEL_MAP[emptyField] ? `${FIELD_LABEL_MAP[emptyField]} (${sectionValue.title})` : `${emptyField} (${sectionValue.title})`;
          // Pass to focus util
          validateAndFocusFirstEmptyField(formValues, [emptyField], { [emptyField]: fieldLabel });
          break;
        }
      }
      return
    }

    const dataToSubmit = filteredFormData ?? formData
    const duplicateCombination = findDuplicateProbabilitySeverityCombination(
      dataToSubmit
    )
    if (duplicateCombination) {
      showActionAlert('customAlert', {
        title: RESIDUAL_RISK_CRITERIA_ALERT_MESSAGES.DUPLICATE_COMBINATION_TITLE,
        text: RESIDUAL_RISK_CRITERIA_ALERT_MESSAGES.DUPLICATE_COMBINATION_DESCRIPTION,
        icon: 'warning',
        cancelButton: false,
        confirmButton: true,
        confirmButtonText: 'Ok',
      })
      return
    }

    // Use filtered form data if available, otherwise use original form data
    const payload = transformFormDataToPayload(dataToSubmit, projectId)
    clearDraftSave()
    submitCriteria(payload)
  }

  /**
   * Function Name: handleCancel
   * Params: None
   * Description: Used to cancel form changes and reset form data to initial state
   * Author: Madhumitha G,
   * Created: 25-09-2025,
   * Modified:
   * Classification : Confidential
   **/
  const handleCancel = async() => {
    await checkUnsavedDraftBeforeLeave()
    setDisabled(true)
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  // Computed values and derived state
  const isButtonDisabled = () => {
    if (isPending) return true
    if (disabled) return true
    return false
  }
  const actionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.CANCEL]: () => {
      handleCancel()
    },
    [BUTTON_LABEL.SAVE]: () => handleSave(),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, isButtonDisabled())

  const loadingState = [isCriteriaLoading ?? false, isPending ?? false].some(Boolean)
  const isFormLocked = [
    isPending ?? false,
    disabled ?? false,
    !(hasEditPermission ?? false),
  ].some(Boolean)

  useEffect(() => {
    if (
      !isCriteriaLoading &&
      !buttonDetails
    ) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON as 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, isCriteriaLoading])

  // Filter options for dropdowns
  // Filter probability options to only include records with id and level_name
  const probabilityOptions = probabilityData?.data
    ? probabilityData.data.filter((item) => item.id && item.level_name)
    : []

  // Filter severity options to only include records with id and level_name
  const severityOptions = severityData?.data
    ? severityData.data.filter((item) => item.id && item.level_name)
    : []

  return (
    <FormContainer>
      <FormWrapper>
        <Box>
          <Label title={RESIDUAL_RISK_CRITERIA_FORM_LABELS.TITLE} />
          <GlobalLoader loading={loadingState} />
        </Box>
        {isDraftSaving && <DraftLoading />}
        <ContentContainer sx={PADDING}>
          <ResidualRiskCriteriaSections
            formData={formData}
            errors={errors}
            probabilityOptions={probabilityOptions}
            severityOptions={severityOptions}
            operatorOptions={(operatorData?.data as Operator[]) ?? []}
            isReadOnly={isFormLocked}
            onSectionChange={handleSectionChange}
          />
          <ButtonContainer sx={{ ...STYLE5, mb: NUMBERMAP.TWO }}>
            <RiskNavigationButtonGroup
              projectId={projectId}
              buttons={buttonDetails ?? []}
            />
          </ButtonContainer>
        </ContentContainer>
      </FormWrapper>
    </FormContainer>
  )
}

export default ResidualRiskCriteriaForm
