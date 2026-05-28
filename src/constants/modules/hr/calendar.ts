export const CALENDAR_QUERY_KEY = {
  LIST: "calendar_training_schedule",
  MONTH_YEAR: "calendar_month_year",
}

export const API_ENDPOINTS = {
  FETCH_ALL: 'api/v1/hrcs/training-schedule/all',
}

// Calendar day headers
export const DAY_HEADERS = [
  "Sunday", 
  "Monday", 
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday"
] as const;


// Calendar messages
export const CALENDAR_MESSAGES = {
  LOADING: "Loading calendar data...",
  ERROR: "Error loading calendar data. Please try again.",
} as const;

// Calendar routes
export const CALENDAR_ROUTES = {
  TRAINING_SCHEDULE_EDIT: '/hr/training-schedule/',
} as const;

// Calendar date formatting
export const CALENDAR_DATE_FORMATS = {
  MONTH_YEAR: 'MMMM yyyy',
  MONTH_TWO_DIGIT: 'MM',
  YEAR_FOUR_DIGIT: 'yyyy',
} as const;

// Calendar popover positioning
export const CALENDAR_POPOVER = {
  ANCHOR_ORIGIN: {
    vertical: 'bottom' as const,
    horizontal: 'center' as const,
  },
  TRANSFORM_ORIGIN: {
    vertical: 'top' as const,
    horizontal: 'center' as const,
  },
  SMALL: 'small',
} as const;

// Calendar API response structures
export const API_RESPONSE_STRUCTURES = {
  DIRECT_ARRAY: 'direct_array',
  DATA_ARRAY: 'data_array',
  RESPONSE_ARRAY: 'response_array',
  NESTED_DATA_RESPONSE: 'nested_data_response',
  NESTED_DATA_DATA: 'nested_data_data',
  DOUBLE_NESTED_DATA: 'double_nested_data',
} as const; 


