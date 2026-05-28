import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const FormContainer = styled(Box)(({ theme }) => ({
    borderRadius: "10px",
    backgroundColor: theme.palette.background.paper,
    minWidth: "240px",
    paddingTop: "30px",
    paddingBottom: "30px",
    width: "100%",
    "@media (max-width: 991px)": {
        maxWidth: "100%",
    },
}));

export const FormContent = styled(Box)(({ theme }) => ({
    width: "100%",
    "@media (max-width: 991px)": {
        maxWidth: "100%",
    },
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
    alignSelf: "stretch",
    width: "100%",
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingBottom: "10px",
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: "24px",
    color: theme.palette.text.primary,
    fontWeight: "600",
    lineHeight: "1",
    "@media (max-width: 991px)": {
        maxWidth: "100%",
        paddingLeft: "20px",
        paddingRight: "20px",
    },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    alignSelf: "stretch",
    width: "100%",
    paddingLeft: "40px",
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

export const FormSection = styled(Box)(({ theme }) => ({
    width: "100%",
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
    "@media (max-width: 991px)": {
        maxWidth: "100%",
    },
}));
 export const BoxSection = styled(Box)(({theme}) => ({
    marginTop: '10px', paddingLeft: '40px', paddingRight: '40px', width: '100%' 
 }))