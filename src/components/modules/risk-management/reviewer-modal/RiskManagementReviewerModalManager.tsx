import React, { useState, useEffect } from 'react'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP } from '@/constants/common'
import {
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { useSubmitRiskManagementWorkflowAction } from '@/hooks/modules/risk-management/useRiskManagementReviewModal'
import { WorkflowActionData } from '@/types/common'
import { RiskManagementReviewerModalManagerProps } from '@/types/modules/risk-management/reviewer'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'

/**
 * Classification: Confidential
 */

const RiskManagementReviewerModalManager: React.FC<
  RiskManagementReviewerModalManagerProps
> = ({
  isLoading,
  taskInfo,
  permissions,
  menuId,
  menuName,
  customHandlers = {},
  onPermissionChange,
  contextType,
  contextId,
  taskId,
  onRefetch,
  queryKey,
  hideSaveButton = false
}) => {
  const [isRiskManagementReviewerModal, setIsRiskManagementReviewerModal] =
    useState(false)
  const [riskManagementButtonId, setRiskManagementButtonId] = useState<
    number | null
  >(null)
  const [riskManagementButtonName, setRiskManagementButtonName] = useState<
    string | null
  >(null)
  const [isSaving, setIsSaving] = useState(false)
  const { mutate: submitRiskManagementWorkflow } =
    useSubmitRiskManagementWorkflowAction(queryKey)

  const handleRiskManagementCloseReviewerModalCommon = () => {
    setIsRiskManagementReviewerModal(false)
    setRiskManagementButtonId(null)
    setIsSaving(false)
  }

  const handleRiskManagementButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setRiskManagementButtonId(trigger_status_id || null)
    setRiskManagementButtonName(button_label)
    setIsRiskManagementReviewerModal(true)
  }

  const handleRiskManagementSubmitForReviewCommon = (
    trigger_status_id?: number
  ) => {
    handleRiskManagementButtonChangeCommon(
      BUTTON_LABEL.SUBMIT_FOR_REVIEW,
      trigger_status_id
    )
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleRiskManagementButtonChangeCommon(
      BUTTON_LABEL.APPROVE,
      trigger_status_id
    )
  }

  const handleRiskManagementRejectCommon = (trigger_status_id?: number) => {
    handleRiskManagementButtonChangeCommon(
      BUTTON_LABEL.REJECT,
      trigger_status_id
    )
  }

  const handleRiskManagementSubmitApprovalCommon = (
    trigger_status_id?: number
  ) => {
    handleRiskManagementButtonChangeCommon(
      BUTTON_LABEL.SUBMIT_FOR_APPROVAL,
      trigger_status_id
    )
  }

  const handleRiskManagementSaveWithFormData = (
    comment: string,
    reviewer?: number
  ) => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    const riskManagementPayload: WorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      new_status_id: riskManagementButtonId ?? NUMBERMAP.ZERO,
      comment: comment,
      menu_id: menuId ?? NUMBERMAP.ZERO,
      task_id: taskId,
    }

    // Add reviewer field only for Submit for review
    if (
      riskManagementButtonName === BUTTON_LABEL.SUBMIT_FOR_REVIEW &&
      reviewer
    ) {
      riskManagementPayload.reviewer = Number(reviewer)
    }

    submitRiskManagementWorkflow(riskManagementPayload, {
      onSuccess: () => {
        setIsSaving(false)
        handleRiskManagementCloseReviewerModalCommon()
        onRefetch?.()
      },
      onError: () => {
        setIsSaving(false)
        handleRiskManagementCloseReviewerModalCommon()
      },
    })
  }

  // Create action handlers that match the expected signature
  const riskManagementActionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: (_id: number) => customHandlers.handleSave?.(),
    [BUTTON_LABEL.CANCEL]: (_id: number) => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.BACK]: (_id: number) => customHandlers.handleBack?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) =>
      handleRiskManagementSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleRiskManagementRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) =>
      handleRiskManagementSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(
      permissions,
      riskManagementActionHandlers,
      customHandlers.isDisabled,
      hideSaveButton
    )

  const enhancedButtons =
    buttonDetails?.map((button) => {
      if (button.label === BUTTON_LABEL.BACK) {
        return {
          ...button,
          startIcon: button.startIcon ?? <KeyboardDoubleArrowLeftIcon sx={{ color: 'inherit' }} />,
          variant: button.variant ?? 'contained',
        }
      }
      return button
    }) ?? null

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [!isLoading, buttonDetails])

  // Notify parent component about permission change
  useEffect(() => {
    onPermissionChange?.(hasEditPermission)
  }, [hasEditPermission, onPermissionChange])

  return (
    <>
      <ButtonGroup buttons={enhancedButtons ?? []} />

      <ReviewerModal
        reviewerlist={taskInfo?.reviewer_list ?? []}
        open={isRiskManagementReviewerModal}
        onClose={handleRiskManagementCloseReviewerModalCommon}
        mode={riskManagementButtonName ?? ''}
        onSave={handleRiskManagementSaveWithFormData}
        isSaving={isSaving}
        taskId={taskId}
      />
    </>
  )
}

export default RiskManagementReviewerModalManager
