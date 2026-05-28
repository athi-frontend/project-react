'use client'
import React from 'react'
import { SectionHeaderProps } from '@/types/modules/dnd/hld'
import { HeaderContainer, HeaderTitle } from '@/styles/modules/dnd/hld'

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <HeaderContainer>
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderContainer>
  )
}

export default SectionHeader
