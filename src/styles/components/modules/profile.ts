import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(245, 233, 255, 1)',
  display: 'flex',
  paddingTop: '71px',
  paddingBottom: '234px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'stretch',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '500',
  '@media (max-width: 991px)': {
    paddingBottom: '100px',
  },
}))

export const ProfileTitle = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '664px',
  paddingLeft: '40px',
  paddingRight: '40px',
  fontSize: '60px',
  color: 'rgba(17, 17, 17, 1)',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    fontSize: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const ProfileContentWrapper = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  display: 'flex',
  marginTop: '176px',
  width: '450px',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  fontSize: '20px',
  color: 'rgba(34, 34, 34, 1)',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    marginTop: '40px',
  },
}))

export const ProfileImage = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '200px',
  alignSelf: 'center',
  maxWidth: '100%',
}))

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '113px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    marginTop: '40px',
  },
}))

export const ButtonGroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '422px',
  maxWidth: '100%',
  alignItems: 'start',
  gap: '40px',
  fontSize: '24px',
  textAlign: 'center',
  justifyContent: 'start',
}))

export const UploadButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '190px',
  borderRadius: '10px',
  backgroundColor: 'rgba(233, 204, 255, 1)',
  padding: '10px 40px',
  gap: '10px',
  '@media (max-width: 991px)': {
    padding: '10px 20px',
  },
}))

export const RemoveButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '190px',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 223, 223, 1)',
  padding: '10px 40px',
  gap: '10px',
  whiteSpace: 'nowrap',
  '@media (max-width: 991px)': {
    padding: '10px 20px',
    whiteSpace: 'initial',
  },
}))

export const SaveButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  backgroundColor: 'rgba(101, 45, 144, 1)',
  marginTop: '20px',
  width: '100%',
  padding: '10px',
  gap: '10px',
  color: 'rgba(255, 255, 255, 1)',
  whiteSpace: 'nowrap',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

export const CancelButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  borderColor: 'rgba(34, 34, 34, 1)',
  borderStyle: 'solid',
  borderWidth: '1px',
  marginTop: '20px',
  width: '100%',
  padding: '10px',
  gap: '10px',
  whiteSpace: 'nowrap',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))
