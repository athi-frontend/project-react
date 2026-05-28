/**
 * Classification : Confidential
 **/

'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA } from '@/constants/common'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import AddComplaintModal from '@/components/modules/infrastructure-management/raise-complaint/AddComplaintModal'
import {
  useGetAllComplaints,
  useGetComplaintById,
  useUpsertComplaint,
  useDeleteComplaint,
  useGetAllSerialNumbers,
} from '@/hooks/modules/infrastructure-management/useRaiseComplaint'
import {
  ComplaintAPI,
  ComplaintFormData,
  ComplaintFormErrors,
  ComplaintDetailAPI,
} from '@/types/modules/infrastructure-management/raiseComplaint'
import {
  RAISE_COMPLAINT_CONSTANTS,
  INITIAL_COMPLAINT_FORM_DATA,
} from '@/constants/modules/infrastructure-management/raiseComplaint'
import {
  mergeFinalFileData,
  FinalFileData,
  convertMuiDayjsToUTC,
  convertUtcToLocal,
} from '@/lib/utils/common'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { FileDocument, FileData } from '@/types/components/ui/fileUploadV3'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'

const ComplaintsList: React.FC = () => {
  const { data: complaintsData, isLoading } = useGetAllComplaints()
  const upsertComplaintMutation = useUpsertComplaint()
  const deleteComplaintMutation = useDeleteComplaint()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(
    null
  )
  const [formData, setFormData] = useState<ComplaintFormData>(
    INITIAL_COMPLAINT_FORM_DATA
  )
  const initialFormLoad = useRef(true)
  const [errors, setErrors] = useState<ComplaintFormErrors>({})
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  const complaintIdForDraft = isEditMode ? selectedComplaintId : null
  const { draftSave, clearDraftSave, isDraftSaving, isFetchingDraft, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
      context_type: 'complaint',
      context_instance_id: complaintIdForDraft,
      enableFetch: false
    })
  // Fetch complaint details when editing
  const { data: complaintDetailData } = useGetComplaintById(selectedComplaintId)

  // Fetch serial numbers when we have infrastructure_type_id (needed for edit mode)
  const { data: serialNumbersData } = useGetAllSerialNumbers(
    formData.infrastructure_type_id
  )

  // Get status value for display
  const getStatusValue = (statusId: number) => statusId === NUMBERMAP.ONE

  /**
   * Function Name: handleEdit
   * Description: Handle edit button click to open modal in edit mode
   */
  const handleEdit = (rowData: ComplaintAPI) => {
    setSelectedComplaintId(rowData.complaint_id)
    setIsEditMode(true)
    setIsModalOpen(true)
     setTimeout(()=>{
      initialFormLoad.current = false
    },NUMBERMAP.THREETHOUSAND)
  }

  const handleDraftSaveRaiseComplaint = (formDataToSave: ComplaintFormData, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = isEditMode ? complaintDetailData : draftData
    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    const draftPreparationRaiseComplaint = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: formDataToSave.documents },
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    if (draftPreparationRaiseComplaint.draftDocuments) {
      setDraftDocuments(draftPreparationRaiseComplaint.draftDocuments)
    }
    if (draftPreparationRaiseComplaint.draftDelete) {
      setDraftDelete(draftPreparationRaiseComplaint.draftDelete ?? [])
    }

    const fieldsToRemoveRaiseComplaint = ['documents']
    const Obj = { ...formDataToSave }
    const cleanedRaiseComplaint = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemoveRaiseComplaint.includes(key))
    )

    const payload = {
      id: complaintIdForDraft ?? new Date().getTime(),
      ...cleanedRaiseComplaint,
      draftDocuments: draftPreparationRaiseComplaint.draftDocuments,
      draftDelete: draftPreparationRaiseComplaint.draftDelete,
      type: 'draft',
    }
    draftSave({
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparationRaiseComplaint.createMetaData,
        update_meta_data: draftPreparationRaiseComplaint.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparationRaiseComplaint?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }
  // Load draft data when available
  useEffect(() => {
    if (draftData?.data && !isEditMode) {
      const draftFormData = draftData.data
      if (draftFormData) {
        setFormData((prev) => ({
          ...prev,
          ...draftFormData,
          documents: draftFormData.documents ?? prev.documents,
        }))
        if (draftFormData.draftDocuments) {
          setDraftDocuments(draftFormData.draftDocuments)
        }
        if (draftFormData.draftDelete) {
          const deleteArray = Array.isArray(draftFormData.draftDelete)
            ? draftFormData.draftDelete
            : Object.values(draftFormData.draftDelete).flat()
          setDraftDelete(deleteArray)
        }
      }
    }
  }, [draftData, isEditMode])

  // Update form data when complaintDetailData changes
  useEffect(() => {
    if (complaintDetailData?.data?.[NUMBERMAP.ZERO] && isEditMode) {
      const complaint: ComplaintDetailAPI =
        complaintDetailData.data[NUMBERMAP.ZERO]
      setFormData(complaint)
    }else if(complaintDetailData?.data && !Array.isArray(complaintDetailData?.data)){
      setDraftDelete(complaintDetailData?.data?.draftDelete??[])
      setDraftDocuments(complaintDetailData?.data?.draftDocuments??{})
      setFormData({...complaintDetailData.data, documents: [...(complaintDetailData?.data?.documents ?? []), ...(complaintDetailData?.data?.draftDocuments?.documents ?? [])]})
    }
  }, [complaintDetailData])

  // In edit mode: Find infrastructure_id from serial_number when serial numbers are loaded
  useEffect(() => {
    if (
      isEditMode &&
      formData.serial_number &&
      formData.infrastructure_type_id &&
      serialNumbersData?.data &&
      !formData.infrastructure_id
    ) {
      const matchingInfrastructure = serialNumbersData.data.find(
        (item: { infrastructure_id: number; serial_number: string }) =>
          item.serial_number === formData.serial_number
      )
      if (matchingInfrastructure) {
        setFormData((prev) => ({
          ...prev,
          infrastructure_id: matchingInfrastructure.infrastructure_id,
        }))
      }
    }
  }, [
    isEditMode,
    formData.serial_number,
    formData.infrastructure_type_id,
    formData.infrastructure_id,
    serialNumbersData,
  ])

  useEffect(()=>{
    if(!isEditMode && isModalOpen){
        fetchDraft()
    }
    initialFormLoad.current = true
  },[isModalOpen])
  /**
   * Function Name: handleAdd
   * Description: Handle add button click to open modal in create mode
   */
  const handleAdd = () => {
    setSelectedComplaintId(null)
    setIsEditMode(false)
    setFormData(INITIAL_COMPLAINT_FORM_DATA)
    setErrors({})
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
    setIsModalOpen(true)
     setTimeout(()=>{
      initialFormLoad.current = false
    },NUMBERMAP.THREETHOUSAND)
  }

  /**
   * Function Name: handleModalClose
   * Description: Handle modal close and reset state
   */
  const handleModalClose = async () => {
    await checkUnsavedDraftBeforeLeave()
    initialFormLoad.current = true
    setIsModalOpen(false)
    setIsEditMode(false)
    setSelectedComplaintId(null)
    setFormData(INITIAL_COMPLAINT_FORM_DATA)
    setErrors({})
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
  }

  /**
   * Function Name: handleDelete
   * Description: Handle delete with confirmation dialog and API call
   */
  const handleDelete = (rowData: ComplaintAPI) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteComplaintMutation.mutate(rowData.complaint_id)
      }
    })
  }

  /**
   * Function Name: validateForm
   * Description: Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: ComplaintFormErrors = {}

    if (!formData.infrastructure_id) {
      newErrors.infrastructure_id =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.SERIAL_NUMBER_REQUIRED
    }

    if (!formData.complaint_description?.trim()) {
      newErrors.complaint_description =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.COMPLAINT_DESCRIPTION_REQUIRED
    }

    if (!formData.complaint_title?.trim()) {
      newErrors.complaint_title =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.COMPLAINT_TITLE_REQUIRED
    }

    if (!formData.acknowledge_date && (formData.root_cause || formData.resolution)) {
      newErrors.acknowledge_date =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.ACKNOWLEDGE_DATE_REQUIRED
    }
    

    if (!formData.complaint_date) {
      newErrors.complaint_date =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.COMPLAINT_DATE_REQUIRED
    }
   

    if (!formData.status_id) {
      newErrors.status_id =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.STATUS_REQUIRED
    }

    if (!formData.documents || formData.documents.length === NUMBERMAP.ZERO) {
      newErrors.documents =
        RAISE_COMPLAINT_CONSTANTS.ERROR_MESSAGES.DOCUMENTS_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

    const createFileMetadata = () => {
      return createFileMetadataUtil({
        isEditMode: isEditMode,
        draftData:draftData,
        existingData: complaintDetailData,
        finalFileData: finalFileData,
      })
    }
  /**
   * Function Name: handleSave
   * Description: Handle form save and API call for create/update complaint
   */
  const handleSave = () => {
    if (!validateForm()) {
      return
    }
    clearDraftSave()
    const form = new FormData()
    const finalFileDatas = createFileMetadata()
    // Append basic fields
    if (isEditMode && selectedComplaintId) {
      form.append(
        RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.COMPLAINT_ID,
        selectedComplaintId.toString()
      )
    }

    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.INFRASTRUCTURE_ID,
      formData.infrastructure_id?.toString() ?? ''
    )
    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.COMPLAINT_DATE,
      convertMuiDayjsToUTC(formData.complaint_date) ?? ''
    )
    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.COMPLAINT_TITLE,
      formData.complaint_title.trim()
    )
    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.COMPLAINT_DESCRIPTION,
      formData.complaint_description.trim()
    )
    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.STATUS_ID,
      formData.status_id?.toString() ?? ''
    )
    if(formData.acknowledge_date){
 form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.ACKNOWLEDGE_DATE,
      convertMuiDayjsToUTC(formData.acknowledge_date) ?? ''
    )
    }
    if (formData.root_cause) {
      form.append(
        RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.ROOT_CAUSE,
        formData.root_cause.trim()
      )
    }
    if (formData.resolution) {
      form.append(
        RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.RESOLUTION,
        formData.resolution.trim()
      )
    }

    // Always append file data fields (even if empty)
    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.DOCUMENTS_TO_DELETE,
      JSON.stringify(finalFileDatas?.documents_to_delete ?? [])
    )

    // create_meta_data should always be sent as an object (even if empty)
    form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.CREATE_META_DATA,
      JSON.stringify(finalFileDatas?.create_meta_data ?? {})
    )

    // update_meta should always be sent as an array (even if empty)
    // Convert update_meta_data object to array format if needed
    if (
      finalFileDatas?.update_meta_data &&
      Object.keys(finalFileDatas.update_meta_data).length > NUMBERMAP.ZERO
    ) {
          form.append(
      RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.UPDATE_META,
      JSON.stringify(finalFileDatas.update_meta_data)
    )
    }
    // Append files
    finalFileData?.documents_to_create?.forEach((fileData) => {
        form.append(
          RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.DOCUMENTS_TO_CREATE,
          fileData,
          fileData.name
        )
    })

    upsertComplaintMutation.mutate(form, {
      onSuccess: () => {
        handleModalClose()
      },
    })
  }

  /**
   * Function Name: handleFieldChange
   * Description: Handle field value changes
   */
  const handleFieldChange = useCallback(
    (field: keyof ComplaintFormData, value: string | number | null) => {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [field]: value,
        }

        // Reset dependent fields when category or type changes
        if (
          field ===
          RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY_ID
        ) {
          newData.infrastructure_type_id = null
          newData.infrastructure_id = null
          newData.serial_number = ''
        } else if (
          field ===
          RAISE_COMPLAINT_CONSTANTS.FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE_ID
        ) {
          newData.infrastructure_id = null
          newData.serial_number = ''
        }

        if(!initialFormLoad.current){
          handleDraftSaveRaiseComplaint(newData)
        }
        return newData
      })

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    },
    [errors]
  )

  /**
   * Function Name: handleFileUpload
   * Description: Handle file upload
   */
  const handleFileUpload = useCallback(
    (newFile: FileData | FileData2) => {
      setFormData((prev) => {
        const updated = {
          ...prev,
          documents: [...prev.documents, newFile] as FileDocument[],
        }
        if(!initialFormLoad.current){
          handleDraftSaveRaiseComplaint(updated)
        }
        return updated
      })

      if (errors.documents) {
        setErrors((prev) => ({
          ...prev,
          documents: undefined,
        }))
      }
    },
    [errors]
  )

  /**
   * Function Name: handleFileEdit
   * Description: Handle file edit
   */
  const handleFileEdit = useCallback((updatedFile: FileData | FileData2) => {
    setFormData((prev) => {
      const updatedFiles = prev.documents.map((file) => {
        const currentId =
          (file as FileData | FileData2 | FileDocument).file_id ??
          (file as FileData | FileData2 | FileDocument).id
        const updatedId =
          (updatedFile as FileData2).document_id ?? updatedFile.id

        return currentId === updatedId ? { ...file, ...updatedFile } : file
      })

      return {
        ...prev,
        documents: updatedFiles as FileDocument[],
      }
    })
  }, [])

  /**
   * Function Name: handleFileRemove
   * Description: Handle file removal for documents (following clinical-evaluation pattern)
   * Removes local files from formData.documents when they are deleted
   */
  const handleFileRemove = useCallback((data: Partial<FinalFileData>) => {
    if (data?.local_files_to_delete?.length && data.local_files_to_delete.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = prev.documents.filter((file) => {
          const fileName = (file).file?.name?.split('.')[NUMBERMAP.ZERO]
          return !data.local_files_to_delete?.includes(fileName)
        })
        return {
          ...prev,
          documents: updatedDocs,
        }
      })
    }
  }, [])

  /**
   * Function Name: handleFileSubmit
   * Description: Handle file submit and file removal (following clinical-evaluation pattern)
   */
  const handleFileSubmit = (data: Partial<FinalFileData>) => {
    setFinalFileData((prev) => {
      const mergedData = mergeFinalFileData(prev, data)
      setFormData((currentFormData) => {
        if(!initialFormLoad.current){
          handleDraftSaveRaiseComplaint(currentFormData, mergedData)
        }
        return currentFormData
      })
      return mergedData
    })
    handleFileRemove(data)
  }

  /**
   * Effect to handle database file deletions (following clinical-evaluation pattern)
   * Removes files from formData.documents when documents_to_delete changes
   */
  useEffect(() => {
    if (finalFileData.documents_to_delete?.length && finalFileData.documents_to_delete.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = prev.documents.filter((file) => {
          const fileId = (file).file_id ?? (file).id
          return !finalFileData.documents_to_delete?.includes(fileId)
        })
        if (updatedDocs.length !== prev.documents.length) {
          return {
            ...prev,
            documents: updatedDocs,
          }
        }
        return prev
      })
    }
  }, [finalFileData.documents_to_delete])


  // Define columns for complaints table
  const columns: GridColDef[] = [
    {
      field: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.SNO.field,
      headerName: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.SNO.headerName,
      flex: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.SNO.flex,
    },
    {
      field: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.COMPLAINT_TITLE.field,
      headerName:
        RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.COMPLAINT_TITLE.headerName,
      flex: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.COMPLAINT_TITLE.flex,
    },
    {
      field: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.SERIAL_NUMBER.field,
      headerName:
        RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.SERIAL_NUMBER.headerName,
      flex: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.SERIAL_NUMBER.flex,
    },
    {
      field: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.ACKNOWLEDGE_DATE.field,
      headerName:
        RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.ACKNOWLEDGE_DATE.headerName,
      flex: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.ACKNOWLEDGE_DATE.flex,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? convertUtcToLocal(params.value) : ''
      },
    },
    {
      field: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.STATUS.field,
      headerName: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.STATUS.headerName,
      flex: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.STATUS.flex,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography
          value={
            getStatusValue(params.row.status_id)
              ? NUMBERMAP.ONE
              : NUMBERMAP.ZERO
          }
        />
      ),
    },
    {
      field: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.ACTIONS.field,
      headerName: RAISE_COMPLAINT_CONSTANTS.TABLE_COLUMNS.ACTIONS.headerName,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onEdit={() => handleEdit(params.row)}
          onDelete={() => handleDelete(params.row)}
          deleteDisabled={!getStatusValue(params.row.status_id)}
        />
      ),
    },
  ]

  const isMutationLoading = (): boolean => {
    if (upsertComplaintMutation.isPending ?? false) return true
    if (deleteComplaintMutation.isPending ?? false) return true
    return false
  }

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isMutationLoading() || isFetchingDraft} />
      <CommonSharedTale
        title={RAISE_COMPLAINT_CONSTANTS.TITLE}
        hanldeClick={handleAdd}
        pathName="#"
        Table={
          <DataTable
            rows={complaintsData?.data ?? []}
            columns={columns}
            IdField={RAISE_COMPLAINT_CONSTANTS.DATATABLE_IDFIELD}
            loading={isLoading}
          />
        }
      />
      <CommonModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        title={
          isEditMode
            ? RAISE_COMPLAINT_CONSTANTS.MODAL_TITLES.EDIT
            : RAISE_COMPLAINT_CONSTANTS.MODAL_TITLES.ADD
        }
        buttonRequired
      >
        <AddComplaintModal
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          onFileEdit={handleFileEdit}
          onFileSubmit={handleFileSubmit}
          documents={formData.documents}
          isEditMode={isEditMode}
        />
      </CommonModal>
    </PageContainer>
  )
}

export default ComplaintsList
