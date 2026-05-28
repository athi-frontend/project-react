'use client'
import React from 'react'
import { Edit } from 'iconsax-react'
import { useTheme } from '@mui/material'
import { NUMBERMAP } from '@/constants/common'
import {
  RiskLevelGridItem,
  CardTitle,
  CardValue,
  CardDescription,
  EditIconContainer,
  CardBottomContainer,
} from '@/styles/modules/risk-management/riskLevelDefinition'
import { RiskLevelCardProps } from '@/types/modules/risk-management/riskLevelDefinition'
const RiskLevelCard: React.FC<RiskLevelCardProps> = ({ level, onEdit, disabled = false }) => {
  const theme = useTheme()

  const handleEdit = () => {
    onEdit(level)
  }

  return (
    <RiskLevelGridItem size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
      <div>
        <CardTitle>{level.title}</CardTitle>
        <CardValue>Value: {level.value}</CardValue>
      </div>
      <CardBottomContainer>
        <CardDescription>{level.description}</CardDescription>
        <EditIconContainer onClick={() => handleEdit()}>
          <Edit size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
        </EditIconContainer>
      </CardBottomContainer>
    </RiskLevelGridItem>
  )
}

export default RiskLevelCard