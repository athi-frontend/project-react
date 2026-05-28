import React from 'react'
import { IconWrapper } from '@/styles/components/modules/procurement'
import { CloseIconProps } from '@/types/components/modules/procurement'
import CloseIcon from '@mui/icons-material/Close'
const CloseIcons: React.FC<CloseIconProps> = ({ onClick }) => {
  return (
    <IconWrapper onClick={onClick}>
      <CloseIcon />
    </IconWrapper>
  )
}

export default CloseIcons
