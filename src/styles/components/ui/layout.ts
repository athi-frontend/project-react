import { styled } from '@mui/material/styles'
import { Box, SxProps, Theme } from '@mui/material'
import {
  ContentContainer as CommonContentContainer,
  FormSection as CommonFormSection,
} from '@/styles/common'

/**
    Classification : Confidential
**/
export const fullWidth = { width: '100%' }

export const FlexCenterBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

export const PageContainer = styled(Box)({
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'start',
  flexWrap: 'wrap',
})

export const ContentContainer = styled(CommonContentContainer)({
  minWidth: '240px',
  paddingTop: '10px',
  paddingBottom: '10px',
  alignItems: 'stretch',
  width: '1282px',
})

export const ContentWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: '#fff',
  minHeight: '897px',
  ...fullWidth,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: { maxWidth: '100%' },
}))

export const FormSection = styled(CommonFormSection)({})

export const FormContent = styled(Box)(({ theme }) => ({
  ...fullWidth,
  fontWeight: 400,
}))

export const FormFields = styled(Box)(({ theme }) => ({
  ...fullWidth,
}))

export const FormFieldContainer = styled(FlexCenterBox)(({ theme }) => ({
  ...fullWidth,
}))

export const FormFieldWrapper = styled(FlexCenterBox)({
  width: '719px',
  maxWidth: '100%',
})


// Inline styles moved to the top
export const InlineStyles = {
  mainHeader: {
    bgcolor: 'background.paper',
    borderColor: 'primary.main',
  },
  notificationButton: {
    border: '1px solid',
    borderColor: 'primary.main',
    color: 'primary.main',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
}

export const themeWrapperSx: SxProps<Theme> = {
  border: '1px solid',
  borderColor: 'primary.main',
}

export const themeDropdownSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
}

export const colorSwatchSx = (color: string): SxProps<Theme> => ({
  backgroundColor: color,
  border: '1px solid',
  borderColor: 'text.secondary',
})
export const themeIconButtonSx = {
  color: 'primary.main',
}

export const spinnerStyle = (theme: Theme) => {
        const isDark = theme.palette.background.default === '#000000' || 
                      theme.palette.mode === 'dark'
        return {
          position: 'fixed',
          bottom: 0,
          width: '80%',
          height:"90%",
          bgcolor: isDark 
            ? 'rgba(0,0,0,0.7)' 
            : 'rgba(255,255,255,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }
      }

export const loadingPage = {
    display:"flex",
          justifyContent:"center",
          alignItems:"center",
          minHeight:"100vh"
}