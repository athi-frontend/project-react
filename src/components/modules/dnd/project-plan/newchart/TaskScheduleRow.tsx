'use client'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Activity, calculateStageBarWidth, Month } from './TaskScheduleUtils'
import { RowContainer,SerialNumber,StageContainer,StageContent,StageName,ExpandIcon,TimelineContainer,BarWrapper,Bar, SerialNo } from '@/styles/components/modules/projectStagesStyles'




interface TaskScheduleRowProps {
  id: string
  name: string
  barPosition: string
  isExpanded?: boolean
  onToggle?: () => void
  hasActivities?: boolean
  months?: Month[]
  activities?: Activity[]
}

const TaskScheduleRow: React.FC<TaskScheduleRowProps> = ({
  id,
  name,
  barPosition,
  isExpanded = false,
  onToggle,
  hasActivities = false,
  months = [],
  activities = [],
}) => {
  // Calculate the width of the bar based on the activities' date range
  const barWidth = calculateStageBarWidth(activities, months)

  return (
    <RowContainer>
      <SerialNumber sx={SerialNo}>{id}</SerialNumber>
      <StageContainer>
        <StageContent>
          <StageName>{name}</StageName>
          {hasActivities && onToggle && (
            <ExpandIcon onClick={onToggle}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ExpandIcon>
          )}
        </StageContent>
      </StageContainer>
      <TimelineContainer>
        <BarWrapper left={barPosition}>
          {barWidth !== '0px' && <Bar width={barWidth} />}
        </BarWrapper>
      </TimelineContainer>
    </RowContainer>
  )
}

export default TaskScheduleRow
