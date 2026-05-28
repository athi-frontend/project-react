import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton, SxProps, Theme } from "@mui/material";

export const CalendarContainer = styled(Box)({
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  width: "100%",
  maxWidth: "100%",
});

export const CalendarWrapper = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  minHeight: "880px",
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const CalendarHeader = styled(Box)({
  display: "flex",
  minHeight: "104px",
  width: "100%",
  alignItems: "center",
  justifyContent: "start",
  padding: "24px 40px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
    padding: "0 20px",
  },
});

export const NavigationContainer = styled(Box)({
  alignSelf: "stretch",
  display: "flex",
  minWidth: "240px",
  alignItems: "center",
  gap: "21px",
  justifyContent: "start",
  margin: "auto 0",
});

export const NavigationButtons = styled(Box)({
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  justifyContent: "start",
  margin: "auto 0",
});

export const NavButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "50px",
  backgroundColor: theme.palette.text.main,
  width: "32px",
  height: "32px",
  padding: "0 10px",
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export const MonthYearContainer = styled(Box)({
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  justifyContent: "center",
  margin: "auto 0",
  padding: "10px 19px",
  font: "600 24px Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(245, 245, 245, 0.5)",
  },
});

export const MonthYearText = styled(Typography)({
  alignSelf: "stretch",
  width: "160px",
  margin: "auto 0",
  fontSize: "18px",
  fontWeight: 600,
  fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
});

export const CalendarContent = styled(Box)({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "stretch",
  fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  justifyContent: "center",
  padding: "0 40px",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
    padding: "0 20px",
  },
});

export const CalendarGrid = styled(Box)({
  borderRadius: "10px",
  border: "1px solid var(--Default-stroke, #D8D8D8)",
  width: "100%",
  overflow: "hidden",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
});

export const ScrollableCalendarContainer = styled(Box)({
  width: "100%",
  overflow: "hidden",
});

export const CalendarFullContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const DayHeaderRow = styled(Box)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "10px 10px 0 0",
  border: "1px solid var(--Default-stroke, #D8D8D8)",
  backgroundColor: theme.palette.text.main,
  display: "flex",
  minHeight: "80px",
  width: "100%",
  fontSize: "18px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  padding: "0 10px",
}));

export const DayHeader = styled(Box)({
  borderColor: "rgba(199, 199, 199, 1)",
  borderLeft: "1px solid rgba(199, 199, 199, 1)",
  alignSelf: "stretch",
  display: "flex",
  minHeight: "80px",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  margin: "auto 0",
  fontSize: "18px",
  "&:first-child": {
    borderLeft: "0px",
  },
});

export const CalendarRow = styled(Box)({
  backgroundColor: "rgba(250, 250, 250, 1)",
  display: "flex",
  width: "100%",
  alignItems: "start",
  justifyContent: "start",
  padding: "10px 10px 0",
});

export const CalendarCell = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "116px",
  flexDirection: "column",
  alignItems: "center",
  fontSize: "24px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  justifyContent: "center",
  flex: "1",
  backgroundColor: theme.palette.background.paper,
  cursor: "pointer",
  "&:first-child": {
    borderTop: "1px solid rgba(199, 199, 199, 1)",
    borderBottom: "1px solid rgba(199, 199, 199, 1)",
    borderLeft: "1px solid rgba(199, 199, 199, 1)",
  },
  "&:nth-child(2)": {
    borderLeft: "1px solid rgba(199, 199, 199, 1)",

  },
  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },
}));

export const HighlightedCell = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderColor: theme.palette.primary.main,
  borderLeftWidth: "7px",
  minHeight: "116px",
  flex: "1",
  cursor: "pointer",
  borderRight: "1px solid rgba(199, 199, 199, 1)",
  color: "#333333",
  borderLeft: "4px solid",
  borderLeftColor: theme.palette.primary.main,
  "&:last-child": {
    borderRight: "none",
  },
}));

export const HighlightedCellContent = styled(Box)({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  flex: "1",
  height: "100%",
  padding: "0px 4px 0px 0",
});

export const DateNumber = styled(Box)({
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "22px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  justifyContent: "center",
  margin: "auto 0",
  padding: "0 5px 0 5px",
  minHeight: "116px",
});

export const ActivityContainer = styled(Box)({
  borderRadius: "7px",
  backgroundColor: "rgba(234, 209, 255, 1)",
  alignSelf: "stretch",
  display: "flex",
  minHeight: "88px",
  flexDirection: "column",
  overflow: "auto",
  alignItems: "stretch",
  fontSize: "18px",
  fontWeight: "400",
  justifyContent: "center",
  flex: "1",
  margin: "auto 0",
  padding: "6px 0",
  scrollbarWidth: "none",
});

export const ActivityList = styled(Box)({
  height: "76px",
  width: "100%",
});

export const ActivityItem = styled(Box)({
  display: "flex",
  maxWidth: "100%",
  alignItems: "center",
  gap: "7px",
  justifyContent: "left",
  padding: "0 6px",
  cursor: "pointer",
  borderRadius: "4px",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});


export const ActivityText = styled(Typography)({
  alignSelf: "stretch",
  margin: "auto 0",
  fontSize: "14px",
  fontWeight: 400,
  wordBreak: "break-word",  
});

// Navigation Icon Containers
export const NavIconContainer = styled(Box)({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
});

// Month Picker Styles - Use as sx prop object instead of styled component
export const monthPickerPopoverStyles = {
  '& .MuiPopover-paper': {
    borderRadius: '10px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--Default-stroke, #D8D8D8)',
    marginTop: '8px',
  },
};

export const MonthPickerContainer = styled(Box)({
  padding: '16px',
  minWidth: '320px',
});

export const YearNavigationContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
  paddingLeft: '8px',
  paddingRight: '8px',
});

export const YearNavButton = styled(IconButton)({
  backgroundColor: 'rgba(234, 214, 250, 1)',
  width: '32px',
  height: '32px',
  '&:hover': {
    backgroundColor: 'rgba(220, 175, 255, 1)',
  },
});

export const YearText = styled(Typography)({
  fontSize: '18px',
  fontWeight: 600,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  minWidth: '80px',
  textAlign: 'center',
});

// Month Calendar Styles - Use as sx prop object instead of styled component
export const monthCalendarStyles = {
  '& .MuiPickersMonth-monthButton': {
    fontSize: '16px',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    borderRadius: '8px',
    margin: '4px',
    minHeight: '40px',
    '&:hover': {
      backgroundColor: 'rgba(234, 214, 250, 1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(220, 175, 255, 1)',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: 'rgba(220, 175, 255, 1)',
      },
    },
  },
  '& .MuiMonthCalendar-root': {
    width: '100%',
    height: 'auto',
  },
};

// Calendar Cell Styles - Use as sx prop objects
export const dateTypographyStyles = {
  fontSize: "20px",
  fontWeight: 500,
  padding: "10px 0",
};

export const dateTypographyHighlightedStyles = {
  alignSelf: "stretch",
  margin: "auto 0",
};

export const highlightedCellBorderStyles = {
  border: "1px solid rgba(234, 214, 250, 1)",
};

export const opacityStyles = {
  opacity: 0.3,
};

// Dropdown Icon
export const DropdownIcon = styled(Box)({
  aspectRatio: "1",
  objectFit: "contain",
  objectPosition: "center",
  width: "24px",
  alignSelf: "stretch",
  flexShrink: "0",
  margin: "auto 0",
});

// Year Navigation Icon Styles - Use as sx prop object
export const yearNavIconStyles = {
  fontSize: '16px',
};

// Navigation arrow icon styles
export const navArrowIconStyles: SxProps<Theme> = (theme) => ({
  fontSize: "12px",
  color: theme.palette.primary.main,
});

// Calendar icon styles
export const calendarIconStyles = {
  fontSize: "18px",
};

// Access time icon styles
export const accessTimeIconStyles: SxProps<Theme> = (theme) => ({
  fontSize: "16px",
  color: theme.palette.primary.main,
  alignSelf: "stretch",
  flexShrink: "0",
  margin: "auto 0",
});

// Loading text styles
export const loadingTextStyles = {
  textAlign: 'center',
  padding: '40px',
};

// Error text styles
export const errorTextStyles = {
  textAlign: 'center',
  padding: '40px',
  color: 'error.main',
};

// Activity text hover styles
export const activityTextHoverStyles: SxProps<Theme> = (theme) => ({
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  }
});

// Calendar display constants
export const CALENDAR_DISPLAY = {
  DATE_PADDING_CHAR: '0',
} as const;
