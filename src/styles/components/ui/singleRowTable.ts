import { styled, Box, Typography ,TableContainer, TableCell} from "@mui/material";
export const CalibrationContainer = styled(Box)(({ theme }) => ({
  maxWidth: "800px",
  width: "100%",
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  fontSize: "24px",
  fontWeight: 500,
  color: "white",
  minHeight: "85px",
//   marginBottom: "10px",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "0 40px",
  width: "100%",
  backgroundColor: "#581c87", // purple-900
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  minHeight: "85px",
  [theme.breakpoints.down("md")]: {
    padding: "0 20px",
    maxWidth: "100%",
  },
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "white",
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "#e9d5ff", // purple-100
  borderRadius: "0",
  boxShadow: "none",
  border: "1px solid #d4d4d8", // zinc-300
  "& .MuiTable-root": {
    borderCollapse: "separate",
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: "1px solid #d4d4d8", // zinc-300
  padding: "36px 40px",
  minHeight: "100px",
  verticalAlign: "middle",
  [theme.breakpoints.down("md")]: {
    padding: "36px 20px",
  },
}));

export const LabelCell = styled(StyledTableCell)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 500,
  color: "#404040", // neutral-800
  backgroundColor: "#e9d5ff", // purple-100
  width: "50%",
  borderRight: "1px solid #d4d4d8", // zinc-300
}));

export const ValueCell = styled(StyledTableCell)(({ theme }) => ({
  fontSize: "18px",
  color: "#9ca3af", // neutral-400
  backgroundColor: "#e9d5ff", // purple-100
  width: "50%",
  "& img": {
    width: "28px",
    height: "28px",
    objectFit: "contain",
  },
}));

export const CustomTypography = {
  fontSize: "18px",
  color: "#9ca3af",
  whiteSpace: "nowrap"
}

export const TableWith = "800px"