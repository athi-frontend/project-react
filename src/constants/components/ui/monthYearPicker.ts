import { NUMBERMAP } from '@/constants/common'

// Month names for the picker
export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

// Maximum months allowed for each period type
export const PERIOD_MAX_MONTHS = {
  monthly: NUMBERMAP.THREE,
  quarterly: NUMBERMAP.TWELVE,
  'half-yearly': NUMBERMAP.EIGHTEEN,
  yearly: NUMBERMAP.THIRTYSIX
} as const
