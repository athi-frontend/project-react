'use client'
import React, { useState, useEffect } from 'react'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {  Grid2 } from '@mui/material'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FILE_UPLOAD_SUB_HEADER, NUMBERMAP } from '@/constants/common'
import { FinalFileData, mergeFinalFileData } from '@/lib/utils/common'
import { FileData, FileDocument } from '@/types/components/ui/fileUploadV3'
import { popup_style_P0 } from '@/styles/modules/dnd/preTransferDesignOutputDocument'

const FINALFILEINITIALDATA: FinalFileData = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
}

interface UploadDocumentModalProps {
  open: boolean
  onClose: () => void
  onSave: (fileData: FinalFileData, groupId?: number | null) => void
  initialFiles?: File[] | FileDocument[]
  groupId?: number | null
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onClose,
  onSave,
  initialFiles = [],
  groupId = null,
  groupFiles = {},
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<File[] | FileDocument[]>([])
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [fileDataArray, setFileDataArray] = useState<FileData[]>([])

  // Reset and load state when modal opens
  useEffect(() => {
    if (open) {
      // Set initial files (includes both existing and local files)
      setUploadedDocuments(initialFiles ?? [])
      // Reset final file data - FileUploadManager will rebuild it from initialFiles
      // and track new local files through onSubmit callback
      if(Object.keys(groupFiles).length > NUMBERMAP.ZERO){
        setFinalFileData(groupFiles)
      }else{
        setFinalFileData(FINALFILEINITIALDATA)
      }
      // Extract FileData from initialFiles when modal opens
      const initialFileDataArray: FileData[] = initialFiles
        .filter((file) => !(file instanceof File) && (file).file !== undefined)
        .map((file) => file as unknown as FileData)
      setFileDataArray(initialFileDataArray)
    }
  }, [open, initialFiles])

  const handleFileUpload = (newFile: File | FileData) => {
    const fileData = newFile as FileData
    setUploadedDocuments((prev) => [...prev, newFile] as File[] | FileDocument[])
    setFileDataArray((prev) => [...prev, fileData])
  }

  const handleFileEdit = (updatedFile: File | FileData) => {
    const fileData = updatedFile as FileData
    setUploadedDocuments((prev) =>
      prev.map((file: any) => {
        const fileId = file.file_id ?? file.id
        const updatedId = (fileData as any).file_id ?? (fileData as any).id
        return fileId === updatedId ? { ...file, ...fileData } : file
      }) as File[] | FileDocument[]
    )
    // Update FileData in fileDataArray
    setFileDataArray((prev) =>
      prev.map((item) => {
        const itemId = item.id ?? item.file_id
        const updatedId = fileData.id ?? fileData.file_id
        return itemId === updatedId ? fileData : item
      })
    )
  }

  const handleFileSubmit = (data: FinalFileData) => {
    setFinalFileData((prev) => mergeFinalFileData(prev, data))
  }

  const handleSave = () => {
    let parentRow = [...fileDataArray]
    parentRow = parentRow?.filter((refile) => !finalFileData?.local_files_to_delete?.includes(refile?.file?.name.split('.')[NUMBERMAP.ZERO]))
    let saveData = {
      ...finalFileData,
      fileDataArray: parentRow,
    }
    onSave(saveData, groupId)
    // Reset state after saving
    setFinalFileData(FINALFILEINITIALDATA)
    setUploadedDocuments([])
    setFileDataArray([])
    onClose()
  }

  const handleCancel = () => {
    // Reset state on cancel
    setFinalFileData(FINALFILEINITIALDATA)
    setUploadedDocuments([])
    setFileDataArray([])
    onClose()
  }

  return (
    <CommonModal
      open={open}
      onClose={handleCancel}
      title="Upload Documents"
      onSave={handleSave}
      buttonRequired
    >
      <Grid2 sx={popup_style_P0}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
        
        <FileUploadManager
          initialFiles={uploadedDocuments}
          onFileUpload={handleFileUpload}
          onFileEdit={handleFileEdit}
          onSubmit={handleFileSubmit}
          subHeader={FILE_UPLOAD_SUB_HEADER}
        />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default UploadDocumentModal

