'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Box, IconButton, Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  DataGridTable,
} from '@/components/ui'
import {
  CreateProjectStageData,
  ProjectStagesFormData,
  StageDropdownItem,
  UpdateProjectStageData,
} from '@/types/modules/dnd/stageTypes'
import { PROJECT_STAGES, PROJECT_STAGES_MODAL_TEXT, BUILD_STAGE, STAGE_NAME_KEY, STAGE_FIELD_KEY, ACTIVITY_FIELD_KEY, ACTION_COLUMN_HEADER } from '@/constants/modules/dnd/stageService'
import { PROTOTYPE_FORM_CONSTANTS } from '@/constants/components/ui/prototypeForm'
import {
  ContentWrapper,
  FormContainer,
  FormSection,
  LabelContainer,
  StageLabel,
  StageValue,
} from '@/styles/components/modules/projectStageModal'
import {
  useCreateProjectStage,
  useEditProjectStage,
  useProjectStagesByID,
  useStagesDropdown,
} from '@/hooks/modules/dnd/useProjectStages'
import { REGEX } from '@/constants/modules/dnd/projectStages'
import { BoxStyle, MarginTop } from '@/styles/components/modules/prototypeModal'
import { ProjectStagesModalProps } from '@/types/components/modules/prototypeForm'
import { Edit, Trash } from 'iconsax-react'
import { DELETE_ALERT, FAILED_ALERT } from '@/constants/modules/dnd/formTeam'
import { useQueryClient } from '@tanstack/react-query'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP } from '@/constants/common'

const {
  NO_OF_STAGES,
  SELECT_VALID,
  FAILED_TO_LOAD_STAGES,
  STAGE,
  VARIANT_CONTAINED,
  COLOR_PRIMARY,
  VARIANT_OUTLINED,
  LOADING_STAGES,
  ERROR_LOADING_STAGES,
  DESIGN_STAGE,
  STAGE_ITEM_ID,
} = PROTOTYPE_FORM_CONSTANTS

const ProjectStagesModal: React.FC<ProjectStagesModalProps> = ({
  onSave,
  onClose,
  open,
  initialData,
  projectId,
  isEditMode,
  projectStageOrderId,
  hasEditPermission = true,
}) => {
  const initialFormState: ProjectStagesFormData = {
    stage: '',
    typeOfStage: '',
    numberOfStages: '',
    stageName: '',
    activity: '',
    design_stage: '',
    stage_id: '',
    stage_count: '',
  }

  const initialActivityFormState = {
    stage: '',
    activity: '',
  }

  const [formData, setFormData] = useState<ProjectStagesFormData>({
    ...initialFormState,
    ...initialData,
  })
  const [activityFormData, setActivityFormData] = useState(
    initialActivityFormState
  )
  const [errors, setErrors] = useState<Partial<ProjectStagesFormData>>({})
  const [activityErrors, setActivityErrors] = useState<
    Partial<typeof initialActivityFormState>
  >({})
  const [activitiesModal, setActivitiesModal] = useState(false)
  const [activities, setActivities] = useState<
    { id: string; stage: string; activity: string; status?: string }[]
  >([])
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  )
  const [customStages, setCustomStages] = useState<StageDropdownItem[]>([])
  const [stageType, setStageType] = useState('')
  const { data: projectStageDetails, refetch: refetchProjectStageDetails } = useProjectStagesByID(projectStageOrderId, isEditMode)

  const queryClient = useQueryClient()
  const {
    data: stagesDropdown,
    isLoading: isDropdownLoading,
    error: dropdownError,
  } = useStagesDropdown()
  const { mutate: createProjectStage, isPending: isSubmitting } =
    useCreateProjectStage() 
  const { mutate: updateProjectStage} =useEditProjectStage()   

  const dropdownOptions = useMemo(
    () =>
      stagesDropdown?.data
        ? [
            ...stagesDropdown.data,
            ...customStages,
            { [DESIGN_STAGE]: PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION, [STAGE_ITEM_ID]: 0 },
          ]
        : [
            ...customStages,
            { [DESIGN_STAGE]: PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION, [STAGE_ITEM_ID]: 0 },
          ],
    [stagesDropdown?.data, customStages]
  )
  const resetForm = useCallback(() => {
    setFormData(initialFormState)
    setErrors({})
    setActivities([])
    setEditingActivityId(null)
  }, [])

  const resetActivityForm = useCallback(() => {
    const selectedStage =
      formData.stage === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION ? formData.stageName : formData.stage
    setActivityFormData({
      stage: selectedStage ?? '',
      activity: '',
    })
    setActivityErrors({})
  }, [formData.stage, formData.stageName])

  const handleInputChange = useCallback(
    (field: keyof ProjectStagesFormData, value: string) => {
      if (field === NO_OF_STAGES && !REGEX.test(value)) {
        return
      }
      setFormData((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: '' }))
    },
    []
  )

  const handleActivityInputChange = useCallback(
    (field: keyof typeof initialActivityFormState, value: string) => {
      if(!hasEditPermission) return
      if (field === 'stage') return
      setActivityFormData((prev) => ({ ...prev, [field]: value }))
      setActivityErrors((prev) => ({ ...prev, [field]: '' }))
    },
    []
  )

  const getPlaceholder = useCallback(() => {
    if (isDropdownLoading) return LOADING_STAGES
    if (dropdownError) return ERROR_LOADING_STAGES
    return PROJECT_STAGES.STAGE.PLACEHOLDER
  }, [isDropdownLoading, dropdownError])

  const validateForm = useCallback(() => {
    const newErrors: Partial<ProjectStagesFormData> = {}

    if (!formData[STAGE]) {
      newErrors[STAGE] = PROJECT_STAGES.VALIDATION.STAGE_REQUIRED
    } else if (formData[STAGE] === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION && !formData.stageName) {
      newErrors.stageName = PROJECT_STAGES_MODAL_TEXT.ERRORS.REQUIRED_CUSTOM_NAME
    } else if (formData[STAGE] === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION && formData.stageName) {
      const allStages = [...(stagesDropdown?.data ?? []), ...customStages]
      if (
        allStages.some(
          (stage) =>
            typeof stage[DESIGN_STAGE] === 'string' &&
            stage[DESIGN_STAGE].toLowerCase() ===
              formData.stageName!.toLowerCase()
        )
      ) {
        newErrors.stageName = PROJECT_STAGES_MODAL_TEXT.ERRORS.DUPLICATE_STAGE
      }
    }
    if (!formData[NO_OF_STAGES]) {
      newErrors[NO_OF_STAGES] =
        PROJECT_STAGES.VALIDATION.NUMBER_OF_STAGES_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, stagesDropdown?.data, customStages])

  const validateActivityForm = useCallback(() => {
    const newErrors: Partial<typeof initialActivityFormState> = {}

    if (!activityFormData.stage) {
      newErrors.stage = 'Stage is required'
    }
    if (!activityFormData.activity) {
      newErrors.activity = 'Activity is required'
    }

    setActivityErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [activityFormData])

  const handleEditActivity = useCallback(
    (id: string) => {
      const activityToEdit = activities.find((activity) => activity.id === id)
      if (activityToEdit) {
        setActivityFormData({
                  stage:
          formData.stage === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION
            ? (formData.stageName ?? '')
            : formData.stage,
          activity: activityToEdit.activity,
        })
        setEditingActivityId(id)
        setActivitiesModal(true)
      }
    },
    [activities, formData.stage, formData.stageName]
  )

  const handleSaveActivity = useCallback(() => {
    if(!hasEditPermission) return
    if (!validateActivityForm()) return

    const selectedStage =
      formData.stage === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION ? formData.stageName : formData.stage

    if (editingActivityId) {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === editingActivityId
            ? {
                ...activity,
                stage: selectedStage ?? activity.stage,
                activity: activityFormData.activity,
              }
            : activity
        )
      )
      setEditingActivityId(null)
    } else {
      const newActivity = {
        id: crypto.randomUUID(),
        stage: selectedStage ?? '',
        activity: activityFormData.activity,
        status: '1',
      }
      setActivities((prev) => [...prev, newActivity])
    }

    resetActivityForm()
    setActivitiesModal(false)
  }, [
    activityFormData,
    editingActivityId,
    formData.stage,
    formData.stageName,
    validateActivityForm,
  ])

  const deleteActivity = async (id: string) => {
    try {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id ? { ...activity, status: '0' } : activity
        )
      )
      await showActionAlert(SUCCESS)
    } catch (error) {
      console.error('Error deleting activity:', error)
      await showActionAlert(FAILED_ALERT)
    }
  }

  const handleDeleteActivity = useCallback(async (id: string) => {
    const result = await showActionAlert(DELETE_ALERT)
    if (result.isConfirmed) {
      await deleteActivity(id)
    }
  }, [])

  const updateCustomStages = useCallback(
    (stageName: string, stageId: string) => {
      setCustomStages((prev) => {
        const stageExists = prev.some(
          (stage) =>
            stage.design_stage.toLowerCase() === stageName.toLowerCase()
        )

        if (stageExists) {
          return prev.map((stage) =>
            stage.design_stage.toLowerCase() === stageName.toLowerCase()
              ? { ...stage, stage_id: Number(stageId) }
              : stage
          )
        }
        return [...prev, { design_stage: stageName, stage_id: 0 }]
      })
    },
    []
  )

  const handleSubmit = useCallback(() => {
    if(!hasEditPermission) return
    if (!validateForm()) return

    let selectedStage
    let isCustomStage = false

    if (formData[STAGE] === 'Other') {
      isCustomStage = true
      selectedStage = {
        [DESIGN_STAGE]: formData.stageName,
        [STAGE_ITEM_ID]: null,
      }
    } else {
      selectedStage = dropdownOptions.find(
        (stage): stage is StageDropdownItem =>
          (stage as StageDropdownItem)[DESIGN_STAGE] === formData[STAGE]
      )
    }

    if (!selectedStage) {
      setErrors((prev) => ({
        ...prev,
        [STAGE]: SELECT_VALID,
      }))
      return
    }
    const payload: UpdateProjectStageData = {
      project_id: projectId,
      stage_id: isCustomStage ? null : Number(selectedStage[STAGE_ITEM_ID]),
      stage_count: parseInt(formData[NO_OF_STAGES] ?? '0'),
      activities: activities.map(({ id, activity, status }) => ({
        activity_id: Number(id),        
        activity_name: activity,
        status: status ?? '1',
      })),
        ...(isCustomStage && formData.stageName
        ? { stage_name: formData.stageName }
        : {}),
    }

    const createPayload: CreateProjectStageData = {
      project_id: projectId,
      stage_id: isCustomStage ? null : Number(selectedStage[STAGE_ITEM_ID]),
      stage_count: parseInt(formData[NO_OF_STAGES] ?? '0'),
      activities: activities.map(({ activity }) => activity),
        ...(isCustomStage && formData.stageName
        ? { stage_name: formData.stageName }
        : {}),
    }

    if(!isEditMode) {
    createProjectStage(createPayload, {
      onSuccess: (response) => {
        showActionAlert('success')
        onSave({ ...formData, stage_count: formData.stage_count ?? '' })

        if (isCustomStage && response?.data?.stage_id && formData.stageName) {
          updateCustomStages(formData.stageName, response.data.stage_id)
        }

        queryClient.invalidateQueries({ queryKey: ['stagesDropdown'] })
        resetForm()
      },
      onError: () => {
        showActionAlert(FAILED)
      },
    })}else{
      updateProjectStage({projectStageOrderId, data: payload}, {
      onSuccess: (response) => {
        showActionAlert('success')
        onSave({ ...formData, stage_count: formData.stage_count ?? '' })

        if (isCustomStage && response?.data?.stage_id && formData.stageName) {
          updateCustomStages(formData.stageName, response.data.stage_id)
        }

        queryClient.invalidateQueries({ queryKey: ['stagesDropdown'] })
        resetForm()
      },
      onError: () => {
        showActionAlert(FAILED)
      },
    })
    }
  }, [
    formData,
    activities,
    dropdownOptions,
    createProjectStage,
    onSave,
    resetForm,
    validateForm,
    queryClient,
    updateCustomStages,
  ])

  const handleClose = useCallback(() => {
    if (activitiesModal) {
      setActivitiesModal(false)
      setEditingActivityId(null)
      resetActivityForm()
    } else {
      resetForm()
      onClose()
      setStageType('')
    }
  }, [activitiesModal, onClose, resetForm])

  const handleActivities = useCallback(() => {
    setEditingActivityId(null)
    resetActivityForm()
    setActivitiesModal(true)
  }, [resetActivityForm])

  useEffect(() => {
  if (projectStageDetails?.data && isEditMode) {
    const stageData = projectStageDetails.data

    const {
      stage,
      stage_type,
      project_stage_id,
      activities,
    } = stageData

    const isCustom = !stagesDropdown?.data?.some(
      (s) => s.design_stage.toLowerCase() === stage.toLowerCase()
    )

    const selectedStageName = isCustom ? 'Other' : stage

    setFormData({
      stage: selectedStageName,
      typeOfStage: stage_type ?? '',
      numberOfStages: String(stageData.stage_count ?? ''),
      stageName: isCustom ? stage : '',
      activity: '',
      design_stage: stage,
      stage_id: String(project_stage_id),
      stage_count: String(stageData.stage_count ?? ''),
    })

    setStageType(stage_type ?? '')

    if (isCustom && stage && project_stage_id) {
      updateCustomStages(stage, String(project_stage_id))
    }

   setActivities((activities ?? []).map((item: { activity_id: number; activity: string }) => ({
    id: String(item.activity_id),
    stage,
    activity: item.activity,
    status: (item as any).status ?? '1',
  })))
  }
}, [projectStageDetails, projectStageOrderId])

  useEffect(() => {
    if (open && isEditMode) {
      refetchProjectStageDetails();
    }
  }, [open, isEditMode, projectStageOrderId]);

  return (
    <CommonModal title={PROJECT_STAGES.TITLE} open={open} onClose={handleClose}>
      <ContentWrapper>
        <FormContainer>
          <FormSection>
            {activitiesModal ? (
              <Grid2 container spacing={NUMBERMAP.ONE}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROJECT_STAGES_MODAL_TEXT.INPUT.STAGE}
                    placeholder={PROJECT_STAGES_MODAL_TEXT.INPUT.STAGE}
                    isDropdown={false}
                    value={activityFormData[STAGE_FIELD_KEY]}
                    onChange={(value: string) =>
                      handleActivityInputChange(STAGE_FIELD_KEY, value ?? '')
                    }
                    error={activityErrors[STAGE_FIELD_KEY]}
                    disabled={true}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROJECT_STAGES_MODAL_TEXT.INPUT.ENTER_ACTIVITY}
                    placeholder={PROJECT_STAGES_MODAL_TEXT.INPUT.ENTER_ACTIVITY}
                    value={activityFormData[ACTIVITY_FIELD_KEY] ?? ''}
                    onChange={(value: string) =>
                      handleActivityInputChange(ACTIVITY_FIELD_KEY, value ?? '')
                    }
                    hasEditable={!hasEditPermission}
                    error={activityErrors[ACTIVITY_FIELD_KEY]}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <ButtonGroup
                    buttons={[
                      {
                        label: PROJECT_STAGES_MODAL_TEXT.BUTTONS.CANCEL,
                        onClick: handleClose,
                        variant: VARIANT_OUTLINED,
                        color: COLOR_PRIMARY,
                      },
                      {
                        label: PROJECT_STAGES_MODAL_TEXT.BUTTONS.SAVE,
                        onClick: handleSaveActivity,
                        variant: VARIANT_CONTAINED,
                        color: COLOR_PRIMARY,
                        disabled: !hasEditPermission,
                      },
                    ]}
                  />
                </Grid2>
              </Grid2>
            ) : (
              <Grid2 container spacing={NUMBERMAP.ONE}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROJECT_STAGES.STAGE.LABEL}
                    placeholder={getPlaceholder()}
                    isDropdown
                    value={formData[STAGE] ?? null}
                    onChange={(value: string) => {
                      if (value === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION) {
                        setStageType(BUILD_STAGE)
                      } else {
                        let stagesTypes = dropdownOptions?.find(
                          (stage) => stage.design_stage == value
                        )

                        if (stagesTypes && typeof stagesTypes === 'object') {
                          if (stagesTypes.design_stage_type) {
                            setStageType(String(stagesTypes.design_stage_type))
                          } else {
                            setStageType('')
                          }
                        } else {
                          setStageType('')
                        }
                      }
                      handleInputChange(STAGE, value ?? '')
                    }}
                    error={
                      errors[STAGE] ??
                      (dropdownError ? FAILED_TO_LOAD_STAGES : '')
                    }
                    options={dropdownOptions}
                    keyField={String(DESIGN_STAGE)}
                    valueField={String(DESIGN_STAGE)}
                    disabled={isEditMode}
                  />
                </Grid2>

                {formData[STAGE] === PROJECT_STAGES_MODAL_TEXT.OTHER_OPTION && (
                  <Grid2 size={NUMBERMAP.TWELVE} sx={MarginTop}>
                    <InputField
                      label={PROJECT_STAGES.STAGE_NAME.LABEL}
                      placeholder={PROJECT_STAGES_MODAL_TEXT.INPUT.CUSTOM_STAGE_NAME}
                      isDropdown={false}
                      value={formData[STAGE_NAME_KEY] ?? ''}
                      onChange={(value: string) =>
                        handleInputChange(STAGE_NAME_KEY, value ?? '')
                      }
                      error={errors.stageName}
                      hasEditable={!hasEditPermission}
                    />
                  </Grid2>
                )}

                <Grid2 size={NUMBERMAP.TWELVE} sx={MarginTop}>
                  <LabelContainer>
                    <StageLabel>
                      {PROJECT_STAGES.TYPE_OF_STAGE.LABEL}
                    </StageLabel>
                    <StageValue>{stageType ?? '-'}</StageValue>
                  </LabelContainer>
                </Grid2>

                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROJECT_STAGES.NUMBER_OF_STAGES.LABEL}
                    placeholder={PROJECT_STAGES.NUMBER_OF_STAGES.PLACEHOLDER}
                    value={formData[NO_OF_STAGES] ?? ''}
                    onChange={(value: string) =>
                      handleInputChange(NO_OF_STAGES, value)
                    }
                    error={errors[NO_OF_STAGES]}
                    disabled={isEditMode}
                  />
                </Grid2>

                <Grid2 size={NUMBERMAP.TWELVE} sx={{ marginTop: '10px' }}>
                  <DataGridTable
                    showAddButton
                    onAddRow={handleActivities}
                    title={PROJECT_STAGES_MODAL_TEXT.LABELS.ACTIVITIES}
                    rows={activities.filter(a => a.status !== '0')}
                    hideFooter
                    idField="id"
                    columns={[
                      {
                        field: 'id',
                        headerName: 'S.No',
                        width: NUMBERMAP.HUNDRED,
                        renderCell: (params) => {
                          return (
                            params.api.getRowIndexRelativeToVisibleRows(
                              params.row.id
                            ) + 1
                          )
                        },
                      },
                      { field: STAGE_FIELD_KEY, headerName: PROJECT_STAGES_MODAL_TEXT.LABELS.STAGE, width: NUMBERMAP.TWOHUNDRED },
                      { field: ACTIVITY_FIELD_KEY, headerName: PROJECT_STAGES_MODAL_TEXT.LABELS.ACTIVITY, width: NUMBERMAP.TWOHUNDRED },
                      {
                        field: 'action',
                        headerName: ACTION_COLUMN_HEADER,
                        width: NUMBERMAP.ONEFIFTY,
                        renderCell: (params) => (
                          <div className="action-buttons">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditActivity(params.row.id)}
                            >
                              <Edit size={NUMBERMAP.TWENTYFOUR} color="currentColor" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() =>
                                hasEditPermission && handleDeleteActivity(params.row.id)
                              }
                            >
                              <Trash size={NUMBERMAP.TWENTYFOUR} color="currentColor" />
                            </IconButton>
                          </div>
                        ),
                      },
                    ]}
                  />
                </Grid2>
              </Grid2>
            )}
          </FormSection>
        </FormContainer>
        {!activitiesModal && (
          <Box sx={BoxStyle}>
            <ButtonGroup
              buttons={[
                {
                  label: PROJECT_STAGES_MODAL_TEXT.BUTTONS.CANCEL,
                  onClick: handleClose,
                  variant: VARIANT_OUTLINED,
                  color: COLOR_PRIMARY,
                  disabled: isSubmitting,
                },
                {
                  label: PROJECT_STAGES_MODAL_TEXT.BUTTONS.SAVE,
                  onClick: handleSubmit,
                  variant: VARIANT_CONTAINED,
                  color: COLOR_PRIMARY,
                  disabled: isSubmitting,
                },
              ]}
            />
          </Box>
        )}
      </ContentWrapper>
    </CommonModal>
  )
}

export default ProjectStagesModal