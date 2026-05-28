'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  InputField,
  ButtonGroup,
  Description,
  Label,
  showActionAlert,
} from '@/components/ui'
import { Grid2} from '@mui/material'
import { useRouter, useParams } from 'next/navigation'
import {
  FORMLABELS,
  FORMPLACEHOLDERS,
  FORMFIELDNAMES,
  KEYFIELDS,
  VALUEFIELDS,
  BUTTONLABELS,
  RECRUITMENT_LIST_ROUTE,
  BUTTON_VARIANTS,
  FORM_HEADER,
  EDIT_RECRUITMENT,
  FORM_ID,
  DATA_SOURCE_NAME,
  DESCRIPTION,
  RECRUITMENT_TYPE,
  ROLES_ID,
  OPENINGS,
  ONBOARD_BY,
  ESTIMATED_CTC,
  RESOURCE_REQUIRED,
  INSERT,
  UPDATE,
  ENTER_DESC,
  REASON,
  RESOURCE_REQUISITION_CONSTANTS,
} from '@/constants/modules/hr/resourceRequisition'
import {
  DEFAULT_FORM_DATA,
  ERROR_MESSAGES,
  NUMERIC_REGEX,
  REQUIRED_FIELDS,
} from '@/lib/modules/hr/resourceRequisition'
import {
  RecruitmentFormData,
  FormErrors,
  FormFieldKey,
  FormFieldValue,
} from '@/types/modules/hr/resourceRequistion'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { magicFormSave } from '@/lib/utils/magicSave'
import {
  useRecruitmentById,
  useRecruitmentTypes,
  useResourceRequiredTypes,
  useRoles,
} from '@/hooks/modules/hr/useResourceRequistion'
import { useGetCompetencySkillByRoleId } from '@/hooks/modules/hr/useRoleDefinition'
import magicSaveConstants from '@/constants/magicSave'
import { NUMBERMAP } from '@/constants/common'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs from 'dayjs'
import { InputLabel } from '@/styles/components/ui/input'
import { Add } from 'iconsax-react'
import { useTheme } from '@mui/material/styles'
import { COMMON_CONSTANTS, formatDateForAPI, formatValue } from '@/lib/utils/common'
import { Value } from '@/styles/components/modules/projectInfo'
import { useSaveWorkflowAction } from '@/hooks/modules/hr/useCommonReviewModal'
import { HRReviewerModalManager } from '../reviewer-modal'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

  /**
      *Classification : Confidential
  **/
 
const { EMPTY_ARRAY_LENGTH, SUCCESS_ALERT, FAILED_ALERT, SUCCESS_CODE } =
  COMMON_CONSTANTS

const RecruitmentForm: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const formRef = useRef<HTMLElement>(null)
  const [formData, setFormData] =
    useState<RecruitmentFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const theme = useTheme();
  const id = params.id as string
  const isEditMode = id !== 'create' && !isNaN(Number(id))
  const dynamicId = isEditMode ? Number(id) : null
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const { draftSave, clearDraftSave, isDraftSaving ,draftData, fetchDraft,checkUnsavedDraftBeforeLeave} = useDraftSave({
    context_type: 'resource_requisition',
    context_instance_id: isEditMode?dynamicId:null,
    enableFetch:true
  })
  const {
    data: recruitmentData,
    refetch,
    isLoading: isLoadingRecruitment,
  } = useRecruitmentById(id=='create'?null:id)

  const { data: competencySkillData, refetch: refetchCompetencySkill } =
    useGetCompetencySkillByRoleId(formData.role ?? '')
  const { mutate: submitWorkflow } = useSaveWorkflowAction(recruitmentData?.action_control?.formName)
  useEffect(() => {
    refetch()
  }, [id])

  const {
    data: recruitmentTypeOptions,
    isLoading: isLoadingRecruitmentTypes,
    error: recruitmentTypesError,
  } = useRecruitmentTypes()
  const {
    data: resourceOptions = [],
    isLoading: isLoadingResourceRequired,
    error: resourceRequiredError,
  } = useResourceRequiredTypes()
  const {
    data: roleOptions = [],
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useRoles()

  useEffect(() => {
    if (
      isEditMode &&
      recruitmentData?.data &&
      recruitmentData.data.length > EMPTY_ARRAY_LENGTH
    ) {
    
      const item = recruitmentData.data[NUMBERMAP.ZERO]
      const formattedOnboardDate = item.onboard_date ?? ''
      const result = {
        resourceRequired: item.resource_required_type_id?.toString() ?? '',
        product: item.product_id?.toString() ?? '',
        reasonForRecruitment: item.reason ?? '',
        reportsToRoleId: item.report_to_role_id?.toString() ?? '',
        estimatedCTC: item.estimated_cost_to_company?.toString() ?? '',
        onboardBy: formattedOnboardDate,
        openings: item.number_of_openings?.toString() ?? '',
        role: item.role_id?.toString() ?? '',
        departmentId: item.department_id?.toString() ?? '',
        recruitmentType: item.recruitment_type_id?.toString() ?? '',
        description: item.description ?? '',
      }
      setFormData((prev)=>({...prev,...result}))
    }
  }, [isEditMode, recruitmentData])

  useEffect(()=>{
    if(draftData?.data){
        setFormData(draftData.data)
    }
  },[draftData])
  useEffect(() => {
      setIsInitialLoad(false)
  }, [])

  useEffect(() => {
    if (formData.role) {
      refetchCompetencySkill()
    }
  }, [formData.role, refetchCompetencySkill])

  useEffect(() => {
    if (
      competencySkillData?.data &&
      competencySkillData.data.length > EMPTY_ARRAY_LENGTH
    ) {
      const {
        department_name,
        report_to_role_name,
        department_id,
        report_to_role_id,
      } = competencySkillData.data[NUMBERMAP.ZERO]

      const departmentName = department_name ?? ''
      const userName = report_to_role_name ?? ''
      const departmentId = department_id ?? NUMBERMAP.ZERO
      const userId = report_to_role_id ?? NUMBERMAP.ZERO

      setFormData((prev) => ({
        ...prev,
        department: departmentName,
        reportsTo: userName,
        departmentId: departmentId,
        reportsToRoleId: userId,
      }))

      clearErrorIfValid(FORMFIELDNAMES.DEPARTMENT, departmentName)
      clearErrorIfValid(FORMFIELDNAMES.REPORTS_TO, userName)
    } else {
      setFormData((prev) => ({
        ...prev,
        department: '',
        reportsTo: '',
        departmentId: NUMBERMAP.ZERO,
        reportsToRoleId: NUMBERMAP.ZERO,
      }))
    }
  }, [competencySkillData])

  useEffect(() => {
    fetchDraft()
  }, [])

  const handleInputChange = (field: FormFieldKey, value: FormFieldValue) => {
    if(!hasEditPermission) return ;
    const processedValue = processInputValue(field, value)
    setFormData((prev) => {
      const updated = { ...prev, [field]: processedValue }
      if (!isInitialLoad) {
        handleDraftSave(updated)
      }
      return updated
    })
    clearErrorIfValid(field, processedValue as FormFieldValue)
  }

  const getRoleName = (roleId: string) => {
    return roleOptions?.data?.find(role =>
      role.role_id == roleId
    )?.role_name?? roleId;
  }
  const handleDraftSave = (formData: RecruitmentFormData) => {
    const payload = {
      resource_requisition_id: dynamicId ?? new Date().getTime(),
      resourceRequired: formData.resourceRequired,
      product: formData.product,
      reasonForRecruitment: formData.reasonForRecruitment,
      reportsToRoleId: formData.reportsToRoleId,
      estimatedCTC: formData.estimatedCTC,
      onboardBy: formData.onboardBy,
      openings: formData.openings,
      role: formData.role,
      role_name: getRoleName(formData.role),
      departmentId: formData.departmentId,
      department_name: formData.department,
      recruitmentType: formData.recruitmentType,
      description: formData.description,
      type: 'draft',
      status: NUMBERMAP.ONE
    }
    
    draftSave({
      form_type: 'resource_requisition',
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const processInputValue = (field: FormFieldKey, value: FormFieldValue) => {
    if (
      field === FORMFIELDNAMES.DESCRIPTION ||
      field === FORMFIELDNAMES.REASON_FOR_RECRUITMENT
    ) {
      return value !== null && value !== undefined ? String(value) : ''
    }
    if (
      field === FORMFIELDNAMES.OPENINGS ||
      field === FORMFIELDNAMES.ESTIMATED_CTC
    ) {
      return processNumericField(value, field)
    }
    if (field === FORMFIELDNAMES.ONBOARD_BY) {
      return value !== null && value !== undefined ? String(value) : ''
    }
    return processDropdownOrNumericField(value)
  }

  const processNumericField = (
    value: FormFieldValue,
    field: FormFieldKey
  ): FormFieldValue => {
    if (
      value === '' ||
      (typeof value === 'string' && NUMERIC_REGEX.test(value))
    ) {
      return String(value)
    }
    return field === FORMFIELDNAMES.OPENINGS
      ? formData.openings
      : formData.estimatedCTC
  }

  const processDropdownOrNumericField = (value: FormFieldValue) => {
    if (value === null || value === undefined || value === '') {
      return null
    }
    if (Array.isArray(value)) {
      return value.map(Number)
    }
    return Number(value)
  }

  const clearErrorIfValid = (field: FormFieldKey, value: FormFieldValue) => {
    if (value !== null && value !== undefined && value !== '') {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

const validateForm = (): boolean => {
  const newErrors: FormErrors = {}

  REQUIRED_FIELDS.forEach((field) => {
    const value = formData[field as FormFieldKey]
    const trimmedValue = value?.toString().trim()
    if (!trimmedValue) {
      newErrors[field] =
        ERROR_MESSAGES[field as keyof typeof ERROR_MESSAGES] ??
        `${field} is required`
    }
  })

  if (formData.openings && !NUMERIC_REGEX.test(formData.openings.toString())) {
    newErrors.openings = ERROR_MESSAGES.invalidOpenings
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === EMPTY_ARRAY_LENGTH
}
const handleSave = async () => {
  if (!validateForm() || isSaving || !hasEditPermission) return;

  if (!formRef.current) {
    setIsSaving(false); 
    return;
  }

  // Clear draft save when submitting final form
  clearDraftSave();

  setIsSaving(true);
  const operationType = isEditMode ? UPDATE : INSERT;
  const otherParams = {
    eqms_hr_resource_requisition: {
      status: NUMBERMAP.ONE,
    },
  };
  const keys = isEditMode
    ? {
        eqms_hr_resource_requisition: {
          id: dynamicId,
        },
      }
    : {};

  try {
    const response = await magicFormSave({
      currentFormRef: formRef,
      dataframeworkOperatorType: operationType,
      dataframeworkOtherParamsBag: otherParams,
      keys: keys,
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
    });
    if (response.response.code === SUCCESS_CODE) {
      // Get the resource requisition ID from the response
      const resourceRequisitionId = response.response.data?.[0]?.eqms_hr_resource_requisition?.[0]?.id
      if (resourceRequisitionId && formData.departmentId) {
        submitWorkflow({
          context_type: RESOURCE_REQUISITION_CONSTANTS.CONTEXT_TYPE,
          department: [Number(formData.departmentId)],
          context_id: resourceRequisitionId
        }, {
          onSuccess: () => {
            showActionAlert(SUCCESS_ALERT);
            fetchDraft()
            handleCancel()
          },
          onError: () => {
            showActionAlert(FAILED_ALERT)
          }
        })
      }
      else {
        showActionAlert(SUCCESS_ALERT);
      }
    } else {
      showActionAlert(FAILED_ALERT);
    }
  } catch (error) {
    showActionAlert('customAlert', {
      title: 'Error',
      text: String(error),
      icon: 'error',
      cancelButton: false,
      confirmButton: false,
    });
  } finally {
    setIsSaving(false); 
  }
};

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    router.push(RECRUITMENT_LIST_ROUTE)
  }

  const formTitle = isEditMode ? EDIT_RECRUITMENT : FORM_HEADER

  return (
    <FormContainer id={FORM_ID} ref={formRef}>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isLoadingRecruitment} />
      <FormWrapper>
        <Label title={formTitle} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} >
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.ROLE}
                placeholder={FORMPLACEHOLDERS.ROLE}
                keyField={KEYFIELDS.ROLE}
                valueField={VALUEFIELDS.ROLE}
                isDropdown
                value={formData.role ?? ''}
                onChange={(value: FormFieldValue) =>
                  handleInputChange(FORMFIELDNAMES.ROLE, value)
                }
                options={rolesError ? [] : roleOptions?.data}
                error={errors.role}
                disabled={isLoadingRecruitment ?? isLoadingRoles}
                dataSourceName={DATA_SOURCE_NAME}
                hasEditable={!hasEditPermission}
                dataFieldName={ROLES_ID}
                dataIsAutocomplete={formData.role}
               icon={<Add size={NUMBERMAP.EIGHTEEN} color={theme.palette.text.secondary} />}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.RESOURCE_REQUIRED}
                placeholder={FORMPLACEHOLDERS.RESOURCE_REQUIRED}
                keyField={KEYFIELDS.RESOURCE_REQUIRED}
                valueField={VALUEFIELDS.RESOURCE_REQUIRED}
                isDropdown
                value={formData.resourceRequired ?? ''}
                onChange={(value: FormFieldValue) =>
                  handleInputChange(FORMFIELDNAMES.RESOURCE_REQUIRED, value)
                }
                options={resourceRequiredError ? [] : resourceOptions?.data}
                error={errors.resourceRequired}
                disabled={isLoadingRecruitment ?? isLoadingResourceRequired}
                hasEditable={!hasEditPermission}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={RESOURCE_REQUIRED}
                dataIsAutocomplete={formData.resourceRequired}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.REASON_FOR_RECRUITMENT}
                placeholder={FORMPLACEHOLDERS.REASON_FOR_RECRUITMENT}
                value={formData.reasonForRecruitment ?? ''}
                onChange={(value: FormFieldValue) =>
                  handleInputChange(
                    FORMFIELDNAMES.REASON_FOR_RECRUITMENT,
                    value
                  )
                }
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={REASON}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.ESTIMATED_CTC}
                placeholder={FORMPLACEHOLDERS.ESTIMATED_CTC}
                value={formData.estimatedCTC ?? ''}
                onChange={(value: FormFieldValue) =>
                  handleInputChange(FORMFIELDNAMES.ESTIMATED_CTC, value)
                }
                error={errors.estimatedCTC}
                disabled={isLoadingRecruitment}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={ESTIMATED_CTC}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputLabel>{FORMLABELS.REPORTS_TO}</InputLabel>
              <Value>{formatValue(formData.reportsTo)}</Value>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputLabel>{FORMLABELS.DEPARTMENT}</InputLabel>
               <Value>{formatValue(formData.department)}</Value>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={FORMLABELS.ONBOARD_BY}
                value={formData.onboardBy ? dayjs(formData.onboardBy) : null}
                onChange={(value) => {
                  handleInputChange(FORMFIELDNAMES.ONBOARD_BY, value)
                }}
                error={errors.onboardBy ?? ''}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={ONBOARD_BY}
                dataIsAutocomplete={formatDateForAPI(formData.onboardBy)}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.OPENINGS}
                placeholder={FORMPLACEHOLDERS.OPENINGS}
                value={formData.openings ?? ''}
                onChange={(value: FormFieldValue) =>
                  handleInputChange(FORMFIELDNAMES.OPENINGS, value)
                }
                error={errors.openings}
                disabled={isLoadingRecruitment}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={OPENINGS}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORMLABELS.RECRUITMENT_TYPE}
                placeholder={FORMPLACEHOLDERS.RECRUITMENT_TYPE}
                keyField={KEYFIELDS.RECRUITMENT_TYPE}
                valueField={VALUEFIELDS.RECRUITMENT_TYPE}
                isDropdown
                value={formData.recruitmentType ?? ''}
                onChange={(value: FormFieldValue) =>
                  handleInputChange(FORMFIELDNAMES.RECRUITMENT_TYPE, value)
                }
                options={
                  recruitmentTypesError ? [] : recruitmentTypeOptions?.data
                }
                error={errors.recruitmentType}
                disabled={isLoadingRecruitment ?? isLoadingRecruitmentTypes}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={RECRUITMENT_TYPE}
                hasEditable={!hasEditPermission}
                dataIsAutocomplete={formData.recruitmentType}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                value={formData.description}
                label={FORMLABELS.DESCRIPTION ?? ''}
                onChange={(value) =>
                  handleInputChange(FORMFIELDNAMES.DESCRIPTION, value)
                }
                error={errors.description}
                disabled={isLoadingRecruitment}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={DESCRIPTION}
                placeholder={ENTER_DESC}
              />
            </Grid2>
          </Grid2>
          {!isEditMode ? (
            <ButtonGroup
              buttons={[
                {
                  label: BUTTONLABELS.CANCEL,
                  onClick: handleCancel,
                  variant: BUTTON_VARIANTS.OUTLINED,
                },
                {
                  label: BUTTONLABELS.SAVE,
                  onClick: handleSave,
                  variant: BUTTON_VARIANTS.CONTAINED,
                  disabled: isSaving ?? isLoadingRecruitment,
                },
              ]}
            />
          ) : (
            <HRReviewerModalManager
              isLoading={isLoadingRecruitment}
              taskInfo={recruitmentData?.meta_info?.task_info}
              permissions={recruitmentData?.meta_info?.action_control?.permissions ?? []}
              menuId={recruitmentData?.meta_info?.action_control?.menuId}
              menuName={recruitmentData?.meta_info?.action_control?.formName}
              onPermissionChange={setHasEditPermission}
              customHandlers={{
                handleCancel,
                handleSave,
                isDisabled: isSaving ?? isLoadingRecruitment,
              }}
              contextType={RESOURCE_REQUISITION_CONSTANTS.CONTEXT_TYPE}
              contextId={dynamicId}
              departmentId={Number(formData?.departmentId)}
            />
          )}
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default RecruitmentForm
