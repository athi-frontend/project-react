/**
 * Classification: Confidential
 */

import React, { useState, useEffect } from 'react'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP, STATUS } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { workflowAction } from '@/services/modules/common-workflow'
import { WorkflowActionData } from '@/types/common'
import { SalesReviewerModalManagerProps } from '@/types/modules/sales/reviewer'

const SalesReviewerModalManager: React.FC<SalesReviewerModalManagerProps & { module?: string }> = ({
  isLoading,
  taskInfo,
  permissions,
  menuId,
  menuName,
  customHandlers = {},
  onPermissionChange,
  contextType,
  contextId,
  refetch,
  hideSaveButton = false,
  module = 'sales' // Default to 'sales' for backward compatibility
}) => {
  const [isSalesReviewerModal, setIsSalesReviewerModal] = useState(false)
  const [salesButtonId, setSalesButtonId] = useState<number | null>(null)
  const [salesButtonName, setSalesButtonName] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)

  const handleSalesCloseReviewerModalCommon = () => {
    setIsSalesReviewerModal(false)
    setSalesButtonId(null)
    setIsSaving(false)
  }

  const handleSalesButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setSalesButtonId(trigger_status_id || null)
    setSalesButtonName(button_label)
    setIsSalesReviewerModal(true)
  }

  const handleSalesSubmitForReviewCommon = (trigger_status_id?: number) => {
    handleSalesButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleSalesButtonChangeCommon(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleSalesRejectCommon = (trigger_status_id?: number) => {
    handleSalesButtonChangeCommon(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleSalesSubmitApprovalCommon = (trigger_status_id?: number) => {
    handleSalesButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleSalesSaveWithFormData = async (comment: string, reviewer?: number) => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    
    const salesPayload: WorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      new_status_id: salesButtonId ?? NUMBERMAP.ZERO,
      comment: comment,
      menu_id: menuId ?? NUMBERMAP.ZERO,
      task_id: taskInfo?.task_id,
    }
    
    // Add reviewer field only for Submit for review
    if (salesButtonName === BUTTON_LABEL.SUBMIT_FOR_REVIEW && reviewer) {
      salesPayload.reviewer = Number(reviewer)
    }

    // Use POST for Save, PUT for other actions
    const isSaveAction = salesButtonName === BUTTON_LABEL.SAVE
    const method = isSaveAction ? 'POST' : 'PUT'

    try {
      await workflowAction(salesPayload, module, method)
      setIsSaving(false)
      handleSalesCloseReviewerModalCommon()
      showActionAlert(STATUS.SUCCESS)
      refetch?.() // Refetch workflow data to show updated buttons
    } catch {
      setIsSaving(false)
      handleSalesCloseReviewerModalCommon()
      showActionAlert(STATUS.FAILED)
    }
  }

  const handleSaveCommon = async () => {
    if (isSaveLoading) {
      return
    }
    setIsSaveLoading(true)
    
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

    try {
      await workflowAction(payload, module, 'POST')
      setIsSaveLoading(false)
      showActionAlert(STATUS.SUCCESS)
      refetch?.()
    } catch {
      setIsSaveLoading(false)
      showActionAlert(STATUS.FAILED)
    }
  }

  // Create action handlers that match the expected signature
  const salesActionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: () => {
      if (customHandlers.handleSave) {
        customHandlers.handleSave()
      } else {
        handleSaveCommon()
      }
    },
    [BUTTON_LABEL.CANCEL]: () => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) => handleSalesSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleSalesRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) => handleSalesSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, salesActionHandlers, isSaveLoading ?? customHandlers.isDisabled, hideSaveButton)

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && permissions.length === NUMBERMAP.ZERO && !buttonDetails && permissions !== undefined) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isLoading, permissions.length, buttonDetails])

  // Notify parent component about permission change
  useEffect(() => {
    onPermissionChange?.(hasEditPermission)
  }, [hasEditPermission, onPermissionChange])

  return (
    <>
      <ButtonGroup buttons={buttonDetails ?? []} />
      
      <ReviewerModal
        reviewerlist={taskInfo?.reviewer_list ?? []}
        commentshistory={taskInfo?.task_comments ?? []}
        open={isSalesReviewerModal}
        onClose={handleSalesCloseReviewerModalCommon}
        mode={salesButtonName ?? ''}
        onSave={handleSalesSaveWithFormData}
        isSaving={isSaving}
      />
    </>
  )
}

export default SalesReviewerModalManager

