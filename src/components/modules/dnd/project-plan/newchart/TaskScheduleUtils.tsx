'use client'

import { NUMBERMAP } from "@/constants/common"

/**
    Classification : Confidential
**/
// Define the types for activities and months
export interface Activity {
  activity_id: number
  activity: string
  activity_start_date: string | null
  activity_end_date: string | null
}

export interface Month {
  year: number
  month: number
  name: string
}

// Constants for layout calculations
const MONTH_WIDTH = NUMBERMAP.SIXHUNDRED// Width of each month column in pixels 

// Helper function to get valid activities
const getValidActivities = (activities: Activity[]) =>
  activities.filter((act) => act.activity_start_date && act.activity_end_date)

const parseDateSafely = (dateString: string): Date => {
  // Handle different date formats
  if (!dateString || typeof dateString !== 'string') {
    return new Date() // Return current date as fallback
  }

  // Try parsing as ISO string first
  if (dateString.includes('T') || dateString.includes('Z')) {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // Parse YYYY-MM-DD format
  const parts = dateString.split('-')
  if (parts.length === 3) {
    const year = parseInt(parts[0], NUMBERMAP.TEN)
    const month = parseInt(parts[NUMBERMAP.ONE], NUMBERMAP.TEN) - NUMBERMAP.ONE // Month is 0-indexed
    const day = parseInt(parts[NUMBERMAP.TWO], NUMBERMAP.TEN)
    
 if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
    year >= NUMBERMAP.ONETHOUSANDNINEHUNDRED && year <= NUMBERMAP.TWOTHOUSANDONEHUNDRED && 
    month >= NUMBERMAP.ZERO && month <= NUMBERMAP.ELEVEN && 
    day >= NUMBERMAP.ONE && day <= NUMBERMAP.THIRTYONE) {
  const result = new Date(year, month, day)
  return result
}
  }

  // Fallback to standard Date parsing
  const fallbackDate = new Date(dateString)
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate
  }
  return new Date() // Return current date as fallback
}

// Helper function to get the earliest and latest dates
const getEarliestAndLatestDates = (activities: Activity[]) => {
  const validActivities = getValidActivities(activities)

  if (validActivities.length === 0) {
    const now = new Date()
    return {
      earliest: now,
      latest: new Date(now.getFullYear(), now.getMonth() + NUMBERMAP.THREE, NUMBERMAP.ZERO), // Changed to +3 to show 3 months
    }
  }

  const startDates = validActivities.map((act) => parseDateSafely(act.activity_start_date ?? ''))
  const endDates = validActivities.map((act) => parseDateSafely(act.activity_end_date ?? ''))

  // Filter out invalid dates
  const validStartDates = startDates.filter(date => !isNaN(date.getTime()))
  const validEndDates = endDates.filter(date => !isNaN(date.getTime()))

  if (validStartDates.length === 0 || validEndDates.length === 0) {
    const now = new Date()
    return {
      earliest: now,
      latest: new Date(now.getFullYear(), now.getMonth() + NUMBERMAP.THREE, NUMBERMAP.ZERO), // Changed to +3 to show 3 months
    }
  }

  const earliest = new Date(Math.min(...validStartDates.map((date) => date.getTime())))
  const latest = new Date(Math.max(...validEndDates.map((date) => date.getTime())))

  return { earliest, latest }
}

// Get the earliest and latest dates from activities
export const getDateRange = (activities: Activity[]) => getEarliestAndLatestDates(activities)

// Get months to display based on activities
export const getMonthsForDisplay = (activities: Activity[]): Month[] => {
  const { earliest, latest } = getEarliestAndLatestDates(activities)

  let endMonth = latest.getMonth()
  let endYear = latest.getFullYear()
  const startMonth = earliest.getMonth()
  const startYear = earliest.getFullYear()

  const monthDiff = (endYear - startYear) * NUMBERMAP.TWELVE + (endMonth - startMonth)
  
  if (monthDiff < NUMBERMAP.TWO) {
    endMonth = startMonth + NUMBERMAP.TWO
    if (endMonth > NUMBERMAP.ELEVEN) {
      endMonth = 0
      endYear = startYear + NUMBERMAP.ONE
    }
  }

  const months: Month[] = []
  let currentYear = startYear
  let currentMonth = startMonth

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    months.push({
      year: currentYear,
      month: currentMonth,
      name: new Date(currentYear, currentMonth, 1).toLocaleString('default', {
        month: 'long',
      }),
    })

    currentMonth++
    if (currentMonth > NUMBERMAP.ELEVEN) {
      currentMonth = 0
      currentYear++
    }
  }

  return months
}

// Get the actual number of weeks in a month
export const getWeeksInMonth = (year: number, month: number): number[] => {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const daysInFirstWeek = 7 - firstDay
  const remainingDays = lastDate - daysInFirstWeek
  const fullWeeks = Math.ceil(remainingDays / 7)

  return Array.from({ length: 1 + fullWeeks }, (_, i) => i + 1)
}

// Helper function to calculate position within a month
const calculateDayPosition = (day: number, daysInMonth: number) =>
  ((day - 1) / daysInMonth) * MONTH_WIDTH

// Calculate the position of the bar based on the earliest start date of activities
export const calculateBarPosition = (activities: Activity[], months: Month[]): string => {
  if (!activities.length || !months.length) return '0px'

  const validActivities = getValidActivities(activities)
  if (!validActivities.length) return '0px'

  const earliestDate = new Date(
    Math.min(...validActivities.map((act) => parseDateSafely(act.activity_start_date ?? '').getTime()))
  )

  const monthIndex = months.findIndex(
    (m) => m.year === earliestDate.getFullYear() && m.month === earliestDate.getMonth()
  )
  if (monthIndex === -1) return '0px'

  const daysInMonth = new Date(earliestDate.getFullYear(), earliestDate.getMonth() + 1, 0).getDate()
  const dayPosition = calculateDayPosition(earliestDate.getDate(), daysInMonth)

  return `${monthIndex * MONTH_WIDTH + dayPosition}px`
}

// Calculate the width of a bar (stage or activity)
const calculateBarWidthHelper = (
  startDate: Date,
  endDate: Date,
  startMonthIndex: number,
  endMonthIndex: number,
  months: Month[]
): string => {
  const startDaysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()
  const startDayPosition = calculateDayPosition(startDate.getDate(), startDaysInMonth)

  const endDaysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()
  const endDayPosition = calculateDayPosition(endDate.getDate(), endDaysInMonth)

  let result: string

  if (startMonthIndex === endMonthIndex) {
    const width = Math.max(NUMBERMAP.FIFTY, endDayPosition - startDayPosition)
    result = `${width}px`
  } else {
    const startMonthRemainder = MONTH_WIDTH - startDayPosition
    const fullMonthsWidth = (endMonthIndex - startMonthIndex - 1) * MONTH_WIDTH
    const totalWidth = startMonthRemainder + fullMonthsWidth + endDayPosition
    result = `${Math.max(100, totalWidth)}px`
  }

  return result
}

// Calculate the width of a stage bar
export const calculateStageBarWidth = (activities: Activity[], months: Month[]): string => {
  if (!activities.length || !months.length) return '0px'

  const validActivities = getValidActivities(activities)
  if (!validActivities.length) return '0px'

  const earliestDate = new Date(
    Math.min(...validActivities.map((act) => parseDateSafely(act.activity_start_date ?? '').getTime()))
  )
  const latestDate = new Date(
    Math.max(...validActivities.map((act) => parseDateSafely(act.activity_end_date ?? '').getTime()))
  )

  const startMonthIndex = months.findIndex(
    (m) => m.year === earliestDate.getFullYear() && m.month === earliestDate.getMonth()
  )
  const endMonthIndex = months.findIndex(
    (m) => m.year === latestDate.getFullYear() && m.month === latestDate.getMonth()
  )

  if (startMonthIndex === -1 || endMonthIndex === -1) return '100px'

  return calculateBarWidthHelper(earliestDate, latestDate, startMonthIndex, endMonthIndex, months)
}

// Calculate the position for an activity bar
export const calculateActivityBarPosition = (activity: Activity, months: Month[]): string => {
  if (!activity.activity_start_date || !months.length) return '0px'

  const startDate = parseDateSafely(activity.activity_start_date)
  if (!startDate || isNaN(startDate.getTime())) return '0px';

  const monthIndex = months.findIndex(
    (m) => m.year === startDate.getFullYear() && m.month === startDate.getMonth()
  )
  if (monthIndex === -1) return '0px'

  const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()
  const dayPosition = calculateDayPosition(startDate.getDate(), daysInMonth)

  return `${monthIndex * MONTH_WIDTH + dayPosition}px`
}

// Calculate the width of an activity bar
export const calculateBarWidth = (activity: Activity, months: Month[]): string => {
  if (!activity.activity_start_date || !activity.activity_end_date || !months.length) return '0px'

  const startDate = parseDateSafely(activity.activity_start_date)
  const endDate = parseDateSafely(activity.activity_end_date)

  if (!startDate || isNaN(startDate.getTime()) || !endDate || isNaN(endDate.getTime())) return '0px';

  const startMonthIndex = months.findIndex(
    (m) => m.year === startDate.getFullYear() && m.month === startDate.getMonth()
  )
  const endMonthIndex = months.findIndex(
    (m) => m.year === endDate.getFullYear() && m.month === endDate.getMonth()
  )

  if (startMonthIndex === -1 || endMonthIndex === -1) return '0px'

  return calculateBarWidthHelper(startDate, endDate, startMonthIndex, endMonthIndex, months)
}

// Get the week number for a specific date within its month (1-based)
export const getWeekOfMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  return Math.ceil((date.getDate() + firstDayOfMonth) / 7)
}

// Check if a specific week should be filled based on activity dates
export const shouldFillWeek = (
  year: number,
  month: number,
  week: number,
  activities: Activity[]
): boolean => {
  if (!activities.length) return false

  const validActivities = getValidActivities(activities)
  if (!validActivities.length) return false

  // Get the start and end dates of the week
  const firstDayOfMonth = new Date(year, month, NUMBERMAP.ONE).getDay()
  const daysInFirstWeek = NUMBERMAP.SEVEN - firstDayOfMonth
  const remainingDays = new Date(year, month + NUMBERMAP.ONE, NUMBERMAP.ZERO).getDate() - daysInFirstWeek
  const totalWeeks = Math.ceil(remainingDays / NUMBERMAP.SEVEN) + NUMBERMAP.ONE

  if (week > totalWeeks) return false

  let weekStartDay: number
  let weekEndDay: number

  if (week === NUMBERMAP.ONE) {
    weekStartDay = NUMBERMAP.ONE
    weekEndDay = daysInFirstWeek
  } else {
    weekStartDay = daysInFirstWeek + (week - NUMBERMAP.TWO) * NUMBERMAP.SEVEN + NUMBERMAP.ONE
    weekEndDay = Math.min(weekStartDay + NUMBERMAP.SIX, new Date(year, month + NUMBERMAP.ONE, NUMBERMAP.ZERO).getDate())
  }

  const weekStartDate = new Date(year, month, weekStartDay)
  const weekEndDate = new Date(year, month, weekEndDay)

  // Check if any activity overlaps with this week
  return validActivities.some(activity => {
    const activityStart = parseDateSafely(activity.activity_start_date ?? '')
    const activityEnd = parseDateSafely(activity.activity_end_date ?? '')

    if (isNaN(activityStart.getTime()) || isNaN(activityEnd.getTime())) return false

    // Check if activity overlaps with the week
    return activityStart <= weekEndDate && activityEnd >= weekStartDate
  })
}

// Check if a specific day should be filled based on activity dates
export const shouldFillDay = (
  year: number,
  month: number,
  day: number,
  activities: Activity[]
): boolean => {
  if (!activities.length) return false

  const validActivities = getValidActivities(activities)
  if (!validActivities.length) return false

  const currentDate = new Date(year, month, day)

  return validActivities.some(activity => {
    const activityStart = parseDateSafely(activity.activity_start_date ?? '')
    const activityEnd = parseDateSafely(activity.activity_end_date ?? '')

    if (Number.isNaN(activityStart.getTime()) || Number.isNaN(activityEnd.getTime())) return false

    return activityStart <= currentDate && activityEnd >= currentDate
  })
}