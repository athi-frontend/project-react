import React, { useState, useEffect } from 'react'
import { selectMenuData, useAppSelector } from '@/store/slices/menuSlice'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP } from '@/constants/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import { getUserProfilePictureMenuId } from '@/utils/modules/user/profileUtils'
import ReviewerModal from '@/components/modules/common/reviewer-modal/ReviewerModal'
import { useUserProfilePictureWorkflowAction, useUserAccessMenuData } from '@/hooks/modules/user/useSetting'
import { useUserOnboardWorkflowAction } from '@/hooks/modules/user/useUserOnboard'
import { WorkflowActionData } from '@/types/modules/user/userOnBoard'
import { UserWorkflowManagerProps } from '@/types/modules/user/shared'
import { CONTEXT_TYPES } from '@/constants/modules/user/setting'
import { NEW_USER_ID, PERMISSION_ACTIONS } from '@/constants/modules/user/userOnboard'

/**
*Classification : Confidential
**/



/**
 * User Workflow Manager
 * Generic component for handling user-related workflow actions (profile picture, onboarding)
 * Classification: security
 */

const UserWorkflowManager: React.FC<UserWorkflowManagerProps> = ({
  workflowType,
  isLoading,
  permissions,
  userId,
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

  // Get menu data from store
  const menuData = useAppSelector(selectMenuData)

  // Use appropriate workflow action hook based on workflow type
  const { mutate: submitProfilePictureWorkflowAction } = useUserProfilePictureWorkflowAction()
  const { mutate: submitOnboardingWorkflowAction } = useUserOnboardWorkflowAction()
  
  // Get dynamic menu ID for profile picture workflow
  const getProfilePictureMenuId = () => {
    if (menuId) return menuId
    if (workflowType === 'profile-picture') {
      return getUserProfilePictureMenuId(menuData) ?? NUMBERMAP.ZERO
    }
    return NUMBERMAP.ZERO
  }

  const profilePictureMenuId = getProfilePictureMenuId()
  
  // Get menu data for profile picture workflow
  const { data: userAccessMenuData } = useUserAccessMenuData(profilePictureMenuId)

  const handleCloseReviewerModal = () => {
    setIsReviewerModal(false)
    setButtonId(null)
  }

  const handleButtonChange = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id ?? null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }

  const handleSubmitForReview = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApprove = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleReject = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleSubmitApproval = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.SUBMIT_FOR_APPROVAL, trigger_status_id)
  }

  const handleWorkflowSave = (comment: string, reviewer?: number) => {
    const basePayload = {
      context_id: Number(userId),
      context_type: CONTEXT_TYPES.USER_ONBOARDING,
      new_status_id: buttonId ?? NUMBERMAP.ZERO,
      comment: comment,
    }

    if (workflowType === 'profile-picture') {
      const workflowPayload: any = {
        ...basePayload,
        menu_id: userAccessMenuData?.menu_id ?? profilePictureMenuId,
      }
      
      // Add reviewer field only for Submit for review
      if (buttonName === BUTTON_LABEL.SUBMIT_FOR_REVIEW && reviewer) {
        workflowPayload.reviewer = Number(reviewer)
      }

      submitProfilePictureWorkflowAction(workflowPayload, {
        onSuccess: () => {
          handleCloseReviewerModal()
          onSuccess?.()
        },
        onError: () => {
          handleCloseReviewerModal()
          onError?.()
        },
      })
    } else {
      const userOnboardPayload: WorkflowActionData & { reviewer?: number } = {
        context_id: Number(userId),
        context_type: CONTEXT_TYPES.USER_ONBOARDING,
        new_status_id: buttonId ?? NUMBERMAP.ZERO,
        comment: comment,
        menu_id: menuId ?? NUMBERMAP.ZERO,
      }
      
      // Add reviewer field only for Submit for review
      if (buttonName === BUTTON_LABEL.SUBMIT_FOR_REVIEW && reviewer) {
        userOnboardPayload.reviewer = Number(reviewer)
      }

      submitOnboardingWorkflowAction(userOnboardPayload, {
        onSuccess: () => {
          handleCloseReviewerModal()
          onSuccess?.()
        },
        onError: () => {
          handleCloseReviewerModal()
          onError?.()
        },
      })
    }
  }

  // Create action handlers based on workflow type
  const getActionHandlers = (): Record<string, (id: number) => void> => {
    const baseHandlers: Record<string, (id: number) => void> = {
      [BUTTON_LABEL.SAVE]: (_id: number) => customHandlers.handleSave?.(),
      [BUTTON_LABEL.CANCEL]: (_id: number) => customHandlers.handleCancel?.(),
      [BUTTON_LABEL.REJECT]: (id: number) => handleReject(id),
      [BUTTON_LABEL.APPROVE]: (id: number) => handleApprove(id),
    }

    // Add onboarding-specific handlers
    if (workflowType === 'onboarding') {
      baseHandlers[BUTTON_LABEL.SUBMIT_FOR_REVIEW] = (id: number) => handleSubmitForReview(id)
      baseHandlers[BUTTON_LABEL.SUBMIT_FOR_APPROVAL] = (id: number) => handleSubmitApproval(id)
    }

    return baseHandlers
  }

  // Process permissions based on workflow type
  const getProcessedPermissions = () => {
    const isCreateMode = workflowType === 'onboarding' && userId === NEW_USER_ID
    let processedPermissions

    if (workflowType === 'profile-picture' && permissions.length === NUMBERMAP.ZERO) {
      // Provide default permissions for profile picture review
      processedPermissions = [
        { action: 'view', trigger_status_id: NUMBERMAP.ZERO },
        { action: 'approve', trigger_status_id: NUMBERMAP.ONE },
        { action: 'reject', trigger_status_id: NUMBERMAP.TWO },
      ]
    } else if (isCreateMode && permissions.length === NUMBERMAP.ZERO) {
      // Provide default permissions for create mode
      processedPermissions = [
        { action: PERMISSION_ACTIONS.VIEW, trigger_status_id: NUMBERMAP.ZERO },
        { action: PERMISSION_ACTIONS.SAVE, trigger_status_id: NUMBERMAP.ZERO },
        { action: PERMISSION_ACTIONS.CANCEL, trigger_status_id: NUMBERMAP.ZERO }
      ]
    } else {
      processedPermissions = permissions
    }

    return processedPermissions
  }

  const actionHandlers = getActionHandlers()
  const processedPermissions = getProcessedPermissions()

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(processedPermissions, actionHandlers, customHandlers.isDisabled, hideSaveButton)

  // Permission access denied logic - only show after API has responded
  useEffect(() => {
    if (!isLoading && processedPermissions.length === NUMBERMAP.ZERO && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [isLoading, processedPermissions.length, buttonDetails])

  // Notify parent component about permission change
  useEffect(() => {
    onPermissionChange?.(hasEditPermission)
  }, [hasEditPermission, onPermissionChange])

  return (
    <>
      <ButtonGroup buttons={buttonDetails ?? []} />
      
      <ReviewerModal
        open={isReviewerModal}
        onClose={handleCloseReviewerModal}
        mode={buttonName ?? ''}
        onSave={handleWorkflowSave}
        reviewerlist={workflowType === 'onboarding' ? reviewerList ?? [] : []}
        commentshistory={[]}
        hideReviewer={true}
      />
    </>
  )
}

export default UserWorkflowManager
