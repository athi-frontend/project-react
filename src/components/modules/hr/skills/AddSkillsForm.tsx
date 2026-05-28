'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, InputField, showActionAlert } from '@/components/ui'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import {
  AddSkillFormData,
  AddSkillFormErrors,
  DocumentStructure,
  AddSkillPopupFormProps,
  FileSection,
} from '@/types/modules/hr/skill'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { useFetchSkillById } from '@/hooks/modules/hr/useSkill'
import {
  ADD_SKILLS,
  API_ERROR,
  CANCEL,
  CUSTOM_ALERT,
  DATA_SOURCE_NAME,
  DOCUMENTS,
  DUPLICATE_ENTRY,
  DUPLICATE_ENTRY_ERROR_TEXT,
  EDIT,
  EDIT_SKILL,
  ERROR,
  FIELD_NAME,
  FILE_SECTION_TABLES,
  FORM_ID,
  LABEL,
  PLACEHOLDER,
  SAVE,
  SIZE,
  SKILL_NAME,
  SKILL_NAME_DUPLICATE,
  SUB_HEADER,
  SUBMISSION_FAILED,
} from '@/constants/modules/hr/skill'
import { KeysInterface, magicFormSave } from '@/lib/utils/magicSave'
import {
  COMMON_CONSTANTS,
  mergeFinalFileData,
  FinalFileData
} from '@/lib/utils/common'

import magicSaveConstants from '@/constants/magicSave'
import {
  DEFAULT_ORGANIZATION_ID,
  DEFAULT_TENANT_ID,
  FINALFILEINITIALDATA,
  NUMBERMAP,
  STATUS,
} from '@/constants/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { prepareDraftDocumentsGeneric, DraftDocumentsConfig } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import {
  extractPreservedDocumentIds,
  filterDocumentsToDeleteArray,
  filterUpdateMetaData
} from '@/lib/utils/modules/hr/preservedDocumentsFilter'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { UploadedFileData } from '@/types/modules/hr/employeeList'

const INITIAL_FORM_DATA: AddSkillFormData = {
  skillName: '',
  uploadedFile: [],
}

const INITIAL_ERRORS: AddSkillFormErrors = {
  skillName: '',
}

const AddSkillPopupForm: React.FC<AddSkillPopupFormProps> = ({
  draftSkills,
  onClose,
  onSave,
  mode,
  skillId,
  skillModal,
  editSkillModal

}) => {
  const formRef = useRef<HTMLElement | null>(null)
  const [formData, setFormData] = useState<AddSkillFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<AddSkillFormErrors>(INITIAL_ERRORS)
  const [isLoading, setIsLoading] = useState(false)
  const [certificateFiles, setCertificateFiles] = useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [initialCertificateFiles, setInitialCertificateFiles] = useState<DocumentStructure[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // Skill draft configuration
  const SKILL_DRAFT_CONFIG: DraftDocumentsConfig = {
    fileFieldToSectionMap: {
      'none': 'supporting_files', // Single file section - use 'none' key
      'documents': 'supporting_files', // Alternative key for documents
    },
    sectionTypeToNameMap: {
      'none': 'supporting_files',
      'single': 'supporting_files',
    },
    responseDataKeyMap: {
      'none': 'eqms_hr_skill_supporting_files',
      'single': 'eqms_hr_skill_supporting_files',
      'draftDocuments': 'eqms_hr_skill_supporting_files',
    },
  }

  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'skill_master',
    enableFetch: false,
    context_instance_id: skillId ?? null,
  })

  const {
    data: skill,
    refetch,
    isLoading: isFetching,
    invalidateQuery,
  } = useFetchSkillById(
    mode === EDIT && skillId !== undefined ? skillId : NUMBERMAP.ZERO
  )
  useEffect(() => {
    if (mode === EDIT && skillId) {
      refetch()
    }
  }, [mode, skillId, refetch])

  useEffect(() => {
    if (skill?.data) {
      if (mode === EDIT && skill.data.length > NUMBERMAP.ZERO && !isFetching) {
        const skills = skill.data[NUMBERMAP.ZERO]
        setFormData({
          skillName: skills.skill_name ?? '',
        })
        setInitialCertificateFiles(skills.documents ?? [])
      }
    }
  }, [mode, skill, isFetching])

  useEffect(() => {
    if (skillModal) {
      setIsInitialLoad(false)
      setCertificateFiles(FINALFILEINITIALDATA)
      setInitialCertificateFiles([])
      setDraftDocuments({})
      setDraftDelete([])
      setFormData(INITIAL_FORM_DATA)
      fetchDraft()
    }
  }, [skillModal])

  useEffect(() => {
    if (draftSkills && draftSkills.length > NUMBERMAP.ZERO) {
      setFormData({
        skillName: draftSkills[NUMBERMAP.ZERO].skill_name ?? '',
      })
    }
  }, [draftSkills])

  useEffect(() => {
    if (draftData?.data) {
      // Get documents from draftDocuments if available, otherwise use documents
      const draftDocs = draftData?.data?.draftDocuments ?? []
      const serverDocs = draftData?.data?.documents ?? []

      // Combine server and draft documents, filtering to only include documents with file_id
      const allDocs = [...serverDocs, ...draftDocs].filter((doc: any) => {
        return doc?.file_id !== undefined && doc?.file_id !== null
      })

      setInitialCertificateFiles(allDocs)

      if (draftData.data?.skill_name) {
        setFormData({
          skillName: draftData.data.skill_name ?? '',
          uploadedFile: allDocs,
        })
      }

      // Initialize draftDocuments from draftData
      if (draftData?.data?.draftDocuments && typeof draftData?.data?.draftDocuments === 'object') {
        setDraftDocuments(draftData?.data?.draftDocuments)
      }

      // Initialize draftDelete from draftData
      if (draftData?.data?.draftDelete && Array.isArray(draftData?.data?.draftDelete)) {
        setDraftDelete(draftData?.data?.draftDelete)
      }
    }
  }, [draftData])

  const validateForm = (): boolean => {
    const newErrors: AddSkillFormErrors = { ...INITIAL_ERRORS }
    let isValid = true

    if (!formData.skillName.trim()) {
      newErrors.skillName = ERROR
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: keyof AddSkillFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (!isInitialLoad) {
        handleDraftSave(updated, certificateFiles)
      }
      return updated
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleDraftSave = (formData: AddSkillFormData, fileData?: FinalFileData) => {
    const finalFileData = fileData
    // Use the generic utility function for single file section
    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formData, documents: initialCertificateFiles },
      { 'none': finalFileData ?? FINALFILEINITIALDATA },
      draftData,
      SKILL_DRAFT_CONFIG
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      setDraftDelete(draftPreparation.draftDelete)
    }

    // Extract drafted documents from draftDocuments
    const extractedDraftDocuments = draftPreparation.draftDocuments['supporting_files'] ?? []
    const payload = {
      skill_id: skillId ?? new Date().getTime(),
      skill_name: formData.skillName,
      type: 'draft',
      status: NUMBERMAP.ONE,
      draftDelete: draftPreparation.draftDelete,
      draftDocuments: extractedDraftDocuments,
    }

    draftSave({
      form_type: 'hr_skill',
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileData?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        deleteDraftDocuments: draftPreparation?.documentsToDelete ?? [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    onClose?.()
    setFormData(INITIAL_FORM_DATA)
    setErrors(INITIAL_ERRORS)
  }
  const prepareFileMetadatas = () => {
    // Get all file_ids from draftData.data.documents (preserved documents)
    const preservedDocumentIds = extractPreservedDocumentIds(draftData)

    const createMetadata = {}
    const updateMetadata = {}
    const deleteMetadata = {}

    // Prepare modified certificateFiles with filtered deletions and updates
    const modifyCertificateFiles = { ...certificateFiles }

    // Filter out preserved documents from deletions
    const draftDeletedFiles = draftData?.data?.draftDelete?.['eqms_hr_skill_supporting_files'] ?? []
    const filteredDraftDelete = filterDocumentsToDeleteArray(preservedDocumentIds, draftDeletedFiles)
    const filteredFinalFileDelete = filterDocumentsToDeleteArray(preservedDocumentIds, certificateFiles.documents_to_delete ?? [])

    modifyCertificateFiles.documents_to_delete = [
      ...filteredFinalFileDelete,
      ...filteredDraftDelete,
    ].map(Number)

    // Filter out preserved documents from update_meta_data
    if (certificateFiles.update_meta_data && Object.keys(certificateFiles.update_meta_data).length > NUMBERMAP.ZERO) {
      modifyCertificateFiles.update_meta_data = filterUpdateMetaData(
        certificateFiles.documents_to_delete,
        certificateFiles.update_meta_data
      )
    }

    // Also filter draft update metadata if exists
    if (draftData?.data?.draftDocuments?.eqms_hr_skill_supporting_files || draftData?.data?.draftDocuments.length > NUMBERMAP.ZERO) {
      const filteredDraftUpdate = (draftData.data.draftDocuments ?? draftData?.data?.draftDocuments?.['eqms_hr_skill_supporting_files'] ?? []).filter((doc: any) => !certificateFiles?.documents_to_create?.includes(doc?.file_id))

      const UpdateMetaData = [...(filteredDraftUpdate?.filter((doc: any) => (doc?.file_id && doc?.source != '')) ?? [])]
      modifyCertificateFiles.update_meta_data = {
        ...modifyCertificateFiles.update_meta_data
      }
      UpdateMetaData.forEach((doc: any) => {
        modifyCertificateFiles.update_meta_data[doc?.file_id] = doc
      })
    }

    const addFilesToMetadata = (sectionKey: FileSection, files: DocumentStructure) => {
      if (Object.keys(files?.create_meta_data ?? {}).length > NUMBERMAP.ZERO) {
        createMetadata[FILE_SECTION_TABLES[sectionKey]] = Object.entries(
          files.create_meta_data
        ).reduce((acc, [fileName, fileData]) => {
          acc[fileName] = {
            ...fileData,
            fk_eqms_file_id: '{fileId}',
          }
          return acc
        }, {})
      }
      if (Object.keys(files?.update_meta_data ?? {}).length > NUMBERMAP.ZERO) {
        updateMetadata[FILE_SECTION_TABLES[sectionKey]] = Object.entries(
          files.update_meta_data
        ).reduce((acc, [fileName, fileData]) => {
          acc[fileName] = {
            ...fileData,
          }
          return acc
        }, {})
      }
    }

    addFilesToMetadata(DOCUMENTS, modifyCertificateFiles)

    if (modifyCertificateFiles?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      deleteMetadata["eqms_hr_skill_supporting_files"] = {
        fk_eqms_file_id: modifyCertificateFiles?.documents_to_delete?.map(Number),
      }
    }
    return {
      fileOperation: { create: createMetadata, update: updateMetadata, delete: deleteMetadata },
      documents_to_create: [...certificateFiles.documents_to_create],
    }
  }

  const getFileSetter = (section: FileSection) => {
    const setters: { [key in FileSection]?: (files: DocumentStructure[]) => void } = {
      eqms_hr_skill_supporting_files: setInitialCertificateFiles,
    }
    return setters[section]
  }

  const FileSetterFunction = useCallback(
    (
      section: FileSection,
      updateFile: (prev: DocumentStructure[], setter: (files: DocumentStructure[]) => void) => void
    ) => {
      const setter = getFileSetter(section)
      if (setter) {
        updateFile(initialCertificateFiles, setter)
      }
    },
    [initialCertificateFiles]
  )

  const handleFileUpload = useCallback(
    (newFile: File | UploadedFileData, section: FileSection) => {
      FileSetterFunction(section, (prev, setter) => {
        setter([...prev, newFile])
      })
    },
    [FileSetterFunction]
  )

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData, section: FileSection) => {
      FileSetterFunction(section, (prev, setter) => {
        setter(
          prev.map((file) => {
            const currentId = file.id ?? file.document_id
            const updatedId = updatedFile.id ?? updatedFile.document_id
            return currentId === updatedId ? { ...file, ...updatedFile } : file
          })
        )
      })
    },
    [FileSetterFunction]
  )

  const handleFileSubmit = useCallback(
    (data: DocumentStructure, section: FileSection) => {
      if (section === DOCUMENTS) {
        setCertificateFiles((prev) => {
          const finalFiles = mergeFinalFileData(prev, data) as FinalFileData
          handleDraftSave(formData, finalFiles)
          return finalFiles
        })
      }
    },
    [formData]
  )

  const handleSubmit = async () => {
    if (!validateForm()) return
    const result = prepareFileMetadatas()

    // Clear draft save when submitting final form
    clearDraftSave()

    let keyValue: KeysInterface =
      mode === EDIT
        ? {
          eqms_hr_skill_master: {
            id: skillId ?? NUMBERMAP.ZERO,
          },
        }
        : { eqms_hr_skill_master: { id: '' } }

    setIsLoading(true)
    try {
      const dataframeworkOtherParamsBag = {
        eqms_hr_skill_master: [
          {
            eqms_tenant_key: DEFAULT_TENANT_ID,
            fk_eqms_organization_id: DEFAULT_ORGANIZATION_ID,
            status: COMMON_CONSTANTS.ACTIVE_STATUS,
          },
        ],
      }

      // Filter out deleted documents from draftDocuments
      const filteredDocuments = draftData?.data?.documents?.filter((doc: any) =>
        !certificateFiles?.documents_to_delete?.includes(Number(doc.file_id))
      ) ?? []

      const response = await magicFormSave({
        currentFormRef: formRef,
        dataframeworkOperatorType:
          mode === EDIT ? COMMON_CONSTANTS.UPDATE : COMMON_CONSTANTS.INSERT,
        dataframeworkOtherParamsBag,
        keys: keyValue,
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
        fileMetadata: result,
        draftDocuments: filteredDocuments,
      })

      if ('error' in response) {
        throw new Error(response.error)
      }

      if (
        response.response &&
        typeof response.response === 'object' &&
        'code' in response.response &&
        response.response.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        onSave(formData)
        handleCancel()
        showActionAlert(STATUS.SUCCESS)
        if (mode === EDIT && skillId) {
          invalidateQuery()
        }
      } else if (response?.response?.message.includes(SKILL_NAME_DUPLICATE)) {
        customErrorMessage()
      } else {
        throw new Error(SUBMISSION_FAILED)
      }
    } catch (error) {
      console.error('Error during form submission:', error)
      showActionAlert(STATUS.FAILED)
    } finally {
      setIsLoading(false)
    }
  }

  const customErrorMessage = () => {
    showActionAlert(CUSTOM_ALERT, {
      title: DUPLICATE_ENTRY,
      text: DUPLICATE_ENTRY_ERROR_TEXT,
      icon: API_ERROR,
      cancelButton: false,
      confirmButton: false,
    })
  }
  return (
    <CommonModal
      onClose={() => handleCancel()}
      open={skillModal}
      title={editSkillModal ? EDIT_SKILL : ADD_SKILLS}
    >
      <ContentWrapper>
        {isDraftSaving && <DraftLoading />}
        <section id={FORM_ID} ref={formRef}>
          <Grid2 container spacing={1} sx={SIZE}>
            <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
              <InputField
                label={LABEL}
                placeholder={PLACEHOLDER}
                value={formData.skillName}
                onChange={(value: string) => handleInputChange(SKILL_NAME, value)}
                error={errors.skillName}
                disabled={isLoading ?? isFetching}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={FIELD_NAME}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                subHeader={SUB_HEADER}
                initialFiles={initialCertificateFiles ?? []}
                onFileUpload={(file) =>
                  handleFileUpload(file, DOCUMENTS)}
                onFileEdit={(file) => handleFileEdit(file, DOCUMENTS)}
                onSubmit={(data) => handleFileSubmit(data, DOCUMENTS)}
                error=""
              />
            </Grid2>
          </Grid2>
          <ButtonGroup
            buttons={[
              { label: CANCEL, onClick: handleCancel },
              {
                label: SAVE,
                onClick: handleSubmit,
                disabled: isLoading ?? isFetching,
              },
            ]}
          />
        </section>
      </ContentWrapper>
    </CommonModal>
  )
}

export default AddSkillPopupForm


