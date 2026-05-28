import { useState } from 'react'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import { FinalFileData, mergeFinalFileData } from '@/lib/utils/common'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'

export const useFileHandling = <T extends { documents?: (File | FileDocument)[] }>(
  formData: T,
  setFormData: (updater: (prev: T) => T) => void
) => {
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)

  const handleFileUpload = (file: any) => {
    const documents = formData?.documents ?? []
    const fileToAdd = file instanceof File ? file : file?.file
    if (fileToAdd) {
      setFormData((prev) => ({
        ...prev,
        documents: [...documents, fileToAdd],
      }))
    }
  }

  const handleFileEdit = (documents: any) => {
    setFormData((prev) => {
      const updatedFiles = (prev.documents ?? []).map((file: any) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined
        const updatedId = documents.document_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      return {
        ...prev,
        documents: updatedFiles,
      }
    })
  }

  const handleFileSubmit = (data: any) => {
    setFinalFileData((prev) => mergeFinalFileData(prev, data))
  }

  const appendFileFields = (formDataPayload: FormData, apiFieldKeys: {
    DOCUMENTS_TO_CREATE: string
    DOCUMENTS_TO_DELETE: string
    CREATE_META_DATA: string
    UPDATE_META_DATA?: string
  }) => {
    if (finalFileData?.documents_to_create?.length > NUMBERMAP.ZERO) {
      finalFileData.documents_to_create.forEach((file: File) => {
        if (file instanceof File) {
          formDataPayload.append(apiFieldKeys.DOCUMENTS_TO_CREATE, file, file.name)
        }
      })
    }

    if (finalFileData?.documents_to_delete && finalFileData.documents_to_delete.length > NUMBERMAP.ZERO) {
      formDataPayload.append(apiFieldKeys.DOCUMENTS_TO_DELETE, JSON.stringify(finalFileData.documents_to_delete))
    } else {
      formDataPayload.append(apiFieldKeys.DOCUMENTS_TO_DELETE, JSON.stringify([]))
    }

    const hasCreateMetaData = finalFileData?.create_meta_data && Object.keys(finalFileData.create_meta_data).length > NUMBERMAP.ZERO
    if (hasCreateMetaData) {
      formDataPayload.append(apiFieldKeys.CREATE_META_DATA, JSON.stringify(finalFileData.create_meta_data))
    } else {
      formDataPayload.append(apiFieldKeys.CREATE_META_DATA, JSON.stringify({}))
    }

    if (apiFieldKeys.UPDATE_META_DATA && finalFileData?.update_meta_data && Object.keys(finalFileData.update_meta_data).length > NUMBERMAP.ZERO) {
      formDataPayload.append(apiFieldKeys.UPDATE_META_DATA, JSON.stringify(finalFileData.update_meta_data))
    }
  }

  const resetFileData = () => {
    setFinalFileData(FINALFILEINITIALDATA)
  }

  return {
    finalFileData,
    handleFileUpload,
    handleFileEdit,
    handleFileSubmit,
    appendFileFields,
    resetFileData,
  }
}

