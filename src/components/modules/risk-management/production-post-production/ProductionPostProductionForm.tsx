/**
 * Classification: Confidential
 */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { Description, Label } from '@/components/ui'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { BUTTON_LABEL, NUMBERMAP, DRAFT } from '@/constants/common'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import {
  GridColumn,
  GridSecondColumn,
} from '@/styles/modules/regulation/executiveSummary'
import {
  useGetProductionPostProduction,
  usUpsertProductionPostProduction,
} from '@/hooks/modules/risk-management/useProductionPostProduction'
import {
  FORM_LABELS,
  PLACEHOLDERS,
  FORM_FIELD_NAMES,
  CONTEXT_TYPE,
} from '@/constants/modules/risk-management/productionPostProduction'
import { ProductionPostProductionFormData } from '@/types/modules/risk-management/productionPostProduction'
import { useParams, useRouter } from 'next/navigation'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import RiskManagementReviewerModalManager from '@/components/modules/risk-management/reviewer-modal/RiskManagementReviewerModalManager'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { GETSCOPE } from '@/constants/modules/risk-management/scope'
import { RESIDUAL_RISK_CRITERIA_QUERY_KEYS } from '@/constants/modules/risk-management/residualRiskCriteria'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { getAdjacentMenuUrls } from '@/lib/utils/menu'
import { selectCurrentMenuId, selectMenuData, useAppSelector } from '@/store/slices/menuSlice'

const ProductionPostProductionForm: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)
  const menuData = useAppSelector(selectMenuData)
  const currentMenuId = useAppSelector(selectCurrentMenuId)
  const { previousUrl } = getAdjacentMenuUrls(currentMenuId, menuData)
  const [formData, setFormData] = useState<ProductionPostProductionFormData>({
    productionFeedback: '',
    qualityControlData: '',
    customerFeedback: '',
    formalComplaints: '',
    adverseEvents: '',
    postMarketSurveillance: '',
    clinicalFollowUp: '',
  })

  const [existingId, setExistingId] = useState<number | null>(null)
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const isInitialDataLoad = useRef(true)
  const { draftSave, isDraftSaving, clearDraftSave, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'project',
    context_instance_id: projectId,
  })

  const { data, isLoading } = useGetProductionPostProduction(projectId)
  const { mutate: saveData, isPending: isSaving } =
    usUpsertProductionPostProduction(projectId)

  const basePermissions =
    (data?.meta_info?.action_control?.permissions ??
      []) as { action: string; trigger_status_id?: number }[]
  const permissionsWithBack =
    previousUrl && !basePermissions.some((perm) => perm.action === BUTTON_LABEL.BACK)
      ? [{ action: BUTTON_LABEL.BACK }, ...basePermissions]
      : basePermissions



  /*
    Description: Loads existing production post-production data when component mounts or data changes,
    Author: Harsithiga B,
    Created: 16-10-2025,
    Modified:
    Classification: Confidential
  */
  useEffect(() => {
    let existingData = null
    if (data?.data && typeof data?.data === 'object' && (data?.data as any).type === DRAFT) {
      existingData = data?.data
    } else if (Array.isArray(data?.data) && data?.data.length > NUMBERMAP.ZERO) {
      existingData = data?.data[NUMBERMAP.ZERO] ?? null
    }

    if (!existingData) {
      isInitialDataLoad.current = false
      return
    }
    
    setExistingId(existingData.id ?? null)
    
    // Map API response fields to form state
    setFormData({
      productionFeedback: existingData.feedback_production_manufacturing_actions ?? '',
      qualityControlData: existingData.outgoing_quality_control_actions ?? '',
      customerFeedback: existingData.customer_end_user_feedback_actions ?? '',
      formalComplaints: existingData.formal_complaints_actions ?? '',
      adverseEvents: existingData.adverse_events_safety_incidents_actions ?? '',
      postMarketSurveillance: existingData.post_market_surveillance_actions ?? '',
      clinicalFollowUp: existingData.post_market_clinical_followup_actions ?? '',
    })
    
    isInitialDataLoad.current = false
  }, [data])

  /*
    Description: Handles form field changes and updates the form state with new values,
    Author: Harsithiga B,
    Created: 16-10-2025,
    Modified:
    Classification: Confidential
  */
  const handleFieldChange = (
    field: keyof ProductionPostProductionFormData,
    value: string
  ) => {
    if (!hasEditPermission) return
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }
      if (!isInitialDataLoad.current) {
        draftSave({
          project_id: projectId,
          form_type: 'project',
          form_data: {
            id: existingId ?? null,
            feedback_production_manufacturing_actions: updated.productionFeedback ?? '',
            outgoing_quality_control_actions: updated.qualityControlData ?? '',
            customer_end_user_feedback_actions: updated.customerFeedback ?? '',
            formal_complaints_actions: updated.formalComplaints ?? '',
            adverse_events_safety_incidents_actions: updated.adverseEvents ?? '',
            post_market_surveillance_actions: updated.postMarketSurveillance ?? '',
            post_market_clinical_followup_actions: updated.clinicalFollowUp ?? '',
            type: DRAFT,
          },
          timestamp: new Date().toISOString(),
        })
      }
      return updated
    })
  }

  const handleNavigateBack = () => {
    if (previousUrl) {
      router.push(`/${previousUrl}/${projectId}`)
    }
  }

  /*
    Description: Handles form submission by creating the API payload and calling the save mutation,
    Author: Harsithiga B,
    Created: 16-10-2025,
    Modified:
    Classification: Confidential
  */
  const handleSave = () => {
    const processFieldValue = (value: string) => {
      return value.trim() === '' ? '' : value
    }

    const payload = {
      project_id: projectId,
      ...(existingId && { id: existingId }),
      feedback_production_manufacturing_actions: processFieldValue(
        formData.productionFeedback
      ),
      outgoing_quality_control_actions: processFieldValue(
        formData.qualityControlData
      ),
      customer_end_user_feedback_actions: processFieldValue(
        formData.customerFeedback
      ),
      formal_complaints_actions: processFieldValue(formData.formalComplaints),
      adverse_events_safety_incidents_actions: processFieldValue(
        formData.adverseEvents
      ),
      post_market_surveillance_actions: processFieldValue(
        formData.postMarketSurveillance
      ),
      post_market_clinical_followup_actions: processFieldValue(
        formData.clinicalFollowUp
      ),
      status: NUMBERMAP.ONE,
    }

    clearDraftSave()
    saveData(payload)
  }

  /*
    Description: Handles form cancellation by redirecting to risk management page,
    Author: Harsithiga B,
    Created: 16-10-2025,
    Modified:
    Classification: Confidential
  */
  const handleCancel = async() => {
    await checkUnsavedDraftBeforeLeave()
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  const formFieldGroups = [
    [
      {
        key: FORM_FIELD_NAMES.PRODUCTION_FEEDBACK,
        label: FORM_LABELS.FEEDBACK_PRODUCTION_MANUFACTURING_ACTIONS,
        value: formData.productionFeedback,
        sx: GridSecondColumn,
      },
      {
        key: FORM_FIELD_NAMES.QUALITY_CONTROL_DATA,
        label: FORM_LABELS.OUTGOING_QUALITY_CONTROL_ACTIONS,
        value: formData.qualityControlData,
        sx: GridColumn,
      },
    ],
    [
      {
        key: FORM_FIELD_NAMES.CUSTOMER_FEEDBACK,
        label: FORM_LABELS.CUSTOMER_END_USER_FEEDBACK_ACTIONS,
        value: formData.customerFeedback,
        sx: {},
      },
      {
        key: FORM_FIELD_NAMES.FORMAL_COMPLAINTS,
        label: FORM_LABELS.FORMAL_COMPLAINTS_ACTIONS,
        value: formData.formalComplaints,
        sx: {},
      },
    ],
    [
      {
        key: FORM_FIELD_NAMES.ADVERSE_EVENTS,
        label: FORM_LABELS.ADVERSE_EVENTS_SAFETY_INCIDENTS_ACTIONS,
        value: formData.adverseEvents,
        sx: {},
      },
      {
        key: FORM_FIELD_NAMES.POST_MARKET_SURVEILLANCE,
        label: FORM_LABELS.POST_MARKET_SURVEILLANCE_ACTIONS,
        value: formData.postMarketSurveillance,
        sx: {},
      },
    ],
    [
      {
        key: FORM_FIELD_NAMES.CLINICAL_FOLLOW_UP,
        label: FORM_LABELS.POST_MARKET_CLINICAL_FOLLOWUP_ACTIONS,
        value: formData.clinicalFollowUp,
        sx: {},
      },
    ],
  ]

  const loading = () => {
    if (isLoading) return true
    if (isSaving) return true
    return false
  }

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={loading()} />
      <FormWrapper>
        <Label title={FORM_LABELS.PRODUCTION_AND_POST_PRODUCTION_INFO} />
        <FormContent>
          {formFieldGroups.map((group) => (
            <Grid2
              key={group.map((field) => field.key).join('-')}
              container
              spacing={NUMBERMAP.TWO}
              sx={STYLE5}
              alignItems="flex-start"
            >
              {group.map((field) => (
                <Grid2
                  key={field.key}
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  sx={field.sx}
                >
                  <Description
                    label={field.label}
                    value={field.value}
                    onChange={(value) => handleFieldChange(field.key, value)}
                    placeholder={PLACEHOLDERS.ACTIONS_TO_BE_PERFORMED}
                    maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
                    disabled={!hasEditPermission}
                  />
                </Grid2>
              ))}
            </Grid2>
          ))}

          <Grid2 sx={STYLE5}>
            <CommentsHistory
              comments={data?.meta_info?.task_info?.task_comments}
            />
          </Grid2>
          {/* Reviewer Modal Manager */}
          <RiskManagementReviewerModalManager
            taskInfo={data?.meta_info?.task_info}
            isLoading={isLoading}
            permissions={permissionsWithBack}
            menuId={data?.meta_info?.action_control?.menuId}
            menuName={data?.meta_info?.action_control?.formName}
            onPermissionChange={setHasEditPermission}
            customHandlers={{
              handleCancel,
              handleSave,
              isDisabled: isSaving,
              handleBack: handleNavigateBack,
            }}
            contextType={CONTEXT_TYPE.RISK_MANAGEMENT_PLAN}
            contextId={projectId}
            queryKey={[
              GETSCOPE,
              RISK_MANAGEMENT_QUERY_KEYS.APPLICABILITY.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.OTHER_HAZARDS.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW_REQUIREMENT.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.RISK_TEAM.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.PROBABILITY_LEVELS.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.SEVERITY_LEVELS.LIST,
              RISK_MANAGEMENT_QUERY_KEYS.RISK_ASSESSMENT_MATRIX.LIST,
              RESIDUAL_RISK_CRITERIA_QUERY_KEYS.CRITERIA_FETCH_QUERY_KEY,
              RISK_MANAGEMENT_QUERY_KEYS.PRODUCTION_POST_PRODUCTION_INFO
                .FETCH_BY_ID,
            ]}
          />
          
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default ProductionPostProductionForm
