'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
} from '@/components/ui'
import { useRoles, useEmployeesByRole } from '@/hooks/modules/dnd/useFormTeam'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import { MEMBERS_MODAL_CONSTANTS } from '@/constants/modules/dnd/designReviewReport'
import { STATUS_OPTIONS } from '@/constants/modules/sales/quotation'

/**
 * Classification : Confidential
 **/

interface MemberFormData {
  role_id: string
  member_name: string
  description: string
  status: string
}

interface MemberFormErrors {
  role_id: string
  member_name: string
  status: string
}

interface MembersAttendedModalProps {
  open: boolean
  onClose: () => void
  onSave: (memberData: any) => void
  editingData?: any
  hasEditPermission?: boolean
}

const INITIAL_FORM_DATA: MemberFormData = {
  role_id: '',
  member_name: '',
  description: '',
  status: '',
}

const INITIAL_ERRORS: MemberFormErrors = {
  role_id: '',
  member_name: '',
  status: '',
}

const MembersAttendedModal: React.FC<MembersAttendedModalProps> = ({
  open,
  onClose,
  onSave,
  editingData,
  hasEditPermission = true,
}) => {
  const { data: rolesData } = useRoles()
  const [memberFormData, setMemberFormData] = useState<MemberFormData>(INITIAL_FORM_DATA)
  const [memberFormErrors, setMemberFormErrors] = useState<MemberFormErrors>(INITIAL_ERRORS)
  const { data: employeesData } = useEmployeesByRole(
    memberFormData.role_id ? Number(memberFormData.role_id) : null
  )

  useEffect(() => {
    if (open) {
      if (editingData) {
        const roleId = editingData.role_id?.toString() ?? editingData.role?.toString() ?? ''
        setMemberFormData({
          ...editingData,
          role_id: roleId,
          member_name: '',
          status: editingData.status_id?.toString() ?? editingData.status?.toString() ?? '',
        })
      } else {
        setMemberFormData(INITIAL_FORM_DATA)
      }
      setMemberFormErrors(INITIAL_ERRORS)
    }
  }, [open, editingData])

  useEffect(() => {
    if (open && editingData && employeesData?.data && memberFormData.role_id) {
      const employeeId = editingData.employee_id ?? editingData.member_id
      const matchedEmployee = employeesData.data.find((emp: any) => 
        emp.employee_id?.toString() === employeeId?.toString() || emp.id?.toString() === employeeId?.toString()
      )
      if (matchedEmployee) {
        setMemberFormData(prev => ({
          ...prev,
          member_name: matchedEmployee.id?.toString() ?? '',
        }))
      }
    }
  }, [open, editingData, employeesData, memberFormData.role_id])

  const handleClose = () => {
    setMemberFormData(INITIAL_FORM_DATA)
    setMemberFormErrors(INITIAL_ERRORS)
    onClose()
  }

  const handleSave = () => {
    const newErrors: MemberFormErrors = {
      role_id: '',
      member_name: '',
      status: '',
    }
    let isValid = true
    
    if (!memberFormData.role_id) {
      newErrors.role_id = MEMBERS_MODAL_CONSTANTS.ROLE_ERROR
      isValid = false
    }
    
    if (!memberFormData.member_name) {
      newErrors.member_name = MEMBERS_MODAL_CONSTANTS.MEMBER_NAME_ERROR
      isValid = false
    }
    
    if (!memberFormData.status) {
      newErrors.status = MEMBERS_MODAL_CONSTANTS.STATUS_ERROR
      isValid = false
    }
    
    if (!isValid) {
      setMemberFormErrors(newErrors)
      return
    }
    
    const selectedUser = employeesData?.data?.find((u: any) => {
      const userId = u.id?.toString() ?? u.employee_id?.toString() ?? u.user_id?.toString() ?? ''
      return userId === memberFormData.member_name
    })
    
    const roleName = rolesData?.data?.find((r: any) => 
      r.role_id?.toString() === memberFormData.role_id || r.id?.toString() === memberFormData.role_id
    )?.role_name ?? ''
    
    const firstName = selectedUser?.first_name ?? selectedUser?.firstName ?? ''
    const lastName = selectedUser?.last_name ?? selectedUser?.lastName ?? ''
    const fullName = `${firstName} ${lastName}`.trim()
    const memberName = fullName ?? selectedUser?.employee_name ?? selectedUser?.name ?? ''
    
    const memberData = {
      id: editingData?.id ?? `temp-${Date.now()}`, // Generate unique id if not editing
      employee_id: selectedUser?.id,
      description: memberFormData.description ?? '',
      status_id: Number(memberFormData.status),
      // Keep these for display purposes in the table
      role_id: memberFormData.role_id,
      role_name: roleName,
      role: roleName, // Add role field for table display
      member_name: memberName ?? editingData?.member_name ?? '',
      // Also include firstName and lastName for API compatibility
      firstName: firstName,
      lastName: lastName,
    }
    
    onSave(memberData)
    handleClose()
  }

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={editingData ? MEMBERS_MODAL_CONSTANTS.EDIT : MEMBERS_MODAL_CONSTANTS.ADD}
      buttonRequired={false}
    >
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={MEMBERS_MODAL_CONSTANTS.ROLE_LABEL}
            placeholder={MEMBERS_MODAL_CONSTANTS.ROLE_PLACEHOLDER}
            isDropdown
            options={rolesData?.data ?? []}
            keyField={MEMBERS_MODAL_CONSTANTS.ROLE_KEY}
            valueField={MEMBERS_MODAL_CONSTANTS.ROLE_VALUE}
            value={memberFormData.role_id}
            onChange={(value: string) => {
              setMemberFormData(prev => ({ ...prev, role_id: value, member_name: '' }))
              if (memberFormErrors.role_id) {
                setMemberFormErrors(prev => ({ ...prev, role_id: '' }))
              }
            }}
            error={memberFormErrors.role_id}
            disabled={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={MEMBERS_MODAL_CONSTANTS.MEMBER_NAME_LABEL}
            placeholder={MEMBERS_MODAL_CONSTANTS.MEMBER_NAME_PLACEHOLDER}
            isDropdown={true}
            value={memberFormData.member_name}
            onChange={(value: string) => {
              setMemberFormData(prev => ({ ...prev, member_name: value }))
              if (memberFormErrors.member_name) {
                setMemberFormErrors(prev => ({ ...prev, member_name: '' }))
              }
            }}
            options={employeesData?.data ?? []}
            keyField={MEMBERS_MODAL_CONSTANTS.MEMBER_NAME_KEY}
            valueField={MEMBERS_MODAL_CONSTANTS.MEMBER_NAME_VALUE}
            error={memberFormErrors.member_name}
            disabled={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={MEMBERS_MODAL_CONSTANTS.DESCRIPTION_LABEL}
            placeholder={MEMBERS_MODAL_CONSTANTS.DESCRIPTION_PLACEHOLDER}
            value={memberFormData.description}
            onChange={(value: string) => {
              setMemberFormData(prev => ({ ...prev, description: value }))
            }}
            disabled={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={MEMBERS_MODAL_CONSTANTS.STATUS_LABEL}
            placeholder={MEMBERS_MODAL_CONSTANTS.STATUS_PLACEHOLDER}
            isDropdown
            options={STATUS_OPTIONS}
            keyField={MEMBERS_MODAL_CONSTANTS.STATUS_KEY}
            valueField={MEMBERS_MODAL_CONSTANTS.STATUS_VALUE}
            value={memberFormData.status}
            onChange={(value: string) => {
              setMemberFormData(prev => ({ ...prev, status: value }))
              if (memberFormErrors.status) {
                setMemberFormErrors(prev => ({ ...prev, status: '' }))
              }
            }}
            error={memberFormErrors.status}
            disabled={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <ButtonGroup
            buttons={[
              {
                label: BUTTON_LABEL.CANCEL,
                onClick: handleClose,
              },
              {
                label: BUTTON_LABEL.SAVE,
                onClick: handleSave,
                disabled: !hasEditPermission,
              },
            ]}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default MembersAttendedModal

