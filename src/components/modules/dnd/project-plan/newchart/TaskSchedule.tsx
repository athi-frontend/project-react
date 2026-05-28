'use client'
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TaskScheduleHeader from './TaskScheduleHeader'
import TaskScheduleTable from './TaskScheduleTable'
import ActivityDatePicker from './ActivityDatePicker'
import { Stages } from '@/types/modules/dnd/projectPlan'

const RichTextboxContainer = styled(Box)(({ theme }) => ({
  // paddingLeft: '40px',
  // paddingRight: '40px',
  width: '100%',
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

interface TaskScheduleProps {
  stages: Stages[]
  onAddStages: () => void
  onUpdateStages: (updatedStages: Stages[]) => void
  allowDateEditing?: boolean
}

type ViewMode = 'month' | 'week' | 'day'

const TaskSchedule: React.FC<TaskScheduleProps> = ({
  stages,
  onAddStages,
  onUpdateStages,
  allowDateEditing = true,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<{
    id: number
    name: string
    startDate: Date | null
    endDate: Date | null
  } | null>(null)

  const toggleStageExpand = (stageId: number) => {
    const updatedStages = stages.map(stage =>
      stage.project_build_stage_order_id === stageId
        ? { ...stage, isExpanded: !stage.isExpanded }
        : stage
    )
    onUpdateStages(updatedStages)
  }

  const handleActivityClick = (activityId: number) => {
    for (const stage of stages) {
      const activity = stage.activity.find(
        act => act.activity_id === activityId
      )
      
      if (activity) {
       
        setSelectedActivity({
          id: activityId,
          name: activity.activity,
          startDate: activity.activity_start_date
            ? new Date(activity.activity_start_date)
            : null,
          endDate: activity.activity_end_date
            ? new Date(activity.activity_end_date)
            : null,
        })
        setDatePickerOpen(true)
        break
      }
    }
  }

  const handleDatePickerClose = () => {
    setDatePickerOpen(false)
    setSelectedActivity(null)
  }

  const handleDateSave = (
    activityId: number,
    startDate: Date | null,
    endDate: Date | null
  ) => {
    const formatDate = (date: Date | null) => {
      if (!date) return null
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const updatedStages = stages.map(stage => {
      // Only update the stage that contains the activity
      if (stage.activity.some(activity => activity.activity_id === activityId)) {
        return {
          ...stage,
          activity: stage.activity.map(activity =>
            activity.activity_id === activityId
              ? {
                  ...activity,
                  activity_start_date: formatDate(startDate),
                  activity_end_date: formatDate(endDate),
                }
              : activity
          ),
        }
      }
      return stage
    })

    onUpdateStages(updatedStages)
  }

  return (
    <RichTextboxContainer>
      <ContentContainer>
        <TaskScheduleHeader onAddStages={onAddStages} />
        <TaskScheduleTable
          stages={stages}
          onToggleExpand={toggleStageExpand}
          onActivityClick={handleActivityClick}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {selectedActivity && (
          <ActivityDatePicker
            open={datePickerOpen}
            onClose={handleDatePickerClose}
            activityId={selectedActivity.id}
            activityName={selectedActivity.name}
            startDate={selectedActivity.startDate}
            endDate={selectedActivity.endDate}
            onSave={handleDateSave}
            allowDateEditing={allowDateEditing}
          />
        )}
      </ContentContainer>
    </RichTextboxContainer>
  )
}

export default TaskSchedule
