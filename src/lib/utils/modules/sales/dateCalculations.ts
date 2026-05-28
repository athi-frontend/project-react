/**
 * Classification: Confidential
 * Description: Utility functions for sales forecast date calculations
 */

import { NUMBERMAP } from '@/constants/common';
import { DateTime } from 'luxon';

/**
 * Get current month and year as formatted string
 * @returns Formatted date string in MM-YYYY format
 */
export const getCurrentMonthYear = (): string => {
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString());
  const currentYear = currentDate.getFullYear();
  return `${currentMonth}-${currentYear}`;
};

/**
 * Calculate next month from current date
 * @returns Formatted date string in MM-YYYY format
 */
export const getNextMonthYear = (): string => {
  const currentDate = new Date();
  const nextMonth = currentDate.getMonth() + NUMBERMAP.ONE;
  const currentYear = currentDate.getFullYear();
  
  return nextMonth > NUMBERMAP.ELEVEN 
    ? `${String(NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${currentYear + NUMBERMAP.ONE}`
    : `${String(nextMonth + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${currentYear}`;
};

/**
 * Calculate date that is N months ahead from current date
 * @param monthsAhead - Number of months to add (default: 2)
 * @returns Formatted date string in MM-YYYY format
 */
export const getMonthsAheadYear = (monthsAhead: number = NUMBERMAP.TWO): string => {
  const currentDate = new Date();

  // Create a new date object and add months (automatically handles year overflow)
  const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsAhead);

  const targetMonth = targetDate.getMonth() + NUMBERMAP.ONE; // Convert from 0-indexed to 1-indexed

  const targetYear = targetDate.getFullYear();
  
  return `${String(targetMonth).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${targetYear}`;
};

/**
 * Calculate end date based on period type
 * @param period - The period type (monthly, quarterly, half-yearly, yearly)
 * @returns Formatted end date string in MM-YYYY format
 */
export const calculateEndDate = (period: string): string => {
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString());
  const currentYear = currentDate.getFullYear();
  
  switch (period) {
    case 'yearly':
      return `${currentMonth}-${currentYear + NUMBERMAP.ONE}`;
    case 'half-yearly':
      return calculateHalfYearlyEndDate(currentDate, currentYear);
    case 'quarterly':
      return calculateQuarterlyEndDate(currentDate);
    case 'monthly':
    default:
      return calculateMonthlyEndDate(currentDate, currentYear);
  }
};

/**
 * Calculate monthly end date
 * @param currentDate - Current date object
 * @param currentYear - Current year
 * @returns Formatted end date string in MM-YYYY format
 */
export const calculateMonthlyEndDate = (currentDate: Date, currentYear: number): string => {
  const nextMonth = currentDate.getMonth() + NUMBERMAP.ONE;
  return nextMonth > NUMBERMAP.ELEVEN 
    ? `${String(NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${currentYear + NUMBERMAP.ONE}`
    : `${String(nextMonth + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${currentYear}`;
};

/**
 * Calculate quarterly end date
 * @param currentDate - Current date object
 * @returns Formatted end date string in MM-YYYY format
 */
export const calculateQuarterlyEndDate = (currentDate: Date): string => {
  const dt = DateTime.fromJSDate(currentDate);
  const endOfQuarter = dt.plus({ months: NUMBERMAP.THREE }).endOf('month');
  return endOfQuarter.toFormat('MM-yyyy');
};

/**
 * Calculate half-yearly end date
 * @param currentDate - Current date object
 * @param currentYear - Current year
 * @returns Formatted end date string in MM-YYYY format
 */
export const calculateHalfYearlyEndDate = (currentDate: Date, currentYear: number): string => {
  const halfYearMonth = currentDate.getMonth() + NUMBERMAP.SIX;
  return halfYearMonth > NUMBERMAP.ELEVEN
    ? `${String(halfYearMonth - NUMBERMAP.ELEVEN).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${currentYear + NUMBERMAP.ONE}`
    : `${String(halfYearMonth + NUMBERMAP.ONE).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}-${currentYear}`;
};
