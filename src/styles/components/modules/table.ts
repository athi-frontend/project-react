import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const TableWrapper = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: "#FFF",
  marginTop: "20px",
  width: "100%",
  overflow: "hidden",
  fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  fontWeight: "400",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));
export const tablewrapper = { padding: "20px 30px" }
export const TableTitle = styled(Typography)(({ theme }) => ({
  width: "100%",
  paddingLeft: "0px",
  paddingRight: "40px",
  paddingTop: "10px",
  paddingBottom: "10px",
  fontSize: "20px",
  color: "#111827",
  whiteSpace: "nowrap",
  lineHeight: "1.2",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
    whiteSpace: "initial",
  },
}));

export const TableHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "85px",
  width: "100%",
  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "20px",
  paddingBottom: "20px",
  alignItems: "center",
  gap: "40px 100px",
  fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  fontSize: "20px",
  justifyContent: "space-between",
  flexWrap: "wrap",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}));

export const TableHeaderTitle = styled(Typography)(({ theme }) => ({
  color: "#111827",
  fontWeight: "400",
  lineHeight: "1.2",
  alignSelf: "stretch",
  marginTop: "auto",
  marginBottom: "auto",
  fontSize: "20px",
}));

export const AddButton = styled(Box)(({ theme }) => ({
  alignItems: "center",
  borderRadius: "10px",
  border: "1px solid var(--Primary-Color, #652D90)",
  alignSelf: "stretch",
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
  color: "#652D90",
  fontWeight: "500",
  justifyContent: "start",
  cursor: "pointer",
}));

export const AddButtonIcon = styled("img")({
  aspectRatio: "1",
  objectFit: "contain",
  objectPosition: "center",
  width: "15px",
  strokeWidth: "1.875px",
  stroke: "#652D90",
  alignSelf: "stretch",
  marginTop: "auto",
  marginBottom: "auto",
  flexShrink: "0",
});

export const AddButtonText = styled(Typography)({
  alignSelf: "stretch",
  marginTop: "auto",
  marginBottom: "auto",
});

export const HyperlinkCell = styled(Typography)({
  textDecoration: "underline",
  cursor: "pointer",
});

export const ActionButtonsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

// Table style constants
export const TABLE_STYLE = {
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#F5E9FF",
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 500,
      fontSize: "20px",
      color: "#333",
    },
  },
  "& .MuiDataGrid-cell": {
    fontSize: "18px",
    color: "#333",
    borderBottom: "1px solid #D8D8D8",
  },
  "& .table-header": {
    padding: "20px 40px",
  },
  "& .table-cell": {
    padding: "15px 40px",
  },
  "& .MuiDataGrid-row": {
    minHeight: "70px !important",
  },
};