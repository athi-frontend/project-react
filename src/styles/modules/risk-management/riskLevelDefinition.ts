import { styled } from '@mui/material/styles'
import { Box, Tab, Tabs } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import { FormWrapper } from '@/styles/modules/user/userOnboard'
/**
 *Classification : Confidential
 **/
export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '20px',
    minHeight: 64,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}))

export const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: '100%',
  textAlign: 'left',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}))

export const LocalStyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.secondary,
  minWidth: 'auto',
  textAlign: 'left',
  padding: '12px 16px',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}))

export const RiskLevelGridItem = styled(Grid2)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: theme.spacing(0.5),
  boxShadow: theme.shadows[2],
  position: 'relative',
  minHeight: 140,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  margin: 0,
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    transition: 'all 0.2s ease-in-out',
  },
}))

// Common typography base for card content
const commonCardTypography = {
  fontFamily: 'Poppins',
  fontSize: '18px',
  fontStyle: 'normal' as const,
  fontWeight: 400,
  lineHeight: 'normal',
  margin: 0,
}

export const CardTitle = styled('h3')(({ theme }) => ({
  ...commonCardTypography,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}))

export const CardValue = styled('p')(({ theme }) => ({
  ...commonCardTypography,
  color: theme.palette.text.primary,
}))

export const CardDescription = styled('p')(({ theme }) => ({
  ...commonCardTypography,
  color: theme.palette.text.disabled,
}))

export const EditIconContainer = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.primary.main,
}))

export const CardBottomContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

// Styled components for specific layout needs
export const TabsFormWrapper = styled(FormWrapper)(({ theme }) => ({
  paddingLeft: '25px',
}))

export const ContentFormWrapper = styled(FormWrapper)(({ theme }) => ({
  marginTop: '20px',
}))

export const RiskNavigationWrapper = styled(Box)(() => ({
  padding: '0px 40px 10px 0px',
}))