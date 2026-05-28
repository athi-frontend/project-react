'use client'
import React, { useState } from 'react'
import ProjectSidebar from './ProjectSidebar'
import { NUMBERMAP } from '@/constants/common'

function StepperComponent({ sections }: any) {
  const [accessedSection, setAccessedSection] = useState<{
    [key: number]: number
  }>({ 0: 0 })
  const [activeSection, setActiveSection] = useState(0)
  const handleSectionToggle = (sectionIndex: number) => {}

  const handleItemClick = (sectionIndex: number, itemIndex: number) => {
    setActiveSection(sectionIndex)
    setAccessedSection({ ...accessedSection, [sectionIndex]: itemIndex })
  }

  // Check if child has items and render nested menu
  const renderNestedMenu = (sections: any[]) => {
    return sections.map((section) => {
      if (section.items && section.items.length > NUMBERMAP.ZERO) {
        const processedItems = section.items.map((item: any) => {
          // Check if this item has nested items
          if (item.items && item.items.length > NUMBERMAP.ZERO) {
            return {
              ...item,
              hasNested: true,
              nestedItems: item.items,
              // Add flag to indicate if parent is clickable (has valid URL)
              isParentClickable: item.path && item.path !== '#'
            }
          }
          return item
        })
        
        return {
          ...section,
          items: processedItems
        }
      }
      return section
    })
  }

  const processedSections = renderNestedMenu(sections)

  return (
    <ProjectSidebar
      commonId={null}
      sections={processedSections}
      AccessedSection={accessedSection}
      activeSection={activeSection}
      activeItem={accessedSection[activeSection]}
      onSectionToggle={handleSectionToggle}
      onItemClick={handleItemClick}
    />
  )
}

export default StepperComponent
