import React, { useState, useEffect } from 'react'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { useSubmitWorkflowAction } from '@/hooks/modules/hr/useCommonReviewModal'
import { WorkflowActionData } from '@/types/common'

interface HRReviewerModalManagerProps {
  isLoading: boolean
  permissions: { action: string; trigger_status_id: number }[]
  taskInfo:{task_comments:[],reviewer_list:[]}
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
  departmentId: number
}

const HRReviewerModalManager: React.FC<HRReviewerModalManagerProps> = ({
  isLoading,
  taskInfo,
  permissions,
  menuId,
  menuName,
  customHandlers = {},
  onPermissionChange,
  contextType,
  contextId,
  departmentId
}) => {
  const [isHrReviewerModal, setIsHrReviewerModal] = useState(false)
  const [hrButtonId, setHrButtonId] = useState<number | null>(null)
  const [hrButtonName, setHrButtonName] = useState<string | null>(null)
  const { mutate: submitHrWorkflow } = useSubmitWorkflowAction(menuName)

  const handleHrCloseReviewerModalCommon = () => {
    setIsHrReviewerModal(false)
    setHrButtonId(null)
  }

  const handleHrButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setHrButtonId(trigger_status_id || null)
    setHrButtonName(button_label)
    setIsHrReviewerModal(true)
  }

  const handleHrSubmitForReviewCommon = (trigger_status_id?: number) => {
    handleHrButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleHrButtonChangeCommon(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleHrRejectCommon = (trigger_status_id?: number) => {
    handleHrButtonChangeCommon(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleHrSubmitApprovalCommon = (trigger_status_id?: number) => {
    handleHrButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleHrSaveWithFormData = (comment: string, reviewer?: number) => {
    const hrPayload: WorkflowActionData = {
      context_id: contextId,
      context_type: contextType,
      new_status_id: hrButtonId,
      comment: comment,
      menu_id: menuId,
      department: [departmentId] 
    }
    
    // Add reviewer field only for Submit for review
    if (hrButtonName === BUTTON_LABEL.SUBMIT_FOR_REVIEW && reviewer) {
      hrPayload.reviewer = Number(reviewer)
    }

    submitHrWorkflow(hrPayload, {
      onSuccess: () => {
        handleHrCloseReviewerModalCommon()
      },
      onError: () => {
        handleHrCloseReviewerModalCommon()
      },
    })
  }

  // Create action handlers that match the expected signature
  const hrActionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: (_id: number) => customHandlers.handleSave?.(),
    [BUTTON_LABEL.CANCEL]: (_id: number) => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) => handleHrSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleHrRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) => handleHrSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, hrActionHandlers)

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && permissions.length === 0 && !buttonDetails) {
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
        reviewerlist = {taskInfo?.reviewer_list??[]}
        commentshistory = {taskInfo?.task_comments??[]}
        open={isHrReviewerModal}
        onClose={handleHrCloseReviewerModalCommon}
        mode={hrButtonName ?? ''}
        onSave={handleHrSaveWithFormData}
      />
    </>
  )
}

export default HRReviewerModalManager 