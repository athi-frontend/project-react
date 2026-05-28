import React from 'react'
import { Typography } from '@mui/material'
import { FeedbackItemProps } from '@/types/components/modules/marketResearch'
import {
  FeedbackContainer,
  FeedbackHeader,
  FeedbackContent,
} from '@/styles/modules/dnd/marketReasearch'

const FeedbackItem: React.FC<FeedbackItemProps> = ({
  createdBy,
  created_date,
  market_feedback,
}) => {
  return (
    <FeedbackContainer>
      <FeedbackHeader>
        <Typography>{createdBy}</Typography>
        <Typography>{created_date}</Typography>
      </FeedbackHeader>
      <FeedbackContent>
        <Typography>{market_feedback}</Typography>
      </FeedbackContent>
    </FeedbackContainer>
  )
}

export default FeedbackItem
