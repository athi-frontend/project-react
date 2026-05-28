import { SxProps, Theme } from "@mui/material/styles";

// RemarksScroll component styles
export const remarksContainerStyles: SxProps<Theme> = (theme: Theme) => ({
  borderRadius: "10px",
  backgroundColor: theme.palette.background.paper,
  maxWidth: "720px",
  overflow: "auto",
  height:'200px',
  scrollbarWidth:"none",
  font: "400 16px Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  border: "1px solid rgba(153, 153, 153, 1)",
});

export const remarksContentStyles: SxProps<Theme> = {
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
  padding: "20px",
};

export const remarksListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

// RemarkItem component styles
export const remarkItemContainerStyles: SxProps<Theme> = {
  width: "100%",
  maxWidth: "678px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
};

export const remarkHeaderStyles: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: "40px 100px",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

export const creatorInfoStyles: SxProps<Theme> = {
  alignSelf: "stretch",
  margin: "auto 0",
};

export const dateInfoStyles: SxProps<Theme> = {
  alignSelf: "stretch",
  margin: "auto 0",
};

export const commentBoxStyles: SxProps<Theme> = (theme: Theme) => ( {
  borderRadius: "10px",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  marginTop: "10px",
  minHeight: "114px",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  padding: "33px 20px",
});

export const commentTextStyles: SxProps<Theme> = {
  alignSelf: "stretch",
  width: "577px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
  margin: "auto 0",
};

export const noCommentsMessageStyles: SxProps<Theme> = (theme: Theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "160px",
  width: "100%",
  padding: "20px",
  color: theme.palette.text.secondary,
  fontSize: "14px",
  fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  fontWeight: "400",
});
