'use client'

import React, { forwardRef, useEffect } from 'react'
import { Box, Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  RichTextEditor,
  MultiSelect,
  Description,
} from '@/components/ui'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { DocumentStructure } from '@/types/common'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { UploadedFileData } from '@/types/modules/dnd/hld'
import {
  PERFORMANCE_SPECIFICATION_LABELS,
  PERFORMANCE_SPECIFICATION_PLACEHOLDERS,
  SPECIFICATION_FIELDS,
  PERFORMANCE_SPECIFICATION_BUTTONS,
  SPECIFICATION_FORM_FIELD,
  SPECIFICATION_KEY_VALUE_FIELD,
  SPECIFICATION_SCHEMA,
  BOX_STYLE,
  SPECIFICATION_NAMES,
  SPECIFICATION_CONTAINER,
  DATA_FIELD_NAMES,
  EQMS_DEVICE,
  DATA_SOURCE_NAMES,
} from '@/constants/modules/dnd/dirSpecificataion'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  FormContainer,
  FormContent,
  ModalOverFlow,
} from '@/styles/modules/dnd/dirSpecification'
import { FILE_UPLOAD_SUB_HEADER, NUMBERMAP } from '@/constants/common'
import { magicRead } from '@/lib/utils/magicRead'
import { COMMON_CONSTANTS } from '@/lib/utils/common'

/**
 Classification : Confidential
**/

const { ACTIVE_STATUS } = COMMON_CONSTANTS

const {
  PARAMETER_FIELD,
  UNIT_FIELD,
  VALUE_FIELD,
  TYPE_FIELD,
  ADVERSE_EVENT_FIELD,
  LIFETIME_DEVICE_FIELD,
  DEVICE_FIELD,
  DEVICE_MULTIPLE_FIELD,
  FUNCTIONAL_BLOCK_FIELD,
  FUNCTIONAL_BLOCK_MULTISELECT_FIELD,
  MODELS_FIELD,
  ACCURACY_LEVEL_FIELD,
  DESCRIPTION_FIELD,
  PERFORMANCE_SPECIFICATION_FIELD,
  ACCESSORIES_CONSUMABLES_FIELD,
  UPLOAD_FILE,
  CLAUSE_NUMBER,
  APPLICABLE_STANDARDS_FIELD,
  CONNECTIVITY_FIELD,
  CONNECTIVITY_MODE_FIELD,
  COMMUNICATION_PROTOCOL_FIELD,
  STANDARDS_FIELD,
} = SPECIFICATION_FIELDS
const {
  PERFORMANCE_SPECIFICATION_ID,
  PARAMETER: PARAMETER_FIELD_VALUE,
  MODEL_ID,
  MODEL_NAME,
  REF_ID,
  TYPE_NAME,
  FUNCTIONAL_BLOCK_ID,
  FUNCTIONAL_BLOCK_NAME,
} = SPECIFICATION_KEY_VALUE_FIELD

const { CANCEL, SAVE } = PERFORMANCE_SPECIFICATION_BUTTONS

interface PerformanceSpecificationFormProps {
  id?: string
  open: boolean
  onClose: () => void
  formData: any
  updateFormData: (field: string, value: any) => void
  formConfig: {
    [key: string]: {
      isRequired: boolean
      validation: boolean
      visible?: boolean
    }
  }
  title?: string
  errors: any
  performanceSpecificationOptions: { [key: string]: string }[]
  functionalBlockOptions: { [key: string]: string }[]
  modelsOptions: { [key: string]: string }[]
  accessoriesOptions: { [key: string]: string }[]
  typeOptions: { [key: string]: string }[]
  deviceOptions: { [key: string]: string }[]
  handleSave: () => void
  handleCancel: () => void
  isLoading?: boolean
  handleFileUpload: (file: File | FileData2) => void
  handleFileEdit: (file: UploadedFileData | FileData2) => void
  handleFileSubmit: (data: DocumentStructure) => void
  designInputId?: string
}

const CommonSpecificationForm = forwardRef<
  HTMLDivElement,
  PerformanceSpecificationFormProps
>(
  (
    {
      id,
      open,
      onClose,
      formData,
      updateFormData,
      formConfig,
      errors,
      performanceSpecificationOptions,
      functionalBlockOptions,
      modelsOptions,
      accessoriesOptions,
      typeOptions,
      deviceOptions,
      handleSave,
      handleCancel,
      isLoading = false,
      handleFileUpload,
      handleFileEdit,
      handleFileSubmit,
      title,
      designInputId,
    },
    ref
  ) => {
    const buttons = [
      { ...CANCEL, onClick: handleCancel },
      {
        ...SAVE,
        onClick: handleSave,
        disabled: isLoading,
      },
    ]
    let keys: {
      eqms_dig_specification: { id: number };
      [key: string]: Record<string, number>;
    } = {
      eqms_dig_specification: {
        id: Number(designInputId),
      },
     }
     if(title === SPECIFICATION_NAMES.COMMUNICATION_PROTOCOL){
      keys = {
        ...keys,
        eqms_dig_specification_functional_block_mapper: {
          fk_eqms_dig_specification_id: Number(designInputId)
        }
      }
    }

    keys = {
      ...keys,
      eqms_dig_specification_model_mapper: {
        fk_eqms_dig_specification_id: Number(designInputId)
      }
    }

    const fileOperation = {
      read: {
        eqms_dir_supporting_document: {
          fields: [
            SPECIFICATION_SCHEMA.ID,
            SPECIFICATION_SCHEMA.FK_EQMS_SUPPORTING_FILE_ID,
          ],
        },
      },
      keys: {
        eqms_dir_supporting_document: {
          fk_eqms_dig_specification_id: Number(designInputId),
          status: ACTIVE_STATUS,
        },
      },
    }
    if (title === SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION || title === SPECIFICATION_NAMES.SHELF_LIFE) {
      keys = {
        ...keys,
        eqms_dig_specification_mapper: {
          fk_eqms_target_specification_id: Number(designInputId),
        },
      }
    }

    const fetchdataFromMagicRead = async () => {
      const container = ref?.current as HTMLElement
      if (!container || container.childElementCount === NUMBERMAP.ZERO) {
        return
      }
      if (title === SPECIFICATION_NAMES.DEVICE_NAME_FORM) {

    const originalId = container.id;
    container.id = SPECIFICATION_CONTAINER;

    try {
      const result = await magicRead(
        container,
        {
          eqms_device_lk: {
            id: Number(designInputId),
          },
        }
      );

      const deviceData = result?.data?.eqms_device_lk?.[0];
      if (deviceData) {
        updateFormData(DEVICE_FIELD, deviceData.device_name ?? '');
      }
    } finally {
    
      container.id = originalId;
    }
    return;
  }

      const result = await magicRead(container, keys, fileOperation)
      const specificationData = result?.data?.eqms_dig_specification?.[0]

      if (!specificationData) {
        return
      }

      const documents =
        result.data?.documents?.eqms_dir_supporting_document ?? []
      updateFormData(UPLOAD_FILE, documents)
      let fieldMap: Record<string, any> = {
        [PERFORMANCE_SPECIFICATION_FIELD]:
          specificationData.fk_eqms_source_specification_id,
        [PARAMETER_FIELD]: specificationData.specification_parameter,
        [UNIT_FIELD]: specificationData.specification_unit,
        [VALUE_FIELD]: specificationData.specification_value,
        [ACCURACY_LEVEL_FIELD]: specificationData.tolerance_percentage,
        [CLAUSE_NUMBER]: specificationData.clause_no_of_applicable,
        [APPLICABLE_STANDARDS_FIELD]: specificationData.applicable_standards,
        [FUNCTIONAL_BLOCK_FIELD]:
          specificationData?.eqms_dig_specification_functional_block_mapper?.map(
            (item: any) => item.fk_eqms_product_functional_block_id ?? null
          ) ?? [],
        [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]:
          specificationData?.eqms_dig_specification_functional_block_mapper
            ?.map(
              (item: any) =>
                String(item.fk_eqms_product_functional_block_id ?? '')
            )
            .filter((id: string) => id != '') ?? [],
        [MODELS_FIELD]:
          specificationData?.eqms_dig_specification_model_mapper?.map(
            (item: any) => item.fk_eqms_project_product_variants_id ?? null
          ) ?? [],
        [DESCRIPTION_FIELD]: specificationData.specification_description,
        [TYPE_FIELD]: specificationData.fk_eqms_usability_type_id,
        [LIFETIME_DEVICE_FIELD]: specificationData.lifetime_of_device,
        [ADVERSE_EVENT_FIELD]: specificationData.adverse_event,
        [DEVICE_FIELD]: specificationData.fk_eqms_device_lk_id,
        [DEVICE_MULTIPLE_FIELD]: specificationData.fk_eqms_device_lk_id,
        [CONNECTIVITY_FIELD]: specificationData.connectivity, 
        [CONNECTIVITY_MODE_FIELD]: specificationData.mode_of_connectivity,
        [COMMUNICATION_PROTOCOL_FIELD]: specificationData.communication_protocol,
        [STANDARDS_FIELD]: specificationData.applicable_standards,
      }      
      if (title === SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION || (title === SPECIFICATION_NAMES.SHELF_LIFE && !getAccessPermission())) {
        const eqms_dig_specification_mapper =
          result?.data?.eqms_dig_specification_mapper ?? []

        const targetSpecId =
          eqms_dig_specification_mapper[NUMBERMAP.ZERO]
            ?.fk_eqms_source_specification_id
        if (targetSpecId) {
          fieldMap[PERFORMANCE_SPECIFICATION_FIELD] = targetSpecId
          fieldMap[ACCESSORIES_CONSUMABLES_FIELD] = targetSpecId
        }
      }
      if (title === SPECIFICATION_NAMES.ACCESSORIES_CONSUMABLES) {
        fieldMap[ACCESSORIES_CONSUMABLES_FIELD]= specificationData.fk_eqms_usability_type_id
      }

      Object.entries(fieldMap).forEach(([field, value]) => {
        updateFormData(field, value ?? [])
      })
    }

    useEffect(() => {
      if (open && Number(designInputId)) {
        const timeout = setTimeout(() => {
          const container = ref.current
          if (container) {
            fetchdataFromMagicRead()
          }
        }, 0)

        return () => clearTimeout(timeout)
      }
    }, [open])

    let functionalBlockLabel

    if (title === SPECIFICATION_NAMES.ENVIRONMENTAL_SPECIFICATION) {
      functionalBlockLabel =
        PERFORMANCE_SPECIFICATION_LABELS.FUNCTIONAL_BLOCK_LABEL_NON_MANDATORY
    } else if (title === SPECIFICATION_NAMES.SOFTWARE_REQUIREMENTS) {
      functionalBlockLabel = PERFORMANCE_SPECIFICATION_LABELS.MODULE_BLOCK_LABEL
    } else {
      functionalBlockLabel =
        PERFORMANCE_SPECIFICATION_LABELS.FUNCTIONAL_BLOCK_LABEL
    }

    let functionalBlockPlaceholder 

  if (title !== SPECIFICATION_NAMES.SOFTWARE_REQUIREMENTS) {
    functionalBlockPlaceholder =
      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.FUNCTIONAL_BLOCK
  } else {
    functionalBlockPlaceholder = PERFORMANCE_SPECIFICATION_PLACEHOLDERS.MODULE
  }

  let parameterLabel
  if (title === SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION) {
    parameterLabel =
      PERFORMANCE_SPECIFICATION_LABELS.PARAMETER_LABEL_NON_MANDATORY
  } else {
    parameterLabel = PERFORMANCE_SPECIFICATION_LABELS.PARAMETER_LABEL
  }

  const getAccessPermission = () => {
    return typeOptions?.some(
      (types) =>
        types.ref_id == formData[TYPE_FIELD] && types.usability_type == 'Unit'
    )
  }

  const renderTypeField = () => {
    if (!formConfig[SPECIFICATION_FORM_FIELD.TYPE_FIELD]?.isRequired) {
      return null
    }

    return (
      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={PERFORMANCE_SPECIFICATION_LABELS.POR_FRS_LABEL}
          placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.POR_FRS}
          isDropdown
          keyField={REF_ID}
          valueField={TYPE_NAME}
          value={formData[TYPE_FIELD]}
          onChange={(value) => updateFormData(TYPE_FIELD, value)}
          error={errors[TYPE_FIELD]}
          dataIsAutocomplete={formData[TYPE_FIELD]}
          options={typeOptions}
          dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
          dataFieldName={SPECIFICATION_SCHEMA.SPECIFICATION_TYPE}
        />
      </Grid2>
    )
  }

    return (
      <CommonModal open={open} onClose={onClose} title={title}>
        <FormContainer key={title} id={id} ref={ref}>
          <FormContent>
            <Grid2 container spacing={NUMBERMAP.ONE} sx={ModalOverFlow}>
              {}

              {formConfig[SPECIFICATION_FORM_FIELD.STANDARDS_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <Description
                    label={PERFORMANCE_SPECIFICATION_LABELS.STANDARDS}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.STANDARDS}
                    value={formData[STANDARDS_FIELD]}
                    onChange={(value) => updateFormData(STANDARDS_FIELD, value)}
                    error={errors[STANDARDS_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.APPLICABLE_STANDARDS}
                  />
                </Grid2>
              )}

              {formConfig[SPECIFICATION_FORM_FIELD.DEVICE_MULTIPLE_FIELD]
                ?.isRequired === true && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.DEVICE_LABEL}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.DEVICE}
                    options={deviceOptions}
                    value={formData[DEVICE_MULTIPLE_FIELD]}
                    onChange={(value) =>
                      updateFormData(DEVICE_MULTIPLE_FIELD, value)
                    }
                    error={errors[DEVICE_MULTIPLE_FIELD] ?? ''}
                    keyField={SPECIFICATION_SCHEMA.ID}
                    valueField={DATA_FIELD_NAMES.DEVICE_NAME}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={EQMS_DEVICE}
                    isDropdown={true}
                    dataIsAutocomplete={formData[DEVICE_MULTIPLE_FIELD]}
                  />
                </Grid2>
              )}
              {}
              {formConfig[SPECIFICATION_FORM_FIELD.DEVICE_FIELD]?.isRequired ===
                true && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.DEVICE_LABEL}
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.DEVICE_NAME
                    }
                    value={formData[DEVICE_FIELD]}
                    onChange={(value) => updateFormData(DEVICE_FIELD, value)}
                    error={errors[DEVICE_FIELD]}
                    dataSourceName={DATA_SOURCE_NAMES.DEVICE}
                    dataFieldName={DATA_FIELD_NAMES.DEVICE_NAME}
                  />
                </Grid2>
              )}
              {}
              {formConfig[
                SPECIFICATION_FORM_FIELD.PERFORMANCE_SPECIFICATION_FIELD
              ]?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={
                      PERFORMANCE_SPECIFICATION_LABELS.PERFORMANCE_SPECIFICATIONS_LABEL
                    }
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.PERFORMANCE_SPECIFICATION
                    }
                    isDropdown
                    value={formData[PERFORMANCE_SPECIFICATION_FIELD]}
                    onChange={(value: string | number) =>
                      updateFormData(PERFORMANCE_SPECIFICATION_FIELD, value)
                    }
                    error={errors.performanceSpecification}
                    options={performanceSpecificationOptions}
                    keyField={PERFORMANCE_SPECIFICATION_ID}
                    valueField={PARAMETER_FIELD_VALUE}
                    dataSourceName={
                      SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION_MAPPER
                    }
                    dataFieldName={
                      SPECIFICATION_SCHEMA.FK_EQMS_SOURCE_SPECIFICATION_ID
                    }
                    dataIsAutocomplete={
                      formData[PERFORMANCE_SPECIFICATION_FIELD]
                    }
                  />
                </Grid2>
              )}

              {}
              {/* Conditional rendering for Shelf Life - show TYPE_FIELD first */}
              {title === SPECIFICATION_NAMES.SHELF_LIFE && renderTypeField()}

              {formConfig[
                SPECIFICATION_FORM_FIELD.ACCESSORIES_CONSUMABLES_FIELD
              ]?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={
                      PERFORMANCE_SPECIFICATION_LABELS.ACCESSORIES_CONSUMABLES_LABEL
                    }
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.ACCESSORIES_CONSUMABLES
                    }
                    isDropdown
                    disabled={getAccessPermission()}
                    keyField={REF_ID}
                    valueField={TYPE_NAME}
                    value={formData[ACCESSORIES_CONSUMABLES_FIELD]}
                    onChange={(value) =>
                      updateFormData(ACCESSORIES_CONSUMABLES_FIELD, value)
                    }
                    error={
                      title === SPECIFICATION_NAMES.SHELF_LIFE
                        ? (() => {
                            // Find the selected type to check if it's 'Unit'
                            const selectedType = typeOptions.find(
                              (type: any) =>
                                type.ref_id === Number(formData[TYPE_FIELD])
                            )
                            const isUnitType =
                              selectedType?.usability_type ===
                              PERFORMANCE_SPECIFICATION_LABELS.UNIT_LABEL
                            // Only show error if Type is not 'Unit'
                            return isUnitType
                              ? ''
                              : errors[ACCESSORIES_CONSUMABLES_FIELD]
                          })()
                        : errors[ACCESSORIES_CONSUMABLES_FIELD]
                    }
                    options={accessoriesOptions}
                    dataIsAutocomplete={formData[ACCESSORIES_CONSUMABLES_FIELD]}
                    dataSourceName={
                      title === SPECIFICATION_NAMES.SHELF_LIFE
                        ? SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION_MAPPER
                        : SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION
                    }
                    dataFieldName={
                      title === SPECIFICATION_NAMES.SHELF_LIFE
                        ? SPECIFICATION_SCHEMA.FK_EQMS_SOURCE_SPECIFICATION_ID
                        : SPECIFICATION_SCHEMA.SPECIFICATION_TYPE
                    }
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.PARAMETER_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={parameterLabel}
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.PARAMETER
                    }
                    value={formData[PARAMETER_FIELD]}
                    onChange={(value) => updateFormData(PARAMETER_FIELD, value)}
                    error={errors[PARAMETER_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.SPECIFICATION_PARAMETER}
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.CONNECTIVITY_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.CONNECTIVITY}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.CONNECTIVITY}
                    value={formData[CONNECTIVITY_FIELD]}
                    onChange={(value) => updateFormData(CONNECTIVITY_FIELD, value)}
                    error={errors[CONNECTIVITY_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.CONNECTIVITY}
                  />
                </Grid2>
              )}
              
              {formConfig[SPECIFICATION_FORM_FIELD.CONNECTIVITY_MODE_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.CONNECTIVITY_MODE}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.CONNECTIVITY_MODE}
                    value={formData[CONNECTIVITY_MODE_FIELD]}
                    onChange={(value) => updateFormData(CONNECTIVITY_MODE_FIELD, value)}
  
                    error={errors[CONNECTIVITY_MODE_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.CONNECTIVITY_MODE}
                  />
                </Grid2>
              )}

              {formConfig[SPECIFICATION_FORM_FIELD.COMMUNICATION_PROTOCOL_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.COMMUNICATION_PROTOCOL}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.COMMUNICATION_PROTOCOL}
                    value={formData[COMMUNICATION_PROTOCOL_FIELD]}
                    onChange={(value) => updateFormData(COMMUNICATION_PROTOCOL_FIELD, value)}
                    error={errors[COMMUNICATION_PROTOCOL_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.COMMUNICATION_PROTOCOL}
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.CLAUSE_NUMBER]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <Description
                    label={PERFORMANCE_SPECIFICATION_LABELS.CLAUSE_NUMBER_LABEL}
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.CLAUSE_NUMBER
                    }
                    value={formData[CLAUSE_NUMBER]}
                    onChange={(value) => updateFormData(CLAUSE_NUMBER, value)}
                    error={errors[CLAUSE_NUMBER]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={
                      SPECIFICATION_SCHEMA.SPECIFICATION_CLAUSE_NUMBER
                    }
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.UNIT_FIELD]?.isRequired && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.UNIT_LABEL}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.UNIT}
                    value={formData[UNIT_FIELD]}
                    onChange={(value) => updateFormData(UNIT_FIELD, value)}
                    error={errors[UNIT_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.SPECIFICATION_UNIT}
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.VALUE_FIELD]?.isRequired && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.VALUE_LABEL}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.VALUE}
                    value={formData[VALUE_FIELD]}
                    onChange={(value) => updateFormData(VALUE_FIELD, value)}
                    error={errors[VALUE_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.SPECIFICATION_VALUE}
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.ADVERSE_EVENT_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PERFORMANCE_SPECIFICATION_LABELS.ADVERSE_EVENT_LABEL}
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.ADVERSE_EVENT
                    }
                    value={formData[ADVERSE_EVENT_FIELD]}
                    onChange={(value) =>
                      updateFormData(ADVERSE_EVENT_FIELD, value)
                    }
                    error={errors[ADVERSE_EVENT_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={
                      SPECIFICATION_SCHEMA.SPECIFICATION_ADVERESE_EVENT
                    }
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.LIFETIME_DEVICE_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={
                      PERFORMANCE_SPECIFICATION_LABELS.LIFETIME_DEVICE_LABEL
                    }
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.LIFETIME_DEVICE
                    }
                    value={formData[LIFETIME_DEVICE_FIELD]}
                    onChange={(value) =>
                      updateFormData(LIFETIME_DEVICE_FIELD, value)
                    }
                    error={errors[LIFETIME_DEVICE_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.LIFETIME_DEVICE}
                  />
                </Grid2>
              )}

              {}
              {formConfig[
                SPECIFICATION_FORM_FIELD.FUNCTIONAL_BLOCK_MULTISELECT_FIELD
              ]?.isRequired && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <MultiSelect
                    label={
                      PERFORMANCE_SPECIFICATION_LABELS.FUNCTIONAL_BLOCK_LABEL
                    }
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.FUNCTIONAL_BLOCK
                    }
                    isMultiSelect={true}
                    value={formData[FUNCTIONAL_BLOCK_MULTISELECT_FIELD]}
                    onChange={(value) =>
                      updateFormData(FUNCTIONAL_BLOCK_MULTISELECT_FIELD, value)
                    }
                    error={errors[FUNCTIONAL_BLOCK_MULTISELECT_FIELD]}
                    options={functionalBlockOptions}
                    idField={FUNCTIONAL_BLOCK_ID}
                    valueField={FUNCTIONAL_BLOCK_NAME}
                    dataIsAutocomplete={
                      formData[FUNCTIONAL_BLOCK_MULTISELECT_FIELD]
                    }
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_FUNCTIONAL_MAPPER}
                    dataFieldName={
                      SPECIFICATION_SCHEMA.FK_EQMS_PRODUCT_FUNCTIONAL_BLOCK_ID
                    }
                    dataIsMultiSelect={true}
                  />
                </Grid2>
              )}

              {}
              {formConfig[FUNCTIONAL_BLOCK_FIELD]?.isRequired && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={functionalBlockLabel}
                    placeholder={functionalBlockPlaceholder}
                    isDropdown
                    keyField={SPECIFICATION_KEY_VALUE_FIELD.FUNCTIONAL_BLOCK_ID}
                    valueField={
                      SPECIFICATION_KEY_VALUE_FIELD.FUNCTIONAL_BLOCK_NAME
                    }
                    value={formData[FUNCTIONAL_BLOCK_FIELD]}
                    onChange={(value) =>
                      updateFormData(FUNCTIONAL_BLOCK_FIELD, value)
                    }
                    error={errors[FUNCTIONAL_BLOCK_FIELD]}
                    dataIsAutocomplete={formData[FUNCTIONAL_BLOCK_FIELD]}
                    options={functionalBlockOptions}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_FUNCTIONAL_MAPPER}
                    dataFieldName={
                      SPECIFICATION_SCHEMA.FK_EQMS_PRODUCT_FUNCTIONAL_BLOCK_ID
                    }
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.MODELS_FIELD]
                ?.isRequired && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <MultiSelect
                    label={PERFORMANCE_SPECIFICATION_LABELS.MODELS_LABEL}
                    placeholder={PERFORMANCE_SPECIFICATION_PLACEHOLDERS.MODELS}
                    value={formData[MODELS_FIELD]}
                    onChange={(value) => updateFormData(MODELS_FIELD, value)}
                    error={errors[MODELS_FIELD]}
                    options={modelsOptions}
                    idField={MODEL_ID}
                    valueField={MODEL_NAME}
                    dataIsAutocomplete={formData[MODELS_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_MODELS_MAPPER}
                    dataFieldName={
                      SPECIFICATION_SCHEMA.FK_EQMS_PROJECT_PRODUCT_VARIANTS_ID
                    }
                    dataIsMultiSelect={true}
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.ACCURACY_LEVEL_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={
                      PERFORMANCE_SPECIFICATION_LABELS.ACCURACY_LEVEL_LABEL
                    }
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.ACCURACY_LEVEL
                    }
                    value={formData[ACCURACY_LEVEL_FIELD]}
                    onChange={(value) =>
                      updateFormData(ACCURACY_LEVEL_FIELD, value)
                    }
                    error={errors[ACCURACY_LEVEL_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.TOLERANCE_PERCENTAGE}
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.APPLICABLE_STANDARDS_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={
                      PERFORMANCE_SPECIFICATION_LABELS.APPLICABLE_STANDARDS_LABEL
                    }
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.APPLICABLE_STANDARDS
                    }
                    value={formData[APPLICABLE_STANDARDS_FIELD]}
                    onChange={(value) =>
                      updateFormData(APPLICABLE_STANDARDS_FIELD, value)
                    }
                    error={errors[APPLICABLE_STANDARDS_FIELD]}
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={SPECIFICATION_SCHEMA.APPLICABLE_STANDARDS}
                  />
                </Grid2>
              )}

              {}
              {/* Regular rendering for non-Shelf Life forms */}
              {title !== SPECIFICATION_NAMES.SHELF_LIFE && renderTypeField()}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.DESCRIPTION_FIELD]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RichTextEditor
                    label={PERFORMANCE_SPECIFICATION_LABELS.DESCRIPTION_LABEL}
                    value={formData[DESCRIPTION_FIELD]}
                    onChange={(value) =>
                      updateFormData(DESCRIPTION_FIELD, value)
                    }
                    error={errors[DESCRIPTION_FIELD]}
                    placeholder={
                      PERFORMANCE_SPECIFICATION_PLACEHOLDERS.DESCRIPTION
                    }
                    dataSourceName={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
                    dataFieldName={
                      SPECIFICATION_SCHEMA.SPECIFICATION_DESCRIPTION
                    }
                  />
                </Grid2>
              )}

              {}
              {formConfig[SPECIFICATION_FORM_FIELD.UPLOADED_FILE]
                ?.isRequired !== false && (
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <Box sx={BOX_STYLE}>
                    <FileUploadManager
                      initialFiles={formData?.uploadedFile ?? []}
                      onFileUpload={handleFileUpload}
                      onFileEdit={handleFileEdit}
                      onSubmit={handleFileSubmit}
                      subHeader={FILE_UPLOAD_SUB_HEADER}
                    />
                  </Box>
                </Grid2>
              )}
            </Grid2>
          </FormContent>

          <ButtonGroup buttons={buttons} />
        </FormContainer>
      </CommonModal>
    )
  }
)

export default CommonSpecificationForm
