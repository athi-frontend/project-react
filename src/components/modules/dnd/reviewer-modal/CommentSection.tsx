import React from 'react'
import { Typography } from '@mui/material'
import {
  CommentWrapper,
  StyledCommentBox,
} from '@/styles/components/modules/reviewerModal'

interface CommentSectionProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const CommentSection: React.FC<CommentSectionProps> = ({ value, onChange }) => {
  return (
    <CommentWrapper>
      <Typography fontSize="18px">
        Comments
      </Typography>
      <StyledCommentBox
        placeholder="Your comment here"
        value={value}
        onChange={onChange}
      />
    </CommentWrapper>
  )
}

export default CommentSection
