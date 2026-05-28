'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { popup_style_P0 } from '@/styles/modules/dnd/preTransferDesignOutputDocument'
import { mergeFinalFileData } from '@/lib/utils/common'
import { TITLE_NAME } from '@/constants/modules/dnd/preTransferDesignOutputDocument'

interface DocumentUploadModalProps {
  open: boolean
  onClose: () => void
  uploadFiles: any[]
  setUploadFiles: (files: any[]) => void
  onSave: () => void
  setFinalFileData: (data: any) => void
 
}
/**
    Classification : Confidential
**/
const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  open,
  onClose,
  uploadFiles,
  setUploadFiles,
  onSave,
  setFinalFileData,

}) => {
  return (
    <CommonModal
      title={TITLE_NAME}
      open={open}
      buttonRequired
      onClose={onClose}
      onSave={onSave}
    >
      <Grid2 sx={popup_style_P0}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
            <FileUploadManager
              onFileUpload={(files) => setUploadFiles(files)}
              onFileEdit={(files) => setUploadFiles(files)}
              initialFiles={uploadFiles}
              onSubmit={(data) => {
                setFinalFileData((prev: any) => mergeFinalFileData(prev, data))
              }}
            />
       
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default DocumentUploadModal