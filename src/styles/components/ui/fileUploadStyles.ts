import { CSSObject, styled } from '@mui/material/styles'
import {
  Box,
  Typography,
  Chip,
  Popper,
  Paper,
  Autocomplete,
} from '@mui/material'
import { autocompleteClasses } from '@mui/material/Autocomplete'

const commonBoxFlexColumn: CSSObject = {
  width: '100%',
  display: 'unset',
  flexDirection: 'column',
}

const commonResponsive: CSSObject = {
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}

const commonInputFieldset: CSSObject = {
  '& fieldset': {
    borderColor: 'var(--Text-Disable, #999)',
  },
}

const commonChipStyle: CSSObject = {
  borderRadius: '10px',
}

const commonTypographyColor = '#222'
const commonFontSize = '16px'

export const MainContainer = styled(Box)(commonBoxFlexColumn)

export const UploadHeader = styled(Box)({
  alignItems: 'stretch',
  borderRadius: '10px',

  minHeight: '104px',
  width: '100%',
  padding: '20px 0',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',

  fontWeight: '600',
  lineHeight: '1',
  justifyContent: 'center',
  ...commonResponsive,
})

export const HeaderContent = styled(Box)({
  width: '100%',
  ...commonResponsive,
  paddingRight: '20px',
  fontSize: '18px',
})

export const ContentWrapper = styled(Box)({
  ...commonBoxFlexColumn,
  paddingBottom: '20px',
  alignItems: 'end',
  justifyContent: 'start',
  ...commonResponsive,
})

export const UploadSection = styled(Box)({
  width: '100%',

  display: 'flex',
  alignItems: 'start',
  gap: '40px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '0 20px',
    flexDirection: 'column',
  },
})

export const UploadLabel = styled(Box)({
  color: commonTypographyColor,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  marginBottom: '10px',
})

export const HeaderContainer = styled(Box)({
  borderRadius: '10px',
  ...commonBoxFlexColumn,
})

export const HeaderTitle = styled(Typography)({
  verticalAlign: 'center',
  font: '600 24px/1 Poppins, sans-serif',
})

export const ContentContainer = styled(Box)({
  ...commonBoxFlexColumn,
  justifyContent: 'start',
  ...commonResponsive,
})

export const EditContainer = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  backgroundColor: theme.palette.background.default,
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  flex: '1',
  alignItems: 'stretch',
  justifyContent: 'center',
  ...commonBoxFlexColumn,
  ...commonResponsive,
}))

export const EditContent = styled(Box)({
  width: '100%',
  padding: '20px 0 10px',
  ...commonResponsive,
})

export const EditHeader = styled(Box)({
  display: 'flex',
  width: '100%',
  maxWidth: '100%',
  padding: '0 20px',
  alignItems: 'center',
  gap: '10px',
  fontSize: '20px',

  fontWeight: '500',
  justifyContent: 'start',
  flexWrap: 'wrap',
})

export const EditTitle = styled(Box)({
  alignSelf: 'stretch',
  margin: 'auto 0',
  gap: '10px',
})

export const FormContainer = styled(Box)({
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  alignItems: 'start',
  gap: '10px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  ...commonResponsive,
})

export const FormColumn = styled(Box)({
  display: 'flex',
  minWidth: '240px',
  alignItems: 'center',
  gap: '10px',
  overflow: 'hidden',
  justifyContent: 'start',
  width: '719px',
  ...commonResponsive,
})

export const InputsContainer = styled(Box)({
  alignSelf: 'stretch',
  minWidth: '240px',
  margin: 'auto 0',
  width: '719px',
})

export const LabelContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  paddingRight: '80px',
  paddingBottom: '18px',
  flexDirection: 'column',
  alignItems: 'start',
  fontWeight: '400',
  ...commonResponsive,
})

export const LabelText = styled(Box)({
  fontSize: '18px',
})

export const LabelValue = styled(Box)({
  fontSize: commonFontSize,
  marginTop: '28px',
})

export const ButtonsContainer = styled(Box)({
  display: 'flex',

  width: '100%',
  padding: '100px 0 20px',
  alignItems: 'start',

  fontSize: '20px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  justifyContent: 'end',
  ...commonResponsive,
})

export const ButtonsWrapper = styled(Box)({
  display: 'flex',
  minWidth: '240px',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'start',
  ...commonResponsive,
})

export const TagsContainer = styled(Box)({
  marginTop: '20px',
  fontWeight: '400',
  ...commonBoxFlexColumn,
  ...commonResponsive,
})

export const TagsDisplayContainer = styled(Box)({
  justifyContent: 'center',
  alignItems: 'stretch',
  borderRadius: '10px',
  border: '1px solid var(--Secondary-Color, #D39AFF)',

  display: 'flex',
  marginTop: '5px',
  padding: '20px',
  flexDirection: 'column',
  fontSize: '18px',
  color: '#999',
  ...commonResponsive,
})

export const InputContainer = styled(Box)({
  width: '100%',
  ...commonResponsive,
})

export const InputLabel = styled(Typography)({
  fontSize: '18px',
  ...commonResponsive,
})

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    minHeight: '63px',
    ...commonInputFieldset,
  },
  '& .MuiOutlinedInput-input': {
    fontSize: commonFontSize,

    padding: '10px 14px',
  },
  '& .MuiInputLabel-root': {
    fontSize: commonFontSize,
    color: '#999',
  },
  '& .MuiChip-root': {
    ...commonChipStyle,
    backgroundColor:  theme.palette.text.main,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: '20px',
  },
  ...commonResponsive,
}))

export const CustomPopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    padding: '20px',
    maxHeight: '400px',
  },
}))

export const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  border: '1px solid var(--Secondary-Color, #D39AFF)',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  marginTop: '5px',
  overflow: 'hidden',
}))

export const TagsRow = styled(Box)({
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
  marginTop: '7px',
  alignItems: 'start',
  '&:first-of-type': {
    marginTop: 0,
  },
  ...commonResponsive,
})

export const TagItem = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  ...commonChipStyle,
  backgroundColor: theme.palette.background.light,
  margin: '0',
  padding: '8px 12px',
  minHeight: '32px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  lineHeight: '1.2',
  wordBreak: 'break-word',
  textAlign: 'left',
  ...commonResponsive,
}))

export const ModalTagItem = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  ...commonChipStyle,
  backgroundColor: theme.palette.text.main,
  margin: '0',
  padding: '8px 12px',
  minHeight: '32px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  lineHeight: '1.2',
  wordBreak: 'break-word',
  textAlign: 'left',
  ...commonResponsive,
}))

export const TagsEnterKey = {
  enter: 'Enter',
}

export const NoResultsMessage = styled(Typography)({
  padding: '10px 0',
  textAlign: 'center',
  color: '#999',
  fontSize: commonFontSize,
})

export const SearchInfoMessage = styled(Typography)({
  padding: '10px 0',
  color: '#666',
  fontSize: '14px',
  fontStyle: 'italic',
})

export const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '14px',
  marginTop: '5px',
}))

export const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  backgroundColor: theme.palette.background.default,
  borderRadius: '10px',
  border: '1px solid var(--Secondary-Color, #D39AFF)',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  outline: 'none',
}))

export const ModalHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
})

export const ModalTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: '500',
})

export const EllipsisChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  ...commonChipStyle,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(220, 220, 220, 1)',
  },
}))
