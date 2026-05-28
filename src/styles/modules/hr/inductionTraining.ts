import { Box, styled } from "@mui/material";

export const UNDERLINE="underline";
export const WIDTH1=100;
export const WIDTH2=200;
export const WIDTH3=250;
export const WIDTH4=150;
export const STYLE_HEIGHT= {height:"50px"};
export const SXSTYLE = {
          textField: {
            size: 'small',
            sx: {
              '& .MuiInputBase-root': {
                height: 32,
                fontSize: '0.875rem',
              },
              '& .MuiOutlinedInput-input': {
                padding: '6px 8px',
              },
            },
          },
        }
export const Input_Field = {'& .MuiInputBase-root': {
      height:40
    }}
export const HEIGHT="400px";
export const STYLE_NEW={ textDecoration: UNDERLINE, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit", color: 'inherit' }

export const PageContainer = styled(Box)({
    width: "100%",
    minWidth: "800px",
    maxWidth: "100%",
    boxSizing: "border-box",
  });

export const TableErrorStyle = {
  marginTop: "10px",
  marginLeft: "40px",
};