import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid2,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material'
import { Task, Stage } from '@/types/modules/dnd/projectPlan'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  addDays,
  differenceInDays,
  format,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  differenceInWeeks,
} from 'date-fns'
import TaskDatePicker from './TaskDatePicker'

import {
  container,
  scrollContainer,
  timelineWrapper,
  headerRow,
  snoCell,
  descCell,
  stageRow,
  stageDesc,
  stageTimeline,
  taskRow,
  taskDesc,
  taskTimeline,
  getTimelineBarSx,
  monthHeader,
  weekCell,
  expandButton,
  taskClickableText,
  timelineContent,
  bodyScroll,
  STAGE_BAR_COLOR,
  TASK_BAR_COLOR,
} from '@/styles/modules/dnd/projectPlan'

import {

  DISPLAY_DATE_FORMAT,
  MONTH_YEAR_FORMAT,
  YEAR_MONTH_FORMAT,
  SIZE,
  WEIGHT,
  DATE_FORMAT,
} from '@/constants/modules/dnd/projectPlan'
import { NUMBERMAP } from '@/constants/common'

interface Props {
  scheduleStageList: Stage[]
  onSave: (updatedData: Stage[]) => void
}

const getTimelineRange = (data: Stage[]) => {
  let minDate: Date | null = null
  let maxDate: Date | null = null

  data.forEach((stage) => {
    if (!Array.isArray(stage.activity)) return
    stage.activity.forEach((task) => {
      if (!minDate || isBefore(task.activity_start_date, minDate)) {
        minDate = task.activity_start_date
      }
      if (!maxDate || isAfter(task.activity_end_date, maxDate)) {
        maxDate = task.activity_end_date
      }
    })
  })

  return {
    start: minDate ?? new Date(),
    end: maxDate ?? new Date(),
  }
}

const getFullWeeksForMonth = (month: Date) => {
  return eachWeekOfInterval(
    {
      start: startOfMonth(month),
      end: endOfMonth(month),
    },
    { weekStartsOn: NUMBERMAP.ONE }
  )
}

const generateMonthWeeks = (start: Date, end: Date) => {
  const monthMap = new Map<
    string,
    { label: string; weeks: Date[]; start: Date }
  >()

  let current = startOfMonth(start)
  const endMonth = endOfMonth(end)

  while (current <= endMonth) {
    const yearMonth = format(current, YEAR_MONTH_FORMAT)
    const label = format(current, MONTH_YEAR_FORMAT)
    const weeks = getFullWeeksForMonth(current)
    monthMap.set(yearMonth, { label, weeks, start: current })
    current = addDays(endOfMonth(current), NUMBERMAP.ONE)
  }

  return Array.from(monthMap.values())
}

const TaskGanttChart: React.FC<Props> = ({ scheduleStageList, onSave }) => {
  const [expandedStages, setExpandedStages] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<{
    task: Task
    stageId: number
  } | null>(null)

  const { start: timelineStart, end: timelineEnd } =
    getTimelineRange(scheduleStageList)
  const totalDuration =
    differenceInDays(timelineEnd, timelineStart) + NUMBERMAP.ONE

  const timelineMonths = generateMonthWeeks(timelineStart, timelineEnd)
  const totalWeeks = timelineMonths.reduce((acc, m) => acc + m.weeks.length, 1)

  const toggleExpand = (stageOrder: number) => {
    setExpandedStages((prev) =>
      prev.includes(stageOrder)
        ? prev.filter((order) => order !== stageOrder)
        : [...prev, stageOrder]
    )
  }

  const renderTimelineBar = (
    start: Date,
    end: Date,
    color: string = TASK_BAR_COLOR
  ) => {
    const startOffset = differenceInDays(start, timelineStart)
    const barDuration = differenceInDays(end, start) + NUMBERMAP.ONE

    const offsetPercent = (startOffset / totalDuration) * NUMBERMAP.HUNDRED
    const widthPercent = (barDuration / totalDuration) * NUMBERMAP.HUNDRED

    return <Box sx={getTimelineBarSx(offsetPercent, widthPercent, color)} />
  }

  const getStageTimeline = (tasks?: Task[]) => {
    if (!Array.isArray(tasks) || tasks.length === NUMBERMAP.ZERO) return null
    const minStart = tasks.reduce(
      (min, task) =>
        isBefore(task.activity_start_date, min)
          ? task.activity_start_date
          : min,
      tasks[0].activity_start_date
    )
    const maxEnd = tasks.reduce(
      (max, task) =>
        isAfter(task.activity_end_date, max) ? task.activity_end_date : max,
      tasks[0].activity_end_date
    )
    return renderTimelineBar(minStart, maxEnd, STAGE_BAR_COLOR)
  }

  const handleTaskClick = (task: Task, stageId: number) => {
    setSelectedTask({ task, stageId })
    setIsModalOpen(true)
  }

  const handleSave = (taskId: number, newStartDate: Date, newEndDate: Date) => {
    const updatedData = scheduleStageList.map((stage) => {
      const updatedStage = { ...stage }

      if (Array.isArray(stage.activity)) {
        updatedStage.activity = stage.activity.map((task) =>
          task.activity_id === taskId
            ? {
                ...task,
                activity_start_date: newStartDate,
                activity_end_date: newEndDate,
                activity_duration:
                  differenceInDays(newEndDate, newStartDate) + NUMBERMAP.ONE,
              }
            : task
        )
      }

      return updatedStage
    })

    onSave(updatedData)
    setIsModalOpen(false)
    setSelectedTask(null)
  }
  return (
    <Box sx={container}>
      <Box sx={scrollContainer}>
        <Box sx={{ ...timelineWrapper(totalWeeks), overflowX: 'auto' }}>
          {}
          <Box sx={headerRow}>
            <Box sx={snoCell}>S.No.</Box>
            <Box sx={descCell}>Description / Activities</Box>
            <Box sx={timelineContent}>
              <Grid2 container wrap="nowrap">
                {timelineMonths.map((month) => (
                  <Grid2
                    key={month.label}
                    sx={{
                      minWidth: `${month.weeks.length * NUMBERMAP.HUNDRED}px`,
                    }}
                  >
                    <Box sx={monthHeader}>{month.label}</Box>
                    <Grid2 container>
                      {month.weeks
                        .filter(
                          (weekStartDate) =>
                            format(weekStartDate, YEAR_MONTH_FORMAT) ===
                            format(month.start, YEAR_MONTH_FORMAT)
                        )
                        .map((weekStartDate) => {
                          const weekNumber =
                            differenceInWeeks(
                              weekStartDate,
                              startOfMonth(month.start)
                            ) + NUMBERMAP.ONE
                          return (
                            <Grid2
                              item
                              key={format(weekStartDate, DATE_FORMAT)}
                              sx={weekCell}
                            >
                              W-{weekNumber}
                            </Grid2>
                          )
                        })}
                    </Grid2>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </Box>

          {}
          <Box sx={bodyScroll}>
            {scheduleStageList.map((stage, index) => (
              <Box key={`stage-${stage.stage_id}-${index}`}>
                <Box sx={stageRow}>
                  <Box sx={snoCell}>{String(stage.stage_order)}</Box>
                  <Box sx={stageDesc}>
                    <Typography fontWeight={WEIGHT}>
                      {stage.stage_name}
                    </Typography>

                    <IconButton
                      size={SIZE}
                      onClick={() => toggleExpand(stage.stage_order)}
                      sx={expandButton}
                    >
                      {expandedStages.includes(stage.stage_order) ? (
                        <ExpandLess fontSize={SIZE} />
                      ) : (
                        <ExpandMore fontSize={SIZE} />
                      )}
                    </IconButton>
                  </Box>
                  <Box sx={stageTimeline}>
                    {getStageTimeline(stage.activity)}
                  </Box>
                </Box>

                <Collapse in={expandedStages.includes(stage.stage_order)}>
                  {Array.isArray(stage.activity) &&
                    stage.activity.map((task) => (
                      <Box
                        key={`task-${stage.stage_id}-${task.activity_id}`}
                        sx={taskRow}
                      >
                        <Box sx={taskDesc}>
                          <Tooltip
                            title={`${format(
                              task.activity_start_date,
                              DISPLAY_DATE_FORMAT
                            )} - ${format(
                              task.activity_end_date,
                              DISPLAY_DATE_FORMAT
                            )}`}
                          >
                            <Typography
                              sx={taskClickableText}
                              onClick={() =>
                                handleTaskClick(task, stage.stage_id)
                              }
                            >
                              {task.activity}
                            </Typography>
                          </Tooltip>
                        </Box>
                        <Box sx={taskTimeline}>
                          {renderTimelineBar(
                            task.activity_start_date,
                            task.activity_end_date
                          )}
                        </Box>
                      </Box>
                    ))}
                </Collapse>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {}
      {selectedTask && (
        <TaskDatePicker
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask.task}
          onSave={handleSave}
        />
      )}
    </Box>
  )
}

export default TaskGanttChart
