'use client'

import React from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const TagItemContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',

  marginTop: 'auto',
  marginBottom: 'auto',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '5px',
  paddingBottom: '5px',
  whiteSpace: 'nowrap',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

export interface TagType {
  tag_id: string
  tag_name: string
}

interface TagItemProps {
  tag: TagType
}

const TagItem: React.FC<TagItemProps> = ({ tag }) => {
  return <TagItemContainer>{tag.tag_name}</TagItemContainer>
}

export default TagItem
