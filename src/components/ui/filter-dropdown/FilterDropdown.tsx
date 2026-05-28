'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Filter, ArrowDown2 } from 'iconsax-react'
import { NUMBERMAP } from '@/constants/common'
import MonthYearPicker from '@/components/ui/month-year-picker/MonthYearPicker'
import { DateTime } from 'luxon';
import {
  FilterButtonStyles,
  FilterPanelStyles,
  PeriodSelectionStyles,
  ToggleButtonGroupStyles,
  DateFieldsStyles,
  DateFieldWrapperStyles,
  ActionButtonsStyles,
  CancelButtonStyles,
  SubmitButtonStyles
} from '@/styles/components/ui/filterDropdown'
import { FILTER_DROPDOWN_CONSTANTS, FILTER_DROPDOWN_PERIODS, DATE_PICKER_SELECTORS, getPeriodErrorMessage } from '@/constants/components/ui/filterDropdown'
import { FilterData, FilterDropdownProps, PeriodDataStructure } from '@/types/components/ui/filterDropdown'

/**
 * Classification: Confidential
 * Description: Filter dropdown component with period selection and date range filtering
 */

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onFilter,
  onCancel,
  initialData,
  periodData,
  onPeriodChange,
  hideButton = false,
  hidePeriodSelection = false,
  restrictionStartDate,
  maxMonths
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const prevIsOpenRef = useRef(false)
  const [filterData, setFilterData] = useState<FilterData>({
    period: 'monthly',
    startDate: null,
    endDate: null,
    restrictionStartDate: restrictionStartDate,
    ...initialData
  })
  const [dateError, setDateError] = useState<string | null>(null)
  const [startDateError, setStartDateError] = useState<string | null>(null)
  const [endDateError, setEndDateError] = useState<string | null>(null)

  // Calculate min and max dates based on restrictionStartDate from filterData
  // Shows 12 months starting from restrictionStartDate (e.g., 07-2026 to 06-2027)
  const getRestrictionDates = (): { minDate: DateTime | undefined; maxDate: DateTime | undefined } => {
    if (!filterData.restrictionStartDate) {
      return { minDate: undefined, maxDate: undefined }
    }

    try {
      // Parse the restrictionStartDate (format: "MM-yyyy")
      const [month, year] = filterData.restrictionStartDate.split('-').map(Number)
      const restrictionDate = DateTime.local(year, month, NUMBERMAP.ONE).startOf('month')
      // Calculate 12 months forward from restrictionStartDate (including the start month)
      // minDate = restrictionStartDate, maxDate = restrictionStartDate + 11 months
      const minDate = restrictionDate
      const maxDate = restrictionDate.plus({ months: 11 })
      
      return { minDate, maxDate }
    } catch (error) {
      console.error('Error parsing restrictionStartDate:', error)
      return { minDate: undefined, maxDate: undefined }
    }
  }
  
  const { minDate: restrictionMinDate, maxDate: restrictionMaxDate } = getRestrictionDates()

  // Calculate effective min/max dates for start date picker

  // Calculate effective min/max dates for end date picker
  const getEndDateMinDate = (): DateTime | undefined => {
    if (restrictionMinDate) {
      if (filterData.startDate && filterData.startDate instanceof DateTime) {
        return filterData.startDate > restrictionMinDate ? filterData.startDate : restrictionMinDate
      }
      return restrictionMinDate
    }
    return (filterData.startDate instanceof DateTime) ? filterData.startDate : undefined
  }

  const getEndDateMaxDate = (): DateTime | undefined => {
    const startDate = filterData.startDate instanceof DateTime ? filterData.startDate : null
    if (!startDate) {
      return restrictionMaxDate 
    }
    const maxMonthsForCalculation = maxMonths ?? getMaxMonthsForPeriod(filterData.period)
    const periodMaxDate = startDate.plus({
      months: maxMonthsForCalculation - NUMBERMAP.ONE
    })
    return periodMaxDate
  }

  const handlePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: string | null) => {
    if (newPeriod) {
      const period = newPeriod as FilterData['period']
      setFilterData(prev => {
        const newData = { ...prev, period }
        
        // Clear required field errors when period changes
        setStartDateError(null)
        setEndDateError(null)
        
        // Validate existing dates with new period
        const error = validateDateRange(newData.startDate, newData.endDate, period)
        setDateError(error)
        
        return newData
      })
      
      // Call the period change callback with the selected period and its data
      if (onPeriodChange && periodData) {
        const periodSpecificData = periodData[period]
        if (periodSpecificData) {
          onPeriodChange(period, periodSpecificData as PeriodDataStructure)
        }
      }
    }
  }

  // Get maximum allowed months for the selected period
  const getMaxMonthsForPeriod = (period: FilterData['period']): number => {
    switch (period) {
      case 'monthly':
        return NUMBERMAP.THREE
      case 'quarterly':
        return NUMBERMAP.TWELVE
      case 'half-yearly':
        return NUMBERMAP.EIGHTEEN
      case 'yearly':
        return NUMBERMAP.THIRTYONE + NUMBERMAP.FIVE
      default:
        return NUMBERMAP.THREE
    }
  }

  // Validate date range based on selected period
  const validateDateRange = (startDate: DateTime | null, endDate: DateTime | null, period: FilterData['period']): string => {
    if (!startDate || !endDate) return '';
    if (endDate < startDate) {
      return FILTER_DROPDOWN_CONSTANTS.END_BEFORE_START_ERROR;
    }
    if (hidePeriodSelection) return '';
    const maxMonths = getMaxMonthsForPeriod(period);
    const monthsDifference = endDate.diff(startDate, 'months').months;
    return getPeriodErrorMessage(period, monthsDifference, maxMonths);
  }

  const handleStartDateChange = (date: DateTime | null) => {
    setFilterData(prev => {
      // Update restrictionStartDate when start date changes (format: "MM-yyyy")
      const newRestrictionStartDate = date ? date.toFormat('MM-yyyy') : undefined
      
      const newData = { 
        ...prev, 
        startDate: date,
        restrictionStartDate: newRestrictionStartDate
      }
      
      // Clear start date error when date is selected
      if (date) {
        setStartDateError(null)
      }
      
      // Validate with existing end date
      const error = validateDateRange(date, prev.endDate, prev.period)
      setDateError(error)
      
      return newData
    })
  }

  const handleEndDateChange = (date: DateTime | null) => {
    setFilterData(prev => {
      const newData = { ...prev, endDate: date }
      
        // Clear end date error when date is selected
        if (date) {
          setEndDateError(null)
        }
      
      // Validate with existing start date
      const error = validateDateRange(prev.startDate, date, prev.period)
      setDateError(error)
      
      return newData
    })
  }

  const handleSubmit = () => {
    // Validate required fields for all periods
      let hasError = false
      
      if (!filterData.startDate) {
        setStartDateError(FILTER_DROPDOWN_CONSTANTS.START_DATE_REQUIRED)
        hasError = true
      } else {
        setStartDateError(null)
      }
      
      if (!filterData.endDate) {
        setEndDateError(FILTER_DROPDOWN_CONSTANTS.END_DATE_REQUIRED)
        hasError = true
      } else {
        setEndDateError(null)
      }
      
      if (hasError) {
        return
      }
    
    
    // Check for date validation before submitting
    const error = validateDateRange(filterData.startDate, filterData.endDate, filterData.period)
    if (error) {
      setDateError(error)
      return
    }
    setDateError(null)
    
    if (onFilter) {
      const formatToMonthYear = (value: string | null) => {
        if (!value) return null;
        else{
          return value.toFormat('MM-yyyy');
        }
      };

      const normalizedData: FilterData = {
        ...filterData,
        startDate: formatToMonthYear(filterData.startDate),
        endDate: formatToMonthYear(filterData.endDate),
      };

      onFilter(normalizedData)
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    // Clear dates and reset to initial state
    setFilterData({
      period: 'monthly',
      startDate: null,
      endDate: null,
      restrictionStartDate: restrictionStartDate,
      ...initialData
    })
    setDateError(null)
    setStartDateError(null)
    setEndDateError(null)
    
    if (onCancel) {
      onCancel()
    }
    setIsOpen(false)
  }

  // Reset date fields when dropdown transitions from closed to open
  useEffect(() => {
    // Only reset when transitioning from closed (false) to open (true)
    if (isOpen && !prevIsOpenRef.current) {
      // Reset date fields to initialData values or null when opening the dropdown
      setFilterData(prev => ({
        ...prev,
        startDate: initialData?.startDate ?? null,
        endDate: initialData?.endDate ?? null
      }))
      setDateError(null)
      setStartDateError(null)
      setEndDateError(null)
    }
    // Update the ref to track current state for next render
    prevIsOpenRef.current = isOpen
  }, [isOpen, initialData?.startDate, initialData?.endDate])

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Check if click is outside the dropdown
      if (!dropdownRef.current?.contains(target)) {
        // Check if the click is on a date picker element
        const isDatePickerElement = DATE_PICKER_SELECTORS.some(selector => 
          target.closest(selector)
        )
        
        // Only close if it's not a date picker element
        if (!isDatePickerElement) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <Box ref={dropdownRef} sx={{ position: 'relative' }}>
      {/* Filter Button */}
      {!hideButton && (
        <Button
          variant="outlined"
          onClick={() => setIsOpen(!isOpen)}
          sx={FilterButtonStyles}
        >
          <Filter size={NUMBERMAP.TWENTY} color="currentColor" />
          {FILTER_DROPDOWN_CONSTANTS.BUTTON_TEXT.FILTER}
          <ArrowDown2 size={NUMBERMAP.SIXTEEN} color="currentColor" />
        </Button>
      )}

      {/* Filter Panel */}
      {(isOpen || hideButton) && (
        <Box sx={{
          ...FilterPanelStyles,
          ...(hideButton ? { 
            position: 'relative', 
            top: 0, 
            right: 0, 
            marginTop: 0,
            width: '320px',
            maxWidth: '320px',
            padding: '16px'
          } : {})
        }}>
          {/* Period Selection */}
          {!hidePeriodSelection && (
            <Box sx={PeriodSelectionStyles}>
              <ToggleButtonGroup
                value={filterData.period}
                exclusive
                orientation="horizontal"
                size="small"
                onChange={handlePeriodChange}
                sx={ToggleButtonGroupStyles}
              >
                {FILTER_DROPDOWN_PERIODS.map((period: { value: string; label: string }) => (
                  <ToggleButton key={period.value} value={period.value}>
                    {period.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Date Fields */}
          <Box sx={DateFieldsStyles}>
            <Box sx={DateFieldWrapperStyles}>
              <MonthYearPicker
                label={FILTER_DROPDOWN_CONSTANTS.LABELS.START_DATE}
                value={filterData.startDate}
                onChange={handleStartDateChange}
                placeholder="MM-YYYY"
                error={startDateError ?? undefined}
                maxDate={ undefined}
              />
            </Box>
            <Box>
              <MonthYearPicker
                label={FILTER_DROPDOWN_CONSTANTS.LABELS.END_DATE}
                value={filterData.endDate}
                onChange={handleEndDateChange}
                placeholder="MM-YYYY"
                error={(endDateError ?? dateError) ?? undefined}
                minDate={getEndDateMinDate()}
                maxDate={getEndDateMaxDate()}
                disabled={!filterData.startDate}
                periodType={!hidePeriodSelection ? filterData.period : undefined}
                startDate={filterData.startDate}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={ActionButtonsStyles}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={CancelButtonStyles}
            >
              {FILTER_DROPDOWN_CONSTANTS.BUTTON_TEXT.CANCEL}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={SubmitButtonStyles}
            >
              {FILTER_DROPDOWN_CONSTANTS.BUTTON_TEXT.SUBMIT}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default FilterDropdown
