import { styled } from '@mui/material/styles'
import { Grid2, SxProps, Box, Theme } from '@mui/material'
import {
  Container as CommonContainer,
  ContentContainer as CommonContentContainer,
} from '@/styles/common'

const Container = styled(CommonContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  paddingBottom: 40,
  padding: '0px 40px',
}))
const GridStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
}))

const Content = styled(CommonContentContainer)(({ theme }) => ({
  paddingBottom: '20px',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

export const styles = {
  buttonContainer: {
    alignSelf: 'flex-end',
    marginRight: '20px',
  },
  commentsContainer: {
    alignSelf: 'flex-start',
    marginLeft: '40px',
    marginTop: '20px',
  }
};



const FormSection = styled(Grid2)(({ theme }) => ({
  width: '100%',
  padding: '0 40px',
  [theme.breakpoints.down('md')]: {
    padding: '0 20px',
  },
}))

const ButtonGroupBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  margin: '40px 0px',
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

export const FORM_CONTENT_STYLES: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}
export const gridStyles: SxProps<Theme> = {
  width: '100%',
  justifyContent: 'center',
}
export const containerStyles: SxProps<Theme> = {
  paddingBottom: '40px',
}
export const INPUT_LABEL_STYLES: SxProps = {
  marginTop: 2,
}
export const INPUT_LABEL_SOURCE: SxProps = {
  marginTop: 2,
}

export const PAPER_STYLES: SxProps = {
  height: 300,
  overflow: 'auto',
}
export const MODAL_SUBTITLE_STYLES: SxProps = {
  marginBottom: '40px',
}

export const TEXTFIELD_STYLES: SxProps = {
  mb: 2,
}

export { Container, Content, FormSection, ButtonGroupBox, GridStyle }
