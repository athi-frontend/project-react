import React from 'react'
import { Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  SelectWrapper,
  StyledAutocomplete,
  StyledTextField,
  InlineStyles,
} from '@/styles/components/modules/reviewerModal'

interface SelectReviewerProps {
  value: string | null
  onChange: (event: any, newValue: string | null) => void
  error: boolean
  helperText: string | null
}

const reviewers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams']

const SelectReviewer: React.FC<SelectReviewerProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  return (
    <SelectWrapper>
      <Typography fontSize={InlineStyles.reviewerLabel.fontSize} >
        Reviewer*
      </Typography>
      <StyledAutocomplete
        value={value}
        onChange={onChange}
        options={reviewers}
        popupIcon={
          <KeyboardArrowDownIcon sx={InlineStyles.popupIcon} />
        }
        renderInput={(params) => (
          <StyledTextField
            {...params}
            className="Selector_reviewer"
            placeholder="Select Reviewer"
            error={error}
            helperText={helperText}
          />
        )}
      />
    </SelectWrapper>
  )
}

export default SelectReviewer
