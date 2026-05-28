'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Grid2 } from '@mui/material'
import {
  ButtonGroup,
  Label,
  InputField,
  DataGridTable,
  RichTextEditor,
  RadioButtonGroup,
  showActionAlert,
} from '@/components/ui'
import { PageContainer, P20P40 } from '@/styles/common'
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { useFetchModels } from '@/hooks/modules/dnd/useDirSpecificataion'
import {
  useStorageTypes,
  usePackagingStorageInstructionById,
  usePostPackagingStorageInstruction,
} from '@/hooks/modules/production/usePackageStorageInstructions'
import { FileData, FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  BUTTONLABELS,
  FinalFileData,
  mergeFinalFileData,
  isDocumentUploadValid,
} from '@/lib/utils/common'
import { PackageStorageInstructionFormData } from '@/types/modules/production/packageStorageInstructions'
import {
  INITIAL_FORM_DATA,
  PACKAGE_STORAGE_INSTRUCTIONS,
  PACKAGE_STORAGE_INSTRUCTIONS_COLUMNS,
} from '@/constants/modules/production/packageStorageInstructions'
import { DOCUMENT_UPLOAD_CONSTANTS } from '@/constants/modules/production/common'
import { radioOptions } from '@/lib/modules/dnd/dir'

/**
 * Classification: Confidential
 * Package Storage Instructions Page
 */

const PackageStorageInstructionsPage: React.FC = () => {
  const router = useRouter()
  const { id } = useParams()
  const projectId = id && !isNaN(Number(id)) ? Number(id) : null

  const [formData, setFormData] =
    useState<PackageStorageInstructionFormData>(INITIAL_FORM_DATA)
  // Fetch instruction data by ID (if editing)
  const { data: instructionData, isLoading: isLoadingInstruction } =
    usePackagingStorageInstructionById(
      formData.model_id !== '' && formData.model_id !== null
        ? formData.model_id
        : null,
      projectId
    )

  const [packagingFinalFileData, setPackagingFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [storageFinalFileData, setStorageFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)

  // Validation errors state
  const [errors, setErrors] = useState<
    Partial<Record<keyof PackageStorageInstructionFormData | string, string>>
  >({})

  // Get project ID from fetched instruction data

  // Fetch models using the same hook as dnd dir specifications
  // Only fetch if we have a project_id (either from fetched data or if id is project_id)
  const { data: modelsData, isLoading: isLoadingModels } = useFetchModels(
    id?.toString() ?? '',
    NUMBERMAP.ONE
  )

  // Fetch storage types
  const { data: storageTypesData, isLoading: isLoadingStorageTypes } =
    useStorageTypes()

  // POST mutation hook
  const postPackagingStorageInstructionMutation =
    usePostPackagingStorageInstruction(projectId)

  // Prefill form data when instruction data is fetched
  useEffect(() => {
    if (
      instructionData?.data &&
      Array.isArray(instructionData.data) &&
      instructionData.data.length > NUMBERMAP.ZERO
    ) {
      const data = instructionData.data[NUMBERMAP.ZERO]
      setFormData((prev) => ({
        ...prev,
        // model_id: data.model_id ? String(data.model_id) : prev.model_id,
        storage_type_id:
          data.storage_type_id !== null
            ? data.storage_type_id.toString()
            : null,
        is_dismantle_during_packing:
          data.is_dismantle_during_packing !== null
            ? data.is_dismantle_during_packing.toString()
            : null,
        is_assemble_complete_unit:
          data.is_assemble_complete_unit !== null
            ? data.is_assemble_complete_unit.toString()
            : null,
        specific_instruction: data.specific_instruction ?? '',
        remarks: data.remarks ?? '',
        packaging_materials_required: data.packaging_materials_required ?? [],
        packaging_instruction_supporting_file_documents:
          data.packaging_instruction_supporting_file_documents ?? [],
        storage_instruction_supporting_file_documents:
          data.storage_instruction_supporting_file_documents ?? [],
      }))
    }
  }, [instructionData, formData.model_id])

  // Columns moved to constants
  const columns = PACKAGE_STORAGE_INSTRUCTIONS_COLUMNS

  const buildPayload = (formData: PackageStorageInstructionFormData) => {
    const payload = new FormData()
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.PROJECT_ID,
      projectId?.toString() ?? ''
    )
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.MODEL_ID,
      formData.model_id?.toString() ?? ''
    )
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.STORAGE_TYPE_ID,
      formData.storage_type_id?.toString() ?? ''
    )
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.IS_DISMANTLE_DURING_PACKING,
      formData.is_dismantle_during_packing?.toString() ?? ''
    )
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.IS_ASSEMBLE_COMPLETE_UNIT,
      formData.is_assemble_complete_unit?.toString() ?? ''
    )
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.SPECIFIC_INSTRUCTION,
      formData.specific_instruction ?? ''
    )
    payload.append(
      PACKAGE_STORAGE_INSTRUCTIONS.FORM_FIELDS.REMARKS,
      formData.remarks ?? ''
    )

    if (
      Object.keys(packagingFinalFileData.create_meta_data).length >
        NUMBERMAP.ZERO ||
      Object.keys(storageFinalFileData.create_meta_data).length > NUMBERMAP.ZERO
    ) {
      payload.append(
        DOCUMENT_UPLOAD_CONSTANTS.CREATE_META_DATA,
        JSON.stringify({
          packaging_instruction_documents:
            packagingFinalFileData.create_meta_data,
          storage_instruction_documents: storageFinalFileData.create_meta_data,
        })
      )
    }

    if (
      Object.keys(packagingFinalFileData.update_meta_data).length >
        NUMBERMAP.ZERO ||
      Object.keys(storageFinalFileData.update_meta_data).length > NUMBERMAP.ZERO
    ) {
      //update
      payload.append(
        DOCUMENT_UPLOAD_CONSTANTS.UPDATE_META_DATA,
        JSON.stringify({
          ...packagingFinalFileData.update_meta_data,
          ...storageFinalFileData.update_meta_data,
        })
      )
    }

    //delete
    if (
      packagingFinalFileData.documents_to_delete.length > NUMBERMAP.ZERO ||
      storageFinalFileData.documents_to_delete.length > NUMBERMAP.ZERO
    ) {
      payload.append(
        DOCUMENT_UPLOAD_CONSTANTS.DOCUMENTS_TO_DELETE,
        JSON.stringify([
          ...(packagingFinalFileData.documents_to_delete ?? []),
          ...(storageFinalFileData.documents_to_delete ?? []),
        ])
      )
    }
    // Combine and append all files to create
    const allDocumentsToCreate = [
      ...(packagingFinalFileData.documents_to_create ?? []),
      ...(storageFinalFileData.documents_to_create ?? []),
    ]
    allDocumentsToCreate.forEach((file: File) => {
      if (file instanceof File) {
        payload.append(
          DOCUMENT_UPLOAD_CONSTANTS.DOCUMENTS_TO_CREATE,
          file,
          file.name
        )
      }
    })

    return payload
  }

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof PackageStorageInstructionFormData | string, string>
    > = {}

    // 1. Model selection is mandatory
    if (!formData.model_id || formData.model_id === '') {
      newErrors.model_id = PACKAGE_STORAGE_INSTRUCTIONS.FORM_ERRORS.MODEL
    }

    // 2. Storage mode is mandatory
    if (
      formData.storage_type_id === null ||
      formData.storage_type_id === undefined ||
      formData.storage_type_id === ''
    ) {
      newErrors.storage_type_id =
        PACKAGE_STORAGE_INSTRUCTIONS.FORM_ERRORS.STORAGE_TYPE
    }

    // 3. At least one radio value must be recorded under applicable condition
    if (formData.storage_type_id) {
      const storageTypeId = formData.storage_type_id.toString()
      // If storage type is '1', then is_assemble_complete_unit must be set
      if (storageTypeId === NUMBERMAP.TWO.toString()) {
        if (
          formData.is_assemble_complete_unit === null ||
          formData.is_assemble_complete_unit === ''
        ) {
          newErrors.is_assemble_complete_unit =
            PACKAGE_STORAGE_INSTRUCTIONS.FORM_ERRORS.IS_ASSEMBLE_COMPLETE_UNIT
        }
      }
      // If storage type is '2', then is_dismantle_during_packing must be set
      else if (storageTypeId === NUMBERMAP.ONE.toString()) {
        if (
          formData.is_dismantle_during_packing === null ||
          formData.is_dismantle_during_packing === ''
        ) {
          newErrors.is_dismantle_during_packing =
            PACKAGE_STORAGE_INSTRUCTIONS.FORM_ERRORS.IS_DISMANTLE_DURING_PACKING
        }
      }
    }

    // Validate Package Instruction files using standard utility function
    if (!isDocumentUploadValid(packagingFinalFileData, formData.packaging_instruction_supporting_file_documents)) {
      newErrors.packaging_instruction_supporting_file_documents =
        PACKAGE_STORAGE_INSTRUCTIONS.FORM_ERRORS.PACKAGING_INSTRUCTION_FILE_REQUIRED
    }

    // Validate Storage Instruction files using standard utility function
    if (!isDocumentUploadValid(storageFinalFileData, formData.storage_instruction_supporting_file_documents)) {
      newErrors.storage_instruction_supporting_file_documents =
        PACKAGE_STORAGE_INSTRUCTIONS.FORM_ERRORS.STORAGE_INSTRUCTION_FILE_REQUIRED
    }

    // 4. Mandatory file properties should be captured during upload
    // Check packaging instruction files - only validate files that are newly uploaded or being updated

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    // Validate form before saving
    if (!validateForm()) {
      return
    }

    const payload = buildPayload(formData)
    postPackagingStorageInstructionMutation.mutate(payload, {
      onSuccess: () => {
        // Reset file data states after successful save to prevent re-sending documents_to_delete
        setPackagingFinalFileData(FINALFILEINITIALDATA)
        setStorageFinalFileData(FINALFILEINITIALDATA)
        setErrors({})
        showActionAlert(STATUS.SUCCESS)
      },
    })
  }

  const handleCancel = () => {
    router.push('')
  }

  // Common handle change function for all form fields
  const handleChange = (
    field: keyof PackageStorageInstructionFormData,
    value: string | number | null
  ) => {
    if (field === PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS.MODEL_ID) {
      setFormData(INITIAL_FORM_DATA)
    }

    if (field === PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS.STORAGE_TYPE_ID) {
      setFormData((prev) => ({
        ...prev,
        is_dismantle_during_packing: null,
        is_assemble_complete_unit: null,
      }))
      // Clear radio button errors when storage type changes
      setErrors((prev) => ({
        ...prev,
        is_dismantle_during_packing: '',
        is_assemble_complete_unit: '',
      }))
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for the field being changed
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Handle Package Instruction file edit
  const handlePackageInstructionFileEdit = (updatedFile: FileData) => {
    setFormData((prev) => {
      const updatedFiles =
        prev.packaging_instruction_supporting_file_documents.map((file) => {
          const currentId = file.id
          const updatedId = updatedFile.id

          return currentId === updatedId ? { ...file, ...updatedFile } : file
        }) as (FileDocument | FileData)[]

      return {
        ...prev,
        packaging_instruction_supporting_file_documents: updatedFiles,
      }
    })
  }

  // Handle Package Instruction file upload
  const handlePackageInstructionFileUpload = (newFile: FileData) => {
    setFormData((prev) => ({
      ...prev,
      packaging_instruction_supporting_file_documents: [
        ...(prev.packaging_instruction_supporting_file_documents ?? []),
        newFile,
      ] as (FileDocument | FileData)[],
    }))
    // Clear error when file is uploaded
    if (errors.packaging_instruction_supporting_file_documents) {
      setErrors((prev) => ({
        ...prev,
        packaging_instruction_supporting_file_documents: '',
      }))
    }
  }

  // Handle Storage Instruction file edit
  const handleStorageInstructionFileEdit = (updatedFile: FileData) => {
    setFormData((prev) => {
      const updatedFiles =
        prev.storage_instruction_supporting_file_documents.map((file) => {
          const currentId = file.id
          const updatedId = updatedFile.id

          return currentId === updatedId
            ? ({ ...file, ...updatedFile } as FileDocument | FileData)
            : file
        })

      return {
        ...prev,
        storage_instruction_supporting_file_documents: updatedFiles as (
          | FileDocument
          | FileData
        )[],
      }
    })
  }

  // Handle Storage Instruction file upload
  const handleStorageInstructionFileUpload = (newFile: FileData) => {
    setFormData((prev) => ({
      ...prev,
      storage_instruction_supporting_file_documents: [
        ...(prev.storage_instruction_supporting_file_documents ?? []),
        newFile,
      ],
    }))
    // Clear error when file is uploaded
    if (errors.storage_instruction_supporting_file_documents) {
      setErrors((prev) => ({
        ...prev,
        storage_instruction_supporting_file_documents: '',
      }))
    }
  }

  return (
    <PageContainer>
      <Label title={PACKAGE_STORAGE_INSTRUCTIONS.PAGE_TITLE} />

      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InputField
            label={PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.MODEL}
            isDropdown
            options={modelsData?.data}
            keyField={PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS.MODEL_ID}
            valueField={PACKAGE_STORAGE_INSTRUCTIONS.VALUE_FIELDS.MODEL}
            placeholder={PACKAGE_STORAGE_INSTRUCTIONS.FORM_PLACEHOLDERS.MODEL}
            value={formData.model_id ? String(formData.model_id) : ''}
            onChange={(value: string) =>
              handleChange(
                PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                  .MODEL_ID as keyof PackageStorageInstructionFormData,
                value
              )
            }
            disabled={isLoadingModels}
            error={errors.model_id}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title={PACKAGE_STORAGE_INSTRUCTIONS.TABLE_NAME.PACKAGE_TABLE_NAME}
            rows={formData?.packaging_materials_required}
            columns={columns}
            idField={PACKAGE_STORAGE_INSTRUCTIONS_COLUMNS[NUMBERMAP.ONE].field}
            loading={isLoadingInstruction}
            hideFooter={true}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InputField
            label={PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.STORAGE_TYPE}
            isDropdown
            options={storageTypesData?.data}
            keyField={PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS.STORAGE_TYPE_ID}
            valueField={PACKAGE_STORAGE_INSTRUCTIONS.VALUE_FIELDS.STORAGE_TYPE}
            placeholder={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_PLACEHOLDERS.STORAGE_TYPE_MODEL
            }
            value={formData.storage_type_id?.toString() ?? ''}
            onChange={(value: string) =>
              handleChange(
                PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                  .STORAGE_TYPE_ID as keyof PackageStorageInstructionFormData,
                value
              )
            }
            disabled={isLoadingStorageTypes}
            error={errors.storage_type_id}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <RadioButtonGroup
            label={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS
                .IS_DISMANTLE_DURING_PACKING
            }
            name={
              PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                .IS_DISMANTLE_DURING_PACKING
            }
            options={radioOptions}
            value={formData.is_dismantle_during_packing?.toString() ?? ''}
            onChange={(value: string | number) =>
              handleChange(
                PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                  .IS_DISMANTLE_DURING_PACKING as keyof PackageStorageInstructionFormData,
                value
              )
            }
            disabled={formData.storage_type_id === NUMBERMAP.TWO.toString()}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <RadioButtonGroup
            label={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.IS_ASSEMBLE_COMPLETE_UNIT
            }
            name={
              PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS.IS_ASSEMBLE_COMPLETE_UNIT
            }
            options={radioOptions}
            value={formData.is_assemble_complete_unit?.toString() ?? ''}
            onChange={(value: string | number) =>
              handleChange(
                PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                  .IS_ASSEMBLE_COMPLETE_UNIT as keyof PackageStorageInstructionFormData,
                value
              )
            }
            disabled={formData.storage_type_id === NUMBERMAP.ONE.toString()}
            error={errors.is_assemble_complete_unit}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <FileUploadManager
            onSubmit={(data) => {
              setPackagingFinalFileData((prev) =>
                mergeFinalFileData(prev, data)
              )
              setErrors((prev) => ({
                ...prev,
                packaging_instruction_supporting_file_documents: '',
              }))
            }}
            initialFiles={
              formData.packaging_instruction_supporting_file_documents as FileDocument[]
            }
            onFileUpload={handlePackageInstructionFileUpload}
            onFileEdit={handlePackageInstructionFileEdit}
            subHeader={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.PACKAGING_INSTRUCTIONS
            }
            uploadMandError={
              errors.packaging_instruction_supporting_file_documents
            }
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <FileUploadManager
            onSubmit={(data) => {
              setStorageFinalFileData((prev) => mergeFinalFileData(prev, data))
              setErrors((prev) => ({
                ...prev,
                storage_instruction_supporting_file_documents: '',
              }))
            }}
            initialFiles={
              formData.storage_instruction_supporting_file_documents as FileDocument[]
            }
            onFileUpload={handleStorageInstructionFileUpload}
            onFileEdit={handleStorageInstructionFileEdit}
            subHeader={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.STORAGE_INSTRUCTIONS
            }
            uploadMandError={
              errors.storage_instruction_supporting_file_documents
            }
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <RichTextEditor
            label={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.SPECIFIC_INSTRUCTION
            }
            placeholder={
              PACKAGE_STORAGE_INSTRUCTIONS.FORM_PLACEHOLDERS
                .SPECIFIC_INSTRUCTION
            }
            value={formData.specific_instruction}
            onChange={(value: string) =>
              handleChange(
                PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                  .SPECIFIC_INSTRUCTION as keyof PackageStorageInstructionFormData,
                value
              )
            }
            error={errors.specific_instruction}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <RichTextEditor
            label={PACKAGE_STORAGE_INSTRUCTIONS.FORM_LABELS.REMARKS}
            placeholder={PACKAGE_STORAGE_INSTRUCTIONS.FORM_PLACEHOLDERS.REMARKS}
            value={formData.remarks}
            onChange={(value: string) =>
              handleChange(
                PACKAGE_STORAGE_INSTRUCTIONS.KEY_FIELDS
                  .REMARKS as keyof PackageStorageInstructionFormData,
                value
              )
            }
            error={errors.remarks}
          />
        </Grid2>
      </Grid2>

      <div style={P20P40}>
        <ButtonGroup
          buttons={[
            {
              label: BUTTONLABELS.BUTTON_LABEL_CANCEL,
              onClick: handleCancel,
            },
            {
              label: BUTTONLABELS.BUTTON_LABEL_SAVE,
              onClick: handleSave,
            },
          ]}
        />
      </div>
    </PageContainer>
  )
}

export default PackageStorageInstructionsPage
