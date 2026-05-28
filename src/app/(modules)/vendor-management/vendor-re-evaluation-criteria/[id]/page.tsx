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
  RE_EVALUATION_FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  RE_EVALUATION_VALIDATION_MESSAGES,
  RE_EVALUATION_CREATE_PAGE_TITLE,
  RE_EVALUATION_EDIT_PAGE_TITLE,
  CREATE,
  RE_EVALUATION_UI_TEXT,
  TABLE_HEADERS,
  RE_EVALUATION_PATHS,
  FIELD_NAMES,
  DROPDOWN_FIELDS,
  TABLE_CONFIG,
  RE_EVALUATION_DROPDOWN_FIELD_CONFIG,
  RE_EVALUATION_DATA_SOURCE_NAME,
} from '@/constants/modules/vendor-management/vendorReEvaluationCriteria'
import { DEFAULT_FORM_DATA } from '@/lib/modules/vendor-management/vendorReEvaluationCriteria'
import {
  FormData as VendorFormData,
  FormErrors,
} from '@/types/modules/vendor-management/vendorReEvaluationCriteria'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  COMMON_CONSTANTS,
  FinalFileData,
  mapDocumentsByCategory,
  mapFileResponse,
  mergeFinalFileData,
} from '@/lib/utils/common'
import VendorReEvaluationCriteriaTable, { VendorReEvaluationCriteria } from '@/components/modules/vendor-management/vendor-re-evaluation-criteria/VendorReEvaluationCriteriaTable'
import VendorReEvaluationCriteriaModal from '@/components/modules/vendor-management/vendor-re-evaluation-criteria/VendorReEvaluationCriteriaModal'
import {
  useVendorReEvaluationCriteriaById,
  usePostVendorReEvaluationCriteria,
  useReEvaluationRequirements
} from '@/hooks/modules/vendor-management/useVendorReEvaluationCriteria'
import {
  usePartCategoryTypes,
  usePartSubcategoryTypes,
  usePartCategorySubclasses
} from '@/hooks/modules/vendor-management/usePartCategory'
import { usePartCategories } from '@/hooks/modules/vendor-management/useVendorSelectionCriteria'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useVendorReEvaluationCriteriaManagement } from '@/hooks/modules/vendor-management/useVendorReEvaluationCriteriaManagement'
import { buildReEvaluationHierarchicalData } from '@/lib/modules/vendor-management/vendorReEvaluationCriteriaUtils'
import { buildReEvaluationFormDataPayload } from '@/lib/modules/vendor-management/vendorReEvaluationCriteriaPayloadBuilder'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { GridContainerWithMargin, SnoTableCell, EmptyTableCell } from '@/styles/modules/vendor-management/vendorSelectionCriteria'
import { CriteriaTableCell } from '@/styles/modules/vendor-management/vendorReEvaluationCriteria'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import StatusTypography from '@/components/ui/status/ToggleStatus'

/**
 * Classification : Confidential
 **/

const VendorReEvaluationCriteriaForm: React.FC = () => {
  const router = useRouter()
  const paramId = useParams().id
  const isAddMode = paramId === CREATE
  const vendorReEvaluationCriteriaId = isAddMode || !paramId || Number.isNaN(Number(paramId)) ? null : Number(paramId)
  const formRef = useRef<HTMLElement | null>(null)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)

  // State for form data and errors
  const [formData, setFormData] = useState<VendorFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // API hooks for dropdown options
  const { data: partCategoryTypesData } = usePartCategoryTypes()
  const { data: partSubcategoryTypesData } = usePartSubcategoryTypes(formData.partType ? Number(formData.partType) : null)
  const { data: partCategorySubclassesData } = usePartCategorySubclasses(formData.partSubType ? Number(formData.partSubType) : null)
  const { data: partCategoriesData } = usePartCategories(formData.partSubClass ? Number(formData.partSubClass) : undefined)
  const { data: requirementsData } = useReEvaluationRequirements()
  const { data: statusData } = useOrganizationStatus()

  // API hook for fetching vendor re-evaluation criteria data
  const { data: vendorReEvaluationCriteriaData, refetch: vendorReEvaluationCriteriaRefetch } = useVendorReEvaluationCriteriaById(vendorReEvaluationCriteriaId ?? NUMBERMAP.ZERO)

  // Mutation hook for posting vendor re-evaluation criteria
  const upsertMutation = usePostVendorReEvaluationCriteria(vendorReEvaluationCriteriaId ?? NUMBERMAP.ZERO)

  // Draft save hook
  const vendorReEvaluationCriteriaIdForDraft = isAddMode ? null : vendorReEvaluationCriteriaId
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'vendor_re_evaluation_criteria',
    context_instance_id: vendorReEvaluationCriteriaIdForDraft,
    enableFetch: false
  })

  // State for vendor re-evaluation criteria table
  const [criteriaData, setCriteriaData] = useState<VendorReEvaluationCriteria[]>([])

  const handleCriteriaChange = (criteria: VendorReEvaluationCriteria[]) => {
    handleDraftSave(formData, criteria)
  }
  // Use management hook for criteria operations
  const management = useVendorReEvaluationCriteriaManagement(criteriaData, setCriteriaData, handleCriteriaChange)

  const loadDraftData = (data: any) => {
    if (data?.documents) {
      data.documents = mapFileResponse(data.documents ?? []);
      data.draftDocuments = mapDocumentsByCategory(data?.draftDocuments ?? {});
    }
    
    setFormData({
      ...data,
      logo: [...(data?.draftDocuments?.documents ?? []), ...(data?.documents ?? data?.logo ?? [])],
    })
    setDraftDelete(data?.draftDelete)
    setDraftDocuments(data?.draftDocuments)
    if (data.criteria_details || data.criteria) {
      const apiCriteriaData = data.criteria_details ?? data.criteria ?? []
      setCriteriaData(apiCriteriaData)
    }
  }

  // Load form data if in edit mode
  useEffect(() => {
    if (!isAddMode && vendorReEvaluationCriteriaData?.data) {
      const apiData = vendorReEvaluationCriteriaData.data?.length > NUMBERMAP.ZERO ? vendorReEvaluationCriteriaData.data[NUMBERMAP.ZERO] : vendorReEvaluationCriteriaData?.data
      if (apiData?.type === 'draft') {
        loadDraftData(apiData)
      } else {
        const formDataFromAPI: VendorFormData = {
          partType: apiData.part_type_id?.toString() ?? '',
          partSubType: apiData.part_subtype_id?.toString() ?? '',
          partSubClass: apiData.part_subclass_id?.toString() ?? '',
          partCategoryName: apiData.part_category_id?.toString() ?? '',
          status: apiData.status_id?.toString() ?? '',
          logo: apiData.supporting_files ?? [],
        }
        setFormData(formDataFromAPI)
      }
    }
  }, [vendorReEvaluationCriteriaData])

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
    if (!isAddMode) {
      vendorReEvaluationCriteriaRefetch()
    } else {
      fetchDraft()
    }
  }, [paramId])

  // Load criteria data from API
  useEffect(() => {
    if (!vendorReEvaluationCriteriaData?.data?.[NUMBERMAP.ZERO]?.criteria_details) return

    const apiCriteriaData = vendorReEvaluationCriteriaData.data[NUMBERMAP.ZERO].criteria_details

    // Create requirement map from requirements data
    const requirementMap = new Map<number, string>()
    if (requirementsData?.data) {
      requirementsData.data.forEach((req: any) => {
        requirementMap.set(req.ref_id, req.requirement_type ?? '')
      })
    }

    const hierarchicalData = buildReEvaluationHierarchicalData(apiCriteriaData, requirementMap)

    setCriteriaData(hierarchicalData)

  }, [vendorReEvaluationCriteriaData, requirementsData])

  const handleDraftSave = (formDataToSave: VendorFormData, criteriaDataToSave: VendorReEvaluationCriteria[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = !isAddMode ? draftData : vendorReEvaluationCriteriaData
    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: formDataToSave?.logo ?? [] },
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {

      setDraftDelete(draftPreparation.draftDelete ?? [])
    }
    const fieldsToRemove = ['logo']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    )
    const payload = {
      id: vendorReEvaluationCriteriaIdForDraft ?? new Date().getTime(),
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

  const handleReEvaluationInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Implement cascading dropdown logic - define dependent fields to reset
      const fieldDependencies: Record<string, (keyof VendorFormData)[]> = {
        [FORM_FIELD_NAMES.PART_TYPE]: ['partSubType', 'partSubClass', 'partCategoryName'],
        [FORM_FIELD_NAMES.PART_SUB_TYPE]: ['partSubClass', 'partCategoryName'],
        [FORM_FIELD_NAMES.PART_SUB_CLASS]: ['partCategoryName'],
      }

      // Reset dependent fields based on the changed field
      const fieldsToReset = fieldDependencies[field]
      if (fieldsToReset) {
        fieldsToReset.forEach((dependentField) => {
          newData[dependentField] = ''
        })
      }

      handleDraftSave(newData, criteriaData)
      return newData
    })

    // Clear error for the field if it has a value
    if (value && (typeof value === 'string' ? value.trim() : value.length > 0)) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Validate re-evaluation criteria form fields
  const validateReEvaluationForm = (): boolean => {
    const newErrors: FormErrors = {}
    // Required fields for vendor re-evaluation criteria form
    const requiredFields: (keyof VendorFormData)[] = [
      'partType',
      'partSubType',
      'partSubClass',
      'partCategoryName',
      'status'
    ]

    // Validate each required field for re-evaluation criteria
    requiredFields.forEach((field) => {
      const fieldValue = formData[field]
      const isEmpty =
        !fieldValue ||
        (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
        (Array.isArray(fieldValue) && fieldValue.length === NUMBERMAP.ZERO)

      if (isEmpty) {
        newErrors[field] = RE_EVALUATION_VALIDATION_MESSAGES[field.toUpperCase() as keyof typeof RE_EVALUATION_VALIDATION_MESSAGES]
      }
    })

    setErrors(newErrors)
    // Return true if no validation errors found for re-evaluation form
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const resetReEvaluationFormState = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setFinalFileData(FINALFILEINITIALDATA);
    setCriteriaData([]);
  };

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !isAddMode,
      draftData: isAddMode ? draftData : vendorReEvaluationCriteriaData,
      existingData: vendorReEvaluationCriteriaData,
      finalFileData,
      dataPath: 'supporting_files',
    })
  }

  const handleReEvaluationSave = () => {
    if (!validateReEvaluationForm()) return;
    clearDraftSave()
    // Prepare file metadata using createFileMetadata function
    const fileMetadata = createFileMetadata()
    const updatedFileData = {
      ...finalFileData,
      create_meta_data: fileMetadata.create_meta_data,
      update_meta_data: fileMetadata.update_meta_data,
      documents_to_delete: fileMetadata.documents_to_delete,
    }

    const payload = buildReEvaluationFormDataPayload(isAddMode, vendorReEvaluationCriteriaId, formData, criteriaData, updatedFileData);

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        resetReEvaluationFormState();
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT);
        router.push(RE_EVALUATION_PATHS.VENDOR_RE_EVALUATION_CRITERIA_LIST);
      },
      onError: () => showActionAlert(COMMON_CONSTANTS.FAILED_ALERT),
    });
  };

  const handleReEvaluationCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(RE_EVALUATION_PATHS.VENDOR_RE_EVALUATION_CRITERIA_LIST)
  }

  const handleReEvaluationFileUpload = (newFile: File) => {
    const logo = formData?.logo ?? []
    setFormData((prev) => {
      const updated = {
        ...prev,
        logo: [...logo, newFile],
      }
      return updated
    })
  }

  const handleReEvaluationFileEdit = useCallback((documents: any) => {
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

  const removeCriteriaFromState = (id) =>{
    management.handleDeleteReEvaluationCriteria(id);
  }
  // Handler for delete that uses management hook but wraps with alert
  const handleDeleteCriteria = (id: number | string) => {
    showActionAlert(COMMON_CONSTANTS.DELETE_ALERT).then((result) => {
      if (!result.isConfirmed) return;
      removeCriteriaFromState(id)
    });
  };

  // Column definitions for re-evaluation criteria data grid
  const reEvaluationCustomColumns: GridColDef[] = [
    {
      field: FIELD_NAMES.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowData = params.row as VendorReEvaluationCriteria;
        const isParentRow = rowData.isParent;

        // Skip serial number for child rows in re-evaluation criteria
        if (!isParentRow) {
          return <EmptyTableCell />;
        }

        // Calculate serial number for parent rows in re-evaluation criteria table
        const activeParentRows = criteriaData.filter(
          item => item.isParent
        );
        const currentParentIndex = activeParentRows.findIndex(item => item.id === rowData.id);
        const serialNumber = currentParentIndex + NUMBERMAP.ONE;

        return (
          <SnoTableCell>
            {String(serialNumber)}
          </SnoTableCell>
        );
      },
    },
    {
      field: FIELD_NAMES.CRITERIA,
      headerName: TABLE_HEADERS.CRITERIA,
      flex: NUMBERMAP.TWO,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowData = params.row as VendorReEvaluationCriteria;
        const isParentRow = rowData.isParent;

        // Style criteria cell for re-evaluation with parent/child distinction
        return (
          <CriteriaTableCell isParent={isParentRow ?? false}>
            {params.value}
          </CriteriaTableCell>
        );
      },
    },
    {
      field: FIELD_NAMES.REQUIREMENT,
      headerName: TABLE_HEADERS.REQUIREMENT,
      flex: NUMBERMAP.ONE_HALF,
      sortable: false,
      filterable: false,
    },
     {
      field:'status',
      headerName: 'Status',
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowData = params.row as VendorReEvaluationCriteria;
        const isParentRow = rowData.isParent;

        // Style criteria cell for re-evaluation with parent/child distinction
        if(isParentRow){
          return '-'
        }
        return (
         <StatusTypography value={params.value} />
        );
      },
    },
    {
      field: FIELD_NAMES.ACTIONS,
      headerName: TABLE_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowData = params.row as VendorReEvaluationCriteria;
        // Disable delete when row status is inactive (not equal to 1)
        const isRowStatusInactive = !rowData.status || rowData.status !== NUMBERMAP.ONE;
        return (
          <ActionButton
            onEdit={() => management.handleEditReEvaluationCriteria(rowData)}
            onDelete={() => handleDeleteCriteria(rowData.id)}
            deleteDisabled={isRowStatusInactive}
          />
        );
      },
    },
  ];


  return (
    <FormContainer ref={formRef}>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Label title={isAddMode ? RE_EVALUATION_CREATE_PAGE_TITLE : RE_EVALUATION_EDIT_PAGE_TITLE} />
        <FormContent>
          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={RE_EVALUATION_FORM_LABELS.PART_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_TYPE}
                isDropdown
                value={formData?.partType}
                onChange={(value: any) => {
                  handleReEvaluationInputChange(FORM_FIELD_NAMES.PART_TYPE, value)
                }}
                error={errors.partType}
                options={partCategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_TYPE.VALUE_FIELD}
              />
            </Grid2>
            {/* Part Sub Type field for re-evaluation criteria */}
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={RE_EVALUATION_FORM_LABELS.PART_SUB_TYPE}
                placeholder={FORM_PLACEHOLDERS.PART_SUB_TYPE}
                isDropdown
                value={formData?.partSubType}
                onChange={(value: any) => {
                  handleReEvaluationInputChange(FORM_FIELD_NAMES.PART_SUB_TYPE, value)
                }}
                error={errors.partSubType}
                options={partSubcategoryTypesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_TYPE.VALUE_FIELD}
              />
            </Grid2>
          </GridContainerWithMargin>

          {/* Part Sub Class and Part Category Name fields for re-evaluation criteria */}
          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={RE_EVALUATION_FORM_LABELS.PART_SUB_CLASS}
                placeholder={FORM_PLACEHOLDERS.PART_SUB_CLASS}
                isDropdown
                value={formData?.partSubClass}
                onChange={(value: any) => {
                  handleReEvaluationInputChange(FORM_FIELD_NAMES.PART_SUB_CLASS, value)
                }}
                error={errors.partSubClass}
                options={partCategorySubclassesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_SUB_CLASS.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_SUB_CLASS.VALUE_FIELD}
              />
            </Grid2>
            {/* Part Category Name field for re-evaluation criteria */}
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={RE_EVALUATION_FORM_LABELS.PART_CATEGORY_NAME}
                placeholder={FORM_PLACEHOLDERS.PART_CATEGORY_NAME}
                isDropdown
                value={formData?.partCategoryName}
                onChange={(value: any) => {
                  handleReEvaluationInputChange(FORM_FIELD_NAMES.PART_CATEGORY_NAME, value)
                }}
                error={errors.partCategoryName}
                options={partCategoriesData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PART_CATEGORY.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PART_CATEGORY.VALUE_FIELD}
              />
            </Grid2>
          </GridContainerWithMargin>

          {/* Status field for re-evaluation criteria */}
          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={RE_EVALUATION_FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formData?.status}
                onChange={(value: any) => {
                  handleReEvaluationInputChange(FORM_FIELD_NAMES.STATUS, value)
                }}
                error={errors.status}
                options={statusData?.data ?? []}
                keyField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.STATUS.KEY_FIELD}
                valueField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.STATUS.VALUE_FIELD}
                dataSourceName={RE_EVALUATION_DATA_SOURCE_NAME}
                dataFieldName={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.STATUS.DATA_FIELD_NAME}
                dataIsAutocomplete={formData.status}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <VendorReEvaluationCriteriaTable
                criteria={criteriaData}
                onCriteriaReorder={management.handleReEvaluationCriteriaReorder}
                onAddCriteria={management.handleAddReEvaluationCriteria}
                onEditCriteria={management.handleEditReEvaluationCriteria}
                onDeleteCriteria={handleDeleteCriteria}
                title={RE_EVALUATION_UI_TEXT.VENDOR_RE_EVALUATION_CRITERIA_TITLE}
                showAddButton={true}
                columns={reEvaluationCustomColumns}
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
                }}
                onFileEdit={handleReEvaluationFileEdit}
                onFileUpload={handleReEvaluationFileUpload as any}
                subHeader={RE_EVALUATION_UI_TEXT.LOGO_UPLOAD_SUBHEADER}
              />
            </Grid2>
          </GridContainerWithMargin>

          <ButtonGroup
            buttons={[
              { label: BUTTON_LABELS.CANCEL, onClick: handleReEvaluationCancel },
              { label: BUTTON_LABELS.SAVE, onClick: handleReEvaluationSave },
            ]}
          />
        </FormContent>
      </FormWrapper>

      {/* Vendor Re-Evaluation Criteria Modal */}
      <VendorReEvaluationCriteriaModal
        open={management.isModalOpen}
        onClose={management.handleReEvaluationModalClose}
        onSave={management.handleReEvaluationModalSave}
        initialData={useMemo(() => management.getReEvaluationInitialModalData(), [management.selectedCriteria, management.editingParentGroup, criteriaData, management.isModalOpen])}
        criteriaId={Number(management.selectedCriteria?.id)}
        existingGroupNames={useMemo(() => {
          // Extract existing group names from criteriaData (excluding deleted groups)
          return criteriaData
            .filter(item => item.isParent && item.status !== NUMBERMAP.TWO)
            .map(item => item.criteria)
            .filter((name): name is string => !!name && name.trim() !== '')
        }, [criteriaData])}
        currentGroupName={useMemo(() => {
          // Get current group name when editing
          if (management.selectedCriteria) {
            const parentGroup = criteriaData.find(
              item => item.isParent && item.group === management.selectedCriteria?.group
            )
            return parentGroup?.criteria ?? undefined
          }
          if (management.editingParentGroup) {
            return management.editingParentGroup.criteria ?? undefined
          }
          return undefined
        }, [management.selectedCriteria, management.editingParentGroup, criteriaData])}
        existingCriteriaInGroup={useMemo(() => {
          // Get the current group ID
          let currentGroupId: number | undefined
          if (management.selectedCriteria) {
            currentGroupId = management.selectedCriteria.group
          } else if (management.editingParentGroup) {
            currentGroupId = management.editingParentGroup.group
          }
          
          if (!currentGroupId) return []
          
          // Get all child criteria in the current group (excluding deleted and the currently editing criteria)
          const existingCriteria = criteriaData
            .filter(item => 
              item.group === currentGroupId && 
              !item.isParent && 
              item.status !== NUMBERMAP.TWO &&
              // Exclude the currently editing criteria
              (management.selectedCriteria ? item.id !== management.selectedCriteria.id : true)
            )
            .map(item => item.criteria)
            .filter((name): name is string => !!name && name.trim() !== '')
          
          return existingCriteria
        }, [management.selectedCriteria, management.editingParentGroup, criteriaData])}
      />
    </FormContainer>
  )
}

export default VendorReEvaluationCriteriaForm;