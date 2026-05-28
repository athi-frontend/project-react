'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, Description } from '@/components/ui'
import MonthYearPicker from '@/components/ui/month-year-picker/MonthYearPicker'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { NUMBERMAP, BUTTON_LABEL, PERMISSION_ACTIONS, FINALFILEINITIALDATA, POSITIVE_INTEGER_REGEX } from '@/constants/common'
import { mergeFinalFileData, FinalFileData } from '@/lib/utils/common'
import { LABEL, MODAL_MODE, PLACEHOLDER, salesForecastErrorItems } from '@/constants/modules/sales/salesForecast'
import { MODAL_STYLES } from '@/styles/modules/dnd/verification'
import { useAllPriorities, useProductModels } from '@/hooks/modules/sales/useSalesForecast'
import { useGetProductAll } from '@/hooks/modules/dnd/useProject'
import { DateTime } from 'luxon'
import { FileUploadContainer, FileUploadBox } from '@/styles/modules/dnd/hld'
import type { FileData } from '@/types/components/ui/fileUploadV3'
/**
 * Classification : Confidential
 **/
import { SalesForecastModalFormData, Product, SalesForecastModalProps } from '@/types/modules/sales/salesForecast'
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager'
import { SALES_CONTEXT_TYPE } from '@/constants/commonContextType'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { processDraftPreparation, removeFieldsFromFormData } from '@/lib/utils/modules/sales/draftSaveCommon'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { validateFormFields } from '@/lib/utils/validateFormAndMapErrors'


const INITIAL_FORM_DATA: SalesForecastModalFormData = {
  productName: '',
  product: null,
  modelId: '',
  monthSelection: '',
  priority: '',
  unitsRequired: '',
  remarks: '',
  uploadedFile: [],
}

const INITIAL_ERRORS = {
  productName: '',
  modelId: '',
  monthSelection: '',
  priority: '',
  unitsRequired: '',
  remarks: '',
  file: '',
}
 
const buttonConfig = [{ action: BUTTON_LABEL.SAVE }, { action: PERMISSION_ACTIONS.VIEW }, { action: BUTTON_LABEL.CANCEL }]
const createInitialFinalFileData = (): FinalFileData => ({
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
})

// Product and Status options are now loaded from existing APIs

const SalesForecastModal: React.FC<SalesForecastModalProps> = ({
  onClose,
  onSave,
  mode = 'add',
  forecastId,
  initialData,
  isSubmitting: externalIsSubmitting = false,
  workflowPermissions,
  workflowTaskInfo,
  workflowMenuId,
  workflowMenuName,
  workflowRefetch,
}) => {
  const [formData, setFormData] = useState<SalesForecastModalFormData>(
    initialData ?? INITIAL_FORM_DATA
  )
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialData?.product?.product_id?.toString() ?? initialData?.productName ?? ''
  )
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false)
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true)
  
  // Use external isSubmitting if provided, otherwise use internal state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting
  // Reset submitting state when external submitting becomes false (API call completed)
  useEffect(() => {
    if (!externalIsSubmitting) {
      setInternalIsSubmitting(false)
    }
  }, [externalIsSubmitting])

  const [errors, setErrors] = useState<typeof INITIAL_ERRORS>(INITIAL_ERRORS)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(createInitialFinalFileData())
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])
  // Draft save hook
  const forecastIdForDraft = mode === MODAL_MODE.EDIT && forecastId ? forecastId : null
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'sales_forecast',
    context_instance_id: forecastIdForDraft,
    enableFetch: false
  })
  useEffect(() => {
    if (initialData && !draftData?.data) {
      const initialProductId = initialData.product?.product_id?.toString() ?? initialData.productName ?? ''
      const initialModelId = initialData.modelId ?? ''
      setFormData({
        ...INITIAL_FORM_DATA,
        ...initialData,
        productName: initialProductId,
        modelId: initialModelId,
        product: initialData.product ?? null,
        uploadedFile: initialData.uploadedFile ?? [],
      })
      setSelectedProductId(initialProductId)
      setFinalFileData(createInitialFinalFileData())
    }
  }, [initialData, draftData])
 
  useEffect(() => {
    // Only fetch draft in add mode, not in edit mode
    if (mode === MODAL_MODE.ADD) {
      fetchDraft()
    }
  }, [forecastIdForDraft, mode])
  // Fetch data from existing APIs
  const { data: prioritiesData } = useAllPriorities({ status: NUMBERMAP.ONE })
  const { data: productData } = useGetProductAll()
  const { data: modelResponse } = useProductModels(selectedProductId, Boolean(selectedProductId))
  const modelOptions = modelResponse?.data ?? []

  const validateForm = (): boolean => {
    // Use common validation utility with errorItems from utils
    const validationResult = validateFormFields(formData, salesForecastErrorItems, INITIAL_ERRORS)
    const newErrors = { ...validationResult.errors }

    setErrors(newErrors)
    return validationResult.isValid
  }

  const handleDraftSave = (formDataToSave: SalesForecastModalFormData, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = draftData?.data ? draftData : { data: initialData }
 
    const draftConfig = {
      fileFieldToSectionMap: { 'uploadedFile': 'uploadedFile' },
      sectionTypeToNameMap: { 'uploadedFile': 'uploadedFile' },
      responseDataKeyMap: { 'uploadedFile': 'uploadedFile' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, uploadedFile: formDataToSave.uploadedFile ?? [] },
      { uploadedFile: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete);

    const fieldsToRemove = ['uploadedFile']
    const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

    const payload = {
      id: forecastIdForDraft ?? new Date().getTime(),
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_type: 'sales_forecast',
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

  const handleInputChange = (field: keyof SalesForecastModalFormData, value: string) => {
    if (mode === MODAL_MODE.EDIT && !hasEditPermission) return;
    
    // Validate unitsRequired field to allow only positive integers (greater than 0)
    if (field === 'unitsRequired') {
      if (value && (!POSITIVE_INTEGER_REGEX.test(value))) {
        return; // Don't update if value doesn't match positive integer regex
      }
    }
    
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }
      if (mode == 'add') {
        handleDraftSave(newFormData)
      }
      return newFormData
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleProductChange = (value: string) => {
    if (mode === MODAL_MODE.EDIT && !hasEditPermission) return;
    // Find the selected product object
    const selectedProduct = productData?.data?.find((product: Product) => product.product_id?.toString() === value) ?? null
    setSelectedProductId(value || '')
    setFormData((prev) => {
      const newFormData = { ...prev, productName: value ?? '', product: selectedProduct, modelId: '' }
      if (mode == 'add') {
        handleDraftSave(newFormData)
      } return newFormData
    })
    setErrors((prev) => ({ ...prev, productName: '', modelId: '' }))
  }

  const handleModelChange = (value: string) => {
    if (mode === MODAL_MODE.EDIT && !hasEditPermission) return;
    setFormData((prev) => {
      const newFormData = { ...prev, modelId: value ?? '' }
      if (mode == 'add') {
        handleDraftSave(newFormData)
      } return newFormData
    })
    setErrors((prev) => ({ ...prev, modelId: '' }))
  }

  const handleFileUpload = (newFile: FileData) => {
    if (mode === MODAL_MODE.EDIT && !hasEditPermission) return;
    setFormData((prev) => {
      const updated = {
        ...prev,
        uploadedFile: [...prev.uploadedFile, newFile] as SalesForecastModalFormData['uploadedFile'],
      }
      return updated
    })

    if (errors.file) {
      setErrors((prev) => ({
        ...prev,
        file: '',
      }))
    }
  }

  const handleFileEdit = useCallback(
    (updatedFile: FileData) => {
      setFormData((prev) => {
        const getIdentifier = (file: unknown): string | number | undefined => {
          if (file && typeof file === 'object') {
            const record = file as Record<string, any>
            return record.document_id ?? record.file_id ?? record.id
          }
          return undefined
        }
 
        const updatedFiles = prev.uploadedFile.map((file) => {
          const currentId = getIdentifier(file)
          const incomingId = getIdentifier(updatedFile)

          if (currentId && incomingId && currentId === incomingId) {
            return {
              ...(file as Record<string, any>),
              ...(updatedFile as Record<string, any>),
            } as SalesForecastModalFormData['uploadedFile'][number]
          }

          return file
        }) as SalesForecastModalFormData['uploadedFile']

        const updated = {
          ...prev,
          uploadedFile: updatedFiles,
        }
        return updated
      })
    },
    [mode, hasEditPermission]
  )

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    setFormData(INITIAL_FORM_DATA)
    setErrors(INITIAL_ERRORS)
    setFinalFileData(createInitialFinalFileData())
    setInternalIsSubmitting(false) // Reset submitting state on cancel
    if (onClose) onClose()
  }

  useEffect(() => {
    if (finalFileData.documents_to_delete?.length > NUMBERMAP.ZERO) {
      const serverIdsToDelete = finalFileData.documents_to_delete.map((value) => value?.toString())
      setFormData((prev) => {
        const prevData = { ...prev }
        prevData.uploadedFile = prevData.uploadedFile.filter(
          (file) => {
            const identifier = (file?.file_id ?? file?.id)?.toString()
            return identifier ? !serverIdsToDelete.includes(identifier) : true
          }
        )
        return prevData
      })
    }
    if (finalFileData.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      const localIdsToDelete = finalFileData.local_files_to_delete.map((value) => value?.toString())
      setFormData((prev) => {
        const prevData = { ...prev }
        prevData.uploadedFile = prevData.uploadedFile.filter(
          (file) => {
            const identifier = (file?.id ?? file?.file_id)?.toString()
            return identifier ? !localIdsToDelete.includes(identifier) : true
          }
        )
        return prevData
      })
    }
  }, [finalFileData])

  // Load draft data
  useEffect(() => {
    if (draftData?.data) {
      setFormData({
        ...draftData.data,
        uploadedFile: [...(draftData?.data?.draftDocuments?.uploadedFile ?? []), ...(draftData?.data?.documents ?? [])],
      })
      setSelectedProductId(draftData?.data?.productName ?? '')
      setDraftDocuments(draftData?.data?.draftDocuments ?? {})
      setDraftDelete(Array.isArray(draftData?.data?.draftDelete) ? draftData.data.draftDelete : [])
    }
  }, [draftData])

  const handleSave = () => {
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    if (!validateForm()) return;
    
    // Set submitting state to prevent duplicate submissions
    // This provides immediate feedback while the parent's mutation state updates
    setInternalIsSubmitting(true);
    
    // Clear draft on successful save
    clearDraftSave()
    
    if (onSave) {
      onSave({
        ...formData,
        product: formData.product, // Ensure product object is passed
        uploadedFile: finalFileData.documents_to_create ?? [], // Use finalFileData for documents
        create_meta_data: finalFileData.create_meta_data,
        update_meta_data: finalFileData.update_meta_data ?? {},
        documents_to_delete: finalFileData.documents_to_delete,
      });
    }
    // Note: The submitting state will be reset by the useEffect when externalIsSubmitting becomes false
    // or when the modal is closed via handleCancel
  };

  const handleFileRemove = (data: FinalFileData) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: prev.uploadedFile.filter(
          (file) =>
            !data.local_files_to_delete.includes(
              (file.file?.name ?? '').split('.')[NUMBERMAP.ZERO]
            )
        ),
      }))
    }
  }

  return (
    <ContentWrapper>
      {isDraftSaving && <DraftLoading />}
      <Grid2
        container
        spacing={NUMBERMAP.ONE}
        sx={{ ...MODAL_STYLES.scrollableContainer, ...STYLE5 }}
      >
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={LABEL.PRODUCT_ID}
            placeholder={PLACEHOLDER.PRODUCT_ID}
            isDropdown
            options={productData?.data ?? []}
            value={formData.productName}
            onChange={handleProductChange}
            error={errors.productName}
            keyField="product_id"
            valueField="product_name"
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={LABEL.MODEL_ID}
            placeholder={PLACEHOLDER.MODEL_ID}
            isDropdown
            options={modelOptions}
            value={formData.modelId}
            onChange={handleModelChange}
            error={errors.modelId}
            keyField="model_id"
            valueField="model_name"
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <MonthYearPicker
            label="Month Selection*"
            value={formData.monthSelection ? DateTime.fromFormat(formData.monthSelection, 'MM-yyyy') : null}
            onChange={d => {
              handleInputChange('monthSelection', d ? d.toFormat('MM-yyyy') : '')
            }}
            error={errors.monthSelection}
            placeholder="MM-YYYY"
            minDate={null}
            maxDate={null}
            periodType="monthly"
            startDate={null}
          />
 
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Priority*"
            placeholder="Select priority"
            isDropdown
            options={prioritiesData?.data ?? []}
            value={formData.priority}
            onChange={(value: string) => handleInputChange('priority', value)}
            error={errors.priority}
            keyField="priority_id"
            valueField="priority_name"
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Units Required*"
            placeholder="Enter units required"
            value={formData.unitsRequired}
            onChange={(value: string) => handleInputChange('unitsRequired', value)}
            error={errors.unitsRequired}
            maxLength={NUMBERMAP.SEVEN}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <Description
            label="Remarks*"
            placeholder="Enter remarks"
            value={formData.remarks}
            onChange={(value: string) => handleInputChange('remarks', value)}
            error={errors.remarks}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <FileUploadContainer>
            <FileUploadBox>
              <FileUploadManager
                subHeader="Upload*"
                initialFiles={formData.uploadedFile as unknown as File[]}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={(data) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data as Partial<FinalFileData>))
                  if (mode == 'add') {
                    handleDraftSave(formData, mergeFinalFileData(finalFileData, data as Partial<FinalFileData>))
                  }
                  handleFileRemove(data as FinalFileData)
                }}
                uploadMandError={errors.file}
                hasEditable={mode === MODAL_MODE.EDIT && !hasEditPermission}
              />
            </FileUploadBox>
          </FileUploadContainer>
        </Grid2>
      </Grid2>
      <SalesReviewerModalManager
        isLoading={false}
        permissions={workflowPermissions && workflowPermissions.length > NUMBERMAP.ZERO ? workflowPermissions : buttonConfig}
        taskInfo={workflowTaskInfo ?? { task_comments: [], reviewer_list: [] }}
        menuId={workflowMenuId}
        menuName={workflowMenuName}
        contextType={SALES_CONTEXT_TYPE.SALES_FORECAST}
        contextId={formData.modelId ? parseInt(formData.modelId) : NUMBERMAP.ZERO}
        customHandlers={{
          handleCancel: handleCancel,
          handleSave: handleSave,
          isDisabled: isSubmitting,
        }}
        onPermissionChange={setHasEditPermission}
        refetch={workflowRefetch}
        hideSaveButton={false}
      />
    </ContentWrapper>
  )
}

export default SalesForecastModal
