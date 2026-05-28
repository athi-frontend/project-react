/**
 Classification : Confidential
**/
import { styled, Box } from '@mui/material'
export const POPUP_STYLE =  {padding: '0px 40px',
            overflow: 'auto',
            scrollbarWidth: 'none',
            height: '400px',}
export const Container = styled(Box)(({ theme }) => ({
  paddingLeft: '7px',
  paddingRight: '7px',
}))

export const Content = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  maxWidth: '100%',
  width: '1557px',
  flexDirection: 'column',
  overflow: 'hidden',
  justifyContent: 'start',
}))

export const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingBottom: '20px',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const EYE_ICON_STYLE = {
  cursor: 'pointer'
}