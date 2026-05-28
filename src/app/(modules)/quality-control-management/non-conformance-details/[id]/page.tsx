'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { Grid2, Typography } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  Label,
  RadioButtonGroup,
  Description,
  RichTextEditor,
  showActionAlert,
} from '@/components/ui'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { ButtonContainer } from '@/styles/components/ui/button'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { SectionBox } from '@/styles/modules/dnd/hld'
import {
  useNonConformanceDetailById,
  useUpsertNonConformanceDetail,
} from '@/hooks/modules/quality-control-management/useNonConformanceDetails'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { mergeFinalFileData, FinalFileData, getHypen, formatDate, isDocumentUploadValid, mapFileResponse } from '@/lib/utils/common'
import { useListWorkflowEmployes } from '@/hooks/modules/hr/useEmployeeList'
import {
  FINALFILEINITIALDATA,
  NUMBERMAP,
  BUTTON_LABEL,
} from '@/constants/common'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  INITIAL_NON_CONFORMANCE_DETAILS_FORM_DATA,
  ACTION_PLANNED_OPTIONS,
  ACTION_PLANNED_FIELD,
  ACTION_PLANNED_VALUES,
  VALIDATION_MESSAGES,
  NON_CONFORMANCE_DETAILS_FORM_FIELDS,
  SECTION_TITLES,
  ROUTES,
  API_FIELD_NAMES,
  DEFAULT_STATUS,
  TYPE_CHECK,
  EMPLOYEE_DROPDOWN_FIELDS,
} from '@/constants/modules/quality-control-management/nonConformanceDetails'
import {
  NonConformanceDetailsFormData,
  NonConformanceDetailsFormErrors,
} from '@/types/modules/quality-control-management/nonConformanceDetails'
import {
  LocationDetailsHeader,
  LocationDetailsContent,
  LocationDetailsCell,
  LocationDetailsLabel,
  LocationDetailsValue,
  DetailsTitle,
  LocationDetailsHeaderTypography,
  BORDER_RIGHT_NONE,
  BORDER_BOTTOM_NONE,
  BORDER_RIGHT_AND_BOTTOM_NONE,
  MARGIN_TOP_20,
} from '@/styles/modules/quality-control-management/nonConformanceDetails'
import { FAILED_ALERT, SUCCESS_ALERT } from '@/constants/modules/dnd/formTeam'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'

/**
 * Classification : Confidential
 **/

const NonConformanceDetailsForm: React.FC = () => {
  // DRAFT SAVE - like goods-inward
  const params = useParams()
  const router = useRouter()
  const inspectionResultId = params.id ? Number(params.id) : null
  const initialDraftLoading = useRef(true)
  const {
    draftSave,
    clearDraftSave,
    isDraftSaving,
    draftData,
    fetchDraft,
    checkUnsavedDraftBeforeLeave
  } = useDraftSave({
    context_type: 'non_conformance_details',
    context_instance_id: inspectionResultId,
    enableFetch: false,
  })

  // API Integration - Fetch non-conformance detail by ID
  const { data: nonConformanceDetailData, refetch: nonConformanceRefetch } = useNonConformanceDetailById(
    inspectionResultId
  )

  // Fetch employees for rework dropdown (Assign To)
  const { data: employeesData, refetch: refetchEmployees } = useListWorkflowEmployes(NUMBERMAP.ONE, 'Approved')

  // Mutation hook for upsert
  const upsertMutation = useUpsertNonConformanceDetail(
    inspectionResultId,
    inspectionResultId
  )

  const [formData, setFormData] = useState<NonConformanceDetailsFormData>(INITIAL_NON_CONFORMANCE_DETAILS_FORM_DATA)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  const transformApiDataToFormData = (apiData: any): NonConformanceDetailsFormData => {
    const resolvedData = Array.isArray(apiData?.data)
      ? apiData.data[NUMBERMAP.ZERO]
      : apiData?.data ?? apiData ?? {}
    setActualNonConformanceDetailsId(resolvedData?.non_conformance_details_id ?? null)
    const mergedDocuments = [
      ...(Array.isArray(resolvedData.documents) ? resolvedData.documents : []),
      ...(Array.isArray(resolvedData.file_documents) ? resolvedData.file_documents : []),
      ...(resolvedData?.draftDocuments?.documents ?? []),
    ]

    const uniqueDocuments = mergedDocuments.reduce((acc: any[], doc: any) => {
      const fileId = doc?.file_id ?? doc?.id ?? doc?.document_id ?? doc?.fk_eqms_file_id
      if (fileId === undefined || fileId === null) {
        return acc
      }
      const exists = acc.some((item) => {
        const existingId = item?.file_id ?? item?.id ?? item?.document_id ?? item?.fk_eqms_file_id
        return String(existingId) === String(fileId)
      })
      if (!exists) acc.push(doc)
      return acc
    }, [])

    return {
      ...INITIAL_NON_CONFORMANCE_DETAILS_FORM_DATA,
      ...resolvedData,
      documents: mapFileResponse(uniqueDocuments),
      actionPlanned: resolvedData?.actionPlanned ?? resolvedData?.action_plan_details?.type ?? '',
    }
  }

  const loadDraftData = (data: any) => {
    const transformed = transformApiDataToFormData(data)
    setFormData(transformed)
    setFinalFileData(FINALFILEINITIALDATA)
  }

  // --- DRAFT SAVE HELPER ADVANCED, LIKE VendorForm ---
  const handleDraftSave = (formDataToSave: any, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = nonConformanceDetailData ?? draftData
    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    // Prepare draftDelete before passing to prepareDraftDocumentsGeneric (like initiate quotation)
    const arrayDraftDeleteForPrep: string[] | Record<string, string[]> = draftDelete.length > NUMBERMAP.ZERO 
      ? { 'documents': draftDelete } 
      : []
    
    const objectDraftDeleteForPrep: string[] | Record<string, string[]> = typeof draftDelete === 'object' && !Array.isArray(draftDelete) 
      ? draftDelete 
      : []
    
    const draftDeleteForPrep: string[] | Record<string, string[]> = Array.isArray(draftDelete)
      ? arrayDraftDeleteForPrep
      : objectDraftDeleteForPrep

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDeleteForPrep,
      { ...formDataToSave, documents: formDataToSave.documents ?? [] },
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
        : (draftPreparation.draftDelete['documents'] ?? Object.values(draftPreparation.draftDelete).flat())
      setDraftDelete(deleteArray)
    }

    const fieldsToRemove = ['documents']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key)))

    const payload = {
      id: inspectionResultId ?? new Date().getTime(),
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
      ...(actualNonConformanceDetailsId && { non_conformance_details_id: actualNonConformanceDetailsId }),
 
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
  }

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !!inspectionResultId,
      draftData,
      existingData: nonConformanceDetailData,
      finalFileData: finalFileData,
    })
  }
  const [errors, setErrors] = useState<NonConformanceDetailsFormErrors>({})
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [actualNonConformanceDetailsId, setActualNonConformanceDetailsId] =
    useState<number | null>(null)

  // Fetch employees data on component mount
  useEffect(() => {
    refetchEmployees()
    setTimeout(() => {
      initialDraftLoading.current = false
    }, NUMBERMAP.THREETHOUSANDFIVEHUNDRED)
  }, [refetchEmployees])

  useEffect(() => {
    setFormData(INITIAL_NON_CONFORMANCE_DETAILS_FORM_DATA)
    setErrors({})
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
    if (!inspectionResultId) {
      fetchDraft()
    } else {
      nonConformanceRefetch()
    }
  }, [params.id])

  // Restore draft on mount if exists and if not loaded from API (create mode or no existing data)
  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData])

  // Remove deleted files from documents array when finalFileData changes (like initiate quotation)
  useEffect(() => {
    if (finalFileData.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((file: any) => {
          const fileId = file?.file_id ?? file?.id
          return !finalFileData.documents_to_delete.includes(fileId)
        })
      }))
    }

    if (finalFileData.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((file: any) => {
          if (file?.file?.name) {
            const lastIndex = file.file.name.lastIndexOf('.')
            const id =
              lastIndex !== NUMBERMAP.NEGATIVE_ONE
                ? file.file.name.substring(NUMBERMAP.ZERO, lastIndex)
                : file.file.name
            return !finalFileData.local_files_to_delete.includes(id)
          }
          return !finalFileData.local_files_to_delete.includes(file?.id)
        })
      }))
    }
  }, [finalFileData])

  // Update form data when API data is loaded
  useEffect(() => {
    if (nonConformanceDetailData?.data) {
      // Check if data has draftDocuments structure (like vendor form) - when data is not an array
      if (nonConformanceDetailData.data && !Array.isArray(nonConformanceDetailData.data)) {
        const transformed = transformApiDataToFormData(nonConformanceDetailData)
        setFormData(transformed)
        let existingNonConformanceDraftedData = nonConformanceDetailData as any
        setDraftDelete(existingNonConformanceDraftedData?.data?.draftDelete ?? [])
        setDraftDocuments(existingNonConformanceDraftedData?.data?.draftDocuments ?? [])
      } else if (Array.isArray(nonConformanceDetailData.data) && nonConformanceDetailData.data.length > NUMBERMAP.ZERO) {
        const data = nonConformanceDetailData.data[NUMBERMAP.ZERO] // Get first item from array
        const location = data.location ?? {}

        // Store the actual non_conformance_details_id from API response for update operations
        setActualNonConformanceDetailsId(data?.non_conformance_details_id ?? null)
        
        const updatedFormData = {
          partCategory: getHypen(data.part_category ?? ''),
          partNumber: getHypen(data.part_number ?? ''),
          partName: getHypen(data.part_name ?? ''),
          unitBatch: getHypen(data.unit_batch ?? ''),
          aql: getHypen(data.aql ?? ''),
          batchSerialNo: getHypen(data.serial_number?.toString() ?? ''),
          dateInspected: getHypen(formatDate(data?.date_inspected ?? '') ?? ''),
          testObservation: data.test_observation ?? '',
          floor: location.floor ?? '',
          room: location.room ?? '',
          shelfDetails: location.shelf_details ?? '',
          unitName: location.unit_name ?? '',
          address: location.address ?? '',
          defectDescription: data.defects_description ?? '',
          actionPlanned: data.action_plan_details?.type ?? '',
          returnDetails: data.action_plan_details?.return_description ?? '',
          scrapDetails1: data.action_plan_details?.scrap_disposal_remarks ?? '', // Disposal Infrastructure/Remarks
          scrapDetails2: data.action_plan_details?.scrap_description ?? '', // Description
          reworkEmployee: data.action_plan_details?.employee_id
            ? data.action_plan_details.employee_id.toString()
            : '',
          reworkDetails: data.action_plan_details?.rework_instructions ?? '',
          documents: mapFileResponse(data.file_documents ?? []),
        }

        setFormData((prev) => ({
          ...prev,
          ...updatedFormData,
        }))

        // Clear validation errors when data is loaded from API
        setErrors({})
      } else {
        loadDraftData(nonConformanceDetailData?.data)
      }
    } else {
      // If no data, reset the ID (it's a create operation)
      setActualNonConformanceDetailsId(null)
    }
  }, [nonConformanceDetailData])

  const handleInputChange = (field: string, value: string | number) => {
    const stringValue = String(value)

    setFormData((prev) => {
      const updated = { ...prev, [field]: stringValue }

      // Clear conditional fields when action plan changes
      if (field === ACTION_PLANNED_FIELD) {
        updated.returnDetails = ''
        updated.scrapDetails1 = ''
        updated.scrapDetails2 = ''
        updated.reworkEmployee = ''
        updated.reworkDetails = ''
      }

      // --- Draft Save ---
      if (!initialDraftLoading.current) {
        handleDraftSave(updated);
      }

      return updated
    })

    if (value && String(value).trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: NonConformanceDetailsFormErrors = {}

    if (
      !formData.defectDescription ||
      formData.defectDescription.trim() === ''
    ) {
      newErrors.defectDescription =
        VALIDATION_MESSAGES.DEFECT_DESCRIPTION_REQUIRED
    }

    if (!formData.actionPlanned || formData.actionPlanned.trim() === '') {
      newErrors.actionPlanned = VALIDATION_MESSAGES.ACTION_PLANNED_REQUIRED
    }

    if (
      !formData.returnDetails &&
      formData.actionPlanned === ACTION_PLANNED_VALUES.RETURN
    ) {
      newErrors.returnDetails = VALIDATION_MESSAGES.RETURN_DETAILS_REQUIRED
    }

    if (
      !formData.scrapDetails1 &&
      formData.actionPlanned === ACTION_PLANNED_VALUES.SCRAP
    ) {
      newErrors.scrapDetails1 = VALIDATION_MESSAGES.SCRAP_DETAILS_1_REQUIRED
    }

    if (
      !formData.reworkEmployee &&
      formData.actionPlanned === ACTION_PLANNED_VALUES.REWORK
    ) {
      newErrors.reworkEmployee = VALIDATION_MESSAGES.REWORK_EMPLOYEE_REQUIRED
    }

    if (
      !formData.reworkDetails &&
      formData.actionPlanned === ACTION_PLANNED_VALUES.REWORK
    ) {
      newErrors.reworkDetails = VALIDATION_MESSAGES.REWORK_DETAILS_REQUIRED
    }

    // File/documents validation (no error message shown, just returns false)
    if (!isDocumentUploadValid(finalFileData, formData.documents)) {
      // Optionally set a toast or dialog here if you want user feedback
      newErrors.fileUpload = 'File/documents are required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleFileUpload = (newFile: File) => {
    setErrors((prev) => ({ ...prev, fileUpload: "" }))
    const documents = formData?.documents ?? []
    setFormData((prev) => {
      const updated = {
        ...prev,
        documents: [...documents, newFile],
      }
      return updated;
    })
  }

  const handleFileEdit = (documents: any) => {
    setFormData((prev) => {
      const updatedFiles = prev.documents.map((file) => {
        const currentId =
          typeof file === TYPE_CHECK.OBJECT
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      const result = {
        ...prev,
        documents: updatedFiles,
      }
      return result
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    router.push(ROUTES.NON_CONFORMANCE_DETAILS_LIST)
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    if (!inspectionResultId) {
      showActionAlert(FAILED_ALERT)
      return
    }
    clearDraftSave()
    // Build FormData payload
    const formDataPayload = new FormData()
    formDataPayload.append(
      API_FIELD_NAMES.INSPECTION_RESULT_ID,
      inspectionResultId.toString()
    )
    formDataPayload.append(
      API_FIELD_NAMES.DEFECT_DETAILS,
      formData.defectDescription
    )
    formDataPayload.append(
      API_FIELD_NAMES.ACTION_PLAN_SLUG,
      formData.actionPlanned
    )
    formDataPayload.append(API_FIELD_NAMES.STATUS, DEFAULT_STATUS.toString())

    // Add non_conformance_details_id (use actual ID from API response if available, otherwise use URL param)
    const nonConformanceIdToUse =
      actualNonConformanceDetailsId
    if (nonConformanceIdToUse) {
      formDataPayload.append(
        API_FIELD_NAMES.NON_CONFORMANCE_DETAILS_ID,
        nonConformanceIdToUse.toString()
      )
    }

    // Add action plan specific fields
    if (formData.actionPlanned === ACTION_PLANNED_VALUES.RETURN) {
      formDataPayload.append(
        API_FIELD_NAMES.RETURN_DETAILS,
        formData.returnDetails ?? ''
      )
    } else if (formData.actionPlanned === ACTION_PLANNED_VALUES.SCRAP) {
      formDataPayload.append(
        API_FIELD_NAMES.DISPOSAL_INFORMATION,
        formData.scrapDetails1 ?? ''
      )
      formDataPayload.append(
        API_FIELD_NAMES.SCRAP_DESCRIPTION,
        formData.scrapDetails2 ?? ''
      )
    } else if (formData.actionPlanned === ACTION_PLANNED_VALUES.REWORK) {
      formDataPayload.append(
        API_FIELD_NAMES.REWORK_INSTRUCTION,
        formData.reworkDetails ?? ''
      )
      if (formData.reworkEmployee) {
        formDataPayload.append(
          API_FIELD_NAMES.EMPLOYEE_ID,
          formData.reworkEmployee
        )
      }
    }

    // Handle file uploads
    if (
      finalFileData.documents_to_create &&
      finalFileData.documents_to_create.length > NUMBERMAP.ZERO
    ) {
      finalFileData.documents_to_create.forEach((file) => {
        formDataPayload.append(API_FIELD_NAMES.DOCUMENTS_TO_CREATE, file)
      })
    }

    const fileMetadata = createFileMetadata()
    if (fileMetadata) {
      formDataPayload.append(
        API_FIELD_NAMES.DOCUMENTS_TO_DELETE,
        JSON.stringify(fileMetadata.documents_to_delete)
      )
      formDataPayload.append(
        API_FIELD_NAMES.CREATE_META_DATA,
        JSON.stringify(fileMetadata.create_meta_data)
      )
      formDataPayload.append(
        API_FIELD_NAMES.UPDATE_META_DATA,
        JSON.stringify(fileMetadata.update_meta_data)
      )
    }

    // Call the mutation with FormData
    upsertMutation.mutate(formDataPayload, {
      onSuccess: (response) => {
        // Update actualNonConformanceDetailsId from response if it was a create operation
        if (
          !actualNonConformanceDetailsId &&
          response?.data?.non_conformance_details_id
        ) {
          setActualNonConformanceDetailsId(response.data.non_conformance_details_id)
        }

        // Reset finalFileData after successful save
        setFinalFileData(FINALFILEINITIALDATA)

        // Show success message
        showActionAlert(SUCCESS_ALERT)

        // Navigate back to list
        router.push(ROUTES.NON_CONFORMANCE_DETAILS_LIST)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  const buttonConfig = [
    {
      label: BUTTON_LABEL.CANCEL,
      onClick: handleCancel,
      disabled: upsertMutation.isPending,
    },
    {
      label: BUTTON_LABEL.SAVE,
      onClick: handleSave,
      disabled: upsertMutation.isPending,
    },
  ]

  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Label title={SECTION_TITLES.NON_CONFORMANCE_DETAILS} />
        <FormContent>
          {/* Non-Conformance Details Section */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.partCategory}
                label={NON_CONFORMANCE_DETAILS_FORM_FIELDS.PART_CATEGORY.LABEL}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.partNumber}
                label={NON_CONFORMANCE_DETAILS_FORM_FIELDS.PART_NUMBER.LABEL}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.partName}
                label={NON_CONFORMANCE_DETAILS_FORM_FIELDS.PART_NAME.LABEL}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.unitBatch}
                label={NON_CONFORMANCE_DETAILS_FORM_FIELDS.UNIT_BATCH.LABEL}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.aql}
                label={NON_CONFORMANCE_DETAILS_FORM_FIELDS.AQL.LABEL}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.batchSerialNo}
                label={
                  NON_CONFORMANCE_DETAILS_FORM_FIELDS.BATCH_SERIAL_NO.LABEL
                }
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                value={formData.dateInspected}
                label={NON_CONFORMANCE_DETAILS_FORM_FIELDS.DATE_INSPECTED.LABEL}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Description
                label={
                  NON_CONFORMANCE_DETAILS_FORM_FIELDS.TEST_OBSERVATION.LABEL
                }
                value={formData.testObservation}
                onChange={(value) =>
                  handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.TEST_OBSERVATION.FIELD, value)
                }
                placeholder=""
                disabled={true}
              />
            </Grid2>
          </Grid2>

          {/* Location Details Section */}
          <SectionBox>
            <LocationDetailsHeader>
              <Typography sx={LocationDetailsHeaderTypography}>
                {SECTION_TITLES.LOCATION_DETAILS}
              </Typography>
            </LocationDetailsHeader>
            <LocationDetailsContent>
              <Grid2 container>
                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                >
                  <LocationDetailsLabel>
                    {NON_CONFORMANCE_DETAILS_FORM_FIELDS.FLOOR.LABEL}
                  </LocationDetailsLabel>
                </Grid2>
                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                  sx={BORDER_RIGHT_NONE}
                >
                  <LocationDetailsValue>{formData.floor}</LocationDetailsValue>
                </Grid2>

                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                >
                  <LocationDetailsLabel>
                    {NON_CONFORMANCE_DETAILS_FORM_FIELDS.ROOM.LABEL}
                  </LocationDetailsLabel>
                </Grid2>
                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                  sx={BORDER_RIGHT_NONE}
                >
                  <LocationDetailsValue>{formData.room}</LocationDetailsValue>
                </Grid2>

                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                >
                  <LocationDetailsLabel>
                    {NON_CONFORMANCE_DETAILS_FORM_FIELDS.SHELF_DETAILS.LABEL}
                  </LocationDetailsLabel>
                </Grid2>
                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                  sx={BORDER_RIGHT_NONE}
                >
                  <LocationDetailsValue>
                    {formData.shelfDetails}
                  </LocationDetailsValue>
                </Grid2>

                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                >
                  <LocationDetailsLabel>
                    {NON_CONFORMANCE_DETAILS_FORM_FIELDS.UNIT_NAME.LABEL}
                  </LocationDetailsLabel>
                </Grid2>
                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                  sx={BORDER_RIGHT_NONE}
                >
                  <LocationDetailsValue>
                    {formData.unitName}
                  </LocationDetailsValue>
                </Grid2>

                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                  sx={BORDER_BOTTOM_NONE}
                >
                  <LocationDetailsLabel>
                    {NON_CONFORMANCE_DETAILS_FORM_FIELDS.ADDRESS.LABEL}
                  </LocationDetailsLabel>
                </Grid2>
                <Grid2
                  size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
                  component={LocationDetailsCell}
                  sx={BORDER_RIGHT_AND_BOTTOM_NONE}
                >
                  <LocationDetailsValue>
                    {formData.address}
                  </LocationDetailsValue>
                </Grid2>
              </Grid2>
            </LocationDetailsContent>
          </SectionBox>

          {/* Defect Details Section */}
          <SectionBox>
            <DetailsTitle>{SECTION_TITLES.DEFECT_DETAILS}</DetailsTitle>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={
                    NON_CONFORMANCE_DETAILS_FORM_FIELDS.DEFECT_DESCRIPTION.LABEL
                  }
                  value={formData.defectDescription}
                  onChange={(value) =>
                    handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.DEFECT_DESCRIPTION.FIELD, value)
                  }
                  placeholder={
                    NON_CONFORMANCE_DETAILS_FORM_FIELDS.DEFECT_DESCRIPTION
                      .PLACEHOLDER
                  }
                  error={
                    !formData.defectDescription?.trim()
                      ? (errors.defectDescription ?? '')
                      : ''
                  }
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RadioButtonGroup
                  label={
                    NON_CONFORMANCE_DETAILS_FORM_FIELDS.ACTION_PLANNED.LABEL
                  }
                  name={ACTION_PLANNED_FIELD}
                  options={ACTION_PLANNED_OPTIONS}
                  value={formData.actionPlanned ?? ''}
                  onChange={(value: string | number) =>
                    handleInputChange(ACTION_PLANNED_FIELD, value)
                  }
                  error={
                    !formData.actionPlanned?.trim()
                      ? (errors.actionPlanned ?? '')
                      : ''
                  }
                />
              </Grid2>
            </Grid2>

            {/* Conditional Fields based on Action Planned */}
            {formData.actionPlanned === ACTION_PLANNED_VALUES.RETURN && (
              <>
                <DetailsTitle>{SECTION_TITLES.RETURN_DETAILS}</DetailsTitle>
                <Grid2 container spacing={NUMBERMAP.TWO} sx={MARGIN_TOP_20}>
                  <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <RichTextEditor
                      label={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.RETURN_DETAILS.LABEL
                      }
                      value={formData.returnDetails}
                      onChange={(value) =>
                        handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.RETURN_DETAILS.FIELD, value)
                      }
                      placeholder={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.RETURN_DETAILS
                          .PLACEHOLDER
                      }
                      error={
                        !formData.returnDetails?.trim()
                          ? (errors.returnDetails ?? '')
                          : ''
                      }
                    />
                  </Grid2>
                </Grid2>
              </>
            )}

            {formData.actionPlanned === ACTION_PLANNED_VALUES.SCRAP && (
              <>
                <DetailsTitle>{SECTION_TITLES.SCRAP_DETAILS}</DetailsTitle>
                <Grid2 container spacing={NUMBERMAP.TWO} sx={MARGIN_TOP_20}>
                  <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <RichTextEditor
                      label={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.SCRAP_DETAILS_1
                          .LABEL
                      }
                      value={formData.scrapDetails1}
                      onChange={(value) =>
                        handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.SCRAP_DETAILS_1.FIELD, value)
                      }
                      placeholder={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.SCRAP_DETAILS_1
                          .PLACEHOLDER
                      }
                      error={
                        !formData.scrapDetails1?.trim()
                          ? (errors.scrapDetails1 ?? '')
                          : ''
                      }
                    />
                  </Grid2>
                  <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <RichTextEditor
                      label={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.SCRAP_DETAILS_2
                          .LABEL
                      }
                      value={formData.scrapDetails2}
                      onChange={(value) =>
                        handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.SCRAP_DETAILS_2.FIELD, value)
                      }
                      placeholder={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.SCRAP_DETAILS_2
                          .PLACEHOLDER
                      }
                    />
                  </Grid2>
                </Grid2>
              </>
            )}

            {formData.actionPlanned === ACTION_PLANNED_VALUES.REWORK && (
              <>
                <DetailsTitle>{SECTION_TITLES.REWORK_DETAILS}</DetailsTitle>
                <Grid2 container spacing={NUMBERMAP.TWO} sx={MARGIN_TOP_20}>
                  <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <InputField
                      label={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.REWORK_EMPLOYEE
                          .LABEL
                      }
                      placeholder={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.REWORK_EMPLOYEE
                          .PLACEHOLDER
                      }
                      isDropdown={true}
                      value={formData.reworkEmployee ?? ''}
                      onChange={(value: string) =>
                        handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.REWORK_EMPLOYEE.FIELD, value)
                      }
                      options={employeesData?.data ?? []}
                      keyField={EMPLOYEE_DROPDOWN_FIELDS.KEY_FIELD}
                      valueField={EMPLOYEE_DROPDOWN_FIELDS.VALUE_FIELD}
                      error={
                        !formData.reworkEmployee?.trim()
                          ? (errors.reworkEmployee ?? '')
                          : ''
                      }
                    />
                  </Grid2>
                  <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                    <RichTextEditor
                      label={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.REWORK_DETAILS.LABEL
                      }
                      value={formData.reworkDetails}
                      onChange={(value) =>
                        handleInputChange(NON_CONFORMANCE_DETAILS_FORM_FIELDS.REWORK_DETAILS.FIELD, value)
                      }
                      placeholder={
                        NON_CONFORMANCE_DETAILS_FORM_FIELDS.REWORK_DETAILS
                          .PLACEHOLDER
                      }
                      error={
                        !formData.reworkDetails?.trim()
                          ? (errors.reworkDetails ?? '')
                          : ''
                      }
                    />
                  </Grid2>
                </Grid2>
              </>
            )}
          </SectionBox>

          {/* File Upload Section */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                subHeader='Upload Documents*'
                initialFiles={formData.documents}
                onFileUpload={handleFileUpload}
                uploadMandError={errors.fileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={(data) => {
                  setFinalFileData((prev) => {
                    const merged = mergeFinalFileData(prev, data)
                    handleDraftSave(formData, merged)
                    return merged
                  })
                }}
              />
            </Grid2>
          </Grid2>

          {/* Action Buttons */}
          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default NonConformanceDetailsForm
