import React from 'react'
import { IconWrapper } from '@/styles/components/modules/procurement'
import { CloseIconProps } from '@/types/components/modules/procurement'
import { CloseCircle } from 'iconsax-react'

const CloseIcon: React.FC<CloseIconProps> = ({ onClick }) => {
  return (
    <IconWrapper onClick={onClick}>
      <CloseCircle />
    </IconWrapper>
  )
}

export default CloseIcon
