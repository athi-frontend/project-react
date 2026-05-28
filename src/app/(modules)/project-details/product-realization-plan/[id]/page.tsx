'use client'
import React, { useEffect, useState } from 'react'
import { ActionButton, ButtonGroup, DataGridTable, Description, InputField, Label, RichTextEditor, showActionAlert } from '@/components/ui'
import { PageContainer, popup_style, PADDING, ERROR_COLOR, InfoLabel, P20P40 } from '@/styles/common'
import { Box, Grid2 } from '@mui/material'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import { BUTTON_LABEL, getButtonConfig, NUMBERMAP, STATUS } from '@/constants/common'
import { useParams, useRouter } from 'next/navigation'
import { usePostProduct, usePostProductById } from '@/hooks/modules/dnd/useProductRealization'
import { InfoValue } from '@/styles/modules/hr/addEmployee'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { ALERT_ACTIONS, FIELD_COLUMN, FIELD_IS_REQUIRED, FIELD_VALUE, LABEL, ONCHANGE_VALUE, PLACEHOLDER, PRODUCT_QUALITY_TITLE, STAGE_TITLE, TITLE, FIELD_ORDER, FIELD_LABEL_MAP, FIELD_IDS, VALIDATION_VALUES, SCHEDULE_DATE_FORMAT } from '@/constants/modules/dnd/productRealization'
import { stripHtml } from '@/lib/modules/dnd/dirSpecification'
import ReviewerModal from '@/components/modules/dnd/reviewer-modal/ReviewerModal'
import { processButtonsWithPermissions } from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { prdBoxStyles } from '@/styles/modules/dnd/projectPlan'
import MonthYearPicker from '@/components/ui/month-year-picker/MonthYearPicker'
import { DateTime } from 'luxon'
import { MonthYearValue } from '@/types/modules/dnd/projectPlan'

/**
 Classification : Confidential
**/
const initialQualityObjective = { quality_objective: '', measure_of_objective: '' }
const initialStage = { stage: '', schedule: '', responsibility: '', month_id: '', year_value: '' }

const formatMonthId = (value?: MonthYearValue) => {
  if (value === null || value === undefined) return ''
  const numericValue = Number(value)
  if (Number.isNaN(numericValue) || numericValue <= NUMBERMAP.ZERO) return ''
  return `${numericValue}`.padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())
}

const getStageDateValue = (
  monthId?: MonthYearValue,
  yearValue?: MonthYearValue
): DateTime | null => {
  if (!monthId || !yearValue) return null
  const date = DateTime.fromObject({
    year: Number(yearValue),
    month: Number(monthId),
    day: NUMBERMAP.ONE,
  })
  return date.isValid ? date.startOf('month') : null
}

const buildStageScheduleLabel = (
  monthId?: MonthYearValue,
  yearValue?: MonthYearValue
) => {
  const date = getStageDateValue(monthId, yearValue)
  return date ? date.toFormat(SCHEDULE_DATE_FORMAT) : ''
}

const extractMonthYearFromSchedule = (schedule?: string) => {
  if (!schedule) return { monthId: '', yearValue: '' }
  const parsed = DateTime.fromFormat(schedule, SCHEDULE_DATE_FORMAT)
  if (!parsed.isValid) return { monthId: '', yearValue: '' }
  return {
    monthId: parsed.toFormat('MM'),
    yearValue: `${parsed.year}`,
  }
}

const normalizeStageRecord = (record: any) => {
  if (!record) return { ...initialStage }

  const derivedFromSchedule = extractMonthYearFromSchedule(record?.schedule)
  const monthId = formatMonthId(record?.month_id ?? record?.monthId ?? derivedFromSchedule.monthId)
  const yearValue =
    record?.year_value ?? record?.yearValue ?? derivedFromSchedule.yearValue ?? ''

  const schedule = buildStageScheduleLabel(monthId, yearValue) ?? record?.schedule ?? ''

  return {
    stage: record?.stage ?? '',
    responsibility: record?.responsibility ?? '',
    month_id: monthId,
    year_value: yearValue ? `${yearValue}` : '',
    schedule,
  }
}

const CandidatePage: React.FC = () => {
  // Table state
  const [qualityObjectives, setQualityObjectives] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(initialQualityObjective)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [modalErrors, setModalErrors] = useState<{ quality_objective?: string; measure_of_objective?: string }>({})
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  // Sequence of Process fields state
  const [sequenceFields, setSequenceFields] = useState({
    project_generic_name: '',
    productRealization: '',
    sequenceOfProcess: '',
    resourceCompetencyPlan: '',
    infrastructurePlan: '',
    environmentalPlan: '',
    processMeasurementPlan: '',
    productDispositionMethod: '',
  })
  const [sequenceErrors, setSequenceErrors] = useState<any>({})

  // State for Stage of Product Realization table and modal
  const [stages, setStages] = useState<any[]>([])
  const [stageModalOpen, setStageModalOpen] = useState(false)
  const [stageModalData, setStageModalData] = useState(initialStage)
  const [stageEditIndex, setStageEditIndex] = useState<number | null>(null)
  const [stageModalErrors, setStageModalErrors] = useState<{ stage?: string; schedule?: string; responsibility?: string }>({})
  const params = useParams()
  const project_id = params.id
  const maxSourceLength = NUMBERMAP.TWOFIFTYFIVE
  const router = useRouter()

  const { data: Productdata, refetch, isLoading, isFetching } = usePostProductById(
    Number(project_id) || NUMBERMAP.ZERO
  )
  const { mutate: saveProduct, isPending: isSavePending } = usePostProduct()
  
  // Comprehensive loading state
  const isAnyLoading = () => {
    if (isLoading) return true
    if (isFetching) return true
    if (isSavePending) return true
    if (isReviewPending) return true
    return false
  }

  
  // Centralized duplicate record handler
  const handleDuplicateRecord = (duplicatetext : string) => {
    showActionAlert(ALERT_ACTIONS.CUSTOM_ALERT, {
      title: ALERT_ACTIONS.TITLE,
      text: duplicatetext,
      icon: ALERT_ACTIONS.ERROR,
      cancelButton: false,
      confirmButton: false,
    })
  }
  
  // Modal handlers
  const handleOpenModal = () => {
    if(!hasEditPermission) return
    setModalData(initialQualityObjective)
    setEditIndex(null)
    setModalErrors({})
    setModalOpen(true)
  }
  const handleEdit = (idx: number) => {
    setModalData(qualityObjectives[idx])
    setEditIndex(idx)
    setModalErrors({})
    setModalOpen(true)
  }
  const handleDelete = async (idx: number) => {
    if(!hasEditPermission) return
    const result = await showActionAlert('delete');
    if (!result.isConfirmed) return;

    setQualityObjectives((prev) => prev.filter((_, i) => i !== idx));
    showActionAlert(SUCCESS);
  };
  const handleModalChange = (field: string, value: string) => {
    if(!hasEditPermission) return
    setModalData((prev) => ({ ...prev, [field]: value }))
    setModalErrors((prev: any) => ({ ...prev, [field]: '' }))
  }
  const handleModalSave = () => {
    const errors: any = {}
    if (!modalData.quality_objective?.trim()) errors.quality_objective = FIELD_IS_REQUIRED.QUALITY_OBJECTIVE
    if (!modalData.measure_of_objective?.trim()) errors.measure_of_objective = FIELD_IS_REQUIRED.MEASURE
    
    const isDuplicateRecord = qualityObjectives.some((ele, i)=>{
      if(editIndex !== null && i === editIndex) return false

      return (
        ele.quality_objective.toLowerCase() === modalData.quality_objective.toLowerCase() && 
        ele.measure_of_objective.toLowerCase() === modalData.measure_of_objective.toLowerCase()
      )
    })

    if(isDuplicateRecord){
      handleDuplicateRecord(ALERT_ACTIONS.DUPLICATE_PRODUCT_TEXT)
      setModalOpen(false)
      return
    }
    
    setModalErrors(errors)
    if(Object.keys(errors).length) return

    if (editIndex !== null) {
      setQualityObjectives((prev) =>
        prev.map((item, idx) => (idx === editIndex ? modalData : item))
      )
    } else {
      setQualityObjectives((prev) => [...prev, modalData])
    }
    setSequenceErrors((prev) => ({ ...prev, qualityObjectives: '' }))
    setModalOpen(false)
  }

  // Sequence fields handlers
  const handleSequenceChange = (field: string, value: string) => {
    if(!hasEditPermission) return
    setSequenceFields((prev) => ({ ...prev, [field]: value }))
    setSequenceErrors((prev: any) => ({ ...prev, [field]: '' }))
  }

  // Handlers for Stage modal
  const handleStageOpenModal = () => {
    if(!hasEditPermission) return
    setStageModalData(initialStage)
    setStageEditIndex(null)
    setStageModalErrors({})
    setStageModalOpen(true)
  }
  const handleStageEdit = (idx: number) => {
    setStageModalData(stages[idx])
    setStageEditIndex(idx)
    setStageModalErrors({})
    setStageModalOpen(true)
  }
  const handleStageDelete = async (idx: number) => {
    if(!hasEditPermission) return
    const result = await showActionAlert('delete');
    if (!result.isConfirmed) return;

    setStages((prev) => prev.filter((_, i) => i !== idx));
    showActionAlert(SUCCESS);
  };
  const handleStageModalChange = (field: string, value: string) => {
    if(!hasEditPermission) return
    setStageModalData((prev) => ({ ...prev, [field]: value }))
    setStageModalErrors((prev: any) => ({ ...prev, [field]: '' }))
  }
  const handleStageScheduleChange = (date: DateTime | null) => {
    if(!hasEditPermission) return
    setStageModalData((prev) => ({
      ...prev,
      schedule: date ? date.toFormat(SCHEDULE_DATE_FORMAT) : '',
      month_id: date ? date.toFormat('MM') : '',
      year_value: date ? `${date.year}` : '',
    }))
    setStageModalErrors((prev: any) => ({ ...prev, schedule: '' }))
  }
  const handleStageModalSave = () => {
    const errors: any = {}
    if (!stageModalData.stage?.trim()) errors.stage = FIELD_IS_REQUIRED.STAGE
    if (!stageModalData.month_id?.trim() || !stageModalData.year_value?.trim()) {
      errors.schedule = FIELD_IS_REQUIRED.SCHEDULE
    }
    if (!stageModalData.responsibility?.trim()) errors.responsibility = FIELD_IS_REQUIRED.RESPONSIBILITY
    
    const isDuplicateRecord = stages.some((ele, i)=>{
      if(stageEditIndex !== null && i === stageEditIndex) return false;

      return (
        ele.stage?.toLowerCase() === stageModalData.stage?.toLowerCase()  && 
        (ele.month_id ?? '') === (stageModalData.month_id ?? '') &&
        `${ele.year_value ?? ''}` === `${stageModalData.year_value ?? ''}` &&
        ele.responsibility?.toLowerCase() === stageModalData.responsibility?.toLowerCase()
      )
    })

    if(isDuplicateRecord){
      handleDuplicateRecord(ALERT_ACTIONS.DUPLICATE_STAGES_TEXT)
      setStageModalOpen(false)
      return
    }
   
    setStageModalErrors(errors)
    if(Object.keys(errors).length) return

    const normalizedStage = normalizeStageRecord(stageModalData)
    if (stageEditIndex !== null) {
      setStages((prev) =>
        prev.map((item, idx) => (idx === stageEditIndex ? normalizedStage : item))
      )
    } else {
      setStages((prev) => [...prev, normalizedStage])
    }
    setSequenceErrors((prev) => ({ ...prev, stages: '' }))
    setStageModalOpen(false)
  }
  const validateForm = () => {
    const errors: any = {}
    if (!sequenceFields.productRealization?.trim()) errors.productRealization = FIELD_IS_REQUIRED.PRODUCT_REALIZATION
    if (!sequenceFields.sequenceOfProcess?.trim()) errors.sequenceOfProcess = FIELD_IS_REQUIRED.SEQUENCE_OF_PROCESS
    if (!sequenceFields.resourceCompetencyPlan?.trim()) errors.resourceCompetencyPlan = FIELD_IS_REQUIRED.RESOURCE
    if (!sequenceFields.infrastructurePlan?.trim()) errors.infrastructurePlan = FIELD_IS_REQUIRED.INFRASTRUCTURE_PLAN
    if (!sequenceFields.environmentalPlan?.trim()) errors.environmentalPlan = FIELD_IS_REQUIRED.ENVIRONMENTAL_CLEANLINESS
    if (!sequenceFields.processMeasurementPlan?.trim()) errors.processMeasurementPlan = FIELD_IS_REQUIRED.PROCESS_MEASUREMENT_PLAN
    if (!sequenceFields.productDispositionMethod?.trim()) errors.productDispositionMethod = FIELD_IS_REQUIRED.PRODUCT_DISPOSITION
    if (stages.length <= NUMBERMAP.ZERO) errors.stages = FIELD_IS_REQUIRED.STAGE_GRID
    if (qualityObjectives.length <= NUMBERMAP.ZERO) errors.qualityObjectives = FIELD_IS_REQUIRED.PRODUCT_QUALITY_OBJ
    setSequenceErrors(errors)
    
    // Only check for empty fields if there are validation errors
    const hasValidationErrors = Object.keys(errors).length > NUMBERMAP.ZERO
    if (hasValidationErrors) {
      // Create form data that includes table fields
      const formData = {
        ...sequenceFields,
        qualityObjectives: qualityObjectives.length > NUMBERMAP.ZERO ? VALIDATION_VALUES.HAS_DATA : VALIDATION_VALUES.EMPTY,
        stages: stages.length > NUMBERMAP.ZERO ? VALIDATION_VALUES.HAS_DATA : VALIDATION_VALUES.EMPTY
      }
      
      // Focus on the first empty field
      validateAndFocusFirstEmptyField(
        formData,
        FIELD_ORDER,
        FIELD_LABEL_MAP
      )
      return false // Always return false if there are validation errors
    }
    
    return true
  }

  useEffect(() => {
    if (Productdata?.data && Productdata.data.length > NUMBERMAP.ZERO) {
      const productInfo = Productdata.data[NUMBERMAP.ZERO];

      // Set state for sequence fields
      setSequenceFields({
        project_generic_name: productInfo.project_generic_name,
        productRealization: productInfo.realization_document_reference,
        sequenceOfProcess: productInfo.sequence_of_processes,
        resourceCompetencyPlan: productInfo.resource_competency_plan,
        infrastructurePlan: productInfo.infrastructure_plan,
        environmentalPlan: productInfo.environment_cleanliness_and_safety_plan,
        processMeasurementPlan: productInfo.process_measurements_plan,
        productDispositionMethod: productInfo.product_disposition_method
      });

      // Set state for quality objectives
      setQualityObjectives(productInfo.product_quality_objective);

      // Set state for stages
      const normalizedStages =
        productInfo.stages_of_product_realization_plan?.map((stage: any) =>
          normalizeStageRecord(stage)
        ) ?? []
      setStages(normalizedStages)
    }
  }, [Productdata]);

  const handleSubmit = () => {
    if (!validateForm()) return
    setIsDisabled(true)
    const stagePayload = stages.map((stage) => ({
      stage: stage.stage,
      responsibility: stage.responsibility,
      month_id: stage.month_id,
      year_value: Number(stage.year_value),
    }))
    const fieldsToAppend = {
      project_id: project_id,
      realization_document_reference: sequenceFields.productRealization,
      resource_competency_plan: sequenceFields.resourceCompetencyPlan,
      sequence_of_processes: sequenceFields.sequenceOfProcess,
      infrastructure_plan: sequenceFields.infrastructurePlan,
      environment_cleanliness_and_safety_plan: sequenceFields.environmentalPlan,
      process_measurements_plan: sequenceFields.processMeasurementPlan,
      product_disposition_method: sequenceFields.productDispositionMethod,
      stages_of_product_realization_plan: stagePayload,
      product_quality_objective: qualityObjectives
    }

    const payload = {
      ...fieldsToAppend
    }

    saveProduct(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS)
        setIsDisabled(false)
        refetch();
      },
      onError: () => {
        showActionAlert(FAILED)
        setIsDisabled(false)
      },
    })
  }
  const columns: GridColDef[] = [
    { field: FIELD_COLUMN.SNO, headerName: FIELD_VALUE.SNO, flex: NUMBERMAP.HALF },
    { field: FIELD_COLUMN.STAGE, headerName: FIELD_VALUE.STAGE, flex: NUMBERMAP.ONE },
    { field: FIELD_COLUMN.SCHEDULE, headerName: FIELD_VALUE.SCHEDULE, flex: NUMBERMAP.ONE },
    {
      field: FIELD_COLUMN.RESPONSIBILITY,
      headerName: FIELD_VALUE.RESPONSIBILITY,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return stripHtml(params.value)
      },
    },

    {
      field: FIELD_COLUMN.ACTION,
      headerName: FIELD_VALUE.ACTION,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <ActionButton
            onDelete={() => handleStageDelete(params.row.sno - NUMBERMAP.ONE)}
            onEdit={() => handleStageEdit(params.row.sno - NUMBERMAP.ONE)}
          />
        )
      },
      sortable: false,
      filterable: false,
    },
  ]
  const product_columns = [
    { field: FIELD_COLUMN.SNO, headerName: FIELD_VALUE.SNO, flex: NUMBERMAP.HALF },
    {
      field: FIELD_COLUMN.QUALITY_OBJ,
      headerName: FIELD_VALUE.QUALITY_OBJ,
      flex: NUMBERMAP.ONE,
    },
    {
      field: FIELD_COLUMN.MEASURE,
      headerName: FIELD_VALUE.MEASURE,
      flex: NUMBERMAP.ONE,
    },

    {
      field: FIELD_COLUMN.ACTION,
      headerName: FIELD_VALUE.ACTION,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <ActionButton
            onDelete={() => handleDelete(params.row.sno - NUMBERMAP.ONE)}
            onEdit={() => handleEdit(params.row.sno - NUMBERMAP.ONE)}
          />
        )
      },
      sortable: false,
      filterable: false,
    },
  ]
  const { mutate: saveReview, isPending: isReviewPending } = useSubmitReview(Productdata?.meta_info?.action_control?.formName)
  const permissions = Productdata?.meta_info?.action_control?.permissions ?? []
  const handleCloseReviewerModalPlan = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }

  // Update getButtonConfig to pass trigger_status_id to handleSubmitReviewModal
  const handleButtonChangePlan = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }

  // Update these handler functions to accept trigger_status_id parameter
  const handleSubmitForReviewPlan = (trigger_status_id?: number) => {
    handleButtonChangePlan(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApprovePlan = (trigger_status_id?: number) => {
    handleButtonChangePlan(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleRejectPlan = (trigger_status_id?: number) => {
    handleButtonChangePlan(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleSubmitApprovalPlan = (trigger_status_id?: number) => {
    const payload = {
      project_id: project_id,
      new_status_id: trigger_status_id,
    }
    saveReview(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }
  const handleCancel = () => {
    router.push(ROUTE_PATHS.PROJECT_LIST)
  };

  const getButtons = getButtonConfig({
    handleSubmitForReview: handleSubmitForReviewPlan,
    handleApprove: handleApprovePlan,
    handleReject: handleRejectPlan,
    handleCancel: handleCancel,
    handleSave: handleSubmit,
    handleSubmitApproval: handleSubmitApprovalPlan,
    isDisabled: isAnyLoading(),
  })

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions ?? [], getButtons, isDisabled)

  const stageScheduleDate = getStageDateValue(
    stageModalData.month_id,
    stageModalData.year_value
  )
  return (
    <PageContainer>
      <GlobalLoader loading = {isAnyLoading()} />
      {buttonDetails && (
        <>
          <Label title={TITLE} />

          <Grid2 container spacing={NUMBERMAP.ONE} sx={{
            padding: PADDING
          }}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InfoLabel>Product Generic Name</InfoLabel>
              <InfoValue>{sequenceFields.project_generic_name}</InfoValue>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={LABEL.PRODUCT_REALIZATION}
                value={sequenceFields.productRealization ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.PRODUCT_REALIZATION, value)
                }
                placeholder={PLACEHOLDER.PRODUCT_REALIZATION}
                error={sequenceErrors.productRealization}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.TWELVE}>
              <div id={FIELD_IDS.QUALITY_OBJECTIVES}>
              <DataGridTable
                title={`${PRODUCT_QUALITY_TITLE}*`}
                onAddRow={handleOpenModal}
                showAddButton
                columns={product_columns}
                rows={
                  (qualityObjectives ?? []).map((item, index) => ({
                    ...item,
                    id: item.id ?? `temp-${index}`,
                  }))
                }
                idField="id"
                error={sequenceErrors.qualityObjectives}
                autoHeight
                hideFooter
              />
              <div style={ERROR_COLOR}>
                {sequenceErrors.qualityObjectives}
                </div>
              </div>
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
            <div id={FIELD_IDS.STAGES}>
              <DataGridTable
                title={`${STAGE_TITLE}*`}
                onAddRow={handleStageOpenModal}
                showAddButton
                idField={FIELD_COLUMN.SNO}
                columns={columns}
                rows={stages.map((row, idx) => ({
                  sno: idx + NUMBERMAP.ONE,
                  ...row,
                  schedule: row.schedule ?? buildStageScheduleLabel(row.month_id, row.year_value),
                }))}
                autoHeight
                hideFooter
                error={sequenceErrors.stages}
              />
              {sequenceErrors.stages && (
                <div style={ERROR_COLOR}>
                  {sequenceErrors.stages}
                </div>
              )}
            </div>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={LABEL.SEQUENCE_OF_PROCESS}
                value={sequenceFields.sequenceOfProcess ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.SEQUENCE_OF_PROCESS, value)
                }
                placeholder={PLACEHOLDER.SEQUENCE_OF_PROCESS}
                error={sequenceErrors.sequenceOfProcess}
                maxLength={maxSourceLength}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={LABEL.RESOURCE}
                value={sequenceFields.resourceCompetencyPlan ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.RESOURCE, value)
                }
                placeholder={PLACEHOLDER.RESOURCE}
                error={
                  sequenceErrors.resourceCompetencyPlan
                }
                maxLength={maxSourceLength}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={LABEL.INFRASTRUCTURE_PLAN}
                value={sequenceFields.infrastructurePlan ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.INFRASTRUCTURE_PLAN, value)
                }
                placeholder={PLACEHOLDER.INFRASTRUCTURE_PLAN}
                error={sequenceErrors.infrastructurePlan}
                maxLength={maxSourceLength}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={LABEL.ENVIRONMENTAL_CLEANLINESS}
                value={sequenceFields.environmentalPlan ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.ENVIRONMENTAL_CLEANLINESS, value)
                }
                placeholder={PLACEHOLDER.ENVIRONMENTAL_CLEANLINESS}
                error={sequenceErrors.environmentalPlan}
                maxLength={maxSourceLength}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={LABEL.PROCESS_MEASUREMENT_PLAN}
                value={sequenceFields.processMeasurementPlan ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.PROCESS_MEASUREMENT_PLAN, value)
                }
                placeholder={PLACEHOLDER.PROCESS_MEASUREMENT_PLAN}
                error={
                  sequenceErrors.processMeasurementPlan
                }
                maxLength={maxSourceLength}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={LABEL.PRODUCT_DISPOSITION}
                value={sequenceFields.productDispositionMethod ?? ''}
                onChange={(value: string) =>
                  handleSequenceChange(ONCHANGE_VALUE.PRODUCT_DISPOSITION, value)
                }
                placeholder={PLACEHOLDER.PRODUCT_DISPOSITION}
                error={
                  sequenceErrors.productDispositionMethod
                }
                maxLength={maxSourceLength}
              />
            </Grid2>
          </Grid2>
          <Box sx={prdBoxStyles}>
          <CommentsHistory 
              comments={Productdata?.meta_info?.task_info?.task_comments}
           />
           </Box>
          <CommonModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={PRODUCT_QUALITY_TITLE}
            buttonRequired
            onSave={handleModalSave}
          >
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Description
                  label={LABEL.QUALITY_OBJECTIVE}
                  value={modalData.quality_objective ?? ''}
                  onChange={(value: string) =>
                    handleModalChange(ONCHANGE_VALUE.QUALITY_OBJECTIVE, value)
                  }
                  placeholder={PLACEHOLDER.QUALITY_OBJECTIVE}
                  error={modalErrors.quality_objective}
                  maxLength={maxSourceLength}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Description
                  label={LABEL.MEASURE}
                  value={modalData.measure_of_objective ?? ''}
                  onChange={(value: string) =>
                    handleModalChange(ONCHANGE_VALUE.MEASURE, value)
                  }
                  placeholder={PLACEHOLDER.MEASURE}
                  error={modalErrors.measure_of_objective}
                  maxLength={maxSourceLength}
                />
              </Grid2>
            </Grid2>
          </CommonModal>
          <CommonModal
            open={stageModalOpen}
            onClose={() => setStageModalOpen(false)}
            title={STAGE_TITLE}
            buttonRequired
            onSave={handleStageModalSave}
          >
            <Grid2 container spacing={NUMBERMAP.TWO} sx={popup_style}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <InputField
                  label={LABEL.STAGE}
                  value={stageModalData.stage ?? ''}
                  onChange={(value: string) =>
                    handleStageModalChange(ONCHANGE_VALUE.STAGE, value)
                  }
                  placeholder={PLACEHOLDER.STAGE}
                  error={stageModalErrors.stage}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <MonthYearPicker
                  label={LABEL.SCHEDULE}
                  value={stageScheduleDate}
                  onChange={handleStageScheduleChange}
                  placeholder={PLACEHOLDER.SCHEDULE}
                  error={stageModalErrors.schedule}
                  disabled={!hasEditPermission}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <RichTextEditor
                  label={LABEL.RESPONSIBILITY}
                  value={stageModalData.responsibility ?? ''}
                  onChange={(value: string) =>
                    handleStageModalChange(ONCHANGE_VALUE.RESPONSIBILITY, value)
                  }
                  placeholder={PLACEHOLDER.RESPONSIBILITY}
                  error={stageModalErrors.responsibility}
                  disabled={!hasEditPermission}
                />
              </Grid2>
            </Grid2>
          </CommonModal>
          <Grid2 sx={{padding: P20P40}}>
            <ButtonGroup buttons={buttonDetails} />
          </Grid2>
          <ReviewerModal
            open={isReviewerModal}
            onClose={handleCloseReviewerModalPlan}
            project_id={project_id}
            button_id={buttonId}
            mode={buttonName}
            menu_id={Productdata?.meta_info?.action_control?.menuId}
            menu_name={Productdata?.meta_info?.action_control?.formName}
            reviewerList={Productdata?.meta_info?.task_info?.reviewer_list}
          />
        </>
      )}
    </PageContainer>
  )
}

export default CandidatePage