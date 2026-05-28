'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Grid2 } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  Description,
  showActionAlert,
  Label,
  DataGridTable,
  ActionButton,
} from '@/components/ui'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { FINALFILEINITIALDATA, NUMBERMAP, STATUS } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  BUTTONLABELS,
  emailRegex,
  FinalFileData,
  mapDocumentsByCategory,
  mapFileResponse,
  mergeFinalFileData,
} from '@/lib/utils/common'
import {
  useAllVendorTypes,
  useAllVendorReEvaluationFrequency,
} from '@/hooks/modules/vendor-management/useCommonDropdown'
import {
  useCreateUpdateVendor,
  useVendorById,
} from '@/hooks/modules/vendor-management/useVendorList'
import { VendorFormData } from '@/types/modules/vendor-management/vendorList'
import VendorPartCategoryModal from '@/components/modules/vendor-management/VendorPartCategoryModal'
import {
  CREATE,
  CREATE_PAGE_TITLE,
  EDIT_PAGE_TITLE,
  ERROR_MESSAGES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  REQUIRED_FIELDS,
  TELEPHONE_NUMBER_REGEX,
  URL_VALIDATION,
  FORM_FIELD_NAMES,
  DROPDOWN_FIELDS,
  PART_CATEGORY_TABLE,
  VENDOR_LIST_PATH,
} from '@/constants/modules/vendor-management/vendorList'
import {
  DEFAULT_FORM_DATA,
  FormErrors,
  VendorFormFile,
  VendorPartCategory,
  VendorPartCategoryFormData,
} from '@/types/modules/vendor-management/vendorList'
import { DELETE_ALERT } from '@/constants/modules/dnd/formTeam'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'

/**
 * Classification : Confidential
 **/

const VendorForm: React.FC = () => {
  const router = useRouter()
  const { id: rawIdFromParams } = useParams()
  const paramId = Array.isArray(rawIdFromParams)
    ? rawIdFromParams[NUMBERMAP.ZERO]
    : rawIdFromParams
  const isAddMode = paramId === CREATE
  const vendorId =
    isAddMode || !paramId || Number.isNaN(Number(paramId))
      ? null
      : Number(paramId)
  const formRef = useRef<HTMLElement | null>(null)

  const [formData, setFormData] = useState<VendorFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [referenceDocuments, setReferenceDocuments] = useState<
    VendorFormFile[]
  >([])
  const [referenceFileData, setReferenceFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [vendorSelectionTableData, setVendorSelectionTableData] = useState<
    VendorPartCategory[]
  >([])
  const [selectedRow, setSelectedRow] = useState<VendorPartCategory | null>(
    null
  )
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // API hooks
  const { data: vendorTypes } = useAllVendorTypes()
  const { data: vendorReEvaluationFrequencies } =
    useAllVendorReEvaluationFrequency()
  const { data: existingVendor, isLoading: isVendorLoading,refetch:vendorRefetch } = useVendorById(
    vendorId?.toString() ?? '',
    !isAddMode && !!vendorId
  )
  const { mutate: createUpdateMutation, isPending: isSubmitting } =
    useCreateUpdateVendor()
    const { data: statusData } = useOrganizationStatus()

  // Draft save hook
  const vendorIdForDraft = isAddMode ? null : vendorId
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: "vendor_id",
    context_instance_id: vendorIdForDraft,
    enableFetch: false
  })

  const mapPartCategories = useCallback((categories: any[] = []) => {
    return categories.map((category) => ({
      ...category,
      leadTimeDays: category?.leadTimeDays ?? category?.lead_time_days?.toString() ?? '',
    }))
  }, [])

  const transformApiDataToFormData = useCallback((apiData: any): VendorFormData => {
    const resolvedData = Array.isArray(apiData?.data)
      ? apiData.data[NUMBERMAP.ZERO]
      : apiData?.data ?? apiData ?? {}

    const mergedDocuments = [
      ...(Array.isArray(resolvedData.documents) ? resolvedData.documents : []),
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

    const mappedCategories = mapPartCategories(resolvedData.part_categories ?? [])
    return {
      ...resolvedData,
      documents: mapFileResponse(uniqueDocuments),
      part_categories: mappedCategories,
    }
  }, [mapPartCategories])

  const loadDraftData = useCallback((data: any) => {
    const transformed = transformApiDataToFormData(data)
    setFormData({ ...transformed })
    setReferenceDocuments(transformed.documents ?? [])
    setVendorSelectionTableData(transformed.part_categories ?? [])
  }, [transformApiDataToFormData])

  // Load existing data in edit mode
  useEffect(() => {
    if (
      !isAddMode &&
      existingVendor?.data
    ) {
      const vendor = existingVendor?.data?.[NUMBERMAP.ZERO]
      if (existingVendor.data && !Array.isArray(existingVendor.data)) {
        const transformed = transformApiDataToFormData(existingVendor)
        setFormData(transformed)
        let existingVendorDraftedData = existingVendor
        setReferenceDocuments([...(existingVendorDraftedData?.data?.documents ?? []),...(existingVendorDraftedData?.data?.draftDocuments?.documents??[])])
        setVendorSelectionTableData(transformed.part_categories ?? [])
        setDraftDelete(existingVendorDraftedData?.data?.draftDelete ?? [])
        setDraftDocuments(existingVendorDraftedData?.data?.draftDocuments??[])
      } else {
        setFormData({
          vendor_name: vendor.vendor_name,
          vendor_type_id: vendor.vendor_type_id,
          address: vendor.address,
          location: vendor.location,
          contact_person_name: vendor.contact_person_name,
          telephone_number: vendor.telephone_number,
          email: vendor.email,
          website: vendor.website,
          vendor_reevaluation_frequency_id:
            vendor.vendor_reevaluation_frequency_id ?? null,
          status: vendor.status,
          vendor_id: vendor.id,
        })
        setReferenceDocuments(
          vendor?.documents ?? []
        )
        // Map lead_time_days to leadTimeDays for component compatibility
        const mappedPartCategories = (vendor?.part_categories ?? []).map((category) => ({
          ...category,
          leadTimeDays: category.lead_time_days?.toString() ?? '',
        }))
        setVendorSelectionTableData(mappedPartCategories)
      }
    }
  }, [existingVendor])

  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData])

  useEffect(() => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setReferenceFileData(FINALFILEINITIALDATA)
    setVendorSelectionTableData([])
    setDraftDocuments({})
    setDraftDelete([])
    if (!isAddMode){
      vendorRefetch()
    }else{
    fetchDraft()
    }
  }, [paramId])

  const handleDraftSave = (formDataToSave: VendorFormData,partCategoriesToSave?: VendorPartCategory[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? referenceFileData
    let draftDatas = isAddMode ? draftData : existingVendor
    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents:referenceDocuments },
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

    const fieldsToRemove = ['documents']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    )

    const payload = {
      id: vendorIdForDraft ?? new Date().getTime(),
      ...cleaned,
      part_categories: partCategoriesToSave ?? vendorSelectionTableData ?? [],
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
  }

  const handleInputChange = (
    field: keyof VendorFormData,
    value: string | number | boolean
  ) => {
    // handle numeric-only for telephone
    setFormData((prev) => {
      const updated = { ...prev, [field]: value as string | number }
      handleDraftSave(updated)
      return updated
    })

    if (value && (typeof value === 'string' ? value.trim() : true)) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateUrl = (value: string): boolean => {
    try {
      if (!value) return false

      let urlString = value.trim()

      // Add https:// if it starts with www (case-insensitive)
      if (URL_VALIDATION.WWW_PATTERN.test(urlString)) {
        urlString = `${URL_VALIDATION.HTTPS_PREFIX}${urlString}`
      }

      // Attempt to construct URL (will throw if invalid)
      const url = new URL(urlString)

      // Allow only http or https protocols
      return URL_VALIDATION.ALLOWED_PROTOCOLS.includes(url.protocol as 'http:' | 'https:')
    } catch {
      return false
    }
  }

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !isAddMode,
      draftData:isAddMode?draftData:existingVendor,
      existingData: existingVendor,
      finalFileData: referenceFileData,
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const required: (keyof VendorFormData)[] = REQUIRED_FIELDS
    required.forEach((field) => {
      const value = formData[field]
      if (!value || value === '' || value === NUMBERMAP.ZERO) {
        const fieldLabel = field.toUpperCase() as keyof typeof ERROR_MESSAGES
        if (fieldLabel in ERROR_MESSAGES) {
          newErrors[field as keyof FormErrors] = `${ERROR_MESSAGES[fieldLabel]}`
        }
      }
    })

    if (
      formData.telephone_number &&
      formData.telephone_number.length !== NUMBERMAP.TWELVE
    ) {
      newErrors.telephone_number = ERROR_MESSAGES.INVALID_TELEPHONE_NUMBER
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL
    }

    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = ERROR_MESSAGES.INVALID_WEBSITE_URL
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    clearDraftSave()
    try {
      // Prepare FormData for API
      const formDataToSend = new FormData()
      // Add basic fields
      REQUIRED_FIELDS.forEach((field) => {
        const value = formData[field as keyof VendorFormData]
        formDataToSend.append(field, String(value))
      })
      formDataToSend.append(FORM_FIELD_NAMES.STATUS, String(formData.status))
      if (vendorSelectionTableData.length > NUMBERMAP.ZERO) {
        const partCategories = vendorSelectionTableData.map((item) => {
          const categoryData: {
            part_category_id: number
            vendor_selection_criteria_id: number | null
            lead_time_days: number | null
            moq_detail?: number | null
            part_category_mapper_id?: number
          } = {
            part_category_id: Number(item.part_category_id),
            vendor_selection_criteria_id:
              item?.part_category_selection_criteria_id
                ? Number(item.part_category_selection_criteria_id)
                : item.vendor_selection_criteria_id
                  ? Number(item.vendor_selection_criteria_id)
                  : null,
            lead_time_days: item.leadTimeDays ? Number(item.leadTimeDays) : null,
            moq_detail: item.moq_detail != null ? Number(item.moq_detail) : null,
          }
          // Only set part_category_mapper_id if id exists (from API response)
          // tempId indicates it's a new record, so don't include mapper_id
          if (item.id && !item.tempId && typeof item.id === 'number' && item.id > NUMBERMAP.ZERO) {
            categoryData.part_category_mapper_id = item.id
          }
          return categoryData
        })
        formDataToSend.append(FORM_FIELD_NAMES.PART_CATEGORIES, JSON.stringify(partCategories))
      }
      // Add vendor_id for update
      if (!isAddMode && vendorId) {
        formDataToSend.append(FORM_FIELD_NAMES.VENDOR_ID, vendorId.toString())
      }

      // Handle file uploads - Reference documents
      if (
        referenceFileData.documents_to_create &&
        referenceFileData.documents_to_create.length > NUMBERMAP.ZERO
      ) {
        referenceFileData.documents_to_create.forEach((file) => {
          formDataToSend.append(FORM_FIELD_NAMES.DOCUMENTS_TO_CREATE, file)
        })
      }

      const fileMetadata = createFileMetadata()
      if (fileMetadata) {
        formDataToSend.append(
          FORM_FIELD_NAMES.DOCUMENTS_TO_DELETE,
          JSON.stringify(fileMetadata.documents_to_delete)
        )
        formDataToSend.append(
          FORM_FIELD_NAMES.CREATE_META_DATA,
          JSON.stringify(fileMetadata.create_meta_data)
        )
        formDataToSend.append(
          FORM_FIELD_NAMES.UPDATE_META_DATA,
          JSON.stringify(fileMetadata.update_meta_data)
        )
      }

      createUpdateMutation(formDataToSend, {
        onSuccess: () => {
          showActionAlert(STATUS.SUCCESS)
          router.push(VENDOR_LIST_PATH)
        },
        onError: () => {
          showActionAlert(STATUS.FAILED)
        },
      })
    } catch (error) {
        showActionAlert(STATUS.FAILED)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(VENDOR_LIST_PATH)
  }

  const handleReferenceFileUpload = (newFile: File) => {
    setReferenceDocuments((prev) => {
      const updated = [...prev, newFile]
      setFormData((prevForm) => {
        const updatedForm = { ...prevForm, documents: updated }
        handleDraftSave(updatedForm)
        return updatedForm
      })
      return updated
    })
  }

  const handleReferenceFileEdit = useCallback((documents: FileDocument) => {
    setReferenceDocuments((prev) => {
      const updatedFiles = prev.map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id
        return currentId === updatedId ? { ...file, ...documents } : file
      })
      setFormData((prevForm) => {
        const updatedForm = { ...prevForm, documents: updatedFiles }
        handleDraftSave(updatedForm)
        return updatedForm
      })
      return updatedFiles
    })
  }, [handleDraftSave])
  const handleEdit = (row: VendorPartCategory) => {
    setSelectedRow(row)
    setCategoryModalOpen(true)
  }
  const handleDelete = (row: VendorPartCategory) => {
       showActionAlert(DELETE_ALERT).then((result) => {
          if (result.isConfirmed) {
            const updatedTable = vendorSelectionTableData.filter((item) => {
              const idMatch = item.id !== undefined && row.id !== undefined && item.id === row.id
              const tempIdMatch = item.tempId !== undefined && row.tempId !== undefined && item.tempId === row.tempId
              return !(idMatch || tempIdMatch)
            })
            setVendorSelectionTableData(updatedTable)
            setFormData((prev) => {
              const updated = { ...prev, part_categories: updatedTable }
              handleDraftSave(formData,updatedTable)
              return updated
            })
          }
        })
  }
  return (
    <FormContainer ref={formRef}>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <GlobalLoader loading={isLoading || isVendorLoading || isFetchingDraft} />
        <Label title={isAddMode ? CREATE_PAGE_TITLE : EDIT_PAGE_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_TYPE}
                placeholder={FORM_PLACEHOLDERS.VENDOR_TYPE}
                isDropdown
                value={formData?.vendor_type_id?.toString() ?? ''}
                onChange={(value: string) =>
                  handleInputChange('vendor_type_id', Number(value))
                }
                error={errors.vendor_type_id}
                options={vendorTypes?.data ?? []}
                keyField={DROPDOWN_FIELDS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.VENDOR_TYPE_VALUE_FIELD}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_NAME}
                placeholder={FORM_PLACEHOLDERS.VENDOR_NAME}
                value={formData?.vendor_name ?? ''}
                onChange={(value: string) =>
                  handleInputChange('vendor_name', value)
                }
                error={errors.vendor_name}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.ADDRESS}
                placeholder={FORM_PLACEHOLDERS.ADDRESS}
                value={formData?.address ?? ''}
                onChange={(value: string) =>
                  handleInputChange('address', value)
                }
                error={errors.address}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label={FORM_LABELS.LOCATION}
                placeholder={FORM_PLACEHOLDERS.LOCATION}
                value={formData?.location ?? ''}
                onChange={(value: string) =>
                  handleInputChange('location', value)
                }
                error={errors.location}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.CONTACT_PERSON_NAME}
                placeholder={FORM_PLACEHOLDERS.CONTACT_PERSON_NAME}
                value={formData?.contact_person_name ?? ''}
                onChange={(value: string) =>
                  handleInputChange('contact_person_name', value)
                }
                error={errors.contact_person_name}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.TELEPHONE_NUMBER}
                placeholder={FORM_PLACEHOLDERS.TELEPHONE_NUMBER}
                value={formData?.telephone_number ?? ''}
                onChange={(value: string) => {
                  if (TELEPHONE_NUMBER_REGEX.test(value) || value == '') {
                    handleInputChange('telephone_number', value)
                  }
                }}
                error={errors.telephone_number}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.EMAIL}
                placeholder={FORM_PLACEHOLDERS.EMAIL}
                value={formData?.email ?? ''}
                onChange={(value: string) => handleInputChange('email', value)}
                error={errors.email}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.WEBSITE}
                placeholder={FORM_PLACEHOLDERS.WEBSITE}
                value={formData?.website ?? ''}
                onChange={(value: string) =>
                  handleInputChange('website', value)
                }
                error={errors.website}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_RE_EVALUATION_FREQUENCY}
                placeholder={FORM_PLACEHOLDERS.VENDOR_RE_EVALUATION_FREQUENCY}
                isDropdown
                value={
                  formData?.vendor_reevaluation_frequency_id?.toString() ?? ''
                }
                onChange={(value: string) =>
                  handleInputChange(
                    'vendor_reevaluation_frequency_id',
                    Number(value)
                  )
                }
                error={errors.vendor_reevaluation_frequency_id}
                options={vendorReEvaluationFrequencies?.data ?? []}
                keyField={DROPDOWN_FIELDS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.VENDOR_RE_EVALUATION_FREQUENCY_VALUE_FIELD}
              />
            </Grid2>
                 <Grid2 size={NUMBERMAP.SIX}>
                          <InputField
                            label={'Status*'}
                            placeholder={'Please select status'}
                            isDropdown
                            value={formData?.status}
                            onChange={(value: any) => {
                              handleInputChange(FORM_FIELD_NAMES.STATUS, value)
                            }}
                            error={errors.status}
                            options={statusData?.data ?? []}
                            keyField={'status_id'}
                            valueField={'status_name'}
                          />
                        </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={referenceDocuments as FileDocument[]}
                onSubmit={(data: Partial<FinalFileData>) => {
                  setReferenceFileData((prev) => {
                    const mergedData = mergeFinalFileData(prev, data)
                    handleDraftSave(formData, vendorSelectionTableData ?? [],mergedData)
                    return mergedData
                  })
                }}
                onFileEdit={handleReferenceFileEdit}
                onFileUpload={handleReferenceFileUpload}
                subHeader={FORM_LABELS.DOCUMENTS}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                showAddButton
                onAddRow={() => setCategoryModalOpen(true)}
                title={PART_CATEGORY_TABLE.TITLE}
                rows={vendorSelectionTableData.map((item) => ({
                  ...item,
                  id: item.id ?? item.tempId,
                }))}
                columns={[
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.SNO.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.SNO.HEADER_NAME,
                  },
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.PART_TYPE.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.PART_TYPE.HEADER_NAME,
                    flex: NUMBERMAP.HALF,
                  },
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.PART_SUB_TYPE.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.PART_SUB_TYPE.HEADER_NAME,
                    flex: NUMBERMAP.HALF,
                  },
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.PART_SUB_CLASS.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.PART_SUB_CLASS.HEADER_NAME,
                    flex: NUMBERMAP.HALF,
                  },
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.PART_CATEGORY.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.PART_CATEGORY.HEADER_NAME,
                    flex: NUMBERMAP.HALF,
                  },
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.MOQ.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.MOQ.HEADER_NAME,
                    flex: NUMBERMAP.HALF,
                  },
                  {
                    field: PART_CATEGORY_TABLE.COLUMNS.ACTION.FIELD,
                    headerName: PART_CATEGORY_TABLE.COLUMNS.ACTION.HEADER_NAME,
                    renderCell: (params: { row: VendorPartCategory & { id: number | string } }) => (
                      <ActionButton
                        onEdit={() => {
                          const originalRow = vendorSelectionTableData.find(
                            (item) => item.id === params.row.id || item.tempId === params.row.id
                          )
                          if (originalRow) handleEdit(originalRow)
                        }}
                        onDelete={() => {
                          const originalRow = vendorSelectionTableData.find(
                            (item) => item.id === params.row.id || item.tempId === params.row.id
                          )
                          if (originalRow) handleDelete(originalRow)
                        }}
                      />
                    ),
                  },
                ]}
                idField="id"
                hideFooter
                autoHeight
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <VendorPartCategoryModal
                open={categoryModalOpen}
                onClose={() => {
                  setCategoryModalOpen(false)
                  setSelectedRow(null)
                }}
                onSave={(partCategoryData: VendorPartCategoryFormData & { id?: number | string }) => {
                  if (selectedRow) {
                    // Update existing row - preserve the original id if it exists (from API)
                    const updatedTable = vendorSelectionTableData.map((item) => {
                        // Match by id if both exist and are equal, or by tempId if id doesn't exist but tempId matches
                        const isMatch = 
                          (selectedRow.id != null && item.id != null && item.id === selectedRow.id) ||
                          (selectedRow.id == null && selectedRow.tempId != null && item.tempId != null && item.tempId === selectedRow.tempId)
                        
                        return isMatch
                          ? {
                              ...item,
                              ...partCategoryData,
                              id: selectedRow.id,
                              tempId: selectedRow.tempId,
                              leadTimeDays: partCategoryData.leadTimeDays,
                              moq_detail: partCategoryData.minOrderQty ? Number(partCategoryData.minOrderQty) : null,
                              part_category_selection_criteria_id: partCategoryData.part_category_selection_criteria_id ?? undefined,
                              vendor_selection_criteria_id: partCategoryData.vendor_selection_criteria_id ?? undefined,
                            } as VendorPartCategory
                          : item
                      })
                    setVendorSelectionTableData(updatedTable)
                    setFormData((prev) => {
                      const updated = { ...prev, part_categories: updatedTable }
                      return updated
                    })
                    handleDraftSave(formData, updatedTable,referenceFileData)
                  } else {
                    // Add new row - use tempId for new records
                    const updatedTable = [
                      ...vendorSelectionTableData,
                      {
                        ...partCategoryData,
                        tempId: new Date().getTime(),
                        leadTimeDays: partCategoryData.leadTimeDays,
                        moq_detail: partCategoryData.minOrderQty ? Number(partCategoryData.minOrderQty) : null,
                        part_category_selection_criteria_id: partCategoryData.part_category_selection_criteria_id ?? undefined,
                        vendor_selection_criteria_id: partCategoryData.vendor_selection_criteria_id ?? undefined,
                      } as VendorPartCategory,
                    ]
                    setVendorSelectionTableData(updatedTable)
                    setFormData((prev) => {
                      const updated = { ...prev, part_categories: updatedTable }
                      return updated
                    })
                    handleDraftSave(formData, updatedTable,referenceFileData)
                  }
                  setCategoryModalOpen(false)
                  setSelectedRow(null)
                }}
                form={selectedRow ? {
                  ...selectedRow,
                  leadTimeDays: selectedRow.leadTimeDays ?? '',
                  moq_detail: selectedRow.moq_detail ?? null,
                } : {}}
                existingPartCategories={vendorSelectionTableData}
                currentItemId={selectedRow ? (selectedRow.id ?? selectedRow.tempId ?? null) : null}
              />
            </Grid2>
          </Grid2>

          <ButtonGroup
            buttons={[
              { label: BUTTONLABELS.BUTTON_LABEL_CANCEL, onClick: handleCancel, disabled: isSubmitting, },
              {
                label: BUTTONLABELS.BUTTON_LABEL_SAVE,
                onClick: handleSave,
                disabled: isSubmitting,
              },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default VendorForm
