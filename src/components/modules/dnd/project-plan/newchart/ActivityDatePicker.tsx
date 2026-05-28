'use client'
import React from 'react'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ActionButton, CancelButton, DateFieldContainer, DateLabel, DatePickerContainer, DialogTitleStyled, InlineStyles, StyledDatePicker } from '@/styles/components/modules/taskSchedule'
import { GLOBAL_STYLES } from '@/constants/common'



interface ActivityDatePickerProps {
  open: boolean
  onClose: () => void
  activityId: number
  activityName: string
  startDate: Date | null
  endDate: Date | null
  onSave: (
    activityId: number,
    startDate: Date | null,
    endDate: Date | null
  ) => void
  allowDateEditing: boolean
}

const ActivityDatePicker: React.FC<ActivityDatePickerProps> = ({
  open,
  onClose,
  activityId,
  activityName,
  startDate,
  endDate,
  onSave,
  allowDateEditing,
}) => {
  const [newStartDate, setNewStartDate] = React.useState<Date | null>(startDate)
  const [newEndDate, setNewEndDate] = React.useState<Date | null>(endDate)
  const [startDateError, setStartDateError] = React.useState<string>('')
  const [endDateError, setEndDateError] = React.useState<string>('')

  // Reset dates when dialog opens
  React.useEffect(() => {
    if (open) {
      setNewStartDate(startDate)
      setNewEndDate(endDate)
      setStartDateError('')
      setEndDateError('')
    }
  }, [open, startDate, endDate])

  const handleStartDateChange = (date: Date | null) => {
    setNewStartDate(date)
    validateDates(date, newEndDate)
  }

  const handleEndDateChange = (date: Date | null) => {
    setNewEndDate(date)
    validateDates(newStartDate, date)
  }

  const validateDates = (start: Date | null, end: Date | null) => {
    setStartDateError('')
    setEndDateError('')

    if (!start) {
      setStartDateError('Start date is required')
    }

    if (!end) {
      setEndDateError('End date is required')
    }

    if (start && end && start > end) {
      setEndDateError('End date must be after start date')
    }
  }

  const handleSave = () => {
    validateDates(newStartDate, newEndDate)

    if (!newStartDate || !newEndDate || newStartDate > newEndDate) {
      return
    }

    onSave(activityId, newStartDate, newEndDate)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth >
      <DialogTitleStyled>Edit Activity Dates</DialogTitleStyled>
      <DialogContent sx={{
      pointerEvents: !allowDateEditing
        ? GLOBAL_STYLES.NONE
        : GLOBAL_STYLES.AUTO,
    }}>
        <DatePickerContainer>
          <Typography variant="subtitle1" sx={InlineStyles.activityName}>
            {activityName}
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateFieldContainer>
              <DateLabel>Start Date</DateLabel>
              <StyledDatePicker
                value={newStartDate}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    error: !!startDateError,
                    helperText: startDateError,
                    fullWidth: true,
                  },
                }}
              />
            </DateFieldContainer>

            <DateFieldContainer>
              <DateLabel>End Date</DateLabel>
              <StyledDatePicker
                value={newEndDate}
                onChange={handleEndDateChange}
                slotProps={{
                  textField: {
                    error: !!endDateError,
                    helperText: endDateError,
                    fullWidth: true,
                  },
                }}
              />
            </DateFieldContainer>
          </LocalizationProvider>
        </DatePickerContainer>
      </DialogContent>
      <DialogActions>
        <CancelButton variant="outlined" onClick={onClose}>
          Cancel
        </CancelButton>
        <ActionButton variant="contained" onClick={handleSave}>
          Save
        </ActionButton>
      </DialogActions>
    </Dialog>
  )
}

export default ActivityDatePicker
