import { NUMBERMAP } from '@/constants/common'
import { PERIOD_MAX_MONTHS } from '@/constants/components/ui/monthYearPicker'
import { 
  monthYearPickerButtonStyles,
  monthYearPickerButtonErrorStyles,
  monthYearPickerButtonPlaceholderStyles,
  monthYearPickerDisabledButtonStyles,
  monthYearPickerMonthButtonStyles,
  monthYearPickerSelectedMonthButtonStyles,
  monthYearPickerDisabledMonthButtonStyles
} from '@/styles/components/ui/monthYearPicker'
/**
    Classification : Confidential
**/
// Utility function to get button styles based on state
export const getButtonStyles = (disabled: boolean, error: string, hasValue: boolean) => {
  if (disabled) return monthYearPickerDisabledButtonStyles
  if (error) return monthYearPickerButtonErrorStyles
  if (hasValue) return monthYearPickerButtonStyles
  return monthYearPickerButtonPlaceholderStyles
}

// Utility function to get month button styles based on state
export const getMonthButtonStyles = (isDisabled: boolean, isSelected: boolean) => {
  if (isDisabled) return monthYearPickerDisabledMonthButtonStyles
  if (isSelected) return monthYearPickerSelectedMonthButtonStyles
  return monthYearPickerMonthButtonStyles
}

// Utility function to get max months for period type
export const getMaxMonthsForPeriod = (periodType: string): number => {
  const maxMonths = PERIOD_MAX_MONTHS[periodType as keyof typeof PERIOD_MAX_MONTHS];
  return maxMonths !== undefined ? maxMonths : NUMBERMAP.ZERO;
}

// Utility function to set picker year based on date
export const setPickerYearFromDate = (setPickerYear: (year: number) => void, date: any) => {
  if (date) {
    setPickerYear(date.year())
  }
}
