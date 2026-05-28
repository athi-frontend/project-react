import * as React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import Box from '@mui/material/Box'
import { DatePickerStyle, InputLabel } from '@/styles/components/ui/input'
import { Dayjs } from 'dayjs'
import { ErrorText } from '@/styles/common'
import { fullWidth } from '@/styles/components/ui/layout'
import { useSelector } from 'react-redux'
import { selectProfileData } from '@/store/slices/menuSlice'
import { normalizeFormatString } from '@/lib/utils/common'

export default function DatePicker({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  error,
  dataSourceName,
  dataFieldName,
  dataIsAutocomplete,
  readOnly = false,
  disabled = false
}: Readonly<{
  value: Dayjs | null
  onChange: (date: Dayjs | null) => void
  label: string
  minDate?: Dayjs
  maxDate?: Dayjs
  error?: string
  dataSourceName?: string
  dataFieldName?: string
  dataIsAutocomplete?: string
  readOnly?: boolean
  disabled?:boolean
}>) {
    const profileData = useSelector(selectProfileData)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={fullWidth}>
        <InputLabel>{label}</InputLabel>
        <DesktopDatePicker
          disabled={disabled}
          value={value}
          onChange={onChange}
          format={profileData?.organization_date_format?normalizeFormatString(profileData?.organization_date_format):'YYYY-MM-DD'}
          sx={fullWidth}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              error: error !== '',
              fullWidth: true,
              readOnly: readOnly,
              inputProps: {
                'data-sourcename': dataSourceName,
                'data-fieldname': dataFieldName,
                'data-is-autocomplete': dataIsAutocomplete
              },

              sx: DatePickerStyle
            },
          }}

        />

        {error && <ErrorText>{error}</ErrorText>}
      </Box>
    </LocalizationProvider>
  )
}
