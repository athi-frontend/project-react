import { styled, SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const SectionTitle = styled(Typography)(({ theme }) => ({
    alignSelf: "stretch",
    width: "100%",
    paddingLeft: "10px",
    paddingTop: "40px",
    paddingRight: "40px",
    gap: "20px",
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: "18px",
    color: theme.palette.text.primary,
    lineHeight: "1",
    "@media (max-width: 991px)": {
        maxWidth: "100%",
        paddingLeft: "20px",
        paddingRight: "20px",
    },
}));

export const downloadStyles: { title: SxProps<Theme> } = {
  title: {
    textDecoration: 'underline', 
      cursor: 'pointer', 
  },
}
