'use client'
import React from 'react'
import { Grid2, useTheme } from '@mui/material'
import { DataGridTable } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP } from '@/constants/common'
import { popup_style_P0 } from '@/styles/modules/dnd/preTransferDesignOutputDocument'
import { SYSTEM_GENERATE_TITLE } from '@/constants/modules/dnd/preTransferDesignOutputDocument'
import {
  FileInfoContainer,
  FileInfoLabel,
} from '@/styles/components/ui/fileUploadManagerV3'
import { FORM_DATA_VALUES } from '@/constants/components/ui/fileUpload'
import { useGetFileCategoryList, getfileURL } from '@/hooks/useCommonDropdown'
import { handleFileDownloadByUrl, handleFileDownloadUtil } from '@/lib/utils/common'
import { FileData } from '@/types/components/ui/fileUploadV3'
import { createFileTableColumns } from '@/utils/modules/dnd/fileTableColumns'

interface SystemGenerateModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  files: FileData[]
  setFiles: (files: FileData[]) => void
}

/**
    Classification : Confidential
**/
const SystemGenerateModal: React.FC<SystemGenerateModalProps> = ({
  open,
  onClose,
  onSave,
  files,
  setFiles,
}) => {
  const theme = useTheme()
  const { data: categoryList } = useGetFileCategoryList()

  const handleFileDownload = (row: any) => {
    const documentId = row.id ?? row.file_id
    if (row.file) {
      handleFileDownloadUtil({ name: row.name, blob: row.file })
    } else {
      getfileURL(documentId).then((response) => {
        handleFileDownloadByUrl(response?.data[NUMBERMAP.ZERO].assetUrl, row.name)
      })
    }
  }

  const handleEditClick = (row: FileData) => {
    // Edit functionality can be added here if needed
  }

  const columns = createFileTableColumns({
    categoryList,
    onDownload: handleFileDownload,
    onEdit: handleEditClick,
    useSmallSize: true,
    theme,
  })

  return (
    <CommonModal
      title={SYSTEM_GENERATE_TITLE}
      open={open}
      buttonRequired
      onClose={onClose}
      onSave={onSave}
    >
      <Grid2 sx={popup_style_P0}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <FileInfoContainer>
            <FileInfoLabel>Files Information</FileInfoLabel>
            <DataGridTable
              rows={files}
              columns={columns}
              idField={files.length > NUMBERMAP.ZERO && files[NUMBERMAP.ZERO]?.file_id ? 'file_id' : FORM_DATA_VALUES.ID}
              hideFooter
            />
          </FileInfoContainer>
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default SystemGenerateModal

