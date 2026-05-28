/**
 * Classification: Confidential
 */

import React, { useState } from 'react'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP, STATUS } from '@/constants/common'
import { processButtonsWithPermissions } from '@/lib/utils/common'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { workflowAction } from '@/services/modules/common-workflow'
import { WorkflowActionData } from '@/types/common'
import { QCReviewerModalManagerProps } from '@/types/modules/quality-control-management/reviewer'
import { useWorkflowPermissions } from '@/hooks/common/useWorkflowPermissions'

const QCReviewerModalManager: React.FC<QCReviewerModalManagerProps & { module?: string }> = ({
  isLoading,
  taskInfo,
  permissions,
  menuId,
  menuName,
  customHandlers = {},
  onPermissionChange,
  contextType,
  contextId,
  uniqueId,
  refetch,
  hideSaveButton = false,
  module = 'quality-control' // Default to 'quality-control' for QC module
}) => {
  const [isQCReviewerModal, setIsQCReviewerModal] = useState(false)
  const [qcButtonId, setQcButtonId] = useState<number | null>(null)
  const [qcButtonName, setQcButtonName] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleQCCloseReviewerModalCommon = () => {
    setIsQCReviewerModal(false)
    setQcButtonId(null)
    setIsSaving(false)
  }

  const handleQCButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setQcButtonId(trigger_status_id || null)
    setQcButtonName(button_label)
    setIsQCReviewerModal(true)
  }

  const handleQCSubmitForReviewCommon = (trigger_status_id?: number) => {
    handleQCButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleQCButtonChangeCommon(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleQCRejectCommon = (trigger_status_id?: number) => {
    handleQCButtonChangeCommon(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleQCSubmitApprovalCommon = (trigger_status_id?: number) => {
    handleQCButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleQCSaveWithFormData = async (comment: string, reviewer?: number) => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    
    const qcPayload: WorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      new_status_id: qcButtonId ?? NUMBERMAP.ZERO,
      comment: comment,
      menu_id: menuId ?? NUMBERMAP.ZERO,
      task_id: taskInfo?.task_id,
    }
    
    // Add unique_id if provided
    if (uniqueId !== undefined && uniqueId !== null) {
      qcPayload.unique_id = uniqueId
    }
    
    // Add reviewer field only for Submit for review
    if (qcButtonName === BUTTON_LABEL.SUBMIT_FOR_REVIEW && reviewer) {
      qcPayload.reviewer = Number(reviewer)
    }

    // Use POST for Save, PUT for other actions
    const isSaveAction = qcButtonName === BUTTON_LABEL.SAVE
    const method = isSaveAction ? 'POST' : 'PUT'

    try {
      await workflowAction(qcPayload, module, method)
      setIsSaving(false)
      handleQCCloseReviewerModalCommon()
      showActionAlert(STATUS.SUCCESS)
      refetch?.() // Refetch workflow data to show updated buttons
    } catch {
      setIsSaving(false)
      handleQCCloseReviewerModalCommon()
      showActionAlert(STATUS.FAILED)
    }
  }

  const handleSaveCommon = async () => {
    // Find the Save action trigger_status_id from permissions
    const savePermission = permissions.find(permission => permission.action === BUTTON_LABEL.SAVE)
    const triggerStatusId = savePermission?.trigger_status_id ?? NUMBERMAP.ZERO

    const payload: WorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      menu_id: menuId ?? NUMBERMAP.ZERO,
      new_status_id: triggerStatusId,
      comment: '',
      task_id: taskInfo?.task_id,
    }
    
    // Add unique_id if provided
    if (uniqueId !== undefined && uniqueId !== null) {
      payload.unique_id = uniqueId
    }

    try {
      await workflowAction(payload, module, 'POST')
      showActionAlert(STATUS.SUCCESS)
      refetch?.()
    } catch {
      showActionAlert(STATUS.FAILED)
    }
  }

  // Create action handlers that match the expected signature
  const qcActionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: () => {
      if (customHandlers.handleSave) {
        customHandlers.handleSave()
      } else {
        handleSaveCommon()
      }
    },
    [BUTTON_LABEL.CANCEL]: () => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) => handleQCSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleQCRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) => handleQCSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, qcActionHandlers, customHandlers.isDisabled, hideSaveButton)

  // Handle workflow permissions (access denied alerts and permission change notifications)
  useWorkflowPermissions({
    isLoading,
    permissions,
    buttonDetails,
    hasEditPermission,
    onPermissionChange,
  })

  return (
    <>
      <ButtonGroup buttons={buttonDetails ?? []} />
      
      <ReviewerModal
        reviewerlist={taskInfo?.reviewer_list ?? []}
        commentshistory={taskInfo?.task_comments ?? []}
        open={isQCReviewerModal}
        onClose={handleQCCloseReviewerModalCommon}
        mode={qcButtonName ?? ''}
        onSave={handleQCSaveWithFormData}
        isSaving={isSaving}
      />
    </>
  )
}

export default QCReviewerModalManager

