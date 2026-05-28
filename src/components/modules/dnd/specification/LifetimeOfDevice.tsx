'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  RichTextEditor,
  Label,
} from '@/components/ui'
import { Grid2 } from '@mui/material'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { NUMBERMAP } from '@/constants/common'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { magicFormSave, KeysInterface } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import {
  CONTAINER,
  DESCRIPTION_DATA_FIELD,
  INSERT,
  UPDATE,
  LABELS,
  LIFE_TIME_DATA_SOURCE,
  LIFE_TIME_DEVICE_DATA_FIELD,
  OBJECT,
  PLACE_HOLDERS,
  REQUIRED_FIELD,
  SPECIFICATION_SCHEMA,
  VARIABLES,
} from '@/constants/modules/dnd/dirSpecificataion'
import {
  restructureData,
  mergeFinalFileData,
  COMMON_CONSTANTS,
} from '@/lib/utils/common'
import { DocumentStructure } from '@/types/common'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { UploadedFileData } from '@/types/modules/dnd/hld'
import { DeviceLifetimeFormProps } from '@/types/components/modules/dirSpecifications'
import { useLifetimeOfDevice } from '@/hooks/modules/dnd/useDigSpecification'
import { useCreateSpecification } from '@/hooks/modules/dnd/useDirSpecificataion'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'

/**
 Classification : Confidential
**/

const { EQMS_DIR_SUPPORTING_DOCUMENT, FK_EQMS_SUPPORTING_FILE_ID } =
  SPECIFICATION_SCHEMA
const { ACTIVE_STATUS, EMPTY_ARRAY_LENGTH, SUCCESS_CODE } = COMMON_CONSTANTS

const DEFAULT_FORM = {
  lifetimeOfDevice: '',
  description: '',
}

const DeviceLifetimeForm: React.FC<DeviceLifetimeFormProps> = ({
  specificationApplicabilityId,
  specificationName,
}) => {
  const formRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const projectId = params.id
  const router = useRouter()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [uploadFiles, setUploadFiles] = useState<
    (File | FileData2 | UploadedFileData)[]
  >([])
  const [finalFileData, setFinalFileData] = useState<DocumentStructure>({
    documents_to_create: [],
    documents_to_delete: [],
    create_meta_data: {},
    update_meta_data: {},
    local_files_to_delete: [],
  })

  // Track existing record ID for update operations
  const [existingRecordId, setExistingRecordId] = useState<number | null>(null)
  // Track loading state for save operation
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Fetch lifetime of device data using the API hook
  const { data: lifetimeData, refetch } = useLifetimeOfDevice(
    Number(specificationApplicabilityId)
  )

  // Refetch data when specificationApplicabilityId changes (for redirects)
  useEffect(() => {
    if (specificationApplicabilityId) {
      refetch()
    }
  }, [specificationApplicabilityId])

  // Hook for creating specification after successful magicSave
  const { mutate: createSpecification } = useCreateSpecification()

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!form.lifetimeOfDevice?.trim())
      newErrors.lifetimeOfDevice = REQUIRED_FIELD.LIFETIME_DEVICE
    if (!form.description?.trim())
      newErrors.description = REQUIRED_FIELD.DESCRIPTION_REQUIRED
    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  /**
   * Function Name: useEffect for API data
   * Params: NA
   * Description: Used to handle API response and prefill fields,
   * Author: Harsithiga B,
   * Created: 23-08-2025,
   * Modified:
   * Classification : Confidential
   */
  useEffect(() => {
    if (lifetimeData?.data) {
      const specificationData = lifetimeData.data[NUMBERMAP.ZERO]

      if (specificationData) {
        // Track existing record ID for update operations
        setExistingRecordId(specificationData.design_input_gathering_id ?? null)

        // Prefill form fields - ensure values are always strings, never undefined
        setForm((prev) => ({
          ...prev,
          lifetimeOfDevice: specificationData.lifetime_of_device ?? '',
          description: specificationData.specification_description ?? '',
        }))

        // Handle file data if available
        if (specificationData.documents) {
          setUploadFiles(specificationData.documents)
        }
      } else {
        setExistingRecordId(null)
        setForm(DEFAULT_FORM)
      }
    }
  }, [lifetimeData])

  const handleFileUpload = (newFile: File | FileData2) => {
    setUploadFiles((prev) => [...prev, newFile])
  }

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setUploadFiles((prev) => {
        const updatedFiles = prev.map((file) => {
          const currentId =
            typeof file === OBJECT
              ? ((file as FileData2).file_id ?? (file as FileData2).id)
              : undefined
          const updatedId = updatedFile.document_id ?? updatedFile.id
          return currentId === updatedId ? { ...file, ...updatedFile } : file
        })
        return updatedFiles
      })
    },
    [setUploadFiles]
  )

  /*
    Description: Modified to only include fileMetadata when files are uploaded,
    Author: Harsithiga B,
    Created: 21-08-2025,
    Classification : Confidential
  */
  const handleSave = async () => {
    if (!validate()) return

    // Disable save button while processing
    setIsSaving(true)

    let fileMetadata
    if (Object.keys(finalFileData).length) {
      const createTables = [
        {
          table: EQMS_DIR_SUPPORTING_DOCUMENT,
          idColumn: FK_EQMS_SUPPORTING_FILE_ID,
        },
      ]
      const updateTables = [
        {
          table: EQMS_DIR_SUPPORTING_DOCUMENT,
          idColumn: FK_EQMS_SUPPORTING_FILE_ID,
        },
      ]
      const deleteTableColumnMap = {
        eqms_dir_supporting_document: FK_EQMS_SUPPORTING_FILE_ID,
      }
      const hasDataInFinalFileData = Object.entries(finalFileData).some(
        ([key, val]) => {
          if (Array.isArray(val)) {
            return val.length > EMPTY_ARRAY_LENGTH
          }
          if (val && typeof val === OBJECT) {
            return Object.values(val).some((nestedVal) => {
              if (nestedVal && typeof nestedVal === OBJECT) {
                return Object.keys(nestedVal).length > EMPTY_ARRAY_LENGTH
              }
              return !!nestedVal
            })
          }
          return !!val
        }
      )

      if (hasDataInFinalFileData) {
        const output = restructureData(
          finalFileData,
          createTables,
          updateTables,
          deleteTableColumnMap
        )
        fileMetadata = {
          fileOperation: output,
          documents_to_create: finalFileData.documents_to_create,
        }
      }
    }

    let dataframeworkOtherParamsBag: KeysInterface = {
      eqms_dig_specification: [
        {
          fk_eqms_project_applicable_specification_id:
            specificationApplicabilityId,
          status: ACTIVE_STATUS,
        },
      ],
    }

    const keys = {
      eqms_dig_specification: existingRecordId
        ? {
            fk_eqms_project_applicable_specification_id: Number(
              specificationApplicabilityId
            ),
            id: existingRecordId,
          }
        : {
            fk_eqms_project_applicable_specification_id: Number(
              specificationApplicabilityId
            ),
          },
    }

    const magicSaveParams: any = {
      currentFormRef: formRef,
      dataframeworkOperatorType: existingRecordId ? UPDATE : INSERT,
      dataframeworkOtherParamsBag: existingRecordId
        ? {}
        : dataframeworkOtherParamsBag,
      keys: keys,
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
    }

    if (fileMetadata) {
      magicSaveParams.fileMetadata = fileMetadata
    }

    try {
      const response = await magicFormSave(magicSaveParams)
      if (response.response.code === SUCCESS_CODE) {
        if (!existingRecordId) {
          const specId =
            response.response.data[NUMBERMAP.ZERO].eqms_dig_specification[
              NUMBERMAP.ZERO
            ].id

          createSpecification({
            project_id: Number(projectId),
            eqms_dig_specification_id: specId,
          })
        }
        showActionAlert(SUCCESS)
      } else {
        showActionAlert(FAILED)
      }
    } catch {
      showActionAlert(FAILED)
    } finally {
      setIsSaving(false)
      refetch()
      setErrors({})
      setFinalFileData({
        documents_to_create: [],
        documents_to_delete: [],
        create_meta_data: {},
        update_meta_data: {},
        local_files_to_delete: [],
      })
    }
  }

  const handleCancel = () => {
    router.push(ROUTE_PATHS.DND_PROJECT_LIST)
  }

  return (
    <FormContainer ref={formRef} id={CONTAINER}>
      <FormWrapper>
        <Label title={specificationName} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={LABELS.LIFETIME}
                placeholder={PLACE_HOLDERS.LIFE_TIME}
                value={form.lifetimeOfDevice}
                onChange={(value: string) =>
                  handleChange(VARIABLES.LIFE_TIME, value)
                }
                error={errors.lifetimeOfDevice}
                dataSourceName={LIFE_TIME_DATA_SOURCE}
                dataFieldName={LIFE_TIME_DEVICE_DATA_FIELD}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELS.DESCRIPTION}
                value={form.description}
                onChange={(value: string) =>
                  handleChange(VARIABLES.DESCRIPTION, value)
                }
                placeholder={PLACE_HOLDERS.DESCRIPTION}
                error={errors.description}
                dataSourceName={LIFE_TIME_DATA_SOURCE}
                dataFieldName={DESCRIPTION_DATA_FIELD}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
              <FileUploadManager
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                initialFiles={uploadFiles ?? []}
                onSubmit={(data) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data))
                }}
              />
            </Grid2>
          </Grid2>
          <ButtonGroup
            buttons={[
              {
                label: LABELS.CANCEL,
                onClick: handleCancel,
                variant: LABELS.OUTLINE,
                disabled: isSaving,
              },
              {
                label: LABELS.SAVE,
                onClick: handleSave,
                variant: LABELS.CONTAINED,
                disabled: isSaving,
              },
            ]}
          />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default DeviceLifetimeForm
