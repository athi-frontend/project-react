'use client'
import React from 'react'
import {
  calculateActivityBarPosition,
  calculateBarWidth,
} from './TaskScheduleUtils'
import { ActivityContainer, ActivityContent, ActivityName, ActivityNameContainer, Bar, BarWrapper, DateInfo, EmptyCell, TimelineContainer, TaskScheduleStyles, ActiveTaskScheduleStyles } from '@/styles/components/modules/taskSchedule'
import { CalendarAdd } from 'iconsax-react'
import { NUMBERMAP, CALENDAR_ICON_COLOR } from '@/constants/common'

/**
    Classification : Confidential
**/
interface Activity {
  activity_id: number
  activity: string
  activity_start_date: string | null
  activity_end_date: string | null
}

interface Month {
  year: number
  month: number
  name: string
}

interface TaskScheduleActivityProps {
  activity: Activity
  months: Month[]
  onClick: () => void
  index: number
}

// Format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not set'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const TaskScheduleActivity: React.FC<TaskScheduleActivityProps> = ({
  activity,
  months,
  onClick,
  index,
}) => {
  const barPosition = calculateActivityBarPosition(activity, months)
  const barWidth = calculateBarWidth(activity, months)

  return (
    <ActivityContainer>
      <EmptyCell />
      <ActivityNameContainer>
        <ActivityContent style={ActiveTaskScheduleStyles}>
          <ActivityName style={TaskScheduleStyles.activityNameDefault}>
            {activity.activity} {String(index).padStart(NUMBERMAP.TWO, '0')}
          </ActivityName>
          <DateInfo onClick={onClick} style={TaskScheduleStyles.dateInfoClickable}>
              <CalendarAdd size={NUMBERMAP.TWENTYFIVE} color={CALENDAR_ICON_COLOR} />
          </DateInfo>
        </ActivityContent>
      </ActivityNameContainer>
      <TimelineContainer>
        <BarWrapper left={barPosition}>
          {barWidth !== '0px' && <Bar width={barWidth} />}
        </BarWrapper>
      </TimelineContainer>
    </ActivityContainer>
  )
}

export default TaskScheduleActivity
