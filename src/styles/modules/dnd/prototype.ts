import { Box, styled, TooltipProps, SxProps, Theme } from '@mui/material'

export const PageContainer = styled(Box)({
  width: "100%",
});

export const tooltipSlotProps: TooltipProps["slotProps"] = {
  tooltip: {
    sx: {
      bgcolor: "#F5E9FF",
      color: "#222222",
      fontSize: "12px",
      padding: "2px 10px",
      borderRadius: "4px",
      marginBottom: "2px !important",
      width:"200px",
      textAlign: "center",
    },
  },
};
export const LINK_STYLE = {textDecoration: 'underline'}

export const actionsContainerSx: SxProps<Theme> = {
  display: "flex",
  gap: "8px",
};

export const tooltipContentSx: SxProps<Theme> = {
  cursor: "pointer",
  padding: "4px 8px",
};
