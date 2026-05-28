'use client'
import React from 'react'
import {
  DecorationContainer,
  DecorationBase,
  DecorationButton,
  DecorationIconContainer,
} from '@/styles/components/ui/sidebar'
import { DecorationProps } from '@/types/components/modules/stepper'
import { ExpandLess } from '@mui/icons-material'

const BottomDecoration: React.FC<DecorationProps> = ({ onClick }) => {
  return (
    <DecorationContainer>
      <DecorationBase
        onClick={onClick}
        sx={{ transform: 'rotate(3.141592653589793rad)' }}
      >
        <DecorationButton>
          <DecorationIconContainer>
            <ExpandLess />
          </DecorationIconContainer>
        </DecorationButton>
      </DecorationBase>
    </DecorationContainer>
  )
}

export default BottomDecoration
