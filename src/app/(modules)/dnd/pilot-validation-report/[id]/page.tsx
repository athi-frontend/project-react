'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  InputField,
  Label,
  showActionAlert,
  DataGridTable,
  ActionButton,
  RichTextEditor,
} from '@/components/ui'
import { DateTime } from 'luxon'
import { GenericTooltip } from '@/components/ui/tooltip/Tooltip'
import { Grid2, Box } from '@mui/material'
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard'
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import PatientModal from '@/components/modules/dnd/pilot-validation-report/PatientModal'
import FeedbackModal from '@/components/modules/dnd/pilot-validation-report/FeedbackModal'
import { useParams, useRouter } from 'next/navigation'
import {
  useFetchPlaceValidation,
  useFetchValidationReport,
  usePostValidationReport,
  useFetchDIR,
  useFetchFunctionalBlock,
  useFetchDecisionOptions,
} from '@/hooks/modules/dnd/usePilotValidationReport'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { FileData } from '@/types/components/ui/fileUploadV3'
import { FinalFileData, mergeFinalFileData, COMMON_CONSTANTS, formatDateTime, stripHtml } from '@/lib/utils/common'

import { ValidationFormData, FunctionalBlockOption, ApiFeedbackDetail, PatientForm, FeedbackForm,TooltipContent } from '@/types/modules/dnd/pilotValidationReport'
import { PILOT_VALIDATION, FIELD_ORDER, FIELD_LABEL_MAP } from '@/constants/modules/dnd/pilotValidationReport'
import { ErrorText } from '@/styles/common'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
/**
    Classification : Confidential
**/

const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
const { ERROR_MESSAGES, UI_TEXT, API_FIELDS, FORM_FIELDS, FILE, FEEDBACK_FIELDS, ACTION_TYPES, TABLE_COLUMNS, STATIC_LABELS, ALERT_MESSAGES } = PILOT_VALIDATION

const DEFAULT_FORM: ValidationFormData = PILOT_VALIDATION.DEFAULT_FORMS.VALIDATION_FORM
const DEFAULT_PATIENT = PILOT_VALIDATION.DEFAULT_FORMS.PATIENT
const DEFAULT_FEEDBACK = PILOT_VALIDATION.DEFAULT_FORMS.FEEDBACK

const PilotValidationReport: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)

  const [placeValidationOptions, setPlaceValidationOptions] = useState<any[]>([])
  const [validationId, setValidationId] = useState<number | null>(null)
  const [feedbackFinalFileData, setFeedbackFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [supportingFinalFileData, setSupportingFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [form, setForm] = useState<ValidationFormData>(DEFAULT_FORM)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [patientModalOpen, setPatientModalOpen] = useState(false)
  const [patientForm, setPatientForm] = useState<PatientForm>(DEFAULT_PATIENT)
  const [projectStageOrderId, setProjectStageOrderId] = useState<number>(0)
  const [editPatientId, setEditPatientId] = useState<number | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>(DEFAULT_FEEDBACK)
  const [editFeedbackId, setEditFeedbackId] = useState<number | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [hasEditPermission, setHasEditPermission] = useState(true)

  const placeOfValidationQuery = useFetchPlaceValidation(projectId)
  const validationReportQuery = useFetchValidationReport(validationId ?? NUMBERMAP.ZERO)
  const saveValidationReportMutation = usePostValidationReport(validationId ?? NUMBERMAP.ZERO)
  const dirOptionsQuery = useFetchDIR(projectId, projectStageOrderId)
  const {data: functionalBlockQuery, isLoading: functionalBlockLoading, isFetching: functionalBlockFetching}  = useFetchFunctionalBlock(projectId)
  const decisionOptionsQuery = useFetchDecisionOptions()

  // Memoized validation check for placeOfValidation
  const hasValidPlaceOfValidation = useMemo(() => {
    const value = form.placeOfValidation
    return value != null && value !== '' && String(value).trim() !== ''
  }, [form.placeOfValidation])

  // Check if fields should be disabled (no place of validation selected or no edit permission)
  const isFieldsDisabled = !hasValidPlaceOfValidation || !hasEditPermission

  // Loading state function
  const isAnyLoading = () => {
    if (placeOfValidationQuery.isLoading) return true
    if (placeOfValidationQuery.isFetching) return true
    if (validationReportQuery.isLoading) return true
    if (validationReportQuery.isFetching) return true
    if (dirOptionsQuery.isLoading) return true
    if (dirOptionsQuery.isFetching) return true
    if (functionalBlockLoading) return true
    if (functionalBlockFetching) return true
    if (decisionOptionsQuery.isLoading) return true
    if (decisionOptionsQuery.isFetching) return true
    if (saveValidationReportMutation.isPending) return true
    return false
  }

  useEffect(() => {
    if (placeOfValidationQuery.data) {
      setPlaceValidationOptions(placeOfValidationQuery.data)
      if (!form.placeOfValidation && placeOfValidationQuery.data.length > NUMBERMAP.ZERO) {
        setForm((prev) => ({ ...prev, placeOfValidation: placeOfValidationQuery.data[NUMBERMAP.ZERO].id.toString() }))
        setValidationId(placeOfValidationQuery.data[NUMBERMAP.ZERO].id)
      }
    }
  }, [placeOfValidationQuery.data])



  // Helper function to reset file data
  const resetFileData = useCallback(() => {
    setFeedbackFinalFileData(FINALFILEINITIALDATA)
    setSupportingFinalFileData(FINALFILEINITIALDATA)
  }, [])

  // Helper function to process DIR array
  const processDirArray = useCallback((dirArray: any[]) => {
    if (!Array.isArray(dirArray)) return []
    
    const processedIds = dirArray.map(item => {
      const id = item?.design_input_requirement_id ?? item?.id
      return id != null && id !== '' ? Number(id) : null
    })
    
    return [...new Set(processedIds)]
  }, [])

  useEffect(() => {
    if (validationReportQuery.data?.data?.length && validationId) {
      const report = validationReportQuery.data.data[NUMBERMAP.ZERO]

      setForm((prev) => ({
        ...prev,
        placeOfValidation: report.place_of_validation ?? prev.placeOfValidation,
        productSerialNo: report.product_serial_number ?? '',
        swVersionNo: report.software_verification_number ?? '',
        correctionsText: report.correction_actions ?? '',
        conclusion: report.conclusion ?? '',
        feedbackDocuments: report.feedback_files ?? [],
        supportingDocuments: report.supporting_files ?? [],
        patient_details: report.patient_details?.map((p: any) => ({
          id: p.id,
          patientName: p.name,
          dateTime: p.date_time,
          age: p.age,
          gender: p.gender,
          parameters_measured: p.parameter,
          measured_value: p.value,
          comments: p.comments,
        })) ?? [],
        feedback_details: report.feedback_details?.map((f: ApiFeedbackDetail) => ({
          id: f.id,
          intended_use_met: f.intended_use,
          feedback: f.feedback_details,
          functional_block: Number(f.functional_block_id),
          dir: processDirArray(f.dir),
          decision: Number(f.decision_id),
          measured_value: f.value,
          comments: f.comments,
        })) ?? [],
      }))
      
      // Set the project stage order ID from API response
      setProjectStageOrderId(report.project_stage_order_id ?? NUMBERMAP.ZERO)
      resetFileData()
    } else {
      resetFileData()
    }
  }, [validationReportQuery.data, validationId, resetFileData])

  // Helper function to reset form for new validation
  const resetFormForNewValidation = useCallback((field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      productSerialNo: '',
      swVersionNo: '',
      correctionsText: '',
      conclusion: '',
      feedbackDocuments: [],
      supportingDocuments: [],
      patient_details: [],
      feedback_details: [],
    }))
    resetFileData()
    setErrors({})
  }, [resetFileData])

  const handleChange = (field: string, value: any) => {
    // Allow changing placeOfValidation dropdown even without edit permission
    if (field === FORM_FIELDS.PLACE_OF_VALIDATION) {
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: '' }))
      const selectedId = Number(value)
      setValidationId(selectedId)
      resetFormForNewValidation(field, value)
      return
    }
    
    // For other fields, require both edit permission and valid placeOfValidation
    if (!hasEditPermission || !hasValidPlaceOfValidation) return;
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
       /**
     * Function Name: validate
     * Params: none
     * Description: used to validate the form,
     * Modified By : Savitri K,
     * modified : 11-09-2025,
     * Classification : Confidential
    **/
    const newErrors: { [key: string]: string } = {}
    if (!form.placeOfValidation) newErrors.placeOfValidation = ERROR_MESSAGES.PLACE_OF_VALIDATION
    if (!form.productSerialNo?.trim()) newErrors.productSerialNo = ERROR_MESSAGES.PRODUCT_SERIAL_NO
    if (!form.swVersionNo?.trim()) newErrors.swVersionNo = ERROR_MESSAGES.SW_VERSION_NO
    if (!form.correctionsText?.trim()) newErrors.correctionsText = ERROR_MESSAGES.CORRECTIONS_TEXT
    if (!form.conclusion?.trim()) newErrors.conclusion = ERROR_MESSAGES.CONCLUSION
    setErrors(newErrors)
    if (Object.keys(newErrors).length > EMPTY_ARRAY_LENGTH) {
      validateAndFocusFirstEmptyField(form, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === EMPTY_ARRAY_LENGTH
  }

  // Helper function to create file upload handlers
  const createFileUploadHandler = useCallback((field: 'feedbackDocuments' | 'supportingDocuments', clearError = false) => {
    return (newFile: File | FileData) => {
      if(!hasEditPermission) return;
      setForm((prev: ValidationFormData) => ({
        ...prev,
        [field]: [...(prev[field] as File[]), newFile] as File[],
      }))
      if (clearError) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }))
      }
    }
  }, [hasEditPermission])

  // File upload handlers
  const handleFeedbackFileUpload = createFileUploadHandler(FORM_FIELDS.FEEDBACK_DOCUMENTS)
  const handleSupportingFileUpload = createFileUploadHandler(FORM_FIELDS.SUPPORTING_DOCUMENTS, true)

  // Helper function to update file in array
  const updateFileInArray = useCallback((files: FileData2[], updatedFile: File | FileData | FileData2) => {
    return files.map((file: FileData2) => {
      const currentId = file.id ?? file.file_id
      const updatedId = (updatedFile as FileData2).document_id ?? (updatedFile as FileData2).id
      return currentId === updatedId ? { ...file, ...updatedFile } : file
    })
  }, [])

  // Helper function to handle file editing
  const createFileEditHandler = useCallback((field: 'feedbackDocuments' | 'supportingDocuments') => {
    return (updatedFile: File | FileData | FileData2) => {
      if(!hasEditPermission) return;
      setForm((prev: ValidationFormData) => {
        const currentFiles = prev[field] as FileData2[]
        const updatedFiles = updateFileInArray(currentFiles, updatedFile)
        return {
          ...prev,
          [field]: updatedFiles as File[],
        }
      })
    }
  }, [updateFileInArray, hasEditPermission])

  const handleFeedbackFileEdit = useCallback(createFileEditHandler(FORM_FIELDS.FEEDBACK_DOCUMENTS), [createFileEditHandler])

  const handleSupportingFileEdit = useCallback(createFileEditHandler(FORM_FIELDS.SUPPORTING_DOCUMENTS), [createFileEditHandler])

  // Helper function to create file submit handlers
  const createFileSubmitHandler = useCallback((type: 'feedback' | 'supporting') => {
    return (data: any) => {
      if (type === 'feedback') {
        setFeedbackFinalFileData((prev) => mergeFinalFileData(prev, data))
      } else {
        setSupportingFinalFileData((prev) => mergeFinalFileData(prev, data))
      }
    }
  }, [])

  const handleCancel = () => {
    setForm(DEFAULT_FORM)
    setErrors({})
    resetFileData()
    setValidationId(null)
    router.push(ROUTE_PATHS.DND_PROJECT_LIST)
  }


  const handleSave = () => {
    if (!validate() || !validationId) {
      return
    }
    setIsDisabled(true)
    const formData = new FormData()
    formData.append(API_FIELDS.PLACE_OF_VALIDATION, form.placeOfValidation)
    formData.append(API_FIELDS.SERIAL_NO, form.productSerialNo)
    formData.append(API_FIELDS.VERSION_NO, form.swVersionNo)
    formData.append(API_FIELDS.CORRECTIVE_ACTIONS, form.correctionsText)
    formData.append(API_FIELDS.CONCLUSION, form.conclusion)
    formData.append(
      API_FIELDS.PATIENT_DETAILS,
      JSON.stringify(
        form.patient_details.map((p) => {
          let formattedDate = DateTime.now().toISO()
          if (p.dateTime) {
            const luxonDate = DateTime.fromISO(p.dateTime)
            if (luxonDate.isValid) {
              formattedDate = luxonDate.toISO()
            }
          }
          return {
            name: p.patientName,
            age: p.age,
            date: formattedDate,
            parameters_measured: p.parameters_measured,
            gender: p.gender,
            measured_value: p.measured_value,
            comments: p.comments,
          }
        })
      )
    )
    const feedbackDetails = form.feedback_details.map((f) => ({
      intended_use: f.intended_use_met,
      feedback: f.feedback,
      functional_block: Number(f.functional_block),
      dir: f.dir ?? [],
      decision: Number(f.decision),
      measured_value: f.measured_value,
      comments: f.comments,
    }))
    formData.append(API_FIELDS.FEEDBACK_DETAILS, JSON.stringify(feedbackDetails))

    // Process file data for both feedback and supporting documents
    const processPilotValidationFileData = (fileData: FinalFileData, fileType: string) => {
      const updatedCreateMetaData: Record<string, FileData2> = {}
      const updatedDocumentsToCreate: File[] = []
      
      // Process documents_to_create for pilot validation
      fileData.documents_to_create.forEach((fileObj) => {
        const meta = fileData.create_meta_data[fileObj.name]
        if (meta) {
          updatedCreateMetaData[fileObj.name] = {
            ...meta,
            file_type: fileType,
          }
          updatedDocumentsToCreate.push(fileObj)
        }
      })

      return {
        updatedCreateMetaData,
        updatedDocumentsToCreate,
      }
    }
    
    const feedbackFileData = processPilotValidationFileData(feedbackFinalFileData, FILE.TYPE_FEEDBACK)
    const supportingFileData = processPilotValidationFileData(supportingFinalFileData, FILE.TYPE_SUPPORTING)

    // Merge create_meta_data from both
    const updatedCreateMetaData = {
      ...feedbackFileData.updatedCreateMetaData,
      ...supportingFileData.updatedCreateMetaData,
    }

    // Merge update_meta_data from both
    const updatedUpdateMetaData = {
      ...feedbackFinalFileData.update_meta_data,
      ...supportingFinalFileData.update_meta_data,
    }

    // Combine all files to create
    const allDocumentsToCreate = [
      ...feedbackFileData.updatedDocumentsToCreate,
      ...supportingFileData.updatedDocumentsToCreate,
    ]
    // Combine all files to delete
    const allDocumentIDToDelete = [
      ...feedbackFinalFileData.documents_to_delete,
      ...supportingFinalFileData.documents_to_delete,
    ]

    // Create FormData and append files
    allDocumentsToCreate.forEach((file: File) => {
      if (file instanceof File) {
        formData.append(API_FIELDS.DOCUMENTS_TO_CREATE, file, file.name)
      }
    })

    // Append the remaining fields
    formData.append(API_FIELDS.DOCUMENTS_TO_DELETE, JSON.stringify(allDocumentIDToDelete))
    formData.append(API_FIELDS.CREATE_META_DATA, JSON.stringify(updatedCreateMetaData))
    formData.append(API_FIELDS.UPDATE_META_DATA, JSON.stringify(updatedUpdateMetaData))

    saveValidationReportMutation.mutateAsync(formData).then(() => {
      showActionAlert(STATUS.SUCCESS)
      resetFileData()
      setIsDisabled(false)
    }).catch(() => {
      showActionAlert(STATUS.FAILED)
      setIsDisabled(false)
    })
  }





  // Helper function to generate next ID
  const generateNextId = useCallback(<T,>(items: T[]) => {
    return items.length ? (items[items.length - NUMBERMAP.ONE] as any).id + NUMBERMAP.ONE : NUMBERMAP.ONE
  }, [])

  const updateFormArray = useCallback(
    <T,>(field: keyof ValidationFormData, item: T, editId: number | null, generateId: (items: T[]) => number) => {
      setForm((prev) => {
        const items = prev[field] as T[]
        if (editId !== null) {
          return {
            ...prev,
            [field]: items.map((existing) => ((existing as any).id === editId ? item : existing)),
          }
        }
        return {
          ...prev,
          [field]: [...items, { ...item, id: generateId(items) }],
        }
      })
    },
    []
  )

  const deleteFormItem = useCallback(
    async <T,>(field: keyof ValidationFormData, id: number) => {
      if(!hasEditPermission) return;
      const result = await showActionAlert(ACTION_TYPES.DELETE)
      if (result.isConfirmed) {
        setForm((prev) => ({
          ...prev,
          [field]: (prev[field] as T[]).filter((item: any) => item.id !== id),
        }))
        showActionAlert(ACTION_TYPES.SUCCESS)
      }
    },
    [hasEditPermission]
  )


  const openModal = useCallback(
    <T,>(setModalOpen: (open: boolean) => void, setFormData: (data: T) => void, defaultForm: T, setEditId: (id: number | null) => void, row?: any) => {
      setFormData(row ? { ...row } : defaultForm)
      setEditId(row ? row.id : null)
      setModalOpen(true)
    },
    []
  )

  // Helper function to close modal and reset form
  const closeModalAndReset = useCallback(
    <T,>(setModalOpen: (open: boolean) => void, setFormData: (data: T) => void, defaultForm: T, setEditId: (id: number | null) => void) => {
      setModalOpen(false)
      setFormData(defaultForm)
      setEditId(null)
    },
    []
  )

  const handleOpenPatientModal = () => openModal(setPatientModalOpen, setPatientForm, DEFAULT_PATIENT, setEditPatientId)
  const handleEditPatient = (row: any) => openModal(setPatientModalOpen, setPatientForm, DEFAULT_PATIENT, setEditPatientId, row)
  const handleOpenFeedbackModal = () => openModal(setFeedbackModalOpen, setFeedbackForm, DEFAULT_FEEDBACK, setEditFeedbackId)
  const handleEditFeedback = (row: any) => {
    openModal(setFeedbackModalOpen, setFeedbackForm, DEFAULT_FEEDBACK, setEditFeedbackId, { ...row, dir: row.dir ?? [] })
  }

  const handlePatientChange = useCallback((field: string, value: any) => {
    setPatientForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSavePatient = () => {
      /**
     * Function Name: handleSavePatient
     * Params: none
     * Description: used to save the patient popup form,
     * Modified By : Savitri K,
     * Modified : 11-09-2025,
     * Classification : Confidential
    **/
    const isValid = patientForm.patientName?.trim() && patientForm.dateTime && patientForm.age && patientForm.gender?.trim() && patientForm.parameters_measured?.trim() && patientForm.measured_value?.trim()
    if (!isValid) {
      showActionAlert(ACTION_TYPES.FAILED)
      return
    }
    updateFormArray(FORM_FIELDS.PATIENT_DETAILS, patientForm, editPatientId, generateNextId)
    closeModalAndReset(setPatientModalOpen, setPatientForm, DEFAULT_PATIENT, setEditPatientId)
  }

  const handleFeedbackChange = (field: string, value: any) => {
    let parsedValue = value
    if (field === FEEDBACK_FIELDS.DIR) parsedValue = value ?? []
    else if (field === FEEDBACK_FIELDS.FUNCTIONAL_BLOCK || field === FEEDBACK_FIELDS.DECISION) parsedValue = Number(value)
    setFeedbackForm((prev) => ({ ...prev, [field]: parsedValue }))
  }

  const handleSaveFeedback = () => {
           /**
     * Function Name: handleSaveFeedback
     * Params: none
     * Description: used to save the feedback popup form,
     * Modified By : Savitri K,
     * Modified : 11-09-2025,
     * Classification : Confidential
    **/
    const isValid = feedbackForm.feedback?.trim() && feedbackForm.functional_block && feedbackForm.dir.length > NUMBERMAP.ZERO && feedbackForm.decision && feedbackForm.measured_value?.trim()
    if (!isValid) {
      return
    }
    setErrors((prev) => ({ ...prev, feedback_details: '' }))
    updateFormArray(FORM_FIELDS.FEEDBACK_DETAILS, feedbackForm, editFeedbackId, generateNextId)
    closeModalAndReset(setFeedbackModalOpen, setFeedbackForm, DEFAULT_FEEDBACK, setEditFeedbackId)
  }

  const getFunctionalBlockName = (id: number | string) => {
    if (!functionalBlockQuery?.data) return '-'
    const allBlocks = functionalBlockQuery?.data?.flatMap((item: { blocks?: FunctionalBlockOption[] }) => item.blocks ?? [])
    const match = allBlocks.find((item: any) => Number(item.functional_block_id) === Number(id))
    return match?.title ?? '-'
  }

  const getDecisionName = (id: number | string) => {
    if (!decisionOptionsQuery.data?.data) return '-'
    const match = decisionOptionsQuery.data.data.find((item: any) => Number(item.decision_id) === Number(id))
    return match?.decision ?? '-'
  }

  const getDirNames = (ids: number[] = []) => {
    if (!dirOptionsQuery.data?.data) return STATIC_LABELS.LOADING
    if (!Array.isArray(ids) || ids.length === NUMBERMAP.ZERO) return '—'
    return ids
      ?.map?.((id) => {
        const matched = dirOptionsQuery.data.data?.find?.((opt) => Number(opt.design_input_requirement_id) === Number(id))
        return matched?.dir_id ?? `Unknown (${id})`
      })
      .join(', ')
  }

  // Helper function to get serial number for row
  const getSerialNumber = useCallback((dataArray: any[], row: any) => {
    const index = dataArray.findIndex((item) => item === row)
    return index >= NUMBERMAP.ZERO ? index + NUMBERMAP.ONE : '-'
  }, [])

  // Helper function to render field with tooltip
  const renderFieldWithTooltip = useCallback((content: TooltipContent, maxLength: number = NUMBERMAP.TWENTY) => {
    const textContent = String(content ?? '')
    const truncatedText = textContent.length > maxLength 
      ? textContent.substring(NUMBERMAP.ZERO, maxLength) + '...' 
      : textContent
    
    return (
      <GenericTooltip content={content}>
        {truncatedText}
      </GenericTooltip>
    )
  }, [])

  // Helper function to create serial number column
  const createSerialNumberColumn = useCallback((dataArray: any[]) => ({
    field: TABLE_COLUMNS.PATIENT.SERIAL_NO, 
    headerName: STATIC_LABELS.SERIAL_NO, 
    flex: NUMBERMAP.HALF, 
    sortable: false,
    renderCell: (params: any) => getSerialNumber(dataArray, params.row),
  }), [getSerialNumber])

  // Helper function to create action column
  const createActionColumn = useCallback((field: 'patient_details' | 'feedback_details', editHandler: (row: any) => void) => ({
    field: STATIC_LABELS.ACTION_LOWER,
    headerName: STATIC_LABELS.ACTION_CAPS,
    flex: NUMBERMAP.ONE,
    renderCell: (params: any) => (
      <ActionButton
        onEdit={() => editHandler(params.row)}
        onDelete={() => deleteFormItem(field, params.row.id)}
      />
    ),
  }), [deleteFormItem, hasEditPermission])

  const patientColumns = [
    createSerialNumberColumn(form.patient_details),
    {
      field: TABLE_COLUMNS.PATIENT.DATE_TIME,
      headerName: STATIC_LABELS.DATE_TIME,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => renderFieldWithTooltip(formatDateTime(params.row.dateTime, PILOT_VALIDATION.DATE_TIME_FORMAT)),
    },
    {
      field: TABLE_COLUMNS.PATIENT.PATIENT_INFO,
      headerName: STATIC_LABELS.PATIENT_INFO,
      flex: NUMBERMAP.TWO,
      renderCell: (params: any) => renderFieldWithTooltip(`${params.row.patientName} / ${params.row.age}/${params.row.gender}`),
    },
    {
      field: TABLE_COLUMNS.PATIENT.PARAMETERS_MEASURED,
      headerName: STATIC_LABELS.PARAMETERS_MEASURED,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => renderFieldWithTooltip(stripHtml(params.row.parameters_measured ?? '')),
    },
    createActionColumn(FORM_FIELDS.PATIENT_DETAILS, handleEditPatient),
  ]

  const feedbackColumns = [
    createSerialNumberColumn(form.feedback_details),
    {
      field: TABLE_COLUMNS.FEEDBACK.FEEDBACK,
      headerName: STATIC_LABELS.FEEDBACK_DETAILS,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => renderFieldWithTooltip(stripHtml(params.row.feedback ?? '')),
    },
    {
      field: TABLE_COLUMNS.FEEDBACK.FUNCTIONAL_BLOCK,
      headerName: STATIC_LABELS.FUNCTIONAL_BLOCK,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => renderFieldWithTooltip(getFunctionalBlockName(params.row.functional_block)),
    },
    {
      field: TABLE_COLUMNS.FEEDBACK.DIR,
      headerName: STATIC_LABELS.DIR,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => renderFieldWithTooltip(getDirNames(params.row.dir)),
    },
    {
      field: TABLE_COLUMNS.FEEDBACK.DECISION,
      headerName: STATIC_LABELS.DECISION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => renderFieldWithTooltip(getDecisionName(params.row.decision)),
    },
    createActionColumn(FORM_FIELDS.FEEDBACK_DETAILS, handleEditFeedback),
  ]

  const permissions = validationReportQuery?.data?.meta_info?.action_control?.permissions ?? [];


  return (
    <>
    <GlobalLoader loading={isAnyLoading()}/>
    {placeOfValidationQuery.data && (
      <FormContainer sx={{ padding: NUMBERMAP.ZERO }}>
        <FormWrapper>
          <Label title={UI_TEXT.PAGE_TITLE} />
          <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={UI_TEXT.PLACE_OF_VALIDATION_LABEL}
                placeholder={UI_TEXT.PLACE_OF_VALIDATION_PLACEHOLDER}
                isDropdown
                keyField={STATIC_LABELS.ID}
                valueField={STATIC_LABELS.PLACE}
                value={form.placeOfValidation}
                onChange={(value) => handleChange(FORM_FIELDS.PLACE_OF_VALIDATION, value)}
                options={placeValidationOptions.data ?? []}
                error={errors.placeOfValidation}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={UI_TEXT.PRODUCT_SERIAL_NO_LABEL}
                placeholder={UI_TEXT.PRODUCT_SERIAL_NO_PLACEHOLDER}
                value={form.productSerialNo}
                hasEditable={isFieldsDisabled}
                onChange={(value) => handleChange(FORM_FIELDS.PRODUCT_SERIAL_NO, value)}
                error={errors.productSerialNo}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={UI_TEXT.SW_VERSION_NO_LABEL}
                placeholder={UI_TEXT.SW_VERSION_NO_PLACEHOLDER}
                value={form.swVersionNo}
                hasEditable={isFieldsDisabled}
                onChange={(value) => handleChange(FORM_FIELDS.SW_VERSION_NO, value)}
                error={errors.swVersionNo}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
              <DataGridTable
                showAddButton={hasEditPermission}
                onAddRow={handleOpenPatientModal}
                columns={patientColumns}
                idField={FEEDBACK_FIELDS.ID}
                rows={form.patient_details}
                hideFooter
                title={UI_TEXT.PATIENT_DETAILS_TITLE}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }} id={FIELD_LABEL_MAP.feedback_details}>
              <DataGridTable
                showAddButton={hasEditPermission}
                onAddRow={handleOpenFeedbackModal}
                columns={feedbackColumns}
                idField={FEEDBACK_FIELDS.ID}
                rows={form.feedback_details}
                hideFooter
                title={UI_TEXT.FEEDBACK_TITLE}
              />
              {errors.feedback_details && <ErrorText>{errors.feedback_details}</ErrorText>}
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
                <FileUploadManager
                  initialFiles={form.feedbackDocuments}
                  onFileUpload={handleFeedbackFileUpload}
                  onFileEdit={handleFeedbackFileEdit}
                  hasEditable={!hasEditPermission}
                  onSubmit={createFileSubmitHandler('feedback')}
                />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                id={FIELD_LABEL_MAP.correctionsText}
                label={UI_TEXT.CORRECTIONS_LABEL}
                value={form.correctionsText}
                onChange={(value) => handleChange(FORM_FIELDS.CORRECTIONS_TEXT, value)}
                placeholder={UI_TEXT.CORRECTIONS_PLACEHOLDER}
                error={errors.correctionsText}
                disabled={isFieldsDisabled}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                id={FIELD_LABEL_MAP.conclusion}
                label={UI_TEXT.CONCLUSION_LABEL}
                value={form.conclusion}
                onChange={(value) => handleChange(FORM_FIELDS.CONCLUSION, value)}
                placeholder={UI_TEXT.CONCLUSION_PLACEHOLDER}
                error={errors.conclusion}
                disabled={isFieldsDisabled}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
              <FileUploadManager
                initialFiles={form.supportingDocuments}
                onFileUpload={handleSupportingFileUpload}
                onFileEdit={handleSupportingFileEdit}
                onSubmit={createFileSubmitHandler('supporting')}
                hasEditable={!hasEditPermission}
                uploadMandError={errors.supportingDocuments}
              />
            </Grid2>
          </Grid2>
        </FormContent>
        <Box sx={{p:2}}>
        <CommentsHistory 
              comments={validationReportQuery?.data?.meta_info?.task_info?.task_comments}
            />
          {validationReportQuery.data && (
            <ReviewerModalManager
              isLoading={validationReportQuery.isLoading}
              permissions={permissions}
              projectId={projectId}
              menuId={validationReportQuery?.data?.meta_info?.action_control?.menuId}
              menuName={validationReportQuery?.data?.meta_info?.action_control?.formName}
              taskId={validationReportQuery?.data?.meta_info?.task_info?.task_id}
              onPermissionChange={setHasEditPermission}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
                isDisabled: isDisabled
              }}
              reviewerList={validationReportQuery?.data?.meta_info?.task_info?.reviewer_list}
            />
          )}
           </Box>
        <PatientModal
          open={patientModalOpen}
          onClose={() => setPatientModalOpen(false)}
          onSave={handleSavePatient}
          patientForm={patientForm}
          handlePatientChange={handlePatientChange}
          editPatientId={editPatientId}
          hasEditPermission={!isFieldsDisabled}
        />
        <FeedbackModal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          onSave={handleSaveFeedback}
          feedbackForm={feedbackForm}
          handleFeedbackChange={handleFeedbackChange}
          editFeedbackId={editFeedbackId}
          projectStageOrderId={projectStageOrderId}
          hasEditPermission={!isFieldsDisabled}
        />
      </FormWrapper>
    </FormContainer>
    )}
    </>
  )
}

export default PilotValidationReport