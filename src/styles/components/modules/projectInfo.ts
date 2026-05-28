import { Box, Typography, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

import DescriptionIcon from '@mui/icons-material/Description'
const FileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  marginBottom: 20,
}))

const FileHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
})

const FileIcon = styled(DescriptionIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: '42px',
  height: '42px',
  marginRight: '10px',
}))

const FileName = styled(Typography)({
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const FileDetails = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  border: '1px solid',
  borderColor: theme.palette.text.secondary,
}))
const Label = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 400,
  color: theme.palette.text.primary,
}))

const Value = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  wordBreak: 'break-word',
}))
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}))

const FileList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}))
export {
  FileContainer,
  FileHeader,
  FileIcon,
  FileName,
  FileDetails,
  Label,
  Value,
  StyledPaper,
  SectionTitle,
  FileList,
}
