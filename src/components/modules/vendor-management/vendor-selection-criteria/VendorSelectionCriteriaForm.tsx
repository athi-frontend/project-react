'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Grid2 } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  Label,
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
  CREATE_PAGE_TITLE,
  EDIT_PAGE_TITLE,
  CREATE,
  UI_TEXT,
  TABLE_HEADERS,
  FIELD_NAMES,
  DROPDOWN_FIELDS,
  TABLE_CONFIG,
} from '@/constants/modules/vendor-management/vendorSelectionCriteria'
import { 
  EmptyTableCell, 
  SnoTableCell, 
  CriteriaTableCell, 
  GridContainerWithMargin
} from '@/styles/modules/vendor-management/vendorSelectionCriteria'
import { DEFAULT_FORM_DATA } from '@/lib/modules/vendor-management/vendorSelectionCriteria'
import {
  FormData as VendorFormData,
  FormErrors,
} from '@/types/modules/vendor-management/vendorSelectionCriteria'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  COMMON_CONSTANTS,
  FinalFileData,
  mergeFinalFileData,
} from '@/lib/utils/common'
import VendorSelectionCriteriaModal from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaModal'
import { usePartCategoryTypes, usePartSubcategoryTypes, usePartCategorySubclasses, usePartCategories, useVendorSelectionCriteriaById, usePostVendorSelectionCriteria, useVendorSelectionCriteriaGroupsAll } from '@/hooks/modules/vendor-management/useVendorSelectionCriteria'
import { useVendorSelectionCriteriaManagement } from '@/hooks/modules/vendor-management/useVendorSelectionCriteriaManagement'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { buildFormDataPayload } from '@/lib/modules/vendor-management/vendorSelectionCriteriaPayloadBuilder'
import { transformNestedHierarchicalData, NestedTransformConfig } from '@/lib/modules/vendor-management/transformNestedHierarchicalData'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types'
import VendorSelectionCriteriaCommonTable from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaCommonTable'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'

/**
 * Classification : Confidential
 **/

const VendorSelectionCriteriaForm: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const paramId = params?.vendor_criteria_id
  const projectId = params?.id
  const isAddMode = paramId === CREATE
  const vendorSelectionCriteriaId = isAddMode || !paramId || Number.isNaN(Number(paramId)) ? null : Number(paramId)
  const formRef = useRef<HTMLElement | null>(null)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  // State for form data and errors
  const [formData, setFormData] = useState<VendorFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // API hooks for dropdown options
  const { data: partCategoryTypesData } = usePartCategoryTypes()
  const { data: partSubcategoryTypesData } = usePartSubcategoryTypes(Number(formData.partType))
  const { data: partCategorySubclassesData } = usePartCategorySubclasses(Number(formData.partSubType))
  const { data: partCategoriesData } = usePartCategories(Number(formData.partSubClass))
  const { data: statusData } = useOrganizationStatus()
  // API hook for fetching vendor selection criteria data (edit mode)
  const { data: vendorSelectionCriteriaData,refetch:vendorSelectionCriteriaRefetch } = useVendorSelectionCriteriaById(vendorSelectionCriteriaId ?? NUMBERMAP.ZERO)

  // API hook for fetching prefill groups data (create mode)
  const { data: prefillGroupsData } = useVendorSelectionCriteriaGroupsAll(isAddMode)

  // Mutation hook for posting vendor selection criteria
  const upsertMutation = usePostVendorSelectionCriteria(vendorSelectionCriteriaId ?? NUMBERMAP.ZERO)

  // Draft save hook
  const vendorSelectionCriteriaIdForDraft = isAddMode ? null : vendorSelectionCriteriaId
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: "vendor_selection_criteria_id",
    context_instance_id: vendorSelectionCriteriaIdForDraft,
    enableFetch: false
  })

  // State for vendor selection criteria table
  const [criteriaData, setCriteriaData] = useState<VendorCriteria[]>([])
  const handleCriteriaChange = (criteria: VendorCriteria[]) => {
    handleDraftSave(formData, criteria)
  }
  // Use management hook for criteria operations
  const management = useVendorSelectionCriteriaManagement(criteriaData, setCriteriaData, handleCriteriaChange)

  // Transform config for nested API structure
  const transformConfig: NestedTransformConfig = useMemo(() => ({
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
      status: 'status',
      remarks: 'remarks',
    },
  }), [])

  const loadDraftData = (data: any) => {
    setFormData({
      ...data,
      status_id: data.status_id ?? null,
      logo: [...(data?.draftDocuments?.logo ?? []), ...(data?.documents ?? data?.logo ?? [])],
    })
    if (data.criteria_details || data.criteria) {
      setCriteriaData(data.criteria_details ?? data.criteria ?? [])
      
    }
  }

  // Load form data if in edit mode
  useEffect(() => {
    if (!isAddMode && vendorSelectionCriteriaData?.data) {
      const apiData = vendorSelectionCriteriaData.data?.length > NUMBERMAP.ZERO ? vendorSelectionCriteriaData.data[NUMBERMAP.ZERO] : vendorSelectionCriteriaData?.data
      if (apiData?.type === 'draft') {
        loadDraftData(apiData)
      } else {
        const formDataFromAPI: VendorFormData = {
          partType: apiData.part_type_id?.toString(),
          partSubType: apiData.part_sub_type_id?.toString(),
          partSubClass: apiData.part_sub_class_id?.toString(),
          partCategoryName: apiData.part_category_id?.toString(),
          status_id: apiData.status ?? null,
          logo: apiData.documents,
        }
        setFormData(formDataFromAPI)
      }
    }
  }, [vendorSelectionCriteriaData])

  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data)
    }
  }, [draftData])

  useEffect(() => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setFinalFileData(FINALFILEINITIALDATA)
    setCriteriaData([])
    setDraftDocuments({})
    setDraftDelete([])
    if (!isAddMode){
      vendorSelectionCriteriaRefetch()
    }else{
      fetchDraft()
    }
  }, [paramId])

  // Load criteria data from API - new nested structure (edit mode)
  useEffect(() => {
    if (isAddMode) return // Skip in create mode, handled by prefill effect
    
    if (!vendorSelectionCriteriaData?.data?.[NUMBERMAP.ZERO]?.criteria_details) return

    const apiCriteriaData = vendorSelectionCriteriaData.data[NUMBERMAP.ZERO].criteria_details
    
    // Check if data is in new nested structure (array of groups with criteria arrays)
    // The new structure has groups with a 'criteria' array property
    if (Array.isArray(apiCriteriaData) && apiCriteriaData.length > NUMBERMAP.ZERO && apiCriteriaData[NUMBERMAP.ZERO]?.criteria) {
      // New nested structure
      const hierarchicalData = transformNestedHierarchicalData(apiCriteriaData, transformConfig)
      setCriteriaData(hierarchicalData)
    } else {
      // Fallback: if data is still in old flat structure, we need to handle it differently
      // For now, try to transform it - if it fails, the old utilities can be used
      try {
        const hierarchicalData = transformNestedHierarchicalData(apiCriteriaData, transformConfig)
        setCriteriaData(hierarchicalData)
      } catch (error) {
        // If transformation fails, data might be in old format
        // You may need to use old utilities here for backward compatibility
        console.warn('Failed to transform criteria data, might be in old format:', error)
      }
    }
  }, [isAddMode, vendorSelectionCriteriaData, transformConfig])

  // Load prefill criteria data from API (create mode)
  useEffect(() => {
    if (!isAddMode) return // Only in create mode
    if (!prefillGroupsData?.data) return

    const apiCriteriaData = prefillGroupsData.data
    
    // Check if data is in new nested structure (array of groups with criteria arrays)
    if (Array.isArray(apiCriteriaData) && apiCriteriaData.length > 0) {
      // Check if it has the nested structure with 'criteria' array
      if ((apiCriteriaData[0])?.criteria) {
        // New nested structure
        const hierarchicalData = transformNestedHierarchicalData(apiCriteriaData, transformConfig)
        setCriteriaData(hierarchicalData)
      } else {
        // Try to transform it anyway
        try {
          const hierarchicalData = transformNestedHierarchicalData(apiCriteriaData, transformConfig)
          setCriteriaData(hierarchicalData)
        } catch (error) {
          console.warn('Failed to transform prefill criteria data:', error)
        }
      }
    }
  }, [isAddMode, prefillGroupsData, transformConfig])

  const handleDraftSave =(formDataToSave: VendorFormData, criteriaDataToSave: VendorCriteria[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = !isAddMode ? draftData?.data : vendorSelectionCriteriaData?.data
    
    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }
    
    const draftPreparation = prepareDraftDocumentsGeneric(
     draftDocuments,
     draftDelete,
    { ...formDataToSave},
    { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
    draftDatas,
    draftConfig
    )
    const fieldsToRemove = ['logo']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    )

    const payload = {
      id: vendorSelectionCriteriaIdForDraft ?? new Date().getTime(),
      ...cleaned,
      criteria: criteriaDataToSave,
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      
      // Implement cascading dropdown logic
      if (field === FORM_FIELD_NAMES.PART_TYPE) {
        // Reset dependent fields when Part Type changes
        newData.partSubType = ''
        newData.partSubClass = ''
        newData.partCategoryName = ''
      } else if (field === FORM_FIELD_NAMES.PART_SUB_TYPE) {
        // Reset dependent fields when Part Sub Type changes
        newData.partSubClass = ''
        newData.partCategoryName = ''
      } else if (field === FORM_FIELD_NAMES.PART_SUB_CLASS) {
        // Reset dependent fields when Part Sub Class changes
        newData.partCategoryName = ''
      }
      
      handleDraftSave(newData, criteriaData)
      return newData
    })

    // Clear error for the field if it has a value
    if (value && (typeof value === 'string' ? value.trim() : value.length > 0)) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true
    const requiredFields: (keyof VendorFormData)[] = [
      'partType',
      'partSubType',
      'partSubClass',
      'partCategoryName'
    ]

    // Check each required field
    requiredFields.forEach((field) => {
      const value = formData[field]
      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === NUMBERMAP.ZERO)
      ) {
        newErrors[field] = VALIDATION_MESSAGES[field.toUpperCase() as keyof typeof VALIDATION_MESSAGES]
        isValid = false
      }
    })

    // Validate Status
    if (!formData.status_id) {
      newErrors.status = VALIDATION_MESSAGES.STATUS
      isValid = false
    }

    const hasDocuments = formData.logo && formData.logo.length > NUMBERMAP.ZERO
    if (!hasDocuments) {
      newErrors.logo = VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED
      isValid = false
    }

    setErrors(newErrors)

    // Show file validation error when save is clicked
    return isValid
  }


  const resetFormState = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setFinalFileData(FINALFILEINITIALDATA);
    setCriteriaData([]);
  };

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !isAddMode,
      draftData,
      existingData: vendorSelectionCriteriaData,
      finalFileData,
    })
  }

  const handleSave = () => {
    if (!validateForm()) return;
    clearDraftSave()
    // Prepare file metadata using createFileMetadata function
    const fileMetadata = createFileMetadata()
    const updatedFileData = {
      ...finalFileData,
      create_meta_data: fileMetadata.create_meta_data,
      update_meta_data: fileMetadata.update_meta_data,
      documents_to_delete: fileMetadata.documents_to_delete,
    }
    
    const payload = buildFormDataPayload(vendorSelectionCriteriaId, formData, criteriaData, updatedFileData);

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        resetFormState();
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT);
        router.push(`/production/vendor-selection-criteria/${projectId}`);
      },
      onError: () => showActionAlert(COMMON_CONSTANTS.FAILED_ALERT),
    });
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(`/production/vendor-selection-criteria/${projectId}`)
  }

  const handleFileUpload = (newFile: File) => {
    const logo = formData?.logo ?? []
    setFormData((prev) => {
      const updated = {
        ...prev,
        logo: [...logo, newFile],
      }
      return updated
    })
    // Clear error when file is uploaded (following clinical-evaluation pattern)
    setErrors((prev) => ({
      ...prev,
      logo: '',
    }))
  }

  const handleFileEdit = useCallback((documents: any) => {
    setFormData((prev) => {
      const updatedFiles = prev.logo.map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      const updated = {
        ...prev,
        logo: updatedFiles,
      }
      return updated
    })
  }, [criteriaData])

  // Handle file removal (following clinical-evaluation pattern)
  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.logo ?? []).filter((file) => {
          let fileName: string | undefined
          if (file instanceof File) {
            fileName = file.name?.split('.')[NUMBERMAP.ZERO]
          } else {
            const fileDoc = file
            fileName = fileDoc?.file?.name?.split('.')[NUMBERMAP.ZERO] ?? fileDoc?.name?.split('.')[NUMBERMAP.ZERO]
          }
          return !data.local_files_to_delete.includes(fileName);
        });
        return {
          ...prev,
          logo: updatedDocs,
        };
      });
    }
   
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.logo ?? []).filter((file) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id;
          return !data.documents_to_delete.includes(fileId);
        });
        return {
          ...prev,
          logo: updatedDocs,
        };
      });
    }
  }

  // Handler for delete that uses management hook but wraps with alert
  const handleDeleteCriteria = (id: number) => {
    const alertWrapper = (status: string) => 
      showActionAlert(status as any) as Promise<{ isConfirmed: boolean }>;
    
    management.handleDeleteCriteria(id, alertWrapper);
  
  };



  const customColumns: GridColDef[] = [
    {
      field: FIELD_NAMES.SNO,
      headerName: TABLE_HEADERS.SNO,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria;
        const isParent = row.isParent;
        
        if (!isParent) {
          return (
            <EmptyTableCell>
            </EmptyTableCell>
          );
        }
        
        // Calculate S.No. based on parent rows only, in ascending order
        const parentRows = criteriaData.filter(item => item.isParent && item.status !== NUMBERMAP.TWO);
        const parentIndex = parentRows.findIndex(item => item.id === row.id);
        const sno = parentIndex + NUMBERMAP.ONE;
        
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
      flex: NUMBERMAP.THREE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria;
        const isParent = row.isParent;
        
        return (
          <CriteriaTableCell isParent={isParent ?? false}>
            {params.value}
          </CriteriaTableCell>
        );
      },
    },
    {
      field: FIELD_NAMES.REQUIREMENT,
      headerName: TABLE_HEADERS.REQUIREMENT,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
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
            disabled={params?.row?.type == "system_defined"}
            onEdit={() => management.handleEditCriteria(params.row)} 
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
        <Label title={isAddMode ? CREATE_PAGE_TITLE : EDIT_PAGE_TITLE} />
        <FormContent>
          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_TYPE}
                isDropdown
                value={formData?.partType}
                onChange={(value: any) => {
                  handleInputChange(FORM_FIELD_NAMES.PART_TYPE, value)
                }}
                error={errors.partType}
                options={partCategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_TYPE.VALUE_FIELD}
                dataIsAutocomplete={formData?.partType}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_SUB_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_SUB_TYPE}
                isDropdown
                value={formData?.partSubType}
                onChange={(value: any) => {
                  handleInputChange(FORM_FIELD_NAMES.PART_SUB_TYPE, value)
                }}
                error={errors.partSubType}
                options={partSubcategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_TYPE.VALUE_FIELD}
                dataIsAutocomplete={formData?.partSubType}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_SUB_CLASS}
                placeholder={FORM_PLACEHOLDERS.PART_SUB_CLASS}
                isDropdown
                value={formData?.partSubClass}
                onChange={(value: any) => {
                  handleInputChange(FORM_FIELD_NAMES.PART_SUB_CLASS, value)
                }}
                error={errors.partSubClass}
                options={partCategorySubclassesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_CLASS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_CLASS.VALUE_FIELD}
                dataIsAutocomplete={formData?.partSubClass}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PART_CATEGORY_NAME}
                placeholder={FORM_PLACEHOLDERS.PART_CATEGORY_NAME}
                isDropdown
                value={formData?.partCategoryName}
                onChange={(value: any) => {
                  handleInputChange(FORM_FIELD_NAMES.PART_CATEGORY_NAME, value)
                }}
                error={errors.partCategoryName}
                options={partCategoriesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_CATEGORY.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_CATEGORY.VALUE_FIELD}
                dataIsAutocomplete={formData?.partCategoryName}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formData.status_id?.toString() ?? null}
                onChange={(value: any) => {
                  setFormData((prev) => {
                    const newData = { ...prev, status_id: value ? Number(value) : null }
                    handleDraftSave(newData, criteriaData)
                    return newData
                  })
                  if (value) {
                    setErrors((prev) => ({ ...prev, status: '' }))
                  }
                }}
                error={errors.status}
                options={statusData?.data ?? []}
                keyField={DROPDOWN_FIELDS.STATUS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
                dataIsAutocomplete={formData.status_id?.toString()}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <VendorSelectionCriteriaCommonTable
                criteria={criteriaData.filter(item => item.status !== NUMBERMAP.TWO)}
                onCriteriaReorder={management.handleCriteriaReorder}
                onAddCriteria={management.handleAddCriteria}
                onEditCriteria={management.handleEditCriteria}
                onDeleteCriteria={handleDeleteCriteria}
                title={UI_TEXT.VENDOR_SELECTION_CRITERIA_TITLE}
                showAddButton={true}
                columns={customColumns}
                groupingColumn={TABLE_CONFIG.GROUPING_COLUMN}
                parentColumn={TABLE_CONFIG.PARENT_COLUMN}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={formData?.logo as any}
                onSubmit={(data: any) => {
                  setFinalFileData((prev) => {
                    const mergedData = mergeFinalFileData(prev, data)
                    handleDraftSave(formData, criteriaData, mergedData)
                    return mergedData
                  })
                  handleFileRemove(data)
                }}
                onFileEdit={handleFileEdit}
                onFileUpload={handleFileUpload as any}
                subHeader={UI_TEXT.FILE_UPLOAD_SUBHEADER}
                uploadMandError={errors.logo}
              />
            </Grid2>
          </GridContainerWithMargin>

          <ButtonGroup
            buttons={[
              { label: BUTTON_LABELS.CANCEL, onClick: handleCancel, disabled: upsertMutation.isPending },
              { label: BUTTON_LABELS.SAVE, onClick: handleSave, disabled: upsertMutation.isPending },
            ]}
          />
        </FormContent>
      </FormWrapper>

      {/* Vendor Selection Criteria Modal */}
      <VendorSelectionCriteriaModal
        open={management.isModalOpen}
        onClose={management.handleModalClose}
        onSave={management.handleModalSave}
        initialData={management.getInitialModalData()}
        criteriaId={Number(management.selectedCriteria?.id)}
      />
    </FormContainer>
  )
}

export default VendorSelectionCriteriaForm;