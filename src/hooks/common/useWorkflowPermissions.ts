/**
 * Classification: Confidential
 */

import { useEffect } from 'react'
import { showActionAlert } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { QUERYCONSTANTS } from '@/lib/utils/common'
import { UseWorkflowPermissionsParams } from '@/types/common'

/**
 * Custom hook to handle workflow permission logic
 * Extracts duplicate code for permission access denied alerts and permission change notifications
 */
export const useWorkflowPermissions = ({
  isLoading,
  permissions,
  buttonDetails,
  hasEditPermission,
  onPermissionChange,
}: UseWorkflowPermissionsParams) => {
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
}

