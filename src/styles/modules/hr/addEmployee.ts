import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

export const FormContainer = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: theme.palette.background.paper,
  minWidth: "240px",
  paddingTop: "10px",
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
  fontSize: "24px",
  fontWeight: "600",
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

export const FormRow = styled(Box)(({ theme }) => ({
  display: "flex",
  maxWidth: "100%",
  width: "100%",
  paddingLeft: "40px",
  flexDirection: "row",
  paddingRight: "40px",
  alignItems: "start",
  gap: "40px",
  justifyContent: "start",
  marginTop: "20px",
  "@media (max-width: 991px)": {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}));

export const LabelColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  minWidth: "240px",
  paddingRight: "80px",
  paddingBottom: "18px",
  flexDirection: "column",
  alignItems: "start",
  flexGrow: "1",
  flexShrink: "1",
  width: "575px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const LabelTitle = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
}));

export const LabelValue = styled(Typography)(({ theme }) => ({
  color: "#999",
  fontSize: "16px",
  marginTop: "28px",
}));

export const InputColumn = styled(Box)(({ theme }) => ({
  minWidth: "240px",
  flexGrow: "1",
  flexShrink: "1",
  width: "574px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const FullWidthColumn = styled(Box)(({ theme }) => ({
  minWidth: "240px",
  width: "719px",
}));

export const TextareaContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minWidth: "240px",
  width: "718px",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
}));

export const TextareaLabel = styled(Typography)(({ theme }) => ({
  color: "#222",
  fontSize: "18px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const Textarea = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  marginTop: "10px",
  minHeight: "150px",
  width: "100%",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingTop: "18px",
  paddingBottom: "108px",
  gap: "10px",
  fontSize: "16px",
  color: "#999",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
    paddingBottom: "100px",
  },
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: "40px",
  width: "100%",
  paddingLeft: "40px",
  paddingRight: "40px",
  paddingBottom: "40px",
  alignItems: "center",
  gap: "20px",
  fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  fontSize: "20px",
  color: "#652D90",
  fontWeight: "500",
  textAlign: "center",
  justifyContent: "end",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "64px",
  width: "100%",
  paddingLeft: "40px",
  paddingRight: "40px",
  paddingTop: "20px",
  paddingBottom: "10px",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "40px 100px",
  "@media (max-width: 991px)": {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1",
  alignSelf: "stretch",
  marginTop: "auto",
  marginBottom: "auto",
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  alignSelf: "stretch",
  display: "flex",
  minWidth: "240px",
  marginTop: "auto",
  marginBottom: "auto",
  alignItems: "center",
  gap: "20px",
  fontSize: "20px",
  color: "#652D90",
  fontWeight: "500",
  justifyContent: "flex-end",
  width: "767px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const AddButton = styled(Button)(({ theme }) => ({
  alignItems: "center",
  alignSelf: "stretch",
  textTransform:"none",
  display: "flex",
  marginTop: "auto",
  marginBottom: "auto",
  minHeight: "45px",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingTop: "8px",
  paddingBottom: "8px",
  gap: "20px",
  overflow: "hidden",
  justifyContent: "flex-start",
  cursor: "pointer",
}));

export const AddButtonText = styled(Typography)(({ theme }) => ({
  alignSelf: "stretch",
  marginTop: "auto",
  marginBottom: "auto",
  width: "90px",
}));

export const InfoLabel = styled(Box)(({ theme }) => ({
  color: "#222",
  fontSize: "18px",
  display: "flex",
  width: "100%",
  paddingRight: "80px",
  paddingBottom: "18px",
  "@media (max-width: 991px)": {
    paddingRight: "20px",
  },
}));

export const InfoValue = styled(Box)(({ theme }) => ({
  color: "#999",
  fontSize: "16px",
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: '0px',
}))

export const InlineStyles = {
  formContent: {
    marginTop: "20px",
  },
  gridContainer: {
    width: "100%",
  },
  hiddenInput: {
    display: "none",
  },
};