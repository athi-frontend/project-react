import { NUMBERMAP } from '@/constants/common';

/**
    Classification : Confidential
**/
export const FILTER_DROPDOWN_CONSTANTS = {
  BUTTON_TEXT: {
    FILTER: 'Filter',
    CANCEL: 'Cancel',
    SUBMIT: 'Submit'
  },
  PERIOD_OPTIONS: {
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly',
    HALF_YEARLY: 'Half yearly',
    YEARLY: 'Yearly'
  },
  LABELS: {
    START_DATE: 'Start Date',
    END_DATE: 'End Date'
  },
  PERIOD_VALUES: {
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    HALF_YEARLY: 'half-yearly',
    YEARLY: 'yearly'
  },
  END_BEFORE_START_ERROR: 'End date cannot be before start date',
  START_DATE_REQUIRED: 'Start Date is Required',
  END_DATE_REQUIRED: 'End Date is Required',
}

export const FILTER_DROPDOWN_PERIODS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half-yearly', label: 'Half yearly' },
  { value: 'yearly', label: 'Yearly' }
]

export const DATE_PICKER_SELECTORS = [
  '.MuiPickersPopper-root',
  '.MuiPickersCalendar-root',
  '.MuiPickersDay-root',
  '.MuiPickersMonth-root',
  '.MuiPickersYear-root',
  '.MuiDialog-root',
  '[role="dialog"]',
  '.MuiPopover-root'
]

export const getPeriodErrorMessage = (
  period: string,
  monthsDifference: number,
  maxMonths: number
): string => {
  if (monthsDifference <= maxMonths) return '';

  const periodName = period.charAt(NUMBERMAP.ZERO).toUpperCase() + period.slice(NUMBERMAP.ONE);

  const periodDescriptionMap: Record<string, string> = {
    monthly: `${NUMBERMAP.THREE} months`,
    quarterly: `${NUMBERMAP.TWELVE} months`,
    'half-yearly': `${NUMBERMAP.EIGHTEEN} months`,
    yearly: `${NUMBERMAP.THIRTYSIX} months`,
  };

  const periodDescription = periodDescriptionMap[period] ?? `${maxMonths} months`;

  return `${periodName} period allows maximum ${periodDescription} range`;
};