'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Grid2 } from '@mui/material'
import { useRouter, useParams } from 'next/navigation'
import {
  ButtonGroup,
  InputField,
  Description,
  MultiSelect,
  RadioButtonGroup,
  Label,
  showActionAlert,
} from '@/components/ui'
import { ProjectFormData } from '@/types/modules/dnd/project'
import {
  useProjectInfo,
  useSaveProject,
  useGetProductCategory,
  useGetProductGroup, 
  useGetProductType,
  useGetProductSubType,
  useGetMarketList,
  useGetRegulationList,
} from '@/hooks/modules/dnd/useProject'
import { Content, Container, FormSection } from '@/styles/modules/dnd/market'
import {
  FORM_FIELDS_CONFIG,
  API_PARAMS,
  ROUTE_PATHS,
  PROJECT_TYPES,
  COMMON_CONSTANTS,
  ALERT_MESSAGES,
  ValueType,
  REASON_OPTIONS,
  VALIDATION_ORDER,
  FIELD_LABEL_MAP,
  getProjectPageTitle,
  MARKET_REGULATION_REQUIRED,
  FIELD_NAMES,
} from '@/constants/modules/dnd/project'
import { GRID_SIZES } from '@/styles/modules/dnd/project'
import {
  getEngineeringChangeErrors,
  createPayload,
  validateProjectFields,
  useDebounce,
  projectInitialValue,
} from '@/lib/modules/dnd/project'
import { BUTTON_LABEL, FINALFILEINITIALDATA, getButtonConfig, NUMBERMAP, STATUS } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import {
  FileData,
  FileData2,
} from '@/components/ui/file-upload-v2/fileUploadTypes'
import {
  COMMON_CONSTANTS as GLOBAL_CONSTANTS,
  mergeFinalFileData,
  processButtonsWithPermissions,
} from '@/lib/utils/common'
import { StatusKey } from '@/types/components/ui/alertModal'
import { DocumentStructure, UploadedFileData } from '@/types/modules/dnd/hld'
import ReviewerModal from '@/components/modules/dnd/reviewer-modal/ReviewerModal'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import ProjectDetailsLoader from '@/components/modules/dnd/project-details/ProjectDetailsLoader'

/**
 Classification : Confidential
**/
const getProductTypeId = (productTypeId: number): string | null => {
  if (!productTypeId) return null
  return String(productTypeId)
}

const getProductSubTypeId = (productSubTypeId: number): string | null => {
  if (!productSubTypeId) return null
  return String(productSubTypeId)
}

const initializeFormData = (
  projectData: string | null,
  Project_Id: string | null,
  setProjectFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>,
  setMetaData: React.Dispatch<React.SetStateAction<FileData[]>>,
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>,
  projectInitialValue: ProjectFormData
) => {
  if (!Project_Id) {
    setProjectFormData((prev) => ({
      ...prev,
      ...projectInitialValue,
      product_type_id: null,
      product_sub_type_id: null,
      regulations: [],
      market: [],
    }))
    setIsUpdate(false)
    setMetaData([])
    return
  }
  const projectDataExists =
    projectData?.data &&
    Object.keys(projectData.data).length > COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH
  if (!projectDataExists) return

  setIsUpdate(true)

  const newFormData: ProjectFormData = {
    ...projectInitialValue,
    ...projectData.data,
    product_type_id: getProductTypeId(projectData?.data?.product_type_id),
    product_sub_type_id: getProductSubTypeId(
      projectData?.data?.product_subtype_id
    ),
    product_sub_type: String(projectData?.data?.product_subtype ?? ''),
    steps: projectData?.data?.steps ?? projectInitialValue.steps,
    regulations: Array.isArray(projectData?.data?.regulations)
      ? projectData.data.regulations
      : [],
    market: Array.isArray(projectData?.data?.market)
      ? projectData.data.market
      : [],
  }
  setProjectFormData(newFormData)

  const initialMarketRegulationsMap: Record<string, string[]> = {}
  if (
    Array.isArray(projectData?.data?.market) &&
    Array.isArray(projectData?.data?.regulations)
  ) {
    projectData.data.market.forEach((market: string, index: number) => {
      initialMarketRegulationsMap[market] = projectData.data.regulations.filter(
        (_: string, i: number) => i % projectData.data.market.length === index
      )
    })
  }

  const existingFiles: FileData[] =
    projectData?.data?.documents?.map(
      (
        doc: {
          media_id: number
          name: string
          source: string
          created_date: string
          category_id: string
          category: string
          status: string | number
          purpose: string
          description: string
          tags: { tag_name: string }[]
        },
        index: number
      ) => {
        const docId = doc?.media_id
          ? doc.media_id.toString()
          : `temp-${Date.now()}-${index}`
        return {
          id: docId,
          name: doc?.name ?? '',
          source: doc?.source ?? '',
          uploadDate: doc?.created_date?.split('T')[0] ?? '',
          category: doc?.category ?? 'Document',
          categoryId: doc?.category_id ?? '',
          status:
            doc?.status === GLOBAL_CONSTANTS.ACTIVE_STATUS
              ? 'Active'
              : 'Pending',
          purpose: doc?.purpose ?? '',
          description: doc?.description ?? '',
          tags:
            doc?.tags?.map((tag: { tag_name: string }) => tag.tag_name) ?? [],
        }
      }
    ) ?? []
  setMetaData(existingFiles)
}

const handleSubTypeChange = (
  value: string | null,
  productSubTypeList: {
    data: { product_sub_type_id: string | number; product_sub_type: string }[]
  },
  setProjectFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>,
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof ProjectFormData, string>>>
  >
) => {
  const selectedSubTypeId = value
  const selectedSubType =
    productSubTypeList.data.find(
      (item) => String(item.product_sub_type_id) === selectedSubTypeId
    )?.product_sub_type ?? ''

  setProjectFormData((prevData) => ({
    ...prevData,
    product_sub_type_id: selectedSubTypeId,
    product_sub_type: selectedSubType,
  }))
  setErrors((prevErrors) => ({
    ...prevErrors,
    product_sub_type_id: '',
    product_sub_type: '',
  }))
}

const handleReasonChange = (
  value: string,
  setProjectFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>,
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof ProjectFormData, string>>>
  >
) => {
  setProjectFormData((prevData) => {
    const newData = { ...prevData, project_reason: value }
    if (value === PROJECT_TYPES.ENGINEERING_CHANGE) {
      newData.is_hld_required = COMMON_CONSTANTS.INDEX_ZERO
      newData.is_pnd_required = COMMON_CONSTANTS.INDEX_ZERO
      newData.is_feasibility_study_required = COMMON_CONSTANTS.INDEX_ZERO
    } else if (value === REASON_OPTIONS) {
      newData.is_hld_required = COMMON_CONSTANTS.INDEX_ONE
      newData.is_pnd_required = COMMON_CONSTANTS.INDEX_ONE
      newData.is_feasibility_study_required = COMMON_CONSTANTS.INDEX_ONE
      newData.market = []
      newData.regulations = []
    }
    return newData
  })
  setErrors((prevErrors) => ({
    ...prevErrors,
    ...getEngineeringChangeErrors(),
    project_reason: '',
    market: '',
    regulations: '',
  }))
}

const prepareFormData = (
  projectFormData: ProjectFormData,
  createProjectForm: FormData
): Record<string, string> => {
  const projectFields: Record<string, string> = {}
  Object.entries(FORM_FIELDS_CONFIG.FIELDS_TO_APPEND_CONFIG).forEach(
    ([key, transform]) => {
      if (
        key === 'product_type' ||
        key === 'product_sub_type' ||
        key === 'documents_to_create'
      )
        return
      const value = transform(projectFormData)
      if (value !== null && value !== undefined && value !== '') {
        createProjectForm.append(key, value.toString())
        projectFields[key] = value.toString()
      }
    }
  )
  if (projectFormData.product_type_id) {
    createProjectForm.append(
      'product_type',
      String(projectFormData.product_type_id)
    )
    projectFields['product_type'] = String(projectFormData.product_type_id)
  }
  if (projectFormData.product_sub_type_id) {
    createProjectForm.append(
      'product_sub_type',
      String(projectFormData.product_sub_type_id)
    )
    projectFields['product_sub_type'] = String(
      projectFormData.product_sub_type_id
    )
  }
  return projectFields
}

const handleSaveError = (
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  showActionAlert: (message: StatusKey) => void
) => {
  setIsDisabled(false)
  showActionAlert(ALERT_MESSAGES.FAILED as StatusKey)
}

const renderProductSubType = (
  projectFormData: ProjectFormData,
  productSubTypeList: {
    data: { product_sub_type_id: string; product_sub_type: string }[]
  } | null,
  errors: Partial<Record<keyof ProjectFormData, string>>,
  handleInputChange: (name: keyof ProjectFormData, value: string | null) => void,
  hasEditPermission :boolean
) => {
  const errorMessage =
    errors.product_sub_type_id ?? errors.product_sub_type ?? ''
  const placeholder = 'Select product sub type'
  return (
    <InputField
      {...FORM_FIELDS_CONFIG.PRODUCT_SUB_TYPE}
      options={productSubTypeList?.data ?? []}
      hasEditable={!hasEditPermission}
      isDropdown
      value={
        projectFormData.product_sub_type_id
          ? String(projectFormData.product_sub_type_id)
          : null
      }
      onChange={(value: string | null) =>
        handleInputChange(FORM_FIELDS_CONFIG.PRODUCT_SUB_TYPE.onChange, value)
      }
      error={errorMessage}
      keyField="product_sub_type_id"
      valueField="product_sub_type"
      placeholder={placeholder}
    />
  )
}

const CreateNewProject: React.FC = () => {
  const router = useRouter()
  const parems = useParams()
  const Project_Id = Number(parems.id)
  const [isUpdate, setIsUpdate] = useState(false)
  const [metaData, setMetaData] = useState<FileData[]>([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    ...projectInitialValue,
    product_type_id: null,
    product_sub_type_id: null,
  })
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProjectFormData, string>>
  >({})
  const debouncedValue = useDebounce(projectFormData.market, NUMBERMAP.FIVEHUNDRED)
  const debouncedProductTypeId = useDebounce(
    projectFormData.product_type_id,
    NUMBERMAP.FIVEHUNDRED
  )

  const { data: projectData, refetch: updateRefetch, isLoading: isDataLoading, isFetching: isProjectDataFetching } = useProjectInfo(Number(Project_Id))
  const { data: categoryList, refetch: productCategoryRefetch, isFetching: isCategoryFetching } =
    useGetProductCategory()
  const { data: productGroupList, refetch: productGroupRefetch, isFetching: isGroupFetching } =
    useGetProductGroup()
  const { data: productTypeList, refetch: productTypeRefetch, isFetching: isTypeFetching } =
    useGetProductType()
  const {
    data: productSubTypeList,
    isFetching: isSubTypeFetching
  } = useGetProductSubType(
    debouncedProductTypeId ? [debouncedProductTypeId] : []
  )
  const { data: marketList, refetch: productMarketRefetch, isFetching: isMarketFetching } = useGetMarketList()
  const { data: regulationsList, isFetching: isRegulationFetching } = useGetRegulationList(
    debouncedValue.length > NUMBERMAP.ZERO ? debouncedValue : []
  )
  const { mutate: saveProject, isPending: isSavePending } = useSaveProject()
  const { mutate: saveReview, isPending: isReviewPending } = useSubmitReview(projectData?.meta_info?.action_control?.formName)

  useEffect(() => {
    productCategoryRefetch()
    productGroupRefetch()
    productTypeRefetch()
    productMarketRefetch()
  }, [
    productCategoryRefetch,
    productGroupRefetch,
    productTypeRefetch,
    productMarketRefetch,
  ])

  useEffect(() => {
    if (projectData?.data) {
      if (projectData.data.length > NUMBERMAP.ZERO) {
        const projectListData = { data: projectData.data[0] }
        initializeFormData(
          projectListData,
          Project_Id,
          setProjectFormData,
          setMetaData,
          setIsUpdate,
          projectInitialValue
        )
      }
    }

  }, [projectData, Project_Id])

  useEffect(() => {
    if (!projectFormData.market.length && projectFormData.regulations.length) {
      setProjectFormData((prev) => ({ ...prev, regulations: [] }))
      setErrors((prev) => ({ ...prev, regulations: '' }))
    }
    if (
      !projectFormData.product_type_id &&
      projectFormData.product_sub_type_id
    ) {
      setProjectFormData((prev) => ({
        ...prev,
        product_sub_type_id: null,
        product_sub_type: '',
      }))
      setErrors((prev) => ({
        ...prev,
        product_sub_type_id: '',
        product_sub_type: '',
      }))
    }
  }, [projectFormData.market, projectFormData.product_type_id])

  const normalizeValue = (
    name: keyof ProjectFormData,
    value: ValueType
  ): ProjectFormData[keyof ProjectFormData] => {
    const normalizationRules: Partial<
      Record<
        keyof ProjectFormData,
        (val: ValueType) => ProjectFormData[keyof ProjectFormData]
      >
    > = {
      [FORM_FIELDS_CONFIG.PRODUCT_GROUP.onChange]: (val) => String(val ?? ''),
      [FORM_FIELDS_CONFIG.PROJECT_REASON.onChange]: (val) => String(val ?? ''),
      [FORM_FIELDS_CONFIG.PRODUCT_TYPE.onChange]: (val) =>
        (val as string | null) ?? null,
    }
    return (
      normalizationRules[name]?.(value) ??
      (value as ProjectFormData[keyof ProjectFormData])
    )
  }

  const handleInputChange = (
    name: keyof ProjectFormData,
    value: string | number | null | (string | number)[]
  ) => {
    if (JSON.stringify(projectFormData[name]) === JSON.stringify(value) || !hasEditPermission) return

    if (name === FORM_FIELDS_CONFIG.PRODUCT_SUB_TYPE.onChange) {
      handleSubTypeChange(
        value as string | null,
        productSubTypeList,
        setProjectFormData,
        setErrors
      )
      return
    }

    if (name === FORM_FIELDS_CONFIG.PROJECT_REASON.onChange) {
      handleReasonChange(String(value ?? ''), setProjectFormData, setErrors)
      return
    }

    if (name === FORM_FIELDS_CONFIG.PRODUCT_MARKET.onChange) {
      const newMarkets: (string | number)[] = value as (string | number)[]
      const oldMarkets: (string | number)[] = projectFormData.market ?? []
      const removedMarkets = oldMarkets.filter((m) => !newMarkets.includes(m))

      setProjectFormData((prev) => {
        let newRegulations = prev.regulations
        if (removedMarkets.length > 0) {
          newRegulations = prev.regulations.filter(
            (regId): regId is string => !removedMarkets.includes(regId)
          )
        }
        return {
          ...prev,
          [name]: newMarkets as string[] | number[],
          regulations: newRegulations as string[] | number[],
        }
      })

      setErrors((prev) => ({ ...prev, [name]: '' }))
      return
    }

    if (name === FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS.onChange) {
      const newRegulations: (string | number)[] = value as (string | number)[]

      setProjectFormData((prev) => ({
        ...prev,
        [name]: newRegulations as string[] | number[],
      }))

      setErrors((prev) => ({ ...prev, [name]: '' }))
      return
    }

    setProjectFormData((prev) => ({
      ...prev,
      [name]: normalizeValue(name, value),
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      if(!hasEditPermission) return
      setProjectFormData((prev) => {
        const updatedFiles = prev.documents.map((file) => {
          const currentId =
            typeof file === 'object'
              ? ((file as File).file_id ?? (file as UploadedFileData).id)
              : undefined
          const updatedId = updatedFile.document_id ?? updatedFile.id

          return currentId === updatedId ? { ...file, ...updatedFile } : file
        })

        return {
          ...prev,
          documents: updatedFiles,
        }
      })
    },
    []
  )

  const processFileUploads = async (
    metaData: FileData[],
    createProjectForm: FormData
  ) => {
    if (finalFileData.create_meta_data) {
      createProjectForm.append(
        'create_meta_data',
        JSON.stringify(finalFileData.create_meta_data)
      )
    }
    if (finalFileData.update_meta_data) {
      createProjectForm.append(
        'update_meta_data',
        JSON.stringify(finalFileData.update_meta_data)
      )
    }
    for (const fileData of finalFileData.documents_to_create) {
      if (fileData instanceof File) {
        createProjectForm.append('documents_to_create', fileData, fileData.name)
      }
    }
  }

  const handleFileUpload = async (newFile: File | FileData2) => {
    try {
      setProjectFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, newFile],
      }))
    } catch {
      throw new Error('Failed to process file. Please try again.')
    }
  }

  const validateForm = () => {
    const fieldsToValidate = VALIDATION_ORDER.filter((key) =>
      projectFormData.project_reason === REASON_OPTIONS
        ? ![
            'market',
            'regulations',
            'is_hld_required',
            'is_pnd_required',
            'is_feasibility_study_required',
          ].includes(key)
        : true
    )

    const newErrors = validateProjectFields(
      projectFormData,
      fieldsToValidate,
      productSubTypeList?.data ?? []
    )

    const validateMarketReg =
      fieldsToValidate.includes(FIELD_NAMES.PRODUCT_MARKET) ?? fieldsToValidate.includes(FIELD_NAMES.PRODUCT_REGULATIONS)

    if (validateMarketReg) {
      const markets = Array.isArray(projectFormData.market)
        ? projectFormData.market
        : []
      const regulations = Array.isArray(projectFormData.regulations)
        ? projectFormData.regulations
        : []
        if (regulations.length < markets.length) {
        newErrors.regulations = MARKET_REGULATION_REQUIRED
      }
    }

    setErrors(newErrors)

    const hasValidationErrors =
      Object.keys(newErrors).length > COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH

    // Only check for empty fields if there are no validation errors
    const isValid = !hasValidationErrors
      ? true
      : validateAndFocusFirstEmptyField(
          projectFormData,
          fieldsToValidate,
          FIELD_LABEL_MAP
        )

    return !hasValidationErrors && isValid
  }

  const handleCancel = () => {
    setProjectFormData({
      ...projectInitialValue,
      product_type_id: null,
      product_sub_type_id: null,
      market: [],
      regulations: [],
      documents: [],
    })
    setErrors({})
    setMetaData([])
    router.push(ROUTE_PATHS.PROJECT_LIST)
  }

  const handleSave = async () => {
    if (!validateForm() || !hasEditPermission) return
    setIsDisabled(true)
    const createProjectForm = new FormData()

    try {
      prepareFormData(projectFormData, createProjectForm)
      await processFileUploads(metaData, createProjectForm)
      const payload = createPayload({
        isUpdate,
        projectFormData,
        createProjectForm,
        documentIdToDelete: finalFileData.documents_to_delete,
        activeStatus: COMMON_CONSTANTS.ACTIVE_STATUS,
        projectStatus: API_PARAMS.STATUS,
        organizationProjectId: API_PARAMS.ORGANIZATION_PROJECT_ID,
        documentsToDelete: API_PARAMS.DOCUMENTS_TO_DELETE,
      })
      saveProject(payload, {
        onSuccess: () => {
          setIsDisabled(false)
          showActionAlert(ALERT_MESSAGES.SUCCESS)
          setFinalFileData(FINALFILEINITIALDATA)
          if (!Project_Id) {
            router.push(ROUTE_PATHS.PROJECT_LIST);
          }else{
              updateRefetch();
          }
        
        },
        onError: () => handleSaveError(setIsDisabled, showActionAlert),
      })
    } catch {
      handleSaveError(setIsDisabled, showActionAlert)
    }
  }
  const handleCloseReviewerModalProject = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }

  // Update getButtonConfig to pass trigger_status_id to handleSubmitReviewModal
  const handleButtonChangeProject = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }

  // Update these handler functions to accept trigger_status_id parameter
  const handleSubmitForReviewProject = (trigger_status_id?: number) => {
    handleButtonChangeProject(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApproveProject = (trigger_status_id?: number) => {
    handleButtonChangeProject(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleRejectProject = (trigger_status_id?: number) => {
    handleButtonChangeProject(BUTTON_LABEL.REJECT, trigger_status_id)
  }

  const handleSubmitApprovalProject = (trigger_status_id?: number) => {
    const payload = {
      project_id: Project_Id,
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

  const isAnyLoading = () => {
    if (isDataLoading) return true
    if (isProjectDataFetching) return true
    if (isCategoryFetching) return true
    if (isGroupFetching) return true
    if (isTypeFetching) return true
    if (isSubTypeFetching) return true
    if (isMarketFetching) return true
    if (isRegulationFetching) return true
    if (isSavePending) return true
    if (isReviewPending) return true
    return false
  }  

  const getButtons = getButtonConfig({
    handleSubmitForReview: handleSubmitForReviewProject,
    handleApprove: handleApproveProject,
    handleReject: handleRejectProject,
    handleCancel: handleCancel,
    handleSave: handleSave,
    handleSubmitApproval: handleSubmitApprovalProject,
    isDisabled: isDisabled,
  })


  const permissions = projectData?.meta_info?.action_control?.permissions ?? [{ action: 'Save' }, { action: 'Cancel' }, { action: 'view' }]

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, getButtons)

  // Use the constant function to determine the title
  const pageTitle = getProjectPageTitle(Number(Project_Id));

  return (
    <>
      <ProjectDetailsLoader loading={isAnyLoading()} />
      <Container>
        <Label title={pageTitle} />
      <Grid2 container spacing={NUMBERMAP.ONE} >
        <Content>
          <FormSection>
            <Grid2 container spacing={NUMBERMAP.ONE} >
              <Grid2 size={GRID_SIZES.THIRD_WIDTH}>
                <RadioButtonGroup
                  {...FORM_FIELDS_CONFIG.PROJECT_REASON}
                  value={projectFormData.project_reason ?? ''}
                  onChange={(value) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PROJECT_REASON.onChange,
                      value
                    )
                  }
                  error={errors.project_reason}
                  disabled={isUpdate}
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <InputField
                  {...FORM_FIELDS_CONFIG.PRODUCT_NAME}
                  value={projectFormData.product_name ?? ''}
                  onChange={(value: string | null) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_NAME.onChange,
                      value
                    )
                  }
                  error={errors.product_name}
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <InputField
                  {...FORM_FIELDS_CONFIG.GENERIC_NAME}
                  value={projectFormData.product_generic_name ?? ''}
                  onChange={(value: string | null) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.GENERIC_NAME.onChange,
                      value
                    )
                  }
                  error={errors.product_generic_name}
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <InputField
                  {...FORM_FIELDS_CONFIG.PRODUCT_GROUP}
                  hasEditable={!hasEditPermission}
                  value={
                    projectFormData.product_group_id
                      ? String(projectFormData.product_group_id)
                      : ''
                  }
                  onChange={(value: string | null) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_GROUP.onChange,
                      value
                    )
                  }
                  error={errors.product_group_id}
                  options={productGroupList?.data ?? []}
                  keyField="product_group_id"
                  valueField="product_group"
                  isDropdown
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <InputField
                  {...FORM_FIELDS_CONFIG.PRODUCT_CATEGORY}
                  hasEditable={!hasEditPermission}
                  value={
                    projectFormData.product_category_id
                      ? String(projectFormData.product_category_id)
                      : ''
                  }
                  onChange={(value: string | null) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_CATEGORY.onChange,
                      value
                    )
                  }
                  error={errors.product_category_id}
                  options={categoryList?.data ?? []}
                  keyField="product_category_id"
                  valueField="product_category"
                  isDropdown
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <InputField
                  {...FORM_FIELDS_CONFIG.PRODUCT_TYPE}
                  hasEditable={!hasEditPermission}
                  options={productTypeList?.data ?? []}
                  value={
                    projectFormData.product_type_id
                      ? String(projectFormData.product_type_id)
                      : ''
                  }
                  onChange={(value: string | null) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_TYPE.onChange,
                      value
                    )
                  }
                  error={errors.product_type_id}
                  keyField="product_type_id"
                  valueField="product_type"
                  isDropdown
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                {renderProductSubType(
                  projectFormData,
                  productSubTypeList,
                  errors,
                  handleInputChange,
                  hasEditPermission
                )}
              </Grid2>
              {projectFormData.project_reason !== REASON_OPTIONS && (
                <>
                  <Grid2 size={GRID_SIZES.QUARTER_WIDTH}>
                    <RadioButtonGroup
                      {...FORM_FIELDS_CONFIG.IS_HLD_REQUIRED}
                      value={
                        projectFormData.is_hld_required ??
                        COMMON_CONSTANTS.INDEX_ZERO
                      }
                      onChange={(value) =>
                        handleInputChange(
                          FORM_FIELDS_CONFIG.IS_HLD_REQUIRED.onChange,
                          value
                        )
                      }
                      error={errors.is_hld_required}
                      disabled={
                        projectFormData.project_reason ===
                        PROJECT_TYPES.ENGINEERING_CHANGE
                      }
                    />
                  </Grid2>
                  <Grid2 size={GRID_SIZES.SIXTH_WIDTH}>
                    <RadioButtonGroup
                      {...FORM_FIELDS_CONFIG.IS_PND_REQUIRED}
                      value={
                        projectFormData.is_pnd_required ??
                        COMMON_CONSTANTS.INDEX_ZERO
                      }
                      onChange={(value) =>
                        handleInputChange(
                          FORM_FIELDS_CONFIG.IS_PND_REQUIRED.onChange,
                          value
                        )
                      }
                      error={errors.is_pnd_required}
                      disabled={
                        projectFormData.project_reason ===
                        PROJECT_TYPES.ENGINEERING_CHANGE
                      }
                    />
                  </Grid2>
                  <Grid2 size={GRID_SIZES.QUARTER_WIDTH}>
                    <RadioButtonGroup
                      {...FORM_FIELDS_CONFIG.IS_FEASIBILITY_STUDY_REQUIRED}
                      value={
                        projectFormData.is_feasibility_study_required ??
                        COMMON_CONSTANTS.INDEX_ZERO
                      }
                      onChange={(value) =>
                        handleInputChange(
                          FORM_FIELDS_CONFIG.IS_FEASIBILITY_STUDY_REQUIRED.onChange,
                          value
                        )
                      }
                      error={errors.is_feasibility_study_required}
                      disabled={
                        projectFormData.project_reason ===
                        PROJECT_TYPES.ENGINEERING_CHANGE
                      }
                    />
                  </Grid2>
                </>
              )}
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <MultiSelect
                  {...FORM_FIELDS_CONFIG.PRODUCT_MARKET}
                  label={
                    projectFormData.project_reason === REASON_OPTIONS
                      ? FORM_FIELDS_CONFIG.PRODUCT_MARKET_WITHOUT_CONFIRMATION.label
                      : FORM_FIELDS_CONFIG.PRODUCT_MARKET.label
                  }
                  options={marketList?.data ?? []}
                  value={projectFormData.market ?? []}
                  onChange={(value) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_MARKET.onChange,
                      value
                    )
                  }
                  error={
                    Array.isArray(errors.market)
                      ? errors.market.join(', ')
                      : (errors.market ?? '')
                  }
                  disabled={projectFormData.project_reason === REASON_OPTIONS}
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.HALF_WIDTH}>
                <MultiSelect
                  {...FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS}
                  label={
                    projectFormData.project_reason === REASON_OPTIONS
                      ? FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS_WITHOUT_CONFIRMATION.label
                      : FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS.label
                  }
                  options={
                    projectFormData.market.length > 0
                      ? (regulationsList?.data ?? [])
                      : []
                  }
                  value={projectFormData.regulations ?? []}
                  onChange={(value) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS.onChange,
                      value
                    )
                  }
                  error={
                    Array.isArray(errors.regulations)
                      ? errors.regulations.join(', ')
                      : (errors.regulations ?? '')
                  }
                  disabled={
                    projectFormData.project_reason === REASON_OPTIONS}
                />
              </Grid2>
               <Grid2 size={GRID_SIZES.FULL_WIDTH}>
                <Description
                  {...FORM_FIELDS_CONFIG.PRODUCT_DESCRIPTION}
                  value={projectFormData.product_description ?? ''}
                  onChange={(value) =>
                    handleInputChange(
                      FORM_FIELDS_CONFIG.PRODUCT_DESCRIPTION.onChange,
                      value
                    )
                  }
                  error={errors.product_description}
                />
              </Grid2>
              <Grid2 size={GRID_SIZES.FULL_WIDTH}>
                <FileUploadManager
                  hasEditable={!hasEditPermission}
                  initialFiles={projectFormData?.documents ?? []}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleFileEdit}
                  onSubmit={(data) => {
                    setFinalFileData((prev) => mergeFinalFileData(prev, data))
                  }}
                />
              </Grid2>
            </Grid2>
            <CommentsHistory 
            comments={projectData?.meta_info?.task_info?.task_comments}
            />
            <ButtonGroup buttons={buttonDetails ?? []} />
            
          </FormSection>

        </Content>

      </Grid2>

        <ReviewerModal
          open={isReviewerModal}
          onClose={handleCloseReviewerModalProject}
          project_id={Project_Id}
          button_id={buttonId}
          mode={buttonName}
          menu_id={projectData?.meta_info?.action_control?.menuId}
          menu_name={projectData?.meta_info?.action_control?.formName}
          reviewerList={projectData?.meta_info?.task_info?.reviewer_list}
        />
      </Container>
    </>
  )
}

export default CreateNewProject