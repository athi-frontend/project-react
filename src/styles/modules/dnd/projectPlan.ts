import { styled } from '@mui/material/styles'
import { Box, Typography, Button, SxProps, Theme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { LabelValue } from '@/styles/components/modules/prototypeForm'

export const STAGE_BAR_COLOR = '#E1BEE7'
export const TASK_BAR_COLOR = '#C084FC'
export const container: SxProps<Theme> = {
  borderRadius: '10px',
}

export const scrollContainer: SxProps<Theme> = {
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  position: 'relative',
  borderRadius: '10px',
  scrollbarWidth: 'none',
}

export const timelineWrapper = (totalWeeks: number): SxProps<Theme> => ({
  minWidth: `${totalWeeks * 100 + 250}px`,
  borderCollapse: 'collapse',
  position: 'relative',
})

export const headerRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#5C2483',
  color: '#FFFFFF',
  fontWeight: 'bold',
  borderBottom: '2px solid #5C2483',
  padding: '8px 0',
}

export const snoCell: SxProps<Theme> = {
  width: '60px',
  textAlign: 'center',
  fontWeight: 600,
  p: 1,
}

export const descCell: SxProps<Theme> = {
  width: '250px',
  fontWeight: 600,
  p: 1,
}
export const bodyScroll = {
  height: '400px',
  overflowY: 'auto',
  scrollbarWidth: 'none',
}
export const stageRow: SxProps<Theme> = {
  display: 'flex',
  height: '60px',
  alignItems: 'center',
  backgroundColor: '#F3E7FA',
  borderBottom: '1px solid #E0CFF4',
  py: 1,
}

export const stageDesc: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  width: '250px',
  px: 1,
}

export const stageTimeline: SxProps<Theme> = {
  flex: 1,
  position: 'relative',
}
export const getTimelineBarSx = (
  leftPercent: number,
  widthPercent: number,
  color: string
): SxProps<Theme> => ({
  position: 'relative',
  left: `${leftPercent}%`,
  width: `${widthPercent}%`,
  height: '20px',
  backgroundColor: color,
  borderRadius: '4px',
})

export const taskRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  height: '60px',
  borderBottom: '1px solid #E0CFF4',
  py: 1,
}

export const taskDesc: SxProps<Theme> = {
  width: '250px',
  px: 7.8,
}

export const taskTimeline: SxProps<Theme> = {
  flex: 1,
  position: 'relative',
}

export const monthHeader: SxProps<Theme> = {
  textAlign: 'center',
  backgroundColor: '#5C2483',
  fontWeight: 600,
  padding: '6px 0',
  color: '#FFFFFF',
  border: '1px solid #5C2483',
}

export const weekCell: SxProps<Theme> = {
  width: '100px',
  textAlign: 'center',
  fontSize: '0.85rem',
  padding: '4px 4px 4px 4px',
}

export const expandButton: SxProps<Theme> = {
  mr: 1,
  color: '#6A1B9A',
}

export const taskClickableText: SxProps<Theme> = {
  cursor: 'pointer',

  '&:hover': {
    textDecoration: 'underline',
  },
}

export const timelineContent: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const Container = styled(Box)(({ theme }) => ({
  paddingBottom: '40px',
  alignSelf: 'stretch',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
}))



const Title = styled(Typography)(({ theme }) => ({
  minHeight: '104px',
  width: '100%',
  padding: '40px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  // color: '#111827',
  fontWeight: '600',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '20px',
  },
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
}))

const StyledFormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const GridContainer = styled(Box)({
  borderRadius: '0px 0px 10px 10px',
  marginTop: '10px',
  minHeight: '468px',
  width: '100%',
  overflow: 'auto',
  position: 'relative',
  '& .MuiDataGrid-root': {
    border: 'none',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'rgba(101, 45, 144, 1)',
    color: 'white',
    fontSize: '20px',
    fontWeight: '500',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: '500',
  },
  '& .MuiDataGrid-cell': {
    fontSize: '20px',
    backgroundColor: 'rgba(245, 233, 255, 1)',
    minHeight: '70px !important',
    maxHeight: '70px !important',
    padding: '0 !important',
  },
  '& .MuiDataGrid-row': {
    minHeight: '70px !important',
    maxHeight: '70px !important',
    position: 'relative',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: 'white',
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-columnGroupHeader': {
    backgroundColor: 'rgba(101, 45, 144, 1)',
    color: 'white',
    fontSize: '20px',
    fontWeight: '500',
    height: '74px !important',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: 'rgba(101, 45, 144, 1)',
    color: 'white',
    fontSize: '18px',
    fontWeight: '400',
    height: '30px !important',
  },
  '& .week-header': {
    backgroundColor: 'white',
    color: 'black',
    height: '30px !important',
  },
  '& .week-header-active': {
    backgroundColor: 'rgba(101, 45, 144, 1)',
    color: 'white',
    height: '30px !important',
  },
  '& .task-bar-cell': {
    backgroundColor: 'white',
    padding: '14px 0',
    height: '100%',
  },
  '& .task-bar-cell-filled': {
    padding: '14px 0',
    height: '100%',
  },
  'media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

const SerialNumberCell = styled(Box)({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '20px',
})

const DescriptionCell = styled(Box)({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '40px',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
    color: 'rgba(101, 45, 144, 1)',
  },
  'media (max-width: 991px)': {
    paddingLeft: '20px',
  },
})

const TaskBarCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>(({ color }) => ({
  height: '42px',
  width: '100%',
  backgroundColor: color,
  borderRadius: '0',
  margin: '0 auto',
}))

const TaskBarCellStart = styled(TaskBarCell)({
  borderRadius: '10px 0 0 10px',
})

const TaskBarCellEnd = styled(TaskBarCell)({
  borderRadius: '0 10px 10px 0',
})

const TaskBarCellSingle = styled(TaskBarCell)({
  borderRadius: '10px',
})

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}))

const ModalTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: '600',
  color: '#652D90',
  marginBottom: '10px',
})

const TaskDescription = styled(Typography)({
  fontSize: '18px',
  fontWeight: '500',
  marginBottom: '20px',
})

const DatePickerContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '20px',
})

const DatePickerLabel = styled(Typography)({
  fontSize: '16px',
  fontWeight: '500',
  marginBottom: '4px',
})

const WeekInfoContainer = styled(Box)({
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '12px',
  marginTop: '10px',
})

const WeekInfoTitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '8px',
  color: '#652D90',
})

const WeekInfoText = styled(Typography)({
  fontSize: '14px',
  lineHeight: '1.5',
})

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '10px',
})

const CancelButton = styled(Button)({
  borderRadius: '10px',
  padding: '8px 16px',
  border: '1px solid #652D90',
  color: '#652D90',
  fontWeight: '500',
  textTransform: 'none',
})

const SaveButton = styled(Button)({
  borderRadius: '10px',
  padding: '8px 16px',
  backgroundColor: '#652D90',
  color: 'white',
  fontWeight: '500',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#4e2270',
  },
})

const ErrorText = styled(Typography)({
  color: 'red',
  fontSize: '14px',
  marginTop: '4px',
})


const TruncatedLabelValue = styled(LabelValue)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
})

export const designTeamSectionStyles: { title: SxProps<Theme> } = {
  title: (theme) => ({
    color: theme.palette.text.primary,
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
  }),
}

export const designTeam = {
  clickableStage: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}





// TaskSchedueler
export const HeaderContainer = styled(Box)({
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
})

export const TitleContainer = styled(Box)({
  alignSelf: 'stretch',
  flex: '1',
  flexShrink: '1',
  flexBasis: '40px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  gap: '10px',
  color: '#222',
  fontWeight: '600',
})

export const ButtonsContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
})

export const AddButton = styled(Box)({
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid var(--Primary-Color, #652D90)',
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
  color: '#652D90',
  fontWeight: '500',
  justifyContent: 'start',
  cursor: 'pointer',
})

export const AddMonthButton = styled(Button)({
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid var(--Primary-Color, #652D90)',
  minHeight: '45px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  color: '#652D90',
  fontWeight: '500',
  textTransform: 'none',
})

export const AddIcons = styled(AddIcon)({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '15px',
  strokeWidth: '1.875px',
  stroke: '#652D90',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  flexShrink: '0',
})

export const SectionHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(2)
}));

export const DesignHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const SectionHeaderTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '20px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
}));

export const prdBoxStyles = {
    marginLeft: '40px',
    marginTop: '20px',
}

export const designObjectiveLabelContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

export const designObjectiveIconButton: SxProps<Theme> = {
  paddingBottom: '20px',
}

export const pndBoxStyles = {
    padding: '0px 20px', 
}

export const pndReviewBoxStyles={
    padding: '20px 0px', 
}

export {
  Container,
  Title,
  ContentWrapper,
  StyledFormSection,
  GridContainer,
  SerialNumberCell,
  DescriptionCell,
  TaskBarCell,
  TaskBarCellStart,
  TaskBarCellEnd,
  TaskBarCellSingle,
  ModalContainer,
  ModalTitle,
  TaskDescription,
  DatePickerContainer,
  DatePickerLabel,
  WeekInfoContainer,
  WeekInfoTitle,
  WeekInfoText,
  ButtonContainer,
  CancelButton,
  SaveButton,
  ErrorText,
  TruncatedLabelValue,
}
