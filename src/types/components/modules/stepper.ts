import React from 'react'

export interface SidebarItemProps {
  label: string
  icon?: React.ReactNode
  path: string
  isActive?: boolean
  onClick?: () => void
}

export interface SidebarSectionProps {
  title: string
  icon?: string
  isExpanded?: boolean
  AccessedSection: { [key: number]: number }
  currentSection: number
  isActive?: boolean
  items?: SidebarItemProps[]
  onToggle?: () => void
  onItemClick?: (index: number) => void
  path?: string;
}

export interface DecorationProps {
  onClick?: () => void
}

export interface ProjectSidebarProps {
  commonId: string | null
  AccessedSection: { [key: number]: number }
  activeSection?: number
  activeItem?: number
  onSectionToggle?: (index: number) => void
  onItemClick?: (sectionIndex: number, itemIndex: number) => void
  sections: SidebarSectionProps[];
}

export interface RecordGenerationProps {
  contextType: string;
}