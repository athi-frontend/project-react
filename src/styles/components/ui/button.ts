import { styled } from '@mui/system'
import { Box, Button } from '@mui/material'
import {
  ButtonWrapper as CommonButtonWrapper,
  StyledButton as CommonStyledButton,
} from '../../common'
import { SaveButton } from '../modules/procurement'

const ButtonContainer = styled(CommonButtonWrapper)(({ theme }) => ({
  maxWidth: '100%',
  fontSize: '20px',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

const ButtonWrapperExtended = styled(CommonButtonWrapper)(({ theme }) => ({
  alignSelf: 'stretch',

  marginTop: 'auto',
  marginBottom: 'auto',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

const StyledButton = styled(CommonStyledButton)(({ theme }) => ({
  alignSelf: 'stretch',
  border: `1px solid ${theme.palette.primary.main}`,
  gap: '10px',
  marginTop: '20px',
  '&.Mui-disabled':{
    color:theme.palette.info.main,
    borderColor:theme.palette.info.main
   },
  // color:theme.palette.text.primary,
  overflow: 'hidden',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '40px',
  width: '100%',
  alignItems: 'center',
  gap: '20px',
  color: '#000001',
  textAlign: 'center',
  justifyContent: 'flex-end',
  padding: '0 40px',
  font: '500 20px Poppins, sans-serif',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

const ButtonWrapper = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'end',
  flexWrap: 'wrap',
  margin: 'auto 0',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const CloseButton = styled(Button)(({ theme }) => ({}))


export const InlineStyles = {
  formControl: {
    minWidth: 150,
    marginRight: 10,
  },
}

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    padding: '20px 0',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  },
  grid: {
    width: '100%',
    alignItems: 'center',
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    
    paddingRight:"40px"
  },
  PR:{ paddingRight: "10px" },
  MT:{marginTop:"10px"},
  SearchIcon:{fontSize:20,color:"text.secondary"}
}
export {
  styles,
  ButtonContainer,
  ButtonWrapper,
  SaveButton,
  StyledButton,
  CloseButtonWrapper,
  CloseButton,
}
