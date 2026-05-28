'use client'
import { styled } from '@mui/material/styles'
import { Box, Button, Typography, Input } from '@mui/material'

/**
*Classification : Confidential
**/

export const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  paddingTop: '20px',
  paddingBottom: '20px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'stretch',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '500',
  '@media (max-width: 991px)': {
    paddingBottom: '100px',
  },
}))

export const TitleContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  paddingLeft: '40px',
  paddingRight: '40px',
  fontSize: '40px',

  textAlign: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    fontSize: '25px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  display: 'flex',
  marginTop: '50px',
  width: '450px',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  fontSize: '20px',

  justifyContent: 'center',
  '@media (max-width: 991px)': {
    marginTop: '40px',
  },
}))

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '70px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    marginTop: '40px',
  },
}))

export const ButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const ProfileImage = styled(Box)(({ theme }) => ({
  aspectRatio: '1',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  alignSelf: 'center',
  maxWidth: '100%',
  '& img': {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: '50%',
  },
}))

export const SaveButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  backgroundColor: 'rgba(101, 45, 144, 1)',
  marginTop: '20px',
  width: '100%',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '10px',
  paddingBottom: '10px',
  gap: '10px',
  color: 'rgba(255, 255, 255, 1)',
  whiteSpace: 'nowrap',
  fontSize: '24px',
  textTransform: 'none',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  '&:hover': {
    backgroundColor: 'rgba(81, 25, 124, 1)',
  },
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

export const CancelButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',

  borderStyle: 'solid',
  borderWidth: '1px',
  marginTop: '20px',
  width: '100%',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '10px',
  paddingBottom: '10px',
  gap: '10px',
  whiteSpace: 'nowrap',

  fontSize: '24px',
  textTransform: 'none',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  '&:hover': {
    backgroundColor: 'rgba(245, 245, 245, 0.1)',
  },
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '450px',
  maxWidth: '100%',
  alignItems: 'start',
  gap: '40px',
  fontSize: '24px',
  textAlign: 'center',
  justifyContent: 'space-between',
}))

export const UploadButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '175px',
  borderRadius: '10px',
  backgroundColor: 'rgba(233, 204, 255, 1)',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '13px',
  paddingBottom: '13px',
  gap: '10px',
  fontSize: '24px',
  textTransform: 'none',
  color: 'rgba(34, 34, 34, 1)',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  cursor: 'pointer',
  position: 'relative',
  top: '14px',
  '&:hover': {
    backgroundColor: 'rgba(223, 184, 255, 1)',
  },
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const RemoveButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '175px',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 223, 223, 1)',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '10px',
  paddingBottom: '10px',
  gap: '10px',
  whiteSpace: 'nowrap',
  fontSize: '24px',
  textTransform: 'none',
  color: 'rgba(34, 34, 34, 1)',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  '&:hover': {
    backgroundColor: 'rgba(255, 203, 203, 1)',
  },
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
}))

export const TitleTypography = styled(Typography)({
  fontSize: 'inherit',
  fontWeight: 'inherit',
})

export const MessageTypography = styled(Typography)({
  marginTop: 1,
  textAlign: 'center',
})

export const HiddenInput = styled(Input)({
  display: 'none',
})
