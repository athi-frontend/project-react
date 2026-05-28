'use client'
import React from 'react'
import { AddSquare } from 'iconsax-react'
import { useTheme } from '@mui/material'
import {
  HazardLinkContainer,
  HazardLink,
  HazardLinkDisabled,
  AddHazardIconContainer,
  AddHazardIconContainerDisabled,
} from '@/styles/modules/risk-management/riskAnalysisControl'
import { HazardLinkProps } from '@/types/modules/risk-management/riskAnalysisControl'
import { RISK_CATEGORY_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'
import { NUMBERMAP } from '@/constants/common'

/**
 * HazardLink Component
 * Displays the "Hazards" link with icon for risk category questions
 * Classification: Confidential
 */
const HazardLinkComponent: React.FC<HazardLinkProps> = ({
  onClick,
  onAddHazard,
  disabled = false,
  label = RISK_CATEGORY_CONSTANTS.HAZARDS_LINK_TEXT,
  showAddIcon = true,
}) => {
  const theme = useTheme()

  const handleHazardLinkClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  const handleAddHazardClick = () => {
    if (!disabled && onAddHazard) {
      onAddHazard()
    }
  }

  return (
    <HazardLinkContainer>
      {disabled ? (
        <HazardLinkDisabled onClick={handleHazardLinkClick}>
          {label}
        </HazardLinkDisabled>
      ) : (
        <HazardLink onClick={handleHazardLinkClick}>
          {label}
        </HazardLink>
      )}
      {showAddIcon &&
        (disabled ? (
          <AddHazardIconContainerDisabled onClick={handleAddHazardClick}>
            <AddSquare
              size={NUMBERMAP.TWENTYSEVEN}
              color={theme.palette.text.disabled}
              variant="Bulk"
            />
          </AddHazardIconContainerDisabled>
        ) : (
          <AddHazardIconContainer onClick={handleAddHazardClick}>
            <AddSquare
              size={NUMBERMAP.TWENTYSEVEN}
              color={theme.palette.text.secondary}
              variant="Bulk"
            />
          </AddHazardIconContainer>
        ))}
    </HazardLinkContainer>
  )
}

export default HazardLinkComponent
