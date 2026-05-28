import { styled } from '@mui/material/styles'
import { Box, Typography, Button, SxProps, Theme } from '@mui/material'
import { NUMBERMAP } from '@/constants/common'
import { WIDTH_100 } from '@/constants/modules/hr/trainingEvaluation'
/**
    Classification : Confidential
**/

// product realization plan
export const popup_style= { padding: '0px 40px' ,overflow:"auto",scrollbarWidth:"none",height:"400px"}
export const PADDING = { padding: '0px 40px' }
export  const P20P40 = { padding: '20px 40px' }
export const ERROR_COLOR= { color: 'red', marginTop: '8px' }
export const UnderLine = { textDecoration: 'underline' }
export const NoUnderline = { textDecoration: 'none' }

export const BOX_STYLES = { display: 'flex', gap: '16px' }
export const ICON_SIZE = { width: '12px', height: '12px' }
export const themeColors: Record<string, string> = {
  light: '#ffffff',
  dark: '#000000',
}
export const STROKE = '#652D90'
export const CommonInlineStyles = {
  displayNone:{
    display: 'none',
  }
}

export const ACTION_ICONS_WRAPPER_SX: SxProps<Theme> = {
  position: 'relative',
  right: '9px',
}

const PageContainer = styled(Box)(({ theme }) => ({
  padding: '0',
  backgroundColor: theme.palette.background.paper,

  width: '100%',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  justifyContent: 'flex-start',
}))

export const UnderLineButton = styled(Button)(({ theme }) => ({
  textDecoration: 'underline',
  border: 'none',
  textTransform: 'none',
  fontSize: 16,
  fontWeight: 500,
  color: theme.palette.text.primary,
  '&:hover': {
    border: 'none',
  },
}))
const TableContainer = styled(Container)({
  padding: 0,
})

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 18,
  marginBottom: 10,
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 600,
  lineHeight: 1,
  paddingLeft: '0px',
  color: theme.palette.text.primary,
}))

const HeaderTitle = styled(Typography)({
  font: '600 24px/1 Poppins, sans-serif',
  verticalAlign: 'middle',
})

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: 14,
  marginTop: 5,
}))

const HeaderContainer = styled(Box)({
  borderRadius: 10,
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
})

const ContentContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

const FormSection = styled(Box)({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

const ButtonWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  justifyContent: 'flex-end',
})

const StyledButton = styled(Button)({
  borderRadius: 10,
  padding: '8px 18px',
  fontSize: 18,
  fontWeight: 500,
  textTransform: 'none',
})

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
}))

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
}))

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2),
  borderRadius: 10,
}))

//Button Link
const ButtonLink = styled(Button)(({ theme }) => ({
  textDecoration: 'underline',
  textTransform: 'none',
  color: theme.palette.text.primary,
}))

const CommonModalScroll = styled(Box)(({ theme }) => ({
  height: '500px',
  overflow: 'hidden',
  overflowY: 'scroll',
  scrollbarWidth: 'none',
}))

export {
  Container,
  TableContainer,
  Label,
  ErrorText,
  HeaderContainer,
  HeaderTitle,
  ContentContainer,
  FormSection,
  Title,
  ButtonWrapper,
  StyledButton,
  PrimaryButton,
  SecondaryButton,
  ModalContent,
  PageContainer,
  ButtonLink,
  CommonModalScroll
}
export const INPUT_FIELD_STYLE={marginRight: NUMBERMAP.EIGHT,display: 'flex',alignItems: 'center'}
export const headerContainerSx: SxProps<Theme> = {
width: '100%', 
alignItems: 'center',
}
export const headerGridSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  paddingRight: '40px',
  marginTop: '-17px',
}

export const InfoLabel = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "18px",
  display: "flex",
  width: "100%",
  paddingRight: "80px",
  paddingBottom: "18px",
  "@media (max-width: 991px)": {
    paddingRight: "20px",
  },
}));
export const addIconSx: SxProps<Theme> = {
  marginRight: 2,
};

export const CenteredContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

export const draftLoader  = (theme) => ({
        position: 'fixed',
        top: '22%',
        right: '2%',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        padding: '6px 12px',
        border: `0.1px solid ${theme.palette.text.secondary}`,
        boxShadow: 3,
})

// Grid Table Cell Alignment Styles
export const GRID_STYLES = {
  CELL_ALIGNMENT: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    '& .MuiInputBase-root': {
      height: 40
    },
    '& p:empty': {
      display: 'none'
    },
    '& .MuiTypography-root:empty': {
      display: 'none'
    }
  },
  CELL_BASIC_ALIGNMENT: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    '& .MuiInputBase-root': {
      height: 40
    }
  }
} as const;
export  const PY20 = { padding: '20px 0' };

export const errorTextSx: SxProps<Theme> = {
  color: "error.main",
  fontSize: 14,
  marginTop: 0.5,
};

export const FullWidth = {width: WIDTH_100 }