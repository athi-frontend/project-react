import React from 'react'
import { SourceChipProps } from '@/types/components/modules/marketResearch'
import { StyledChip } from '@/styles/components/ui/dropdown'
const SourceChip: React.FC<SourceChipProps> = ({ label, ...props }) => {
  return <StyledChip label={label} {...props} />
}

export default SourceChip
