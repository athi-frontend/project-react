'use client'
import React, { useState, useEffect ,useRef} from 'react'
import { InputField, MultiSelect, Label, showActionAlert } from '@/components/ui'
import UserWorkflowManager from './UserWorkflowManager'
import { FormErrors, UserRole } from '@/types/modules/user/userOnBoard'
import { Grid2 } from '@mui/material'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import {
  useRoles,
  useGroup,
  useDesignation,
  useResponsibility,
  useDepartment,
  useUpsertUser,
  useUserById,
} from '@/hooks/modules/user/useUserOnboard'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useRouter, useParams } from 'next/navigation'
import {
  CONTACT_NUMBER_FIELD,
  EMAIL_ID_FIELD,
  ONBOARDED_USER_ROUTE,
  FORMLABELS,
  FORMPLACEHOLDERS,
  FORMFIELDNAMES,
  KEYFIELDS,
  VALUEFIELDS,
  FormFieldKey,
  InputTypes,
  ROLE_FIELD,
  TABLESTRINGCONSTANTS,
  NEW_USER_ID,
  FORM_HEADER_LABELS,
  REGISTER_USER_ALERT,
  EMPTY_STRING
} from '@/constants/modules/user/userOnboard'
import {
  DEFAULT_FORM_DATA,
  EMAIL_REGEX,
  NUMERIC_REGEX,
  USER_REGISTRATION_ERROR_ITEMS,
} from '@/lib/modules/user/userOnboard'
import { NUMBERMAP } from '@/constants/common'
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import { useAllEmployees, useFetchEmployeeById } from "@/hooks/modules/hr/useEmployeeList";
import { formatValue } from '@/lib/utils/common'
import { validateFormFields } from '@/lib/utils/validateFormAndMapErrors'

/**
 * Classification: Confidential
 */

const UserRegistrationForm: React.FC = () => {
  // Added handler for Employee No. selection
  const handleEmployeeNoChange = (value: string) => {
    setEmployeeId(value)
    handleInputChange('employeeId' as FormFieldKey, value);
    if (!hasEditPermission) return;
  
  };

  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const isEditMode = (userId !== NEW_USER_ID && userId !== 'draft')

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [employeeId,setEmployeeId] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [hasEditPermission, setHasEditPermission] = useState(false)

  // LINT FIX: Use formData.employeeId instead of unknown variable
  const { data: employeeData } =
  useFetchEmployeeById(employeeId ? Number(employeeId) : NUMBERMAP.ZERO)

  const { data: employeeResponse, refetch: refetchEmployees } = useAllEmployees();

  useEffect(() => {
    refetchEmployees();
  }, []);

  const { data: rolesData } = useRoles()
  const { data: groupsData } = useGroup()
  const { data: designationData } = useDesignation()
  const { data: departmentData } = useDepartment()
  const { data: responsibilityData } = useResponsibility()
  const upsertUserMutation = useUpsertUser()
    const { data: userData, isLoading: isLoadingUserData, refetch: refetchUserData } = useUserById(userId, isEditMode)
  const isInitialLoad = useRef(true)
  // Get reviewer list from user data, return empty array if not available
  const reviewerList = userData?.meta_info?.task_info?.reviewer_list ?? []

  // Get permissions from API response and ensure view permission exists
  const apiPermissions = userData?.meta_info?.action_control?.permissions ?? []
  const permissions = apiPermissions.length > NUMBERMAP.ZERO && !apiPermissions.some((p: any) => p.action === 'view') 
    ? [{ action: 'view' }, ...apiPermissions] 
    : apiPermissions

  const { draftSave, clearDraftSave, isDraftSaving, draftData,fetchDraft  } = useDraftSave({
    context_type: 'user_onboarding',
    context_instance_id: (userId!='draft' && userId != NEW_USER_ID)?userId:null,
    enableFetch: !isEditMode
  })
  useEffect(() => {
    if ((userId==='draft'||userId===NEW_USER_ID)) {
      if(draftData?.data){ 
        updateFormData(draftData.data)
      }else{
        setFormData(DEFAULT_FORM_DATA)
        setErrors({})
      }
    }
  }, [draftData])
  const updateFormData = (user: any) => {
    const newFormData = {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      nickName: user?.nickName ?? '',
      emailId: user?.contact?.find(
        (c: any) => c.contact_type === TABLESTRINGCONSTANTS.CONTACT_TYPE_EMAIL
      )?.contact ?? '',
      contactNumber: user?.contact?.find(
        (c: any) => c.contact_type === TABLESTRINGCONSTANTS.CONTACT_TYPE_MOBILE
      )?.contact ?? '',
      department: user?.department_id ?? '',
      responsibility: user?.responsibility_id ?? '',
      designation: user?.designation_id ?? '',
      role: user?.roles?.map((r: UserRole) => (r.role_Id ?? r)) ?? [],
      groupName: user?.service_group_id ?? '',
      employeeId: user?.employeeId ?? '',
    }
    setEmployeeId(user.employeeId)
    setFormData((prev)=>({...prev,...newFormData}))
  }
  useEffect(() => {
    if (isEditMode && userData?.data) {
      const user = userData?.data[NUMBERMAP.ZERO]
      updateFormData(user)
    }
  }, [userData, isEditMode])
  useEffect(() => {
    isInitialLoad.current = false
    fetchDraft()
  }, [])

  const findDepartmentName = (departmentId: number) => {
    return departmentData?.data?.find((department: any) => department.department_id == departmentId)?.department_name
  }
  const findGroupName = (groupId: number) => {
    return groupsData?.data?.find((group: any) => group.group_id == groupId)?.group_name
  }
  const findDesignationName = (designationId: number) => {
    return designationData?.data?.find((designation: any) => designation.designation_id == designationId)?.designation
  }
  const findroleNames = (roles: string[] = []) => {
    return rolesData?.data?.filter((role: any) => roles.includes(role?.role_id))?.map((role: any) => role?.role_name)
  }
  const handleDraftSave = (formData: typeof DEFAULT_FORM_DATA) => {
    let contact = []
    if (formData.emailId) {
      contact.push({
        "contact": formData.emailId,
        contact_type: "email"
      })
    }
    if (formData.contactNumber) {
      contact.push({
        "contact": formData.contactNumber,
        contact_type: "mobile number"
      })
    }
    const payload = {
      project_id: isEditMode ? userId : null,
      form_data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickName: formData.nickName,
        employeeId:formData.employeeId,
        emailId: formData.emailId,
        contact_number: formData.contactNumber,
        department_id: formData.department ? Number(formData.department) : null,
        department_name: formData.department ? findDepartmentName(Number(formData.department)) : null,
        responsibility_id: formData.responsibility
          ? Number(formData.responsibility)
          : null,
        designation_id: formData.designation ? Number(formData.designation) : null,
        designation_name: formData.designation ? findDesignationName(Number(formData.designation)) : null,
        roles: formData.role.map(Number),
        role_names: findroleNames(formData.role??[]),
        service_group_id: formData.groupName ? Number(formData.groupName) : null,
        service_group_name: formData.groupName ? findGroupName(Number(formData.groupName)) : null,
        contact: contact,
        type: 'draft',
        status: NUMBERMAP.ONE,
      },
      timestamp: new Date().toISOString(),
    }

    draftSave(payload)
  }
  const handleFormDataChange = (field: FormFieldKey, value: string | string[] | number[]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value as string }
      if (!isInitialLoad.current) {
        handleDraftSave(updated)
      }
      return updated
    })
  }
  const handleInputChange = (field: FormFieldKey, value: string | string[]) => {
    if (!hasEditPermission) return;
    if (field === CONTACT_NUMBER_FIELD) {
      if (
        value === '' ||
        (NUMERIC_REGEX.test(value as string) && (value as string).length <= NUMBERMAP.TEN)
      ) {
        handleFormDataChange(field, value)
        setErrors((prev) => ({
          ...prev,
          [field]:
            (value as string).length === NUMBERMAP.TEN || value === ''
              ? undefined
              : prev[field],
        }))
      }
    } else if (field === EMAIL_ID_FIELD) {
      handleFormDataChange(field, value)
      if (EMAIL_REGEX.test(value as string)) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    } else if (field === ROLE_FIELD) {
      handleFormDataChange(field, value)
      if (Array.isArray(value) && value.length > NUMBERMAP.ZERO) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    } else {
      handleFormDataChange(field, value)
      if (value) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

const INITIAL_ERRORS = {
  firstName: '',
  lastName: '',
  nickName: '',
  emailId: '',
  department: '',
  responsibility: '',
  role: '',
  groupName: '',
  designation: '',
  contactNumber: '',
  employeeId: '',
};

  const validateForm = (): boolean => {
    const validationResult = validateFormFields(formData, USER_REGISTRATION_ERROR_ITEMS, INITIAL_ERRORS);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  }


  useEffect(() => {
    if (employeeData?.data && employeeData?.data?.length > NUMBERMAP.ZERO) {
      const empData = employeeData?.data[NUMBERMAP.ZERO]
      setFormData((prev) => ({
        ...prev,
        firstName: empData?.employee_first_name ?? '',
        lastName: empData?.employee_last_name ?? '',
        department: empData?.department_id ? String(empData?.department_id) : '',
        departmentName: empData?.department_name ?? '',
        employeeRole: empData?.role_name ?? '',
        // keep all other fields as is
      }));
    }
    if (!employeeId) {
      // Employee no is deselected, clear the fields
      setFormData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        department: '',
        departmentName: '',
        employeeRole: '',
      }));
    }
  }, [employeeData, employeeId])
  const handleFormSave = () => {
    if (!hasEditPermission) return;
    if (validateForm()) {
      clearDraftSave()
      const formattedData = {
        nick_name: formData.nickName,
        email: formData.emailId,
        contact_number: formData.contactNumber,
        emp_id: formData.employeeId?Number(formData.employeeId):null,
        responsibility: formData.responsibility
          ? Number(formData.responsibility)
          : null,
        roles: formData.role.map(Number),
        group_name: formData.groupName ? Number(formData.groupName) : null,
      }

      upsertUserMutation.mutate(
        isEditMode ? { id: userId, data: formattedData } : formattedData,
        {
          onSuccess: () => {
            // For new user creation, redirect to user list after successful save
            if (!isEditMode) {
              showActionAlert(REGISTER_USER_ALERT.NAME, {
                title: REGISTER_USER_ALERT.TITLE,
                text: REGISTER_USER_ALERT.TEXT,
                icon: REGISTER_USER_ALERT.ICON,
                cancelButton: false,
                confirmButton: false,
              });
              router.push(ONBOARDED_USER_ROUTE);
            }
          },
        }
      )
    }
  }

  const handleCancel = () => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    router.push(ONBOARDED_USER_ROUTE)
  }

  const handleWorkflowSuccess = async () => {
    // Refresh user data to get updated permissions and state
    await refetchUserData()
    
    // For new user creation, redirect to user list after successful workflow action
    if (!isEditMode) {
      showActionAlert(REGISTER_USER_ALERT.NAME, {
        title: REGISTER_USER_ALERT.TITLE,
        text: REGISTER_USER_ALERT.TEXT,
        icon: REGISTER_USER_ALERT.ICON,
        cancelButton: false,
        confirmButton: false,
      });
      router.push(ONBOARDED_USER_ROUTE);
    }
  }

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label
          title={
            FORM_HEADER_LABELS.EDIT
          }
        />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.EMPLOYEE_NO}
                placeholder={FORMPLACEHOLDERS.EMPLOYEE_NO}
                keyField={KEYFIELDS.EMPLOYEE_NO}
                valueField={VALUEFIELDS.EMPLOYEE_NO}
                isDropdown
                value={formData.employeeId}
                onChange={handleEmployeeNoChange}
                options={employeeResponse?.data ?? []}
                error={errors.employeeId}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}></Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InfoField label={FORMLABELS.FIRST_NAME} value={formatValue(formData.firstName)} />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InfoField label={FORMLABELS.LAST_NAME} value={formatValue(formData.lastName)} />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.NICK_NAME}
                placeholder={FORMPLACEHOLDERS.NICK_NAME}
                value={formData.nickName}
                onChange={(value: string) =>
                  handleInputChange(FORMFIELDNAMES.NICK_NAME as FormFieldKey, value)
                }
                error={errors.nickName}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.EMAIL_ID}
                placeholder={FORMPLACEHOLDERS.EMAIL_ID}
                value={formData.emailId}
                onChange={(value: string) =>
                  handleInputChange(FORMFIELDNAMES.EMAIL_ID as FormFieldKey, value)
                }
                error={errors.emailId}
                type={InputTypes.EMAIL}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.CONTACT_NUMBER}
                placeholder={FORMPLACEHOLDERS.CONTACT_NUMBER}
                value={formData.contactNumber}
                onChange={(value: string) =>
                  handleInputChange(FORMFIELDNAMES.CONTACT_NUMBER as FormFieldKey, value)
                }
                error={errors.contactNumber}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InfoField label={FORMLABELS.DEPARTMENT} value={formatValue(formData?.departmentName)} />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InfoField label={FORMLABELS.EMPLOYEE_ROLE} value={formatValue(formData?.employeeRole)} />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <MultiSelect
                label={FORMLABELS.ROLE}
                placeholder={FORMPLACEHOLDERS.ROLE}
                idField={KEYFIELDS.ROLE}
                valueField={VALUEFIELDS.ROLE}
                value={formData.role}
                onChange={(value: (string | number)[]) =>
                  handleInputChange(FORMFIELDNAMES.ROLE as FormFieldKey, value as string[])
                }
                options={rolesData?.data ?? []}
                error={errors.role ?? EMPTY_STRING}
                disabled={!hasEditPermission}
              />  
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
                label={FORMLABELS.RESPONSIBILITY}
                placeholder={FORMPLACEHOLDERS.RESPONSIBILITY}
                keyField={KEYFIELDS.RESPONSIBILITY}
                valueField={VALUEFIELDS.RESPONSIBILITY}
                isDropdown
                value={formData.responsibility}
                onChange={(value: string) =>
                  handleInputChange(FORMFIELDNAMES.RESPONSIBILITY as FormFieldKey, value)
                }
                options={responsibilityData?.data ?? []}
                error={errors.responsibility}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.GROUP_NAME}
                placeholder={FORMPLACEHOLDERS.GROUP_NAME}
                keyField={KEYFIELDS.GROUP_NAME}
                valueField={VALUEFIELDS.GROUP_NAME}
                isDropdown
                value={formData.groupName}
                onChange={(value: string) =>
                  handleInputChange(FORMFIELDNAMES.GROUP_NAME as FormFieldKey, value)
                }
                options={groupsData?.data ?? []}
                error={errors.groupName}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
            
          </Grid2>
          <UserWorkflowManager
            workflowType="onboarding"
            isLoading={isLoadingUserData}
            permissions={permissions}
            userId={userId=='draft'?NEW_USER_ID:userId}
            menuId={userData?.meta_info?.action_control?.menuId}
            menuName={userData?.meta_info?.action_control?.formName}
            taskId={userData?.meta_info?.task_info?.task_id}
            onPermissionChange={setHasEditPermission}
            onSuccess={handleWorkflowSuccess}
            customHandlers={{
              handleCancel: handleCancel,
              handleSave: handleFormSave,
              isDisabled: !hasEditPermission
            }}
            reviewerList={reviewerList}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default UserRegistrationForm
