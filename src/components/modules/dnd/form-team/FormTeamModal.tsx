/**
 * Classification: Confidential
 */
'use client'
import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'

import {
  InputField,
  ButtonGroup,
  RichTextEditor,
  showActionAlert,
} from '@/components/ui'
import {
  useEmployeesByRole,
  useStages,
  useSaveTeam,
  useUpdateTeam,
  useRoles,
} from '@/hooks/modules/dnd/useFormTeam'

import { useParams } from 'next/navigation'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import { FormContainer } from '@/styles/modules/dnd/project'
import { ErrorText } from '@/styles/common'
import {
  FORM_MODAL_CONSTANTS,
  DEFAULT_FORM_TEAM_DATA,
  OTHERS,
  DATE_FORMAT,
  FORM_DESIGN,
  OVERFLOW,
  COMMON_CONSTANTS,
  getStatusDisplay,
  FIELD_CONFIGS,
  ICON_NEW,
  ICON_NEWERROR,
} from '@/constants/modules/dnd/formTeam'
import {
  FormContentWrapper,
  FieldContainer,
} from '@/styles/modules/dnd/formTeam'
import { FormData, FormTeamProps } from '@/types/modules/dnd/formTeam'
import { ApiError } from '@/types/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import InfoField from '../project-info/InfoField'
import ProjectDetailsLoader from '../project-details/ProjectDetailsLoader'

interface TransformedUser {
  id: string
  fullName: string
}

const FormTeam: React.FC<FormTeamProps> = ({ open, onClose, teamToEdit, hasEditPermission = true }) => {
  const params = useParams<{ id: string }>()
  const projectId: number = Number(params.id)

  const [formData, setFormData] = useState<FormData>(
    DEFAULT_FORM_TEAM_DATA(projectId)
  )
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: roles, isLoading: isRolesLoading, isFetching: isRolesFetching } = useRoles()
  const { data: employeesData } = useEmployeesByRole(
    formData.role ? Number(formData.role) : null
  )
  const { data: stages, refetch, isLoading: isStagesLoading, isFetching: isStagesFetching } = useStages(projectId)
  const { mutate: saveTeam, isPending: isSaving } = useSaveTeam()
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam()

  // Comprehensive loading state function
  const isLoading = () => {
    if (isRolesLoading) return true
    if (isRolesFetching) return true
    if (isStagesLoading) return true
    if (isStagesFetching) return true
    if (isSaving) return true
    if (isUpdating) return true
    return false
  }

  const isRoleOthers =
    roles?.data
      .find(
        (r: { role_id: number; role_name: string }) =>
          r.role_id.toString() === formData.role.toString()
      )
      ?.role_name?.toLowerCase() === OTHERS


  useEffect(()=>{
    refetch()
  },[open])

  useEffect(() => {
    if (!open) return
    const getUserValue = () => {
      const selectedRole = roles?.data.find(
        (r: { role_id: number; role_name: string }) =>
          r.role_id === Number(teamToEdit?.role)
      )
      if (selectedRole?.role_name?.toLowerCase() === OTHERS) {
        return teamToEdit?.user_name ?? ''
      }
      return teamToEdit?.user ? Number(teamToEdit.user) : ''
    }

    const getProjectStageOrderId = () => {
      return (
        stages?.data
          .find(
            (s: { project_stage_order_id: string | number }) =>
              Number(s.project_stage_order_id) ===
              Number(teamToEdit?.project_stage_order_id ?? 0)
          )
          ?.project_stage_order_id?.toString() ?? ''
      )
    }

    const formatDate = (date?: string) =>
      date ? dayjs(date).format(DATE_FORMAT) : ''

    const updatedFormData = teamToEdit
      ? {
          role: teamToEdit.role ? Number(teamToEdit.role) : '',
          user: getUserValue(),
          other_resource:
            teamToEdit.role_name?.toLowerCase() === OTHERS
              ? (teamToEdit.other_resource ?? '')
              : '',
          responsibility: teamToEdit.responsibility ?? '',
          responsibility_description:
            teamToEdit.responsibility_description ?? '',
          project_id: projectId,
          design_team_id: teamToEdit.design_team_id,
          stage_name: teamToEdit.stage_name ?? '',
          stage_id: teamToEdit.stage_id ?? '',
          project_stage_order_id: getProjectStageOrderId(),
          start_date: formatDate(teamToEdit.start_date),
          end_date: formatDate(teamToEdit.end_date),
          status: Number(teamToEdit.status),
        }
      : DEFAULT_FORM_TEAM_DATA(projectId)

    setFormData(updatedFormData)
    setErrors({})
  }, [open, teamToEdit, projectId, stages, roles])

  const handleInputChange = (field: keyof FormData, value: string) => {
    if(!hasEditPermission) return
    let newFormData = { ...formData }

    if (field === 'role') {
      const newRole = value
      newFormData.role = newRole
      newFormData.user = ''
      newFormData.other_resource = ''
    } else if (field === 'project_stage_order_id') {
      newFormData.project_stage_order_id = value
      newFormData.stage_id =
        stages?.data
          .find(
            (s: { project_stage_order_id: string | number }) =>
              s.project_stage_order_id.toString() === value
          )
          ?.project_stage_id.toString() ?? ''
    } else if (field === 'user') {
      if (isRoleOthers) {
        newFormData[field] = value
      } else {
        newFormData[field] = value ? Number(value) : ''
      }
    } else {
      newFormData[field] = value
    }

    setFormData(newFormData)
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleDateChange = (field: keyof FormData, date: Dayjs | null) => {
    if(!hasEditPermission) return
    const formattedDate = date ? date.format(DATE_FORMAT) : ''
    setFormData((prev) => ({ ...prev, [field]: formattedDate }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.role) newErrors.role = FORM_MODAL_CONSTANTS.ROLE_REQUIRED
    if (!formData.user && !isRoleOthers)
      newErrors.user = FORM_MODAL_CONSTANTS.USER_REQUIRED
    if (isRoleOthers && !formData.other_resource)
      newErrors.other_resource = FORM_MODAL_CONSTANTS.RESOURCE_REQUIRED
    if (!formData.responsibility)
      newErrors.responsibility = FORM_MODAL_CONSTANTS.RESPONSIBILITY_REQUIRED
    if (!teamToEdit && !formData.responsibility_description.trim())
      newErrors.responsibility_description =
        FORM_MODAL_CONSTANTS.RESPONSIBILITY_DESCRIPTION_REQUIRED
    if (!formData.project_stage_order_id)
      newErrors.project_stage_order_id = FORM_MODAL_CONSTANTS.STAGE_REQUIRED

    if (formData.start_date && formData.end_date) {
      const start = dayjs(formData.start_date)
      const end = dayjs(formData.end_date)
      if (end.isBefore(start))
        newErrors.end_date = FORM_MODAL_CONSTANTS.END_DATE_AFTER_START
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const renderDropdownField = (
    field: keyof FormData,
    label: string,
    placeholder: string,
    options?: any[],
    keyField?: string,
    valueField?: string
  ) => {
    return (
      <FieldContainer>
        <InputField
          label={label}
          placeholder={placeholder}
          isDropdown
          keyField={keyField}
          valueField={valueField}
          value={formData[field]?.toString() ?? ''}
          onChange={(value: string) => handleInputChange(field, value)}
          options={options}
          error = {errors[field]}
        />
      </FieldContainer>
    )
  }

  const renderInputField = (
    field: keyof FormData,
    label: string,
    placeholder: string
  ) => (
    <FieldContainer>
      <InputField
        label={label}
        placeholder={placeholder}
        value={formData[field]?.toString() ?? ''}
        onChange={(value: string) => handleInputChange(field, value)}
        error = {errors[field]}
      />
    </FieldContainer>
  )

  const renderDateField = (field: keyof FormData, label: string) => {
    const isStartDate = field === FORM_MODAL_CONSTANTS.START_DATE
    const isEndDate = field === FORM_MODAL_CONSTANTS.END_DATE
    const startDateValue = formData.start_date
      ? dayjs(formData.start_date as string)
      : null
    let minDate: Dayjs | undefined
    if (isStartDate) {
      minDate = dayjs()
    } else if (isEndDate && startDateValue) {
      minDate = startDateValue
    }
    return (
      <FieldContainer>
        <DatePicker
          label={label}
          value={formData[field] ? dayjs(formData[field] as string) : null}
          onChange={(date) => handleDateChange(field, date)}
          minDate={minDate}
          error = {errors[field] ?? ''}
        />

      </FieldContainer>
    )
  }

  const handleSubmit = () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    const selectedStage = stages?.data.find(
      (s: { project_stage_order_id: string | number }) =>
        s.project_stage_order_id.toString() === formData.project_stage_order_id
    )

    const payload: any = {
      ...formData,
      project_stage_id: selectedStage
        ? Number(selectedStage.project_stage_id)
        : Number(formData.stage_id),
      project_stage_order_id: Number(formData.project_stage_order_id),
    }

    if (isRoleOthers) {
      payload.other_resource = formData.other_resource
      delete payload.user
    }

    const finalPayload = JSON.parse(JSON.stringify(payload))

    const onSuccessHandler = () => {
      showActionAlert(SUCCESS)
      onClose()
      setIsSubmitting(false)
    }

    const onErrorHandler = (error: ApiError) => {
      const statusCode = error?.response?.status
      if (statusCode === COMMON_CONSTANTS.USER_EXISTS_CODE) {
        showActionAlert(FORM_MODAL_CONSTANTS.CUSTOM_ALERT, {
          icon: ICON_NEW,
          text: COMMON_CONSTANTS.USER_EXISTS_TEXT,
          title: ICON_NEWERROR,
        })
      } else {
        showActionAlert(FAILED)
      }
      onClose()
      setIsSubmitting(false)
    }

    if (teamToEdit) {
      updateTeam(
        {
          ...finalPayload,
          design_team_id: teamToEdit.design_team_id,
          modified_by: teamToEdit.modified_by,
        },
        { onSuccess: onSuccessHandler, onError: onErrorHandler }
      )
    } else {
      saveTeam(finalPayload, {
        onSuccess: onSuccessHandler,
        onError: onErrorHandler,
      })
    }
  }

  const handleButtonClick = (label: string, onClick: () => void) => {
    onClick()
  }

  return (
    <CommonModal
      title={
        teamToEdit
          ? FORM_MODAL_CONSTANTS.EDIT_TEAM_TITLE
          : FORM_MODAL_CONSTANTS.FORM_TEAM_TITLE
      }
      open={open}
      onClose={onClose}
    >
      <ProjectDetailsLoader loading={isLoading()} />
      <FormContainer
        sx={OVERFLOW}
        as="form"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormContentWrapper sx={FORM_DESIGN}>
          {renderDropdownField(
            FIELD_CONFIGS.ROLE.field,
            FIELD_CONFIGS.ROLE.label,
            FIELD_CONFIGS.ROLE.placeholder,
            roles?.data.map((r: { role_id: number; role_name: string }) => ({
              ...r,
              role_id: r.role_id.toString(),
            })) ?? [],
            FIELD_CONFIGS.ROLE.keyField,
            FIELD_CONFIGS.ROLE.valueField
          )}
          {isRoleOthers
            ? renderInputField(
                FIELD_CONFIGS.OTHER_RESOURCE.field,
                FIELD_CONFIGS.OTHER_RESOURCE.label,
                FIELD_CONFIGS.OTHER_RESOURCE.placeholder
              )
            : renderDropdownField(
                FIELD_CONFIGS.USER.field,
                FIELD_CONFIGS.USER.label,
                FIELD_CONFIGS.USER.placeholder,
                employeesData?.data ?? [],
                FIELD_CONFIGS.USER.keyField,
                FIELD_CONFIGS.USER.valueField
              )}

          {renderInputField(
            FIELD_CONFIGS.RESPONSIBILITY.field,
            FIELD_CONFIGS.RESPONSIBILITY.label,
            FIELD_CONFIGS.RESPONSIBILITY.placeholder
          )}

          <FieldContainer>
            <Typography component="div">
              {FIELD_CONFIGS.RESPONSIBILITY_DESCRIPTION.label}
            </Typography>
            <RichTextEditor
              label=""
              value={formData.responsibility_description}
              onChange={(value) =>
                handleInputChange(
                  FIELD_CONFIGS.RESPONSIBILITY_DESCRIPTION.field,
                  value
                )
              }
              disabled={!hasEditPermission}
            />
            {errors.responsibility_description && (
              <ErrorText>{errors.responsibility_description}</ErrorText>
            )}
          </FieldContainer>

          {renderDropdownField(
            FIELD_CONFIGS.STAGE.field,
            FIELD_CONFIGS.STAGE.label,
            FIELD_CONFIGS.STAGE.placeholder,
            stages?.data.map(
              (s: {
                project_stage_id: string | number
                stage: string
                stage_number: number
                project_stage_order_id: string | number
              }) => ({
                ...s,
                project_stage_order_id: s.project_stage_order_id.toString(),
                stage: `${s.stage} ${s.stage_number}`,
              })
            ) ?? [],
            FIELD_CONFIGS.STAGE.keyField,
            FIELD_CONFIGS.STAGE.valueField
          )}

          {renderDateField(
            FIELD_CONFIGS.START_DATE.field,
            FIELD_CONFIGS.START_DATE.label
          )}
          {renderDateField(
            FIELD_CONFIGS.END_DATE.field,
            FIELD_CONFIGS.END_DATE.label
          )}

          <FieldContainer>
            <InfoField label={FIELD_CONFIGS.STATUS.label} value={getStatusDisplay(formData?.status)?.toString()}/>
          </FieldContainer>
        </FormContentWrapper>
        <ButtonGroup
          buttons={[
            {
              label: FORM_MODAL_CONSTANTS.CANCEL_BUTTON,
              onClick: () =>
                handleButtonClick(FORM_MODAL_CONSTANTS.CANCEL_BUTTON, onClose),
              disabled: isSaving ?? isUpdating,
            },
            {
              label: teamToEdit
                ? FORM_MODAL_CONSTANTS.UPDATE_BUTTON
                : FORM_MODAL_CONSTANTS.SAVE_BUTTON,
              onClick: () =>
                handleButtonClick(
                  teamToEdit
                    ? FORM_MODAL_CONSTANTS.UPDATE_BUTTON
                    : FORM_MODAL_CONSTANTS.SAVE_BUTTON,
                  handleSubmit
                ),
              disabled: !hasEditPermission,
            },
          ]}
        />
      </FormContainer>
    </CommonModal>
  )
}

export default FormTeam
