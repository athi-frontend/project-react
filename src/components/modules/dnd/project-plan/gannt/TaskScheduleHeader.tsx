'use client'
import React, { useState } from 'react'
import { Menu, MenuItem} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { AddButton, AddIcons, AddMonthButton, ButtonsContainer, HeaderContainer,TitleContainer } from '@/styles/modules/dnd/projectPlan'

interface TaskScheduleHeaderProps {
  onAddMonth: (monthsToAdd: number) => void
}

const TaskScheduleHeader: React.FC<TaskScheduleHeaderProps> = ({
  onAddMonth,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAddMonth = (months: number) => {
    onAddMonth(months)
    handleClose()
  }

  return (
    <HeaderContainer>
      <TitleContainer>Task Schedule</TitleContainer>
      <ButtonsContainer>
        <AddButton>
          <AddIcons />
          Add Stages
        </AddButton>

        <AddMonthButton
          id="add-month-button"
          aria-controls={open ? 'add-month-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Add Month
        </AddMonthButton>
        <Menu
          id="add-month-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'add-month-button',
          }}
        >
          <MenuItem onClick={() => handleAddMonth(1)}>Add 1 Month</MenuItem>
          <MenuItem onClick={() => handleAddMonth(2)}>Add 2 Months</MenuItem>
          <MenuItem onClick={() => handleAddMonth(3)}>Add 3 Months</MenuItem>
        </Menu>
      </ButtonsContainer>
    </HeaderContainer>
  )
}

export default TaskScheduleHeader
