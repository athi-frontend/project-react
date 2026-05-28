'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Grid2, IconButton, Typography, Tooltip, Box, useTheme } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ButtonGroup,
  DataGridTable,
  Description,
  InputField,
  MultiSelect,
  RichTextEditor,
  showActionAlert,
} from '@/components/ui'
import AddIcon from '@mui/icons-material/Add'
import DesignTeamSection from '@/components/modules/dnd/project-plan/DesignTeamSection'
import FormTeam from '@/components/modules/dnd/form-team/FormTeamModal'
import FormSection from '@/components/modules/dnd/project-plan/FormSection'
import {
  Container,
  Title,
  ContentWrapper,
  designTeamSectionStyles,
  SectionHeaderRow,
  SectionHeaderTitle,
  DesignHeaderRow,
  TruncatedLabelValue,
  designObjectiveLabelContainer,
  designObjectiveIconButton,
} from '@/styles/modules/dnd/projectPlan'
import { EditorLabel } from '@/styles/components/ui/input'
import {
  ProjectFormData,
  FormErrors,
  StringFormField,
  ArrayFormField,
  ScheduleData,
  Tool,
  ProjectPlanResponse,
  Option,
  Equipment,
  DocumentStructure,
  UploadedFileData,
  Task,
  ProjectStage,
} from '@/types/modules/dnd/projectPlan'
import {
  INITIAL_FORM_DATA,
  INITIAL_ERRORS,
  FORM_FIELDS,
  COMPONENT_TYPES,
  CLASS_NAMES,
  VALIDATION_MESSAGES,
  FIELD_NAMES,
  TYPE_NAMES,
  API_FIELD_KEYS,
  GRID_SIZE,
  STAGE_RESOURCE_COLUMNS,
  SCHEDULE_COLUMNS,
  DESIGN_TRANSFER as DesignTransferHeader,
  DOCUMENT_REFERENCE as DocumentReferenceHeader,
  FINAL_SUBMIT,
  SIZE,
  ALERT_TYPES, PROJECT_PLAN_TITLES, LABEL_TEXTS, MARKET_REGULATION_COLUMNS,
  TOOLTIP_DISPLAY,
  FIELD_ORDER,
  FIELD_LABEL_MAP,
  STAGE_FORM,
  TOOL_PAYLOAD_KEYS,
  EQUIPMENT_PAYLOAD_KEYS,
  FIELD_KEYS,
} from '@/constants/modules/dnd/projectPlan'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import {
  useDesignTools,
  useDesignEquipments,
  useProjectPlan,
  useUpsertProjectPlan,
  useGetDesignInputGathering,
  useDesignInputGatheringSubmit,
} from '@/hooks/modules/dnd/useProjectPlan'
import ProjectStagesPopupForm from '@/components/modules/dnd/project-stages/ProjectStageModal'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import PopupForm from '@/components/modules/dnd/design-input/PopupForm'
import { DesignInputFormData } from '@/types/modules/dnd/designInput'
import {
  COMMON_CONSTANTS,
  handleFileEdit,
  handleFileUpload,
  mergeFinalFileData,
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { BUTTON_LABEL, FINALFILEINITIALDATA, getButtonConfig, NUMBERMAP, STATUS } from '@/constants/common'
import TaskSchedule from '@/components/modules/dnd/project-plan/newchart/TaskSchedule'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { StageResourcesForm } from '@/components/forms'
import StageResourceSection from '@/components/modules/dnd/project-plan/StageResourceSection'
import { ACTIONS_FIELD } from '@/constants/designTeamConstants'
import { Edit, Trash, ExportSquare } from 'iconsax-react'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'
import ProjectPlanDocuments from '@/components/modules/dnd/project-plan/ProjectPlanDocumentsPopup'
import ProceduresAndDocumentsSection from '@/components/modules/dnd/project-plan/ProceduresAndDocumentsSection'
import DesignTransferSection from '@/components/modules/dnd/project-plan/DesignTransferSection'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { useTeamsById } from '@/hooks/modules/dnd/useFormTeam'
import { AddButton, ButtonText, CommentsHistoryContainer, InlineStyles } from '@/styles/components/modules/taskSchedule'
import { LabelContainer, LabelText, LabelValue } from '@/styles/components/modules/prototypeForm'
import { useDeleteStage, useProjectStagesData } from '@/hooks/modules/dnd/useProjectStages'
import DataGridReOrderTable from '@/components/modules/dnd/project-plan/DataGridTableRowReorder'
import ReviewerModal from '@/components/modules/dnd/reviewer-modal/ReviewerModal'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { CANCELPATH } from '@/constants/modules/dnd/pnd-review'
import { PATH_TO_PRP } from '@/constants/modules/dnd/pnd'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { BUTTONSTYLE } from '@/styles/components/modules/projectStagesStyles'

/**
 Classification : Confidential
**/
const {
  PROJECT_ID,
  DESIGN_OBJECTIVE,
  SCHEDULE,
  STAGE_ORDER,
  TOOLS,
  EQUIPMENTS,
  RISK_MANAGEMENT_ACTIVITIES,
  VERIFICATION_METHOD,
  VALIDATION_METHOD,
  OTHER_DETAILS,
  METHOD_OF_TRACEABILITY,
  DOCUMENTS_TO_CREATE,
  DOCUMENTS_TO_DELETE,
  CREATE_META_DATA,
  UPDATE_META_DATA,
} = API_FIELD_KEYS
const { SUCCESS_ALERT, FAILED_ALERT, EMPTY_ARRAY_LENGTH, INDEX_ZERO } =
  COMMON_CONSTANTS

const DesignProjectPlan: React.FC = () => {
  const updatedInitialFormData: ProjectFormData = {
    ...INITIAL_FORM_DATA,
    toolsRequired: [],
    equipmentsRequired: [],
  }

  const [formData, setFormData] = useState<ProjectFormData>(
    updatedInitialFormData
  )
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS)
  const [isProjectStagesModalOpen, setIsProjectStagesModalOpen] =
    useState(false)
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [designInputModal, setDesignInputModal] = useState(false)
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [isStageResourceModalOpen, setIsStageResourceModalOpen] =
    useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [teamIdToEdit, setTeamIdToEdit] = useState(NUMBERMAP.ZERO)
  const [teamToEditRow, setTeamToEditRow] = useState(null)

  const [selectedStage, setSelectedStage] = useState<number>(NUMBERMAP.ZERO)
  const [modalTitle, setModalTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const theme = useTheme()
  const [stageOrderPayload, setStageOrderPayload] = useState<{ project_stage_order_id: number; stage_order: number }[]>([]);

  const params = useParams()
  const Project_Id = params.id as string

  const { data: projectPlanData, isLoading: isPlanLoading, isFetching: isProjectDataFetching, refetch: refetchProjectPlan, } = useProjectPlan(Number(Project_Id)) as {
    data: ProjectPlanResponse | undefined
    isLoading: boolean
    isFetching: boolean
    refetch: () => Promise<any>
  }

  const { data: toolsOptions, isLoading: isToolsLoading, isFetching: isToolsFetching } =
    useDesignTools() as { data: Option[] | undefined; isLoading: boolean; isFetching: boolean }
  const { data: equipmentsOptions, isLoading: isEquipmentsLoading, isFetching: isEquipmentsFetching } =
    useDesignEquipments() as { data: Option[] | undefined; isLoading: boolean; isFetching: boolean }
  const { data: digOptions, isFetching: isDigFetching } = useGetDesignInputGathering(Number(Project_Id))
  const { mutate: submitDigForProject, isPending: isDigSubmitPending } = useDesignInputGatheringSubmit()
  const upsertMutation = useUpsertProjectPlan(Number(Project_Id))
  const { refetch: refetchStages, isFetching: isStagesFetching } = useProjectStagesData(Number(Project_Id))
  const { refetch: refetchTeamById, isFetching: isTeamFetching } = useTeamsById(teamIdToEdit)
  const { mutate: deletePlan, isPending: isDeletePending } = useDeleteStage()
  const { mutate: saveReview, isPending: isReviewPending } = useSubmitReview("Project Plan")
  const router = useRouter()

  // Get permissions and calculate hasEditPermission early (following HLD pattern)
  const permissions = projectPlanData?.meta_info?.action_control?.permissions ?? []
  const { hasEditPermission } = processButtonsWithPermissions(permissions, {})

  const updatedStageColumns = STAGE_RESOURCE_COLUMNS.map((column) => {
    if (column.field === ACTIONS_FIELD) {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <IconButton
              onClick={() =>
                handleOpenProjectStagesModal(params.row.project_stage_order_id)
              }
              size={SIZE}
            >
              <Edit size={NUMBERMAP.EIGHTEEN} color={DATA_GRID_CONSTANTS.EDIT_ICON_COLOR} />
            </IconButton>
            <IconButton
              onClick={() =>
                hasEditPermission && handleDeleteClick(params.row.project_stage_order_id)
              }
              size={SIZE}
            >
              <Trash size={NUMBERMAP.EIGHTEEN} color={DATA_GRID_CONSTANTS.DELETE_ICON_COLOR} />
            </IconButton>
          </>
        ),
      }
    }
    if (column.field === SCHEDULE_COLUMNS.STAGE_NAME) {
      return {
        ...column,
        renderCell: (params: GridRenderCellParams) => (
          <div>{`${params.row.stage} ${params.row.stage_number}`}</div>
        ),
      }
    }
    return column
  })

  useEffect(() => {
    if (!projectPlanData?.data?.[INDEX_ZERO]) return

    const plan = projectPlanData.data[INDEX_ZERO]

    const newSchedule: ScheduleData[] = plan.schedule?.map(
      (stage: any): ScheduleData => ({
        project_build_stage_order_id: stage.project_build_stage_order_id,
        stage_name: stage.stage_name,
        stage_order: stage.stage_order,
        stage_number: stage.stage_number,
        stage_id: stage.stage_id,
        design_stage_id: stage.design_stage_id,
        activity: (stage.activity ?? []).map(
          (act: any): Task => ({
            activity_id: act.activity_id,
            activity: act.activity,
            activity_start_date: act.activity_start_date,
            activity_end_date: act.activity_end_date,
          })
        ),
      })
    )
    const newFormData: ProjectFormData = {
      ...formData,
      designType: plan.design_type ?? '',
      basicModel: Array.isArray(plan.models) ? plan.models.join(' , ') : '',
      designObjective: plan.design_objective ?? '',
      marketsIntended: plan.market_regulations ?? [],
      toolsRequired: [],
      tools: plan.tool?.map((tool: Tool) => tool.tool_id) ?? [],
      equipmentsRequired: [],
      equipments:
        plan.equipment?.map((equipment: Equipment) => equipment.equipment_id) ??
        [],
      riskManagement: plan.risk_management_activities ?? '',
      traceabilityMethod: plan.method_of_traceability ?? '',
      verificationMethod: plan.verification_method ?? '',
      validationMethod: plan.validation_method ?? '',
      projectStages: orderBaseListStages(plan.stage_data ?? []),
      designTeam: plan.team_data ?? [],
      stageResources: orderBaseListStages(plan.stage_data ?? []),
      designTransfer: plan.design_transfer ?? [],
      documentReferences: plan.document_reference ?? [],
      uploadedFile: plan.documents ?? [],
      otherDetails: plan.other_details ?? '',
      schedule: newSchedule,
    }
    setScheduleData(newSchedule)
    setFormData(newFormData)
  }, [projectPlanData])

  const handleFieldChange = (
    field: keyof ProjectFormData,
    value: string | string[] | File | File[]
  ) => {
    if(!hasEditPermission) return
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const orderBaseListStages = (stageData:[])=>{
    const sortResponse = [...stageData]
      return sortResponse?.toSorted((a: ProjectStage, b: ProjectStage) => a?.stage_order - b?.stage_order)
  }

  const refreshProjectPlanData = async () => {
    await refetchStages();
    const latestProjectPlan = await refetchProjectPlan();

    if (latestProjectPlan?.data?.data?.[NUMBERMAP.ZERO]) {
      const plan = latestProjectPlan.data.data[NUMBERMAP.ZERO];

      const newSchedule: ScheduleData[] = plan.schedule?.map((stage: any): ScheduleData => ({
        project_build_stage_order_id: stage.project_build_stage_order_id,
        stage_name: stage.stage_name,
        stage_order: stage.stage_order,
        stage_number: stage.stage_number,
        stage_id: stage.stage_id,
        design_stage_id: stage.design_stage_id,
        activity: (stage.activity ?? []).map((act: any): Task => ({
          activity_id: act.activity_id,
          activity: act.activity,
          activity_start_date: act.activity_start_date,
          activity_end_date: act.activity_end_date,
        })),
      }));

      setScheduleData(newSchedule);

      setFormData((prev) => ({
        ...prev,
        projectStages: orderBaseListStages(plan.stage_data ?? []),
        stageResources: orderBaseListStages(plan.stage_data ?? []),
        schedule: newSchedule,
      }));
    }
  };


  const handleStringChange = (field: StringFormField, value: string) => {
    if(!hasEditPermission) return
    handleFieldChange(field, value)
  }

  const handleArrayChange = (field: ArrayFormField, value: string[]) => {
    if(!hasEditPermission) return
    handleFieldChange(field, value)
  }

  const onFileUpload = (newFile: File | FileData2) => {
    handleFileUpload(newFile, setFormData, setErrors, errors)
  }

  const onFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      handleFileEdit(updatedFile, setFormData)
    },
    [setFormData]
  )

  const handleEditStageResource = (projectStageOrderId: number) => {
    setSelectedStage(projectStageOrderId)
    setIsStageResourceModalOpen(true)
  }

  const handleInitiateDIG = () => {
    if(!hasEditPermission) return
    setDesignInputModal(true)
  }

  const handleOpenProjectStagesModal = (projectStageOrderId: number) => {
    handleTemporarySubmit()
    setSelectedStage(projectStageOrderId)
    setIsProjectStagesModalOpen(true)
  }

  const handleCloseProjectStagesModal = async () => {
    setSelectedStage(NUMBERMAP.ZERO)
    setIsProjectStagesModalOpen(false)
    handleTemporarySubmit()
    await refreshProjectPlanData();
  }

  const handleDeleteClick = async (projectStageOrderId: number) => {
    if(!hasEditPermission) return
    const result = await showActionAlert(ALERT_TYPES.DELETE)
    if (result.isConfirmed) {
      deletePlan(projectStageOrderId, {
        onSuccess: () => {
          showActionAlert(SUCCESS_ALERT)
          setSelectedStage(NUMBERMAP.ZERO);
          setIsProjectStagesModalOpen(false);
          handleTemporarySubmit();
          refetchStages();
        },
        onError: () => {
          showActionAlert(FAILED_ALERT)
        },
      })
    }
  }

  const handleSaveProjectStages = async () => {
    setSelectedStage(NUMBERMAP.ZERO);
    setIsProjectStagesModalOpen(false);
    await refreshProjectPlanData();
  };

  const handleOpenModal = (title: string) => {
    setModalTitle(title)
    setIsModalOpen(true)
  }

  const handleCloseModal = async () => {
    setIsModalOpen(false)
    handleTemporarySubmit()
    await refreshProjectPlanData()
  }

  const handleOpenTeamModal = (designTeamId: number) => {
    setTeamIdToEdit(designTeamId)
    handleTemporarySubmit()
  }

  useEffect(() => {
    const editTeam = async () => {
      if (Number(teamIdToEdit)) {
        const response = await refetchTeamById()
        if (response?.data) {
          setTeamToEditRow(response.data.data[NUMBERMAP.ZERO])
          setIsTeamModalOpen(true)
        }
      }
    }
    editTeam()
  }, [teamIdToEdit])

  const validateFormData = (
    data: ProjectFormData
  ): { isValid: boolean; errors: FormErrors } => {
    let isValid = true
    const newErrors: FormErrors = { ...INITIAL_ERRORS }

    FORM_FIELDS.forEach((fieldConfig) => {
      const { field, label, required } = fieldConfig
      if (required) {
        if (typeof data[field] === TYPE_NAMES.STRING) {
          if (typeof data[field] === 'string' && !data[field].trim()) {
            newErrors[field] = VALIDATION_MESSAGES.FIELD_REQUIRED(
              label.replace('*', '')
            )
            isValid = false
          }
        } else if (Array.isArray(data[field])) {
          if (data[field].length === EMPTY_ARRAY_LENGTH) {
            newErrors[field] = VALIDATION_MESSAGES.FIELD_REQUIRED(
              label.replace('*', '')
            )
            isValid = false
          }
        }
      }
    })

    // Use validateAndFocusFirstEmptyField for focus management
    if (!isValid) {
      validateAndFocusFirstEmptyField(data, FIELD_ORDER, FIELD_LABEL_MAP)
    }

    return { isValid, errors: newErrors }
  }

  const handleSubmit = () => {
    const { isValid, errors: validationErrors } = validateFormData(formData)
    setErrors(validationErrors)

    if (!isValid) {
      return
    }

    submitToApi(formData, FINAL_SUBMIT)
  }

  const handleTemporarySubmit = () => {
    submitToApi(formData)
  }

  const buildSelectionPayload = (
    selectedValues: Array<string | number>,
    options: Option[] | undefined,
    payloadKeys: { IS_NEW: string; NAME: string; ID: string }
  ) => {
    return (selectedValues ?? []).map((value) => {
      const matched = options?.find((opt) => {
        const idMatch = String(opt[payloadKeys.ID]) === String(value)
        const nameMatch = String(opt[payloadKeys.NAME] ?? opt.value) === String(value)
        return idMatch || nameMatch
      })

      if (matched?.[payloadKeys.ID] !== undefined) {
        return {
          [payloadKeys.IS_NEW]: false,
          [payloadKeys.ID]: Number(matched[payloadKeys.ID]),
          [payloadKeys.NAME]: String(
            matched[payloadKeys.NAME] ?? matched.value ?? matched.label ?? value
          ),
        }
      }

      return {
        [payloadKeys.IS_NEW]: true,
        [payloadKeys.NAME]: String(value),
      }
    })
  }

  const submitToApi = (data: ProjectFormData, submitType?: string) => {
    const formData = new FormData()

    // Filter out activities with null dates before submitting
    const filteredSchedule = (data.schedule ?? scheduleData).map(stage => ({
      ...stage,
      activity: stage.activity.filter(act => 
        act.activity_start_date !== null && 
        act.activity_end_date !== null
      )
    }))

    formData.append(PROJECT_ID, Project_Id)
    formData.append(DESIGN_OBJECTIVE, data.designObjective)
    formData.append(RISK_MANAGEMENT_ACTIVITIES, data.riskManagement)
    formData.append(VERIFICATION_METHOD, data.verificationMethod)
    formData.append(VALIDATION_METHOD, data.validationMethod)
    formData.append(METHOD_OF_TRACEABILITY, data.traceabilityMethod)
    formData.append(OTHER_DETAILS, data.otherDetails ?? '')
    formData.append(SCHEDULE, JSON.stringify(filteredSchedule))
    formData.append(STAGE_ORDER, JSON.stringify(stageOrderPayload.length ? stageOrderPayload : []))

    const toolsPayload = buildSelectionPayload(
      data.tools ?? [],
      toolsOptions,
      TOOL_PAYLOAD_KEYS
    )
    const equipmentsPayload = buildSelectionPayload(
      data.equipments ?? [],
      equipmentsOptions,
      EQUIPMENT_PAYLOAD_KEYS
    )

    formData.append(TOOLS, JSON.stringify(toolsPayload))
    formData.append(EQUIPMENTS, JSON.stringify(equipmentsPayload))
    formData.append(
      DOCUMENTS_TO_DELETE,
      JSON.stringify(finalFileData.documents_to_delete ?? [])
    )
    formData.append(
      CREATE_META_DATA,
      JSON.stringify(finalFileData.create_meta_data ?? [])
    )
    formData.append(
      UPDATE_META_DATA,
      JSON.stringify(finalFileData.update_meta_data ?? [])
    )
    finalFileData?.documents_to_create?.forEach((fileData) => {
      if (fileData instanceof File) {
        formData.append(DOCUMENTS_TO_CREATE, fileData, fileData.name)
      }
    })

    upsertMutation.mutate(formData, {
      onSuccess: () => {
        if (submitType === FINAL_SUBMIT) {
          showActionAlert(SUCCESS_ALERT)
        }
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  const getMultiSelectOptions = (
    field: string,
    plan: ProjectPlanResponse['data'][NUMBERMAP.ZERO] | undefined
  ): Option[] => {
    const fallbackOptions: Record<string, Option[]> = {
      [FIELD_NAMES.TOOLS]:
        plan?.tool?.map((tool) => ({
          key: tool.tool_id.toString(),
          value: tool.tool_name,
        })) ?? [],
      [FIELD_NAMES.EQUIPMENTS]:
        plan?.equipment?.map((equipment) => ({
          key: equipment.equipment_id.toString(),
          value: equipment.equipment_name,
        })) ?? [],
      [FIELD_NAMES.DESIGN_TRANSFER]:
        plan?.design_transfer?.map((transfer) => ({
          key: transfer.transfer_id.toString(),
          value: transfer.transfer_type,
        })) ?? [],
      [FIELD_NAMES.DOCUMENT_REFERENCES]:
        plan?.document_reference?.map((doc) => ({
          key: doc.document_id.toString(),
          value: doc.document_name,
        })) ?? [],
    }

    const optionsMap: Record<string, Option[] | undefined> = {
      [FIELD_NAMES.TOOLS_REQUIRED]: toolsOptions,
      [FIELD_NAMES.TOOLS]: toolsOptions,
      [FIELD_NAMES.EQUIPMENTS_REQUIRED]: equipmentsOptions,
      [FIELD_NAMES.EQUIPMENTS]: equipmentsOptions,
    }

    const selectedOption = optionsMap[field]
    if (selectedOption?.length) {
      return selectedOption
    }

    return fallbackOptions[field] ?? []
  }

  const mergeSelectedIntoOptions = (
    base: Option[],
    selectedValues: Array<string | number>,
    idField: string,
    valueField: string
  ) => {
    const existing = new Set(
      base.map((opt) => String(opt[idField] ?? opt.key ?? opt.value))
    )
    const missing = (selectedValues ?? []).reduce<Option[]>((acc, val) => {
      const key = String(val)
      if (!existing.has(key)) {
        acc.push({ [idField]: key, [valueField]: key } as Option)
      }
      return acc
    }, [])
    return [...base, ...missing]
  }

  const renderFormField = (
    fieldConfig: (typeof FORM_FIELDS)[NUMBERMAP.ZERO],
    gridSize: { xs: number; md: number } = {
      xs: NUMBERMAP.TWELVE,
      md: NUMBERMAP.SIX,
    }
  ) => {
    const { field, label, placeholder, type, idField, valueField, disabled } =
      fieldConfig
    const plan = projectPlanData?.data?.[NUMBERMAP.ZERO]
    const options =
      type === COMPONENT_TYPES.MULTI_SELECT
        ? mergeSelectedIntoOptions(
            getMultiSelectOptions(field, plan),
            (formData[field] as Array<string | number>) ?? [],
            valueField ?? idField ?? 'key',
            valueField ?? 'value'
          )
        : []

    switch (type) {
      case COMPONENT_TYPES.INPUT_FIELD:
        return (
          <Grid2 size={gridSize} key={field}>
            <InputField
              label={label}
              placeholder={placeholder}
              value={formData[field] as string}
              onChange={(value: string) =>
                handleStringChange(field as StringFormField, value)
              }
              error={errors[field]}
              disabled={disabled ?? isPlanLoading}
            />
          </Grid2>
        )

      case COMPONENT_TYPES.RICH_TEXT_EDITOR:
        return (
          <Grid2 size={gridSize} key={field}>
              <Box>
                <Box sx={designObjectiveLabelContainer}>
                  <EditorLabel>{label}</EditorLabel>
                  {field === FIELD_KEYS.DESIGN_OBJECTIVE && (
                    <Link href={PATH_TO_PRP(Number(Project_Id))} prefetch>
                      <IconButton
                        sx={designObjectiveIconButton}
                      >
                        <ExportSquare size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main}/>
                      </IconButton>
                    </Link>
                  )}
                </Box>
            <RichTextEditor
              label=""
              value={formData[field] as string}
              onChange={(value) =>
                handleStringChange(field as StringFormField, value)
              }
              error={errors[field]}
              placeholder={placeholder}
              id={field}
              disabled={!hasEditPermission}
            />
           </Box>
          </Grid2>
        )

      case COMPONENT_TYPES.MULTI_SELECT:
        return (
          <Grid2 size={gridSize} key={field}>
            {(() => {
              const effectiveIdField =
                field === FIELD_NAMES.TOOLS || field === FIELD_NAMES.EQUIPMENTS
                  ? valueField ?? idField ?? ''
                  : idField ?? ''
              return (
            <MultiSelect
              customOption={true}
              label={label}
              placeholder={placeholder}
              options={options}
              idField={effectiveIdField}
              valueField={valueField ?? ''}
              value={formData[field] as string[]}
              onChange={(value) =>
                handleArrayChange(field as ArrayFormField, value as string[])
              }
              error={errors[field]}
              disabled={isToolsLoading ?? isPlanLoading ?? isEquipmentsLoading}
            />
              )
            })()}
          </Grid2>
        )

      case COMPONENT_TYPES.DESCRIPTION:
        return (
          <Grid2 size={gridSize} key={field}>
            <Description
              label={label}
              placeholder={placeholder}
              value={formData[field] as string}
              onChange={(value: string) =>
                handleStringChange(field as StringFormField, value)
              }
              error={errors[field]}
              disabled={disabled ?? isPlanLoading}
            />
          </Grid2>
        )

      default:
        return null
    }
  }

  const handleSaveDesignInputGathering = (digBody: DesignInputFormData) => {
    const updatedBody = {
      project_id: Project_Id,
      is_software_applicable: digBody.isSoftwareApplicable,
      is_usability_requirements_applicable: digBody.isUsabilityRequirementsApplicable,
      is_pov_applicable: digBody.isPOVApplicable,
      is_frs_applicable: digBody.isFRSApplicable,
    };
    submitDigForProject(updatedBody, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  const handleStagesReorder = (newStages: ProjectStage[]) => {
    if(!hasEditPermission) return
    setFormData((prev) => ({
      ...prev,
      projectStages: newStages,
    }));

    const payload = newStages.map((stage, idx) => ({
      project_stage_order_id: stage.project_stage_order_id,
      stage_order: idx + NUMBERMAP.ONE,
    }));
    setStageOrderPayload(payload);
  };

  // Helper to update a single activity's status in a stage
  function updateStageActivityStatus(activityList: Task[], activityId: number): Task[] {
    return activityList.map((act) =>
      act.activity_id === activityId
        ? { ...act, status: NUMBERMAP.ZERO }
        : act
    );
  }
   const handleCloseProjectPlanReviewModal = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }

  const handleProjectPlanButtonChange = (
      button_label: string,
      trigger_status_id?: number
    ) => {
      setButtonId(trigger_status_id || null)
      setButtonName(button_label)
      setIsReviewerModal(true)
    }
  
    // Update these handler functions to accept trigger_status_id parameter
    const handleProjectPlanSubmitForReview = (trigger_status_id?: number) => {
      handleProjectPlanButtonChange(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
    }
  
    const handleProjectPlanApprove = (trigger_status_id?: number) => {
      handleProjectPlanButtonChange(BUTTON_LABEL.APPROVE, trigger_status_id)
    }
  
    const handleProjectPlanReject = (trigger_status_id?: number) => {
      handleProjectPlanButtonChange(BUTTON_LABEL.REJECT, trigger_status_id)
    }
    const handleProjectPlanInitiate = (trigger_status_id?: number) => {
      handleProjectPlanButtonChange(BUTTON_LABEL.INITIATE, trigger_status_id)
    }
    const handleProjectPlanSubmit = (trigger_status_id?: number) => {
      const payload = {
        project_id: projectId,
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
      router.push(CANCELPATH)
    }
  
    const getButtons = getButtonConfig({
      handleSubmitForReview: handleProjectPlanSubmitForReview,
      handleApprove: handleProjectPlanApprove,
      handleReject: handleProjectPlanReject,
      handleCancel: handleCancel,
      handleSave: handleSubmit,
      handleInitiate: handleProjectPlanInitiate,
      handleSubmitApproval: handleProjectPlanSubmit,
      handleDIG: handleInitiateDIG,
      isDisabled: false,
    })

    const { buttons: buttonDetails } =
      processButtonsWithPermissions(permissions, getButtons)

    useEffect(() => {
      if(!buttonDetails && projectPlanData) {
        showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
      }
    },[buttonDetails, projectPlanData])

  // Comprehensive loading state function
  const isLoading = () => {
    if (isPlanLoading) return true
    if (isProjectDataFetching) return true
    if (isToolsLoading) return true
    if (isToolsFetching) return true
    if (isEquipmentsLoading) return true
    if (isEquipmentsFetching) return true
    if (isDigFetching) return true
    if (isDigSubmitPending) return true
    if (upsertMutation.isPending) return true
    if (isStagesFetching) return true
    if (isTeamFetching) return true
    if (isDeletePending) return true
    if (isReviewPending) return true
    return false
  }

  return (
    <Container className={CLASS_NAMES.CONTAINER}>
      <GlobalLoader loading={isLoading()} />
        {buttonDetails && (
        <>
       <Grid2 container>
      <Title>{PROJECT_PLAN_TITLES.DESIGN_PROJECT_PLAN_TITLE}</Title>
      <ContentWrapper className={CLASS_NAMES.CONTENT_WRAPPER}>
        <FormSection>
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
            <LabelContainer>
              <LabelText>{LABEL_TEXTS.DESIGN_TYPE}</LabelText>
              <LabelValue>{formData.designType ?? '-'}</LabelValue>
            </LabelContainer>
          </Grid2>
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
            <LabelContainer>
              <LabelText>{LABEL_TEXTS.BASIC_MODEL}</LabelText>
              <Tooltip title={formData.basicModel ?? '-'} arrow placement={TOOLTIP_DISPLAY.ARROW_PLACEMENT}>
                <TruncatedLabelValue>{formData.basicModel ?? '-'}</TruncatedLabelValue>
              </Tooltip>
            </LabelContainer>
          </Grid2>
        </FormSection>

        <FormSection>
          {renderFormField(FORM_FIELDS[NUMBERMAP.ZERO])}
        </FormSection>
        <FormSection>
            <DataGridTable
              rows={formData.marketsIntended ?? []}
              columns={MARKET_REGULATION_COLUMNS}
              idField={STAGE_FORM.MARKET_ID}
              hideFooter={true}
              title={LABEL_TEXTS.MARKETS_INTENDED}
            />
        </FormSection>
        <FormSection>
          <Grid2 size={GRID_SIZE}>
            <TaskSchedule
              stages={scheduleData.map((stage) => ({
                ...stage,
                activity: (stage.activity ?? []).map((act) => ({
                  ...act,
                  activity_start_date: act.activity_start_date instanceof Date
                    ? act.activity_start_date.toISOString().split('T')[NUMBERMAP.ZERO]
                    : act.activity_start_date,
                  activity_end_date: act.activity_end_date instanceof Date
                    ? act.activity_end_date.toISOString().split('T')[NUMBERMAP.ZERO]
                    : act.activity_end_date,
                  status: act?.status !== undefined ? act.status : String(NUMBERMAP.ONE),
                })),
              }))}
              allowDateEditing={hasEditPermission}
              onAddStages={() => {
                if(!hasEditPermission) return
                handleTemporarySubmit();
                setIsProjectStagesModalOpen(true);
              }}
              onUpdateStages={(updatedStages) => {
                const updated = updatedStages.map((stage) => ({
                  ...stage,
                  activity: (stage.activity ?? []).map((act) => {
                    if (act.status === undefined) {
                      return {
                        ...act,
                        activity_start_date: act.activity_start_date ? new Date(act.activity_start_date) : null,
                        activity_end_date: act.activity_end_date ? new Date(act.activity_end_date) : null,
                        status: '1',
                      };
                    }
                    return {
                      ...act,
                      activity_start_date: act.activity_start_date ? new Date(act.activity_start_date) : null,
                      activity_end_date: act.activity_end_date ? new Date(act.activity_end_date) : null,
                      status: act.status,
                    };
                  }),
                })) as ScheduleData[];

                setScheduleData([...updated]);
                setFormData((prev) => ({
                  ...prev,
                  schedule: [...updated],
                }));
              }}
              onDeleteActivity={(activityId: number, stageOrderId: number) => {
                if(!hasEditPermission) return
                setScheduleData((prev) => prev.map((stage) => {
                  if (stage.project_build_stage_order_id === stageOrderId) {
                    return {
                      ...stage,
                      activity: updateStageActivityStatus(stage.activity, activityId),
                    };
                  }
                  return stage;
                }));
                setFormData((prev) => ({
                  ...prev,
                  schedule: prev.schedule.map((stage) => {
                    if (stage.project_build_stage_order_id === stageOrderId) {
                      return {
                        ...stage,
                        activity: updateStageActivityStatus(stage.activity, activityId),
                      };
                    }
                    return stage;
                  }),
                }));
              }}
            />
          </Grid2>
        </FormSection>

        <FormSection>
          <Grid2 size={GRID_SIZE}>
            <Typography sx={designTeamSectionStyles.title}>
              {PROJECT_PLAN_TITLES.PROJECT_STAGES_TITLE}
            </Typography>
            <DataGridReOrderTable
              stages={(formData.projectStages ?? []).map(stage => ({
                ...stage,
                id: stage.project_stage_order_id,
              }))}
              columns={updatedStageColumns}
              onStagesReorder={hasEditPermission ? handleStagesReorder : () => {}}
            />
          </Grid2>
          <Grid2 size={GRID_SIZE}>
            <StageResourceSection
              stageResourceData={formData.stageResources}
              onEdit={(projectStageOrderId: number) => {
                handleEditStageResource(projectStageOrderId)
                handleTemporarySubmit()
              }}
            />
          </Grid2>
          <Grid2 size={GRID_SIZE}>
            <DesignHeaderRow>
              <Typography sx={designTeamSectionStyles.title}>
                {PROJECT_PLAN_TITLES.DESIGN_TEAM_TITLE}
              </Typography>
              <AddButton
                onClick={() => {
                  if(!hasEditPermission) return
                  handleTemporarySubmit()
                  setIsTeamModalOpen(true)
                }}
              >
                <AddIcon sx={InlineStyles.headerName} />
                {PROJECT_PLAN_TITLES.ADD_TEAM_TITLE}
              </AddButton>
            </DesignHeaderRow>
            <DesignTeamSection
              designTeamData={formData?.designTeam ?? []}
              onEdit={handleOpenTeamModal}
              onDelete={hasEditPermission ? handleTemporarySubmit : () => {}}
            />
          </Grid2>
        </FormSection>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={NUMBERMAP.SIX}></Grid2>
          <Grid2 size={GRID_SIZE}>
            <SectionHeaderRow>
              <SectionHeaderTitle>
                {PROJECT_PLAN_TITLES.QMS_PROCEDURES_AND_DOCUMENTS_TITLE}
              </SectionHeaderTitle>
              <AddButton
                onClick={() => {
                  handleOpenModal(DocumentReferenceHeader)
                  handleTemporarySubmit()
                }}
              >
                <AddIcon sx={InlineStyles.headerName} />
                <ButtonText>{PROJECT_PLAN_TITLES.SELECT_TITLE}</ButtonText>
              </AddButton>
            </SectionHeaderRow>
            <ProceduresAndDocumentsSection
              documentReferenceData={
                (formData.documentReferences ?? []).map((doc: any) => ({
                  id: doc.document_id,
                  ...doc
                }))
              }
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}></Grid2>
          <Grid2 size={GRID_SIZE}>
            <SectionHeaderRow>
              <SectionHeaderTitle>
                {PROJECT_PLAN_TITLES.DESIGN_TRANSFER_TITLE}
              </SectionHeaderTitle>
              <AddButton 
                onClick={() => {
                  handleOpenModal(DesignTransferHeader)
                  handleTemporarySubmit()
                }}
              >
                <AddIcon sx={InlineStyles.headerName} />
                <ButtonText>{PROJECT_PLAN_TITLES.SELECT_TITLE}</ButtonText>
              </AddButton>
            </SectionHeaderRow>
            <DesignTransferSection
              designTransferData={
                (formData.designTransfer ?? []).map((item: any) => ({
                  id: item.transfer_id,
                  pre_transfer: item.pre_transfer,
                  final_design_transfer: item.final_design_transfer,
                  ...item
                }))
              }
            />
          </Grid2>
        </Grid2>

        <FormSection>
          {renderFormField(FORM_FIELDS[NUMBERMAP.ONE])}
          {renderFormField(FORM_FIELDS[NUMBERMAP.TWO])}
        </FormSection>
        <FormSection>
          {renderFormField(FORM_FIELDS[NUMBERMAP.THREE])}
          {renderFormField(FORM_FIELDS[NUMBERMAP.FOUR])}
        </FormSection>
        <FormSection>
          {renderFormField(FORM_FIELDS[NUMBERMAP.FIVE])}
          {renderFormField(FORM_FIELDS[NUMBERMAP.SIX])}
         </FormSection> 
        <FormSection>{renderFormField(FORM_FIELDS[NUMBERMAP.SEVEN])}</FormSection>
        <FormSection>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager
              hasEditable={!hasEditPermission}
              initialFiles={formData.uploadedFile}
              onFileUpload={onFileUpload}
              onFileEdit={onFileEdit}
              onSubmit={(data) => {
                setFinalFileData((prev) => mergeFinalFileData(prev, data))
              }}
            />
          </Grid2>
        </FormSection>
      </ContentWrapper>

      <ProjectStagesPopupForm
        open={isProjectStagesModalOpen}
        initialData={{
          design_stage: '',
          stage_id: String(NUMBERMAP.ZERO),
          stage_count: String(NUMBERMAP.ZERO)
        }}
        projectId={Number(Project_Id)}
        onClose={handleCloseProjectStagesModal}
        projectStageOrderId={selectedStage}
        isEditMode={Boolean(selectedStage)}
        onSave={handleSaveProjectStages}
        hasEditPermission={hasEditPermission}
      />
      <PopupForm
        onSave={(digBody) => handleSaveDesignInputGathering(digBody)}
        onClose={() => {
          setDesignInputModal(false)
        }}
        open={designInputModal}
        initialData={digOptions?.data ?? []}
      />
      <FormTeam
        open={isTeamModalOpen}
        onClose={async () => {
          setIsTeamModalOpen(false)
          setTeamIdToEdit(NUMBERMAP.ZERO)
          setTeamToEditRow(null)
          handleTemporarySubmit()
          await refreshProjectPlanData()
        }}
        teamToEdit={teamToEditRow ?? undefined}
        hasEditPermission={hasEditPermission}
      />
      <StageResourcesForm
        open={isStageResourceModalOpen}
        onClose={() => {
          setIsStageResourceModalOpen(false)
          handleTemporarySubmit()
        }}
        project_build_stage_order_id={selectedStage}
        onSave={handleEditStageResource}
        hasEditPermission={hasEditPermission}
      />
      <CommonModal
        open={isModalOpen}
        title={modalTitle}
        onClose={handleCloseModal}
      >
        <ProjectPlanDocuments
          title={modalTitle}
          initialSelectedItems={
            modalTitle === DesignTransferHeader
              ? formData.designTransfer
              : formData.documentReferences
          }
          projectId={Number(Project_Id)}
          onClose={handleCloseModal}
          hasEditPermission={hasEditPermission}
        />
      </CommonModal>
      </Grid2>
      <CommentsHistoryContainer>
        <CommentsHistory
          comments={projectPlanData?.meta_info?.task_info?.task_comments}
        />
      </CommentsHistoryContainer>
      </>
        )}
        <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
    <ButtonGroup buttons={buttonDetails ?? []} />
     <ReviewerModal
                    open={isReviewerModal}
                    onClose={handleCloseProjectPlanReviewModal}
                    project_id={Project_Id}
                    button_id={buttonId}
                    mode={buttonName}
                    menu_id={projectPlanData?.meta_info?.action_control?.menuId}
                    menu_name={projectPlanData?.meta_info?.action_control?.formName}
                    reviewerList={projectPlanData?.meta_info?.task_info?.reviewer_list}
                  />
        </Grid2>
    </Container>
  )
}

export default DesignProjectPlan
