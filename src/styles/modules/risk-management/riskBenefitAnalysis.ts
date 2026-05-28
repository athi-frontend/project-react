/**
    Classification : Confidential
**/
import { Box, styled } from "@mui/material";
import { PageContainer as CommonPageContainer } from "@/styles/common";

export const PageContainer = styled(CommonPageContainer)(({ theme }) => ({
  paddingBottom: '30px',
}))

export const ClickableCountCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable: boolean }>(({ isClickable }) => ({
  cursor: isClickable ? 'pointer' : 'default',
  textDecoration: isClickable ? 'underline' : 'none',
}))