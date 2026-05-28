'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Grid2 } from '@mui/material'
import {  useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  ActionButton,
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
  TABLE_HEADERS,
  FIELD_NAMES,
  DROPDOWN_FIELDS,
  TABLE_CONFIG,
} from '@/constants/modules/vendor-management/vendorSelectionCriteria'
import {
  FORM_LABEL,
  DROPDOWN_FIELD,
  VALIDATION_MESSAGES as INCOMING_INSPECTION_VALIDATION_MESSAGES,
} from '@/constants/modules/production/incomingInspectionCriteria'
import { 
  EmptyTableCell, 
  SnoTableCell, 
  CriteriaTableCell, 
  GridContainerWithMargin
} from '@/styles/modules/vendor-management/vendorSelectionCriteria'
import { ErrorText } from '@/styles/common'
import { DEFAULT_FORM_DATA } from '@/lib/modules/vendor-management/vendorSelectionCriteria'
import {
  FormData as VendorFormData,
  FormErrors,
} from '@/types/modules/vendor-management/vendorSelectionCriteria'

// Extend VendorFormData to include status and equipment_id for incoming inspection criteria
interface ExtendedVendorFormData extends VendorFormData {
  status?: string
  equipment_id?: string
}
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  COMMON_CONSTANTS,
  FinalFileData,
  mergeFinalFileData,
} from '@/lib/utils/common'
import VendorSelectionCriteriaTable from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable'
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types'
import IncomingInspectionCriteriaModal from './IncomingInspectionCriteriaModal'
import { usePartCategoryTypes, usePartSubcategoryTypes, usePartCategorySubclasses, usePartCategories } from '@/hooks/modules/vendor-management/useVendorSelectionCriteria'
import { useUpsertIncomingInspectionCriteria, useGetIncomingInspectionCriteriaById } from '@/hooks/modules/production/useIncomingInspectionCriteria'
import { useEquipment } from '@/hooks/modules/dnd/useInstallationProcedure'
import { useIncomingInspectionCriteriaManagement } from '@/hooks/modules/production/useIncomingInspectionCriteriaManagement'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { buildFormDataPayload } from '@/lib/modules/vendor-management/vendorSelectionCriteriaPayloadBuilder'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { CriteriaFormProps } from '@/types/modules/production/incomingInceptionCriteria'
import { transformNestedHierarchicalData } from '@/lib/modules/vendor-management/transformNestedHierarchicalData'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
/**
 * Classification : Confidential
 */

const CriteriaForm: React.FC<CriteriaFormProps> = ({ 
  partAssemblyDetailId,
  assemblyPartItemDetailId,
}) => {
  const router = useRouter()
  const incoming_inspection_criteria_id = assemblyPartItemDetailId
  const formRef = useRef<HTMLElement | null>(null)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // State for form data and errors
  const [formDataIncomingInspection, setFormDataIncomingInspection] = useState<ExtendedVendorFormData>({ ...DEFAULT_FORM_DATA, status: '', equipment_id: '' })
  const [errors, setErrors] = useState<FormErrors & { status?: string; equipment_id?: string; fileUpload?: string; criteria?: string }>({})

  // API hooks for dropdown options
  const { data: partCategoryTypesData } = usePartCategoryTypes()
  const { data: partSubcategoryTypesData } = usePartSubcategoryTypes(Number(formDataIncomingInspection.partType))
  const { data: partCategorySubclassesData } = usePartCategorySubclasses(Number(formDataIncomingInspection.partSubType))
  const { data: partCategoriesData } = usePartCategories(Number(formDataIncomingInspection.partSubClass))
  const { data: statusData } = useOrganizationStatus()
  const { data: equipmentData } = useEquipment()

  // API hook for fetching incoming inspection criteria data
  const { data: incomingInspectionCriteriaData } = useGetIncomingInspectionCriteriaById(
    incoming_inspection_criteria_id ?? NUMBERMAP.ZERO,
    !!incoming_inspection_criteria_id
  )

  // Mutation hook for posting incoming inspection criteria
  const upsertMutation = useUpsertIncomingInspectionCriteria(incoming_inspection_criteria_id ?? undefined)

  // Draft save hook
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'incoming_inspection_criteria_id',
    context_instance_id: incoming_inspection_criteria_id,
    enableFetch: false,
  })

  // State for vendor selection criteria table
  const [criteriaData, setCriteriaData] = useState<VendorCriteria[]>([])

  const handleCriteriaChange = (criteria: VendorCriteria[]) => {
    handleIncomingInspectionCriteriaDraftSave(formDataIncomingInspection, criteria)
  }

  // Use management hook for criteria operations
  const management = useIncomingInspectionCriteriaManagement(criteriaData, setCriteriaData, handleCriteriaChange)

  // Load form data if in edit mode
  useEffect(() => {
    if (!incomingInspectionCriteriaData?.data) return
    const rawData = incomingInspectionCriteriaData.data
    const apiData = Array.isArray(rawData) && rawData.length > NUMBERMAP.ZERO ? rawData[NUMBERMAP.ZERO] : rawData
    if (!apiData) return
    const formDataFromAPI: ExtendedVendorFormData = {
      partType: apiData.part_type_id?.toString(),
      partSubType: apiData.part_sub_type_id?.toString(),
      partSubClass: apiData.part_sub_class_id?.toString(),
      partCategoryName: apiData.part_category_id?.toString(),
      status: apiData.status_id?.toString() ?? '',
      equipment_id: (apiData as any).equipment_id?.toString() ?? '',
      logo: apiData.documents,
    }
    setFormDataIncomingInspection(formDataFromAPI)
  }, [incomingInspectionCriteriaData])

const transformConfig  ={
    groupIdField: 'group_id',
    groupNameField: 'group_value',
    groupOrderField: 'applicable_group_display_order',
    criteriaArrayField: 'criteria',
    childIdField: 'group_criteria_mapper_id',
    childNameField: 'sub_group_value',
    childOrderField: 'criteria_display_order',
    parentIdPrefix: 'parent_',
    childIdPrefix: 'child_',
    fieldMappings: {
      criteria: 'sub_group_value',
      requirement: 'requirement_type_name',
      requirementId: 'requirement_type',
      category: 'group_value',
      status: 'status_id',
      remarks: 'remarks',
    },
  }
  // Load criteria data from API
  useEffect(() => {
    if (!incomingInspectionCriteriaData?.data?.[NUMBERMAP.ZERO]?.criteria_details) return

    const apiCriteriaData = incomingInspectionCriteriaData.data[NUMBERMAP.ZERO].criteria_details
    const hierarchicalData = transformNestedHierarchicalData(apiCriteriaData, transformConfig)
    setCriteriaData(hierarchicalData)
  }, [incomingInspectionCriteriaData])

  // Clear criteria error when criteria are added or removed
  useEffect(() => {
    const validCriteria = criteriaData.filter(item => item.status !== NUMBERMAP.TWO)
    if (validCriteria.length > NUMBERMAP.ZERO) {
      setErrors((prev) => {
        if (prev.criteria) {
          return { ...prev, criteria: '' }
        }
        return prev
      })
    }
  }, [criteriaData])

  const handleIncomingInspectionCriteriaDraftSave = (formDataToSave: ExtendedVendorFormData, criteriaDataToSave: VendorCriteria[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = incomingInspectionCriteriaData?.data

    const incomingInspectionCriteriaDraftConfig = {
      fileFieldToSectionMap: { documents: 'documents' },
      sectionTypeToNameMap: { documents: 'documents' },
      responseDataKeyMap: { documents: 'documents' },
    }

    const incomingInspectionCriteriaDraftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: formDataToSave?.logo ?? [] },
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      incomingInspectionCriteriaDraftConfig
    )

    if (incomingInspectionCriteriaDraftPreparation.draftDocuments) {
      setDraftDocuments(incomingInspectionCriteriaDraftPreparation.draftDocuments)
    }
    if (incomingInspectionCriteriaDraftPreparation.draftDelete) {
      setDraftDelete(incomingInspectionCriteriaDraftPreparation.draftDelete ?? [])
    }

    const incomingInspectionCriteriaFieldsToRemove = ['logo']
    const incomingInspectionCriteriaFormDataObj = { ...formDataToSave }
    const cleanedIncomingInspectionCriteriaFormData = Object.fromEntries(
      Object.entries(incomingInspectionCriteriaFormDataObj).filter(([key]) => !incomingInspectionCriteriaFieldsToRemove.includes(key))
    )

    const payload = {
      id: incoming_inspection_criteria_id ?? new Date().getTime(),
      ...cleanedIncomingInspectionCriteriaFormData,
      criteria: criteriaDataToSave,
      draftDocuments: incomingInspectionCriteriaDraftPreparation.draftDocuments,
      draftDelete: incomingInspectionCriteriaDraftPreparation.draftDelete,
      type: 'draft',
    }

    draftSave({
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: incomingInspectionCriteriaDraftPreparation.createMetaData,
        update_meta_data: incomingInspectionCriteriaDraftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: incomingInspectionCriteriaDraftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const handleIncomingInspectionCriteriaInputChange = (field: string, value: string | string[]) => {
    setFormDataIncomingInspection((prev) => {
      const newIncomingInspectionCriteriaData = { ...prev, [field]: value }
      
      // Implement cascading dropdown logic for incoming inspection criteria
      if (field === FORM_FIELD_NAMES.PART_TYPE) {
        // Reset dependent fields when Part Type changes
        newIncomingInspectionCriteriaData.partSubType = ''
        newIncomingInspectionCriteriaData.partSubClass = ''
        newIncomingInspectionCriteriaData.partCategoryName = ''
      } else if (field === FORM_FIELD_NAMES.PART_SUB_TYPE) {
        // Reset dependent fields when Part Sub Type changes
        newIncomingInspectionCriteriaData.partSubClass = ''
        newIncomingInspectionCriteriaData.partCategoryName = ''
      } else if (field === FORM_FIELD_NAMES.PART_SUB_CLASS) {
        // Reset dependent fields when Part Sub Class changes
        newIncomingInspectionCriteriaData.partCategoryName = ''
      }
      
      handleIncomingInspectionCriteriaDraftSave(newIncomingInspectionCriteriaData, criteriaData)
      return newIncomingInspectionCriteriaData
    })

    // Clear error for the field if it has a value
    if (value && (typeof value === 'string' ? value.trim() : value.length > 0)) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors & { status?: string; equipment_id?: string; fileUpload?: string; criteria?: string } = {}
    let isValid = true
    const requiredFields: (keyof VendorFormData)[] = [
      'partType',
      'partSubType',
      'partSubClass',
      'partCategoryName'
    ]

    // Check each required field
    requiredFields.forEach((field) => {
      const value = formDataIncomingInspection[field]
      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === NUMBERMAP.ZERO)
      ) {
        newErrors[field] = VALIDATION_MESSAGES[field.toUpperCase() as keyof typeof VALIDATION_MESSAGES]
        isValid = false
      }
    })

    // Validate Equipment Type
    if (!formDataIncomingInspection.equipment_id || formDataIncomingInspection.equipment_id.trim() === '') {
      newErrors.equipment_id = INCOMING_INSPECTION_VALIDATION_MESSAGES.EQUIPMENT_TYPE_REQUIRED
      isValid = false
    }

    // Validate Status
    if (!formDataIncomingInspection.status || formDataIncomingInspection.status.trim() === '') {
      newErrors.status = INCOMING_INSPECTION_VALIDATION_MESSAGES.STATUS_REQUIRED
      isValid = false
    }

    // Validate File Upload
    const initialFiles = formDataIncomingInspection?.logo ?? []
    const hasInitialFiles = Array.isArray(initialFiles) && initialFiles.length > NUMBERMAP.ZERO
    const hasFilesToCreate = finalFileData?.documents_to_create && finalFileData.documents_to_create.length > NUMBERMAP.ZERO
    const hasUpdateMetaData = finalFileData?.update_meta_data && Object.keys(finalFileData.update_meta_data).length > NUMBERMAP.ZERO
    
    // Check if there are valid files (initial files not deleted, or new files to create)
    const deletedFileIds = finalFileData?.documents_to_delete ?? []
    const validInitialFiles = hasInitialFiles 
      ? initialFiles.filter((file: any) => {
          const fileId = typeof file === 'object' ? (file.file_id ?? file.id) : undefined
          return fileId && !deletedFileIds.includes(fileId)
        })
      : []
    
    const hasValidFiles = validInitialFiles.length > NUMBERMAP.ZERO || hasFilesToCreate || hasUpdateMetaData
    
    if (!hasValidFiles) {
      newErrors.fileUpload = INCOMING_INSPECTION_VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED
      isValid = false
    }

    // Validate Criteria - at least one criteria should exist
    const validCriteria = criteriaData.filter(item => item.status !== NUMBERMAP.TWO)
    if (!validCriteria || validCriteria.length === NUMBERMAP.ZERO) {
      newErrors.criteria = INCOMING_INSPECTION_VALIDATION_MESSAGES.CRITERIA_REQUIRED
      isValid = false
    }

    setErrors(newErrors)
    setShowFileValidationError(true)
    return isValid
  }

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !!incoming_inspection_criteria_id,
      draftData,
      existingData: incomingInspectionCriteriaData,
      finalFileData,
    })
  }

  const resetFormState = () => {
    setFormDataIncomingInspection({ ...DEFAULT_FORM_DATA, status: '', equipment_id: '' } as ExtendedVendorFormData);
    setErrors({});
    setFinalFileData(FINALFILEINITIALDATA);
    setCriteriaData([]);
    setDraftDocuments({});
    setDraftDelete([]);
    setShowFileValidationError(false);
  };

  const handleSave = () => {
    if (!validateForm()) return;
    clearDraftSave()
    const fileMetadata = createFileMetadata()
    const updatedFileData = {
      ...finalFileData,
      create_meta_data: fileMetadata?.create_meta_data ?? finalFileData.create_meta_data,
      update_meta_data: fileMetadata?.update_meta_data ?? finalFileData.update_meta_data,
      documents_to_delete: fileMetadata?.documents_to_delete ?? finalFileData.documents_to_delete,
    }
    const applicableSettingsId = partAssemblyDetailId
    const payload = buildFormDataPayload(incoming_inspection_criteria_id, formDataIncomingInspection, criteriaData, updatedFileData, applicableSettingsId);

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        resetFormState();
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT);
      },
      onError: () => showActionAlert(COMMON_CONSTANTS.FAILED_ALERT),
    });
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(`/production/part-assembly-settings/${partAssemblyDetailId}`)
  }

  const handleFileUpload = (newFile: File) => {
    const logo = formDataIncomingInspection?.logo ?? []
    setFormDataIncomingInspection((prev) => ({
      ...prev,
      logo: [...logo, newFile],
    }))
    // Clear file upload error when file is uploaded
    if (errors.fileUpload) {
      setErrors((prev) => ({ ...prev, fileUpload: '' }))
    }
  }

  const handleFileEdit = useCallback((documents: any) => {
    setFormDataIncomingInspection((prev) => {
      const updatedFiles = prev.logo.map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      return {
        ...prev,
        logo: updatedFiles,
      }
    })
  }, [])

  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormDataIncomingInspection((prev) => {
        const updatedDocs = (prev.logo ?? []).filter((file) => {
          let fileName: string | undefined
          if (file instanceof File) {
            fileName = file.name?.split('.')[NUMBERMAP.ZERO]
          } else {
            const fileDoc = file as FileDocument
            fileName = fileDoc?.file?.name?.split('.')[NUMBERMAP.ZERO] ?? fileDoc?.name?.split('.')[NUMBERMAP.ZERO]
          }
          return !data.local_files_to_delete.includes(fileName)
        })
        return { ...prev, logo: updatedDocs }
      })
    }
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormDataIncomingInspection((prev) => {
        const updatedDocs = (prev.logo ?? []).filter((file) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id
          return !data.documents_to_delete.includes(fileId)
        })
        return { ...prev, logo: updatedDocs }
      })
    }
  }

  // Handler for delete that uses management hook but wraps with alert
  const handleDeleteCriteria = (id: number) => {
    const alertWrapper = (status: string) =>
      showActionAlert(status as any) as Promise<{ isConfirmed: boolean }>
    management.handleDeleteIncomingCriteria(id, alertWrapper)
  }

  const customColumns: GridColDef[] = [
    {
      field: FIELD_NAMES.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowIncomingInspection = params.row as VendorCriteria;
        const isIncomingInspectionParent = rowIncomingInspection.isParent;
        
        if (!isIncomingInspectionParent) {
          return (
            <EmptyTableCell>
            </EmptyTableCell>
          );
        }
        
        // Calculate S.No. based on parent rows only, in ascending order
        const parentRowsIncomingInspection = criteriaData.filter(item => item.isParent && item.status !== NUMBERMAP.TWO);
        const parentIndexIncomingInspection = parentRowsIncomingInspection.findIndex(item => item.id === rowIncomingInspection.id);
        const sno = parentIndexIncomingInspection + NUMBERMAP.ONE;
        
        return (
          <SnoTableCell>
            {String(sno).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}
          </SnoTableCell>
        );
      },
    },
    {
      field: FIELD_NAMES.CRITERIA,
      headerName: TABLE_HEADERS.CRITERIA,
      flex: NUMBERMAP.FOUR,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria;
        const isParent = row.isParent;
        let displayLabel = params.value;
        if (isParent && row.inspectionGroupLabel) {
          displayLabel = row.inspectionGroupLabel;
        } else if (!isParent && row.criteriaLabel) {
          displayLabel = row.criteriaLabel;
        }
        return (
          <CriteriaTableCell isParent={!!isParent}>{displayLabel}</CriteriaTableCell>
        );
      },
    },
    {
      field: 'statusId', // Use string literal instead of FIELD_NAMES.STATUS
      headerName: 'Status',
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria;
        if (row.isParent) {
          return '-';
        }
        // Map numeric status value to label (find from statusData?.data)
        const statusValue = params.value;
        let label = '';
        if (statusData?.data) {
          // Try to look up by id (or whatever the key field is, e.g. status_id)
          const found = statusData.data.find((option: any) => {
            return String(option.status_id ?? option.id) === String(statusValue);
          });
          label = found ? (found.status_name ?? found.label ?? String(statusValue)) : String(statusValue);
        } else {
          label = String(statusValue);
        }
        return label;
      },
    },
    {
      field: FIELD_NAMES.ACTIONS,
      headerName: TABLE_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params:GridRenderCellParams) => {
        return (
          <ActionButton 
            onEdit={() => management.handleEditIncommingCriteria(params.row)} 
            onDelete={() => handleDeleteCriteria(params.row.id)} 
          />
        )
      },
    },
  ];
  return (
    <FormContainer ref={formRef}>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <FormContent>
          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_TYPE}
                isDropdown
                value={formDataIncomingInspection?.partType}
                onChange={(value: any) => {
                  handleIncomingInspectionCriteriaInputChange(FORM_FIELD_NAMES.PART_TYPE, value)
                }}
                error={errors.partType}
                options={partCategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_TYPE.VALUE_FIELD}
                dataIsAutocomplete={formDataIncomingInspection?.partType}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_SUB_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_SUB_TYPE}
                isDropdown
                value={formDataIncomingInspection?.partSubType}
                onChange={(value: any) => {
                  handleIncomingInspectionCriteriaInputChange(FORM_FIELD_NAMES.PART_SUB_TYPE, value)
                }}
                error={errors.partSubType}
                options={partSubcategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_TYPE.VALUE_FIELD}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_SUB_CLASS}
                placeholder={FORM_PLACEHOLDERS.PART_SUB_CLASS}
                isDropdown
                value={formDataIncomingInspection?.partSubClass}
                onChange={(value: any) => {
                  handleIncomingInspectionCriteriaInputChange(FORM_FIELD_NAMES.PART_SUB_CLASS, value)
                }}
                error={errors.partSubClass}
                options={partCategorySubclassesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_CLASS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_CLASS.VALUE_FIELD}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_CATEGORY_NAME}
                placeholder={FORM_PLACEHOLDERS.PART_CATEGORY_NAME}
                isDropdown
                value={formDataIncomingInspection?.partCategoryName}
                onChange={(value: any) => {
                  handleIncomingInspectionCriteriaInputChange(FORM_FIELD_NAMES.PART_CATEGORY_NAME, value)
                }}
                error={errors.partCategoryName}
                options={partCategoriesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_CATEGORY.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_CATEGORY.VALUE_FIELD}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label="Equipment Type(For Incoming Inspection)*"
                placeholder="Select Equipment Type"
                isDropdown
                value={formDataIncomingInspection?.equipment_id ?? ''}
                onChange={(value: any) => {
                  handleIncomingInspectionCriteriaInputChange('equipment_id', value)
                }}
                error={errors.equipment_id}
                options={equipmentData?.data ?? []}
                keyField="equipment_id"
                valueField="equipment_name"
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABEL.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formDataIncomingInspection?.status ?? ''}
                onChange={(value: any) => {
                  handleIncomingInspectionCriteriaInputChange(FORM_FIELD_NAMES.STATUS, value)
                }}
                error={errors.status}
                options={statusData?.data ?? []}
                keyField={DROPDOWN_FIELD.STATUS.KEY_FIELD}
                valueField={DROPDOWN_FIELD.STATUS.VALUE_FIELD}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <VendorSelectionCriteriaTable
                criteria={criteriaData
                  .filter(item => item.status !== NUMBERMAP.TWO)
                  .map((row, idx) => ({
                    ...row,
                    // Ensure every row has a unique id (required by MUI DataGrid)
                    id: row.id ?? `${row.vendorGroupId ?? 'vg'}-${row.sno ?? idx}`
                  }))}
                onCriteriaReorder={management.handleCriteriaReorder}
                onAddCriteria={management.handleAddIncommingCriteria}
                onEditCriteria={management.handleEditIncommingCriteria}
                onDeleteCriteria={handleDeleteCriteria}
                title="Incoming Inspection Criteria"
                showAddButton={true}
                columns={customColumns}
                groupingColumn={TABLE_CONFIG.GROUPING_COLUMN}
                parentColumn={TABLE_CONFIG.PARENT_COLUMN}
              />
              {errors.criteria && (
                <ErrorText variant="body2" color="error">
                  {errors.criteria}
                </ErrorText>
              )}
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={formDataIncomingInspection?.logo as any}
                onSubmit={(data: any) => {
                  setFinalFileData((prev) => {
                    const mergedData = mergeFinalFileData(prev, data)
                    handleIncomingInspectionCriteriaDraftSave(formDataIncomingInspection, criteriaData, mergedData)
                    return mergedData
                  })
                  handleFileRemove(data)
                  if (errors.fileUpload) {
                    setErrors((prev) => ({ ...prev, fileUpload: '' }))
                  }
                }}
                onFileEdit={handleFileEdit}
                onFileUpload={handleFileUpload as any}
                subHeader="File upload*"
                uploadMandError={errors.fileUpload}
              />
            </Grid2>
          </GridContainerWithMargin>

          <ButtonGroup
            buttons={[
              { label: BUTTON_LABELS.CANCEL, onClick: handleCancel },
              { label: BUTTON_LABELS.SAVE, onClick: handleSave },
            ]}
          />
        </FormContent>
      </FormWrapper>

      <IncomingInspectionCriteriaModal
        open={management.isModalOpen}
        onClose={management.handleIncomingModalClose}
        onSave={management.handleIncomingModalSave}
        initialData={management.getInitialIncomingModalData()}
        criteriaId={management.selectedCriteria ? (management?.selectedCriteria?.group_criteria_mapper_id ?? management?.selectedCriteria.sub_group_id ?? Number(management.selectedCriteria.id)) : undefined}
        criteriaDetails={criteriaData.filter(item => !item.isParent)}
      />
    </FormContainer>
  )
}

export default CriteriaForm
