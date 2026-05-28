import { DataGrid } from '@mui/x-data-grid'
import { Box, styled, SxProps, alpha } from '@mui/material'
import { Theme } from '@emotion/react';
/**
  Classification : Confidential
**/
export const DATA_GRID_STYLES = {
  EDITING_CELL_BG: "rgb(255,215,115, 0.19)",
  EDITING_CELL_COLOR: "#1a3e72",
  ERROR_CELL_BG_LIGHT: "rgb(126,10,15, 0.1)",
  ERROR_CELL_BG_DARK: "rgb(126,10,15, 0)",
  ERROR_CELL_COLOR_LIGHT: "#750f0f",
  ERROR_CELL_COLOR_DARK: "#ff4343",
  CELL_STYLES: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '7px',
    paddingBottom: '7px',
  },
};
const TableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: '0 40px 10px 40px',
  width: '100%',
}))

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  borderRadius: '10px',
  '& .MuiDataGrid-columnHeader,.MuiDataGrid-filler': {
    backgroundColor: theme.palette.text.main,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-row.inactive': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-row.qc-team-groupexpanded': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
  '& .MuiDataGrid-row.member-row': {
    backgroundColor: theme.palette.background.paper,
    '& .MuiDataGrid-cell': {
      paddingLeft: '80px',
    },
  },
  '& .MuiSvgIcon-root':{
      color:theme.palette.text.primary
    }
}))

export { StyledDataGrid, TableContainer }

export const HEADER_ICON_STYLES = {
  width: "15px",
  height: "15px",
  strokeWidth: "1.875px",
};

export const EDIT_DELETE_CELL_STYLES = {
  inline: "block",
};

export const TEXT_FIELD_STYLES = {
  padding: "4px 0px",
};


// Base styles
const columnHeaderSortIconContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: 3,
};

// Style function for icon
const getColumnHeaderSortIconStyle = (
  direction: 'asc' | 'desc',
  isActive: boolean
) => {
  let color = 'gray';

  if (isActive) {
    color = (direction === 'asc' || direction === 'desc') ? 'primary.main' : 'primary.secondary';
  }

  return {
    fontSize: 18,
    color,
  };
};

const   dataGrid = {
    width: '100%',
    '& .MuiDataGrid-columnHeaderTitle': { 
      fontWeight: 'bold',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      lineHeight: '1.4',
      overflow: 'visible',
      fontSize: '14px',
    },
    '& .MuiDataGrid-columnHeader': {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      overflow: 'visible',
      height: 'auto !important',
      minHeight: 'auto !important',
      paddingTop: '10px',
      paddingBottom: '10px',
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        overflow: 'visible',
        height: 'auto',
      },
    },
    '& .MuiDataGrid-columnHeaders': {
      height: 'auto !important',
      minHeight: 'auto !important',
    },
    '& .MuiDataGrid-columnSeparator': { display: 'none' },
    '& .MuiDataGrid-cell': { 
      display: 'flex',
      minWidth: 0,
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      overflow: 'visible',
      paddingTop: '10px',
      paddingBottom: '10px',
      alignItems: 'center',
      fontSize: '14px',
      '& > div': {
        width: '100%',
        minWidth: 0,
      },
    },
  }
// Exporting styles
export const InlineStyles = {
  columnHeaderSortIconContainer: columnHeaderSortIconContainerStyle,
  columnHeaderSortIcon: getColumnHeaderSortIconStyle,
  dataGrid:dataGrid
};

export const downloadStyles: { title: SxProps<Theme>; icon: SxProps<Theme> } = {
  title: {
    textDecoration: 'underline', 
      cursor: 'pointer', 
  },
  icon: {
    color: 'blue',
  },
}

export const TableFilters = {
  statusColumn: 'status',
  activeStatus: 'active',
  inactiveStatus: 'inactive',
  filterModeServer: 'server',
  filterModeClient: 'client',
}

export const COLUMN_HEADER_TITLE_STYLES = {
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  lineHeight: '1.4',
  overflow: 'visible',
  fontSize: '16px',
  fontWeight: '500',
}

export const COLUMN_HEADER_STYLES = {
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflow: 'visible',
  height: 'auto !important',
  minHeight: 'auto !important',
  paddingTop: '10px',
  paddingBottom: '10px',
  '& .MuiDataGrid-columnHeaderTitleContainer': {
    overflow: 'visible',
    height: 'auto',
  },
}

export const COLUMN_HEADERS_STYLES = {
  height: 'auto !important',
  minHeight: 'auto !important',
}

export const DATA_GRID_CELL_STYLES = {
  fontSize: '16px',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  textOverflow: 'clip',
  '& > *': {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
}


