import React from 'react'
import { Tooltip, Typography } from '@mui/material'
import { getTooltipStyles, getTooltipArrowStyles, StyledTooltipSpan } from '@/styles/components/ui/toolTip'
import { GenericTooltipProps } from '@/types/components/ui/tooltip'

/**
 * Classification: Confidential
 * Description: Generic tooltip component for data table cells
 */


/**
 * Author: Mayuri
 * Date: 19-09-2025
 * Description: Generic tooltip component for data table cells
 * Classification: Confidential
 */
export const GenericTooltip: React.FC<GenericTooltipProps> = ({
  content, children
}) => {
    return (
    <Tooltip
      title={content}
      arrow
      placement='top-start'
      slotProps={{
        tooltip: {
          sx: getTooltipStyles,
        },
        arrow: {
          sx: getTooltipArrowStyles,
        },
      }}
    >
      <StyledTooltipSpan>
        {children ?? (
          <Typography noWrap>
            {content}
          </Typography>
        )}
      </StyledTooltipSpan>
    </Tooltip>
  )
}

