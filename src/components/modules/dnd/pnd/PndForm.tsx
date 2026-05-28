'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Box, Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  Description,
  MultiSelect,
} from '@/components/ui'
import SpecificationTable from '@/components/modules/dnd/pnd/SpecificForm'
import AddSpecificationModal from '@/components/modules/dnd/pnd/PndModal'
import { FormContainer } from '@/styles/modules/auth/auth'
import { Container, Title } from '@/styles/modules/dnd/feedback'
import {
  PNDFormData,
  PNDFormErrors,
  pndFieldLabels,
  SpecificationRow,
  pndInitialValues,
  ModelSpecificationRow,
} from '@/types/modules/dnd/pnd'
import { PND_FORM_FIELD_KEYS } from '@/lib/modules/dnd/pnd'
import {
  PND_FORM_LABELS,
  PND_BUTTON_LABELS,
  SUCCESS,
  FAILED,
  DELETE,
  PND_FORM,
  GENERIC_PRODUCT_NAME,
  EMDN_CODE,
  ABBREVIATION,
  PRODUCT_INTENDED_USE,
  DEVELOPMENT_COST,
  APPLICATION_OF_PRODUCT,
  BUYER_ID,
  COMPETITOR_INFORMATION,
  DELIVERY_REQUIREMENTS,
  DOCUMENTATION_REQUIREMENTS,
  END_USER_ID,
  ENVIRONMENTAL_REQUIREMENTS,
  PACKAGING_REQUIREMENTS,
  POST_DELIVERY_REQUIREMENTS,
  PRODUCT_FEATURES,
  QUANTITY_FORECAST,
  SERVICE_REQUIREMENTS,
  TARGET_PRODUCT_LAUNCH_TIME_LINE,
  TARGET_SELLING_PRICE,
  PND_FORM_PLACEHOLDERS,
  PND_QUERY_KEYS,
  PND_ERROR_MESSAGES,
  PND_EXCEL_CONSTANTS,
  PND_FORM_STATUS,
  PND_REQUIREMENT_TYPES,
  PND_SPECIFICATION_TYPES,
  PND_TEMP_ID_PREFIX,
  PND_SPEC_ID_PREFIX,
  PND_FORM_KEYS,
  PND_REQUIRED_FIELDS,
  EXCEL_TYPES,
  FIELD_ORDER,
  FIELD_LABEL_MAP,
  PND_FIELD_IDS,
} from '@/constants/modules/dnd/pnd'
import {
  usePNDFetch,
  usePNDSpecificationList,
  usePNDSubmit,
  useDeletePNDSpecification,
  useGetEndUser,
  useGetBuyer,
  usePNDSpecificationCreate,
  usePNDSpecificationUpdate,
  useDownloadTemplate,
} from '@/hooks/modules/dnd/usePND'
import { useParams, useRouter } from 'next/navigation'
import { SpecificationsTitle, PND_FORM_STYLES, GRID_SIZES } from '@/styles/modules/dnd/pnd'
import { useQueryClient } from '@tanstack/react-query'

import readXlsxFile from 'read-excel-file'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { DocumentStructure, UploadedFileData } from '@/types/modules/dnd/hld'
import { BUTTON_LABEL, FINALFILEINITIALDATA, getButtonConfig, NUMBERMAP, STATUS } from '@/constants/common'
import { COMMON_CONSTANTS, mergeFinalFileData, processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import PNDModelPopupForm from './PNDModelPopupForm'
import ModelSpecificationTable from './ModelSpecificationTable'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import ReviewerModal from '../reviewer-modal/ReviewerModal'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { pndBoxStyles } from '@/styles/modules/dnd/projectPlan'
import { ERROR_COLOR } from '@/styles/common'

/**
 Classification : Confidential
**/
const PNDForm: React.FC = () => {
  const params = useParams()
  const projectId = Number(params.id)
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    data: pndFetchInfo = { data: pndInitialValues,pnd_data:[], permissions: {}  },
    isError: pndFetchInfoError, isLoading: isDataLoading, isFetching: _isDataFetching
  } = usePNDFetch(projectId)
  const { data: endUser, isLoading: isEndUserLoading, isFetching: isEndUserFetching } = useGetEndUser()
  const { data: buyer, isLoading: isBuyerLoading, isFetching: isBuyerFetching } = useGetBuyer()
  const { mutate: submitProjectPND, isPending: isSubmitPending } = usePNDSubmit()
  const { data: pndSpecificationList, isFetching: isSpecificationFetching } = usePNDSpecificationList(projectId)
  const { mutate: createSpecification, isPending: isCreatePending } = usePNDSpecificationCreate()
  const { mutate: updateSpecification, isPending: isUpdatePending } = usePNDSpecificationUpdate()
  const { mutate: deletePNDSpecificationById, isPending: isDeletePending } =
    useDeletePNDSpecification(projectId)
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useDownloadTemplate(pndFetchInfo?.default_pnd_specification_template_id)
      const { mutate: saveReview, isPending: isReviewPending } = useSubmitReview( pndFetchInfo?.permissions?.formName ?? '');
  const {
    data: statusOptions,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
  } = useOrganizationStatus(NUMBERMAP.ONE)
  const [formData, setFormData] = useState<PNDFormData>(pndInitialValues)
  const [errors, setErrors] = useState<PNDFormErrors>({})
  const [specifications, setSpecifications] = useState<SpecificationRow[]>([])

  const [deletedSpecificationIds, setDeletedSpecificationIds] = useState<
    number[]
  >([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSpecification, setCurrentSpecification] =
    useState<SpecificationRow | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
    const [buttonName, setButtonName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [modelSpecifications, setModelSpecifications] = useState<ModelSpecificationRow[]>([])
  const [currentModelSpecification, setCurrentModelSpecification] = useState<ModelSpecificationRow | null>(null)
  const [isModelModalOpen, setIsModelModalOpen] = useState(false)

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setFormData((prev) => {
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
  const handleFileOnUpload = async (newFile: File | FileData2) => {
    try {
      const Previousfile = formData?.documents ?? []
      setFormData((prev) => ({
        ...prev,
        documents: [...Previousfile, newFile],
      }))
    } catch {
      throw new Error('Failed to process file. Please try again.')
    }
  }

  const handleFileUpload = async (file: File | null) => {
    setUploadError(null)

    if (!file) {
      showActionAlert('customAlert', {
        title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
        icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
        text: PND_ERROR_MESSAGES.FILE_SELECTION_ERROR,
        cancelButton: false,
        confirmButton: false,
      })

      return
    }

    const fileName = file.name ?? ''
    if (!fileName.endsWith(EXCEL_TYPES.EXCEL_1) && !fileName.endsWith(EXCEL_TYPES.EXCEL_2)) {
      showActionAlert('customAlert', {
        title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
        icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
        text: PND_ERROR_MESSAGES.EXCEL_FILE_ERROR,
        cancelButton: false,
        confirmButton: false,
      })

      return
    }

    try {
      const rows = await readXlsxFile(file)
      const headers = rows[NUMBERMAP.ZERO]
      // Check if file is empty (no rows) 
      if (rows.length === NUMBERMAP.ZERO ) {
        showActionAlert('customAlert', {
        title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
        icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
          text: PND_ERROR_MESSAGES.EMPTY_FILE_ERROR,
          cancelButton: false,
          confirmButton: false,
        })

        return
      }else if (  //check if file does not have data
        rows.length === NUMBERMAP.ONE &&
        headers.length === PND_EXCEL_CONSTANTS.MIN_HEADERS_COUNT &&
        headers.includes(PND_EXCEL_CONSTANTS.PARAMETER_HEADER) &&
        headers.includes(PND_EXCEL_CONSTANTS.SPECIFICATION_HEADER)
      ) {
        showActionAlert('customAlert', {
        title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
        icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
          text: PND_ERROR_MESSAGES.FILE_DATA_MISSING_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
        return
      }else if (  //check if file does not contain correct headers
        headers.length < PND_EXCEL_CONSTANTS.MIN_HEADERS_COUNT ||
        !headers.includes(PND_EXCEL_CONSTANTS.PARAMETER_HEADER) ||
        !headers.includes(PND_EXCEL_CONSTANTS.SPECIFICATION_HEADER)
      ) {
        showActionAlert('customAlert', {
        title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
        icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
          text: PND_ERROR_MESSAGES.INVALID_HEADERS_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
        return
      }

      const parameterIndex = headers.indexOf(PND_EXCEL_CONSTANTS.PARAMETER_HEADER)
      const specificationIndex = headers.indexOf(PND_EXCEL_CONSTANTS.SPECIFICATION_HEADER)

      const data: SpecificationRow[] = []
      for (let i = NUMBERMAP.ONE; i < rows.length; i++) {
        const row = rows[i]
        if (row[parameterIndex] && row[specificationIndex]) {
          data.push({
            id: `${PND_SPEC_ID_PREFIX}${crypto.randomUUID()}`,
            parameter: row[parameterIndex].toString(),
            specification: row[specificationIndex].toString(),
          })
        }
      }
      setSpecifications([...specifications, ...data])
      setUploadError(null)
    } catch (error) {
      console.error('Error reading Excel file:', error)
      showActionAlert('customAlert', {
        title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
        icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
        text: PND_ERROR_MESSAGES.FILE_READ_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }

  
  useEffect(() => {
    if (pndFetchInfo?.data) {
      const fetchedData = pndFetchInfo.data;
      setFormData(fetchedData);
      const transformedModels: ModelSpecificationRow[] =
        fetchedData.models?.map((m) => ({
          id: m.model_id,               // keep DB id
          modelName: m.model_name,
          modelNumber: m.model_number,
          description: m.model_description ?? '',
          baseModel: m.is_base_version,
          status: m.status,
        })) ?? [];
      setModelSpecifications(transformedModels);
    } else {
      setFormData(pndInitialValues);
      setModelSpecifications([]);
    }
  }, [pndFetchInfo?.data, pndFetchInfoError]);

  useEffect(() => {
    if (pndSpecificationList?.data?.length > 0) {
      setSpecifications(
        pndSpecificationList.data.map((spec: SpecificationRow) => ({
          ...spec,
          isNew: false,
          isEdited: false,
        }))
      )
    }
  }, [pndSpecificationList])

  const isFormLocked = formData.status === PND_FORM.APPROVED

  // Comprehensive loading state
  const isAnyLoading = () => {
    if (isDataLoading) return true
    if (isEndUserLoading) return true
    if (isEndUserFetching) return true
    if (isBuyerLoading) return true
    if (isBuyerFetching) return true
    if (isStatusLoading) return true
    if (isStatusFetching) return true
    if (isSpecificationFetching) return true
    if (isSubmitPending) return true
    if (isCreatePending) return true
    if (isUpdatePending) return true
    if (isDeletePending) return true
    if (isDownloading) return true
    if (isReviewPending) return true
    return false
  }

  const handleInputChange = (
    name: keyof PNDFormData,
    value: string | number[] | File[] | number | null
  ) => {
    if(!hasEditPermission) return
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const validateForm = (requireAll: boolean): boolean => {
    const newErrors: PNDFormErrors = {}

    if (requireAll) {
      PND_REQUIRED_FIELDS.forEach((fieldKey) => {
        const value = formData[fieldKey]
        const trimmedValue = typeof value === 'string' ? value.trim() : value

        if (
          trimmedValue === '' ||
          (Array.isArray(trimmedValue) && trimmedValue.length === 0) ||
          trimmedValue === null
        ) {
          const fieldLabel = pndFieldLabels[fieldKey] ?? fieldKey
          newErrors[fieldKey as keyof PNDFormErrors] = `${fieldLabel} is required`
        }
      })

      if (!modelSpecifications || modelSpecifications.length === NUMBERMAP.ZERO) {
        newErrors.models = PND_ERROR_MESSAGES.MODELS_ERROR
      }
    }

    setErrors(newErrors)
    
    // Only check for empty fields if there are validation errors
    const hasErrors = Object.keys(newErrors).length > NUMBERMAP.ZERO
    if (hasErrors) {
      validateAndFocusFirstEmptyField(formData, FIELD_ORDER, FIELD_LABEL_MAP)
      return false
    }
    return true
  }

  const validateSpecification = (spec: SpecificationRow): boolean => {
    if (!spec.parameter?.trim() || !spec.specification?.trim()) {
      showActionAlert(FAILED)
      return false
    }
    if (
      specifications.some(
        (s) => s.parameter === spec.parameter && s.id !== spec.id
      )
    ) {
      showActionAlert(FAILED)
      return false
    }
    return true
  }

  const validateModelSpecification = (model: ModelSpecificationRow): boolean => {
    if (!model.modelName?.trim() || !model.modelNumber?.trim()) {
      showActionAlert(FAILED)
      return false
    }
    return true
  }

  const getTextRequirement = (item_id: number, item_identifier: string, value?: string | null) => ({
    item_id,
    item_category: PND_REQUIREMENT_TYPES.TEXT,
    item_identifier,
    value: value?.trim() ?? null,
  })

  const getChosenRequirement = (
    item_id: number,
    item_identifier: string,
    values: number[] | number,
  ) => {
    let processedValue: number[] | number | null
    
    if (Array.isArray(values)) {
      processedValue = values.length ? values : null
    } else {
      processedValue = values
    }

    return {
      item_id,
      item_category: item_identifier + '_chosen',
      item_identifier,
      value: processedValue,
    }
  }

  const getRequirements = (
    formData: PNDFormData
  ): {
    item_id: number
    item_category: string
    item_identifier: string
    value: string | number[] | number | null
  }[] => {
      return [
        ...pndFetchInfo.pnd_data.map((item) => {
          let formDataKey = item.item_identifier;
          if(formDataKey === PND_FORM_KEYS.BUYER || formDataKey === PND_FORM_KEYS.ENDUSER){
            formDataKey = formDataKey === PND_FORM_KEYS.BUYER?PND_FORM_KEYS.BUYER_ID :PND_FORM_KEYS.END_USER_ID
          }
          if(formDataKey === PND_FORM_KEYS.QFY || formDataKey === PND_FORM_KEYS.TTFPL){
            formDataKey = formDataKey === PND_FORM_KEYS.QFY ? PND_FORM_KEYS.QFYK : PND_FORM_KEYS.TPLTL
          }
          if(formDataKey === PND_FORM_KEYS.PRODUCT_CATEGORY){
            formDataKey = PND_FORM_KEYS.PRODUCT_CATEGORY_ID
          }
          const formDataValue = formData[formDataKey as keyof typeof formData];
          
          if (item.item_identifier ===  PND_FORM_KEYS.BUYER || item.item_identifier === PND_FORM_KEYS.ENDUSER || item.item_identifier === PND_FORM_KEYS.PRODUCT_CATEGORY) {
            return getChosenRequirement(item.item_id, item.item_identifier, formDataValue as number[] | number);
          } else {
            return getTextRequirement(item.item_id, item.item_identifier, formDataValue as string);
          }
        })
      ]
  }

  const isValidRequirement = (req: {
    value: string | number[] | number | null
  }): boolean => {
    return (
      req.value !== null && (!Array.isArray(req.value) || req.value.length > 0)
    )
  }

  const createFormData = (): FormData => {
    const form = new FormData()
    form.append('project_id', projectId.toString())

    form.append('specification', JSON.stringify(specifications))
    const transformModelsToPayload = (models: ModelSpecificationRow[]) =>
      models.map(({ modelName, modelNumber, description, baseModel, status }) => {
        const parsedStatus = status
          ? Number(status)
          : null
        return {
          model_name: modelName,
          model_number: modelNumber,
          description: description ?? '',
          is_base_version: baseModel.toLowerCase(),
          status_id: parsedStatus && !Number.isNaN(parsedStatus) ? parsedStatus : null
        }
      });
    form.append('models', JSON.stringify(transformModelsToPayload(modelSpecifications)));
    const requirements = getRequirements(formData).filter(isValidRequirement)
    form.append('requirements', JSON.stringify(requirements))

    if (finalFileData?.documents_to_delete) {
      form.append(
        'documents_to_delete',
        JSON.stringify(finalFileData.documents_to_delete)
      )
    }
    if (finalFileData?.create_meta_data) {
      form.append(
        'create_meta_data',
        JSON.stringify(finalFileData.create_meta_data)
      )
    }
    if (finalFileData?.update_meta_data) {
      form.append(
        'update_meta_data',
        JSON.stringify(finalFileData.update_meta_data)
      )
    }
    if (finalFileData.documents_to_create) {
      finalFileData?.documents_to_create?.forEach((fileData) => {
        if (fileData instanceof File) {
          form.append('documents_to_create', fileData, fileData.name)
        }
      })
    }

    return form
  }

  const handleSubmit = async () => {
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }

    const isValid = validateForm(true)
    if (!isValid) {
      return
    }

    setIsDisabled(true)
    const form = createFormData()
    form.append('status', PND_FORM_STATUS.SUBMITTED)

    try {
      await deleteSpecifications(
        deletedSpecificationIds,
        deletePNDSpecificationById
      )
      await Promise.all(
        specifications.map((spec) =>
          processSpecification(
            spec,
            createSpecification,
            updateSpecification,
            projectId
          )
        )
      )
      await submitForm(
        form,
        submitProjectPND,
        queryClient,
        projectId,
        setDeletedSpecificationIds,
        setSpecifications
      )
    } catch (error: any) {
      console.error('Error during form submission:', error)
      showActionAlert(FAILED)
    } finally {
      setIsDisabled(false)
    }
  }

  const deleteSpecifications = async (
    ids: number[],
    deletePNDSpecificationById: any
  ): Promise<void> => {
    const deletePromises = ids.map((id) =>
      deletePNDSpecificationById(id, {
        onSuccess: () => {},
        onError: (error: any) => {
          throw new Error(
            `${PND_ERROR_MESSAGES.SPECIFICATION_DELETE_ERROR} ${id}: ${error.message}`
          )
        },
      })
    )
    await Promise.all(deletePromises)
  }

  const processSpecification = (
    spec: SpecificationRow,
    createSpecification: any,
    updateSpecification: any,
    projectId: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (spec.isNew) {
        const specFormData = new FormData()
        specFormData.append('project_id', projectId.toString())
        specFormData.append('parameter', spec.parameter)
        specFormData.append('specification', spec.specification)

        createSpecification(
          { specificationFormData: specFormData },
          {
            onSuccess: () => resolve(),
            onError: (error: any) =>
              reject(
                new Error(`${PND_ERROR_MESSAGES.SPECIFICATION_CREATE_ERROR}: ${error.message}`)
              ),
          }
        )
      } else if (spec.isEdited && spec.id && typeof spec.id === 'number') {
        updateSpecification(
          {
            id: spec.id,
            parameter: spec.parameter,
            specification: spec.specification,
          },
          {
            onSuccess: () => resolve(),
            onError: (error: any) =>
              reject(
                new Error(
                  `${PND_ERROR_MESSAGES.SPECIFICATION_UPDATE_ERROR} ${spec.id}: ${error.message}`
                )
              ),
          }
        )
      } else {
        resolve()
      }
    })
  }

  const handleFormSubmissionSuccess = (
    queryClient: any,
    projectId: number,
    setDeletedSpecificationIds: React.Dispatch<React.SetStateAction<number[]>>,
    setSpecifications: React.Dispatch<React.SetStateAction<SpecificationRow[]>>,
    resolve: () => void,
    reject: (reason?: any) => void
  ) => {
    setFinalFileData(FINALFILEINITIALDATA)
    queryClient.invalidateQueries({
      queryKey: [PND_QUERY_KEYS.PND_SPECIFICATION_FETCH_QUERY_KEY, projectId],
    })
    queryClient.invalidateQueries({
      queryKey: [PND_QUERY_KEYS.PND_FETCH_QUERY_KEY, projectId],
    })
    setDeletedSpecificationIds([])
    setSpecifications((prev) =>
      prev.map((spec) => ({
        ...spec,
        isNew: false,
        isEdited: false,
      }))
    )
    showActionAlert(SUCCESS)
    resolve()
  }

  const submitForm = (
    form: FormData,
    submitProjectPND: any,
    queryClient: any,
    projectId: number,
    setDeletedSpecificationIds: React.Dispatch<React.SetStateAction<number[]>>,
    setSpecifications: React.Dispatch<React.SetStateAction<SpecificationRow[]>>
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      submitProjectPND(
        { formData: form },
        {
          onSuccess: () =>
            handleFormSubmissionSuccess(
              queryClient,
              projectId,
              setDeletedSpecificationIds,
              setSpecifications,
              resolve,
              reject
            ),
          onError: (error: any) => {
            showActionAlert(FAILED)
            reject(new Error(`${PND_ERROR_MESSAGES.FORM_SUBMISSION_ERROR}: ${error.message}`))
          },
        }
      )
    })
  }

  const handleAddSpecification = () => {
    if(!hasEditPermission) return
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }
    setCurrentSpecification(null)
    setIsModalOpen(true)
  }

  const handleEditSpecification = (specification: SpecificationRow) => {
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }
    setCurrentSpecification(specification)
    setIsModalOpen(true)
  }

  const handleDeleteSpecification = async (id: number | string) => {
    if(!hasEditPermission) return
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }

    const result = await showActionAlert(DELETE)
    if (!result.isConfirmed) {
      return
    }

    setSpecifications((prev) => prev.filter((spec) => spec.id != id))
  }

  const handleSaveSpecification = (specification: SpecificationRow) => {
    if (!validateSpecification(specification) || !hasEditPermission) return

    setSpecifications((prevSpecs) => {
      if (specification.id) {
        const newSpecs = prevSpecs.map((spec) =>
          spec.id.toString() === specification.id.toString()
            ? { ...specification, type: specification.type ?? PND_SPECIFICATION_TYPES.EDITED }
            : spec
        )
        return newSpecs
      } else {
        const tempId = `${PND_TEMP_ID_PREFIX}${Date.now()}_${crypto.getRandomValues(new Uint32Array(1))[0]}`
        const newSpecs = [
          ...prevSpecs,
          { ...specification, id: tempId, type: PND_SPECIFICATION_TYPES.NEW },
        ]
        return newSpecs
      }
    })

    setIsModalOpen(false)
  }

  const handleAddModelSpecification = () => {
    if(!hasEditPermission) return
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }
    setCurrentModelSpecification(null)
    setIsModelModalOpen(true)
  }

  const handleEditModelSpecification = (spec: ModelSpecificationRow) => {
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }
    setCurrentModelSpecification(spec)
    setIsModelModalOpen(true)
  }

  const handleDeleteModelSpecification = async (id: number | string) => {
    if(!hasEditPermission) return
    if (isFormLocked) {
      showActionAlert(FAILED)
      return
    }
    const result = await showActionAlert(DELETE)
    if (!result.isConfirmed) return
    setModelSpecifications((prev) =>
      prev.map((spec) =>
        spec.id == id
          ? {
              ...spec,
              status: NUMBERMAP.TWO,
            }
          : spec
      )
    )
  }


  const handleSaveModelSpecification = (model: ModelSpecificationRow) => {
    if (!validateModelSpecification(model)||!hasEditPermission) return;

    setModelSpecifications((prevModels) => {
      if (model.id) {
        const updatedModels = prevModels.map((m) =>
          m.id.toString() === model.id.toString()
            ? { ...model, type: model.type ?? PND_SPECIFICATION_TYPES.EDITED }
            : m
        );
        return updatedModels;
      } else {
        const tempId = `${PND_TEMP_ID_PREFIX}${Date.now()}_${crypto.getRandomValues(
          new Uint32Array(1)
        )[0]}`;
        const newModels = [
          ...prevModels,
          { ...model, id: tempId, type: PND_SPECIFICATION_TYPES.NEW },
        ];
        return newModels;
      }
    });

    setErrors((prevErrors) => ({ ...prevErrors, models: undefined }));

    setIsModelModalOpen(false);
  };


 const handleCloseReviewerModalPnd = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }
 
  // Update getButtonConfig to pass trigger_status_id to handleSubmitReviewModal
  const handleButtonChangePnd = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }
 
  // Update these handler functions to accept trigger_status_id parameter
  const handleSubmitForReviewPnd = (trigger_status_id?: number) => {
    handleButtonChangePnd(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }
 
  const handleApprovePnd = (trigger_status_id?: number) => {
    handleButtonChangePnd(BUTTON_LABEL.APPROVE, trigger_status_id)
  }
 
  const handleRejectPnd = (trigger_status_id?: number) => {
    handleButtonChangePnd(BUTTON_LABEL.REJECT, trigger_status_id)
  }
 
  const handleSubmitApprovalPnd = (trigger_status_id?: number) => {
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
    router.push(ROUTE_PATHS.PROJECT_LIST)
  }
 
  const getButtons = getButtonConfig({
     handleSubmitForReview: handleSubmitForReviewPnd, // Pass trigger_status_id
    handleApprove: handleApprovePnd,
    handleSubmitApproval: handleSubmitApprovalPnd,
    handleReject: handleRejectPnd,
    handleCancel:handleCancel,
    handleSave: () => { void handleSubmit(); },
    isDisabled: isDisabled
  })
 
const permission = pndFetchInfo?.permissions?.permissions ?? []
const { buttons: buttonDetails, hasEditPermission } = processButtonsWithPermissions(permission, getButtons, isDisabled)
// Update the existing useEffect that handles permissions
// Alternative approach without isLoading
useEffect(() => {
  // Check if we have a response (either data or error) and no permissions
  if (pndFetchInfo?.permissions && !buttonDetails && pndFetchInfoError) {
   
    showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
      title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
      text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
      icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
      cancelButton: false,
      confirmButton: false,
    });
  }
}, [pndFetchInfo, pndFetchInfoError, buttonDetails]);
  return (
    <>
       <GlobalLoader loading = {isAnyLoading()} />
       {buttonDetails && (
        <Container>
      <FormContainer>
        <Title>PND</Title>
         <Grid2 >
        <Grid2 container spacing={1} sx={PND_FORM_STYLES.MAIN_CONTAINER}>
          <Grid2 size={{ md: GRID_SIZES.SIX }}>
            <InputField
              label={PND_FORM_LABELS.GENERIC_PRODUCT_NAME}
              placeholder={PND_FORM_PLACEHOLDERS.GENERIC_PRODUCT_NAME}
              value={formData.product_generic_name ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.product_generic_name ??
                  GENERIC_PRODUCT_NAME,
                  value
                )
              }
              error={errors.product_generic_name}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: GRID_SIZES.SIX }}>
            <InputField
              label={PND_FORM_LABELS.GMDN_CODE}
              placeholder={PND_FORM_PLACEHOLDERS.GMDN_CODE}
              value={formData.gmdn_code ?? ''}
              onChange={(value: string) =>
                handleInputChange('gmdn_code', value)
              }
              error={errors.gmdn_code}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.EMDN_CODE}
              placeholder={PND_FORM_PLACEHOLDERS.EMDN_CODE}
              value={formData.emdn_code ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.emdn_code ?? EMDN_CODE,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.ABBREVIATION}
              placeholder={PND_FORM_PLACEHOLDERS.ABBREVIATION}
              value={formData.abbreviation ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.abbreviation ?? ABBREVIATION,
                  value
                )
              }
              error={errors.abbreviation}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <Description
              label={PND_FORM_LABELS.INTENDED_USE}
              placeholder={PND_FORM_PLACEHOLDERS.INTENDED_USE}
              value={formData.intended_use_of_product ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.intended_use_of_product ??
                  PRODUCT_INTENDED_USE,
                  value
                )
              }
              error={errors.intended_use_of_product}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.DEVELOPMENT_COST}
              placeholder={PND_FORM_PLACEHOLDERS.DEVELOPMENT_COST}
              value={formData.development_cost ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.development_cost ?? DEVELOPMENT_COST,
                  value
                )
              }
              error={errors.development_cost}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.APPLICATION_OF_PRODUCT}
              placeholder={PND_FORM_PLACEHOLDERS.APPLICATION_OF_PRODUCT}
              value={formData.application_of_product ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.application_of_product ??
                  APPLICATION_OF_PRODUCT,
                  value
                )
              }
              error={errors.application_of_product}
              disabled={isFormLocked}
            />
          </Grid2>
          {!isBuyerLoading && (
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={PND_FORM_LABELS.BUYER}
                placeholder={PND_FORM_PLACEHOLDERS.BUYER}
                options={buyer?.data ?? []}
                value={formData.buyer_id}
                onChange={(value: (string | number)[]) =>
                  handleInputChange(
                    PND_FORM_FIELD_KEYS.buyer_id ?? BUYER_ID,
                    value as number[]
                  )
                }
                error={errors.buyer_id ?? ''}
                idField="buyer_id"
                valueField="buyer"
                disabled={isFormLocked}
              />
            </Grid2>
          )}
          {!isEndUserLoading && (
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={PND_FORM_LABELS.END_USER}
                placeholder={PND_FORM_PLACEHOLDERS.END_USER}
                options={endUser?.data ?? []}
                value={formData.end_user_id}
                onChange={(value: (string | number)[]) =>
                  handleInputChange(
                    PND_FORM_FIELD_KEYS.end_user_id ?? END_USER_ID,
                    value.filter((v): v is number => typeof v === 'number')
                  )
                }
                error={errors.end_user_id ?? ''}
                idField="end_user_id"
                valueField="end_user"
                disabled={isFormLocked}
              />
            </Grid2>
          )}
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.COMPETITOR_INFORMATION}
              placeholder={PND_FORM_PLACEHOLDERS.COMPETITOR_INFORMATION}
              value={formData.competitor_information ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.competitor_information ??
                  COMPETITOR_INFORMATION,
                  value
                )
              }
              error={errors.competitor_information}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.PRODUCT_FEATURES}
              placeholder={PND_FORM_PLACEHOLDERS.PRODUCT_FEATURES}
              value={formData.product_features ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.product_features ?? PRODUCT_FEATURES,
                  value
                )
              }
              error={errors.product_features}
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.SERVICE_REQUIREMENTS}
              placeholder={PND_FORM_PLACEHOLDERS.SERVICE_REQUIREMENTS}
              value={formData.service_requirements ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.service_requirements ??
                  SERVICE_REQUIREMENTS,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.PACKAGING_REQUIREMENTS}
              placeholder={PND_FORM_PLACEHOLDERS.PACKAGING_REQUIREMENTS}
              value={formData.packaging_requirements ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.packaging_requirements ??
                  PACKAGING_REQUIREMENTS,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.DELIVERY_REQUIREMENTS}
              placeholder={PND_FORM_PLACEHOLDERS.DELIVERY_REQUIREMENTS}
              value={formData.delivery_requirements ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.delivery_requirements ??
                  DELIVERY_REQUIREMENTS,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.POST_DELIVERY_REQUIREMENTS}
              placeholder={PND_FORM_PLACEHOLDERS.POST_DELIVERY_REQUIREMENTS}
              value={formData.post_delivery_requirements ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.post_delivery_requirements ??
                  POST_DELIVERY_REQUIREMENTS,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.ENVIRONMENTAL_REQUIREMENTS}
              placeholder={PND_FORM_PLACEHOLDERS.ENVIRONMENTAL_REQUIREMENTS}
              value={formData.environmental_requirements ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.environmental_requirements ??
                  ENVIRONMENTAL_REQUIREMENTS,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.DOCUMENTATION_REQUIREMENTS}
              placeholder={PND_FORM_PLACEHOLDERS.DOCUMENTATION_REQUIREMENTS}
              value={formData.documentation_requirements ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.documentation_requirements ??
                  DOCUMENTATION_REQUIREMENTS,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.TARGET_SELLING_PRICE}
              placeholder={PND_FORM_PLACEHOLDERS.TARGET_SELLING_PRICE}
              value={formData.target_selling_price ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.target_selling_price ??
                  TARGET_SELLING_PRICE,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.QUANTITY_FORECAST}
              placeholder={PND_FORM_PLACEHOLDERS.QUANTITY_FORECAST}
              value={formData.quantity_forecast ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.quantity_forecast ?? QUANTITY_FORECAST,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <InputField
              label={PND_FORM_LABELS.TARGET_TIMELINE}
              placeholder={PND_FORM_PLACEHOLDERS.TARGET_TIMELINE}
              value={formData.target_product_launch_time_line ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  PND_FORM_FIELD_KEYS.target_product_launch_time_line ??
                  TARGET_PRODUCT_LAUNCH_TIME_LINE,
                  value
                )
              }
              disabled={isFormLocked}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={1} sx={PND_FORM_STYLES.SPECIFICATIONS_CONTAINER}>
          <Grid2 size={{ md: NUMBERMAP.SIX }} sx={PND_FORM_STYLES.SPECIFICATIONS_SECTION}>
            <SpecificationsTitle>
              {PND_FORM.PND_SPECIFICATIONS_TITLE}
            </SpecificationsTitle>
            <input
              type="file"
              onChange={(event) => {
                handleFileUpload(
                  event.target.files ? event.target.files[0] : null
                )
              }}
              id={PND_FORM.FILE_INPUT_ID}
              accept={PND_FORM.ACCEPTED_FILE_FORMAT}
              hidden
            />
            <Box>{uploadError}</Box>
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <ButtonGroup
              buttons={[
                {
                  label: PND_BUTTON_LABELS.DOWNLOAD_TEMPLATE,
                  onClick: () => {
                    if(!hasEditPermission) return
                    downloadTemplate()
                  },
                  disabled: isDownloading ?? isFormLocked,
                },
                {
                  label: PND_BUTTON_LABELS.UPLOAD_SPECIFICATIONS,
                  onClick: () => {
                    if(!hasEditPermission) return
                    const fileInput = document.getElementById(
                      PND_FORM.FILE_INPUT_ID
                    ) as HTMLInputElement
                    if (fileInput) fileInput.value = ''
                    fileInput?.click()
                  },
                  disabled: isFormLocked,
                },
              ]}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={1} sx={{ padding: '0px 0px' }}>
          <Grid2 size={{ md: NUMBERMAP.TWELVE }} sx={PND_FORM_STYLES.SPECIFICATIONS_TABLE}>
            <Box sx={{ marginBottom: '20px' }}>
              <ButtonGroup
                buttons={[
                  {
                    label: PND_BUTTON_LABELS.ADD_NEW,
                    onClick: handleAddSpecification,
                    disabled: isFormLocked,
                  },
                ]}
              />
            </Box>
            <SpecificationTable
              key={specifications.map((s) => s.id).join('-')}
              specifications={specifications}
              onEdit={handleEditSpecification}
              onDelete={handleDeleteSpecification}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={1} >
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={PND_FORM_STYLES.MAIN_CONTAINER}>
            <SpecificationsTitle>
              {PND_FORM.PND_MODEL}
            </SpecificationsTitle>
          </Grid2>
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={PND_FORM_STYLES.SPECIFICATIONS_TABLE}>
            <div id={PND_FIELD_IDS.MODELS}>
            <Box>
              <ButtonGroup
                buttons={[
                  {
                    label: PND_BUTTON_LABELS.ADD_NEW,
                    onClick: handleAddModelSpecification,
                    disabled: isFormLocked,
                  },
                ]}
              />
            </Box>
            </div>
          </Grid2>
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }} sx={PND_FORM_STYLES.SPECIFICATIONS_TABLE}>
            <ModelSpecificationTable
              modelSpecifications={modelSpecifications}
              onEdit={handleEditModelSpecification}
              onDelete={handleDeleteModelSpecification}
            />

            {errors.models && (
              <div style={ERROR_COLOR}>{errors.models}</div>
           )}
          </Grid2>
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }} sx={{ padding: '0 20px' }}>
          <FileUploadManager
            initialFiles={formData?.documents ?? []}
            hasEditable={!hasEditPermission}
            onFileUpload={handleFileOnUpload}
            onFileEdit={handleFileEdit}
            onSubmit={(data) => {
              setFinalFileData((prev) => mergeFinalFileData(prev, data))
            }}
          />
        </Grid2>
        </Grid2>
        <Box size={NUMBERMAP.TWELVE} sx={pndBoxStyles}>
        <CommentsHistory 
          comments={pndFetchInfo?.meta_info?.task_info?.task_comments}
        />
        </Box>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }} sx={PND_FORM_STYLES.SPECIFICATIONS_TABLE}>
          <ButtonGroup buttons={buttonDetails} />
        </Grid2>
      </FormContainer>
        <ReviewerModal
              open={isReviewerModal}
              onClose={handleCloseReviewerModalPnd}
              project_id={projectId}
              button_id={buttonId}
              mode={buttonName}
              menu_id={pndFetchInfo?.permissions?.menuId}
              menu_name={ pndFetchInfo?.permissions?.formName }
              reviewerList={pndFetchInfo?.meta_info?.task_info?.reviewer_list}
            />
      <AddSpecificationModal
        hasEditable = {!hasEditPermission}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSpecification}
        specification={currentSpecification}
      />
      <CommonModal
        open={isModelModalOpen}
        onClose={() => {
          setIsModelModalOpen(false)
          setCurrentModelSpecification(null)
        }}
        title={PND_FORM.PND_MODEL}
        buttonRequired={false} 
      >
        <PNDModelPopupForm
          hasEditable = {!hasEditPermission}
          onClose={() => {
            setIsModelModalOpen(false)
            setCurrentModelSpecification(null)
          }}
          onSave={handleSaveModelSpecification}
          model={currentModelSpecification}
          statusOptions={statusOptions?.data ?? []}
        />
      </CommonModal>
      </Container>
      )}
    </>
  )
}

export default PNDForm
