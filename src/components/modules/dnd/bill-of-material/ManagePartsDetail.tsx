import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  InputField,
  RichTextEditor,
  DataTable,
  ButtonGroup,
  ActionButton,
  showActionAlert,
  RadioButtonGroup,
} from '@/components/ui';
import { HeaderContainer, Title, AddButton } from '@/styles/modules/hr/addEmployee';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { bomButtonContainerSx } from '@/styles/modules/dnd/billOfMaterial';
import { LabelContainer, LabelText, LabelValue } from '@/styles/components/modules/prototypeForm';
import { RadioGroupWrapper } from '@/styles/modules/dnd/dir';
import { BUTTON_LABEL, FINALFILEINITIALDATA, STATUS, NUMBERMAP } from '@/constants/common';
import { COMMON_CONSTANTS, mergeFinalFileData, FinalFileData } from '@/lib/utils/common';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';
import { 
  PAGE_TITLES,
  SAFETY_CRITICAL_APPEARANCE_OPTIONS,
  UNIT_BATCH_OPTIONS,
  HARDWARE_SOFTWARE_BOTH_OPTIONS,
  MAKE_BUY_OPTIONS,
  MANUFACTURING_PURCHASE_BOM_OPTIONS,
  MANAGE_PARTS_FORM_LABELS,
  MANAGE_PARTS_FORM_PLACEHOLDERS,
  MANAGE_PARTS_TABLE_COLUMNS,
  MANAGE_PARTS_FORM_FIELDS,
  MANAGE_PARTS_RADIO_GROUP_NAMES,
  MANAGE_PARTS_BUTTON_LABELS,
  MANAGE_PARTS_FILE_UPLOAD,
  INITIAL_BOM_PART_FORM_DATA,
  FIELD_LABEL_MAP,
  FIELD_ORDER,
  VALIDATION_MESSAGES,
} from '@/constants/modules/dnd/bom';
import { 
  ManagePartsDetailProps,
  BomPartFormData,
} from '@/types/modules/dnd/bom';
import { 
  useModelOptions, 
  useOrganizationUnits, 
  useOrganizationSites, 
  useAssemblyTypes,
  useBillOfMaterial,
  useSaveBomPart,
  useDeleteBomPart,
  useBomPartById,
} from '@/hooks/modules/dnd/useBOM';
import { usePartNumbers } from '@/hooks/modules/vendor-management/useSampleOrders';
import { usePartCategoryList } from '@/hooks/modules/vendor-management/usePartCategory';
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import GlobalLoader from '@/components/shared/LoadingSpinner';

const ManagePartsDetail: React.FC<ManagePartsDetailProps> = ({ projectId, productId, initialPartId, onCancel }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [bomPartId, setBomPartId] = useState<number | null>(initialPartId ? Number(initialPartId) : null);
  const [formData, setFormData] = useState<BomPartFormData>({ ...INITIAL_BOM_PART_FORM_DATA });
  const [initialFiles, setInitialFiles] = useState<any[]>([]);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: modelsResp, isLoading: isModelsLoading } = useModelOptions(projectId);
  const { mutate: saveBomPart, isPending: isSavePending } = useSaveBomPart();
  const { mutate: deleteBomPart, isPending: isDeletePending } = useDeleteBomPart();
  const { data: unitsResp, isLoading: isUnitsLoading } = useOrganizationUnits();
  const { data: sitesResp, isLoading: isSitesLoading } = useOrganizationSites();
  const { data: assemblyTypesResp, isLoading: isAssemblyTypesLoading } = useAssemblyTypes();
  const { data: partNumbersResp, isLoading: isPartNumbersLoading } = usePartNumbers();
  const { data: partCategoriesResp, isLoading: isPartCategoriesLoading } = usePartCategoryList();
  const { data: bomData, isLoading: isBomDataLoading } = useBillOfMaterial(productId, !!productId);
  const { data: bomPartData, isLoading: isBomPartLoading } = useBomPartById(bomPartId);

  const handleInputChange = (field: keyof BomPartFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user inputs a value
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle part_no change - auto-populate part_name if valid option is selected
  const handlePartNoChange = (value: string): void => {
    handleInputChange('part_no', value);
    
    // Check if the selected value is a valid option from the API
    const selectedPart = partNumbersResp?.data?.find((p: any) => 
      p.id?.toString() === value || p.part_number === value
    );
    
    if (selectedPart) {
      // Valid option selected - auto-populate part_name
      handleInputChange('part_name', selectedPart.part_name ?? '');
    } else {
      // Custom option - clear part_name so user can enter it
      handleInputChange('part_name', '');
    }
  };

  // Check if part_no is a custom option (not found in partNumbersResp data)
  const isCustomPartNo = (): boolean => {
    if (!formData.part_no) return false;
    const selectedPart = partNumbersResp?.data?.find((p: any) => 
      p.id?.toString() === formData.part_no || p.part_number === formData.part_no
    );
    return !selectedPart;
  };

  const handlePartCategoryChange = (value: string): void => {
    handleInputChange('part_category_id', value);
  };

  // Initialize form data when bomPartData is loaded
  // Update bomPartId when initialPartId changes
  useEffect(() => {
    if (initialPartId) {
      setBomPartId(Number(initialPartId));
      setIsEditMode(true);
    }
  }, [initialPartId]);

  useEffect(() => {
    if (bomPartData?.data && isEditMode) {
      const data = bomPartData.data;
      // Ensure unit_id is converted to string for consistency
      const formDataWithStringIds = {
        ...data,
        unit_id: data.unit_id?.toString() ?? '',
        part_category_id: data.part_category_id?.toString() ?? '',
      };
      setFormData(formDataWithStringIds);

      // If part_no exists, check if it's a valid option and auto-populate part_name
      if (data.part_no && partNumbersResp?.data) {
        const selectedPart = partNumbersResp.data.find((p: any) => 
          p.id?.toString() === data.part_no || p.part_number === data.part_no
        );
        if (selectedPart && !data.part_name) {
          // If part_name is not set but we found a matching part, populate it
          setFormData(prev => ({ ...prev, part_name: selectedPart.part_name ?? '' }));
        }
      }

      // Set initial files
      if (data.documents && data.documents.length > NUMBERMAP.ZERO) {
        setInitialFiles(data.documents);
      } else if (data.file_ids && data.file_ids.length > NUMBERMAP.ZERO) {
        setInitialFiles(data.file_ids.map((id: number) => ({ file_id: id })));
      } else {
        setInitialFiles([]);
      }
    }
  }, [bomPartData, isEditMode, partNumbersResp]);

  const handleDelete = (bomPartId: number) => {
    showActionAlert(COMMON_CONSTANTS.DELETE_ALERT).then((result) => {
      if (result?.isConfirmed) {
        deleteBomPart(bomPartId, {
          onSuccess: () => {
            showActionAlert(STATUS.SUCCESS);
          },
          onError: () => {
            showActionAlert(STATUS.FAILED);
          },
        });
      }
    });
  };

  const managePartsColumns = [
    { field: MANAGE_PARTS_TABLE_COLUMNS.SNO.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.SNO.HEADER, flex: NUMBERMAP.HALF },
    { field: MANAGE_PARTS_TABLE_COLUMNS.PART_NUMBER.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.PART_NUMBER.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.PART_NAME.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.PART_NAME.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.MODEL_NO.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.MODEL_NO.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.ASSEMBLY_TYPE.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.ASSEMBLY_TYPE.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.MAKE_BUY.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.MAKE_BUY.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.SAFETY_CRITICAL_APPEARANCE.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.SAFETY_CRITICAL_APPEARANCE.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.PARENT_ASSEMBLY.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.PARENT_ASSEMBLY.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.ASSEMBLY_LEVEL.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.ASSEMBLY_LEVEL.HEADER, flex: NUMBERMAP.ONE },
    { field: MANAGE_PARTS_TABLE_COLUMNS.QUANTITY.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.QUANTITY.HEADER, flex: NUMBERMAP.ONE },
    {
      field: MANAGE_PARTS_TABLE_COLUMNS.ACTIONS.FIELD, headerName: MANAGE_PARTS_TABLE_COLUMNS.ACTIONS.HEADER, flex: NUMBERMAP.ONE, renderCell: (params: any) => (
        <ActionButton
          onEdit={() => {
            setBomPartId(params.row.bom_part_id ?? params.row.id);
            setIsEditMode(true);
          }}
          onDelete={() => handleDelete(params.row.bom_part_id ?? params.row.id)}
          editDisabled={false}
          deleteDisabled={false}
        />
      ),
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  // Comprehensive loading state function
  const isLoading = () => {
    if (isModelsLoading) return true;
    if (isUnitsLoading) return true;
    if (isSitesLoading) return true;
    if (isAssemblyTypesLoading) return true;
    if (isPartCategoriesLoading) return true;
    if (isPartNumbersLoading) return true;
    if (isBomDataLoading) return true;
    if (isBomPartLoading) return true;
    if (isSavePending) return true;
    if (isDeletePending) return true;
    return false;
  };

  // Drilldown mode: if edit mode is false, show DataTable
  if (!isEditMode) {
    return (
      <Box>
        <HeaderContainer>
          <Title>{PAGE_TITLES.MANAGE_PARTS}</Title>
          <AddButton variant='outlined' onClick={() => {
            setFormData({ ...INITIAL_BOM_PART_FORM_DATA });
            setIsEditMode(true);
            setBomPartId(null);
            setInitialFiles([]);
            setFinalFileData(FINALFILEINITIALDATA);
          }}>
           {MANAGE_PARTS_BUTTON_LABELS.ADD_NEW}
          </AddButton>
        </HeaderContainer>
        <DataTable
          columns={managePartsColumns}
          rows={bomData?.data?.[NUMBERMAP.ZERO]?.parts ?? []}
          IdField={MANAGE_PARTS_FORM_FIELDS.BOM_PART_ID}
          pagination={true}
          loading={isBomDataLoading}
        />
      </Box>
    );
  }

  // Helper function to check if a value is empty (handles both string and number types)
  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'number') return false; // Numbers are valid
    if (typeof value === 'string') return !value.trim();
    return !value;
  };

  // Validate standard required fields
  const validateRequiredFields = (errors: Record<string, string>): void => {
    const requiredFields: Array<keyof BomPartFormData> = [
      'model_id',
      'assembly_type_id',
      'location_id',
      'quantity',
      'part_category_id',
      'unit_id',
      'part_type',
      'part_quantity_type',
      'part_component_type',
      'classification',
      'part_purchase_type',
      'bom_type',
    ];
    
    requiredFields.forEach(field => {
      if (isEmpty(formData[field])) {
        const label = FIELD_LABEL_MAP[field];
        if (label) {
          errors[field] = VALIDATION_MESSAGES.FIELD_REQUIRED(label);
        }
      }
    });
  };

  // Validate part_no and part_name (special handling for custom parts)
  const validatePartFields = (errors: Record<string, string>): void => {
    const partNoValue = formData.part_no;
    if (!partNoValue || (typeof partNoValue === 'string' && !partNoValue.trim())) {
      errors.part_no = VALIDATION_MESSAGES.FIELD_REQUIRED(FIELD_LABEL_MAP.part_no);
    }
    
    const selectedPart = partNumbersResp?.data?.find((p: any) => 
      p.id?.toString() === formData.part_no || p.part_number === formData.part_no
    );
    const isCustomPartNoValue = !selectedPart && formData.part_no;
    if (isCustomPartNoValue && isEmpty(formData.part_name)) {
      errors.part_name = VALIDATION_MESSAGES.FIELD_REQUIRED(FIELD_LABEL_MAP.part_name);
    }
  };

  // Validate file upload
  const validateFileUpload = (errors: Record<string, string>): boolean => {
    const hasFiles = (initialFiles && initialFiles.length > NUMBERMAP.ZERO) || 
                     (finalFileData?.documents_to_create && finalFileData.documents_to_create.length > NUMBERMAP.ZERO) ||
                     (finalFileData?.update_meta_data && Object.keys(finalFileData.update_meta_data).length > NUMBERMAP.ZERO);
    if (!hasFiles) {
      errors.uploadedFiles = VALIDATION_MESSAGES.FILE_REQUIRED;
    }
    return hasFiles;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    validateRequiredFields(newErrors);
    validatePartFields(newErrors);
    const hasFiles = validateFileUpload(newErrors);
    
    setErrors(newErrors);
    
    const hasValidationErrors = Object.keys(newErrors).length > NUMBERMAP.ZERO;
    
    // Create combined data for focus validation
    const combinedData = {
      ...formData,
      uploadedFiles: hasFiles ? 'filled' : '',
    };
    
    const focusResult = hasValidationErrors
      ? validateAndFocusFirstEmptyField(combinedData, FIELD_ORDER, FIELD_LABEL_MAP)
      : true;
    
    return !hasValidationErrors && focusResult;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const formDataPayload = new FormData();
    const selectedPart = partNumbersResp?.data?.find((p: any) => 
      p.id?.toString() === formData.part_no || p.part_number === formData.part_no
    );
    const isCustomPartNoValue = !selectedPart && formData.part_no;
    const hasOtherUnit = !!formData.other_unit;
    const unitIdValue = formData.unit_id?.toString();
    const selectedUnit = !hasOtherUnit && unitsResp?.data?.find((u: any) => {
      const uUnitId = u.unit_id?.toString();
      const uId = u.id?.toString();
      return uUnitId === unitIdValue || uId === unitIdValue;
    });
    const isCustomUnitValue = hasOtherUnit || (!selectedUnit && unitIdValue);
    
    // Append all form fields - always append, no conditions
    formDataPayload.append('model_id', formData.model_id);
    formDataPayload.append('assembly_type_id', formData.assembly_type_id);
    formDataPayload.append('location_id', formData.location_id);
    formDataPayload.append('quantity', formData.quantity);
    formDataPayload.append('bom_part_id', bomPartId?.toString() ?? '');
    
    // If custom option: send part_no and part_name (without part_id), if dropdown selected: send part_id only (without part_no and part_name)
    if (isCustomPartNoValue) {
      formDataPayload.append('part_no', formData.part_no);
      formDataPayload.append('part_name', formData.part_name);
      formDataPayload.append('part_id', '');
    } else {
      formDataPayload.append('part_no', '');
      formDataPayload.append('part_name', '');
      formDataPayload.append('part_id', selectedPart?.id?.toString() ?? '');
    }
    formDataPayload.append('manufacture_part_no', formData.manufacture_part_no);
    formDataPayload.append('classification', formData.classification);
    formDataPayload.append('manufacturer', formData.manufacturer);
    formDataPayload.append('documents_to_delete', JSON.stringify(finalFileData?.documents_to_delete ?? []));
    formDataPayload.append('update_meta_data', JSON.stringify(finalFileData?.update_meta_data ?? {}));
    formDataPayload.append('specification', formData.specification);
    formDataPayload.append('parent_assembly', formData.parent_assembly);
    formDataPayload.append('alternative_part_no', formData.alternative_part_no);
    
    // If custom option: send other_unit with the custom value (unit_id contains the custom text) and unit_id as empty, if dropdown selected: send unit_id and other_unit as empty
    if (isCustomUnitValue) {
      formDataPayload.append('other_unit', formData.unit_id);
      formDataPayload.append('unit_id', '');
    } else {
      formDataPayload.append('other_unit', '');
      formDataPayload.append('unit_id', formData.unit_id);
    }
    formDataPayload.append('bom_type', formData.bom_type);
    formDataPayload.append('part_quantity_type', formData.part_quantity_type);
    formDataPayload.append('part_component_type', formData.part_component_type);
    formDataPayload.append('part_purchase_type', formData.part_purchase_type);
    formDataPayload.append('description', formData.description);
    formDataPayload.append('create_meta_data', JSON.stringify(finalFileData?.create_meta_data ?? {}));
    formDataPayload.append('part_type', formData.part_type);
    formDataPayload.append('part_category_id', formData?.part_category_id?.toString() ?? '');
    formDataPayload.append('assembly_level', formData.assembly_level);
    
    // Append files to documents_to_create
    finalFileData?.documents_to_create?.forEach((fileData: File) => {
      formDataPayload.append('documents_to_create', fileData, fileData.name);
    });
    
    saveBomPart(formDataPayload, {
      onSuccess: () => {
        handleCancel();
      }
    });
  };

  const handleParentAssemblyChange = (value: string) => {
    handleInputChange('parent_assembly', value);
    if (value) {
      const selectedParent = bomData?.data?.[NUMBERMAP.ZERO]?.parts?.find((part: any) => part.part_id?.toString() === value);
      if (selectedParent?.assembly_level) {
        handleInputChange('assembly_level', String(selectedParent.assembly_level));
      }
    } else {
      handleInputChange('assembly_level', '');
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setBomPartId(null);
    setFormData(INITIAL_BOM_PART_FORM_DATA as BomPartFormData);
    setInitialFiles([]);
    setFinalFileData(FINALFILEINITIALDATA);
    setErrors({});
    onCancel?.();
  };

  const buttonConfig = [
    { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABEL.SAVE, onClick: handleSave }
  ];

  return (
    <FormContainer>
      <GlobalLoader loading={isLoading()} />
      <FormWrapper>
        <HeaderContainer>
          <Title>{PAGE_TITLES.MANAGE_PARTS}</Title>
        </HeaderContainer>
        <FormContent>
          {/* First Section - Basic Part Information */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mb: NUMBERMAP.TWO }}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.MODEL_NO}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_MODEL_NO}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.PRODUCT_VARIANT_ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.MODEL_NAME}
                value={formData.model_id}
                onChange={(v: string) => handleInputChange('model_id', v)}
                options={modelsResp?.data ?? []}
                error={errors.model_id ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.ASSEMBLY_TYPE}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_ASSEMBLY_TYPE}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.ASSEMBLY_TYPE_ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.ASSEMBLY_TYPE_NAME}
                value={formData.assembly_type_id}
                onChange={(v: string) => handleInputChange('assembly_type_id', v)}
                options={assemblyTypesResp?.data ?? []}
                error={errors.assembly_type_id ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.UNIT}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_UNIT}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.SITE_ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.SITE_NAME}
                value={formData.location_id}
                onChange={(v: string) => handleInputChange('location_id', v)}
                options={sitesResp?.data ?? []}
                error={errors.location_id ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.QUANTITY}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_QUANTITY}
                value={formData.quantity}
                onChange={(v: string) => handleInputChange('quantity', v)}
                error={errors.quantity ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.PART_CATEGORY}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_PART_CATEGORY}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.PART_CATEGORY_ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.PART_CATEGORY_NAME}
                value={formData.part_category_id}
                onChange={handlePartCategoryChange}
                options={partCategoriesResp?.data ?? []}
                error={errors.part_category_id ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.PART_NO}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_PART_NO}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.PART_NUMBER}
                value={formData.part_no}
                onChange={handlePartNoChange}
                options={partNumbersResp?.data ?? []}
                error={errors.part_no ?? ''}
                customOption={true}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              {isCustomPartNo() ? (
                <InputField
                  label={MANAGE_PARTS_FORM_LABELS.PART_NAME}
                  placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_PART_NAME}
                  value={formData.part_name}
                  onChange={(v: string) => handleInputChange('part_name', v)}
                  error={errors.part_name ?? ''}
                />
              ) : (
                <LabelContainer>
                  <LabelText>{MANAGE_PARTS_FORM_LABELS.PART_NAME}</LabelText>
                  <LabelValue>{formData.part_name ?? '-'}</LabelValue>
                </LabelContainer>
              )}
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={MANAGE_PARTS_FORM_LABELS.DESCRIPTION}
                value={formData.description}
                onChange={(v: string) => handleInputChange('description', v)}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_DESCRIPTION}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.UNIT_OF_MEASUREMENT}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_UNIT_OF_MEASUREMENT}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.UNIT_ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.UNIT_NAME}
                value={formData.unit_id}
                onChange={(v: string) => handleInputChange('unit_id', v)}
                options={unitsResp?.data ?? []}
                error={errors.unit_id ?? ''}
                customOption={true}
              />
            </Grid2>
          </Grid2>

          {/* Second Section - Classification and Details */}
          <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mb: NUMBERMAP.TWO }}>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper >
                <RadioButtonGroup
                  name={MANAGE_PARTS_RADIO_GROUP_NAMES.SAFETY_CRITICAL_APPEARANCE}
                  label={MANAGE_PARTS_FORM_LABELS.SAFETY_CRITICAL_APPEARANCE}
                  options={SAFETY_CRITICAL_APPEARANCE_OPTIONS}
                  value={formData.part_type}
                  onChange={(value) => handleInputChange('part_type', String(value))}
                  error={errors.part_type ?? ''}
                />
              </RadioGroupWrapper>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper>
                <RadioButtonGroup
                  name={MANAGE_PARTS_RADIO_GROUP_NAMES.UNIT_BATCH}
                  label={MANAGE_PARTS_FORM_LABELS.UNIT_BATCH}
                  options={UNIT_BATCH_OPTIONS}
                  value={formData.part_quantity_type}
                  onChange={(value) => handleInputChange('part_quantity_type', String(value))}
                  error={errors.part_quantity_type ?? ''}
                />
              </RadioGroupWrapper>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper>
                <RadioButtonGroup
                  name={MANAGE_PARTS_RADIO_GROUP_NAMES.HARDWARE_SOFTWARE_BOTH}
                  label={MANAGE_PARTS_FORM_LABELS.HARDWARE_SOFTWARE_BOTH}
                  options={HARDWARE_SOFTWARE_BOTH_OPTIONS}
                  value={formData.part_component_type}
                  onChange={(value) => handleInputChange('part_component_type', String(value))}
                  error={errors.part_component_type ?? ''}
                />
              </RadioGroupWrapper>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.CLASSIFICATION}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_CLASSIFICATION}
                value={formData.classification}
                onChange={(v: string) => handleInputChange('classification', v)}
                error={errors.classification ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper>
                <RadioButtonGroup
                  name={MANAGE_PARTS_RADIO_GROUP_NAMES.MAKE_BUY}
                  label={MANAGE_PARTS_FORM_LABELS.MAKE_BUY}
                  options={MAKE_BUY_OPTIONS}
                  value={formData.part_purchase_type}
                  onChange={(value) => handleInputChange('part_purchase_type', String(value))}
                  error={errors.part_purchase_type ?? ''}
                />
              </RadioGroupWrapper>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.MANUFACTURER}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_MANUFACTURER}
                value={formData.manufacturer}
                onChange={(v: string) => handleInputChange('manufacturer', v)}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.MANUFACTURER_PART_NO}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_MANUFACTURER_PART_NO}
                value={formData.manufacture_part_no}
                onChange={(v: string) => handleInputChange('manufacture_part_no', v)}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={MANAGE_PARTS_FORM_LABELS.SPECIFICATIONS}
                value={formData.specification}
                onChange={(v: string) => handleInputChange('specification', v)}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.ENTER_SPECIFICATIONS}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE} id={MANAGE_PARTS_FORM_LABELS.UPLOAD_DRAWING}>
              <FileUploadManager
                initialFiles={initialFiles}
                subHeader={MANAGE_PARTS_FORM_LABELS.UPLOAD_DRAWING}
                onFileUpload={(newFile: any) => {
                  setInitialFiles((prev) => [...prev, newFile]);
                  // Clear file upload error when a file is uploaded
                  if (errors.uploadedFiles) {
                    setErrors(prev => ({ ...prev, uploadedFiles: '' }));
                  }
                }}
                onFileEdit={(updatedFile: any) => {
                  setInitialFiles((prev) => {
                    const updatedFiles = prev.map((file) => {
                      const currentId = file.file_id ?? file.id ?? file.document_id;
                      const updatedId = updatedFile.document_id ?? updatedFile.id ?? updatedFile.file_id;
                      return currentId === updatedId ? { ...file, ...updatedFile } : file;
                    });
                    return updatedFiles;
                  });
                }}
                onSubmit={(data) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data));
                }}
                uploadMandError={errors.uploadedFiles}
                allowedFileTypes={MANAGE_PARTS_FILE_UPLOAD.ALLOWED_FILE_TYPES}
                fileTypeErrorMessage={MANAGE_PARTS_FILE_UPLOAD.EMPTY_ERROR}
                data-file-upload-manager
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mb: NUMBERMAP.TWO, mt: NUMBERMAP.TWO }}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.PARENT_ASSEMBLY}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_PARENT_ASSEMBLY}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.PART_ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.PART_NAME}
                value={formData.parent_assembly}
                onChange={handleParentAssemblyChange}
                options={bomData?.data?.[NUMBERMAP.ZERO]?.parts ?? []}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={MANAGE_PARTS_FORM_LABELS.ALTERNATIVE_PART_NO}
                placeholder={MANAGE_PARTS_FORM_PLACEHOLDERS.SELECT_ALTERNATIVE_PART_NO}
                isDropdown
                keyField={MANAGE_PARTS_FORM_FIELDS.ID}
                valueField={MANAGE_PARTS_FORM_FIELDS.PART_NUMBER}
                value={formData.alternative_part_no}
                onChange={(v: string) => handleInputChange('alternative_part_no', v)}
                options={partNumbersResp?.data ?? []}
                error={errors.alternative_part_no ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelContainer>
                <LabelText>{MANAGE_PARTS_FORM_LABELS.ASSEMBLY_LEVEL}</LabelText>
                <LabelValue>{formData.assembly_level ?? '-'}</LabelValue>
              </LabelContainer>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper>
                <RadioButtonGroup
                  name={MANAGE_PARTS_RADIO_GROUP_NAMES.MANUFACTURING_PURCHASE_BOM}
                  label={MANAGE_PARTS_FORM_LABELS.MANUFACTURING_PURCHASE_BOM}
                  options={MANUFACTURING_PURCHASE_BOM_OPTIONS}
                  value={formData.bom_type}
                  onChange={(value) => handleInputChange('bom_type', String(value))}
                  error={errors.bom_type ?? ''}
                />
              </RadioGroupWrapper>
            </Grid2>
          </Grid2>

          <Box sx={bomButtonContainerSx}>
            <ButtonGroup buttons={buttonConfig} />
          </Box>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default ManagePartsDetail;
