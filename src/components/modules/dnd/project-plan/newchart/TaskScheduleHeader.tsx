'use client'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { AddButton, ButtonText, HeaderContainer, InlineStyles, TitleContainer } from '@/styles/components/modules/taskSchedule'

interface TaskScheduleHeaderProps {
  onAddStages: () => void
}

const TaskScheduleHeader: React.FC<TaskScheduleHeaderProps> = ({
  onAddStages,
}) => {
  return (
    <HeaderContainer>
      <TitleContainer>Task Schedule</TitleContainer>
      <AddButton onClick={onAddStages}>
        <AddIcon sx={InlineStyles.headerName} />
        <ButtonText>Add Stages</ButtonText>
      </AddButton>
    </HeaderContainer>
  )
}

export default TaskScheduleHeader
