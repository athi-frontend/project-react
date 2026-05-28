'use client'
import React, { useState, useEffect } from 'react'
import { Box, Modal } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  ModalContainer,
  ModalTitle,
  TaskDescription,
  DatePickerContainer,
  DatePickerLabel,
  WeekInfoContainer,
  WeekInfoTitle,
  WeekInfoText,
  ButtonContainer,
  CancelButton,
  SaveButton,
  ErrorText,
} from '@/styles/modules/dnd/projectPlan'
import { TaskDatePickerProps } from '@/types/modules/dnd/projectPlan'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  MONTHS,
  DATE_PICKER_ERRORS,
  TOTAL_MONTHS,
} from '@/constants/modules/dnd/projectPlan'
const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
const { REQUIRED_START_DATE, REQUIRED_END_DATE, END_DATE_AFTER_START_DATE } =
  DATE_PICKER_ERRORS

const getWeekOfMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayOfWeek = firstDay.getDay()

  const dayOfMonth = date.getDate()

  return Math.ceil((dayOfMonth + dayOfWeek) / 7)
}

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({
  open,
  onClose,
  task,
  onSave,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    task.activity_start_date ? new Date(task.activity_start_date) : null
  )
  const [endDate, setEndDate] = useState<Date | null>(
    task.activity_end_date ? new Date(task.activity_end_date) : null
  )

  const [error, setError] = useState<string>('')
  const [weekInfo, setWeekInfo] = useState<string>('')

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()

  useEffect(() => {
    if (!startDate || !endDate) {
      setWeekInfo('')
      return
    }

    const startMonth = startDate.getMonth() - currentMonth
    const endMonth = endDate.getMonth() - currentMonth

    const adjustedStartMonth =
      startMonth < EMPTY_ARRAY_LENGTH ? startMonth + TOTAL_MONTHS : startMonth
    const adjustedEndMonth =
      endMonth < EMPTY_ARRAY_LENGTH ? endMonth + TOTAL_MONTHS : endMonth

    const startWeek = getWeekOfMonth(startDate)
    const endWeek = getWeekOfMonth(endDate)

    const startMonthName = MONTHS[startDate.getMonth()]
    const endMonthName = MONTHS[endDate.getMonth()]

    if (adjustedStartMonth === adjustedEndMonth && startWeek === endWeek) {
      setWeekInfo(`This task will fill Week ${startWeek} of ${startMonthName}.`)
    } else if (adjustedStartMonth === adjustedEndMonth) {
      setWeekInfo(
        `This task will fill Weeks ${startWeek} through ${endWeek} of ${startMonthName}.`
      )
    } else {
      setWeekInfo(
        `This task will fill from Week ${startWeek} of ${startMonthName} through Week ${endWeek} of ${endMonthName}.`
      )
    }
  }, [startDate, endDate, currentMonth])

  const handleSave = () => {
    if (!startDate) {
      setError(REQUIRED_START_DATE)
      return
    }

    if (!endDate) {
      setError(REQUIRED_END_DATE)
      return
    }

    if (startDate > endDate) {
      setError(END_DATE_AFTER_START_DATE)
      return
    }

    setError('')
    onSave(task.activity_id, startDate, endDate)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="task-date-picker-modal"
    >
      <ModalContainer>
        <ModalTitle>Schedule Task</ModalTitle>
        <TaskDescription>{task.activity}</TaskDescription>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePickerContainer>
            <Box>
              <DatePickerLabel>Start Date</DatePickerLabel>
              <DatePicker
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Box>

            <Box>
              <DatePickerLabel>End Date</DatePickerLabel>
              <DatePicker
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Box>
          </DatePickerContainer>
        </LocalizationProvider>

        {weekInfo && (
          <WeekInfoContainer>
            <WeekInfoTitle>Week Information</WeekInfoTitle>
            <WeekInfoText>{weekInfo}</WeekInfoText>
          </WeekInfoContainer>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </ButtonContainer>
      </ModalContainer>
    </Modal>
  )
}

export default TaskDatePicker
