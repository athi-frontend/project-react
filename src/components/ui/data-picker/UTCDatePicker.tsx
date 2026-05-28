import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Box from '@mui/material/Box';
import { InputLabel } from '@/styles/components/ui/input';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import { selectProfileData } from '@/store/slices/menuSlice';

export default function DatePicker({
  value,
  onChange,
  label,
  minDate,
  sx
}: Readonly<{
  value: DateTime | null;
  onChange: (date: DateTime | null) => void;
  label: string;
  minDate?: DateTime;
  sx?: Record<string, any>;
}>) {
        const profileData = useSelector(selectProfileData)

  const dateFormat = React.useMemo(() => {
  return profileData?.organization_date_format ?? 'YYYY-MM-DD'
}, [profileData?.organization_date_format]);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Box>
        <InputLabel>{label}</InputLabel>
        <DesktopDatePicker
          slotProps={sx}
          value={value}
          onChange={onChange}
          format={dateFormat}
          minDate={minDate}
        />
      </Box>
    </LocalizationProvider>
  );
}