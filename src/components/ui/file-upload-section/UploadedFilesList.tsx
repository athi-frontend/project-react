/**
 * Classification : Confidential
 */

import React from 'react'
import UploadedFileItem from './UploadedFileItem'
import { ListLabel, ListContainer } from '@/styles/components/ui/fileupload'
import { UploadedFilesListProps } from '@/types/components/ui/fileUpload'
import { Box } from '@mui/material'
const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  files,
  onDelete,
  label = 'Uploaded Files'
}) => {
  return (
    <ListContainer>
      <ListLabel>{label}</ListLabel>
      <Box sx={{height:"100px",overflowY:"auto",scrollbarWidth:"none"}}>
      {files?.map((file, index) => (
        <UploadedFileItem
          key={JSON.stringify(file)}
          file={file}
          onDelete={() => onDelete(index)}
        />
      ))}
      </Box>
    </ListContainer>
  )
}

export default UploadedFilesList
