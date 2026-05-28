import { styled, Box, Typography, Autocomplete, SxProps, Theme } from '@mui/material'

export const STYLES = {
  MARGIN_TOP_10: { marginTop: '10px', width: '100%' },
  MARGIN_TOP_20: { marginTop: '20px' },
  MARGIN_TOP_20_PADDING_TOP_100: { marginTop: '20px', paddingTop: '100px' },
  FLEX_GAP_16: { display: 'flex', gap: '5px' },
  FONTSIZE_24: { fontSize: '24px' },
  SIZE: 'small',
  colour: 'primary',
}
export const ALERT_MESSAGES = {
  DOWNLOAD_ERROR_TITLE: 'Download Error',
  DOWNLOAD_ERROR_TEXT: 'Error downloading file',
  ALERT_ICON_ERROR: 'error',
}
export const FileUploadContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}))

export const HeaderContainer = styled(Box)(({ theme }) => ({
  alignItems: 'stretch',
  borderRadius: '10px',
  display: 'flex',
  minHeight: '104px',
  width: '100%',
  paddingTop: '20px',
  paddingBottom: '20px',
  flexDirection: 'column',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const HeaderTitle = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '20px',
  paddingBottom: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  paddingBottom: '20px',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const UploadSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'start',
  gap: '40px',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const UploadContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: '1',
  flexShrink: '1',
  flexBasis: '0%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const UploadLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FileInfoContainer = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FileInfoLabel = styled(Typography)(({ theme }) => ({
  display: 'flex',
  minHeight: '37px',
  width: '100%',
  alignItems: 'center',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.text.primary,
  fontWeight: '400',
  justifyContent: 'start',
  flexWrap: 'wrap',
}))

export const TableContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  borderColor: 'rgba(216, 216, 216, 1)',
  borderStyle: 'solid',
  borderWidth: '1px',
  marginTop: '10px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const TableHeader = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px 10px 0px 0px',
  borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#F5E9FF',
  display: 'flex',
  minHeight: '80px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '22px',
  paddingBottom: '22px',
  gap: '40px 100px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: 'rgba(34, 34, 34, 1)',
  fontWeight: '500',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const TableHeaderCell = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingTop: '5px',
  paddingBottom: '5px',
  gap: '10px',
}))

export const TableRow = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#FFF',
  display: 'flex',
  minHeight: '70px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '13px',
  paddingBottom: '13px',
  gap: '40px 100px',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const TableCell = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingTop: '5px',
  paddingBottom: '5px',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: 'rgba(51, 51, 51, 1)',
  fontWeight: '400',
}))

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  justifyContent: 'start',
}))

export const EditFormContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  marginTop: '41px',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '25px',
  paddingBottom: '25px',
  alignItems: 'center',
  gap: '40px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    marginTop: '40px',
  },
}))

export const EditFormInnerContainer = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  backgroundColor: theme.palette.background.default,
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  flex: '1',
  flexShrink: '1',
  flexBasis: '0%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const EditFormContent = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '20px',
  paddingBottom: '10px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const EditFormTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  alignItems: 'center',
  gap: '10px',
  fontSize: '20px',
  fontWeight: '500',
  justifyContent: 'start',
  flexWrap: 'wrap',
}))

export const EditFormFields = styled(Box)(({ theme }) => ({
  padding: '20px 100px',
  marginTop: '10px',
  width: '100%',
  alignItems: 'start',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FormColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  overflow: 'hidden',
  justifyContent: 'start',
  width: '719px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FormInputsContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '719px',
}))

export const LabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  paddingRight: '80px',
  paddingBottom: '18px',
  flexDirection: 'column',
  alignItems: 'start',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    paddingRight: '20px',
  },
}))

export const LabelTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
}))

export const LabelValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  marginTop: '28px',
}))

export const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '15px',
  justifyContent: 'start',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const TagItem = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  backgroundColor: 'rgba(236, 236, 236, 1)',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '5px',
  paddingBottom: '5px',
}))

export const LastTableRow = styled(TableRow)(({ theme }) => ({
  borderRadius: '0px 0px 10px 10px',
  borderBottom: 'none',
}))

export const ActionIcon = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '24px',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  flexShrink: '0',
  cursor: 'pointer',
}))



export const TagsContainer2 = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InputContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InputLabel = styled(Typography)(({ theme }) => ({
  color: '#222',
  fontSize: '18px',
}))

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    minHeight: '63px',
    '& fieldset': {
      borderColor: '#999',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '16px',
    color: '#222',
    padding: '10px 14px',
  },
  '& .MuiChip-root': {
    borderRadius: '10px',

    margin: '2px',
  },
}))


export const InlineStyles = {
  tagBox: (isSelected: boolean) => ({
    cursor: 'pointer',
    opacity: isSelected ? 0.7 : 1,
    position: 'relative',
    '&::after': isSelected
      ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
        }
      : {},
  }),
  createTagBox: {
    cursor: 'pointer',
    padding: '10px',
    textAlign: 'center',
    color: 'primary.main',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
}

export const TagsRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
  marginTop: '14px',
  alignItems: 'start',
  '&:first-of-type': {
    marginTop: 0,
  },
}))



// CustomBox

// Inline styles moved to the top
export const InlineStylesCustomBox = {
  outerBox: (isSelected: boolean) => ({
    cursor: 'pointer',
    opacity: isSelected ? 0.7 : 1,
    position: 'relative',
    '&::after': isSelected
      ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
        }
      : {},
  }),
  innerBox: {
    alignSelf: 'stretch',
    borderRadius: '10px',
    backgroundColor: 'rgba(236, 236, 236, 1)',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '5px',
    paddingBottom: '5px',
    color: '#999',
    fontSize: '18px',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    fontWeight: '400',
  },
  createTagBox: {
    cursor: 'pointer',
    padding: '10px',
    textAlign: 'center',
    color: '#652D90',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
}

export const ListboxContainer = styled(Box)(({ theme }) => ({
  padding: '20px',
  maxHeight: '400px',
  overflow: 'auto',
}))
export const DownloadIconSx: SxProps<Theme> = {
  pointerEvents: 'auto',
}