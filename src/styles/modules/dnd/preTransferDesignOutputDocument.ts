import { Box, styled, Typography } from "@mui/material";
import { UNDERLINE } from "../hr/inductionTraining";
import { popup_style } from "@/styles/common";
/**
    Classification : Confidential
**/
export const StepContainer = styled(Typography)({
  whiteSpace: 'normal',
  wordWrap: 'break-word',
})
export const styled_container={
textDecoration: UNDERLINE,
cursor: 'pointer',
}

export const popup_style_P0 = {...popup_style,
    padding : 0,
 }

export const CommentsHistoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  paddingLeft: '40px',
  paddingTop:'40px'
}))

