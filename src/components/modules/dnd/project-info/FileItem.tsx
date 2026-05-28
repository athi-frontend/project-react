'use client'
import React, { useState } from 'react'
import { Typography, IconButton, Collapse } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import InfoIcon from '@mui/icons-material/Info'
import axios from 'axios'
import { useDownloadFile } from '@/hooks/modules/dnd/useProject'
import { showActionAlert } from '@/components/ui'
import { FileItemProps } from '@/types/modules/dnd/project'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  FileContainer,
  FileHeader,
  FileDetails,
  FileIcon,
  FileName,
} from '@/styles/components/modules/projectInfo'
import { handleFileDownloadUtil } from '@/lib/modules/dnd/fileDownload'

const { DENIED_ALERT, INDEX_ZERO } = COMMON_CONSTANTS

const FileItem: React.FC<FileItemProps> = ({
  file,
  name,
  extension,
  created_date,
  description,
  media_id,
}) => {
  const [expanded, setExpanded] = useState(false)

  const { refetch } = useDownloadFile(media_id as string | number)

  const handleDownloadSuccess = async (assetUrl: string) => {
    try {
      const fileResponse = await axios.get(assetUrl, {
        responseType: 'blob',
      })
      const blob = fileResponse.data
      handleFileDownloadUtil(file, blob)
    } catch (error) {
      console.error('Error downloading file:', error)
      showActionAlert(DENIED_ALERT)
    }
  }

  const handleDownload = async () => {
    if (media_id) {
      const response = await refetch()
      if (response.data) {
        handleDownloadSuccess(response.data.data[INDEX_ZERO].assetUrl)
      } else {
        showActionAlert(DENIED_ALERT)
      }
    } else {
      handleFileDownloadUtil(file)
    }
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <FileContainer>
        <FileHeader onClick={toggleExpand}>
          <FileIcon />
          <FileName variant="body1">
            {name}
            {extension}
          </FileName>
          <IconButton aria-label="expand file details">
            <InfoIcon />
          </IconButton>
          <IconButton
            aria-label="download file"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          >
            <DownloadIcon />
          </IconButton>
        </FileHeader>
      </FileContainer>
      <Collapse in={expanded}>
        <FileDetails>
          <Typography display={'flex'} component="div">
            File Description:
            <Typography variant="body2" marginLeft="5px" color="text.secondary">
              {description}
            </Typography>
          </Typography>
          <Typography display={'flex'} component="div">
            Uploaded Date:{' '}
            <Typography variant="body2" marginLeft="5px" color="text.secondary">
              {new Date(created_date).toLocaleString()}
            </Typography>
          </Typography>
        </FileDetails>
      </Collapse>
    </>
  )
}

export default FileItem
