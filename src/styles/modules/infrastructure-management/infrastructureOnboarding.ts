import { styled } from '@mui/material/styles'
import { Tab, Tabs } from '@mui/material'
import { FormWrapper } from '@/styles/modules/user/userOnboard'

/**
 * Classification : Confidential
 * Styles for Infrastructure Onboarding page
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

export const LocalStyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.secondary,
  minWidth: 'auto',
  textAlign: 'left',
  padding: '12px 16px',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}))

export const TabsFormWrapper = styled(FormWrapper)(({ theme }) => ({
  paddingLeft: '25px',
}))

export const ContentFormWrapper = styled(FormWrapper)(({ theme }) => ({
  marginTop: '20px',
}))

