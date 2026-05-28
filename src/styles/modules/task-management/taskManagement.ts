import { SxProps, Theme } from '@mui/material';

export const taskManagementContainerSx: SxProps<Theme> = (theme) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
});

export const headerSectionSx: SxProps<Theme> = {
  alignItems: 'center',
  padding: '20px 40px',
};

export const headerTitleSx: SxProps<Theme> =  (theme) => ({
  color:  theme.palette.text.primary,
  fontSize: "24px",
  fontWeight: "600",
});

export const controlBarSx: SxProps<Theme> = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  padding: '0 20px',
  minHeight: '60px',
  maxWidth: '420px',
  ml: 'auto',
});

export const navButtonSx: SxProps<Theme> = (theme) => ({
  backgroundColor: `${theme.palette.action.hover} !important`,
  borderRadius: '5px',
  });

export const pageTitleSx: SxProps<Theme> = (theme) => ( {
  color:  theme.palette.primary.main,
  mx: 1,
  minWidth: '120px',
  width: '180px',
});

export const pageTitleTypographySx: SxProps<Theme> = {
  fontSize: '14px',
  lineHeight: '18px',
};

export const verticalDividerSx: SxProps<Theme> = (theme) => ({
  borderColor: theme.palette.text.secondary,
  height: '40px',
  alignSelf: 'center',
});

export const searchToggleSx: SxProps<Theme> = {
  p: 0.5,
};
export const expandsearchToggleSx: SxProps<Theme> = (theme) => ({
  p: 0.3,
  backgroundColor: theme.palette.action.hover,
  borderRadius: '7px',
  marginLeft: '5px',
   "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

export const searchContainerSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      padding: '0px 12px 10px 12px',
    },
  },
  minWidth: 260,
};

export const viewAllContainerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderRadius: '4px',
};

export const viewAllTextSx: SxProps<Theme> = {
  ml: 0,
  whiteSpace: 'nowrap',
};

export const nextButtonSx: SxProps<Theme> = (theme) => ({
  backgroundColor: `${theme.palette.action.hover} !important`,
  borderRadius: '5px',
  marginLeft: '15px',
});

export const pageMenuSx: SxProps<Theme> =  (theme) => ({
  borderRadius: '10px',
  border: `1px solid ${theme.palette.divider}`,
  mt: 0.6,
  ml: -2.2,
  minWidth: 200,
});

export const menuItemSx: SxProps<Theme> = (theme) => ({
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
});
export const searcToggleSx: SxProps<Theme> = {
display: 'flex', 
alignItems: 'center', 
cursor: 'pointer' 
};
export const viewAllClickedSx: SxProps<Theme> =  (theme) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flex: 1, 
  justifyContent: 'flex-start',
  backgroundColor: theme.palette.background.default,
  padding: '12px 20px',
  width: '100%',
  margin: '0 -20px',
  borderRadius: '10px',
  position: 'relative',
  left: '0px',
  right: '-20px',
});
export const viewAllExpandTextSx: SxProps<Theme> = {
  ml: 0,
  whiteSpace: 'nowrap',
};

export const loadingSpinnerSx: SxProps<Theme> = {
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '400px'
}