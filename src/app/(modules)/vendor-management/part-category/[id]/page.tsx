'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Grid2 } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  Description,
  showActionAlert,
  Label,
} from '@/components/ui'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  VALIDATION_MESSAGES,
  PAGE_TITLE,
  CREATE,
  FILE_UPLOAD,
  API_FIELD_MAPPINGS,
  REQUIRED_FIELDS,
  DEPENDENT_FIELD_RESETS,
  STATUS_DROPDOWN_CONFIG,
  PART_CATEGORY_TYPE,
  PART_CATEGORY_SUB_TYPE,
  PART_CATEGORY_SUBCLASS,
} from '@/constants/modules/vendor-management/partCategory'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { DEFAULT_FORM_DATA } from '@/lib/modules/vendor-management/partCategory'
import {
  FormData as PartCategoryFormData,
  FormErrors,
} from '@/types/modules/vendor-management/partCategory'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  FinalFileData,
  mergeFinalFileData,
  hasFileData,
} from '@/lib/utils/common'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import {
  usePartCategoryDetail,
  useUpsertPartCategory,
  usePartCategoryTypes,
  usePartSubcategoryTypes,
  usePartCategorySubclasses
} from '@/hooks/modules/vendor-management/usePartCategory'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'

/**
 * Classification : Confidential
 **/

const PartCategoryForm: React.FC = () => {
  const router = useRouter()
  const { id: rawIdFromParams } = useParams()
  const paramId = Array.isArray(rawIdFromParams) ? rawIdFromParams[NUMBERMAP.ZERO] : rawIdFromParams
  const isAddMode = paramId === CREATE
  const partCategoryId = isAddMode || !paramId || Number.isNaN(Number(paramId)) ? null : Number(paramId)
  const formRef = useRef<HTMLElement | null>(null)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [showFileValidationError, setShowFileValidationError] = useState(false)

  // State for form data and errors
  const [formData, setFormData] = useState<PartCategoryFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  const {
    data: partCategoryDetail,
    refetch:partCategoryRefetch
  } = usePartCategoryDetail(partCategoryId)

  // Dependent dropdown hooks
  const { data: partCategoryTypesData } = usePartCategoryTypes(NUMBERMAP.ONE) // status = 1 for active
  const { data: partSubcategoryTypesData } = usePartSubcategoryTypes(
    formData.partCategoryType ? Number(formData.partCategoryType) : null,
    NUMBERMAP.ONE
  )
  const { data: partCategorySubclassesData } = usePartCategorySubclasses(
    formData.partCategorySubType ? Number(formData.partCategorySubType) : null
  )

  // Status dropdown hook
  const { data: statusDropdownData } = useOrganizationStatus()

  const upsertMutation = useUpsertPartCategory()

  // Draft save hook
  const partCategoryIdForDraft = isAddMode ? null : partCategoryId
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'part_category',
    context_instance_id: partCategoryIdForDraft,
    enableFetch: false
  })
  // Extract API data transformation logic
  const transformApiDataToFormData = useCallback((apiData: any): PartCategoryFormData => {
    return {
      partCategoryType: apiData.part_category_type_id?.toString() ?? '',
      partCategorySubType: apiData.part_category_sub_type_id?.toString() ?? '',
      productCategorySubClass: apiData.part_category_subclass_id?.toString() ?? '',
      partCategoryName: apiData.part_category_name ?? '',
      description: apiData.description ?? '',
      status_name: apiData.status_name ?? '',
      status_id: apiData.status_id,
      documents: apiData.documents ?? [],
    }
  }, [])


  const partCategoryhandleDraftSave = (formDataToSave: PartCategoryFormData, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let partCategoryDraftDatas = isAddMode ? draftData : partCategoryDetail
    const partCategoryDraftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    const partCategoryDraftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      formDataToSave,
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      partCategoryDraftDatas,
      partCategoryDraftConfig
    )

    if (partCategoryDraftPreparation.draftDocuments) {
      setDraftDocuments(partCategoryDraftPreparation.draftDocuments)
    }
    if (partCategoryDraftPreparation.draftDelete) {
      setDraftDelete(partCategoryDraftPreparation?.draftDelete ?? [])
    }

    const partCategoryDraftFieldsToRemove = ['documents']
    const Obj = { ...formDataToSave }
    const partCategoryDraftCleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !partCategoryDraftFieldsToRemove.includes(key))
    )

    const partCategoryDraftPayload = {
      id: partCategoryIdForDraft ?? new Date().getTime(),
      ...partCategoryDraftCleaned,
      draftDocuments: partCategoryDraftPreparation.draftDocuments,
      draftDelete: partCategoryDraftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_data: partCategoryDraftPayload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: partCategoryDraftPreparation.createMetaData,
        update_meta_data: partCategoryDraftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: partCategoryDraftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  // Track if form has been initialized to prevent re-initialization
  const hasInitializedRef = useRef(false)
  const previousPartCategoryIdRef = useRef<number | null>(null)

  const loadDraftData = (data: any) => {
    setFormData({
      ...data,
      documents: [...(data?.draftDocuments?.documents ?? []), ...(data?.documents ?? [])],
    })
     if (data?.draftDocuments) {
      setDraftDocuments(data?.draftDocuments??{})
    }
    if (data?.draftDelete) {
      setDraftDelete(data?.draftDelete ?? [])
    }
  }

  // Load form data if in edit mode - only when data changes or partCategoryId changes
  useEffect(() => {
    // Reset initialization flag when partCategoryId changes
    if (previousPartCategoryIdRef.current !== partCategoryId) {
      hasInitializedRef.current = false
      previousPartCategoryIdRef.current = partCategoryId
    }

    // Only initialize if we have data, are in edit mode, and haven't initialized yet
    if (!isAddMode && partCategoryDetail?.data) {
      if(partCategoryDetail?.data.length > NUMBERMAP.ZERO){
        const formDataFromAPI = transformApiDataToFormData(partCategoryDetail.data[NUMBERMAP.ZERO])
        setFormData(formDataFromAPI)
      }else{
        let partCategoryDraftedData = partCategoryDetail
        loadDraftData(partCategoryDraftedData?.data)
      }
 
    }
  }, [isAddMode, partCategoryDetail, partCategoryId, transformApiDataToFormData])

  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData])

  useEffect(() => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setFinalFileData(FINALFILEINITIALDATA)
    setDraftDocuments({})
    setDraftDelete([])
    if (!isAddMode){
      partCategoryRefetch()
    }else{
    fetchDraft()

    }
  }, [paramId])

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }

      if (field === FORM_FIELD_NAMES.STATUS) {
        newFormData.status_id = Number(value)
      }

      // Reset dependent dropdowns when parent changes
      if (field === FORM_FIELD_NAMES.PART_CATEGORY_TYPE) {
        DEPENDENT_FIELD_RESETS.PART_CATEGORY_TYPE.forEach(resetField => {
          (newFormData)[resetField] = ''
        })
      } else if (field === FORM_FIELD_NAMES.PART_CATEGORY_SUB_TYPE) {
        DEPENDENT_FIELD_RESETS.PART_CATEGORY_SUB_TYPE.forEach(resetField => {
          (newFormData)[resetField] = ''
        })
      }
      
      partCategoryhandleDraftSave(newFormData)
      return newFormData
    })

    // Clear error for the field if it has a value
    if (value && (typeof value === 'string' ? value.trim() : value.length > 0)) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Check each required field
    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field]
      if (
        !value ||
        (Array.isArray(value) && value.length === NUMBERMAP.ZERO)
      ) {
        newErrors[field] = VALIDATION_MESSAGES[field.toUpperCase() as keyof typeof VALIDATION_MESSAGES]
        isValid = false
      }
    })

    // Validate file upload (following clinical-evaluation pattern)
    // Check if there are any documents remaining after accounting for deletions
    const hasDocuments = formData.documents && formData.documents.length > NUMBERMAP.ZERO
    if (!hasDocuments) {
      newErrors.documents = VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED
      isValid = false
    }

    setErrors(newErrors)
    
    // Show file validation error when save is clicked
    setShowFileValidationError(true)

    return isValid
  }

  // Helper function to create file metadata
  const createFileMetadata = () => {
    if (!hasFileData(finalFileData) && (formData.documents.length == NUMBERMAP.ZERO)) return null
    
    const metadata = createFileMetadataUtil({
      isEditMode: !isAddMode,
      draftData,
      existingData: partCategoryDetail,
      finalFileData,
    })

    return {
      [API_FIELD_MAPPINGS.DOCUMENTS_TO_DELETE]: metadata.documents_to_delete,
      [API_FIELD_MAPPINGS.CREATE_META_DATA]: metadata.create_meta_data,
      [API_FIELD_MAPPINGS.UPDATE_META_DATA]: metadata.update_meta_data,
    }
  }


  // Helper function to prepare FormData for API
  const prepareFormDataForAPI = () => {
    const formDataForAPI = new FormData()

    // Add part_category_id for updates
    if (!isAddMode && partCategoryId) {
      formDataForAPI.append(API_FIELD_MAPPINGS.PART_CATEGORY_ID, partCategoryId.toString())
    }

    // Add basic fields
    formDataForAPI.append(API_FIELD_MAPPINGS.PART_CATEGORY_TYPE_ID, formData.partCategoryType)
    formDataForAPI.append(API_FIELD_MAPPINGS.PART_CATEGORY_SUB_TYPE_ID, formData.partCategorySubType)
    formDataForAPI.append(API_FIELD_MAPPINGS.PART_CATEGORY_SUBCLASS_ID, formData.productCategorySubClass)
    formDataForAPI.append(API_FIELD_MAPPINGS.PART_CATEGORY_NAME, formData.partCategoryName)
    formDataForAPI.append(API_FIELD_MAPPINGS.DESCRIPTION, formData.description ?? '')
    formDataForAPI.append(API_FIELD_MAPPINGS.STATUS, formData.status_id.toString())

    // Add file documents 
    finalFileData?.documents_to_create?.forEach((fileData) => {
      if (fileData instanceof File) {
        formDataForAPI.append(API_FIELD_MAPPINGS.DOCUMENTS_TO_CREATE, fileData)
      }
    })
    // Add file metadata
    const fileMetadata = createFileMetadata()
    if (fileMetadata) {
      Object.entries(fileMetadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const shouldStringify = typeof value === 'object' && value !== null
          formDataForAPI.append(key, shouldStringify ? JSON.stringify(value) : String(value))
        }
      })
    }

    return formDataForAPI
  }

  // Helper function to handle successful save
  const handleSaveSuccess = () => {
    showActionAlert('success')
    router.push('/vendor-management/part-category')
  }

  // Helper function to handle save error
  const handleSaveError = () => {
    showActionAlert('failed')
  }

  const handleSave = () => {
    if (!validateForm()) return
    const formDataForAPI = prepareFormDataForAPI()

    upsertMutation.mutate(formDataForAPI as any, {
      onSuccess: () => {
        clearDraftSave()
        handleSaveSuccess()
      },
      onError: handleSaveError,
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push('/vendor-management/part-category')
  }

  const handleFileUpload = (newFile: File) => {
    const documents = formData?.documents ?? []
    setFormData((prev) => {
      const updated = {
        ...prev,
        documents: [...documents, newFile],
      }
      return updated
    })
    // Clear error when file is uploaded (following clinical-evaluation pattern)
    setErrors((prev) => ({
      ...prev,
      documents: '',
    }))
  }

  const handleFileEdit = (documents) => {
    setFormData((prev) => {
      const updatedFiles = prev.documents.map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      const updated = {
        ...prev,
        documents: updatedFiles,
      }
      return updated
    })
  }

  const partCategoryhandleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = prev.documents.filter((file) => {
          const fileName = (file)?.file?.name?.split('.')[NUMBERMAP.ZERO]
          return !data.local_files_to_delete.includes(fileName)
        })
        return {
          ...prev,
          documents: updatedDocs,
        }
      })
    }
  
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = prev.documents.filter((file) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id
          return !data.documents_to_delete.includes(fileId)
        })
        return {
          ...prev,
          documents: updatedDocs,
        }
      })
    }
  }


  return (
    <FormContainer ref={formRef}>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <GlobalLoader loading={isFetchingDraft} />
        <Label title={PAGE_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_CATEGORY_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_CATEGORY_TYPE}
                isDropdown
                value={formData?.partCategoryType ?? ''}
                onChange={(value: any) => {
                  handleInputChange(FORM_FIELD_NAMES.PART_CATEGORY_TYPE, value)
                }}
                error={errors.partCategoryType}
                options={partCategoryTypesData?.data}
                keyField={PART_CATEGORY_TYPE.KEY_FIELD}
                valueField={PART_CATEGORY_TYPE.VALUE_FIELD}

              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_CATEGORY_SUB_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_CATEGORY_SUB_TYPE}
                isDropdown
                value={formData?.partCategorySubType}
                onChange={(value: any) => {
                  handleInputChange(FORM_FIELD_NAMES.PART_CATEGORY_SUB_TYPE, value)
                }}
                error={errors.partCategorySubType}
                options={partSubcategoryTypesData?.data}
                keyField={PART_CATEGORY_SUB_TYPE.KEY_FIELD}
                valueField={PART_CATEGORY_SUB_TYPE.VALUE_FIELD}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PRODUCT_CATEGORY_SUB_CLASS}
                placeholder={FORM_PLACEHOLDERS.PRODUCT_CATEGORY_SUB_CLASS}
                isDropdown
                value={formData?.productCategorySubClass ?? ''}
                onChange={(value: any) =>
                  handleInputChange(FORM_FIELD_NAMES.PRODUCT_CATEGORY_SUB_CLASS, value)
                }
                error={errors.productCategorySubClass}
                options={partCategorySubclassesData?.data}
                keyField={PART_CATEGORY_SUBCLASS.KEY_FIELD}
                valueField={PART_CATEGORY_SUBCLASS.VALUE_FIELD}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_CATEGORY_NAME}
                placeholder={FORM_PLACEHOLDERS.PART_CATEGORY_NAME}
                value={formData?.partCategoryName ?? ''}
                onChange={(value: any) =>
                  handleInputChange(FORM_FIELD_NAMES.PART_CATEGORY_NAME, value)
                }
                error={errors.partCategoryName}
              />
            </Grid2>
          </Grid2>


          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.DESCRIPTION}
                placeholder={FORM_PLACEHOLDERS.DESCRIPTION}
                value={formData?.description ?? ''}
                onChange={(value: any) =>
                  handleInputChange(FORM_FIELD_NAMES.DESCRIPTION, value)
                }
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formData?.status_id}
                onChange={(value: any) =>
                  handleInputChange(FORM_FIELD_NAMES.STATUS, value)
                }
                error={errors.status_id}
                options={statusDropdownData?.data}
                keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
                valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}

              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={formData?.documents as any}
                onSubmit={(data: any) => {
                  setFinalFileData((prev) => {
                    const mergedData = mergeFinalFileData(prev, data)
                    partCategoryhandleDraftSave(formData, mergeFinalFileData(prev, data))
                    return mergedData
                  })
                  partCategoryhandleFileRemove(data)
                }}
                onFileEdit={handleFileEdit}
                onFileUpload={handleFileUpload as any}
                subHeader={FILE_UPLOAD.UPLOAD_SUBHEADER}
                uploadMandError={errors.documents}
                isRequired={true}
                requiredErrorMessage={VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED}
                showValidationError={showFileValidationError}
                onValidationChange={(isValid) => {
                  // Only clear validation error display when file becomes valid (has files)
                  // Keep it true if invalid (no files) so error shows on next save attempt
                  if (isValid) {
                    setShowFileValidationError(false)
                  }
                }}
              />
            </Grid2>
          </Grid2>

          <ButtonGroup
            buttons={[
              { label: BUTTON_LABELS.CANCEL, onClick: handleCancel, disabled: upsertMutation.isPending },
              { label: BUTTON_LABELS.SAVE, onClick: handleSave, disabled: upsertMutation.isPending },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default PartCategoryForm
