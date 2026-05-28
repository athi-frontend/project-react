import { styled } from '@mui/material/styles'
import { Box, Typography, LinearProgress } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Container as CommonContainer,
  Label as CommonLabel,
} from '../../common'

import DescriptionIcon from '@mui/icons-material/Description'

const UploadContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.default,

  border: '2px var(--Text-Disable, #999)',
}))

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: '48px',
  color: theme.palette.primary.main,
  marginBottom: '16px',
}))

const UploadText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 400,
  marginBottom: '8px',
}))

const SupportedFormats = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
}))

const HiddenInput = styled('input')({
  display: 'none',
})

const ItemContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  backgroundColor: 'var(--Layout-BG, #F7F2FB)',
  display: 'flex',
  width: '100%',
  gap: '20px',
  justifyContent: 'start',
  flexWrap: 'wrap',
  padding: '10px',
  marginBottom: '20px',
  cursor: 'pointer',
}))

const FileIcon = styled('img')({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '42px',
  alignSelf: 'start',
})

const FileInfo = styled(Box)({
  display: 'flex',
  minWidth: '240px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  flexBasis: '0%',
})

const FileName = styled(Typography)({
  color: '#000000',
  font: '400 16px Poppins, sans-serif',
})

const ActionIcons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

const ActionIcon = styled('img')({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '28px',
  cursor: 'pointer',
})

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  marginTop: '10px',
}))

const ExpandIcon = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
})

const FileDetails = styled(Box)({
  width: '100%',
  marginTop: '10px',
})

const DetailItem = styled(Typography)({
  color: '#000000',
  font: '400 14px Poppins, sans-serif',
})

const FileUploadContainer = styled(CommonContainer)(({ theme }) => ({
  padding: '15px',
}))

const ListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
}))
const FileIcon1 = styled(DescriptionIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: '42px',
  height: '42px',
  marginRight: '10px',
}))

const ListLabel = styled(CommonLabel)(({ theme }) => ({
  // marginBottom: '20px',
}))

export {
  UploadContainer,
  UploadIcon,
  UploadText,
  SupportedFormats,
  HiddenInput,
  ItemContainer,
  FileIcon,
  FileInfo,
  FileName,
  ActionIcons,
  ActionIcon,
  StyledLinearProgress,
  ExpandIcon,
  FileDetails,
  DetailItem,
  FileUploadContainer,
  ListContainer,
  ListLabel,
  FileIcon1,
}
