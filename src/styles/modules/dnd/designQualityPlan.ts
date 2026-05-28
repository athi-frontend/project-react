import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const DialogContainer = styled(Box)({
  padding: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
})

export const TitleContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
})

export const TitleSection = styled(Box)({
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  color: '#111827',
  fontWeight: '600',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
})

export const ContentWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  width: '100%',
  paddingLeft: '20px',
  height:"400px",
  overflowY: 'auto',
  paddingRight: '20px',
  alignItems: 'start',
  gap: '10px',
  scrollbarWidth: 'none',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const FormContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  paddingBottom: '20px',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'end',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const FormSection = styled(Box)({
  display: 'flex',
  maxWidth: '100%',
  width: '800px',
  flexDirection: 'column',
  justifyContent: 'start',
})

export const LabelContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  paddingRight: '80px',
  paddingBottom: '21px',
  flexDirection: 'column',
  alignItems: 'start',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  whiteSpace: 'nowrap',
  '@media (max-width: 991px)': {
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
})

export const StageLabel = styled(Box)({
  color: '#222',
  fontSize: '18px',
})

export const StageValue = styled(Box)({
  color: '#999',
  fontSize: '16px',
  marginTop: '28px',
})

export const ParameterChip = styled(Box)({
  alignSelf: 'stretch',
  borderRadius: '5px',
  backgroundColor: '#EAD6FA',
  marginTop: 'auto',
  marginBottom: 'auto',
  padding: '5px 10px',
  gap: '5px',
})

export const DropdownContainer = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid var(--Text-Disable, #999)',
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  padding: '18px 20px',
  gap: '40px 100px',
  color: '#999',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const MultiSelectContainer = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid var(--Primary-Color, #652D90)',
  display: 'flex',
  marginTop: '10px',
  minHeight: '63px',
  width: '100%',
  padding: '15px 20px',
  gap: '40px 100px',
  fontSize: '16px',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const ChipsContainer = styled(Box)({
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '5px',
  justifyContent: 'start',
})
export const Type = styled(Box)({
  alignContent: 'center',
  height: '100%',
})

export const InlineStyles = {
  tableContainer: {
    paddingTop: '0px',
  },
  gridContainer: {
    width: '100%',
  },
  gridItem: {
    margin: 'auto',
  },
  cellStyle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const,
    maxWidth: '100%',
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
}

export const DESIGN_QUALITY_REPORT_STYLES = {
  COMMENTS_CONTAINER: { 
    display: 'flex', 
    justifyContent: 'start', 
    width: '100%', 
    paddingLeft: '40px' 
  },
  REVIEWER_CONTAINER: { 
    display: 'flex', 
    justifyContent: 'end', 
    width: '100%', 
    padding: '40px' 
  },
}
export const statusStyle = {
lineHeight: 'unset'
}
export const commentsStyle = {
  p: 2
}
export const parameterStyle = {
  py: 1
}