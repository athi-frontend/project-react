'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Button, Popover, IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos, CalendarToday } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import dayjs from 'dayjs'
import { NUMBERMAP } from '@/constants/common'
import { 
  getButtonStyles,
  getMonthButtonStyles,
} from '@/lib/utils/modules/sales/monthYearPickerUtils'
import { 
  monthYearPickerLabelStyles,
  monthYearPickerErrorStyles,
  monthYearPickerPopoverStyles,
  monthYearPickerContainerStyles,
  monthYearPickerYearNavStyles,
  monthYearPickerYearNavButtonStyles,
  monthYearPickerYearTextStyles,
  monthYearPickerIconStyles,
  monthYearPickerArrowStyles,
  monthYearPickerMonthGridStyles,
  monthYearPickerMainContainerStyles
} from '@/styles/components/ui/monthYearPicker'
import { DateTime } from 'luxon';
import { MONTH_NAMES } from '@/constants/components/ui/monthYearPicker'
/**
 * Classification : Confidential
 **/

export interface MonthYearPickerProps {
  value: DateTime | null;
  onChange: (date: DateTime | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: DateTime;
  maxDate?: DateTime;
  disabled?: boolean;
  periodType?: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  startDate?: DateTime | null;
}



const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "MM-YYYY",
  error,
  minDate,
  maxDate,
  disabled = false,
  periodType,
  startDate
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [pickerYear, setPickerYear] = useState(value?.year ?? new Date().getFullYear());
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
    if (value) {
      setPickerYear(value.year);
    } else if (startDate) {
      setPickerYear(startDate.year);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setAnchorEl(null)
  }, [])

  const handlePrevYear = () => {
    setPickerYear(prev => prev - NUMBERMAP.ONE)
  }

  const handleNextYear = () => {
    setPickerYear(prev => prev + NUMBERMAP.ONE)
  }


  const formatDisplayValue = (date: DateTime | null) => {
    if (!date) return '';
    return date.toFormat('MM-yyyy');
  }

  // Check if a month should be disabled based on period type, start date, and min/max date restrictions
  const isMonthDisabled = (month: number, year: number): boolean => {
    const currentDate = DateTime.local(year, month + NUMBERMAP.ONE, NUMBERMAP.ONE).startOf('month')
    
    // Check against minDate restriction
    if (minDate && currentDate < minDate) {
      return true
    }
    
    // Check against maxDate restriction
    if (maxDate && currentDate > maxDate) {
      return true
    }
    
    // Check against period type and start date restrictions (if applicable)
    if (periodType && startDate) {
      const startDateObj = startDate
      const currentDateDayjs = dayjs(`${year}-${month + NUMBERMAP.ONE}-01`)
      
      // Calculate the maximum allowed months based on period type
      const getMaxMonths = () => {
        switch (periodType) {
          case 'monthly':
            return NUMBERMAP.THREE
          case 'quarterly':
            return NUMBERMAP.TWELVE
          case 'half-yearly':
            return NUMBERMAP.EIGHTEEN
          case 'yearly':
            return NUMBERMAP.THIRTYONE + NUMBERMAP.FIVE
          default:
            return NUMBERMAP.ZERO
        }
      }
      
      // Check if the month is within the allowed range
      const monthsDifference = currentDateDayjs.diff(startDateObj, 'month')
      
      // Disable months before start date OR beyond the period limit
      if (monthsDifference < NUMBERMAP.ZERO || monthsDifference >= getMaxMonths()) {
        return true
      }
    }
    
    return false
  }

  // Handle month selection
  const handleMonthClick = (month: number) => {
    if (isMonthDisabled(month, pickerYear)) return;
  
    // Create a Luxon DateTime for the first day of the selected month at midnight
    const selectedDate = DateTime.local(pickerYear, month + NUMBERMAP.ONE, NUMBERMAP.ONE, NUMBERMAP.ZERO, NUMBERMAP.ZERO, NUMBERMAP.ZERO, NUMBERMAP.ZERO)
      .startOf('month'); // Ensures it's exactly the start of the month
  
    // Pass a Luxon DateTime object back (not dayjs)
    onChange(selectedDate);
    handleClose();
  };

  // Update picker year when startDate changes
  useEffect(() => {
    if (startDate && isOpen) {
      setPickerYear(startDate.year);
    }
  }, [startDate, isOpen])

  return (
    <Box sx={monthYearPickerMainContainerStyles}>
      {label && (
        <Box sx={monthYearPickerLabelStyles}>
          {label}
        </Box>
      )}
      
      <Button
        ref={buttonRef}
        variant="outlined"
        onClick={handleOpen}
        disabled={disabled}
        sx={getButtonStyles(disabled, error ?? '', !!value)}
      >
        <span>{value ? formatDisplayValue(value) : placeholder}</span>
        <CalendarToday sx={monthYearPickerIconStyles} />
      </Button>

      {error && (
        <Box sx={monthYearPickerErrorStyles}>
          {error}
        </Box>
      )}

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={monthYearPickerPopoverStyles}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={monthYearPickerContainerStyles}>
            {/* Year Navigation Header */}
            <Box sx={monthYearPickerYearNavStyles}>
              <IconButton
                onClick={handlePrevYear}
                size="small"
                sx={monthYearPickerYearNavButtonStyles}
                data-year-nav="prev"
              >
                <ArrowBackIos sx={monthYearPickerArrowStyles} />
              </IconButton>

              <Box sx={monthYearPickerYearTextStyles}>
                {pickerYear}
              </Box>

              <IconButton
                onClick={handleNextYear}
                size="small"
                sx={monthYearPickerYearNavButtonStyles}
                data-year-nav="next"
              >
                <ArrowForwardIos sx={monthYearPickerArrowStyles} />
              </IconButton>
            </Box>

            {/* Custom Month Grid */}
            <Box sx={monthYearPickerMonthGridStyles}>
              {MONTH_NAMES.map((monthName, index) => {
                const isDisabled = isMonthDisabled(index, pickerYear);
                // For isSelected: Luxon month is 1-based, so subtract 1 for zero-based index comparison
                const isSelected = value && value.year === pickerYear && value.month - NUMBERMAP.ONE === index;
                
                return (
                  <Button
                    key={`${pickerYear}-${index}`}
                    onClick={() => handleMonthClick(index)}
                    disabled={isDisabled}
                    sx={getMonthButtonStyles(isDisabled, isSelected)}
                  >
                    {monthName}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </LocalizationProvider>
      </Popover>
    </Box>
  )
}

export default MonthYearPicker
