import React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import { handleFileDownloadUtil } from '@/lib/modules/dnd/fileDownload'

import {
  FileInfo,
  FileName,
  ItemContainer,
  StyledLinearProgress,
  ActionIcon,
  ActionIcons,
} from '@/styles/components/ui/fileupload'
import { getfileURL } from '@/hooks/useCommonDropdown'
import { showActionAlert } from '../alert-modal/ActionAlert'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { handleFileDownloadByUrl } from '@/lib/utils/common'
import { DocumentText } from 'iconsax-react'
import { useTheme } from '@mui/material'

interface CustomFile extends File {
  extension: string
  created_date: string
  document_id?: string
  media_id?: string | number
}

interface UploadedFileItemProps {
  file: CustomFile
  onDelete: () => void
}

const UploadedFileItem: React.FC<UploadedFileItemProps> = ({
  file,
  onDelete,
}) => {
  const theme = useTheme()
  const handleDownloadSuccess = async (assetUrl: string) => {
    try {
      handleFileDownloadByUrl(assetUrl, file.file_name)
    } catch (error) {
      console.error('Error downloading file:', error)
      showActionAlert(STATUS.FAILED)
    }
  }

  const handleDownload = async () => {
    if (file.file_id) {
      const response = await getfileURL(file.file_id)
      if (response?.data?.[NUMBERMAP.ZERO]?.assetUrl) {
        handleDownloadSuccess(response?.data?.[NUMBERMAP.ZERO]?.assetUrl)
      } else {
        showActionAlert(STATUS.FAILED)
      }
    } else {
      handleFileDownloadUtil({ name: file.file_name, blob: file.file })
    }
  }

  return (
    <ItemContainer>
       <DocumentText size={NUMBERMAP.THIRTYTWO} color={theme.palette.primary.main} className='file-icon'/>
      <FileInfo>
        <FileName>
          {file.file_name}
          {file.extension}
        </FileName>
          <StyledLinearProgress variant="determinate" value={NUMBERMAP.HUNDRED} />
        {/* )} */}
      </FileInfo>
      <ActionIcons>
        <ActionIcon
          as={DownloadIcon}
          alt="Download file"
          onClick={handleDownload}
        />
      </ActionIcons>
    </ItemContainer>
  )
}

export default UploadedFileItem
