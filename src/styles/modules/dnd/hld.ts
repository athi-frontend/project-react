import { Box, styled, Button, Typography, Checkbox ,TextField} from '@mui/material'

/**
  Classification : Confidential
**/
export const EditorContainer = styled(Box)({
  width: '100%',
  minHeight: '293px',
  marginTop: '10px',
  border: '1px solid var(--Text-Disable, #999)',
  borderRadius: '10px',
  overflow: 'hidden',
  '& .ck-editor__editable': {
    minHeight: '293px',
    padding: '20px',
  },
  '& .ck-editor__editable_inline': {
    border: 'none',
  },
  '& .ck.ck-editor__main': {
    borderRadius: '0 0 10px 10px',
  },
  '& .ck.ck-toolbar': {
    borderRadius: '10px 10px 0 0',
    border: 'none',
    borderBottom: '1px solid #ccc',
  },
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  borderRadius: '20px',

  '& .MuiSvgIcon-root': {
    fontSize: '32px',
    borderRadius: '10px',
  },
  width: '40px',
  height: '40px',
  '&.Mui-checked': {
    color: '#652D90',
  },
}))

export const CheckboxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
}))

export const CheckboxLabel = styled(Typography)(({ theme }) => ({
  color: 'rgba(51, 51, 51, 1)',
  fontSize: '18px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
}))

export const SpecialCategoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '20px',
}))

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100px',
  width: '100%',

  paddingTop: '28px',
  paddingBottom: '28px',
  alignItems: 'center',
  gap: '40px 100px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const AddButton = styled(Button)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid',
  display: 'flex',
  minHeight: '45px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  gap: '20px',
  overflow: 'hidden',
  fontSize: '20px',
  fontWeight: '500',
  justifyContent: 'start',
  textTransform: 'none',
}))

export const ActionIcon = styled(Box)(({ theme }) => ({
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

export const HeaderText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  color: 'rgba(51, 51, 51, 1)',
  fontWeight: '500',
}))

export const SectionContainer = styled(Box)({
  marginTop: '20px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const MarketSegmentContainer = styled(Box)({
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
})

export const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '550px',
  scrollbarWidth: 'none',
}))

const MainContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const HLDContainer = styled(Box)(({ theme }) => ({
  alignItems: 'stretch',
  borderRadius: '10px',
  display: 'flex',
  width: '100%',
  paddingTop: '20px',
  flexDirection: 'column',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',

  fontWeight: '600',
  whiteSpace: 'nowrap',
  lineHeight: '1',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    whiteSpace: 'initial',
  },
}))

const HLDTitle = styled(Typography)(({ theme }) => ({
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',

  fontWeight: '600',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
}))

const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingBottom: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FormRow = styled(Box)(({ theme }) => ({
  width: '100%',

  alignItems: 'start',
  gap: '40px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  justifyContent: 'start',
  flexWrap: 'wrap',
  marginTop: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const RichTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  width: '100%',
  paddingLeft: '40px',
  alignItems: 'start',
  gap: '40px',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
  },
}))

const RichTextBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  minWidth: '240px',
  width: '719px',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
}))

const RichTextLabel = styled(Typography)(({ theme }) => ({
  color: '#222',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  zIndex: '0',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const RichTextArea = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  border: '1px solid var(--Text-Disable, #999)',
  zIndex: '0',
  marginTop: '10px',
  minHeight: '293px',
  paddingLeft: '11px',
  paddingRight: '20px',
  paddingTop: '104px',
  paddingBottom: '165px',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',
  color: '#999',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingTop: '100px',
    paddingBottom: '100px',
  },
}))

const RichTextAreaError = styled(RichTextArea)(({ theme }) => ({
  border: '1px solid #d32f2f',
}))

const RichToolsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '0',
  width: '717px',
  right: '1px',
  top: '38px',
}))

const RichToolsImage = styled('img')(({ theme }) => ({
  aspectRatio: '8.93',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '100%',
  minHeight: '80px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const RegionTitle = styled(Typography)(({ theme }) => ({
  width: '100%',
  paddingTop: '20px',
  paddingBottom: '20px',
  fontSize: '24px',
  fontWeight: '600',
  whiteSpace: 'nowrap',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
}))

const TableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',

  paddingTop: '10px',
  paddingBottom: '10px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const TableWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',

  width: '100%',
  maxWidth: '100%',
  paddingLeft: '30px',
  paddingRight: '10px',
  paddingTop: '10px',
  paddingBottom: '10px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

const MarketSizeContainer = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const MarketSizeTitle = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  minHeight: '100px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '38px',
  paddingBottom: '38px',
  gap: '20px',
  fontSize: '24px',
  color: '#111827',
  fontWeight: '600',
  lineHeight: '1',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const MarketSizeInputContainer = styled(Box)(({ theme }) => ({
  marginTop: '10px',
  minHeight: '97px',
  width: '823px',
  maxWidth: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const FileUploadContainer = styled(Box)(({ theme }) => ({
  minWidth: '240px',
  width: '100%',
  flex: '1',
  flexShrink: '1',
  flexBasis: '0%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FileUploadLabel = styled(Typography)(({ theme }) => ({
  color: '#222',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const ErrorText = styled(Typography)(({ theme }) => ({
  color: '#d32f2f',
  fontSize: '14px',
  marginTop: '5px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))


const InlineStyles = {
  textFieldPadding: {
    padding: '10px 0px',
  },
  gridContainer: {
    width: '100%',
  },
}

const CheckBoxStyles = {
  checkboxPosition: {
    marginLeft: '4px'
  }
}

const OptionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
}))

const OptionLabel = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: 400,
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
    '& fieldset': {
      borderColor: '#999',
      borderWidth: '1.5px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 20px',
    fontSize: '14px',
  },
}))

// SectionBox: Box with marginTop: '20px', width: '100%'
export const SectionBox = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

// FileUploadBox: Box with marginTop: '10px', width: '100%'
export const FileUploadBox = styled(Box)(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export {
  ErrorText,
  InlineStyles,
  CheckBoxStyles,
  StyledTextField,
  OptionItem,
  OptionLabel,
  RichTextAreaError,
  MainContainer,
  ContentContainer,
  HLDContainer,
  HLDTitle,
  FormSection,
  FormRow,
  RichTextContainer,
  RichTextBox,
  RichTextLabel,
  RichTextArea,
  RichToolsContainer,
  RichToolsImage,
  RegionTitle,
  TableContainer,
  TableWrapper,
  MarketSizeContainer,
  MarketSizeTitle,
  MarketSizeInputContainer,
  FileUploadContainer,
  FileUploadLabel,
}
