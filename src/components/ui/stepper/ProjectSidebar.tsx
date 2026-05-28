'use client'
import React, { useRef, useState, useEffect } from 'react'
import {
  SidebarContainer,
  ContentContainer,
  StepsContainer,
  InnerContainer,
} from '@/styles/components/ui/sidebar'
import TopDecoration from './TopDecoration'
import BottomDecoration from './BottomDecoration'
import SidebarSection from './SidebarSection'
import { SidebarSectionProps, SidebarItemProps ,ProjectSidebarProps} from '@/types/components/modules/stepper';
import { NUMBERMAP } from '@/constants/common'
import { useRouter } from 'next/navigation'

/**
    Classification : Confidential
**/

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  sections,
  AccessedSection,
  activeSection = 0,
  activeItem = 0,
  onSectionToggle,
  onItemClick,
}) => {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<number[]>([0])

  const [lastActiveItems, setLastActiveItems] = useState<number[]>([
    0, 0, 0, 0, 0,
  ])

  const [currentSection, setCurrentSection] = useState(activeSection)
  const [currentItem, setCurrentItem] = useState(activeItem)

  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const initialLastItems = [...lastActiveItems]
    initialLastItems[activeSection] = activeItem
    setLastActiveItems(initialLastItems)
    setCurrentSection(activeSection)
    setCurrentItem(activeItem)

    if (!expandedSections.includes(activeSection)) {
      setExpandedSections([...expandedSections, activeSection])
    }
  }, [])

  const handleScroll = (direction: 'up' | 'down') => {
    if (contentRef.current) {
      contentRef.current.scrollBy({
        top: direction === 'up' ? -NUMBERMAP.HUNDRED : NUMBERMAP.HUNDRED,
        behavior: 'smooth',
      })
    }
  }

  const handleSectionToggle = (index: number,path:string|null,menu_id:null|number) => {
    const section = sections[index]
    if(!section) return;

    const hasChildren = section?.items && section.items.length > NUMBERMAP.ZERO

    if(!hasChildren && path){
      router.push(path)
    }
    setExpandedSections((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index)
      } else {
        return [...prev, index] // Keep other sections open instead of replacing
      }
    })

    setCurrentSection(index)

    setCurrentItem(lastActiveItems[index])

    if (onSectionToggle) {
      onSectionToggle(index)
    }
  }

  const handleItemClick = (sectionIndex: number, itemIndex: number) => {
    setCurrentSection(sectionIndex)
    setCurrentItem(itemIndex)

    const newLastActiveItems = [...lastActiveItems]
    newLastActiveItems[sectionIndex] = itemIndex
    setLastActiveItems(newLastActiveItems)

    if (!expandedSections.includes(sectionIndex)) {
      setExpandedSections((prev) => [...prev, sectionIndex])
    }

    if (onItemClick) {
      onItemClick(sectionIndex, itemIndex)
    }
  }

  return (
    <SidebarContainer>
      <TopDecoration onClick={() => handleScroll('up')} />

      <ContentContainer ref={contentRef}>
        <StepsContainer>
          <InnerContainer>
            {sections.map((section: SidebarSectionProps, sectionIndex: number) => {
              const activeSectionItem = lastActiveItems[sectionIndex]

              return (
                <SidebarSection
                  key={`${sectionIndex}-${section.title}`}
                  title={section.title}
                  isExpanded={expandedSections.includes(sectionIndex)}
                  isActive={sectionIndex === currentSection}
                  currentSection={currentSection}
                  AccessedSection={AccessedSection}
                  items={section.items?.map((item: SidebarItemProps, itemIndex: number) => ({
                    ...item,
                    isActive:
                      (sectionIndex === currentSection &&
                        itemIndex === currentItem) ??
                      (expandedSections.includes(sectionIndex) &&
                        itemIndex === activeSectionItem),
                  }))}
                  onToggle={() => handleSectionToggle(sectionIndex,section.path?? null,section?.menu_id??null)}
                  onItemClick={(itemIndex) =>
                    handleItemClick(sectionIndex, itemIndex)
                  }
                />
              )
            })}
          </InnerContainer>
        </StepsContainer>
      </ContentContainer>

      <BottomDecoration onClick={() => handleScroll('down')} />
    </SidebarContainer>
  )
}

export default ProjectSidebar
