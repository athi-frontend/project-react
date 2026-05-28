import React, { useState, useEffect } from 'react'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { useRegulationWorkflowActionUpdate } from '@/hooks/modules/regulation/useWorkflowAction'
import { RegulationWorkflowActionData } from '@/types/modules/regulation/workflowAction'

/**
 * Workflow action handler for regulation modules
 * Classification: Confidential
 */

interface RegulationReviewerModalManagerProps {
  isLoading: boolean
  permissions: { action: string; trigger_status_id?: number }[]
  taskInfo: { task_comments: any[]; reviewer_list: any[] }
  menuId?: number
  menuName?: string
  customHandlers?: {
    handleCancel?: () => void
    handleSave?: () => void
    isDisabled?: boolean
  }
  onPermissionChange?: (hasEditPermission: boolean) => void
  contextType: string
  contextId: number
  userId?: string
  organizationSiteId?: string
  refetch?: () => void
  hideSaveButton?: boolean // Set to true for hiding the save button logic in modals
}

const RegulationReviewerModalManager: React.FC<RegulationReviewerModalManagerProps> = ({
  isLoading,
  taskInfo,
  permissions,
  menuId,
  menuName,
  customHandlers = {},
  onPermissionChange,
  contextType,
  contextId,
  userId,
  organizationSiteId,
  refetch,
  hideSaveButton = false
}) => {
  const [isRegulationReviewerModal, setIsRegulationReviewerModal] = useState(false)
  const [regulationButtonId, setRegulationButtonId] = useState<number | null>(null)
  const [regulationButtonName, setRegulationButtonName] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { mutate: submitRegulationWorkflow } = useRegulationWorkflowActionUpdate()

  const handleRegulationCloseReviewerModalCommon = () => {
    setIsRegulationReviewerModal(false)
    setRegulationButtonId(null)
    setIsSaving(false)
  }

  const handleRegulationButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setRegulationButtonId(trigger_status_id || null)
    setRegulationButtonName(button_label)
    setIsRegulationReviewerModal(true)
  }

  const handleRegulationSubmitForReviewCommon = (trigger_status_id?: number) => {
    handleRegulationButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleRegulationButtonChangeCommon(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleRegulationRejectCommon = (trigger_status_id?: number) => {
    handleRegulationButtonChangeCommon(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleRegulationSubmitApprovalCommon = (trigger_status_id?: number) => {
    handleRegulationButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleRegulationSaveWithFormData = (comment: string, reviewer?: number) => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    const regulationPayload: RegulationWorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      new_status_id: regulationButtonId ?? undefined,
      comment: comment,
      menu_id: menuId
    }

    submitRegulationWorkflow(regulationPayload, {
      onSuccess: () => {
        setIsSaving(false)
        handleRegulationCloseReviewerModalCommon()
        refetch?.() // Refetch workflow data to show updated buttons
      },
      onError: () => {
        setIsSaving(false)
        handleRegulationCloseReviewerModalCommon()
      },
    })
  }

  // Create action handlers that match the expected signature
  const regulationActionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: (_id: number) => customHandlers.handleSave?.(),
    [BUTTON_LABEL.CANCEL]: (_id: number) => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) => handleRegulationSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleRegulationRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) => handleRegulationSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, regulationActionHandlers, customHandlers.isDisabled, hideSaveButton)

  useEffect(() => {
    if (!isLoading && permissions.length === NUMBERMAP.ZERO && !buttonDetails && permissions !== undefined) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      });
    }
  }, [isLoading, permissions.length, buttonDetails]);

  // Notify parent component about permission change
  useEffect(() => {
    onPermissionChange?.(hasEditPermission);
  }, [hasEditPermission, onPermissionChange]);

  return (
    <>
      <ButtonGroup buttons={buttonDetails ?? []} />
      
      <ReviewerModal
        reviewerlist={taskInfo?.reviewer_list ?? []}
        commentshistory={taskInfo?.task_comments ?? []}
        open={isRegulationReviewerModal}
        onClose={handleRegulationCloseReviewerModalCommon}
        mode={regulationButtonName ?? ''}
        onSave={handleRegulationSaveWithFormData}
        isSaving={isSaving}
      />
    </>
  )
}

export default RegulationReviewerModalManager
