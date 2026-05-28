/**
 * Classification: Confidential
 */
import { ThemeTypes } from '@/types/common'

export const hasValidValues = (theme: ThemeTypes): boolean => {
  return Object.values(theme).some((value) => value && value.trim() !== '')
}

export const getCssVariables = (): ThemeTypes => {
  if (typeof window === 'undefined' || !document) {
    return {} as ThemeTypes
  }

  const rootStyles = getComputedStyle(document.documentElement)

  const cssVars: Partial<ThemeTypes> = {
    '--primary-color': rootStyles.getPropertyValue('--primary-color'),
    '--secondary-color': rootStyles.getPropertyValue('--secondary-color'),
    '--text-color': rootStyles.getPropertyValue('--text-color'),
    '--text-dark-color': rootStyles.getPropertyValue('--text-dark-color'),
    '--background-color': rootStyles.getPropertyValue('--background-color'),
    '--white-color': rootStyles.getPropertyValue('--white-color'),
    '--dropdown-hover-color': rootStyles.getPropertyValue(
      '--dropdown-hover-color'
    ),
    '--primary-hover-color': rootStyles.getPropertyValue(
      '--primary-hover-color'
    ),
    '--grey-color': rootStyles.getPropertyValue('--grey-color'),
    '--btnHover-bg-color': rootStyles.getPropertyValue('--btnHover-bg-color'),
    '--gridtable-bg-color': rootStyles.getPropertyValue('--gridtable-bg-color'),
    '--gridtable-text-color': rootStyles.getPropertyValue(
      '--gridtable-text-color'
    ),
    '--header-title': rootStyles.getPropertyValue('--header-title'),
    '--header-stroke': rootStyles.getPropertyValue('--header-stroke'),
    '--black-color': rootStyles.getPropertyValue('--black-color'),
    '--menuHover-color': rootStyles.getPropertyValue('--menuHover-color'),
    '--font-family': rootStyles.getPropertyValue('--font-family'),
    '--error-color': rootStyles.getPropertyValue('--error-color'),
    '--success-color': rootStyles.getPropertyValue('--success-color'),
    '--error-light-color': rootStyles.getPropertyValue('--error-light-color'),
    '--success-light-color': rootStyles.getPropertyValue('--success-light-color'),
  }

  Object.keys(cssVars).forEach((key) => {
    if (cssVars[key]) {
      cssVars[key] = cssVars[key]?.trim()
    }
  })

  return cssVars
}
