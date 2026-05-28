import { styled } from '@mui/material/styles'
import { Box, LinearProgress, Stepper } from '@mui/material'
const TopDecorationContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}))

const DecorationPill = styled(Box)(({ theme }) => ({
  borderRadius: '0px 0px 50px 50px',
  backgroundColor: 'rgba(247, 242, 251, 1)',
  alignSelf: 'stretch',
  display: 'flex',
  minHeight: '49px',
  width: '46px',
  alignItems: 'end',
  justifyContent: 'center',
  margin: 'auto 0',
  padding: '7px 0',
}))

const IconContainer = styled(Box)(({ theme }) => ({
  borderRadius: '50px',
  backgroundColor: 'rgba(234, 214, 250, 1)',
  boxShadow: '0px 3px 18px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  width: '35px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '35px',
  padding: '0 10px',
}))

const SidebarContainer = styled(Box)(() => ({
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  maxWidth: '230px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'start',
}))

const ContentContainer = styled(Box)(() => ({
  display: 'flex',
  marginTop: '19px',
  width: '100%',
  alignItems: 'center',
  overflow: 'hidden',
  justifyContent: 'start',
}))

const StepperContainer = styled(Box)(() => ({
  alignSelf: 'stretch',
  display: 'flex',
  flexDirection: 'column',
  height: '230px',
  width: '230px',
  alignItems: 'center',
  justifyContent: 'start',
  margin: 'auto 0',
  padding: '0 20px',

  overflowY: 'auto',
  scrollBehavior: 'smooth',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}))

const CustomStepper = styled(Stepper)(() => ({
  flexDirection: 'column',
  alignItems: 'flex-start',
  '& .MuiStepLabel-root': {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  '& .MuiStepLabel-labelContainer': {
    marginLeft: '10px',
  },
  '& .MuiStepLabel-label': {
    color: 'rgba(101, 45, 144, 1)',
    font: '400 14px/20px Poppins, sans-serif',
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: 'rgba(101, 45, 144, 1)',
    fontWeight: 500,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: 'rgba(101, 45, 144, 1)',
  },
  '& .MuiStepLabel-iconContainer': {
    padding: 0,
  },
}))

const CustomLinearProgress = styled(LinearProgress)(() => ({
  width: '3px',
  minHeight: '70px',

  marginLeft: '14px',
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'red',
  },
}))

const BottomDecorationContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  marginTop: '19px',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}))

export {
  BottomDecorationContainer,
  IconContainer,
  DecorationPill,
  TopDecorationContainer,
  CustomLinearProgress,
  CustomStepper,
  SidebarContainer,
  ContentContainer,
  StepperContainer,
}
