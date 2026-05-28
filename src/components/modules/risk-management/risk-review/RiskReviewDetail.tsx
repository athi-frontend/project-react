'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Checkbox, Grid2 } from '@mui/material'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import {
  Label,
  RichTextEditor,
  showActionAlert,
} from '@/components/ui'
import { NUMBERMAP, STATUS, DRAFT } from '@/constants/common'
import {
  RiskReviewGridItemStyled,
  SectionTitle,
  AcknowledgeContainer,
} from '@/styles/modules/risk-management/riskReview'
import { FormWrapper, FormContent } from '@/styles/modules/user/userOnboard'
import { useRouter, useParams } from 'next/navigation'
import {
  RISK_REVIEW_LIST_ROUTE,
  RISK_REVIEW_PAGE,
  RISK_REVIEW_CONSTANTS,
  CONTEXT_TYPE,
} from '@/constants/modules/risk-management/riskReview'
import {
  useRiskReviewSummary,
  useRiskReviewById,
  useUpsertRiskReview,
} from '@/hooks/modules/risk-management/useRiskReview'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import AccessDenied from '@/components/shared/AccessDenied'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import RiskManagementReviewerModalManager from '@/components/modules/risk-management/reviewer-modal/RiskManagementReviewerModalManager'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import type {
  RiskReviewCategory,
  RiskReviewSummaryItem,
} from '@/types/modules/risk-management/riskReview'

/**
 * Classification: Confidential
 */

const RiskReviewDetail: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string
  const reviewRequirementId = Number(params?.review_requirement_id)

  const { data: summaryData, isLoading: isLoadingSummary } =
    useRiskReviewSummary()
  const { data: reviewDetailData, isLoading: isLoadingReviewDetail } =
    useRiskReviewById(reviewRequirementId)
  const { mutate: upsertRiskReview, isPending } = useUpsertRiskReview()
  const {
    draftSave,
    clearDraftSave,
    isDraftSaving,
    checkUnsavedDraftBeforeLeave,
  } = useDraftSave({
    context_type: RISK_REVIEW_CONSTANTS.CONTEXT_TYPE,
    context_instance_id: reviewRequirementId,
    enableFetch: false,
  })

  const [checked, setChecked] = useState<{ [summaryId: number]: boolean }>({})
  const [description, setDescription] = useState('')
  const [acknowledge, setAcknowledge] = useState(false)
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const isInitialDataLoad = useRef(true)

  const basePermissions =
    (reviewDetailData?.meta_info?.action_control?.permissions ??
      []) as { action: string; trigger_status_id?: number }[]

  const processSummaryItem = (
    summaryItem: RiskReviewSummaryItem,
    detail: any,
    checkedState: { [summaryId: number]: boolean }
  ): void => {
    const menuReview = detail.menu_stage_reviews?.find(
      (mr: { summary_id: number }) => mr.summary_id === summaryItem.id
    )
    checkedState[summaryItem.id] =
      menuReview?.is_menu_reviewed === NUMBERMAP.ONE ||
      menuReview?.is_reviewed === NUMBERMAP.ONE
  }

  const processCategory = (
    category: RiskReviewCategory,
    detail: any,
    checkedState: { [summaryId: number]: boolean }
  ): void => {
    category.summaries?.forEach((summaryItem: RiskReviewSummaryItem) => {
      processSummaryItem(summaryItem, detail, checkedState)
    })
  }

  const buildCheckedStateFromDetail = (
    detail: any,
    summaryData: any
  ): { [summaryId: number]: boolean } => {
    const checkedState: { [summaryId: number]: boolean } = {}
    if (!summaryData?.data) return checkedState

    summaryData.data.forEach((category: RiskReviewCategory) => {
      processCategory(category, detail, checkedState)
    })

    return checkedState
  }

  useEffect(() => {
    if (summaryData?.data) {
      const initialChecked: { [summaryId: number]: boolean } = {}
      summaryData.data.forEach((category: RiskReviewCategory) => {
        category.summaries?.forEach((summary: RiskReviewSummaryItem) => {
          initialChecked[summary.id] = false
        })
      })
      setChecked(initialChecked)
    }
  }, [summaryData])

  useEffect(() => {
    if (reviewDetailData?.data) {
      const data = reviewDetailData.data
      let detail = null
      
      if (data && typeof data === 'object' && (data as any).type === DRAFT) {
        detail = data
      } else if (Array.isArray(data) && data.length > NUMBERMAP.ZERO) {
        detail = data[NUMBERMAP.ZERO]
      }
      
      if (detail) {
        setDescription(detail?.description ?? '')
        setAcknowledge(detail?.is_acknowledge === NUMBERMAP.ONE)

        const checkedState = buildCheckedStateFromDetail(detail, summaryData)
        setChecked(checkedState)
      }
    }
    setTimeout(() => {
      isInitialDataLoad.current = false
    }, NUMBERMAP.TWOTHOUSAND)
  }, [reviewDetailData, summaryData])

  const handleDraftSave = (
    checkedState: { [summaryId: number]: boolean },
    descriptionValue: string,
    acknowledgeValue: boolean
  ) => {
    if (!summaryData?.data) return

    const summaryPayload: Array<{ summary_id: number; is_reviewed: number }> =
      []
    summaryData.data.forEach((category: RiskReviewCategory) => {
      category.summaries?.forEach((item: RiskReviewSummaryItem) => {
        summaryPayload.push({
          summary_id: item.id,
          is_reviewed: checkedState[item.id] ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
        })
      })
    })

    const payload = {
      review_requirement_id: reviewRequirementId,
      description: descriptionValue,
      is_acknowledge: acknowledgeValue ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
      menu_stage_reviews: summaryPayload,
      type: DRAFT,
    }

    draftSave({
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const handleCheck = (summaryId: number) => {
    if (!hasEditPermission) return
    setChecked((prev) => {
      const updated = { ...prev, [summaryId]: !prev[summaryId] }
      if (!isInitialDataLoad.current) {
        handleDraftSave(updated, description, acknowledge)
      }
      return updated
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    if (projectId) router.push(RISK_REVIEW_LIST_ROUTE(projectId))
  }

  const handleSave = () => {
    if (!summaryData?.data) return

    // Validate acknowledge checkbox
    if (!acknowledge) {
      showActionAlert('customAlert', {
        title: 'Error',
        text: RISK_REVIEW_CONSTANTS.ACKNOWLEDGE.ERROR_MESSAGE,
        icon: 'error',
        cancelButton: false,
        confirmButton: true,
      })
      return
    }

    const summaryPayload: Array<{ summary_id: number; is_reviewed: number }> =
      []
    summaryData.data.forEach((category: RiskReviewCategory) => {
      category.summaries?.forEach((item: RiskReviewSummaryItem) => {
        summaryPayload.push({
          summary_id: item.id,
          is_reviewed: checked[item.id] ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
        })
      })
    })

    const payload = {
      review_requirement_id: reviewRequirementId,
      description: description,
      acknowledge: acknowledge ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
      summary: summaryPayload,
    }

    clearDraftSave()
    upsertRiskReview(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        if (projectId) router.push(RISK_REVIEW_LIST_ROUTE(projectId))
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }


  const isAnyLoading = () => {
    if (isLoadingReviewDetail) return true
    if (isPending) return true
    if (isLoadingSummary) return true
    return false
  }

  // Handle summary API errors and empty responses (only after loading completes)
  if (
    !isLoadingSummary &&
    (!summaryData?.data || summaryData?.data?.length === NUMBERMAP.ZERO)
  ) {
    return (
      <PageContainer>
        <AccessDenied
          customMessage={RISK_REVIEW_CONSTANTS.ERROR_MESSAGES.NO_DATA_FOUND}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading()} />
      <FormWrapper>
        <Label title={RISK_REVIEW_PAGE.TITLE} />

        <FormContent>
          {summaryData?.data && summaryData.data.length > NUMBERMAP.ZERO && (
            <div>
              {summaryData.data.map((category: RiskReviewCategory) => (
                <div key={category.id}>
                  <SectionTitle>{category.risk_review_category}</SectionTitle>
                  <Grid2 container spacing={NUMBERMAP.TWO}>
                    {category.summaries?.map((item: RiskReviewSummaryItem) => (
                      <RiskReviewGridItemStyled
                        key={item.id}
                        size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                      >
                        <span>{item.risk_review_summary}</span>
                        <Checkbox
                          checked={checked[item.id] ?? false}
                          onChange={() => handleCheck(item.id)}
                          disabled={!hasEditPermission}
                        />
                      </RiskReviewGridItemStyled>
                    ))}
                  </Grid2>
                </div>
              ))}
            </div>
          )}

          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <SectionTitle>
                {RISK_REVIEW_CONSTANTS.DESCRIPTION.LABEL}
              </SectionTitle>
              <RichTextEditor
                label=""
                placeholder={RISK_REVIEW_CONSTANTS.DESCRIPTION.PLACEHOLDER}
                value={description}
                onChange={(value: string) => {
                  if (!hasEditPermission) return
                  setDescription(value)
                  if (!isInitialDataLoad.current) {
                    handleDraftSave(checked, value, acknowledge)
                  }
                }}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, sm: NUMBERMAP.TWELVE }}>
              <AcknowledgeContainer>
                <span>{RISK_REVIEW_CONSTANTS.ACKNOWLEDGE.LABEL}</span>
                <Checkbox
                  checked={acknowledge}
                  onChange={() => {
                    if (!hasEditPermission) return
                    const newValue = !acknowledge
                    setAcknowledge(newValue)
                    if (!isInitialDataLoad.current) {
                      handleDraftSave(checked, description, newValue)
                    }
                  }}
                  disabled={!hasEditPermission}
                />
              </AcknowledgeContainer>
            </Grid2>
          </Grid2>

          <RiskManagementReviewerModalManager
            taskInfo={reviewDetailData?.meta_info?.task_info}
            isLoading={isLoadingReviewDetail}
            permissions={basePermissions}
            menuId={reviewDetailData?.meta_info?.action_control?.menuId}
            taskId={reviewDetailData?.meta_info?.task_info?.task_id}
            menuName={reviewDetailData?.meta_info?.action_control?.formName}
            onPermissionChange={setHasEditPermission}
            customHandlers={{
              handleCancel,
              handleSave,
              isDisabled: isPending,
            }}
            contextType={CONTEXT_TYPE.RISK_REVIEW}
            contextId={Number(projectId)}
            queryKey={[
              RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_ALL,
              RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_BY_ID,
              RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_SUMMARY,
            ]}
          />
        </FormContent>
      </FormWrapper>
    </PageContainer>
  )
}

export default RiskReviewDetail
