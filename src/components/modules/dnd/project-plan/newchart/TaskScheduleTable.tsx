'use client'
import React, { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import TaskScheduleRow from './TaskScheduleRow'
import TaskScheduleActivity from './TaskScheduleActivity'
import {
  Activity,
  calculateBarPosition,
  getMonthsForDisplay,
  getWeeksInMonth,
  shouldFillWeek,
  shouldFillDay,
} from './TaskScheduleUtils'
import { TableContainer,Table,TableHeader,StaticHeaderContainer,SerialNumberHeader,DescriptionHeader,MonthsContainer,MonthContainer,MonthBox,MonthHeader as MonthHeaderBase,TableBody,WeeksContainer,WeekBox,NoRecordsMessage, DescriptionBoxSx, getToggleButtonGroupSx, getMonthViewBoxSx, DescriptionLabelSx, DESCRIPTION_LABEL } from '@/styles/components/modules/projectStagesStyles'
import { NO_RECORDS_FOUND, NUMBERMAP } from '@/constants/common'
import { TASK_SCHEDULE_LABELS, TASK_SCHEDULE_VIEW } from '@/constants/modules/dnd/projectPlan'

const MonthHeader = MonthHeaderBase
// Define the types based on the provided JSON structure
/**
    Classification : Confidential
**/
interface Stage {
  project_build_stage_order_id: number
  stage_name: string
  stage_order: number
  stage_number: number
  stage_id: number
  design_stage_id: number
  activity: Activity[]
  isExpanded?: boolean
}

export interface TaskScheduleTableProps {
  stages: Stage[]
  onToggleExpand: (stageId: number) => void
  onActivityClick: (activityId: number) => void
  viewMode: 'month' | 'week' | 'day'
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void
}

const TaskScheduleTable: React.FC<TaskScheduleTableProps> = ({
  stages,
  onToggleExpand,
  onActivityClick,
  viewMode,
  onViewModeChange,
}) => {
  const theme = useTheme()
  // Get all activities from all stages
  const allActivities = useMemo(() => {
    return stages.flatMap((stage) => stage.activity)
  }, [stages])

  // Get the months to display based on the activities' dates
  const months = useMemo(() => {
    return getMonthsForDisplay(allActivities)
  }, [allActivities])
  return (
    <TableContainer>
      <Table>
        {/* Fixed Header */}
        <TableHeader>
          <StaticHeaderContainer>
            <SerialNumberHeader>
              <Typography>{TASK_SCHEDULE_LABELS.S_NO}</Typography>
            </SerialNumberHeader>
            <DescriptionHeader>
              <Box sx={DescriptionBoxSx}>
                <ButtonGroup
                  size="small"
                  disableElevation
                  sx={getToggleButtonGroupSx(theme)}
                >
                  <Button
                    className={viewMode === TASK_SCHEDULE_VIEW.MONTH ? TASK_SCHEDULE_VIEW.ACTIVE_CLASS : ''}
                    onClick={() => onViewModeChange(TASK_SCHEDULE_VIEW.MONTH)}
                  >
                    {TASK_SCHEDULE_LABELS.MONTH}
                  </Button>
                  <Button
                    className={viewMode === TASK_SCHEDULE_VIEW.WEEK ? TASK_SCHEDULE_VIEW.ACTIVE_CLASS : ''}
                    onClick={() => onViewModeChange(TASK_SCHEDULE_VIEW.WEEK)}
                  >
                    {TASK_SCHEDULE_LABELS.WEEK}
                  </Button>
                  <Button
                    className={viewMode === TASK_SCHEDULE_VIEW.DAY ? TASK_SCHEDULE_VIEW.ACTIVE_CLASS : ''}
                    onClick={() => onViewModeChange(TASK_SCHEDULE_VIEW.DAY)}
                  >
                    {TASK_SCHEDULE_LABELS.DAY}
                  </Button>
                </ButtonGroup>
                <Typography sx={DescriptionLabelSx}>{DESCRIPTION_LABEL}</Typography>
              </Box>
            </DescriptionHeader>
          </StaticHeaderContainer>

          <MonthsContainer>
            {months.map((month, index) => {
              const weeks = getWeeksInMonth(month.year, month.month)
              const daysInMonth = new Date(
                month.year,
                month.month + NUMBERMAP.ONE,
                NUMBERMAP.ZERO
              ).getDate()
              const isLastMonth = index === months.length - NUMBERMAP.ONE
              return (
                <MonthContainer key={`${month.year}-${month.month}`}>
                  <MonthBox
                    sx={
                      viewMode === TASK_SCHEDULE_VIEW.MONTH
                        ? getMonthViewBoxSx(theme, index === NUMBERMAP.ZERO, isLastMonth)
                        : undefined
                    }
                  >
                    <MonthHeader isLastMonth={index === months.length - NUMBERMAP.ONE}>
                      {month.name}
                    </MonthHeader>
                    {/* No sub-heading rows in month view */}
                    {viewMode === TASK_SCHEDULE_VIEW.WEEK && (
                      <WeeksContainer>
                        {weeks.map(week => {
                          const isActiveWeek = shouldFillWeek(
                            month.year,
                            month.month,
                            week,
                            allActivities
                          )
                          return (
                            <WeekBox
                              key={`week-${month.year}-${month.month}-${week}`}
                              isActive={isActiveWeek}
                              weekCount={weeks.length}
                            >
                              W-{week}
                            </WeekBox>
                          )
                        })}
                      </WeeksContainer>
                    )}
                    {viewMode === TASK_SCHEDULE_VIEW.DAY && (
                      <WeeksContainer>
                        {Array.from(
                          { length: daysInMonth },
                          (_, dayIndex) => dayIndex + NUMBERMAP.ONE
                        ).map(day => {
                          const isActiveDay = shouldFillDay(
                            month.year,
                            month.month,
                            day,
                            allActivities
                          )
                          return (
                            <WeekBox
                              key={`day-${month.year}-${month.month}-${day}`}
                              isActive={isActiveDay}
                              weekCount={daysInMonth}
                            >
                              {day}
                            </WeekBox>
                          )
                        })}
                      </WeeksContainer>
                    )}
                  </MonthBox>
                </MonthContainer>
              )
            })}
          </MonthsContainer>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {stages.length === NUMBERMAP.ZERO ? (
            <NoRecordsMessage>
              {NO_RECORDS_FOUND}
            </NoRecordsMessage>
          ) : (stages.map((stage, index) => (
            <React.Fragment key={stage.project_build_stage_order_id}>
              <TaskScheduleRow
                id={`${index + NUMBERMAP.ONE}`}
                name={`${stage.stage_name} ${stage.stage_number}`}
                barPosition={calculateBarPosition(stage.activity, months)}
                isExpanded={stage.isExpanded}
                onToggle={() =>
                  onToggleExpand(stage.project_build_stage_order_id)
                }
                hasActivities={stage.activity.length > NUMBERMAP.ZERO}
                months={months}
                activities={stage.activity} // Pass the activities to the row
              />

              {/* Render activities if stage is expanded */}
              {stage.isExpanded &&
                stage.activity.map((activity, activityIndex) => (
                  <TaskScheduleActivity
                    key={activity.activity_id}
                    activity={activity}
                    months={months}
                    onClick={() => onActivityClick(activity.activity_id)}
                    index={activityIndex + NUMBERMAP.ONE} 
                  />
                ))}
            </React.Fragment>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TaskScheduleTable
