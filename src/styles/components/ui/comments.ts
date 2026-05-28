import { Box, SxProps, Theme, Typography, styled } from '@mui/material'

export const Container = styled(Box)({
  display: 'flex',
  alignItems: 'start',
  gap: '40px',
  justifyContent: 'start',
})

export const MainContent = styled(Box)({
  display: 'flex',
  minWidth: '240px',
  width: '756px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
})

export const Header = styled(Box)({
  alignSelf: 'start',
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  justifyContent: 'center',
})

export const Title = styled(Typography)({
  alignSelf: 'stretch',
  margin: 'auto 0',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
})

export const IconContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.primary.main,
  alignSelf: 'stretch',
  display: 'flex',
  minHeight: '30px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  margin: 'auto 0',
  padding: '0 4px',
  cursor: 'pointer',
}))

export const ScrollContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.default,
  marginTop: '10px',
  width: '100%',
  padding: '0 19px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const CommentsContainer = styled(Box)({
  display: 'flex',
  minHeight: '337px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const CommentsList = styled(Box)({
  height: '297px',
  maxWidth: '100%',
  width: '678px',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  pointerEvents: 'auto',
})

export const CommentSection = styled(Box)({
  width: '100%',
  maxWidth: '678px',
  marginBottom: '20px',
  '&:last-child': {
    marginBottom: '0',
  },
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const CommentHeader = styled(Box)({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: '400',
})

export const CommentCard = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  alignItems: 'start',
  gap: '40px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: '18px 20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const CommentContent = styled(Box)({
  display: 'flex',
  minWidth: '240px',
  minHeight: '50px',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'center',
  flexGrow: 1,
  flexShrink: 1,
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const CommentText = styled(Typography)({
  alignSelf: 'stretch',
  width: '100%',
  margin: 'auto 0',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const DetailsLink = styled(Typography)({
  textDecoration: 'underline',
  flexGrow: 1,
  flexShrink: 1,
  width: '45px',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.8',
  },
})

export const ModalContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}))

export const ModalScrollContainer = styled(ScrollContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  border: '1px solid #999',
}))

export const ModalCommentCard = styled(CommentCard)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}))

export const ModalCommentHeader = styled(CommentHeader)(({ theme }) => ({
  color: theme.palette.text.primary,
}))

export const ModalCommentText = styled(CommentText)(({ theme }) => ({
  color: theme.palette.text.primary,
}))

export const NoCommentsMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '297px',
  width: '100%',
  padding: '20px',
  color: theme.palette.text.secondary,
  fontSize: '14px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
}))

export const CursorEnableSx: SxProps<Theme> = {
  pointerEvents: 'auto',
}

