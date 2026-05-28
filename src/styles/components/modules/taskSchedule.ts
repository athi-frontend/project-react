import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { Typography, Box } from '@mui/material'

/**
    Classification : Confidential
**/
export const ActiveStyle = { justifyContent: 'space-between', width: '100%' }
export const InlineStyles = {
  activityName: {
    marginTop: '16px',
    fontWeight: '500',
  },
  headerName: (theme: any) => ({ color: theme.palette.primary.main, width: '15px', height: '15px' })
}

export const CommentsHistoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  paddingLeft: '40px',
}))

export const DatePickerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  minWidth: '300px',
}))

export const DateFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}))

export const DateLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: '500',
  color: '#652D90',
}))

export const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#652D90',
    },
    '&:hover fieldset': {
      borderColor: '#652D90',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#652D90',
    },
  },
}))

export const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#652D90',
  color: 'white',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  fontWeight: '600',
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#652D90',
  color: 'white',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '500',
  '&:hover': {
    backgroundColor: '#4e2270',
  },
}))

export const CancelButton = styled(Button)(({ theme }) => ({
  color: '#652D90',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '500',
  borderColor: '#652D90',
  '&:hover': {
    borderColor: '#4e2270',
    backgroundColor: 'rgba(101, 45, 144, 0.04)',
  },
}))

export const ActivityContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'start',
  flexWrap: 'nowrap', // Prevent wrapping
  backgroundColor: '#f9f4ff',
  '@media (max-width: 991px)': {
    flexWrap: 'nowrap', // Ensure no wrapping on mobile
  },
}))

export const EmptyCell = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  backgroundColor: '#f9f4ff',
  borderColor: 'rgba(165, 120, 199, 0.15)',
  borderRightWidth: '2px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '15px',
  paddingBottom: '15px',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: 'rgba(0, 0, 0, 1)',
  fontWeight: '400',
  whiteSpace: 'nowrap',
  height: '100%',
  width: '90px',
  flexShrink: 0, // Prevent shrinking
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 991px)': {
    width: '90px',
    flexShrink: 0,
  },
}))

export const ActivityNameContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f4ff',
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  width: '405px', // Fixed width to match header
  flexShrink: 0, // Prevent shrinking
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingLeft: '42px', // Indented to show hierarchy
  paddingRight: '30px',
  paddingTop: '15px',
  paddingBottom: '15px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'stretch',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: 'rgba(0, 0, 0, 1)',
  fontWeight: '400',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    minWidth: '240px',
    width: '405px',
    flexShrink: 0,
    paddingLeft: '40px',
    paddingRight: '20px',
  },
}))

export const ActivityContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '374px',
  alignItems: 'center',
  justifyContent: 'start',
  cursor: 'pointer', // Add cursor pointer to indicate clickable
  transition: 'color 0.2s', // Add transition for hover effect
  '&:hover': {
    color: '#652D90', // Change color on hover
  },
}))

export const ActivityName = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: 'rgba(0, 0, 0, 0.8)',
  fontWeight: '400',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer', // Add cursor pointer to indicate clickable
  '&:hover': {
    color: '#652D90', // Change color on hover
    textDecoration: 'underline', // Add underline on hover
  },
}))

export const DateInfo = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: 'rgba(0, 0, 0, 0.6)',
  marginLeft: '10px',
  flexShrink: 0,
}))

export const TimelineContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f4ff',
  borderColor: 'rgba(101, 45, 144, 0.06)',
  borderBottomWidth: '1px',
  alignSelf: 'stretch',
  display: 'flex',
  flex: 1,
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '50px',
  alignItems: 'center',
  position: 'relative', // For absolute positioning of the bar
  '@media (max-width: 991px)': {
    flex: 1,
  },
}))

export const BarWrapper = styled(Box)(
  ({ theme, left }: { theme?: any; left: string }) => ({
    position: 'absolute',
    left: left,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'start',
    height: '30px',
  })
)

export const Bar = styled(Box)(({ theme, width }: { theme?: any; width: string }) => ({
  borderRadius: '10px',
  backgroundColor: 'rgba(186, 105, 255, 0.5)', // Lighter color for activities
  height: '100%',
  width: width,
}))


// header

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const TitleContainer = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  flex: '1',
  flexShrink: '1',
  flexBasis: '40px',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  gap: '10px',
  fontWeight: '600',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const AddButton = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  border: `1px solid ${theme.palette.primary.main}`,
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '45px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  gap: '20px',
  overflow: 'hidden',
  color: theme.palette.primary.main,
  fontWeight: '500',
  justifyContent: 'start',
  cursor: 'pointer',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
}))

export const ButtonText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  fontWeight: '500',
}))

export const TaskScheduleStyles = {
  activityContentDefault: {
    cursor: 'default' as const,
  },
  activityNameDefault: {
    cursor: 'default' as const,
    pointerEvents: 'none' as const,
  },
  dateInfoClickable: {
    cursor: 'pointer' as const,
  },
}

export const ActiveTaskScheduleStyles ={ ...ActiveStyle, ...TaskScheduleStyles.activityContentDefault }