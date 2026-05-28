'use client'
import React from 'react'
import { ItemContainer, ItemLabel } from '@/styles/components/ui/sidebar'
import { SidebarItemProps } from '@/types/components/modules/stepper'
import { Icon } from '@mui/material'

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
}) => {
  return (
    <ItemContainer
      sx={(theme) => ({
        backgroundColor: isActive
          ? theme.palette.background.default
          : theme.palette.background.paper,
        textTransform: 'none',
      })}
      onClick={onClick}
    >
      <Icon baseClassName="material-icons">{icon}</Icon>
      <ItemLabel>{label}</ItemLabel>
    </ItemContainer>
  )
}

export default SidebarItem
