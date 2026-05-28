import { NUMBERMAP } from '@/constants/common'
import { GridFilterModel } from '@mui/x-data-grid'
import { TableFilters } from '@/styles/components/ui/datatable'
import { formatDate, stripHtml } from '@/lib/utils/common'

/**
    Classification : Confidential
**/

type CellValue = string | number | null | undefined

interface RowData {
  [key: string]: CellValue
}

/**
 * Applies filters to table rows based on GridFilterModel
 * 25-07-2025
 * SimiPrincy -author
 * This component used to filter table fields
 */

const normalizeStatus = (value: string | number): string => {
  return (value === NUMBERMAP.ONE || value === String(NUMBERMAP.ONE)) 
    ? TableFilters.activeStatus 
    : TableFilters.inactiveStatus
}

// Check if value looks like a date (ISO format YYYY-MM-DD or timestamp)
const isDateValue = (value: CellValue): boolean => {
  if (!value) return false
  if (typeof value === 'string') {
    // Check for ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
    const isoDatePattern = new RegExp(`^\\d{${NUMBERMAP.FOUR}}-\\d{${NUMBERMAP.TWO}}-\\d{${NUMBERMAP.TWO}}(T\\d{${NUMBERMAP.TWO}}:\\d{${NUMBERMAP.TWO}}:\\d{${NUMBERMAP.TWO}})?`)
    return isoDatePattern.test(value)
  }
  return false
}

const statusFieldHandle = (row,field)=>{
   const statusId = row['status_id'] ?? row[field]
    const statusValue = Number(statusId) === NUMBERMAP.ONE ? TableFilters.activeStatus : TableFilters.inactiveStatus
    return statusValue.toLowerCase()
}
const getValue = (value: CellValue, field: string, row: RowData): string => {
  if (field === TableFilters.statusColumn) {
    // Check for status_id field as the actual data field name
    return statusFieldHandle(row,field)
  }else if(field == 'status_id'){
    return statusFieldHandle(row,field)
  }else if(field?.startsWith("rich_text")){
    return row[field?.split('-')[NUMBERMAP.ONE]] ? stripHtml(row[field?.split('-')[NUMBERMAP.ONE]]): ''
  }
  
  // Format date values using formatDate (which uses Redux date format internally)
  if (isDateValue(value)) {
    const formattedDate = formatDate(value)
    return formattedDate ? formattedDate.toLowerCase() : ''
  }
  
  // Return value as lowercase string
  return row[field]?.toString().toLowerCase() ?? ''
}
const applyFilterOperator = (
  value: string,
  filterValue: CellValue | (string | number)[],
  operator: string | number | null | undefined
): boolean => {
  if (operator === 'isEmpty') {
    return value === '' || value == null
  }
  if (operator === 'isNotEmpty') {
    return value !== '' && value != null
  } 
  if (
    filterValue === null ||
    filterValue === undefined ||
    filterValue === '' ||
    (Array.isArray(filterValue) && filterValue.length === NUMBERMAP.ZERO)
  ) {
    return true
  }
  if (operator === 'isAnyOf' && Array.isArray(filterValue)) {
    // Normalizes filter values for comparison
    const normalizedFilterValues = filterValue.map((f: string | number) => {
      return typeof f === 'string' ? f.toLowerCase() : String(f).toLowerCase()
    })
    return (
      normalizedFilterValues.length > NUMBERMAP.ZERO &&
      normalizedFilterValues.some((f: string) => value === f)
    )
  }
  
  // Normalizes filter value for comparison
  const normalizedFilterValue: string = !Array.isArray(filterValue)
    ? (String(filterValue))
    : ''
  
  const val = value.toLowerCase()

  const filterVal = normalizedFilterValue.toLowerCase()
  switch (operator) {
    case 'contains':
      return val.includes(filterVal)
    case 'doesNotContain':
      return !val.includes(filterVal)
    case 'equals':
      return val === filterVal
    case 'doesNotEqual':
      return val !== filterVal
    case 'startsWith':
      return val.startsWith(filterVal)
    case 'endsWith':
      return val.endsWith(filterVal)
    default:
      return true
  }
}

export const applyTableFilters = (
  rows: RowData[],
  filterModel: GridFilterModel,
  searchValue?: string,
  searchableColumns?: string[]
): RowData[] => {
  let processedRows = [...(rows??[])]
  // Apply global search filter
  if (searchValue) {
    const lowerSearch = searchValue.toLowerCase()
    processedRows = processedRows.filter((row) =>
      Object.entries(row).some(([key, val]: [string, CellValue]) => {
        // Only search in specified columns if provided, otherwise search all columns
        if (searchableColumns && !searchableColumns.includes(key)) {
          return false;
        }
        if (!val) return false;
        if (key === TableFilters.statusColumn || key === 'status_id') {
          const normalizedStatus = normalizeStatus(val)
          return normalizedStatus.toLowerCase().includes(lowerSearch);
        }
        // Dates are already formatted in row data, so search directly
        if (typeof val === 'string') return val.toLowerCase().includes(lowerSearch);
        if (typeof val === 'number') {
          const searchNum = Number(searchValue);
          return !isNaN(searchNum) && val === searchNum;
        }
        return false;
      })
    );
  }
  // Apply filters
  if (filterModel.items.length > NUMBERMAP.ZERO) {
    processedRows = processedRows.filter((row) =>
      filterModel.items.every((filterItem) => {
        const value = getValue(row[filterItem.field], filterItem.field, row)
        const result = applyFilterOperator(
          value,
          filterItem.value,
          filterItem.operator
        )
        return result
      })
    )
  }
  return processedRows
}