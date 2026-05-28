/**
 * Classification: Confidential
 * Description: Type definitions for FilterDropdown component
 */

import { Dayjs } from 'dayjs'
import { DateTime } from 'luxon'

export interface FilterData {
  period: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'
  startDate: Dayjs | DateTime | string | null
  endDate: Dayjs | DateTime | string | null
  restrictionStartDate?: string // Format: "MM-yyyy" (e.g., "07-2026")
}

export interface SalesForecastDetail {
  sales_forecast_id: number
  time_bucket: string
  units: number
}

export interface PeriodDataRow {
  id: number
  sno: number
  productName: string
  category: string
  productType: string
  productSubType: string
  salesForecastDetails: SalesForecastDetail[]
  [key: string]: any // For dynamic month columns
}

export interface PeriodDataStructure {
  columns: string[]
  data: PeriodDataRow[]
}

export interface FilterDropdownProps {
  onFilter?: (filterData: FilterData) => void
  onCancel?: () => void
  initialData?: FilterData
  periodData?: {
    monthly?: PeriodDataStructure
    quarterly?: PeriodDataStructure
    'half-yearly'?: PeriodDataStructure
    yearly?: PeriodDataStructure
  }
  onPeriodChange?: (period: FilterData['period'], data: PeriodDataStructure) => void
  hideButton?: boolean
  hidePeriodSelection?: boolean
  restrictionStartDate?: string // Format: "MM-yyyy" (e.g., "07-2026")
  maxMonths?: number // Override max months when period selection is hidden
}
