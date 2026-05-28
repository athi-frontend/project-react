import { styled, alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { Bar, BarWrapper } from './taskSchedule'

/**
    Classification : Confidential
**/
export const SerialNo = {borderRight:"1px solid", borderColor:"#A578C726"}
export const DialogContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  paddingTop: '21px',
  paddingBottom: '21px',
  overflow: 'hidden',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const TitleContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',

  '& .title': {
    fontSize: '24px',
    color: theme.palette.text.primary,
    fontWeight: '600',
    lineHeight: '1',
  },

  '& .close-button': {
    position: 'absolute',
    right: '20px',
    top: '20px',
    width: '30px',
    height: '30px',
  },

  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  display: 'flex',
  marginTop: '40px',
  paddingLeft: '40px',

  maxWidth: '100%',
  paddingBottom: '20px',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'end',
}))

export const BUTTONSTYLE = { padding: '40px' }

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  fontWeight: '400',
  justifyContent: 'start',
}))

export const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',

  '& .label-container': {
    display: 'flex',
    width: '100%',
    paddingRight: '80px',
    paddingTop: '2px',
    paddingBottom: '2px',
    flexDirection: 'column',
    alignItems: 'start',

    '@media (max-width: 991px)': {
      paddingRight: '20px',
    },
  },

  '& .label': {
    color: theme.palette.text.primary,
    fontSize: '18px',
  },

  '& .value': {
    color: theme.palette.text.disabled,
    fontSize: '16px',
    marginTop: '28px',
  },
}))

export const RowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'start',
  flexWrap: 'nowrap', // Prevent wrapping
  '@media (max-width: 991px)': {
    flexWrap: 'nowrap', // Ensure no wrapping on mobile
  },
}))

export const SerialNumber = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  borderColor: alpha(theme.palette.primary.main, 0.15),
  borderRightWidth: '2px',
  padding: '20px',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  color: theme.palette.text.primary,
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

export const StageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  width: '405px', // Fixed width to match header
  flexShrink: 0, // Prevent shrinking
  margin: 'auto 0',
  padding: '20px 30px 20px 40px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'stretch',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  color: theme.palette.text.primary,
  fontWeight: '400',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    minWidth: '240px',
    width: '405px',
    flexShrink: 0,
    padding: '20px',
  },
}))

export const StageContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '374px',
  alignItems: 'center',
  justifyContent: 'start',
}))

export const StageName = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  margin: 'auto 0',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  color: theme.palette.text.primary,
  fontWeight: '400',
  flexGrow: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))

export const ExpandIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: theme.palette.primary.main,
  marginLeft: '10px',
  flexShrink: 0,
}))

export const TimelineContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderColor: alpha(theme.palette.primary.main, 0.06),
  borderBottomWidth: '1px',
  alignSelf: 'stretch',
  display: 'flex',
  flex: 1,
  margin: 'auto 0',
  minHeight: '70px',
  alignItems: 'center',
  position: 'relative', // For absolute positioning of the bar
  '@media (max-width: 991px)': {
    flex: 1,
  },
}))


// TableContainer
export const TableContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px 0px 10px 10px',
  marginTop: '10px',
  width: '100%',
  overflowX: 'auto', // Enable horizontal scrolling for the entire table
  scrollbarWidth:"none",
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}));

// Table
export const Table = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  width: '100%',
  minWidth: '1200px', // Ensure minimum width to prevent squeezing
  maxWidth: '1477px',
  maxHeight: '500px', // Set a max height for vertical scrolling
  overflowY: 'auto', // Enable vertical scrolling
  scrollbarWidth:"none",
  '@media (max-width: 991px)': {
    minWidth: '1200px', // Maintain minimum width on smaller screens
  },
}));

// TableHeader
export const TableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'start',
  flexWrap: 'nowrap', // Prevent wrapping
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  '@media (max-width: 991px)': {
    flexWrap: 'nowrap', // Ensure no wrapping on mobile
  },
}));

// StaticHeaderContainer
export const StaticHeaderContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  width: '495px',
  flexShrink: 0, // Prevent shrinking
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  fontSize: '20px',
  color: theme.palette.common.white,
  fontWeight: '500',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    minWidth: '240px',
    width: '495px',
    flexShrink: 0,
  },
}));

// SerialNumberHeader
export const SerialNumberHeader = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '12px 0px 0px 0px',
  backgroundColor: theme.palette.primary.main,
  borderColor: alpha(theme.palette.primary.main, 0.2),
  borderRightWidth: '3px',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingLeft: '20px',
  paddingRight: '20px',
  gap: '10px',
  whiteSpace: 'nowrap',
  width: '90px',
  height: '80px',
  flexShrink: 0, // Prevent shrinking
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 991px)': {
    width: '90px',
    flexShrink: 0,
  },
}));

// DescriptionHeader
export const DescriptionHeader = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  backgroundColor: theme.palette.primary.main,
  minWidth: '240px',
  width: '405px', // Fixed width
  flexShrink: 0, // Prevent shrinking
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingLeft: '20px',
  paddingRight: '20px',
  height: '80px',

  // paddingTop: '40px',
  // paddingBottom: '40px',
  gap: '10px',
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 991px)': {
    minWidth: '240px',
    width: '405px',
    flexShrink: 0,
  },
}));

// MonthsContainer
export const MonthsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap', // Prevent wrapping
  alignItems: 'center',
  '@media (max-width: 991px)': {
    flexWrap: 'nowrap', // Ensure no wrapping on mobile
  },
}));

// MonthContainer
export const MonthContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '600px',
  width: '600px', // Fixed width for each month
  flexShrink: 0, // Prevent shrinking
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    minWidth: '240px',
    width: '240px',
    flexShrink: 0,
  },
}));

// MonthBox
export const MonthBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  alignSelf: 'stretch',
  display: 'flex',
  width: '100%',
  minWidth: '320px',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '80px',
  paddingLeft: '2px',
  paddingRight: '2px',
  paddingTop: '2px',
  paddingBottom: '2px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    width: '100%',
    minWidth: '240px',
  },
}));

// MonthHeader
export const MonthHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLastMonth',
})(
  ({ theme, isLastMonth }: { theme?: any; isLastMonth?: boolean }) => ({
    alignSelf: 'stretch',
    borderRadius: isLastMonth ? '0px 10px 0px 0px' : '0px',
    backgroundColor: theme.palette.primary.main,
    minHeight: '50px',
    width: '100%',
    fontSize: '20px',
    color: theme.palette.common.white,
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })
);

// WeeksContainer
export const WeeksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '2px',
  fontSize: '18px',
  color: theme.palette.text.primary,
  fontWeight: '400',
  textAlign: 'center',
  justifyContent: 'start',
  flex: '1',
  height: '100%',
}));

// WeekBox
export const WeekBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'weekCount',
})(
  ({
    theme,
    isActive,
    weekCount,
  }: {
    theme?: any;
    isActive?: boolean;
    weekCount: number;
  }) => ({
    alignSelf: 'stretch',
    width: `${100 / weekCount}%`, // Divide width equally based on number of weeks
    backgroundColor: isActive
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    marginTop: 'auto',
    marginBottom: 'auto',
    minHeight: '30px',
    gap: '10px',
    color: isActive ? theme.palette.common.white : theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })
);

// Reusable style constants
export const DescriptionBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}

export const getToggleButtonGroupSx = (theme: Theme) => ({
  '& .MuiButton-root': {
    color: alpha(theme.palette.primary.contrastText, 0.9),
    borderColor: alpha(theme.palette.primary.contrastText, 0.9),
    textTransform: 'none' as const,
    backgroundColor: 'transparent',
  },
  '& .MuiButton-root.Mui-disabled': {
    color: alpha(theme.palette.primary.contrastText, 0.8),
    borderColor: alpha(theme.palette.primary.contrastText, 0.8),
  },
  '& .MuiButton-root.active': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    borderColor: theme.palette.background.paper,
  },
})

export const getMonthViewBoxSx = (
  theme: Theme,
  isFirst: boolean,
  isLast: boolean
) => ({
  padding: 0,
  backgroundColor: theme.palette.primary.main,
  minHeight: '80px',
  borderRight: isLast
    ? 'none'
    : `2px solid ${alpha(theme.palette.primary.contrastText, 0.25)}`,
  borderLeft: isFirst
    ? `2px solid ${alpha(theme.palette.primary.contrastText, 0.25)}`
    : 'none',
})

export const DescriptionLabelSx = {
  marginTop: '10px',
}

export const DESCRIPTION_LABEL = 'Description / Activities'

// TableBody
export const TableBody = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}));

// NoRecordsMessage
export const NoRecordsMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '20px',
  width: '100%',
  minHeight: '100px',
  color: alpha(theme.palette.text.primary, 0.6),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
  borderTop: 'none',
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
  fontSize: '14px',
  fontWeight: '400',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}));





export {
  BarWrapper,
  Bar
}