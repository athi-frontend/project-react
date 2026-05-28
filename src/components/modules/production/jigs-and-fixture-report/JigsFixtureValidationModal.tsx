'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { ActionButton, RichTextEditor, InputField, DataGridTable, RadioButtonGroup, showActionAlert } from '@/components/ui'
import { UnderLineButton } from '@/styles/common'
import { NUMBERMAP, FINALFILEINITIALDATA, radioOptionsPASSFAIL } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs, { Dayjs } from 'dayjs'
import { 
  useJigFixtureValidations, 
  useJigNumbersByType, 
  useJigFixtureValidationList,
  useJigFixturesValidationReportById
} from '@/hooks/modules/production/useCommonProductionDropDownHook'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FinalFileData, isDocumentUploadValid, mergeFinalFileData, stripHtml } from '@/lib/utils/common'
import {JigValidationDetail,JigsFixtureValidation} from "@/types/modules/production/jigsAndFixtureValidation"
import { SANITY_CHECK_MODAL_CONSTANTS } from '@/constants/modules/quality-control-management/sanityCheckInspection'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'

interface JigsFixtureValidationModalProps {
  open: boolean
  onClose: () => void
  onSave: (validationData: JigsFixtureValidation) => void
  editingValidation: JigsFixtureValidation | null
  validations: JigsFixtureValidation[]
  assemblyPartItemDetailId?: number
  upsertMutation?: any
  projectId: number
}

const JigsFixtureValidationModal: React.FC<JigsFixtureValidationModalProps> = ({
  open,
  onClose,
  onSave,
  editingValidation,
  validations,
  assemblyPartItemDetailId,
  upsertMutation,
  projectId,
}) => {
  // Form state for modal
  const [jigType, setJigType] = useState('')
  const [jigNumber, setJigNumber] = useState('')
  const [jigName, setJigName] = useState('')
  const [lastValidate, setLastValidate] = useState('')
  const [procedureOfValidation, setProcedureOfValidation] = useState('')
  const [scopeOfApplication, setScopeOfApplication] = useState('')
  const [dateOfValidation, setDateOfValidation] = useState<Dayjs | null>(null)
  const [jigValidations, setJigValidations] = useState<JigValidationDetail[]>([])
  const [testObservationModalOpen, setTestObservationModalOpen] = useState(false)
  const [testObservation, setTestObservation] = useState('')
  const [editingTestObservationRowId, setEditingTestObservationRowId] = useState<number | null>(null)
  const [jigValidationData, setJigValidationData] = useState<Record<number, { test_observation: string; result: string }>>({})
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [initialFiles, setInitialFiles] = useState<any[]>([])
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])
  const draftFetchedRef = useRef(false)
  
  // Error states for validation
  const [errors, setErrors] = useState<{
    jigType: string
    jigNumber: string
    dateOfValidation: string
    fileUpload: string
  }>({
    jigType: '',
    jigNumber: '',
    dateOfValidation: '',
    fileUpload: ''
  })
  
  const { data: jigFixtureOptionsData, isLoading: isLoadingJigTypes } = useJigFixtureValidations(projectId, open)
  const jigFixtureOptions = jigFixtureOptionsData?.data ?? []
  const { data: jigNumbersData, isLoading: isLoadingJigNumbers } = useJigNumbersByType(jigType ? Number(jigType) : NUMBERMAP.ZERO, !!jigType && open)
  const jigNumbersOptions = jigNumbersData?.data ?? []
  const { data: jigFixtureValidationListData, isLoading: isLoadingValidationList } = useJigFixtureValidationList(jigType, !!jigType && open)
  // Fetch report data when editing
  const reportIdForEdit = editingValidation?.id ? Number(editingValidation.id) : null
  const { data: reportDetailData,refetch:jigsFixtureReportFetch } = useJigFixturesValidationReportById(
    reportIdForEdit,
    false
  )

  // Draft save hook
  const jigsFixtureValidationReportIdForDraft = reportIdForEdit
  const { 
    draftSave, 
    clearDraftSave, 
    isDraftSaving, 
    draftData, 
    fetchDraft, 
    checkUnsavedDraftBeforeLeave 
  } = useDraftSave({
    context_type: "jig_fixtures_validation_report",
    context_instance_id: jigsFixtureValidationReportIdForDraft,
    enableFetch: false
  })

  useEffect(()=>{
    jigsFixtureReportFetch()
  },[editingValidation])

  // Load draft data
  const loadDraftData = useCallback((data: any) => {
    const resolvedData = Array.isArray(data?.data)
      ? data.data[NUMBERMAP.ZERO]
      : data?.data ?? data ?? {}
    setJigType(String(resolvedData?.jig_type_id ?? ''))
    setJigNumber(String(resolvedData?.jig_item_id ?? ''))
    setJigName(resolvedData?.jig_name ?? '')
    setProcedureOfValidation(resolvedData?.procedure_of_validation ?? '')
    setScopeOfApplication(resolvedData?.scope_of_application ?? '')
    if (resolvedData?.date_of_validation ?? resolvedData?.validation_date) {
        setDateOfValidation(dayjs(resolvedData?.date_of_validation ?? resolvedData?.validation_date))
      }
    const lastValidateDate = resolvedData?.last_validation_date
      setLastValidate(typeof lastValidateDate === 'string' 
        ? dayjs(lastValidateDate)
        : lastValidateDate)
    setJigValidationData(resolvedData?.jig_validation_data)
    setFinalFileData(resolvedData?.final_file_data)
    // Merge documents from draftDocuments and documents/initial_files
    const mergedDocuments = [
      ...(Array.isArray(resolvedData.documents) ? resolvedData.documents : []),
      ...(resolvedData?.draftDocuments?.documents ?? []),
      ...(Array.isArray(resolvedData.initial_files) ? resolvedData.initial_files : []),
    ]
    if (mergedDocuments.length > NUMBERMAP.ZERO) {
      setInitialFiles(mergedDocuments)
    } else if (resolvedData.initial_files && Array.isArray(resolvedData.initial_files)) {
      setInitialFiles(resolvedData.initial_files)
    }
    setDraftDocuments(resolvedData?.draftDocuments)
    if (resolvedData.draftDelete) {
      const deleteArray = Array.isArray(resolvedData.draftDelete)
        ? resolvedData.draftDelete
        : Object.values(resolvedData.draftDelete).flat()
      setDraftDelete(deleteArray)
    }
  }, [])

  useEffect(() => {
    if (open && draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData, loadDraftData, open])

  const getResultStatus = (result: string | null | undefined): string | null => {
    if(result=='yes'){
      return 'pass'
    }else if(result == 'no'){
      return 'fail'
    }else if (result == 'pass'){
      return 'yes'
    }else if(result == 'fail'){
      return 'no'
    }else{
      return null
    }
  }
  const acceptanceCriteriaRows = React.useMemo(() => {
    if (!jigFixtureValidationListData?.data || jigFixtureValidationListData.data.length === NUMBERMAP.ZERO) return []
    const first = jigFixtureValidationListData.data[NUMBERMAP.ZERO]
    return first.acceptance_criteria_detail ?? []
  }, [jigFixtureValidationListData])

  // Set jigName, lastValidate based on fetched details from jigNumber
  React.useEffect(() => {
    if (jigNumber) {
      const selectedJigNumberObj = jigNumbersOptions.find(j => String(j.jig_item_id) === String(jigNumber))
      if (selectedJigNumberObj) {
        setJigName(selectedJigNumberObj.jig_item ?? '')
        setLastValidate('')
      }
    } else {
      setJigName('')
      setLastValidate('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jigNumber])

  // Populate form data when report detail is fetched for editing
  React.useEffect(() => {
    if (reportDetailData?.data?.length>NUMBERMAP.ZERO && editingValidation) {
      const reportData = reportDetailData.data[NUMBERMAP.ZERO] 
      if (reportData?.type === 'draft') {
        loadDraftData(reportData)
      } else {
      setJigType(reportData.jig_type_id??'')
      setJigNumber(reportData.jig_item_id??'')
      setJigName(reportData.jig_name??'')
      setProcedureOfValidation(reportData?.procedure_of_validation??"")
      setScopeOfApplication(reportData?.scope_of_application??'')
      setDateOfValidation(dayjs(reportData?.validation_date))
      const lastValidateDate = reportData?.last_validation_date
        setLastValidate(typeof lastValidateDate === 'string' 
          ? dayjs(lastValidateDate)
          : lastValidateDate)
      const validationDataMap: Record<number, { test_observation: string; result: string }> = {}
        reportData?.test_rows.forEach((item: any) => {
          if (item.acceptance_criteria_id) {
            const resultValue = item.result_slug ?? item.result ?? ''
            validationDataMap[item.acceptance_criteria_id] = {
              test_observation: item.test_observation ?? '',
              result:resultValue
            }
          }
        })
      setJigValidationData(validationDataMap)
      setInitialFiles(reportData?.documents??[])
      }
      draftFetchedRef.current = true
    } else if (open && !editingValidation && !draftFetchedRef.current) {
        fetchDraft()
        draftFetchedRef.current = true
    } else if (open && editingValidation && !reportDetailData?.data?.length) {
      // Reset form if editingValidation exists but no data is available
      setJigType('')
      setJigNumber('')
      setJigName('')
      setLastValidate('')
      setProcedureOfValidation('')
      setScopeOfApplication('')
      setDateOfValidation(null)
      setJigValidationData({})
      setFinalFileData(FINALFILEINITIALDATA)
      setInitialFiles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportDetailData, editingValidation, open, fetchDraft, draftData])

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setJigType('')
      setJigNumber('')
      setJigName('')
      setLastValidate('')
      setProcedureOfValidation('')
      setScopeOfApplication('')
      setDateOfValidation(null)
      setJigValidations([])
      setJigValidationData({})
      setFinalFileData(FINALFILEINITIALDATA)
      setInitialFiles([])
      setErrors({
        jigType: '',
        jigNumber: '',
        dateOfValidation: '',
        fileUpload: ''
      })
      draftFetchedRef.current = false
    } else if (editingValidation) {
      // When editing, don't reset - let the API fetch populate
      setProcedureOfValidation('')
      setScopeOfApplication('')
      setDateOfValidation(null)
      setJigValidationData({})
      setFinalFileData(FINALFILEINITIALDATA)
      setInitialFiles([])
      setErrors({
        jigType: '',
        jigNumber: '',
        dateOfValidation: '',
        fileUpload: ''
      })
    }
  }, [open, editingValidation])

  // Draft save handler
  const handleDraftSave = useCallback((params?: {
    jigTypeToSave?: string
    jigNumberToSave?: string
    jigNameToSave?: string
    procedureToSave?: string
    scopeToSave?: string
    dateToSave?: Dayjs | null
    lastValidateToSave?: string | Dayjs
    validationDataToSave?: Record<number, { test_observation: string; result: string }>
    fileDataToSave?: FinalFileData
    filesToSave?: any[]
  }) => {
    const {
      jigTypeToSave,
      jigNumberToSave,
      jigNameToSave,
      procedureToSave,
      scopeToSave,
      dateToSave,
      lastValidateToSave,
      validationDataToSave,
      fileDataToSave,
      filesToSave
    } = params ?? {}
    const finalFileDataValue = fileDataToSave ?? finalFileData
    let draftDatas = !editingValidation ? draftData : reportDetailData
    
    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }
    
    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      {},
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      const deleteArray = Array.isArray(draftPreparation.draftDelete)
        ? draftPreparation.draftDelete
        : Object.values(draftPreparation.draftDelete).flat()
      setDraftDelete(deleteArray)
    }

    const resolvedJigType = jigTypeToSave ?? jigType
    const resolvedJigNumber = jigNumberToSave ?? jigNumber
    const resolvedDate = dateToSave ?? dateOfValidation
    const lastValidationSource = lastValidateToSave ?? lastValidate

    let lastValidationDate: string | null = null
    if (lastValidationSource) {
      if (typeof lastValidationSource === 'string') {
        lastValidationDate = lastValidationSource
      } else {
        lastValidationDate = dayjs(lastValidationSource).toISOString()
      }
    }

    const payload = {
      id: jigsFixtureValidationReportIdForDraft ?? new Date().getTime(),
      jig_type_id: resolvedJigType ? Number(resolvedJigType) : null,
      jig_item_id: resolvedJigNumber ? Number(resolvedJigNumber) : null,
      jig_name: (jigNameToSave ?? jigName) ?? null,
      procedure_of_validation: (procedureToSave ?? procedureOfValidation) ?? null,
      scope_of_application: (scopeToSave ?? scopeOfApplication) ?? null,
      date_of_validation: resolvedDate ? resolvedDate.toISOString() : null,
      validation_date: resolvedDate ? resolvedDate.toISOString() : null,
      last_validation_date: lastValidationDate,
      jig_validation_data: validationDataToSave ?? jigValidationData,
      final_file_data: fileDataToSave ?? finalFileData,
      initial_files: filesToSave ?? initialFiles,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }, [draftSave, jigsFixtureValidationReportIdForDraft, jigType, jigNumber, jigName, procedureOfValidation, scopeOfApplication, dateOfValidation, lastValidate, jigValidationData, finalFileData, initialFiles, draftDocuments, draftDelete, editingValidation, draftData, reportDetailData])

  // Validation function
  const validateFields = (): boolean => {
    const newErrors = {
      jigType: '',
      jigNumber: '',
      dateOfValidation: '',
      fileUpload: ''
    }

    if (!jigType) {
      newErrors.jigType = 'Please select Jig Type'
    }

    if (!jigNumber) {
      newErrors.jigNumber = 'Please select Jig Number'
    }

    if (!dateOfValidation) {
      newErrors.dateOfValidation = 'Please select Date of Validation'
    }
    
    if (!isDocumentUploadValid(finalFileData, initialFiles)) {
      newErrors.fileUpload = 'File/documents are required'
    }

    setErrors(newErrors)

    return !newErrors.jigType && !newErrors.jigNumber && !newErrors.dateOfValidation && !newErrors.fileUpload
  }

  // Clear error when field changes
  const handleJigTypeChange = (value: string) => {
    setJigType(prev => {
      handleDraftSave({ jigTypeToSave: value })
      return value
    })
    if (errors.jigType) {
      setErrors(prev => ({ ...prev, jigType: '' }))
    }
  }

  const handleJigNumberChange = (value: string) => {
    setJigNumber(prev => {
      handleDraftSave({ jigNumberToSave: value })
      return value
    })
    if (errors.jigNumber) {
      setErrors(prev => ({ ...prev, jigNumber: '' }))
    }
  }

  const handleDateOfValidationChange = (date: Dayjs | null) => {
    setDateOfValidation(prev => {
      handleDraftSave({ dateToSave: date })
      return date
    })
    if (errors.dateOfValidation) {
      setErrors(prev => ({ ...prev, dateOfValidation: '' }))
    }
  }

  const createDocuments = (formData:FormData, updatedFileData?: FinalFileData) =>{
    const fileDataToUse = updatedFileData ?? finalFileData
    
      if (fileDataToUse.documents_to_create && fileDataToUse.documents_to_create.length > NUMBERMAP.ZERO) {
        fileDataToUse.documents_to_create.forEach((file: File) => {
          if (file instanceof File) {
            formData.append('documents_to_create', file, file.name)
          }
        })
      }

      if (fileDataToUse.documents_to_delete && fileDataToUse.documents_to_delete.length > NUMBERMAP.ZERO) {
        formData.append('documents_to_delete', JSON.stringify(fileDataToUse.documents_to_delete))
      }

      if (fileDataToUse.create_meta_data && Object.keys(fileDataToUse.create_meta_data).length > NUMBERMAP.ZERO) {
        formData.append('create_meta_data', JSON.stringify(fileDataToUse.create_meta_data))
      }

      if (fileDataToUse.update_meta_data && Object.keys(fileDataToUse.update_meta_data).length > NUMBERMAP.ZERO) {
        formData.append('update_meta_data', JSON.stringify(fileDataToUse.update_meta_data))
      }
  }

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !!editingValidation,
      draftData: !editingValidation ? draftData : reportDetailData,
      existingData: reportDetailData,
      finalFileData: finalFileData,
    })
  }

  const handleSaveValidation = async () => {
    if (!validateFields() || !assemblyPartItemDetailId) {
      return
    }

    clearDraftSave()

    const jigValidationArray = acceptanceCriteriaRows.map((row: any) => {
      const validationData = jigValidationData[row.acceptance_criteria_id] ?? {}
      return {
        acceptance_criteria_id: row.acceptance_criteria_id,
        test_observation: validationData.test_observation ?? '',
        result: validationData.result??null
      }
    }).filter((item: any) => item.test_observation ?? item.result)
      const formData = new FormData()
      if(jigValidationArray.length==NUMBERMAP.ZERO){
        showActionAlert('customAlert',{
          icon:'error',
          title:'Jig Validation Required',
          text:'Please fill in all test observations and results for the jigs validation',
          cancelButton:false,
          confirmButton:false
        })
        return
      }
      if (editingValidation?.id) {
        formData.append('jigs_fixtures_validation_report_id', String(editingValidation.id))
      }
      formData.append('assembly_part_item_detail_id', String(assemblyPartItemDetailId))
      formData.append('jig_item_id', String(jigNumber))
      formData.append('date_of_validation', dateOfValidation?.toISOString() ?? '')
      formData.append('jig_validation', JSON.stringify(jigValidationArray))

      // Prepare file metadata using createFileMetadata function
      const fileMetadata = createFileMetadata()
      if (fileMetadata) {
        const updatedFileData: FinalFileData = {
          ...finalFileData,
          create_meta_data: fileMetadata.create_meta_data,
          update_meta_data: fileMetadata.update_meta_data,
          documents_to_delete: fileMetadata.documents_to_delete?.map(String) ?? [],
        }
        createDocuments(formData, updatedFileData)
      } else {
        createDocuments(formData)
      }
    if (upsertMutation) {
        await upsertMutation.mutateAsync(formData)
        const validationData: JigsFixtureValidation = {
          id: editingValidation?.id ?? `validation-${Date.now()}`,
          jigType: jigType,
          jigNo: jigNumber,
          jigName: jigName,
          status: 'Active',
          lastValidate: lastValidate,
          procedureOfValidation: procedureOfValidation,
          scopeOfApplication: scopeOfApplication,
          dateOfValidation: dateOfValidation?.format('YYYY-MM-DD') ?? '',
          jigValidations: jigValidations,
        }
        onSave(validationData)
        onClose()
    }
  }

  const handleTestObservationSave = () => {
    if (editingTestObservationRowId !== null) {
      setJigValidationData((prev) => {
        const updated = {
          ...prev,
          [editingTestObservationRowId]: {
            ...prev[editingTestObservationRowId],
            test_observation: testObservation
          }
        }
        handleDraftSave({ validationDataToSave: updated })
        return updated
      })
      setEditingTestObservationRowId(null)
    }
    setTestObservationModalOpen(false)
    setTestObservation('')
  }

  const handleTestObservationEdit = (rowId: number, currentObservation: string) => {
    setEditingTestObservationRowId(rowId)
    setTestObservation(currentObservation ?? '')
    setTestObservationModalOpen(true)
  }

  const handleResultChange = (rowId: number, value: string | number) => {
    setJigValidationData((prev) => {
      const updated = {
        ...prev,
        [rowId]: {
          ...prev[rowId],
          result: getResultStatus(String(value))
        }
      }
      handleDraftSave({ validationDataToSave: updated })
      return updated
    })
  }

  const handleFileUpload = (newFile: any) => {
    setInitialFiles((prev) => {
      const updated = [...prev, newFile]
      handleDraftSave({ filesToSave: updated })
      return updated
    })
  }

  const handleFileEdit = useCallback((documents: any) => {
    setInitialFiles((prev) => {
      const updatedFiles = prev.map((file) => {
        const currentId =
          typeof file === 'object'
            ? (file.file_id ?? file.id)
            : undefined
        const updatedId = documents.document_id ?? documents.id
        return currentId === updatedId ? { ...file, ...documents } : file
      })
      handleDraftSave({ filesToSave: updatedFiles })
      return updatedFiles
    })
  }, [handleDraftSave])

  const handleFileSubmit = (data: FinalFileData) => {
    setFinalFileData((prev) => {
      const updated = mergeFinalFileData(prev, data)
      handleDraftSave({ fileDataToSave: updated })
      return updated
    })
    setErrors(prev => ({ ...prev, fileUpload: '' }))
  }

  const handleModalClose = async () => {
    await checkUnsavedDraftBeforeLeave()
    onClose()
  }

  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <CommonModal
        open={open}
        title={editingValidation ? 'Edit Jigs and Fixture Validation' : 'Add Jigs and Fixture Validation'}
        onClose={handleModalClose}
        onSave={handleSaveValidation}
        buttonRequired={true}
        modalMaxWidth={SANITY_CHECK_MODAL_CONSTANTS.MODAL_MAX_WIDTH}
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={{ ...POPUP_STYLE }}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={"Jig Type*"}
              placeholder={"Select Jig Type"}
              isDropdown
              options={jigFixtureOptions ?? []}
              keyField="jig_fixture_validation_id"
              valueField="jigs_type"
              value={jigType}
              onChange={handleJigTypeChange}
              disabled={isLoadingJigTypes}
              error={errors.jigType}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Jig Number*'}
              placeholder={'Select Jig Number'}
              isDropdown
              options={jigNumbersOptions ?? []}
              keyField="jig_item_id"
              valueField="jig_number"
              value={jigNumber}
              onChange={handleJigNumberChange}
              disabled={!jigType || isLoadingJigNumbers}
              error={errors.jigNumber}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InfoField label="Jig Name" value={jigName ?? 'N/A'} />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InfoField label="Last Validate" value={String(lastValidate)} />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InfoField
              label={'Procedure of Validation'}
              value={procedureOfValidation}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InfoField
              label={'Scope of the Application of the Jig/Fixture'}
              value={scopeOfApplication}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <DatePicker
              label={'Date of Validation*'}
              value={dateOfValidation}
              onChange={handleDateOfValidationChange}
              error={errors.dateOfValidation}
            />
          </Grid2>
          {jigType && acceptanceCriteriaRows.length > NUMBERMAP.ZERO && (
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                title="Jig Validation"
                rows={acceptanceCriteriaRows}
                columns={[
                  { field: 'acceptance_criteria_id', headerName: 'ID', flex: NUMBERMAP.HALF },
                  { 
                    field: 'acceptance_criteria', 
                    headerName: 'Acceptance Criteria', 
                    flex: NUMBERMAP.ONE,
                    renderCell: (params: any) => {
                      return stripHtml(params?.value ?? '')
                    }
                  },
                  { 
                    field: 'expected_result', 
                    headerName: 'Expected Result', 
                    flex: NUMBERMAP.ONE,
                    renderCell: (params: any) => {
                      return stripHtml(params.value ?? '')
                    }
                  },
                  { 
                    field: 'test_observation', 
                    headerName: 'Test Observation', 
                    flex: NUMBERMAP.ONE,
                    renderCell: (params: any) => {
                      const rowId = params.row.acceptance_criteria_id
                      const observation = jigValidationData[rowId]?.test_observation
                      if (observation) {
                        return (
                          <UnderLineButton onClick={() => handleTestObservationEdit(rowId, observation)}>
                            {stripHtml(observation)}
                          </UnderLineButton>
                        )
                      }
                      return (
                        <ActionButton 
                          onEdit={() => handleTestObservationEdit(rowId, observation)} 
                        />
                      )
                    }
                  },
                  { 
                    field: 'result', 
                    headerName: 'Result', 
                    flex: NUMBERMAP.TWO,
                    renderCell: (params: any) => {
                      const rowId = params.row.acceptance_criteria_id
                      const currentResult = getResultStatus(jigValidationData[rowId]?.result) ?? ''
                      return (
                        <Grid2 size={NUMBERMAP.TWELVE}>
                          <RadioButtonGroup 
                            label=""
                            name={`result-${rowId}`}
                            options={radioOptionsPASSFAIL} 
                            value={currentResult}
                            onChange={(value) => handleResultChange(rowId, value)} 
                          />
                        </Grid2>
                      )
                    }
                  },
                ]}
                idField="acceptance_criteria_id"
                loading={isLoadingValidationList}
                hideFooter={true}
              />
            </Grid2>
          )}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager 
              initialFiles={initialFiles}
              subHeader='Upload Documents*'
              uploadMandError={errors.fileUpload ?? ''}
              onFileUpload={handleFileUpload}
              onSubmit={handleFileSubmit}
              onFileEdit={handleFileEdit}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <CommonModal 
              buttonRequired={true} 
              onSave={handleTestObservationSave} 
              open={testObservationModalOpen} 
              title="Test Observation" 
              onClose={() => {
                setTestObservationModalOpen(false)
                setTestObservation('')
                setEditingTestObservationRowId(null)
              }}
            >
              <Grid2 size={NUMBERMAP.TWELVE}>
                <RichTextEditor 
                  label={'Test Observation'}
                  placeholder={'Enter Test Observation'}
                  value={testObservation}
                  onChange={(value: string) => setTestObservation(value)}
                />
              </Grid2>
            </CommonModal>
          </Grid2>
        </Grid2>
      </CommonModal>
    </>
  )
}

export default JigsFixtureValidationModal

