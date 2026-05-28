import { Box, styled } from "@mui/material";
const PageContainer = styled(Box)({
  width: "100%",
});

export const GENERIC_MODAL_STYLES = {
  GRID_CONTAINER: {
    height: "400px",
    overflow: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
};


export const InlineStyles = {
  statusActive: {
    color: "green",
  },
  statusInactive: {
    color: "red",
  },
};
export {PageContainer}


export const validationStyle = {
  color: '#d32f2f',
  fontSize: '0.875rem',
  marginTop: '8px',
}