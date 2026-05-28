'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { useRouter, useParams } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  Label,
  DataGridTable,
  ActionButton,
  showActionAlert,
  Description,
} from '@/components/ui'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import { usePartCategoryTypes, usePartSubcategoryTypes, usePartCategorySubclasses, usePartCategories } from '@/hooks/modules/vendor-management/useVendorSelectionCriteria'
import { useSampleInspectionCriteriaById, usePostSampleInspectionCriteria } from '@/hooks/modules/vendor-management/useSampleInspectionCriteria'
import { DROPDOWN_FIELDS } from '@/constants/modules/vendor-management/vendorSelectionCriteria'
import { FORM_LABELS, FORM_PLACEHOLDERS, VALIDATION_MESSAGES, DROPDOWN_FIELDS as SAMPLE_INSPECTION_DROPDOWN_FIELDS } from '@/constants/modules/vendor-management/sampleInspectionCriteria'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { COMMON_CONSTANTS, FinalFileData, mergeFinalFileData } from '@/lib/utils/common'
import { usePartNumbers } from '@/hooks/modules/vendor-management/useSampleOrders'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { STATUS_OPTIONS } from '@/constants/modules/sales/quotation'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import StatusTypography from '@/components/ui/status/ToggleStatus'

/**
 * Classification : Confidential
 **/


const BUTTON_LABELS = { SAVE: 'Save', CANCEL: 'Cancel' } as const
const CREATE = 'create'

const VendorForm: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const paramId = params.id
  const isAddMode = paramId === CREATE
  const sampleInspectionCriteriaId = isAddMode || !paramId || Number.isNaN(Number(paramId)) ? null : Number(paramId)
  const [formData, setFormData] = useState({
    part_type_id: '',
    part_category_id: '',
    part_sub_type_id: '',
    part_sub_class_id: '',
    part_no: '',
    part_category_name: '',
    status: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [openModal, setOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingSpecificationId, setEditingSpecificationId] = useState<number | null>(null)

  // API hooks for dropdown options
  const { data: partCategoryTypesData } = usePartCategoryTypes()
  const { data: partSubcategoryTypesData } = usePartSubcategoryTypes(Number(formData?.part_type_id))
  const { data: partCategorySubclassesData } = usePartCategorySubclasses(Number(formData?.part_sub_type_id))
  const { data: partCategoriesData } = usePartCategories(Number(formData?.part_sub_class_id))
  const { data: partNumbersData } = usePartNumbers(Number(formData?.part_category_id))
  const { data: statusData } = useOrganizationStatus()
  const [specificationList, setSpecificationList] = useState<any[]>([])
  const [currentSpecificationFiles, setCurrentSpecificationFiles] = useState<any[]>([])
  const [currentSpecificationFileData, setCurrentSpecificationFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [specificationFormData, setSpecificationFormData] = useState<any>({
    id: '',
    specifications_title: '',
    description: '',
    status: '',
    uploaded_files: [],
    isFromApi: false, // Track if specification is from API
    fileData: FINALFILEINITIALDATA,
  })
  const [specificationErrors, setSpecificationErrors] = useState<{ [key: string]: string }>({})
  // API hook for fetching sample inspection criteria data
  const { data: sampleInspectionCriteriaData, refetch: refetchByid } = useSampleInspectionCriteriaById(formData?.part_no!=''?formData?.part_no : sampleInspectionCriteriaId ?? NUMBERMAP.ZERO)

  // Mutation hook for posting sample inspection criteria
  const upsertMutation = usePostSampleInspectionCriteria()
  // Load form data if in edit mode
  useEffect(() => {
    if (sampleInspectionCriteriaData?.data?.[NUMBERMAP.ZERO]) {
      const apiData = sampleInspectionCriteriaData.data[NUMBERMAP.ZERO]
      setFormData({
        part_type_id: apiData.part_type_id?.toString() ?? '',
        part_sub_type_id: apiData.part_sub_type_id?.toString() ?? '',
        part_sub_class_id: apiData.part_sub_class_id?.toString() ?? '',
        part_category_id: apiData.part_category_id ?? '',
        part_category_name: apiData.part_category_id?.toString() ?? '',
        part_no: apiData.part_id ?? apiData?.part_no,
        documents: apiData?.documents ?? [],
        status: apiData.status?.toString() ?? '',
        sample_inspection_criteria_id: apiData?.sample_inspection_criteria_id ?? null
      })

      // Load specifications from API if they exist
      if (apiData.specifications && Array.isArray(apiData.specifications)) {
        const loadedSpecifications = apiData.specifications.map((spec: any) => ({
          id: spec.specification_id ?? Date.now(),
          specification_id: spec.specification_id,
          specification_name: spec.specification_title ?? '',
          description: spec.specification_description ?? '',
          status: spec.status ?? NUMBERMAP.ONE,
          uploaded_files: spec.supporting_files ?? [],
          isFromApi: true, // Mark as from API
          fileData: FINALFILEINITIALDATA,
        }))
        setSpecificationList(apiData?.type ? apiData.specifications : loadedSpecifications)
      }
    }
  }, [sampleInspectionCriteriaData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Implement cascading dropdown logic
      if (field === 'part_type_id') {
        // Reset dependent fields when Part Type changes
        newData.part_sub_type_id = ''
        newData.part_sub_class_id = ''
        newData.part_category_name = ''
        newData.part_category_id = ''
        newData.part_no = ''
      } else if (field === 'part_sub_type_id') {
        // Reset dependent fields when Part Sub Type changes
        newData.part_sub_class_id = ''
        newData.part_category_name = ''
        newData.part_category_id = ''
        newData.part_no = ''
      } else if (field === 'part_sub_class_id') {
        // Reset dependent fields when Part Sub Class changes
        newData.part_category_name = ''
        newData.part_category_id = ''
        newData.part_no = ''
      } else if (field === 'part_category_name' || field === 'part_category_id') {
        // Reset part number when Part Category changes
        newData.part_no = ''

      }
      return newData
    })

    // Clear error for the field if it has a value
    if (value?.trim()) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    const requiredFields = ['part_type_id', 'part_sub_type_id', 'part_sub_class_id', 'part_category_name', 'part_no', 'status']
    const ErrorMessages = {
      part_type_id: 'Part Type is required',
      part_sub_type_id: 'Part Sub Type is required',
      part_sub_class_id: 'Part Sub Class is required',
      part_category_name: 'Part Category Name is required',
      part_no: 'Part Number is required',
      status: VALIDATION_MESSAGES.STATUS,
    }
    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = ErrorMessages[field as keyof typeof ErrorMessages]
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    if (!validateForm()) return
    // Build specifications array - only include specification_id if it's from API
    const specifications = specificationList.map((spec) => {
      const specObj: any = {
        specification_name: spec.specification_name ?? spec.specifications_title ?? '',
        description: spec.description ?? '',
        status: Number(spec.status ?? NUMBERMAP.ONE),
      }

      // Only include specification_id if it's from API (not a timestamp-based ID)
      if (spec.isFromApi && spec.specification_id) {
        specObj.specification_id = spec.specification_id
      }

      return specObj
    })
    // Aggregate all files and metadata from all specifications
    const allDocumentsToCreate: File[] = []
    const allDocumentsToDelete: string[] = []
    const allCreateMetaData: Record<string, Record<string, any>> = {} // Grouped by specification name
    const allUpdateMetaData: Record<string, any> = {}

    specificationList.forEach((spec) => {
      const fileData = spec.fileData ?? {}
      const specificationName = spec.specification_name ?? spec.specifications_title ?? ''

      // Collect documents_to_create
      if (fileData.documents_to_create && Array.isArray(fileData.documents_to_create)) {
        fileData.documents_to_create.forEach((file: File) => {
          if (file instanceof File) {
            allDocumentsToCreate.push(file)
          }
        })
      }

      // Collect documents_to_delete
      if (fileData.documents_to_delete && Array.isArray(fileData.documents_to_delete)) {
        allDocumentsToDelete.push(...fileData.documents_to_delete)
      }

      // Group create_meta_data by specification name
      if (fileData.create_meta_data && typeof fileData.create_meta_data === 'object' && specificationName) {
        if (!allCreateMetaData[specificationName]) {
          allCreateMetaData[specificationName] = {}
        }
        Object.assign(allCreateMetaData[specificationName], fileData.create_meta_data)
      }

      // Merge update_meta_data
      if (fileData.update_meta_data && typeof fileData.update_meta_data === 'object') {
        Object.assign(allUpdateMetaData, fileData.update_meta_data)
      }
    })

    // Build FormData
    const formDataPayload = new FormData()

    // Add part_id (using part_category_id)
    formDataPayload.append('part_number_id', (formData.part_no ?? '').toString())

    // Add status
    if (formData.status) {
      formDataPayload.append('status', formData.status)
    }

    // Add specifications as JSON string
    formDataPayload.append('specifications', JSON.stringify(specifications))

    // Add documents_to_create (files)
    allDocumentsToCreate.forEach((file) => {
      if (file instanceof File) {
        formDataPayload.append('documents_to_create', file, file.name)
      }
    })

    // Add documents_to_delete as JSON string
    formDataPayload.append('documents_to_delete', JSON.stringify(allDocumentsToDelete))

    // Add create_meta_data as JSON string
    formDataPayload.append('create_meta_data', JSON.stringify(allCreateMetaData))

    // Add update_meta_data as JSON string
    formDataPayload.append('update_meta_data', JSON.stringify(allUpdateMetaData))

    // Add sample_inspection_criteria_id if editing
    if (formData?.sample_inspection_criteria_id) {
      formDataPayload.append('sample_inspection_criteria_id', formData.sample_inspection_criteria_id ?? null)
    }

    upsertMutation.mutate(formDataPayload, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
        router.push('/vendor-management/sample-inspection-criteria')
      },
      onError: () => showActionAlert(COMMON_CONSTANTS.FAILED_ALERT),
    })
  }

  const handleCancel = async () => {
    router.push('/vendor-management/sample-inspection-criteria')
  }

  const handleOpenModal = () => {
    setIsEditMode(false)
    setEditingSpecificationId(null)
    setSpecificationFormData({
      id: '',
      specification_id: undefined,
      specifications_title: '',
      description: '',
      status: '',
      uploaded_files: [],
      isFromApi: false, // New specification, not from API
      fileData: FINALFILEINITIALDATA,
    })
    setCurrentSpecificationFiles([])
    setCurrentSpecificationFileData({
      documents_to_create: [],
      documents_to_delete: [],
      create_meta_data: {},
      update_meta_data: {},
      local_files_to_delete: [],
    })
    setSpecificationErrors({})
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setIsEditMode(false)
    setEditingSpecificationId(null)
    setSpecificationFormData({
      id: '',
      specification_id: undefined,
      specifications_title: '',
      description: '',
      status: '',
      uploaded_files: [],
      isFromApi: false,
      fileData: FINALFILEINITIALDATA,
    })
    setCurrentSpecificationFiles([])
    setCurrentSpecificationFileData({
      documents_to_create: [],
      documents_to_delete: [],
      create_meta_data: {},
      update_meta_data: {},
      local_files_to_delete: [],
    })
    setSpecificationErrors({})
  }

  const handleFileUpload = (file: any) => {
    setCurrentSpecificationFiles((prev: any[]) => [...prev, file])
  }

  const handleFileEdit = (file: any) => {
    setCurrentSpecificationFiles((prev: any[]) =>
      prev.map((f: any) => f.id === file.id ? file : f)
    )
  }

  const handleFileSubmit = (fileData: any) => {
    setCurrentSpecificationFileData((prev: any) => mergeFinalFileData(prev, fileData))

  }

  const validateSpecificationForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!specificationFormData.specifications_title || specificationFormData.specifications_title.trim() === '') {
      newErrors.specifications_title = 'Specifications Title is required'
    }

    if (!specificationFormData.status || specificationFormData.status.trim() === '') {
      newErrors.status = 'Status is required'
    }

    setSpecificationErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSaveSpecification = () => {
    if (!validateSpecificationForm()) return

    const specificationData = {
      id: isEditMode && editingSpecificationId ? editingSpecificationId : Date.now(),
      specification_id: isEditMode && editingSpecificationId && specificationFormData.isFromApi
        ? specificationFormData.specification_id ?? editingSpecificationId
        : undefined, // Only set if from API
      specification_name: specificationFormData.specifications_title,
      description: specificationFormData.description,
      status: Number(specificationFormData.status),
      uploaded_files: [...currentSpecificationFiles],
      isFromApi: specificationFormData.isFromApi ?? false, // Preserve API flag
      fileData: { ...currentSpecificationFileData },
    }
    if (!handleDuplicateSpecificationCheck(specificationData)) return
    if (isEditMode && editingSpecificationId) {
      // Update existing specification - preserve isFromApi flag
      setSpecificationList((prev: any[]) =>
        prev.map((item: any) => {
          if (item.id === editingSpecificationId) {
            return {
              ...specificationData,
              isFromApi: item.isFromApi ?? false, // Preserve original flag
              specification_id: item.isFromApi ? (item.specification_id ?? specificationData.specification_id) : undefined,
            }
          }
          return item
        })
      )
    } else {
      // Add new specification - not from API
      const mergeSpec = [...specificationList, specificationData]
      if (!handleDuplicateSpecificationCheck(specificationData)) return
      setSpecificationList(mergeSpec)
    }

    handleCloseModal()
  }
  const handleDuplicateSpecificationCheck = (specificationFormData) => {
    const duplicateSpecification = specificationList.find((spec: any) => spec?.specification_name?.toLowerCase() === specificationFormData.specification_name?.toLowerCase() && spec?.id !== specificationFormData.id)
    if (duplicateSpecification) {
      showActionAlert('customAlert', {
        title: 'Duplicate Specification',
        text: 'Specification with this name already exists',
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
      return false
    }
    return true
  }

  const handleEditSpecification = (specification: any) => {
    setIsEditMode(true)
    setEditingSpecificationId(specification.id)
    setSpecificationFormData({
      id: specification.id,
      specification_id: specification.specification_id,
      specifications_title: specification.specification_name ?? specification.specifications_title ?? '',
      description: specification.description ?? '',
      status: specification.status?.toString() ?? '',
      uploaded_files: specification.uploaded_files ?? [],
      isFromApi: specification.isFromApi ?? false, // Track if from API
      fileData: specification.fileData ?? FINALFILEINITIALDATA,
    })
    setCurrentSpecificationFiles(specification.uploaded_files ?? [])
    setCurrentSpecificationFileData(specification.fileData ?? {
      documents_to_create: [],
      documents_to_delete: [],
      create_meta_data: {},
      update_meta_data: {},
      local_files_to_delete: [],
    })
    setSpecificationErrors({})
    setOpenModal(true)
  }

  const handleDeleteSpecification = (specification: any) => {
    showActionAlert('customAlert', {
      title: 'Delete Specification',
      text: 'Are you sure you want to delete this specification?',
      icon: 'error',
      cancelButton: true,
      confirmButton: true,
    }).then((result) => {
      handleDeleteSpec(specification, result)
    }).catch((err) => {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
    }).finally(() => {
      showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
    })
  }

  const handleDeleteSpec = (specification, result) => {
    if (result.isConfirmed) {
      setSpecificationList((prev: any[]) => {
        const updatedList = prev.map((item: any) => {
          if (item.id == specification.id) {
            return {
              ...item,
              status: NUMBERMAP.TWO
            }
          } else {
            return item
          }
        })
        return updatedList
      })
    }
  }

  const handleSpecificationChange = (field: string, value: string) => {
    setSpecificationFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for the field if it has a value
    if (value?.trim()) {
      setSpecificationErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }
  const Columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF
    },
    {
      field: 'specifications_title',
      headerName: 'Specifications Title',
      flex: NUMBERMAP.ONE
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: NUMBERMAP.TWO
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: NUMBERMAP.HALF,
      renderCell: (params) => {
        return <StatusTypography value={params.value == NUMBERMAP.TWO ? NUMBERMAP.ZERO : params.value} />
      }
    },
    {
      field: "action",
      headerName: "Action",
      flex: NUMBERMAP.HALF,
      renderCell: (params: { row: any }) => (
        <ActionButton
          deleteDisabled={params.row?.status == NUMBERMAP.TWO}
          onEdit={() => handleEditSpecification(params.row)}
          onDelete={() => handleDeleteSpecification(params.row)}
        />
      )
    }
  ]

  useEffect(() => {
    if (formData.part_no) {
      refetchByid()
    }
  }, [formData?.part_no])
  useEffect(() => {
    if (sampleInspectionCriteriaId)
      refetchByid()

  }, [])
  return (
    <FormContainer >
      <FormWrapper>
        <Label title="Sample Inspection Criteria" />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={'Part Type*'}
                placeholder={'Select Part Type'}
                isDropdown
                value={formData.part_type_id}
                onChange={(value: string) => handleInputChange('part_type_id', value)}
                error={errors.part_type_id}
                options={partCategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_TYPE.VALUE_FIELD}
                dataIsAutocomplete={formData.part_type_id}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={'Part Sub Type*'}
                placeholder={'Select Part Sub Type'}
                isDropdown
                value={formData?.part_sub_type_id}
                onChange={(value: string) => handleInputChange('part_sub_type_id', value)}
                error={errors?.part_sub_type_id}
                options={partSubcategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_TYPE.VALUE_FIELD}
                dataIsAutocomplete={formData.part_sub_type_id}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={'Part Sub Class*'}
                placeholder={'Select Part Sub Class'}
                isDropdown
                value={formData?.part_sub_class_id}
                onChange={(value: string) => handleInputChange('part_sub_class_id', value)}
                error={errors?.part_sub_class_id}
                options={partCategorySubclassesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_CLASS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_CLASS.VALUE_FIELD}
                dataIsAutocomplete={formData.part_sub_class_id}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={'Part Category Name*'}
                isDropdown
                placeholder={'Select Part Category Name'}
                value={formData?.part_category_name}
                onChange={(value: string) => {
                  handleInputChange('part_category_name', value)
                  handleInputChange('part_category_id', value)
                }}
                error={errors?.part_category_name}
                options={partCategoriesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_CATEGORY.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_CATEGORY.VALUE_FIELD}
                dataIsAutocomplete={formData.part_category_name}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={'Part Number*'}
                placeholder={'Enter Part Number'}
                value={formData?.part_no}
                onChange={(value: string) => handleInputChange('part_no', value)}
                error={errors.part_no}
                options={formData?.part_category_name ? partNumbersData?.data ?? [] : []}
                isDropdown
                keyField='id'
                valueField='part_number'
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formData.status}
                onChange={(value: string) => handleInputChange('status', value)}
                error={errors.status}
                options={statusData?.data ?? []}
                keyField={SAMPLE_INSPECTION_DROPDOWN_FIELDS.STATUS.KEY_FIELD}
                valueField={SAMPLE_INSPECTION_DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
                dataIsAutocomplete={formData.status}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                showAddButton
                onAddRow={handleOpenModal}
                title={'Specifications'}
                rows={specificationList.map((spec) => ({
                  specifications_title: spec.specification_name ?? spec.specifications_title ?? '',
                  ...spec
                }))}
                columns={Columns}
                idField="id"
                hideFooter
                autoHeight
              />
            </Grid2>
          </Grid2>
          <CommonModal
            open={openModal}
            title={isEditMode ? 'Edit Specification' : 'Add Specification'}
            onClose={handleCloseModal}
            onSave={handleSaveSpecification}
            buttonRequired
            modalMaxWidth="900px"
          >
            <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <InputField
                  label='Specifications Title*'
                  placeholder='Enter Specifications Title'
                  value={specificationFormData.specifications_title}
                  onChange={(value: string) => handleSpecificationChange('specifications_title', value)}
                  error={specificationErrors.specifications_title}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <Description
                  label='Description'
                  placeholder='Enter Description'
                  value={specificationFormData.description}
                  onChange={(value: string) => handleSpecificationChange('description', value)}
                  error={specificationErrors.description}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <InputField
                  label='Status*'
                  placeholder='Select Status'
                  isDropdown
                  options={STATUS_OPTIONS}
                  keyField='value'
                  valueField='label'
                  value={specificationFormData.status}
                  onChange={(value: string) => handleSpecificationChange('status', value)}
                  error={specificationErrors.status}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <FileUploadManager
                  initialFiles={currentSpecificationFiles}
                  onFileUpload={handleFileUpload}
                  onFileEdit={handleFileEdit}
                  onSubmit={handleFileSubmit}
                  uploadMandError={specificationErrors.uploaded_files_specification}
                />
              </Grid2>
            </Grid2>
          </CommonModal>
          <ButtonGroup
            buttons={[
              { label: BUTTON_LABELS.CANCEL, onClick: handleCancel },
              { label: BUTTON_LABELS.SAVE, onClick: handleSave },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default VendorForm


