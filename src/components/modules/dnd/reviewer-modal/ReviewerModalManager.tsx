import React, { useState, useEffect } from 'react'
import { ButtonGroup,showActionAlert } from '@/components/ui'
import { BUTTON_LABEL } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import ReviewerModal from './ReviewerModal'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { WorkflowActionData } from '@/types/common'
/**
      *Classification : Confidential
**/
interface ReviewerModalManagerProps {
  isLoading: boolean
  permissions: { action: string; trigger_status_id: number }[]
  projectId: string | number
  menuId?: number
  menuName?: string
  taskId?: number
  onSuccess?: () => void
  onError?: () => void
  customHandlers?: {
    handleCancel?: () => void
    handleSave?: () => void
    isDisabled?: boolean
  }
  onPermissionChange?: (hasEditPermission: boolean) => void
  reviewerList?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  hideSaveButton?: boolean
}

const ReviewerModalManager: React.FC<ReviewerModalManagerProps> = ({
  isLoading,
  permissions,
  projectId,
  menuId,
  menuName,
  taskId,
  onSuccess,
  onError,
  customHandlers = {},
  onPermissionChange,
  reviewerList,
  hideSaveButton = false,
}) => {
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const { mutate: saveReview } = useSubmitReview(menuName ?? '')

  const handleCloseReviewerModalCommon = () => {
    setIsReviewerModal(false)
    setButtonId(null)
  }

  const handleButtonChangeCommon = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }

  const handleSubmitForReviewCommon = (trigger_status_id?: number) => {
    handleButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveCommon = (trigger_status_id?: number) => {
    handleButtonChangeCommon(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleRejectCommon = (trigger_status_id?: number) => {
    handleButtonChangeCommon(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleSubmitApprovalCommon = (trigger_status_id?: number) => {
    handleButtonChangeCommon(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleSaveCommon = () => {
    // Find the Save action trigger_status_id from permissions
    const savePermission = permissions.find(permission => permission.action === BUTTON_LABEL.SAVE)
    const triggerStatusId = savePermission?.trigger_status_id ?? 0

    const payload: WorkflowActionData = {
      menu_id: menuId ?? 0,
      project_id: Number(projectId),
      new_status_id: triggerStatusId,
      comment: '',
      task_id: taskId,
    }

    saveReview(payload, {
      onSuccess: () => {
        onSuccess?.()
      },
      onError: () => {
        onError?.()
      },
    })
  }


  // Create action handlers that match the expected signature
  const actionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.SAVE]: () => {
      if (customHandlers.handleSave) {
        customHandlers.handleSave()
      } else {
        handleSaveCommon()
      }
    },
    [BUTTON_LABEL.CANCEL]: () => customHandlers.handleCancel?.(),
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: (id: number) => handleSubmitForReviewCommon(id),
    [BUTTON_LABEL.REJECT]: (id: number) => handleRejectCommon(id),
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: (id: number) => handleSubmitApprovalCommon(id),
    [BUTTON_LABEL.APPROVE]: (id: number) => handleApproveCommon(id),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, customHandlers.isDisabled, hideSaveButton)
  // Track when API has responded

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
  }, [!isLoading]);

  // Notify parent component about permission change
  useEffect(() => {
    onPermissionChange?.(hasEditPermission);
  }, [hasEditPermission, onPermissionChange]);

  return (
    <>
 <ButtonGroup buttons={buttonDetails ?? []} />
      
      <ReviewerModal
        open={isReviewerModal}
        onClose={handleCloseReviewerModalCommon}
        project_id={Number(projectId)}
        button_id={Number(buttonId)}
        mode={buttonName ?? '' }
        menu_id={Number(menuId)}
        menu_name={menuName ?? ''}
        task_id={taskId}
        reviewerList={reviewerList}
      />
    </>
  )
}

export default ReviewerModalManager 