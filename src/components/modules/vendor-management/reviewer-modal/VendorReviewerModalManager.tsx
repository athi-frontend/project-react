import React, { useState, useEffect } from 'react'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP, STATUS } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { useVendorWorkflowActionUpdate } from '@/hooks/modules/vendor-management/useWorkflowAction'
import { VendorWorkflowActionData } from '@/types/modules/vendor-management/workflowAction'

/**
 * Workflow action handler for vendor management modules
 * Classification: Confidential
 */

interface VendorReviewerModalManagerProps {
  isLoading: boolean
  permissions: { action: string; trigger_status_id?: number }[]
  taskInfo: { task_comments: any[]; reviewer_list: any[] }
  menuId?: number
  menuName?: string
  taskId?: number
  customHandlers?: {
    handleCancel?: () => void
    handleSave?: () => void
    isDisabled?: boolean
  }
  onPermissionChange?: (hasEditPermission: boolean) => void
  contextType: string
  contextId: number
  refetch?: () => void
  hideSaveButton?: boolean
}

const VendorReviewerModalManager: React.FC<VendorReviewerModalManagerProps> = ({
  isLoading,
  taskInfo,
  permissions,
  menuId,
  menuName,
  taskId,
  customHandlers = {},
  onPermissionChange,
  contextType,
  contextId,
  refetch,
  hideSaveButton = false
}) => {
  const [isVendorReviewerModal, setIsVendorReviewerModal] = useState(false)
  const [vendorButtonId, setVendorButtonId] = useState<number | null>(null)
  const [vendorButtonName, setVendorButtonName] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { mutate: submitVendorWorkflow } = useVendorWorkflowActionUpdate(menuName)

  const handleVendorCloseReviewerModalCommon = () => {
    setIsVendorReviewerModal(false)
    setVendorButtonId(null)
    setIsSaving(false)
  }

  const handleVendorButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setVendorButtonId(trigger_status_id || null)
    setVendorButtonName(button_label)
    setIsVendorReviewerModal(true)
  }

  const handleVendorSubmitForReviewCommon = (trigger_status_id?: number) => {
    handleVendorButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleVendorButtonChangeCommon(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleVendorRejectCommon = (trigger_status_id?: number) => {
    handleVendorButtonChangeCommon(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleVendorSubmitApprovalCommon = (trigger_status_id?: number) => {
    handleVendorButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleVendorSaveWithFormData = (comment: string, reviewer?: number) => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    const vendorPayload: VendorWorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      new_status_id: vendorButtonId ?? undefined,
      comment: comment,
      menu_id: menuId,
      task_id: taskId
    }

    submitVendorWorkflow(vendorPayload, {
      onSuccess: () => {
        setIsSaving(false)
        handleVendorCloseReviewerModalCommon()
        refetch?.()
      },
      onError: () => {
        setIsSaving(false)
        handleVendorCloseReviewerModalCommon()
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const vendorActionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: (_id: number) => customHandlers.handleSave?.(),
    [BUTTON_LABEL.CANCEL]: (_id: number) => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) => handleVendorSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleVendorRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) => handleVendorSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, vendorActionHandlers, customHandlers.isDisabled, hideSaveButton)

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

  useEffect(() => {
    onPermissionChange?.(hasEditPermission);
  }, [hasEditPermission, onPermissionChange]);

  return (
    <>
      <ButtonGroup buttons={buttonDetails ?? []} />
      
      <ReviewerModal
        reviewerlist={taskInfo?.reviewer_list ?? []}
        commentshistory={taskInfo?.task_comments ?? []}
        open={isVendorReviewerModal}
        onClose={handleVendorCloseReviewerModalCommon}
        mode={vendorButtonName ?? ''}
        onSave={handleVendorSaveWithFormData}
        isSaving={isSaving}
      />
    </>
  )
}

export default VendorReviewerModalManager

