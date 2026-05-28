'use client'
import React from 'react'
import { SectionHeaderProps } from '@/types/modules/dnd/hld'
import { HeaderContainer, HeaderTitle } from '@/styles/modules/regulation/executiveSummary'

const SubHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <HeaderContainer>
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderContainer>
  )
}

export default SubHeader
