'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Grid2 } from '@mui/material'
import {
  ButtonGroup,
  InputField,
  Description,
  MultiSelect,
  Label,
  showActionAlert,
} from '@/components/ui'
import { Content, Container, FormSection } from '@/styles/modules/dnd/market'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import { mergeFinalFileData } from '@/lib/utils/common'
import {  FORM_FIELDS_CONFIG } from '@/constants/modules/dnd/project'
import { GRID_SIZES } from '@/styles/modules/dnd/project'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { CANCEL, EQUIPMENT_DROPDOWN, FORM_TITLE_INSTALLATION, ID_FIELD, INPUT_ONCHANGE, INSTALLATION_ID, INSTALLATION_LIST_SCREEN, LABELS, PLACEHOLDER, SAVE, SKILLS, TOOLS_DROPDOWN, VALIDATIONS, VALUE_FIELD, FIELD_ORDER, FIELD_LABEL_MAP } from '@/constants/modules/dnd/installation'
import { InfoLabel, InfoValue } from '@/styles/modules/hr/addEmployee'
import {
  useEquipment,
  useInstallationById,
  usePostInstallation,
  useSkill,
  useTools,
} from '@/hooks/modules/dnd/useInstallationProcedure'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import { UploadedFileData, DocumentStructure } from '@/types/modules/dnd/hld'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import { InstallationProcedure } from '@/types/modules/dnd/installation'
import { API_FIELD_KEYS } from '@/constants/modules/dnd/hld'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

/**
    Classification : Confidential
**/

const CreateNewProject: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const project_id = params.id
  const installation_procedure_id = searchParams.get(INSTALLATION_ID)
  const { mutate: mutateInstallation } = usePostInstallation()
  const { data: TOOL_OPTIONS, isLoading: isToolsLoading, isFetching: isToolsFetching } = useTools()
  const { data: EQUIPMENT_OPTIONS, isLoading: isEquipmentLoading, isFetching: isEquipmentFetching } = useEquipment()
  const { data: SKILL_OPTIONS, isLoading: isSkillLoading, isFetching: isSkillFetching } = useSkill()
  const { data: InstallationData, isLoading: isInstallationLoading, isFetching: isInstallationFetching} = useInstallationById(
    Number(installation_procedure_id) || NUMBERMAP.ZERO
  )

  // Create loading function
  const isAnyLoading = () => {
    if (isToolsLoading) return true;
    if (isToolsFetching) return true;
    if (isEquipmentLoading) return true;
    if (isEquipmentFetching) return true;
    if (isSkillLoading) return true;
    if (isSkillFetching) return true;
    if (isInstallationLoading) return true;
    if (isInstallationFetching) return true;
    return false;
  };

  const [installationFormData, setInstallationFormData] =
    React.useState<InstallationProcedure>({
      skills: [],
      type: '',
      tools: [],
      equipment: [],
      safety_and_precautions: '',
      description: '',
      documents: [] as File[] | FileDocument[],
      project_id: '',
    })
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [errors, setErrors] = React.useState<any>({})

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setInstallationFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev: any) => ({
      ...prev,
      [field]: '', // Clear error on change
    }))
  }

  const handleFileUpload = (newFile: File | FileData2) => {
    setInstallationFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newFile] as File[] | FileDocument[],
    }))

    if (errors.documents) {
      setErrors((prev) => ({
        ...prev,
        documents: '',
      }))
    }
  }
  useEffect(() => {
    if (InstallationData?.data) {
      const employee = InstallationData.data
      const formData = {
        ...employee,
        [EQUIPMENT_DROPDOWN]: (employee.equipment ?? []).map((item) => item?.id),
        [SKILLS]: (employee.skills ?? []).map((item) => item?.id),
        [TOOLS_DROPDOWN]: (employee.tools ?? []).map((item) => item?.id),
      }
      setInstallationFormData(formData)
    }
  }, [InstallationData])

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setInstallationFormData((prev) => {
        const updatedFiles = prev.documents.map((file) => {
          const currentId =
            typeof file === 'object'
              ? ((file as File).file_id ?? (file as UploadedFileData).id)
              : undefined
          const updatedId = updatedFile.document_id ?? updatedFile.id

          return currentId === updatedId ? { ...file, ...updatedFile } : file
        })

        return {
          ...prev,
          documents: updatedFiles,
        }
      })
    },
    []
  )

  const handleSave = () => {
    const formData = new FormData()
    const newErrors: any = {}
    if (!installationFormData.description) {
      newErrors.description = VALIDATIONS.DESCRIPTIONS
    }
    if (!installationFormData.skills.length) {
      newErrors.skills = VALIDATIONS.SKILLS
    }
    if (!installationFormData.type) {
      newErrors.type = VALIDATIONS.TYPE
    }
    if (!installationFormData.tools.length) {
      newErrors.tools = VALIDATIONS.TOOLS
    }
    if (!installationFormData.equipment.length) {
      newErrors.equipment = VALIDATIONS.EQUIPMENT
    }
    if (!installationFormData.safety_and_precautions) {
      newErrors.safety_and_precautions = VALIDATIONS.SAFETY
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(installationFormData, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    const fieldsToAppend = {
      description: installationFormData.description,
      project_id: Number(project_id),
      installation_procedure_id: installationFormData.installation_procedure_id,
      skills: installationFormData.skills,
      type: installationFormData.type,
      tools: installationFormData.tools,
      equipment: installationFormData.equipment,
      safety_and_precautions: installationFormData.safety_and_precautions,
      [API_FIELD_KEYS.DOCUMENTS_TO_DELETE]:
        finalFileData.documents_to_delete ?? [],
      [API_FIELD_KEYS.CREATE_META_DATA]: finalFileData.create_meta_data ?? [],
      [API_FIELD_KEYS.UPDATE_META_DATA]: finalFileData.update_meta_data ?? [],
    }
    finalFileData?.documents_to_create?.forEach((fileData) => {
      if (fileData instanceof File) {
        formData.append(
          API_FIELD_KEYS.DOCUMENTS_TO_CREATE,
          fileData,
          fileData.name
        )
      }
    })

    if (Object.keys(newErrors).length === NUMBERMAP.ZERO) {
      Object.entries(fieldsToAppend).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const shouldStringify = typeof value === 'object' && value !== null;
          formData.append(key, shouldStringify ? JSON.stringify(value) : String(value))
        }
      })

      mutateInstallation(formData, {
        onSuccess: () => {
          showActionAlert(SUCCESS)
          router.push(pathName)
        },
        onError: () => {
          showActionAlert(FAILED)
        }
      })
    }
  }

const pathName = INSTALLATION_LIST_SCREEN(Number(project_id));

   const handleCancel = () => {
      router.push(pathName)
    }

  return (
    <Container>
      <GlobalLoader loading={isAnyLoading()} />
          <Label title={FORM_TITLE_INSTALLATION} />
          <Content>
        <FormSection>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <InfoLabel>Step#</InfoLabel>
               <InfoValue>{InstallationData?.data?.step_counter??'-'}</InfoValue>
            </Grid2>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <Description
                {...FORM_FIELDS_CONFIG.PRODUCT_DESCRIPTION}
                value={installationFormData.description ?? ''}
                onChange={(value: string | null) =>
                  handleInputChange(INPUT_ONCHANGE.DESCRIPTIONS, value)
                }
                error={errors.description ?? ''}
                placeholder = {PLACEHOLDER.DESCRIPTION}
              />
            </Grid2>
            <Grid2 size={GRID_SIZES.FULL_WIDTH}>
        
              <FileUploadManager
                initialFiles={installationFormData.documents}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={(data) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data))
                }}

              />
            </Grid2>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <MultiSelect
                label= {LABELS.SKILL_LABEL}
                options={SKILL_OPTIONS?.data ?? []}
                idField= {ID_FIELD.SKILL}
                valueField={VALUE_FIELD.SKILL}
                value={installationFormData.skills}
                onChange={(value) => handleInputChange(INPUT_ONCHANGE.SKILLS, value)}
                error={
                  Array.isArray(errors.skills)
                    ? errors.skills.join(',')
                    : (errors.skills ?? '')
                }
                placeholder={PLACEHOLDER.SKILLS}
              />
            </Grid2>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <InputField
                label={LABELS.TYPE}
                value={installationFormData.type}
                onChange={(value) => handleInputChange(INPUT_ONCHANGE.TYPE, value)}
                error={errors.type ?? ''}
                placeholder={PLACEHOLDER.TYPE}
              />
            </Grid2>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <MultiSelect
                label={LABELS.TOOLS}
                options={TOOL_OPTIONS?.data ?? []}
                idField={ID_FIELD.TOOLS}
                valueField={VALUE_FIELD.TOOLS}
                value={installationFormData.tools}
                onChange={(value) => handleInputChange(INPUT_ONCHANGE.TOOLS, value)}
                error={
                  Array.isArray(errors.tools)
                    ? errors.tools.join(', ')
                    : (errors.tools ?? '')
                }
                placeholder={PLACEHOLDER.TOOLS}
              />
            </Grid2>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <MultiSelect
                idField={ID_FIELD.EQUIPMENT}
                label={LABELS.EQUIPMENT}
                valueField={VALUE_FIELD.EQUIPMENT}
                options={EQUIPMENT_OPTIONS?.data ?? []}
                value={installationFormData.equipment}
                onChange={(value) => handleInputChange(INPUT_ONCHANGE.EQUIPMENT, value)}
                error={
                  Array.isArray(errors.equipment)
                    ? errors.equipment.join(', ')
                    : (errors.equipment ?? '')
                }
                placeholder={PLACEHOLDER.EQUIPMENT}
              />
            </Grid2>
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <Description
                {...FORM_FIELDS_CONFIG.SAFETY_PRECAUTIONS}
                label= {LABELS.SAFETY}
                value={installationFormData.safety_and_precautions ?? ''}
                onChange={(value: string | null) =>
                  handleInputChange(INPUT_ONCHANGE.SAFETY, value)
                }
                error={errors.safety_and_precautions}
              />
            </Grid2>
          </Grid2>
        </FormSection>
        <ButtonGroup
          buttons={[
              {
              label: CANCEL,
              onClick: handleCancel
            },
            {
              label: SAVE,
              onClick: handleSave,
            },
          
          ]}
        />
          </Content>
    </Container>

  )

}

export default CreateNewProject
